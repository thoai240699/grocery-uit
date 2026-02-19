from controllers import cartController
from fastapi import APIRouter, Depends
from middlewares.VerifyUser import ValidateUser
from models import authModel, cartModel

router = APIRouter(prefix="/api/v1/cart", tags=['cart'])

@router.post("/add")
def addProductView(
    data: cartModel.AddNewProduct,
    user_id: str = Depends(ValidateUser(authModel.RolesEnum.customer))):
    return cartController.addProductController(data.product_id, user_id)

@router.get("/get/{product_id}")
def getProductView(
    product_id: str,
    user_id: str = Depends(ValidateUser(authModel.RolesEnum.customer))):
    return cartController.getProductController(product_id, user_id)