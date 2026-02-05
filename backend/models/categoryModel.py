from pydantic import BaseModel, Field
from typing import Optional

class Category(BaseModel):
    name: str = Field(..., max_length=100)
    description: Optional[str] = None
    slug: Optional[str] = Field(default=None, max_length=200)