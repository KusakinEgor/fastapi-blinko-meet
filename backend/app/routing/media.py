from fastapi import APIRouter, Depends
from app.models.media import MediaTokenOut

router = APIRouter(prefix="/media", tags=["Media"])

@router.post(
        "/token/{room_slug}",
        response_model=MediaTokenOut,
        summary="Generate WebRTC access token",
        description="""
        Generates a secure session token and prvides connection details for the media server.
            - token: Used to authenticate with the WebRTC signaling server;
            - ws_url: The WebSocket endpoint for the media server;
            - ice_sever: List of STUN/TURN servers for NAT traversal.
        """,
        responses={
            404: {"description": "Room with this slug was not found"},
            403: {"description": "User not authorized to join this room"}
        }
)
async def get_media_token(room_slug: str):
    return {
            "token": "generated_webrtc_token",
            "ws_url": "wss://media-rust.com",
            "ice_servers": [{"urls": "stun:stun.l.google.com:19302"}]
    }
