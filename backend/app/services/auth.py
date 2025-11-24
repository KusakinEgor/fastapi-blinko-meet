from app.core.security import hash_password, verify_password, create_access_token
from sqlalchemy.ext.asyncio import AsyncSession

async def register(db: AsyncSession, password: str) -> str:
    hashed = hash_password(password)
    # Здесь нужно создать пользователя в БД, например:
    # user = User(hashed_password=hashed, ...)
    # db.add(user)
    # check this password with data in db
    # await db.commit()
    # await db.refresh(user)
    return hashed


async def login(db: AsyncSession, password: str, email: str):
    # user = await get_user_by_email(db, email)

    # if not verify_password(password, user.hashed_password):
    #       raise Value Error

    token = create_access_token()
    return {"access_token": token, "token_type": "bearer"}
