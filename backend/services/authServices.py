from config.db import client
import bcrypt
from fastapi.exceptions import HTTPException as HttpException
import uuid
import jwt
from datetime import datetime, timedelta

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

def loginService(data: dict):
    user = client.table('users').select('*').eq('email', data['email']).execute()
    if not user.data:
        raise HttpException(status_code=404, detail="Email không tồn tại")
    
    user_data = user.data[0]

    if not bcrypt.checkpw(data['password'].encode('utf-8'), user_data['password'].encode('utf-8')):
        raise HttpException(status_code=400, detail="Mật khẩu không chính xác")
    
    # 3. Tạo Token (JWT)
    payload = {
        "id": user_data['id'],
        "email": user_data['email'],
        "role": user_data['role'],
        "exp": datetime.utcnow() + timedelta(days=7) # Token hết hạn sau 7 ngày
    }
    token = jwt.encode(payload, "SECRET_KEY", algorithm="HS256") # Thay "SECRET_KEY" bằng biến môi trường thực tế
    
    return {
        "msg": "Đăng nhập thành công",
        "token": token
    }