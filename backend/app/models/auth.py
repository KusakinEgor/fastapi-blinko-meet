from pydantic import BaseModel, EmailStr, Field

class Registration(BaseModel):
    username: str = Field(..., min_length=1, examples=["CoolGuest123"], description="User's unique email address")
    email: EmailStr = Field(..., examples=["user@example.com"], description="User's email")
    password: str = Field(..., min_length=3, max_length=72,examples=["StrongPass123!"], description="User's secure password")

class UserResponse(BaseModel):
    id: int = Field(..., examples=[1])
    username: str = Field(..., examples=["CoolGuest123"])
    email: EmailStr = Field(..., examples=["user@examples.com"])
    display_name: str | None = Field(None, examples=["John Doe"])

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str = Field(..., examples=["eyJhbGciOiJIUzI1Ni..."])
    token_type: str = "bearer"

class Login(BaseModel):
    username: str = Field(..., min_length=1, examples=["CoolGuest123"])
    password: str = Field(..., min_length=3, examples=["StrongPass123"])
    email: EmailStr = Field(..., examples=["user@example.com"])

