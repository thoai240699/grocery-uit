from services.categoryServices import addCategoryService
from fastapi import HTTPException

def addCategoryController(category_data: dict):
    try:
        return addCategoryService(category_data)
    except Exception as e:
        raise HTTPException(status_code=400,detail= f"{e}")