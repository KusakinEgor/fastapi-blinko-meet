<h1 align="center" style="display: block; font-size: 2.5em; font-weight: bold; margin-block-start: 1em; margin-block-end: 1em;">
  <a name="logo">
    <img src="pictures/logo.png" alt="URL Inspector" style="width:350px;height:350px"/>
  </a>
  <br /><br />
  <strong>BlinkoMeet</strong>
</h1>

<p align="center">
  <em><b>BlinkoMeet</b> — это веб-сервис для видеоконференций, который позволяет проводить видеозвонки, голосовое общение, обмен сообщениями и демонстрацию экрана прямо в браузере, используя <b>FastAPI</b>, <b>Rust</b> и <b>WebRTC</b></em>
</p>

---

## Содержание
- [О проекте](#о-проекте)
- [Функции](#функции)
- [Скриншоты](#скриншоты)
- [Демонстрация](#демонстрация)
- [Технологии](#технологии)
- [Установка](#установка)
- [Использование](#использование)
- [Как помочь проекту](#как-помочь-проекту)
- [Лицензия](#лицензия)

---

## О проекте
write about project

---

## Функции

- Peer-to-Peer & SFU: Стабильные видеозвонки один на одни и групповые конференции.
- Демонстрация экрана: Делитесь презентациями внутри комнаты.
- Real-time чат: Обмен текстовыми сообщениями внутри комнаты.
- Адаптивный битрейт: Автоматическая подстройка качества видео под ширину канала.

---

## Демонстрация

---

## Технологии

- Frontend: React, Tailwind CSS, WebRTC API, Lucide Icons.
- Backend (API): FastAPI, PostgreSQL (SQLAlchemy).
- Signaling/Media Server: Rust - для управления потоками и состоянием комнат.

---

## Установка

1. Клонирование репозитория

```bash
git clone https://github.com/KusakinEgor/fastapi-blinko-meet.github
cd fastapi-blinko-meet
```

2. Настройка бэкенда:

```bash
# Настройка Python окружения через Poetry
cd backend
poetry install
poetry shell

# Запуск Rust-компонента (сигнальный сервер)
cd media-core
cargo run
```

- ОБНОВИТЬ .env ПО ПРИМЕРУ .env.example

3. Настройка фронтенда:

```bash
cd frontend
npm install
```

---

## Использование

1. Запустить сервера:
- Запустите FastAPI: uvicorn app.main:app --reload
- Запустить сигнальный сервер Rust: cargo run
- Запустить фронтенд: npm run dev

---

## Скриншоты
make screenshots
