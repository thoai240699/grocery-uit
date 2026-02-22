from fastapi import HTTPException, status
from datetime import datetime

from config.db import client
from models import cartModel
from services.orderServices import mark_cart_items_purchased


ALLOWED_ORDER_STATUS = {
	"pending_payment",
	"confirmed",
	"shipping",
	"delivered",
	"cancelled",
}


def get_orders(page: int = 1, limit: int = 20, order_status: str | None = None):
	start = (page - 1) * limit
	end = start + limit - 1

	query = (
		client
		.table("orders")
		.select("id,order_code,user_id,payment_method,payment_status,order_status,amount,created_at")
		.order("created_at", desc=True)
		.range(start, end)
	)

	if order_status:
		query = query.eq("order_status", order_status)

	res = query.execute()

	return {
		"page": page,
		"limit": limit,
		"items": res.data or []
	}


def update_order_status(order_id: str, next_status: str, staff_id: str):
	if next_status not in ALLOWED_ORDER_STATUS:
		raise HTTPException(
			status_code=status.HTTP_400_BAD_REQUEST,
			detail="order_status không hợp lệ"
		)

	existing = (
		client
		.table("orders")
		.select("id,order_code,user_id,payment_method,order_status,payment_status,metadata")
		.eq("id", order_id)
		.execute()
	)

	if not existing.data:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy đơn hàng")

	order = existing.data[0]
	metadata = order.get("metadata") if isinstance(order.get("metadata"), dict) else {}
	should_mark_paid = next_status in {"confirmed", "delivered"} and order.get("payment_status") != "paid"

	update_payload = {
		"order_status": next_status,
	}

	if should_mark_paid:
		update_payload["payment_status"] = "paid"
		update_payload["metadata"] = {
			**metadata,
			"payment_confirmed_by": staff_id,
			"payment_confirmed_at": datetime.now(cartModel.VN_TZ).isoformat(),
		}

	updated = (
		client
		.table("orders")
		.update(update_payload)
		.eq("id", order_id)
		.execute()
	)

	if not updated.data:
		raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Không thể cập nhật đơn hàng")

	if should_mark_paid:
		source_cart_ids = metadata.get("source_cart_ids") if isinstance(metadata, dict) else []
		order_user_id = order.get("user_id")
		if order_user_id and source_cart_ids:
			mark_cart_items_purchased(user_id=order_user_id, cart_item_ids=source_cart_ids)

	return updated.data[0]
