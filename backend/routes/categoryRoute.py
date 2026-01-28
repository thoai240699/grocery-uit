from fastapi import APIRouter
from fastapi import Depends, HTTPException, Query
import logging

from services.categoryServices import get_categories

router = APIRouter()

logger = logging.getLogger(__name__)

@router.get("/")
def list_categories():
    try:
        return get_categories()
        
    except Exception as e:
        logger.exception(e)
        raise HTTPException(status_code=404, detail="Item not found")
    