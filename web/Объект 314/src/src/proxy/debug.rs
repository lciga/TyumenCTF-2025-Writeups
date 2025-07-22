use core::error::Error;

use actix_proxy::IntoHttpResponse;
use actix_web::http::Method;
use actix_web::{web, HttpRequest, HttpResponse};
use awc::body::MessageBody;

#[derive(thiserror::Error, Clone, Debug)]
enum Fucken {
    #[error("Shit happened")]
    Fucken,
}

async fn proxy(
    path: web::Path<String>,
    method: Method,
    req: HttpRequest,
    stream: web::Payload,
    body: web::Bytes,
) -> Result<HttpResponse, Box<dyn Error>> {
    let proxy_path = format!("http://localhost:1234/{}", path.as_ref());

    let client = awc::Client::new();

    let proxy_method = match method {
        Method::GET => awc::http::Method::GET,
        Method::POST => awc::http::Method::POST,
        Method::PUT => awc::http::Method::PUT,
        Method::DELETE => awc::http::Method::DELETE,
        Method::HEAD => awc::http::Method::HEAD,
        Method::OPTIONS => awc::http::Method::OPTIONS,
        Method::CONNECT => awc::http::Method::CONNECT,
        Method::PATCH => awc::http::Method::PATCH,
        Method::TRACE => awc::http::Method::TRACE,
        wtf => {
            dbg!(wtf);

            unimplemented!()
        }
    };

    if req
        .headers()
        .get("Connection")
        .map(|header| Ok::<_, Box<dyn Error>>(header.to_str()?.contains("Upgrade")))
        .transpose()?
        .unwrap_or(false)
    {
        actix_ws_proxy::start(&req, proxy_path.replace("http://", "ws://"), stream)
            .await
            .map_err(|err| err.into())
    } else {
        let request = client.request(proxy_method, &proxy_path);
        let request = req.headers().iter().try_fold(request, |request, (k, v)| {
            Ok::<_, Box<dyn Error>>(request.append_header((k.as_str(), v.to_str()?)))
        })?;

        Ok(request
            .send_body(body.try_into_bytes().map_err(|_| Fucken::Fucken)?)
            .await?
            .into_http_response())
    }
}

pub(crate) fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::resource("/{path:.*}")
            .route(web::post().to(proxy))
            .route(web::get().to(proxy)),
    );
}
