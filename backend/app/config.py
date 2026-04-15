import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = str(os.getenv("DATABASE_URL"))
SECRET_KEY = str(os.getenv("SECRET_KEY"))
ALGORITHM = str(os.getenv("ALGORITHM"))
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 15))
SECRET_CRYPTO_KEY = os.getenv("SECRET_CRYPTO_KEY", "default_key_for_dev_only=")

GIGA_CLIENT_ID = os.getenv("GIGA_CLIENT_ID")
GIGA_CLIENT_SECRET = os.getenv("GIGA_CLIENT_SECRET")
GIGA_AUTH_KEY = os.getenv("GIGA_AUTH_KEY")
