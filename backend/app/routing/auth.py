from fastapi import APIRouter, Depends
from app.models.auth import Registration, Login, TokenResponse, UserResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.db import get_db_session
from app.services.auth import login_user_service, register_user_service

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(
    data: Registration,
    db: AsyncSession = Depends(get_db_session)
):
    user = await register_user_service(db, data)
    return user

@router.post("/login", response_model=TokenResponse)
async def login(
    data: Login,
    db: AsyncSession = Depends(get_db_session)
) -> TokenResponse:
    token_data = await login_user_service(db, data)

    return TokenResponse(
            access_token=token_data["access_token"],
            token_type=token_data["token_type"]
    )
    
