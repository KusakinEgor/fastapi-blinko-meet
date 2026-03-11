from fastapi import APIRouter, Depends, HTTPException
from app.models.room import RoomCreate, RoomOut, RoomJoinResponse

router = APIRouter(prefix="/rooms", tags=["Rooms"])

@router.post("/", response_model=RoomOut)
async def create_room(room_data: RoomCreate):
    new_room = {**room_data.dict(), "id": 1, "owner_id": 123}
    return new_room

@router.post("/{slug}/join", response_model=RoomJoinResponse)
async def join_room(slug: str):
    if slug == "not-found":
        raise HTTPException(status_code=404, detail="Room not found")

    return {"room_slug": slug, "status": "joined", "user_id": 123}

@router.get("/{slug}/participants")
async def get_participants(slug: str):
    participants = [{"id": 1, "name": "User1"}, {"id": 2, "name": "User2"}]
    return participants

@router.patch("/{slug}")
async def update_settings(slug: str, settings: dict):
    if not settings:
        raise HTTPException(status_code=400, detail="No settings provided")

    return {"message": f"Room {slug} updated", "updated_fields": list(settings.keys())}

