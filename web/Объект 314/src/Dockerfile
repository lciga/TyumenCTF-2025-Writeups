FROM node:23-alpine3.20 AS front-builder

WORKDIR /app

COPY frontend/package.json frontend/yarn.lock /app/
RUN yarn

COPY frontend /app
RUN yarn build

FROM rust:1.86-alpine3.20 AS builder

RUN apk add --no-cache musl-dev openssl-dev openssl-libs-static

RUN cargo new --bin /app
COPY Cargo.toml Cargo.lock /app/

WORKDIR /app
RUN cargo build --release

COPY . .
RUN touch src/main.rs
RUN SQLX_OFFLINE=1 cargo build --release

FROM scratch

COPY --from=builder /app/target/release/totp /
COPY --from=front-builder /app/dist /dist

CMD ["/totp"]
EXPOSE 8080

