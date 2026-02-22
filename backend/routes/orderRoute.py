from fastapi import APIRouter, Depends

from controllers.orderController import get_user_orders_controller
from middlewares.VerifyUser import ValidateUser
from models import authModel

router = APIRouter(prefix="/api/v1/orders", tags=["orders"])


@router.get("")
def get_user_orders_view(user_id: str = Depends(ValidateUser(authModel.RolesEnum.customer))):
    return get_user_orders_controller(user_id)
