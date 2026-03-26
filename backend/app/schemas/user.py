from typing import Optional
from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.db import Base
from .common import TimestampMixin

class UserProfile(TimestampMixin, Base):
    """User profile containing public information and conference presets."""
    __tablename__ = "user_profiles"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True)

    display_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=False)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    default_muted: Mapped[bool] = mapped_column(Boolean, default=True)
    default_camera_off: Mapped[bool] = mapped_column(Boolean, default=True)
    blur_background: Mapped[bool] = mapped_column(Boolean, default=False)

    user: Mapped["User"] = relationship("User", back_populates="profile")

class UserSettings(TimestampMixin, Base):
    """Technical setttings for the interface and audio processing."""
    __tablename__ = "user_settings"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)

    language: Mapped[str] = mapped_column(String(2), server_default="en")
    theme: Mapped[str] = mapped_column(String(10), server_default="dark")

    enable_noise_suppression: Mapped[bool] = mapped_column(Boolean, default=True)
    auto_gain_control: Mapped[bool] = mapped_column(Boolean, default=True)

    user: Mapped["User"] = relationship("User", back_populates="settings")
