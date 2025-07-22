use core::error::Error;

use totp_rs::{Algorithm, Secret, TOTP};

use crate::models::user::User;

fn get_two_factor_secret(user: &User) -> String {
    format!("{}_n0_on3_w1ll_3v3r_9u3ss", user.username)
}

pub(crate) fn create_totp_for_user(user: &User) -> Result<TOTP, Box<dyn Error>> {
    Ok(TOTP::new(
        Algorithm::SHA1,
        6,
        1,
        30,
        Secret::Raw(get_two_factor_secret(user).into_bytes())
            .to_encoded()
            .to_bytes()?,
        None,
        user.username.clone(),
    )?)
}

pub(crate) fn verify_two_factor(code: &str, user: &User) -> Result<bool, Box<dyn Error>> {
    let totp = create_totp_for_user(user)?;

    Ok(totp.check_current(code)?)
}
