from fastapi import APIRouter, Depends
from controllers import wishListController
from models import wishListModel, authModel
from middlewares.VerifyUser import ValidateUser

router = APIRouter(prefix="/api/v1/wishlist", tags=["wishlist"])

@router.post("/toggle")
def toggleProductView(
    data: wishListModel.ToggleProduct, 
    user_id: str = Depends(ValidateUser(authModel.RolesEnum.customer))
    ):
    return wishListController.toggleProductController(data.product_id, user_id)

@router.get("/get/{product_id}")
def toggleProductView(product_id: str, user_id: str = Depends(ValidateUser(authModel.RolesEnum.customer))):
    return wishListController.getProductController(product_id, user_id)

@router.get("/get")
def getProductsView(user_id: str = Depends(ValidateUser(authModel.RolesEnum.customer))):
    return wishListController.getProductsController(user_id)

@router.delete("/delete/{product_id}")
def deleteProductView(product_id: str, user_id: str = Depends(ValidateUser(authModel.RolesEnum.customer))):
    return wishListController.deleteProductController(product_id, user_id)