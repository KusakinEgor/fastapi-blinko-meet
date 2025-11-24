from pydantic import BaseModel, EmailStr, Field

class Registration(BaseModel):
    username: str = Field(..., min_length=1, description="Имя пользователя не должно быть пустым")
    email: EmailStr = Field(..., description="Email обязателен")
    password: str = Field(..., min_length=6, description="Пароль не может быть пустым и минимум 6 символов")

class SuccessRegister(BaseModel):
    done: bool

class Login(BaseModel):
    username: str = Field(..., min_length=1)
    password: str = Field(..., min_length=6) 
