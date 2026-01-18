from config.db import client
import bcrypt

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode('utf-8')

def registerService(data: dict):
    existing = client.table('users').select('id').eq('email', data['email']).execute()
    if existing.data:
        raise ValueError("Email đã tồn tại")
    
    data['password'] = hash_password(data['password'])

    result = client.table('users').insert(data).execute()
    if not result.data:
        raise ValueError("Không tạo được user")
    return result.data[0]