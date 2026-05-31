from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.core.security import decrypt_message, encrypt_message
from app.database.db import get_db_session
from app.models.chat import MessageCreate, MessageResponse
from app.services.get_user import get_current_user
from app.schemas.auth import User
from app.schemas.chat import Message

router = APIRouter(tags=["Chat"], prefix="/messages")

@router.post(
        "/send",
        response_model=MessageResponse,
        summary="Send a new message",
        description="""
        Saves a message to the database.
        - **content**: The text of the message;
        - **user_id**: Automatically taken from the JWT token.
        """,
        responses={
            401: {"description": "Not authenticated"},
            422: {"description": "Validation Error"}
        }
)
async def send_message(
        data: MessageCreate,
        db: AsyncSession = Depends(get_db_session),
        current_user: User = Depends(get_current_user)
):
    encrypted_content = encrypt_message(data.content)

    new_message = Message(
            content=encrypted_content,
            user_id=current_user.id,
            room_id=data.room_id
    )

    db.add(new_message)
    await db.commit()
    await db.refresh(new_message)

    new_message.content = decrypt_message(new_message.content)
    return new_message

@router.get(
        "/room/{slug}/history",
        response_model=List[MessageResponse],
        summary="Get active users' messages in a room",
)
async def get_messages_history(
        slug: str,
        db: AsyncSession = Depends(get_db_session),
        current_user: User = Depends(get_current_user)
):
    query = (
            select(Message)
            .where(Message.room_id == slug)
            .order_by(Message.created_at.asc())
    )
    result = await db.execute(query)
    messages = result.scalars().all()

    for msg in messages:
        try:
            msg.content = decrypt_message(msg.content)
        except Exception:
            msg.content = "[Ошибка расшифровки]"

    return messages
