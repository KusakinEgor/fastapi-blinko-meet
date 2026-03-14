from fastapi import APIRouter, Depends, status
from app.models.auth import Registration, Login, TokenResponse, UserResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.db import get_db_session
from app.services.auth import login_user_service, register_user_service

router = APIRouter(tags=["Auth"])

@router.post(
        "/register",
        response_model=UserResponse,
        status_code=status.HTTP_201_CREATED,
        summary="Registration new user",
        description="""
        Create a new user account by providing an email and password.
         - Email: must be unique;
         - Password: wil be hashed before saving to the database.
        """,
        responses={
            400: {"description": "User with this email already exists"},
            422: {"description": "Validation Error"}
        }
)
async def register(
    data: Registration,
    db: AsyncSession = Depends(get_db_session)
):
    user = await register_user_service(db, data)
    return user

@router.post(
        "/login",
        response_model=TokenResponse,
        summary="Authenticate user and get token",
        description="Exchange credentials (email and password) for a JWT access token.",
        responses={
            401: {"description": "Invalid credentials (email or password)"}
        }
)
async def login(
    data: Login,
    db: AsyncSession = Depends(get_db_session)
) -> TokenResponse:
    token_data = await login_user_service(db, data)

    return TokenResponse(
            access_token=token_data["access_token"],
            token_type=token_data["token_type"]
    )
    
