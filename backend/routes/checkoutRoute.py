from fastapi import APIRouter, Depends

from controllers.checkoutController import create_checkout_controller, confirm_checkout_controller
from middlewares.VerifyUser import ValidateUser
from models import authModel
from models.checkoutModel import CreateCheckoutBody, ConfirmCheckoutBody

router = APIRouter(prefix="/api/v1/checkout", tags=["checkout"])


@router.post("/create")
def create_checkout_view(
    payload: CreateCheckoutBody,
    user_id: str = Depends(ValidateUser(authModel.RolesEnum.customer)),
):
    return create_checkout_controller(payload, user_id)


@router.post("/confirm")
def confirm_checkout_view(
    payload: ConfirmCheckoutBody,
    staff_id: str = Depends(ValidateUser(authModel.RolesEnum.staff)),
):
    return confirm_checkout_controller(payload, staff_id)
