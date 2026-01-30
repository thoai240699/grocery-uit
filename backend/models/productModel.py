from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID


class Product(BaseModel):
    id: Optional[UUID]
    category_id: UUID
    name: str = Field(..., max_length=150)
    price: int = Field(..., ge=0)
    stock: int = Field(default=0, ge=0)
    image_url: Optional[str] = None
