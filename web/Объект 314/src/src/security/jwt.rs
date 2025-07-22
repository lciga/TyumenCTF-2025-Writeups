use core::error::Error;
use std::collections::BTreeMap;

use actix_web::cookie::time::{Duration, OffsetDateTime};
use actix_web::cookie::Cookie;
use jwt::{SignWithKey, VerifyWithKey};

use crate::models::user::User;
use crate::Config;

pub(crate) fn sign_auth_token(user: &User, config: &Config) -> Result<String, Box<dyn Error>> {
    let mut claims = BTreeMap::new();
    claims.insert("sub", &*user.username);

    Ok(claims.sign_with_key(&config.jwt_secret)?)
}

pub(crate) fn sign_session_header(user: &User, config: &Config) -> Result<String, Box<dyn Error>> {
    Ok(Cookie::build("session", sign_auth_token(user, config)?)
        .http_only(true)
        .path("/")
        .expires(OffsetDateTime::now_utc() + Duration::days(4))
        .finish()
        .to_string())
}

pub(crate) fn extract_username(token: &str, config: &Config) -> Option<String> {
    let claims: Option<BTreeMap<String, String>> = token.verify_with_key(&config.jwt_secret).ok();

    claims.and_then(|claims| claims.get("sub").map(|sub| sub.to_owned()))
}
