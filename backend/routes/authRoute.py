from fastapi import APIRouter
from controllers.authController import registerController
from controllers.authController import loginController
from models.authModel import RegisterUser
from models.authModel import LoginUser
router = APIRouter(prefix="/api/v1/auth", tags=['auth'])

@router.post("/register")
def registerView(data: RegisterUser):
    return registerController(data.model_dump(mode="json"))

@router.post("/login")
def LoginView(data: LoginUser):
    return loginController(data.model_dump(mode="json"))