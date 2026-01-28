from services.authServices import registerService
from services.authServices import loginService
from services.authServices import profileService
from services.authServices import updateAvatarService
from services.authServices import updateBasicDetailsService
from models.authModel import RegisterUser
from models.authModel import LoginUser
from fastapi import HTTPException

def registerController(data: RegisterUser):
    try:
        return registerService(data.model_dump(mode="json"))
    except Exception as e:
        raise HTTPException(status_code=400,detail= f"{e}")

def loginController(data: LoginUser):
    try:
        return loginService(data.model_dump())
    except Exception  as  e:
        raise HTTPException(status_code=400,detail= f"{e}")
    
def profileController(id: str):
    try:
        return profileService(id)
    except HTTPException as e:
        raise e
    except Exception  as  e:
        raise HTTPException(status_code=400,detail= f"{e}")
    
def updateAvatarController(avatar, userId):
    try:
        return updateAvatarService(avatar,userId)
    except Exception as e:
        raise HTTPException(status_code=400,detail= f"{e}")
    
def UpdateBasicDetailsController(data, userId):
    try:
        return updateBasicDetailsService(data.model_dump(mode="json"), userId)
    except Exception as e:
        raise HTTPException(status_code=400,detail= f"{e}")