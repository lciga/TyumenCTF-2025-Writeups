use actix_files::{Files, NamedFile};
use actix_web::dev::{fn_service, ServiceRequest, ServiceResponse};
use actix_web::web;

pub(crate) fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        Files::new("/", "./dist")
            .index_file("index.html")
            .default_handler(fn_service(|req: ServiceRequest| async {
                let (req, _) = req.into_parts();
                let file = NamedFile::open_async("./dist/index.html").await?;
                let res = file.into_response(&req);

                Ok(ServiceResponse::new(req, res))
            })),
    );
}
