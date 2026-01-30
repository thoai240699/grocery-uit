from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID

class Category(BaseModel):
    id: Optional[UUID]
    slug: str = Field(..., max_length=200)
    name: str = Field(..., max_length=100)
    description: Optional[str] = None