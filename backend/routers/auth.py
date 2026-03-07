from fastapi import APIRouter, HTTPException
from models.schemas import LoginRequest, User

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/login", response_model=User)
async def login(request: LoginRequest):
    # Mock authentication
    if request.email and request.password:
        return User(
            email=request.email,
            nombre="Usuario Demo",
            token="mock-jwt-token-12345"
        )
    raise HTTPException(status_code=400, detail="Invalid credentials")

@router.post("/logout")
async def logout():
    return {"message": "Logged out"}

@router.get("/me", response_model=User)
async def get_me():
    return User(
        email="demo@financial-hub.es",
        nombre="Usuario Demo"
    )
