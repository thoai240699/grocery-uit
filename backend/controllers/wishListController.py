from fastapi import status, HTTPException
from services import wishListServices

def toggleProductController(product_id, user_id):
    try:
        return wishListServices.toggleProductService(product_id, user_id)
    except Exception as e:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, f"{e}")


def getProductController(product_id, user_id):
    try:
        return wishListServices.getProductService(product_id, user_id)
    except Exception as e:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, f"{e}")

def getProductsController(user_id):
    try:
        return wishListServices.getProductsService(user_id)
    except Exception as e:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, f"{e}")

def deleteProductController(product_id, user_id):
    try:
        return wishListServices.deleteProductService(product_id, user_id)
    except Exception as e:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, f"{e}")
    