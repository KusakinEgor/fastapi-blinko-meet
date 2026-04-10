from pydantic import BaseModel, Field
from datetime import datetime

class MessageCreate(BaseModel):
    content: str = Field(..., min_length=1, examples=["Hello everyone!"], description="The text content of the message")

class MessageResponse(BaseModel):
    id: int = Field(..., examples=[101])
    content: str = Field(..., examples=["Hello everyone!"])
    user_id: int = Field(..., examples=[1])
    created_at: datetime = Field(..., examples=["2023-10-27T10:00:00"])

    class Config:
        from_attributes = True
