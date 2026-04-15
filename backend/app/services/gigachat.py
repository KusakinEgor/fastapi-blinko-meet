import time
import uuid
import httpx
from typing import Optional, Dict, Any
from app.config import GIGA_CLIENT_ID, GIGA_CLIENT_SECRET, GIGA_AUTH_KEY

class GigaChatService:
        AUTH_URL = "https://ngw.devices.sberbank.ru:9443/api/v2/oauth"
        CHAT_URL = "https://gigachat.devices.sberbank.ru/api/v1/chat/completions"

        def __init__(self) -> None:
            self._client = httpx.AsyncClient(verify=False)
            self._access_token: Optional[str] = None
            self._expires_at: float = 0.0

            self._basic_auth = GIGA_AUTH_KEY

        async def _get_token(self) -> str:
            headers = {
                    "Authorization": f"Basic {self._basic_auth}",
                    "RqUID": str(uuid.uuid4()),
                    "Content-Type": "application/x-www-form-urlencoded",
            }

            data = {"scope": "GIGACHAT_API_PERS"}

            response = await self._client.post(self.AUTH_URL, headers=headers, data=data)
            response.raise_for_status()

            payload = response.json()
            token = payload.get("access_token")

            if not token:
                raise ValueError("GigaChat API did not return an access token")

            self._access_token = token
            self._expires_at = time.time() + payload.get("expires_in", 0)

            return token

        async def _ensure_token(self) -> str:
            if self._access_token and time.time() < self._expires_at - 60:
                return self._access_token
            return await self._get_token()

        async def send_message(self, message: str) -> str:
            token = await self._ensure_token()

            headers = {
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json",
            }

            payload = {
                    "model": "GigaChat",
                    "messages": [{"role": "user", "content": message}],
                    "stream": False,
            }

            response = await self._client.post(self.CHAT_URL, headers=headers, json=payload)

            if response.status_code == 401:
                token = await self._get_token()
                headers["Authorization"] = f"Bearer {token}"
                response = await self._client.post(self.CHAT_URL, headers=headers, json=payload)

            response.raise_for_status()
            result = response.json()

            return result["choices"][0]["message"]["content"]
        
        async def close(self):
            await self._client.aclose()
