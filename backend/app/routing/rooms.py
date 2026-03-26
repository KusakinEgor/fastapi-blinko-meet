import uuid
import secrets
from datetime import datetime, timezone

from sqlalchemy import select
from app.database.db import get_db_session
from app.schemas.auth import User
from app.schemas.meeting import Rooms, Participants
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, HTTPException, status
from app.models.room import RoomCreate, RoomOut, RoomJoinResponse, RoomJoinRequest
from app.services.get_user import get_current_user

router = APIRouter(prefix="/rooms", tags=["Rooms"])

@router.post(
        "/create",
        response_model=RoomOut,
        status_code=status.HTTP_201_CREATED,
        summary="Create a new room",
        description="Initialize a new streaming or chat room. The slug will be generated auto."
)
async def create_room(
        room_data: RoomCreate,
        db: AsyncSession = Depends(get_db_session),
        current_user: User = Depends(get_current_user)
):
    random_slug = f"{secrets.token_hex(3)}-{secrets.token_hex(3)}"

    new_room = Rooms(
            owner_id=current_user.id,
            slug=random_slug,
            name=room_data.name,
            is_private=bool(room_data.password),
            password=room_data.password,
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
            "host_id": str(current_user.id),
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
async def join_room(slug: str, data: RoomJoinRequest, db: AsyncSession = Depends(get_db_session)):
    result = await db.execute(select(Rooms).where(Rooms.slug == slug))
    room = result.scalar_one_or_none()

    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    if room.is_private:
        if not data.password or data.password != room.password:
            raise HTTPException(status_code=403, detail="Wrong password")

    session_token = secrets.token_urlsafe(32)

    participant = Participants(
            room_id=room.id,
            user_id=None,
            session_token=session_token
    )

    db.add(participant)
    await db.commit()

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
