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
    name: str = Field(...)
    email: EmailStr = Field(...)
    password: str = Field(...)
    role: RolesEnum = Field(default=RolesEnum.customer)
    phone: Optional[str] = None
    address: Optional[str] = None
    dob: Optional[date] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(VN_TZ))

    @field_validator('name')
    @classmethod
    def validate_name(cls, value: str) -> str:
        if len(value) < 2:
            raise ValueError("Tên phải chứa ít nhất 2 ký tự")
        return value.strip()

class RegisterUser(User):
    pass
    