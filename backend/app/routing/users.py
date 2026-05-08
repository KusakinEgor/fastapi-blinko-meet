from datetime import datetime, timedelta, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import CursorResult, select, or_

from app.database.db import get_db_session
from app.models.user import ProfileOut, SettingsOut, ProfileUpdate, SettingsUpdate, RoomHistoryOut
from app.schemas.user import UserProfile, UserSettings
from app.schemas.auth import User
from app.schemas.meeting import Participants, Rooms
from app.services.get_user import get_current_user
from app.services.achievements import award_badge_if_not_exists

router = APIRouter(prefix="/user", tags=["User Settings"])

@router.put(
        "/profile",
        response_model=ProfileOut,
        status_code=status.HTTP_200_OK,
        summary="Update user profile",
        description="Update or create public profile info (display name, avatar, meeting presents).",
        responses={
            200: {"description": "Profile updated successfully"},
            401: {"description": "Authentication required"},
            500: {"description": "Database error"}
        }
)
async def update_profile(
        data: ProfileUpdate,
        db: AsyncSession = Depends(get_db_session),
        current_user =  Depends(get_current_user)
):
    try:
        result = await db.execute(
                select(UserProfile).where(UserProfile.user_id == current_user.id)
        )

        profile = result.scalar_one_or_none()

        if not profile:
            profile = UserProfile(user_id=current_user.id, **data.dict())
            db.add(profile)
        else:
            for key, value in data.dict(exclude_unset=True).items():
                setattr(profile, key, value)

        await db.commit()
        await db.refresh(profile)
        return profile

    except Exception as e:
        await db.rollback()
        raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database Error: {str(e)}"
        )


@router.put(
        "/settings",
        response_model=SettingsOut,
        status_code=status.HTTP_200_OK,
        summary="Update user settings",
        description="Update or create technical settings (language, theme, noise suppression).",
        responses={
            200: {"description": "Settings updated successfully"},
            401: {"description": "Authentication required"},
            500: {"description": "Database error"}
        }
)
async def update_settings(
        data: SettingsUpdate,
        db: AsyncSession = Depends(get_db_session),
        current_user = Depends(get_current_user)
):
    try:
        result = await db.execute(
                select(UserSettings).where(UserSettings.user_id == current_user.id)
        )

        settings = result.scalar_one_or_none()

        if not settings:
            settings = UserSettings(user_id=current_user.id, **data.dict())
            db.add(settings)
        else:
            for key, value in data.dict(exclude_unset=True).items():
                setattr(settings, key, value)

        await db.commit()
        await db.refresh(settings)
        return settings
    
    except Exception as e:
        await db.rollback()
        raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database Error: {str(e)}"
        )

@router.get(
        "/profile",
        response_model=ProfileOut,
        summary="Get user profile",
        description="Retrieve profile details for the current authenticated user."
)
async def get_profile(
        user_id: int = None,
        db:AsyncSession = Depends(get_db_session),
        current_user: User = Depends(get_current_user)
):
    target_user_id = user_id if user_id is not None else current_user.id

    user_result = await db.execute(
            select(User)
            .options(selectinload(User.badges))
            .where(User.id == target_user_id)
    )
    user_obj = user_result.scalar_one_or_none()

    if not user_obj:
        raise HTTPException(status_code=404, detail="User not found")

    result = await db.execute(
            select(UserProfile).where(UserProfile.user_id == target_user_id)
    )
    profile = result.scalar_one_or_none()

    if profile:
        return ProfileOut(
                **profile.__dict__,
                badges=user_obj.badges,
                likes=user_obj.likes
        )

    return ProfileOut(
            id=0,
            user_id=current_user.id,
            display_name=current_user.username,
            avatar_url=None,
            default_camera_off=True,
            default_muted=True,
            blur_background=False,
            badges=user_obj.badges,
            likes=user_obj.likes
    )

@router.get(
        "/history",
        response_model=List[RoomHistoryOut],
        summary="Get user meeting history",
        description="Retrieve a list of rooms where the current user was a participant or owner.",
        responses={
            200: {"description": "History retrieved successfully"},
            401: {"description": "Authentication required"},
            500: {"description": "Database error"}
        }
)
async def get_user_history(
        user_id: int = None,
        db: AsyncSession = Depends(get_db_session),
        current_user: User = Depends(get_current_user)
):
    try:
        target_id = user_id if user_id is not None else current_user.id

        stmt = (
                select(Rooms)
                .outerjoin(Participants, Rooms.id == Participants.room_id)
                .where(
                    or_(
                        Rooms.owner_id == target_id,
                        Participants.user_id == target_id
                    )
                )
                .distinct()
                .order_by(Rooms.created_at.desc())
        )

        result = await db.execute(stmt)
        rooms = result.scalars().all()

        return rooms

    except Exception as e:
        raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database Error: {str(e)}"
        )

@router.get(
        "/search",
        response_model=List[ProfileOut],
        summary="Search user profile",
        description="Search for users by display_name or username."
)
async def search_profiles(
        query: str,
        db: AsyncSession = Depends(get_db_session),
        current_user: User = Depends(get_current_user)
):
    stmt = (
            select(UserProfile, User.likes)
            .join(User, UserProfile.user_id == User.id)
            .where(
                UserProfile.display_name.ilike(f"%{query}%"),
                UserProfile.user_id != current_user.id
            )
            .limit(10)
    )

    result = await db.execute(stmt)
    rows = result.all()

    return [
            ProfileOut(**p.__dict__, badges=[], likes=l or 0) for p, l in rows
    ]

@router.post("/profile/{user_id}/like", summary="Like a user profile")
async def like_profile(
        user_id: int,
        db: AsyncSession = Depends(get_db_session),
        current_user: User = Depends(get_current_user)
):
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot like yourself")

    if current_user.last_like_time:
        now = datetime.utcnow()
        last_like = current_user.last_like_time.replace(tzinfo=None)

        delta = now - last_like

        if delta < timedelta(hours=1):
            remaining_minutes = 60 - int(delta.total_seconds() / 60)
            raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Slow down! You can like again in {remaining_minutes} minutes."
            )

    result = await db.execute(select(User).where(User.id == user_id))
    target_user = result.scalar_one_or_none()

    if not target_user:
        raise HTTPException(status_code=404, detail="Profile not found")

    target_user.likes = (target_user.likes or 0) + 1
    current_user.last_like_time = datetime.utcnow()

    try:
        await db.commit()
        await db.refresh(target_user)
        return { "likes": target_user.likes }
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.delete(
        "/account",
        status_code=status.HTTP_204_NO_CONTENT,
        summary="Delete user account",
        description="Permanently delete the current user's profile and settings.",
        responses={
            204: { "description": "Account deleted successfully" },
            401: { "description": "Authentication required" },
            500: { "description": "Database error" }
        }
)
async def delete_account(
        db: AsyncSession = Depends(get_db_session),
        current_user: User = Depends(get_current_user)
):
    try:
        result = await db.execute(select(User).where(User.id == current_user.id))
        user_to_delete = result.scalar_one_or_none()

        if user_to_delete:
            await db.delete(user_to_delete)
            await db.commit()
        return None
    except Exception as e:
        await db.rollback()
        print(f"FULL ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))
