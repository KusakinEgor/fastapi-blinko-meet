from pydantic import BaseModel
from typing import List, Optional

class MediaTokenOut(BaseModel):
    token: str
    ws_url: str
    ice_servers: List[dict] = []

    class Config:
        json_schema_extra = {
                "example": {
                    "token": "eyJh...rtc-token",
                    "ws_url": "wss://media-node-1.blink.ru",
                    "ice_servers": [{"urls": "stun:stun.l.google.com:19302"}]
                }
        }

