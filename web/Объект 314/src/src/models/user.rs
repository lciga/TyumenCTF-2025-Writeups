use uuid::Uuid;

pub(crate) struct User {
    pub id: Uuid,
    pub username: String,
    pub password: String,
    pub is_admin: bool,
}

impl User {
    pub fn new(username: String, password: String) -> Self {
        Self {
            id: Uuid::new_v4(),
            username,
            password,
            is_admin: false,
        }
    }
}
