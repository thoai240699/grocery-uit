from config.db import client
import bcrypt
from fastapi.exceptions import HTTPException as HttpException
import uuid
import jwt
from datetime import datetime, timedelta, timezone
from config.Env import ENVConfig

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode('utf-8')


def registerService(data: dict):
    existing = client.table('users').select('id').eq('email', data['email']).execute()
    if existing.data:
        raise HttpException(status_code=400, detail="Email đã được sử dụng")
    
    if not data.get('name'):
        data['name'] = f"User_{str(uuid.uuid4())[:8]}"

    data['password'] = hash_password(data['password'])

    result = client.table('users').insert(data).execute()
    print(result)
    if not result.data:
        raise ValueError("Không tạo được user")
    user_data = result.data[0]
    payload = {
        "id": user_data['id'],
        "email": user_data['email'],
        "role": user_data['role'],
        "exp": datetime.now(timezone.utc) + timedelta(days=7)
    }
    token = jwt.encode(payload, ENVConfig.SECRET_KEY, algorithm="HS256")

    return {
        "msg": "Đăng ký thành công", 
        "token": token
    }

def loginService(data: dict):
    user = client.table('users').select('*').eq('email', data['email']).execute()
    if not user.data:
        raise HttpException(status_code=404, detail="Tài khoản không tồn tại")
    
    user_data = user.data[0]

    if not bcrypt.checkpw(data['password'].encode('utf-8'), user_data['password'].encode('utf-8')):
        raise HttpException(status_code=400, detail="Đăng nhập thất bại")
        
    payload = {
        "id": user_data['id'],
        "email": user_data['email'],
        "role": user_data['role'],
        "exp": datetime.now(timezone.utc) + timedelta(days=7)
    }
    token = jwt.encode(payload, ENVConfig.SECRET_KEY, algorithm="HS256")
    
    return {
        "msg": "Đăng nhập thành công",
        "token": token
    }