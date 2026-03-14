from pydantic import BaseModel, Field
from typing import Any, List, Optional, Dict

class MediaTokenOut(BaseModel):
    token: str = Field(
            ...,
            description="JWT or session token for media server auth.",
            examples=["eyJh...rtc-token"]
    )

    ws_url: str = Field(
            ...,
            description="WebSocket URL for the media signaling server",
            examples=["wss://media-node-1.blink.ru"]
    )

    ice_servers: List[Dict[str, Any]] = Field(
            default_factory=list,
            description="List of STUN/TURN servers required for WebRTC connection",
            examples=[[{"urls": "stun:stun.l.google.com:19302"}]]
    )

    class Config:
        json_schema_extra = {
                "example": {
                    "token": "eyJh...rtc-token",
                    "ws_url": "wss://media-node-1.blink.ru",
                    "ice_servers": [{"urls": "stun:stun.l.google.com:19302"}]
                }
        }

