from pydantic import BaseModel, EmailStr, Field

class Registration(BaseModel):
    username: str = Field(..., min_length=1, description="Имя пользователя не должно быть пустым")
    email: EmailStr = Field(..., description="Email обязателен")
    password: str = Field(..., min_length=3, max_length=72, description="Пароль не может быть пустым и минимум 6 символов")

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    display_name: str | None

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class Login(BaseModel):
    username: str = Field(..., min_length=1)
    password: str = Field(..., min_length=3)
    email: EmailStr = Field(..., min_length=5)

