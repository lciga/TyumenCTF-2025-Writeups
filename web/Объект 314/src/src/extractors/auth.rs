use core::future::{self, Ready};

use actix_web::{web, FromRequest, HttpResponse, ResponseError};
use awc::http::StatusCode;
use serde::Serialize;

use crate::security::jwt;
use crate::Config;

#[derive(thiserror::Error, Clone, Debug, Serialize)]
pub(crate) enum JwtClaimsError {
    #[error("Missing JWT token")]
    MissingToken,
    #[error("Invalid JWT token")]
    InvalidToken,
}

impl ResponseError for JwtClaimsError {
    fn error_response(&self) -> actix_web::HttpResponse {
        HttpResponse::build(StatusCode::UNAUTHORIZED)
            .content_type("application/json")
            .body(serde_json::to_string(self).unwrap())
    }

    fn status_code(&self) -> StatusCode {
        StatusCode::UNAUTHORIZED
    }
}

pub(crate) struct JwtClaims {
    pub username: String,
}

impl FromRequest for JwtClaims {
    type Error = JwtClaimsError;

    type Future = Ready<Result<Self, Self::Error>>;

    fn from_request(
        req: &actix_web::HttpRequest,
        _payload: &mut actix_web::dev::Payload,
    ) -> Self::Future {
        future::ready((|| {
            let config = req.app_data::<web::Data<Config>>().unwrap();

            let session = req.cookie("session").ok_or(JwtClaimsError::MissingToken)?;

            let username = jwt::extract_username(session.value(), config)
                .ok_or(JwtClaimsError::InvalidToken)?;

            Ok(Self { username })
        })())
    }
}
