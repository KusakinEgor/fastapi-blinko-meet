from sqlalchemy import String, ForeignKey, Table, Column
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.db import Base

user_badges = Table(
        "user_badges_association",
        Base.metadata,
        Column("user_id", ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
        Column("badge_name", ForeignKey("badges.name", ondelete="CASCADE"), primary_key=True),
)

class Badge(Base):
    __tablename__ = "badges"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=True)
