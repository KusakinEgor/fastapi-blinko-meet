from typing import Optional
from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.database.db import Base
from .common import TimestampMixin

class AuditLog(TimestampMixin, Base):
    """Logs of administrative actions and system events."""
    __tablename__ = "audit_logs"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    action: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    details: Mapped[str] = mapped_column(Text, nullable=False)
    admin_id: Mapped[Optional[int]] = mapped_column(index=True)
