from middlewares.VerifyToken import verifyToken
from fastapi import Depends,HTTPException,status
from models.authModel import RolesEnum
from config.db import client

def ValidateUser(role: RolesEnum):
    def wrapper(user_id: str = Depends(verifyToken)):
        user_response = client.table('users').select('role').eq('id', user_id).execute()
        if not user_response.data:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Không tìm thấy user")

        user = user_response.data[0]
        if user['role'] != role.value:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"User không có role {role.value}")

        return user_id
    return wrapper