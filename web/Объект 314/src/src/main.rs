use core::error::Error;
use std::env;
use std::sync::Arc;

use actix_web::{web, App, HttpServer};
use argon2::password_hash::SaltString;
use flexi_logger::Logger;
use hmac::digest::KeyInit;
use hmac::Hmac;
use sqlx::postgres::PgPoolOptions;
use sqlx::PgPool;

use crate::config::Config;
use crate::repos::user::UserRepo;

pub(crate) mod config;
pub(crate) mod extractors;
pub(crate) mod middleware;
pub(crate) mod models;
#[cfg(debug_assertions)]
#[path = "./proxy/debug.rs"]
pub(crate) mod proxy;
#[cfg(not(debug_assertions))]
#[path = "./proxy/release.rs"]
pub(crate) mod proxy;
pub(crate) mod repos;
pub(crate) mod security;
pub(crate) mod views;

#[cfg(not(debug_assertions))]
async fn migrate(pool: &PgPool) -> Result<(), Box<dyn Error>> {
    sqlx::migrate!("./migrations").run(pool).await?;

    Ok(())
}

#[cfg(debug_assertions)]
async fn migrate(_pool: &PgPool) -> Result<(), Box<dyn Error>> {
    Ok(())
}

#[actix_web::main]
async fn main() -> Result<(), Box<dyn Error>> {
    dotenv::dotenv().ok();

    let database_url = env::var("DATABASE_URL")?;
    let ssh_addr = env::var("SSH_ADDR")?;
    let ssh_user = env::var("SSH_USER")?;
    let ssh_password = env::var("SSH_PASSWORD")?;

    let pool = Arc::new(
        PgPoolOptions::new()
            // .connect("postgres://totp:totp@localhost:5432/totp")
            .connect(&*database_url)
            .await?,
    );

    migrate(&pool).await?;

    let user_repo = web::Data::new(UserRepo::new(pool.clone()));
    let config = web::Data::new(Config {
        password_salt: SaltString::from_b64("aSBhbSB2ZXJ5IGdheQo")?,
        jwt_secret: Hmac::new_from_slice(b"super-secret-stuff")?,
        ssh_addr,
        ssh_user,
        ssh_password,
    });

    Logger::try_with_env_or_str("debug")
        .unwrap()
        .start()
        .unwrap();

    HttpServer::new(move || {
        App::new()
            .wrap(actix_web::middleware::Logger::default())
            .app_data(user_repo.clone())
            .app_data(config.clone())
            .service(web::scope("/api/v1").configure(views::config))
            .configure(proxy::config)
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await?;

    Ok(())
}
