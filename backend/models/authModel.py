from pydantic import BaseModel, Field, EmailStr, field_validator
from datetime import datetime, timezone, timedelta, date
from enum import Enum
from typing import Optional

VN_TZ = timezone(timedelta(hours=7))

class RolesEnum(str, Enum):
    admin = "admin"
    staff = "staff"
    customer = "customer"

class User(BaseModel):
    name: Optional[str] = None
    email: EmailStr = Field(...)
    password: str = Field(...)
    role: RolesEnum = Field(default=RolesEnum.customer)
    phone: Optional[str] = None
    address: Optional[str] = None
    dob: Optional[date] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(VN_TZ))
    avatar_image_uri: Optional[str] = None
    avatar_public_id: Optional[str] = None


class RegisterUser(User):
    pass

class LoginUser(BaseModel):
    email: EmailStr = Field(...)
    password: str = Field(...)
    