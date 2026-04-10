from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from typing import Optional
from cryptography.fernet import Fernet
from app.config import ALGORITHM, SECRET_CRYPTO_KEY, SECRET_KEY, ACCESS_TOKEN_EXPIRE_MINUTES

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
cipher_suite = Fernet(SECRET_CRYPTO_KEY.encode())

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)

def create_access_token(user_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=float(ACCESS_TOKEN_EXPIRE_MINUTES))
    payload = {"sub": str(user_id), "exp": expire}
    return jwt.encode(payload, SECRET_KEY, ALGORITHM)

def create_refresh_token(user_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(days=7)
    payload = {
            "sub": str(user_id),
            "exp": expire,
            "type": "refresh"
    }

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str) -> Optional[int]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id_str = payload.get("sub")

        if user_id_str is None:
            return None
        return int(user_id_str)
    except (JWTError, ValueError):
        return None

def decode_refresh_token(token: str) -> Optional[int]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        if payload.get("type") != "refresh":
            return None

        user_id_str = payload.get("sub")

        if user_id_str is None:
            return None
        return int(user_id_str)
    except (JWTError, ValueError):
        return None

def encrypt_message(text: str) -> str:
    return cipher_suite.encrypt(text.encode()).decode()

def decrypt_message(encrypted_text: str) -> str:
    return cipher_suite.decrypt(encrypted_text.encode()).decode()

# check for self will use that later
if __name__ == "__main__":
    print(create_access_token(123))
