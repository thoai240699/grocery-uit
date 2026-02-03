from fastapi import APIRouter
from fastapi import Depends, HTTPException, Query
import logging

from models.chatMessageModel import ChatMessage
from services.chatbotService import chat

router = APIRouter(prefix="/api/v1/chat", tags=['Chat'])

@router.post("/")
def create_chat_message(chat_message: ChatMessage):
    answer = chat(chat_message.message)
    return {"answer": answer}