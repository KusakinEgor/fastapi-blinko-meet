import enum
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import func, DateTime

class TimestampMixin:
    id: Mapped[int] = mapped_column(primary_key=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

class ParticipantRole(str, enum.Enum):
    HOST = "host"
    PARTICIPANT = "participant"
    LISTENER = "listener"

