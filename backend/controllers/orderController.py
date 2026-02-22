from fastapi import HTTPException

from services.orderServices import get_user_orders_service


def get_user_orders_controller(user_id: str):
    try:
        return get_user_orders_service(user_id)
    except HTTPException as exc:
        raise exc
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"{exc}")
