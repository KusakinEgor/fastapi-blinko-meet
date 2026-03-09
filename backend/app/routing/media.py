from fastapi import APIRouter, Depends
from app.models.media import MediaTokenOut

router = APIRouter(prefix="/media", tags=["Media"])

@router.post("/token/{room_slug}", response_model=MediaTokenOut)
async def get_media_token(room_slug: str):
    return {"token": "generated_webrtc_token", "ws_url": "wss://media-rust.com"}
