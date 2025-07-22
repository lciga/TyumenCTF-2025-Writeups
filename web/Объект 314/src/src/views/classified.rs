use core::error::Error;
use std::sync::Arc;

use actix_web::{rt, web, HttpRequest, HttpResponse};
use actix_ws::AggregatedMessage;
use awc::http::StatusCode;
use futures::StreamExt;
use russh::keys::ssh_key;
use russh::{client, ChannelMsg};
use serde::{Deserialize, Serialize};
use tokio::io::AsyncWriteExt;

use crate::extractors::auth::JwtClaims;
use crate::{Config, UserRepo};

struct Client {}

impl client::Handler for Client {
    type Error = russh::Error;

    async fn check_server_key(
        &mut self,
        _server_public_key: &ssh_key::PublicKey,
    ) -> Result<bool, Self::Error> {
        Ok(true)
    }
}

#[derive(Serialize, Deserialize, Clone, Debug)]
enum TerminalCommand {
    SetSize { width: u16, height: u16 },
    Write { data: String },
}

#[derive(Serialize, Deserialize, Clone, Debug)]
struct TerminalUpdate {
    screen: String,
    cursor: (u16, u16),
}

#[actix_web::get("/terminal")]
pub(crate) async fn terminal(
    req: HttpRequest,
    stream: web::Payload,
    config: web::Data<Config>,
    jwt: JwtClaims,
    user_repo: web::Data<UserRepo>,
) -> Result<HttpResponse, Box<dyn Error>> {
    let user = user_repo.get_by_username(&*jwt.username).await?;

    if !user.map(|user| user.is_admin).unwrap_or(false) {
        return Ok(HttpResponse::new(StatusCode::UNAUTHORIZED));
    }

    let (res, mut session, stream) = actix_ws::handle(&req, stream)?;

    let mut stream = stream
        .aggregate_continuations()
        .max_continuation_size(2_usize.pow(20));

    rt::spawn(async move {
        let mut parser = vt100::Parser::new(32, 64, 0);

        let mut ssh_session =
            client::connect(Arc::new(Default::default()), &*config.ssh_addr, Client {}).await?;

        ssh_session
            .authenticate_password(&*config.ssh_user, &config.ssh_password)
            .await?;

        let mut channel = ssh_session.channel_open_session().await?;

        channel
            .request_pty(false, "xterm", 80, 25, 0, 0, &[])
            .await?;

        channel.exec(true, "/bin/bash").await?;

        let mut channel_writer = channel.make_writer();

        loop {
            tokio::select! {
                Some(msg) = stream.next() => {
                    match msg {
                        Ok(AggregatedMessage::Text(text)) => {
                            let command: TerminalCommand = serde_json::from_str(&*text)?;

                            match command {
                                TerminalCommand::SetSize { width, height } => {
                                    parser.set_size(height, width);
                                    channel.window_change(width as u32, height as u32, 0, 0).await?;
                                }

                                TerminalCommand::Write { data } => {
                                    channel_writer.write_all(data.as_bytes()).await?
                                }
                            }
                        }

                        Ok(AggregatedMessage::Ping(msg)) => {
                            session.pong(&msg).await.unwrap();
                        }

                        _ => {
                            return Ok(())
                        }
                    }
                },
                Some(msg) = channel.wait() => {
                    match msg {
                        ChannelMsg::Data { data } => {
                            parser.process(data.as_ref());

                            let update = TerminalUpdate {
                                screen: parser.screen().contents(),
                                cursor: parser.screen().cursor_position(),
                            };

                            session.text(&*serde_json::to_string(&update)?).await?;
                        }

                        ChannelMsg::ExitStatus { exit_status } => {
                            let update = TerminalUpdate {
                                screen: format!("Process exited with code {}", exit_status),
                                cursor: (0, 1),
                            };

                            session.text(&*serde_json::to_string(&update)?).await?;
                            return Ok::<_, Box<dyn Error>>(())
                        }
                        _ => {}
                    }
                },
            }
        }
    });

    Ok(res)
}

pub(crate) fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/classified").service(terminal));
}
