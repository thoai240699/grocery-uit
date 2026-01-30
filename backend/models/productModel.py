from pydantic import BaseModel, Field, root_validator
from typing import Optional
from uuid import UUID, uuid4
from config.db import client


class Product(BaseModel):
    id: Optional[UUID] = Field(default_factory=uuid4) 
    category_id: UUID
    name: str = Field(..., max_length=150)
    price: int = Field(..., ge=0)
    stock: int = Field(default=0, ge=0)
    image_url: Optional[str] = None

    @root_validator(pre=True)
    def validate_category(cls, values):
        category_id = values.get("category_id")
        if category_id:
            try:
                category = client.table("categories").select("id").eq("id", category_id).execute()
                if not category.data:
                    raise ValueError("Danh mục không tồn tại")
            except Exception as e:
                raise ValueError(f"Error validating category_id: {category_id}. Details: {str(e)}")
        return values

    def dict(self, *args, **kwargs):
        data = super().dict(*args, **kwargs)
        if "id" in data and isinstance(data["id"], UUID):
            data["id"] = str(data["id"])
        if "category_id" in data and isinstance(data["category_id"], UUID):
            data["category_id"] = str(data["category_id"])
        return data
