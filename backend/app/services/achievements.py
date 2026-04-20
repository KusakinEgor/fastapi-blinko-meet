from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

async def award_badge_if_not_exists(db: AsyncSession, user, badge_name: str):
    from app.schemas.badge import Badge

    if any(b.name == badge_name for b in user.badges):
        return False

    result = await db.execute(select(Badge).where(Badge.name == badge_name))
    badge = result.scalar_one_or_none()

    if badge:
        user.badges.append(badge)
        await db.commit()
        return True
    return False
