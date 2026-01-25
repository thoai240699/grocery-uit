from services.authServices import registerService
from services.authServices import loginService
from services.authServices import profileService
from models.authModel import RegisterUser
from models.authModel import LoginUser
from fastapi import HTTPException

def registerController(data: RegisterUser):
    try:
        return registerService(data.model_dump())
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
    except Exception  as  e:
        raise HTTPException(status_code=400,detail= f"{e}")
    
