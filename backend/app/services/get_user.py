from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.security import decode_access_token
from app.database.db import get_db_session
from app.schemas.auth import User

auth_scheme = HTTPBearer()

async def get_current_user(
        auth: HTTPAuthorizationCredentials = Depends(auth_scheme),
        db: AsyncSession =  Depends(get_db_session)
) -> User:
    token = auth.credentials

    user_id = decode_access_token(token)

    if not user_id:
        raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials"
        )

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

