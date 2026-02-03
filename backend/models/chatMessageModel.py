from pydantic import BaseModel
from typing import Optional

class ChatMessage(BaseModel):
    message: str
    user_id: Optional[str] = "anonymous"

