import enum
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import func, DateTime

class TimestampMixin:
    """Base mixin to provide primary key and creation timestamp for models."""
    id: Mapped[int] = mapped_column(primary_key=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

class ParticipantRole(str, enum.Enum):
    """Enumeration of available roles for participants in a session."""
    HOST = "host"
    PARTICIPANT = "participant"
    LISTENER = "listener"

