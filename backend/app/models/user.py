from datetime import datetime
from pydantic import BaseModel, HttpUrl, Field
from typing import Optional

class ProfileUpdate(BaseModel):
    display_name: Optional[str] = Field(
            None,
            description="Public name shown to other participants",
            examples=["Ivan_Zolo"]
    )
    avatar_url: Optional[str] = Field(
            None,
            description="URL to the user's avatar image",
            examples=["https://example.com"]
    )
    default_muted: bool = Field(
            True,
            description="Whether the microphone is disabled by default when joining a meeting"
    )
    default_camera_off: bool = Field(
            True,
            description="Whether the camera is disabled by default when joining a meeting"
    )
    blur_background: bool = Field(
            False,
            description="Enable background blur effect in video calls"
    )

    class Config:
        from_attributes = True

class SettingsUpdate(BaseModel):
    language: str = Field (
            "ru",
            max_length=2,
            description="Interface language code (ISO 639-1)",
            examples=["ru", "en"]
    )
    theme: str = Field(
            "dark",
            description="UI appearance theme",
            examples=["dark", "light"]
    )
    enable_noise_suppression: bool = Field(
            True,
            description="Enable AI-based background noise cancellation"
    )
    auto_gain_control : bool = Field(
            True,
            description="Automatically adjust microphone input volume"
    )

    class Config:
        from_attributes = True

class BadgeOut(BaseModel):
    name: str

    class Config:
        from_attributes = True

class RoomHistoryOut(BaseModel):
    id: int = Field(..., examples=[1])
    slug: str = Field(..., examples=["97658d-a36590"])
    name: str = Field(..., examples=["Project Sync"])
    is_active: bool = Field(..., examples=[True])
    created_at: datetime = Field(..., examples=["2026-10-24T14:20:00"])
    closed_at: Optional[datetime] = Field(None, examples=["2026-10-24T15:20:00"])

    class Config:
        from_attributes = True

class ProfileOut(ProfileUpdate):
    id: int = Field(..., description="Owner user ID", examples=[1])
    user_id: int = Field(..., description="Owner user ID", examples=[123])
    badges: list[BadgeOut] = Field(default=[], description="User trophies/badges")

class SettingsOut(SettingsUpdate):
    user_id: int = Field(..., description="Owner user ID", examples=[321])
