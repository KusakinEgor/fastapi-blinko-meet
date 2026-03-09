from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

class RoomCreate(BaseModel):
    name: str = Field(
            default=...,
            min_length=3,
            max_length=100,
            examples=["Daily Standup"]
    )
    password: Optional[str] = Field(default=None)

class RoomOut(BaseModel):
    id: int
    slug: str
    name: str
    host_id: int
    is_activate: bool
    created_at: datetime

class Config:
    from_attributes = True

class RoomJoinResponse(BaseModel):
    room_slug: str
    session_token: str
    ice_servers: List[dict] = []
