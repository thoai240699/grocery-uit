from fastapi import APIRouter
from controllers.authController import registerController
from models.authModel import User as RegisterUser

router = APIRouter(prefix="/api/v1/auth", tags=['auth'])

@router.post("/register")
def registerView(data: RegisterUser):
    return registerController(data.model_dump(mode="json"))