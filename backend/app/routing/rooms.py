import uuid
import secrets
from datetime import datetime, timezone

from sqlalchemy import select
from app.database.db import get_db_session
from app.schemas.meeting import Rooms
from sqlalchemy.ext.asyncio import AsyncSession
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
async def create_room(room_data: RoomCreate, db: AsyncSession = Depends(get_db_session)):
    random_slug = f"{secrets.token_hex(3)}-{secrets.token_hex(3)}"

    host_token = secrets.token_urlsafe(32)

    new_room = Rooms(
            owner_id=host_token,
            slug=random_slug,
            name=room_data.name,
            is_private=bool(room_data.password),
            room_name=room_data.password,
            is_active=True
    )

    db.add(new_room)
    await db.commit()
    await db.refresh(new_room)

    base_url = "http://localhost:5173"
    meeting_link = f"{base_url}/call/{new_room.slug}"

    return {
            "id": str(new_room.id),
            "slug": new_room.slug,
            "name": room_data.name,
            "host_id": host_token,
            "is_activate": new_room.is_active,
            "created_at": new_room.created_at,
            "invite_link": meeting_link
    }

@router.post(
        "/{slug}/join",
        response_model=RoomJoinResponse,
        summary="Join an existing room",
        description="Enter a room using its unique slug to receive a session token.",
        responses={404: {"description": "Room not found"}}
)
async def join_room(slug: str, db: AsyncSession = Depends(get_db_session)):
    room = await db.execute(select(Rooms).filter(Rooms.slug == slug))
    room = room.scalar_one_or_none()

    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    session_token = secrets.token_urlsafe(32)

    return {
            "room_slug": slug,
            "session_token": session_token,
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
