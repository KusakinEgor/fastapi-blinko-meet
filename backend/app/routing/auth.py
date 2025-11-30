from fastapi import APIRouter, Depends
from app.models.auth import Registration, Login, SuccessRegister
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.db import get_db_session
from app.services.auth import login_user_service, register_user_service

router = APIRouter()

@router.post("/register", response_model=SuccessRegister)
async def register(
    data: Registration,
    db: AsyncSession = Depends(get_db_session)
) -> SuccessRegister:
    user = await register_user_service(db, data.password)
    
    return SuccessRegister(
        done=True
    )

@router.post("/login", response_model=SuccessRegister)
async def login(
    data: Login,
    db: AsyncSession = Depends(get_db_session)
) -> SuccessRegister:
    token = await login_user_service(db, data.password)
    
    return SuccessRegister(
        done=True
    )
