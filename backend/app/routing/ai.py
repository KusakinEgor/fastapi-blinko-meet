from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from datetime import datetime

from app.database.db import get_db_session
from app.models.ai import SummaryOut, SummaryCreate
from app.services.get_user import get_current_user
from app.schemas.auth import User

router = APIRouter(prefix="/ai", tags=["AI"])

@router.post(
        "/summary/generate",
        response_model=SummaryOut,
        status_code=status.HTTP_200_OK,
        summary="Generate meeting summary",
        description="Send transcript to GigaChat to get a structured summary of the meeting."
        responses={
            200: {"description": "Summary successfully generated"},
            401: {"description": "Authentication required"},
            422: {"description": "Validation error in transcript data"},
            500: {"description": "GigaChat API internal error"}
        }
)
async def generate_summary(
        data: SummaryCreate,
        db: AsyncSession = Depends(get_db_session),
        current_user: User = Depends(get_current_user)
):
    return {
            "id": 1,
            "room_id": data.room_id,
            "summary_text": "Here will be result GigaChat after integration.",
            "created_at": datetime.now()
    }

@router.get(
        "/summary/{room_id}",
        response_model=SummaryOut,
        summary="Get existing summary",
        description="Retrieve a previosly generated summary from the database."
        responses={
            200: {"description": "Summary retrieved successfully"},
            404: {"description": "Summary for this room not found"},
            401: {"description": "Unauthorized access"}
        }
)
async def get_summary(
        room_id: str,
        db: AsyncSession = Depends(get_db_session),
        current_user: User = Depends(get_current_user)
):
    if room_id == "not_found":
        raise HTTPException(status_code=404, detail="Summary not found for this room")

    return {
            "id": 1,
            "room_id": room_id,
            "summary_text": "Saved summary for room" + room_id,
            "created_at": datetime.now()
    }
