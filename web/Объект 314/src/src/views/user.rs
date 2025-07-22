use core::error::Error;

use actix_web::cookie::Cookie;
use actix_web::error::InternalError;
use actix_web::http::StatusCode;
use actix_web::web::{self, Json};
use actix_web::{Either, HttpResponse};
use serde::{Deserialize, Serialize};

use crate::extractors::auth::JwtClaims;
use crate::models::user::User;
use crate::security::jwt::sign_session_header;
use crate::security::totp::create_totp_for_user;
use crate::security::{crypto, totp};
use crate::{Config, UserRepo};

#[derive(Serialize, Deserialize, Clone, Debug)]
struct LoginRequest {
    username: String,
    password: String,
    two_factor_code: Option<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
enum LoginResponse {
    Ok,
    TwoFactorRequired,
    InvalidCredentials,
    InvalidTwoFactor,
}

#[actix_web::post("/login")]
pub(crate) async fn login(
    request: Json<LoginRequest>,
    user_repo: web::Data<UserRepo>,
    config: web::Data<Config>,
) -> actix_web::Result<Either<HttpResponse, (Json<LoginResponse>, StatusCode)>> {
    let user = user_repo.get_by_username(&*request.username).await;

    let user = match user {
        Ok(Some(user)) => user,
        Ok(None) => {
            return Ok(Either::Right((
                Json(LoginResponse::InvalidCredentials),
                StatusCode::UNAUTHORIZED,
            )))
        }
        Err(_) => return Ok(Either::Left(HttpResponse::InternalServerError().finish())),
    };

    if !crypto::verify_password(&*request.password, &*user.password)
        .map_err(|err| InternalError::new(err, StatusCode::INTERNAL_SERVER_ERROR))?
    {
        return Ok(Either::Right((
            Json(LoginResponse::InvalidCredentials),
            StatusCode::UNAUTHORIZED,
        )));
    }

    let two_factor_code = if let Some(code) = &request.two_factor_code {
        code
    } else {
        return Ok(Either::Right((
            Json(LoginResponse::TwoFactorRequired),
            StatusCode::UNAUTHORIZED,
        )));
    };

    if !totp::verify_two_factor(&*two_factor_code, &user)? {
        return Ok(Either::Right((
            Json(LoginResponse::InvalidTwoFactor),
            StatusCode::UNAUTHORIZED,
        )));
    }

    Ok(Either::Left(
        HttpResponse::build(StatusCode::OK)
            .append_header(("Set-Cookie", sign_session_header(&user, &config)?))
            .content_type("application/json")
            .body(serde_json::to_string(&LoginResponse::Ok)?),
    ))
}

#[derive(Serialize, Deserialize, Clone, Debug)]
struct RegisterRequest {
    username: String,
    password: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
enum RegisterResponse {
    Ok {
        two_factor_url: String,
        two_factor_qr: String,
    },
    AlreadyExists,
}

#[actix_web::post("/register")]
pub(crate) async fn register(
    request: Json<RegisterRequest>,
    user_repo: web::Data<UserRepo>,
    config: web::Data<Config>,
) -> Result<(Json<RegisterResponse>, StatusCode), Box<dyn Error>> {
    let existing_user = user_repo.get_by_username(&*request.username).await?;

    if let Some(_) = existing_user {
        return Ok((Json(RegisterResponse::AlreadyExists), StatusCode::CONFLICT));
    }

    let user = User::new(
        request.username.clone(),
        crypto::hash_password(&*request.password, &config)?,
    );
    user_repo.create(&user).await?;

    let totp = create_totp_for_user(&user)?;

    let url = totp.get_url();
    let qr = format!("data:image/png;base64,{}", totp.get_qr_base64()?);

    Ok((
        Json(RegisterResponse::Ok {
            two_factor_url: url,
            two_factor_qr: qr,
        }),
        StatusCode::CREATED,
    ))
}

#[actix_web::post("/logout")]
pub(crate) async fn logout() -> HttpResponse {
    let cookie = Cookie::build("session", "nonono")
        .http_only(true)
        .path("/")
        .finish()
        .to_string();

    HttpResponse::build(StatusCode::OK)
        .append_header(("Set-Cookie", cookie))
        .finish()
}

#[derive(Serialize, Deserialize, Clone, Debug)]
struct GetUserResponse {
    username: String,
}

#[actix_web::get("/{username}")]
pub(crate) async fn show(
    username: web::Path<String>,
    user_repo: web::Data<UserRepo>,
) -> actix_web::Result<Either<HttpResponse, Json<GetUserResponse>>> {
    let user = user_repo.get_by_username(&*username).await;

    let user = match user {
        Ok(user) => user,
        Err(_) => return Ok(Either::Left(HttpResponse::InternalServerError().finish())),
    };

    Ok(match user {
        None => Either::Left(HttpResponse::NotFound().finish()),
        Some(user) => Either::Right(Json(GetUserResponse {
            username: user.username,
        })),
    })
}

#[derive(Serialize, Deserialize, Clone, Debug)]
struct GetMeResponse {
    username: String,
    is_admin: bool,
}

#[actix_web::get("/me")]
pub(crate) async fn me(
    jwt: JwtClaims,
    user_repo: web::Data<UserRepo>,
) -> Result<Either<Json<GetMeResponse>, HttpResponse>, Box<dyn Error>> {
    let user = user_repo.get_by_username(&*jwt.username).await?;

    Ok(match user {
        Some(user) => Either::Left(Json(GetMeResponse {
            username: jwt.username,
            is_admin: user.is_admin,
        })),
        None => Either::Right(HttpResponse::new(StatusCode::NOT_FOUND)),
    })
}

pub(crate) fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/users")
            .service(login)
            .service(register)
            .service(logout)
            .service(me)
            .service(show),
    );
}
