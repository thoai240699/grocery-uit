from fastapi import Request,HTTPException
import jwt 
from config.Env import ENVConfig

def verifyToken(req:Request):
    authorization =  req.headers.get("Authorization","")
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401,"Vui lòng đăng nhập")

    token = authorization.split(" ")[1]
    if not token :
        raise HTTPException(401,"Token không hợp lệ")

    try:
        payload = jwt.decode(token,ENVConfig.SECRET_KEY,algorithms=["HS256"])
        return payload['id']
    except Exception as e:
        raise HTTPException(401,f"{e}")
 


    
