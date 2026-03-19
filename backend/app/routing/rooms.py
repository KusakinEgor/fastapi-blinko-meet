import uuid
import secrets
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from app.models.room import RoomCreate, RoomOut, RoomJoinResponse

router = APIRouter(prefix="/rooms", tags=["Rooms"])

@router.post(
        "/create",
        response_model=RoomOut,
        status_code=status.HTTP_201_CREATED,
        summary="Create a new room",
        description="Initialize a new streaming or chat room. The slug will be generated auto."
)
async def create_room(room_data: RoomCreate):
    random_slug = f"{secrets.token_hex(3)}-{secrets.token_hex(3)}"

    host_token = secrets.token_urlsafe(32)

    new_room = {
            "id": str(uuid.uuid4()),
            "slug": random_slug,
            "name": room_data.name,
            "password": room_data.password,
            "host_id": host_token,
            "is_activate": True,
            "created_at": datetime.now(timezone.utc) 
    }

    return new_room

@router.post(
        "/{slug}/join",
        response_model=RoomJoinResponse,
        summary="Join an existing room",
        description="Enter a room using its unique slug to receive a session token.",
        responses={404: {"description": "Room not found"}}
)
async def join_room(slug: str):
    if slug == "not-found":
        raise HTTPException(status_code=404, detail="Room not found")

    return {
            "room_slug": slug,
            "session_token": "test_token-123",
            "ice_servers": []
    }

@router.get(
        "/{slug}/participants",
        summary="List room participants",
        description="Returns a list of all users currently present in the room"
)
async def get_participants(slug: str):
    participants = [{"id": 1, "name": "User1"}, {"id": 2, "name": "User2"}]
    return participants

@router.patch(
        "/{slug}",
        summary="Update room settings",
        description="Modify room properties like name or privacy settings. Only available for the host",
        responses={400: {"description": "Empty settings provided"}}
)
async def update_settings(slug: str, settings: dict):
    if not settings:
        raise HTTPException(status_code=400, detail="No settings provided")

    return {"message": f"Room {slug} updated", "updated_fields": list(settings.keys())}
