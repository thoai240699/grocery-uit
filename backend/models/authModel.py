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

class UpdateBasicDetails(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    dob: Optional[date] = None

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: Optional[str]):
        if value is None:
            return value
        if len(value.strip()) < 3:
            raise ValueError("Tên phải có ít nhất 3 ký tự")
        return value