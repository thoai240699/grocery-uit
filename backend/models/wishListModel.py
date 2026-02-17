from pydantic import BaseModel, Field
from datetime import datetime, timezone, timedelta

VN_TZ = timezone(timedelta(hours=7))

class ToggleProduct(BaseModel):
    product_id: str = Field(...)

    