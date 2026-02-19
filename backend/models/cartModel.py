from pydantic import BaseModel, Field
from datetime import datetime, timezone, timedelta

VN_TZ = timezone(timedelta(hours=7))

class AddNewProduct(BaseModel):
    product_id: str 

class AddProduct(BaseModel):
    product_id: str
    user_id: str
    qty: int = Field(default=1)
    is_purchased: bool = Field(default=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(VN_TZ))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(VN_TZ))