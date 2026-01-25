from fastapi import APIRouter, Depends
from controllers.authController import registerController
from controllers.authController import loginController
from controllers.authController import profileController
from models.authModel import RegisterUser
from models.authModel import LoginUser
from middlewares.VerifyToken import verifyToken

router = APIRouter(prefix="/api/v1/auth", tags=['auth'])

@router.post("/register")
def registerView(data: RegisterUser):
    return registerController(data)

@router.post("/login")
def LoginView(data: LoginUser):
    return loginController(data)

@router.get("/profile")
def profileView(id = Depends(verifyToken)):
    return profileController(id)