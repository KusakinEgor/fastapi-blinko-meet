from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserAdminOut(BaseModel):
    id: int = Field(..., examples=[1])
    username: str = Field(..., examples=["Ivan_Zolo"])
    email: EmailStr = Field(..., examples=["ivan_zolo2006@gmail.com"])
    status: str = Field(..., examples=["PRO"], description="User subscription status or role")
    likes: int = Field(0, examples=[1337])
    is_active: bool = Field(True, examples=[True])
    created_at: datetime = Field(..., examples=["2023-10-24T14:20:00"])

    class Config:
        from_attributes = True

class UserAdminUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=1, examples=["NewName"])
    email: Optional[EmailStr] = Field(None, examples=["new_email@examples.com"])
    password: Optional[str] = Field(None, min_length=3, examples=["CustomPass123"])
    status: Optional[str] = Field(None, examples=["PRO", "FREE", "ADMIN"])
    likes: Optional[int] = Field(None, examples=[100])
    is_active: Optional[bool] = Field(None, examples=[True])

    class Config:
        from_attributes = True

class AdminStatsResponse(BaseModel):
    total_users: int = Field(..., examples=[150])
    pro_users: int = Field(..., examples=[45])
    total_likes: int = Field(..., examples=[13370])

class AuditLogModel(BaseModel):
    id: int = Field(..., examples=[1])
    action: str = Field(..., examples=["USER_DELETED"], description="Type of administrative action")
    details: str = Field(..., examples=["Admin admin_user deleted user test_user (ID: 5)"])
    created_at: datetime = Field(..., examples=["2023-10-24T14:20:00"])

    class Config:
        from_attributes = True
