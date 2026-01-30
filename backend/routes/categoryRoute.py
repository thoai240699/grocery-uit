from fastapi import APIRouter
from fastapi import Depends, HTTPException, Query
import logging

from services.categoryServices import get_categories
from controllers.categoryController import addCategoryController
from middlewares.VerifyUser import ValidateUser
from models import authModel
from models.categoryModel import Category

router = APIRouter(prefix="/api/v1/categories",tags=['Product'])

logger = logging.getLogger(__name__)

@router.get("/")
def list_categories():
    try:
        return get_categories()
        
    except Exception as e:
        logger.exception(e)
        raise HTTPException(status_code=404, detail="Item not found")

@router.post("/add")
def create_category(category: Category, userId: str = Depends(ValidateUser(authModel.RolesEnum.staff))):
    return addCategoryController(category.dict())