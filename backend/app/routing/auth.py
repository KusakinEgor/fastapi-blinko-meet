from fastapi import APIRouter
from app.models.auth import Registration, Login, SuccessRegister

router = APIRouter()

@router.post("/register")
async def register(
    data: Registration
) -> SuccessRegister:
    pass

@router.post("/login")
async def login(
    data: Login
) -> SuccessRegister:
    pass
