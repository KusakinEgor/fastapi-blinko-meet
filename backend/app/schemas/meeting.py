from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Boolean, DateTime, ForeignKey, func
from app.database.db import Base
from app.schemas.common import ParticipantRole, TimestampMixin

class Rooms(TimestampMixin, Base):
    """Conference rooms representing scheduled or active video mettings."""
    __tablename__ = "rooms"

    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)

    is_private: Mapped[bool] = mapped_column(Boolean, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    password_hash: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    closed_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)

class Participants(TimestampMixin, Base):
    """Junction table for users in conference rooms with their media states and roles."""
    __tablename__ = "participants"

    room_id: Mapped[int] = mapped_column(ForeignKey("rooms.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=False)

    role: Mapped[ParticipantRole] = mapped_column(default=ParticipantRole.LISTENER)

    is_muted: Mapped[bool] = mapped_column(Boolean, default=True)
    is_camera_on: Mapped[bool] = mapped_column(Boolean, default=False)

    left_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
