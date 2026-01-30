from services.productServices import addProductService
from fastapi import HTTPException

def addProductController(product_data: dict):
    try:
        return addProductService(product_data)
    except Exception as e:
        raise HTTPException(status_code=400,detail= f"{e}")