from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.database.db import get_db_session
from app.schemas.meeting import Rooms, Participants
from app.schemas.chat import Message
from app.schemas.auth import User
from app.services.get_user import get_current_user

router = APIRouter(prefix="/employee", tags=["Employee Analytics"])

@router.get("/dashboard-stats", status_code=status.HTTP_200_OK)
async def get_dashboard_stats(
        db: AsyncSession = Depends(get_db_session),
        current_user: User = Depends(get_current_user)
):
    history_stmt = (
            select(Rooms)
            .order_by(Rooms.created_at.desc())
            .limit(4)
    )
    history_result = await db.execute(history_stmt)
    meetings = history_result.scalars().all()

    start_of_month = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    count_stmt = (
            select(func.count(Rooms.id))
            .where(Rooms.created_at >= start_of_month)
    )
    total_meetings = (await db.execute(count_stmt)).scalar() or 0

    now_utc = datetime.now(timezone.utc).replace(tzinfo=None)

    activity_stmt = (
            select(
                func.date(Message.created_at).label("day"),
                func.count(Message.id).label("count")
            )
            .group_by(func.date(Message.created_at))
            .order_by(func.date(Message.created_at))
    )
    activity_result = await db.execute(activity_stmt)

    chart_data = [
            {"day": row.day.strftime("%a"), "hours": row.count}
            for row in activity_result.all()
    ]

    if not chart_data:
        chart_data = [{"day": datetime.now(timezone.utc).strftime("%a"), "hours": 0}]

    latest_room = meetings[0] if meetings else None
    nearest_info = f"{latest_room.name}" if latest_room else "Нет встреч"

    return {
            "summary": {
                "nearest_event": nearest_info,
                "monthly_hours": f"{total_meetings}",
                "rank": "Активно" if total_meetings > 0 else "Пасивно"
            },
            "chart": chart_data,
            "meetings_history": [
                {
                    "title": m.name or f"Служба {m.slug}",
                    "date": m.created_at.strftime("%d %b"),
                    "duration": "30м"
                } for m in meetings
            ]
    }
