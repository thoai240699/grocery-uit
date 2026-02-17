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