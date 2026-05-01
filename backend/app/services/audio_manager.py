import asyncio
import json
from fastapi import WebSocket
from typing import Dict, List
from concurrent.futures import ThreadPoolExecutor
from vosk import Model, KaldiRecognizer

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

        try:
            self.model = Model("vosk_model")
            print("Vosk Model loaded successfully")
        except Exception as e:
            print(f"Error loading Vosk Model: {e}")
            self.model = None

        self.recognizers: Dict[str, KaldiRecognizer] = {}
        self.executor = ThreadPoolExecutor(max_workers=4)

    async def connect(self, websocket: WebSocket, room_id: str):
        await websocket.accept()
        self.active_connections.setdefault(room_id, []).append(websocket)

        if self.model and room_id not in self.recognizers:
            self.recognizers[room_id] = KaldiRecognizer(self.model, 16000)

    def disconnect(self, websocket: WebSocket, room_id: str):
        if room_id in self.active_connections:
            if websocket in self.active_connections[room_id]:
                self.active_connections[room_id].remove(websocket)

            if not self.active_connections[room_id]:
                del self.active_connections[room_id]
                if room_id in self.recognizers:
                    del self.recognizers[room_id]
    
    def _run_recognition(self, room_id: str, message: bytes):
        rec = self.recognizers.get(room_id)

        if not rec:
            return None

        if rec.AcceptWaveform(message):
            result = json.loads(rec.Result())
            return result.get("text")
        return None

    async def broadcast(self, message: bytes, room_id: str, sender: WebSocket):
        connections = self.active_connections.get(room_id, [])

        if not connections:
            return

        for connection in connections:
            if connection != sender:
                asyncio.create_task(self._safe_send(connection, message, room_id))

        if self.model and room_id in self.recognizers:
            loop = asyncio.get_event_loop()
            recognized_text = await loop.run_in_executor(
                    self.executor, self._run_recognition, room_id, message
            )

            if recognized_text:
                print(f"РАСПОЗНАНО ({room_id}): {recognized_text}")
                transcript_data = json.dumps({
                    "type": "transcript",
                    "text": recognized_text,
                    "userName": "Участник"
                })

                for connection in connections:
                    asyncio.create_task(connection.send_text(transcript_data))

    async def _safe_send(self, websocket: WebSocket, message: bytes, room_id: str):
        try:
            await websocket.send_bytes(message)
        except Exception:
            self.disconnect(websocket, room_id)

audio_manager = ConnectionManager()
