from fastapi import APIRouter, Depends, HTTPException
from app.models.room import RoomCreate, RoomOut, RoomJoinResponse

router = APIRouter(prefix="/rooms", tags=["Rooms"])

@router.post("/", response_model=RoomOut)
async def create_room(room_dat: RoomCreate):
    pass

@router.post("/{slug}/join", response_model=RoomJoinResponse)
async def join_room(slug: str):
    pass

@router.get("/{slug}/participants")
async def get_participants(slug: str):
    pass

@router.patch("/{slug}")
async def update_settings(slug: str, settings: dict):
    pass

