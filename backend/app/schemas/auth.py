from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, DateTime, func, Boolean, text
from app.database.db import Base
from .common import TimestampMixin

class User(TimestampMixin, Base):
    """Represents a reqistered system user and their authentication credentials."""
    __tablename__ = "users" 

    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)

    status: Mapped[str] = mapped_column(String(20), server_default=text("'FREE'"), nullable=False)
    likes: Mapped[int] = mapped_column(Integer, server_default=text("0"), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, server_default=text("true"), nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    display_name: Mapped[str] = mapped_column(String(100), nullable=True)

    profile: Mapped["UserProfile"] = relationship("UserProfile", back_populates="user", uselist=False)
    settings: Mapped["UserSettings"] = relationship("UserSettings", back_populates="user", uselist=False)

    messages: Mapped[list["Message"]] = relationship("Message", back_populates="user", cascade="all, delete-orphan")
