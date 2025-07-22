FROM rust:1.86-alpine3.20 AS builder

RUN apk add --no-cache musl-dev

RUN cargo new --bin /app
COPY Cargo.toml Cargo.lock /app/

WORKDIR /app
RUN cargo build --release

COPY . .
RUN touch src/main.rs
RUN cargo build --release

FROM scratch

COPY --from=builder /app/target/release/kaboom /kaboom

CMD ["/kaboom"]
EXPOSE 8080
