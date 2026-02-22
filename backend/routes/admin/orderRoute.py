from fastapi import APIRouter, Depends, HTTPException, Query
import logging

import services.admin.orderServices as orderServices
from middlewares.VerifyUser import ValidateUser
from models import authModel

router = APIRouter(prefix="/api/v1/admin/orders", tags=['Admin Orders'])

logger = logging.getLogger(__name__)


@router.get("/")
def list_orders(
	page: int = Query(1, ge=1),
	limit: int = Query(20, ge=1, le=100),
	order_status: str | None = Query(None),
	user_id: str = Depends(ValidateUser(authModel.RolesEnum.staff))
):
	try:
		return orderServices.get_orders(
			page=page,
			limit=limit,
			order_status=order_status,
		)
	except HTTPException as exc:
		raise exc
	except Exception as exc:
		logger.exception(exc)
		raise HTTPException(status_code=400, detail=f"{exc}")


@router.put("/{order_id}/status/{next_status}")
def change_order_status(
	order_id: str,
	next_status: str,
	user_id: str = Depends(ValidateUser(authModel.RolesEnum.staff))
):
	try:
		return orderServices.update_order_status(order_id, next_status, user_id)
	except HTTPException as exc:
		raise exc
	except Exception as exc:
		logger.exception(exc)
		raise HTTPException(status_code=400, detail=f"{exc}")
