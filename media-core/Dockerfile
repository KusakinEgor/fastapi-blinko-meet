FROM rust:1.75 AS planner

WORKDIR /app

RUN cargo install cargo-chef

COPY . .

RUN cargo chef prepare --recipe-path recipe.json

FROM rust:1.75 AS builder

WORKDIR /app

RUN cargo install cargo-chef

COPY --from=planner /app/recipe.json recipe.json

RUN cargo chef cook --release --recipe-path recipe.json

COPY . .

RUN cargo build --release

FROM debian:bookworm-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
	libssl-dev \
	ca-certificates \
	&& rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/target/release/media-core /app/media-core

CMD ["./media-core"]
