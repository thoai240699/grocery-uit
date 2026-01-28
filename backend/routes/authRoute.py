from fastapi import APIRouter, Depends, UploadFile, File
from controllers.authController import registerController
from controllers.authController import loginController
from controllers.authController import profileController
from controllers.authController import updateAvatarController
from controllers.authController import UpdateBasicDetailsController
from models.authModel import RegisterUser
from models.authModel import LoginUser
from models.authModel import UpdateBasicDetails
from middlewares.VerifyToken import verifyToken
from typing import Annotated

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

@router.put("/update-avatar")
def updateAvatar(avatar:Annotated[UploadFile,File()],userId = Depends(verifyToken)):
    return updateAvatarController(avatar,userId)

@router.put("/update-basic-details")
def UpdateBasicDetailsView(data: UpdateBasicDetails, userId = Depends(verifyToken)):
    return UpdateBasicDetailsController(data, userId)
