from services import cartServices
from fastapi import HTTPException, status

def addProductController(product_id, user_id):
    try:
        return cartServices.addProductService(product_id, user_id)
    except Exception as e:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, f"{e}")
    
def getProductController(product_id, user_id):
    try:
        return cartServices.getProductService(product_id, user_id)
    except Exception as e:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, f"{e}")