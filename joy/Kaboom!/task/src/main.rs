use core::error::Error;
use core::sync::atomic::{AtomicU64, Ordering};
use core::time::Duration;
use std::{env, io};

use actix_web::rt::time;
use actix_web::{middleware, rt, web, App, HttpRequest, HttpResponse, HttpServer};
use actix_ws::Message;
use defer::defer;
use flexi_logger::Logger;
use futures::StreamExt;
use morse_codec::encoder::{Encoder, SDM};
use tokio::sync::watch;

#[cfg(debug_assertions)]
#[path = "static_service/debug.rs"]
pub(crate) mod static_service;
#[cfg(not(debug_assertions))]
#[path = "static_service/release.rs"]
pub(crate) mod static_service;
pub(crate) mod util;

static ONLINE_CONNECTIONS: AtomicU64 = AtomicU64::new(0);

#[actix_web::get("/beep")]
async fn beep(
    req: HttpRequest,
    stream: web::Payload,
    rx: web::Data<watch::Receiver<bool>>,
) -> Result<HttpResponse, actix_web::Error> {
    let (res, mut session, mut stream) = actix_ws::handle(&req, stream)?;
    let mut rx = (**rx).clone();

    rt::spawn(async move {
        let conn_info = req.connection_info();
        let peer_addr = conn_info.realip_remote_addr().unwrap_or("unknown");

        let online_connections = ONLINE_CONNECTIONS.fetch_add(1, Ordering::Relaxed) + 1;

        log::debug!(
            "Client connected: {}. Online connections: {}",
            peer_addr,
            online_connections
        );

        let _deferred = defer(|| {
            let online_connections = ONLINE_CONNECTIONS.fetch_sub(1, Ordering::Relaxed) - 1;

            log::debug!(
                "Client disconnected: {}. Online connections: {}",
                peer_addr,
                online_connections
            );
        });

        loop {
            tokio::select! {
                Some(msg) = stream.next() => match msg {
                    Ok(Message::Ping(msg)) => session.pong(&msg).await?,
                    Err(_) => return Ok::<(), Box<dyn Error>>(()),
                    _ => {},
                },
                Ok(_) = rx.changed() => {
                    let state = rx.borrow();
                    session.text(state.to_string()).await?;
                },
            }
        }
    });

    Ok(res)
}

async fn send_beeps(tx: watch::Sender<bool>, flag: String, dot_duration: Duration) {
    let mut encoder = Encoder::<256>::new()
        .with_message(&*format!("{}  ", flag), true)
        .build();
    encoder.encode_message_all();

    let sdms = encoder
        .get_encoded_message_as_sdm_arrays()
        .flatten()
        .map(|sdm| sdm.into_iter())
        .flatten()
        .filter(|sdm| !matches!(sdm, SDM::Empty))
        .collect::<Vec<_>>();

    loop {
        for sdm in &sdms {
            let (interval, is_high) = match sdm {
                SDM::High(int) => (*int, true),
                SDM::Low(int) => (*int, false),
                _ => continue,
            };

            tx.send(is_high).unwrap();

            time::sleep(dot_duration * interval as u32).await;
        }
    }
}

#[actix_web::main]
async fn main() -> Result<(), io::Error> {
    Logger::try_with_env_or_str("debug")
        .unwrap()
        .start()
        .unwrap();

    let flag = env::var("FLAG").expect("env variable `FLAG` should contain... yknow... a flag");
    let dot_duration = Duration::from_millis(
        env::var("DOT_DURATION")
            .expect("env variable `DOT_DURATION` should contain... dot duration in milliseconds")
            .parse()
            .expect("don't you know how to write numbers?"),
    );

    let (beep_tx, beep_rx) = watch::channel(false);

    rt::spawn(send_beeps(beep_tx, flag, dot_duration));

    let shared_rx = web::Data::new(beep_rx);

    HttpServer::new(move || {
        App::new()
            .wrap(middleware::Logger::default())
            .app_data(shared_rx.clone())
            .service(beep)
            .service(static_service::get_static_service())
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}
