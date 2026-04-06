from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token
from app.models.auth import Registration, Login
from app.schemas.auth import User

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

async def register_user_service(db: AsyncSession, data: Registration) -> User:
    hashed_password = hash_password(data.password)

    new_user = User(
            username=data.username,
            email=data.email,
            hashed_password=hashed_password
    )

    db.add(new_user)

    try:
        await db.commit()
        await db.refresh(new_user)
        return new_user
    except Exception as e:
        await db.rollback()
        raise e

async def login_user_service(db: AsyncSession, data: Login) -> dict:
    query = select(User).where(User.email == data.email)
    result = await db.execute(query)
    user = result.scalars().first()

    if not user:
        raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Wrong email or password"
        )

    if not verify_password(data.password, user.hashed_password):
        raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Wrong email or password"
        )

    token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)

    return {
            "access_token": token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
    }
