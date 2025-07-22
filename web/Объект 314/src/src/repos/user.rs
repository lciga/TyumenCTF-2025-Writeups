use std::sync::Arc;

use crate::models::user::User;
use sqlx::PgPool;

#[derive(Clone)]
pub(crate) struct UserRepo {
    pool: Arc<PgPool>,
}

impl UserRepo {
    pub fn new(pool: Arc<PgPool>) -> Self {
        UserRepo { pool }
    }

    pub async fn get_by_username(&self, email: &str) -> Result<Option<User>, sqlx::Error> {
        let maybe_user = sqlx::query_as!(User, "SELECT * FROM users WHERE username = $1", email)
            .fetch_optional(&*self.pool)
            .await?;

        Ok(maybe_user)
    }

    pub async fn create(&self, user: &User) -> Result<(), sqlx::Error> {
        sqlx::query!(
            "INSERT INTO users (id, username, password) VALUES ($1, $2, $3)",
            user.id,
            user.username,
            user.password
        )
        .execute(&*self.pool)
        .await?;

        Ok(())
    }
}
