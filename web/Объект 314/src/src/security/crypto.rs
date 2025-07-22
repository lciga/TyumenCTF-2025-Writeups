use argon2::password_hash::{self, PasswordHasher};
use argon2::{Argon2, PasswordHash, PasswordVerifier};

use crate::Config;

pub(crate) fn hash_password(
    password: &str,
    config: &Config,
) -> Result<String, password_hash::Error> {
    Ok(Argon2::default()
        .hash_password(password.as_bytes(), &config.password_salt)?
        .to_string())
}

pub(crate) fn verify_password(password: &str, hash: &str) -> Result<bool, password_hash::Error> {
    match Argon2::default().verify_password(password.as_bytes(), &PasswordHash::new(hash)?) {
        Err(password_hash::Error::Password) => Ok(false),
        Err(err) => Err(err),
        Ok(_) => Ok(true),
    }
}
