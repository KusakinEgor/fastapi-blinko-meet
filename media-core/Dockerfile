# ЭТАП 1: Планирование кэша зависимостей
FROM lukemathwalker/cargo-chef:latest-rust-1.75 AS planner
WORKDIR /app
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

FROM lukemathwalker/cargo-chef:latest-rust-1.75 AS builder
WORKDIR /app
COPY --from=planner /app/recipe.json recipe.json

RUN apt-get update && apt-get install -y --no-install-recommends \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

ENV CARGO_BUILD_JOBS=1

RUN cargo chef cook --release --recipe-path recipe.json

COPY . .
RUN cargo build --release && \
    strip target/release/media-core

FROM debian:bookworm-slim
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libssl3 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/target/release/media-core /app/media-core

EXPOSE 3000

CMD ["./media-core"]

