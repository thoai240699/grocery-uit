from fastapi import status, HTTPException
from services import wishListService

def toggleProductController(product_id, user_id):
    try:
        return wishListService.toggleProductService(product_id, user_id)
    except Exception as e:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, f"{e}")


