use actix_embed::{DefaultFallbackHandler, Embed};
use rust_embed::RustEmbed;

#[cfg(not(debug_assertions))]
#[derive(RustEmbed)]
#[folder = "./public/"]
pub(crate) struct Public;

pub(crate) fn get_static_service() -> Embed<Public, DefaultFallbackHandler> {
    Embed::new("/", &Public).index_file("index.html")
}
