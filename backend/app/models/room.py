from pydantic import BaseModel, Field
from datetime import datetime
from typing import Any, Optional, List, Dict

class RoomCreate(BaseModel):
    name: str = Field(
            default=...,
            min_length=3,
            max_length=100,
            examples=["Daily Standup"],
            description="The display name of the room"
    )
    password: Optional[str] = Field(
            None,
            examples=["secret123"],
            description="Optional password for private rooms"
    )

class RoomOut(BaseModel):
    id: str = Field(..., examples=["919d690c-a9bc-4a6f-9e25-df7f91cbd4a5"])
    slug: str = Field(..., examples=["004eb9-8329c5"])
    name: str = Field(..., examples=["Daily Standup"])
    host_id: str = Field(..., examples=["5ze80C3xk5Qf1rQnXnuZqXsUPFUpSRnZ1GHPXpzS3to"])
    is_activate: bool = Field(..., description="Whether the room in currently active")
    created_at: datetime
    invite_link: str = Field(..., examples=["sh"])

class Config:
    from_attributes = True

class RoomJoinResponse(BaseModel):
    room_slug: str = Field(..., examples=["daily-standup-xyz"])
    session_token: str = Field(..., examples=["sess_abc123"])
    ice_servers: List[Dict[str, Any]] = Field(default_factory=list)

class RoomJoinRequest(BaseModel):
    password: Optional[str] = None
