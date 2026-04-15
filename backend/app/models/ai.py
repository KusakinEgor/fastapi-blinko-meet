from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class SummaryOut(BaseModel):
    id: int = Field(..., examples=[1])
    room_id: str = Field(..., examples=["71k3cu-psw-OB1QX"])
    summary_text: str = Field(
            ...,
            description="Generated GigaChat shortly sum meeting",
            examples=["Talking about include FastAPI and migration on PostgreSQL. Set deadline on friday."]
    )
    created_at: datetime = Field(..., examples=["2026-10-24T14:20:00"])

    class Config:
        from_attributes = True

class SummaryCreate(BaseModel):
    room_id: str = Field(..., examples=["71k3cu-psw-OB1QX"])
    transcript: str = Field(
            ...,
            description="Full text of the meeting to be summarized",
            examples=["User1: Hello. User2: Let's discuss the project..."]
    )
    detail_level: Optional[str] = Field("medium", examples=["short", "medium", "long"], description="Lvl details")

class SummaryTaskResponse(BaseModel):
    task_id: str = Field(..., examples=["550e8400-e29b-41d4-a716-446655440000"])
    status: str = Field(..., examples=["processing"], description="Status task")
