from config.db import client
import bcrypt
from fastapi.exceptions import HTTPException as HttpException
import uuid
import jwt
from datetime import datetime, timedelta, timezone
from config.Env import ENVConfig
import cloudinary.uploader
from typing import Annotated
from fastapi import UploadFile, File
import config.cloudinaryConfig

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

def profileService(id: str):
    user = client.table('users').select('id','name','email','role','phone','address','dob','created_at','avatar_image_uri','avatar_public_id').eq('id', id).execute()
    if not user.data:
        raise HttpException(status_code=404, detail="Tài khoản không tồn tại")
    return user.data[0]

def updateAvatarService(avatar:Annotated[UploadFile,File()],userId:str):
        user = client.table('users').select('id', 'avatar_image_uri', 'avatar_public_id').eq('id', userId).execute()
        if not user.data:
            raise HttpException(status_code=404, detail="Tài khoản không tồn tại")
        user_data = user.data[0]

        if user_data.get('avatar_public_id'):
            cloudinary.uploader.destroy(user_data['avatar_public_id'])

        contents = avatar.file.read()
        upload_result = cloudinary.uploader.upload(contents, folder="user_profile")

        update_result = client.table('users').update({
            "avatar_image_uri": upload_result['secure_url'],
            "avatar_public_id": upload_result['public_id'],
        }).eq('id', userId).execute()
        if not update_result.data:
            raise HttpException(status_code=400, detail="Không cập nhật được avatar")
        return {
            "msg": "Cập nhật avatar thành công",
        }

def updateBasicDetailsService(data: dict, userId: str):
    update_data = {}
    allowed_fields = ['name', 'phone', 'address', 'dob']
    for field in allowed_fields:
        if field in data:
            update_data[field] = data[field]
    
    if not update_data:
        raise HttpException(status_code=400, detail="Không có dữ liệu để cập nhật")
    
    update_result = client.table('users').update(update_data).eq('id', userId).execute()
    if not update_result.data:
        raise HttpException(status_code=400, detail="Không cập nhật được thông tin")
    
    return {
        "msg": "Cập nhật thông tin thành công",
    }
