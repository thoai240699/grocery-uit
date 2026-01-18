from fastapi import APIRouter
from controllers.authController import registerController
from typing import Any

router = APIRouter(prefix="/api/v1/auth", tags=['auth'])

@router.post("/register")
def registerView(data:Any):
    return registerController(data)