import asyncio
from fastapi import WebSocket
from typing import Dict, List

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room_id: str):
        await websocket.accept()
        self.active_connections.setdefault(room_id, []).append(websocket)

    def disconnect(self, websocket: WebSocket, room_id: str):
        if room_id in self.active_connections:
            if websocket in self.active_connections[room_id]:
                self.active_connections[room_id].remove(websocket)

    async def broadcast(self, message: bytes, room_id: str, sender: WebSocket):
        connections = self.active_connections.get(room_id, [])

        if not connections:
            return

        tasks = []
        for connection in connections:
            if connection != sender:
                asyncio.create_task(self._safe_send(connection, message, room_id))

        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)

    async def _safe_send(self, websocket: WebSocket, message: bytes, room_id: str):
        try:
            await websocket.send_bytes(message)
        except Exception:
            self.disconnect(websocket, room_id)

audio_manager = ConnectionManager()
