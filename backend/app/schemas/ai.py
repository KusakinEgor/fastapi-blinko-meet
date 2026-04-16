from sqlalchemy import Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.db import Base
from .common import TimestampMixin

class MeetingSummary(TimestampMixin, Base):
    __tablename__ = "meeting_summaries"

    room_id: Mapped[int] = mapped_column(
            ForeignKey("rooms.id", ondelete="CASCADE"),
            unique=True,
            nullable=False
    )

    summary_text: Mapped[str] = mapped_column(Text, nullable=False)

    room: Mapped["Rooms"] = relationship("Rooms")
