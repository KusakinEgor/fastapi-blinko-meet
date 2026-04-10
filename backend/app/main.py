from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.db import engine

from app.routing.auth import router as auth_router
from app.routing.rooms import router as rooms_router
from app.routing.media import router as media_router
from app.routing.admin import router as admin_router
from app.routing.chat import router as chat_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    await engine.dispose()

app = FastAPI(
        title="Blinko-Meet API",
        description="API for control rooms and video-connection",
        version="1.0.0",
        contact={
            "name": "Egor",
            "url": "https://github.com/KusakinEgor"
        },
        lifespan=lifespan
)

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(rooms_router)
app.include_router(media_router)
app.include_router(admin_router)
app.include_router(chat_router)

@app.get("/", summary="root endpoint")
async def get_hello():
    return {"message": "Hello World"}
