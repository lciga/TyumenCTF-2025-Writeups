use actix_files::Files;

pub(crate) fn get_static_service() -> Files {
    Files::new("/", "./public").index_file("index.html")
}
