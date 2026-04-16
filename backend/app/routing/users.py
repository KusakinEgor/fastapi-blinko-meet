from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.db import get_db_session
from app.models.user import ProfileOut, SettingsOut, ProfileUpdate, SettingsUpdate
from app.schemas.user import UserProfile, UserSettings
from app.schemas.auth import User
from app.services.get_user import get_current_user

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
        db:AsyncSession = Depends(get_db_session),
        current_user: User = Depends(get_current_user)
):
    result = await db.execute(
            select(UserProfile).where(UserProfile.user_id == current_user.id)
    )

    profile = result.scalar_one_or_none()

    if not profile:
        return ProfileOut(
                id=0,
                user_id=current_user.id,
                display_name=current_user.username,
                avatar_url=None,
                default_camera_off=True,
                default_muted=True,
                blur_background=False
        )

    return profile
