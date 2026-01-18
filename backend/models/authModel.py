from pydantic import BaseModel, Field, EmailStr
from datetime import datetime, timezone, timedelta


VN_TZ = timezone(timedelta(hours=7))

class User(BaseModel):
    name:str = Field(...)
    email:EmailStr = Field(...)
    password:str = Field(..., min_length=6 )
    create_at:datetime = Field(default_factory=lambda: datetime.now(VN_TZ))
    update_at:datetime = Field(
        default_factory=lambda: datetime.now(VN_TZ),
        # sa_column_kwargs={'onupdate': lambda: datetime.now(VN_TZ)}
        )
    role:str