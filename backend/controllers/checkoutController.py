from fastapi import HTTPException
from models.checkoutModel import CreateCheckoutBody, ConfirmCheckoutBody
from services.checkoutServices import create_checkout_service, confirm_checkout_service


def create_checkout_controller(payload: CreateCheckoutBody, user_id: str):
    try:
        return create_checkout_service(
            user_id=user_id,
            phone_no=payload.phone_no,
            address=payload.address,
            payment_method=payload.payment_method,
        )
    except HTTPException as exc:
        raise exc
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"{exc}")


def confirm_checkout_controller(payload: ConfirmCheckoutBody, user_id: str):
    try:
        return confirm_checkout_service(
            user_id=user_id,
            order_id=payload.order_id,
            payment_method=payload.payment_method,
        )
    except HTTPException as exc:
        raise exc
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"{exc}")
