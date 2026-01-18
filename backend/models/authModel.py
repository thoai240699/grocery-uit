from pydantic import BaseModel, Field, EmailStr, field_validator
from datetime import datetime, timezone, timedelta
from enum import Enum

VN_TZ = timezone(timedelta(hours=7))

class RolesEnum(str, Enum):
    staff = "staff"
    customer = "customer"

class User(BaseModel):
    name:str = Field(...)
    email:EmailStr = Field(...)
    password:str = Field(..., min_length=6 )
    create_at:datetime = Field(default_factory=lambda: datetime.now(VN_TZ))
    update_at:datetime = Field(default_factory=lambda: datetime.now(VN_TZ))
    role:RolesEnum = Field(default= RolesEnum.customer)

    @field_validator('name')
    @classmethod
    def validate_name(cls, value: str) -> str:
        if len(value) < 6:
            raise ValueError("Tên phải chứa ít nhất 6 ký tự")
        return value

class RegisterUser(User):
    pass
    