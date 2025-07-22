use actix_web::web;

pub(crate) mod classified;
pub(crate) mod user;

pub(crate) fn config(cfg: &mut web::ServiceConfig) {
    cfg.configure(user::config);
    cfg.configure(classified::config);
}
