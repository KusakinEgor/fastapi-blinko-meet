from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, DateTime, func
from app.database.db import Base
from app.schemas.common import TimestampMixin

class User(TimestampMixin, Base):
    """Represents a reqistered system user and their authentication credentials."""
    __tablename__ = "users" 

    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    display_name: Mapped[str] = mapped_column(String(100), nullable=False)
