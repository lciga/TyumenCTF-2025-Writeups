use argon2::password_hash::SaltString;
use hmac::Hmac;
use sha2::Sha256;

pub(crate) struct Config {
    pub password_salt: SaltString,
    pub jwt_secret: Hmac<Sha256>,
    pub ssh_addr: String,
    pub ssh_user: String,
    pub ssh_password: String,
}
