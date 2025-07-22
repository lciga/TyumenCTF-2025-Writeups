use core::error::Error;
use core::future;
use std::io;
use std::path::{Path, PathBuf};
use std::sync::LazyLock;

use actix_files::Files;
use actix_web::http::StatusCode;
use actix_web::web::{self, Payload, PayloadConfig};
use actix_web::{middleware, App, HttpResponse, HttpServer, Responder};
use flexi_logger::Logger;
use futures::StreamExt;
use maud::html;
use serde::Deserialize;
use tokio::fs::{self, File};
use tokio::io::{AsyncWriteExt, BufWriter};
use tokio::sync::Mutex;
use tokio_stream::wrappers::ReadDirStream;

static ID_MUTEX: LazyLock<Mutex<()>> = LazyLock::new(|| Mutex::new(()));

async fn find_available_id(upload_dir: &Path) -> Result<u64, io::Error> {
    let kek = ReadDirStream::new(fs::read_dir(&upload_dir).await?)
        .then(|entry| async {
            match entry {
                Ok(entry) => {
                    let file_type = entry.file_type().await?;
                    let file_name = PathBuf::from(entry.file_name());

                    Ok((entry, file_name, file_type))
                }
                Err(err) => Err(err),
            }
        })
        .filter(|entry| {
            future::ready(
                entry
                    .as_ref()
                    .map(|entry| entry.2.is_file())
                    .unwrap_or(false),
            )
        })
        .map(|entry| {
            entry.map(|entry| {
                entry
                    .1
                    .file_stem()
                    .map(|stem| stem.to_string_lossy().into_owned())
                    .and_then(|stem| stem.split("-").last().map(|s| s.to_owned()))
                    .and_then(|stem| stem.parse::<u64>().ok())
            })
        })
        .filter_map(|entry| {
            future::ready(match entry {
                Ok(Some(id)) => Some(id),
                _ => None,
            })
        })
        .collect::<Vec<_>>()
        .await;

    let max_id = kek.into_iter().max();

    Ok(max_id.unwrap_or(100500 - 1) + 1)
}

#[actix_web::post("/upload/{filename}")]
async fn upload(
    filename: web::Path<String>,
    mut payload: Payload,
) -> Result<impl Responder, Box<dyn Error>> {
    let upload_dir = PathBuf::from("./var");
    let filename = Path::new(&*filename);

    let id_lock = ID_MUTEX.lock().await;
    let upload_id = find_available_id(&*&upload_dir).await?;

    let upload_filename = format!(
        "{}{}{}",
        filename
            .file_stem()
            .map(|s| format!("{}-", s.to_string_lossy()))
            .unwrap_or("".to_string()),
        upload_id,
        filename
            .extension()
            .map(|s| format!(".{}", s.to_string_lossy()))
            .unwrap_or("".to_string())
    );

    let file = File::create(format!("./var/{upload_filename}")).await?;
    let mut buf_writer = BufWriter::new(file);

    drop(id_lock);

    while let Some(maybe_bytes) = payload.next().await {
        let bytes = maybe_bytes?;
        buf_writer.write_all(&*bytes).await?;
    }

    buf_writer.flush().await?;

    Ok(HttpResponse::build(StatusCode::OK)
        .content_type("text/html")
        .body(
            html! {
                body {
                    "File uploaded successfuly!"
                    a href=(format!("/files/{upload_filename}")) { "View" }
                }
            }
            .into_string(),
        ))
}

#[derive(Deserialize)]
struct ListQuery {
    page: Option<u64>,
}

#[actix_web::get("/files")]
async fn files(query: web::Query<ListQuery>) -> Result<impl Responder, Box<dyn Error>> {
    let mut files = ReadDirStream::new(fs::read_dir("./var").await?)
        .then(|file| async {
            match file {
                Ok(file) => file.metadata().await.map(|meta| (file, meta)),
                Err(err) => Err(err),
            }
        })
        .collect::<Vec<_>>()
        .await
        .into_iter()
        .collect::<Result<Vec<_>, _>>()?;

    files.sort_by(|a, b| a.1.created().unwrap().cmp(&b.1.created().unwrap()));

    let page_size = 3;
    let page = query.page.unwrap_or(0);
    let shown_files =
        files.get((page as usize) * page_size..((page as usize + 1) * page_size).min(files.len()));

    match shown_files {
        Some(shown_files) => Ok(HttpResponse::build(StatusCode::OK).body(
            html! {
                body {
                    @for file in shown_files {
                        div {
                            a href=(format!("/files/{}", file.0.file_name().to_string_lossy())) { (file.0.file_name().to_string_lossy()) }
                        }
                    }
                    @if page > 0 {
                        div {
                            a href=(format!("/files?page={}", page - 1))  { "Prev" }
                        }
                    }
                    @if files.len() > (page as usize + 1) * page_size {
                        div {
                            a href=(format!("/files?page={}", page + 1)) { "Next" }
                        }
                    }
                }
            }
            .into_string(),
        )),
        None => Ok(HttpResponse::new(StatusCode::NOT_FOUND))
    }
}

#[actix_web::main]
async fn main() -> Result<(), io::Error> {
    Logger::try_with_env_or_str("debug")
        .unwrap()
        .start()
        .unwrap();

    HttpServer::new(move || {
        App::new()
            .app_data(PayloadConfig::default().limit(100 * 2usize.pow(20)))
            .wrap(middleware::Logger::default())
            .service(upload)
            // .service(files)
            .service(Files::new("/files/", "./var"))
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}
