from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from passlib.context import CryptContext
from sqlalchemy import select, func
from typing import List

from app.database.db import get_db_session
from app.schemas.auth import User
from app.models.admin import UserAdminOut, UserAdminUpdate, AdminStatsResponse
from app.services.get_user import get_current_user

router = APIRouter(prefix="/admin", tags=["Admin"])

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

async def verify_admin(current_user: User = Depends(get_current_user)):
    if current_user.status != "ADMIN":
        raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: Admin privileges required"
        )

    return current_user

@router.get(
        "/stats",
        response_model=AdminStatsResponse,
        summary="Get dashboard statistics"
)
async def get_users(
        db: AsyncSession = Depends(get_db_session),
        admin: User = Depends(verify_admin)
):
    total_users_query = await db.execute(select(func.count(User.id)))
    pro_users_query = await db.execute(select(func.count(User.id)).where(User.status == "PRO"))
    likes_sum_query = await db.execute(select(func.sum(User.likes)))

    return {
            "total_users": total_users_query.scalar() or 0,
            "pro_users": pro_users_query.scalar() or 0,
            "total_likes": likes_sum_query.scalar() or 0
    }

@router.get(
        "/users",
        response_model=List[UserAdminOut],
        summary="List all users"
)
async def list_all_users(
        db: AsyncSession = Depends(get_db_session),
        admin: User = Depends(verify_admin)
):
    result = await db.execute(select(User).order_by(User.id.desc()))
    return result.scalars().all()

@router.patch(
        "/users/{user_id}",
        response_model=UserAdminOut,
        summary="Update user details"
)
async def update_user_admin(
        user_id: int,
        update_data: UserAdminUpdate,
        db: AsyncSession = Depends(get_db_session),
        admin: User = Depends(verify_admin)
):
    result = await db.execute(select(User).where(User.id == user_id))
    db_user = result.scalar_one_or_none()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    data = update_data.model_dump(exclude_unset=True)

    for key, value in data.items():
        setattr(db_user, key, value)

    await db.commit()
    await db.refresh(db_user)

    return db_user

@router.delete(
        "/users/{user_id}",
        status_code=status.HTTP_204_NO_CONTENT,
        summary="Delete user"
)
async def delete_user_admin(
        user_id: int,
        db: AsyncSession = Depends(get_db_session),
        admin: User = Depends(verify_admin)
):
    result = await db.execute(select(User).where(User.id == user_id))
    db_user = result.scalar_one_or_none()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    await db.delete(db_user)
    await db.commit()

    return None

@router.post(
        "/users",
        response_model=UserAdminOut,
        status_code=status.HTTP_201_CREATED,
        summary="Create a new user manually"
)
async def create_user_admin(
        user_data: UserAdminUpdate,
        db: AsyncSession = Depends(get_db_session),
        admin: User = Depends(verify_admin)
):
    existing_user = await db.execute(select(User).where(User.email == user_data.email))

    if existing_user.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="User with this email already exists")

    if not user_data.password:
        raise HTTPException(status_code=400, detail="Password is required for new user")

    new_user = User(
            username=user_data.username,
            email=user_data.email,
            status=user_data.status or "FREE",
            likes=user_data.likes or 0,
            hashed_password=pwd_context.hash(user_data.password)
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return new_user
