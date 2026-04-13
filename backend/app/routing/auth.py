from fastapi import APIRouter, Depends, Header, status
from fastapi.exceptions import HTTPException
from app.core.security import create_access_token, create_refresh_token, decode_access_token
from app.models.auth import Registration, Login, TokenResponse, UserResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.db import get_db_session
from app.schemas.auth import User
from app.services.auth import login_user_service, register_user_service
from app.services.get_user import get_current_user

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

    return TokenResponse(**token_data)

@router.post(
        "/employee/login",
        response_model=TokenResponse,
        summary="Employee/Admin Login",
        description="Special login endpoint for staff members only.",
        responses={
            401: {"description": "Invalid credentials"},
            403: {"description": "Access denied: Not a staff member"}
        }
)
async def employee_login(
        data: Login,
        db: AsyncSession = Depends(get_db_session)
) -> TokenResponse:
    token_data = await login_user_service(db, data)

    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()

    if not user or user.status not in ["ADMIN", "EMPLOYEE"]:
        raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: Not a staff memeber"
        )

    return TokenResponse(**token_data)

@router.get(
        "/profile",
        response_model=UserResponse,
        summary="Get current user profile",
        description="Return detailed information about the currently authenticated user."
)
async def get_profile(
        current_user: User = Depends(get_current_user)
):
    return current_user

@router.post(
        "/refresh",
        response_model=TokenResponse,
        summary="Refresh access token using refresh token",
        description="Provide a valid refresh token to get a new access token."
)
async def refresh_token(
        x_refresh_token: str = Header(...),
):
    user_id = decode_access_token(x_refresh_token)

    if not user_id:
        raise HTTPException(
                status_code=401,
                detail="Invalid refresh token"
        )

    new_access_token = create_access_token(user_id)
    new_refresh_token = create_refresh_token(user_id)

    return TokenResponse(
            access_token=new_access_token,
            refresh_token=new_refresh_token,
            token_type="bearer"
    )

