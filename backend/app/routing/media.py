import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database.db import get_db_session
from app.schemas.user import UserProfile
from app.services.get_user import get_current_user
from app.schemas.auth import User

router = APIRouter(prefix="/media", tags=["Media"])

UPLOAD_DIR = "static/avatars"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post(
        "/upload-avatar",
        status_code=status.HTTP_200_OK,
        summary="Upload user avatar",
        description="Download image, save on disk and update link in profile user.",
        responses={
            200: {"description": "Avatar done"},
            400: {"description": "Wrong format file"},
            401: {"description": "User not auth"},
            500: {"description": "Error save"}
        }
)
async def upload_avatar(
        file: UploadFile = File(...),
        db: AsyncSession = Depends(get_db_session),
        current_user: User = Depends(get_current_user)
):
    allowed_extensions = ["jpg", "jpeg", "png", "webp"]
    file_ext = file.filename.split(".")[-1].lower()

    if file_ext not in allowed_extensions:
        raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid image format. Allowed: {allowed_extensions}"
        )

    file_name = f"{current_user.id}_{uuid.uuid4().hex}.{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, file_name)

    try:
        content = await file.read()

        if len(content) > 5 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File too large (max 5MB)")

        with open(file_path, "wb") as f:
            f.write(content)

        avatar_url = f"/static/avatars/{file_name}"

        result = await db.execute(
                select(UserProfile).where(UserProfile.user_id == current_user.id)
        )

        profile = result.scalar_one_or_none()

        if not profile:
            profile = UserProfile(user_id=current_user.id, avatar_url=avatar_url)
            db.add(profile)
        else:
            profile.avatar_url = avatar_url

        await db.commit()

        return {
                "url": avatar_url,
                "filename": file_name,
                "status": "success"
        }

    except Exception as e:
        await db.rollback()

        if os.path.exists(file_path):
            os.remove(file_path)

        raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Upload error: {str(e)}"
        )
