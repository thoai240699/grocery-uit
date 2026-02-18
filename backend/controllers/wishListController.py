from fastapi import status, HTTPException
from services import wishListService

def toggleProductController(product_id, user_id):
    try:
        return wishListService.toggleProductService(product_id, user_id)
    except Exception as e:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, f"{e}")


def getProductController(product_id, user_id):
    try:
        return wishListService.getProductService(product_id, user_id)
    except Exception as e:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, f"{e}")

def getProductsController(user_id):
    try:
        return wishListService.getProductsService(user_id)
    except Exception as e:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, f"{e}")

def deleteProductController(product_id, user_id):
    try:
        return wishListService.deleteProductService(product_id, user_id)
    except Exception as e:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, f"{e}")
    