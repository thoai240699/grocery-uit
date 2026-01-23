from config.db import client
import bcrypt
from fastapi.exceptions import HTTPException as HttpException
import uuid

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
    if not result.data:
        raise ValueError("Không tạo được user")
    return {
        "msg": "Đăng ký thành công", 
    }