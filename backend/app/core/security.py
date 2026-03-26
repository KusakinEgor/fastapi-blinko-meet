from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from typing import Optional
from app.config import ALGORITHM, SECRET_KEY, ACCESS_TOKEN_EXPIRE_MINUTES

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)

def create_access_token(user_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=float(ACCESS_TOKEN_EXPIRE_MINUTES))
    payload = {"sub": str(user_id), "exp": expire}
    return jwt.encode(payload, str(SECRET_KEY), str(ALGORITHM))

def decode_access_token(token: str) -> Optional[int]:
    try:
        payload = jwt.decode(token, str(SECRET_KEY), algorithms=[str(ALGORITHM)])
        user_id_str = payload.get("sub")

        if user_id_str is None:
            return None
        return int(user_id_str)
    except (JWTError, ValueError):
        return None

# check for self will use that later
if __name__ == "__main__":
    print(create_access_token(123))
