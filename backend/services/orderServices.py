from datetime import datetime
import time
import uuid

from fastapi import HTTPException, status

from config.db import client
from models import cartModel


def _load_cart_snapshot(user_id: str):
    cart_result = client.table("cart").select("id,product_id,qty").eq("is_purchased", False).eq("user_id", user_id).order("created_at", desc=False).execute()
    cart_items = cart_result.data or []

    if not cart_items:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Giỏ hàng trống")

    product_ids = [item["product_id"] for item in cart_items]
    products_result = client.table("products").select("id,name,price,image_url").in_("id", product_ids).execute()
    product_map = {item["id"]: item for item in (products_result.data or [])}

    snapshot = []
    total_amount = 0

    for cart_item in cart_items:
        product = product_map.get(cart_item["product_id"])
        if not product:
            continue

        qty = int(cart_item.get("qty") or 0)
        unit_price = float(product.get("price") or 0)
        total_price = unit_price * qty

        snapshot.append({
            "cart_id": cart_item["id"],
            "product_id": product["id"],
            "product_name": product.get("name") or "Sản phẩm",
            "product_image": product.get("image_url"),
            "unit_price": unit_price,
            "qty": qty,
            "total_price": total_price,
        })

        total_amount += total_price

    if not snapshot or total_amount <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Giỏ hàng không hợp lệ")

    return snapshot, int(total_amount)


def create_order_from_cart(user_id: str, phone_no: str, shipping_address: str, payment_method: str, payment_status: str, order_status: str):
    snapshot, total_amount = _load_cart_snapshot(user_id)
    order_code = f"ORD-{int(time.time())}-{uuid.uuid4().hex[:6].upper()}"
    source_cart_ids = [item["cart_id"] for item in snapshot]

    order_payload = {
        "order_code": order_code,
        "user_id": user_id,
        "phone_no": phone_no,
        "shipping_address": shipping_address,
        "payment_method": payment_method,
        "payment_status": payment_status,
        "order_status": order_status,
        "amount": total_amount,
        "metadata": {"source_cart_ids": source_cart_ids},
    }

    order_result = client.table("orders").insert(order_payload).execute()
    if not order_result.data:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Không thể tạo đơn hàng")

    order_id = order_result.data[0]["id"]

    order_items_payload = [
        {
            "order_id": order_id,
            "product_id": item["product_id"],
            "product_name": item["product_name"],
            "product_image": item["product_image"],
            "unit_price": item["unit_price"],
            "qty": item["qty"],
            "total_price": item["total_price"],
        }
        for item in snapshot
    ]

    client.table("order_items").insert(order_items_payload).execute()

    return {
        "order_id": order_id,
        "order_code": order_code,
        "amount": total_amount,
        "cart_item_ids": source_cart_ids,
    }


def mark_cart_items_purchased(user_id: str, cart_item_ids: list[str]):
    if not cart_item_ids:
        return

    client.table("cart").update({
        "is_purchased": True,
        "updated_at": datetime.now(cartModel.VN_TZ).isoformat(),
    }).eq("user_id", user_id).in_("id", cart_item_ids).eq("is_purchased", False).execute()


def delete_cart_items(user_id: str, cart_item_ids: list[str]):
    if not cart_item_ids:
        return

    client.table("cart").delete().eq("user_id", user_id).in_("id", cart_item_ids).eq("is_purchased", False).execute()


def mark_order_paid_and_confirmed(staff_id: str, order_id: str, payment_method: str):
    order_result = client.table("orders").select("id,user_id,order_code,payment_method,payment_status,metadata").eq("id", order_id).execute()
    if not order_result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy đơn hàng")

    order = order_result.data[0]

    if order.get("payment_method") != payment_method:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Sai phương thức thanh toán")

    if order.get("payment_status") == "paid":
        return {
            "order_id": order["id"],
            "order_code": order.get("order_code"),
            "already_paid": True,
        }

    metadata = order.get("metadata") if isinstance(order.get("metadata"), dict) else {}
    metadata = {
        **metadata,
        "payment_confirmed_by": staff_id,
        "payment_confirmed_at": datetime.now(cartModel.VN_TZ).isoformat(),
    }

    client.table("orders").update({
        "payment_status": "paid",
        "order_status": "confirmed",
        "metadata": metadata,
    }).eq("id", order_id).execute()

    source_cart_ids = metadata.get("source_cart_ids") if isinstance(metadata, dict) else []
    order_user_id = order.get("user_id")
    if order_user_id:
        mark_cart_items_purchased(user_id=order_user_id, cart_item_ids=source_cart_ids or [])

    return {
        "order_id": order["id"],
        "order_code": order.get("order_code"),
        "already_paid": False,
    }


def get_user_orders_service(user_id: str):
    orders_result = client.table("orders").select("id,order_code,payment_method,payment_status,order_status,amount,created_at").eq("user_id", user_id).order("created_at", desc=True).execute()
    orders = orders_result.data or []

    if not orders:
        return []

    order_ids = [order["id"] for order in orders]
    items_result = client.table("order_items").select("order_id,product_id,product_name,product_image,unit_price,qty,total_price").in_("order_id", order_ids).execute()
    items = items_result.data or []

    item_map = {}
    for item in items:
        order_id = item["order_id"]
        if order_id not in item_map:
            item_map[order_id] = []
        item_map[order_id].append(item)

    result = []
    for order in orders:
        order_items = item_map.get(order["id"], [])
        result.append({
            "id": order["id"],
            "order_code": order.get("order_code"),
            "payment_method": order.get("payment_method"),
            "payment_status": order.get("payment_status"),
            "order_status": order.get("order_status"),
            "amount": order.get("amount") or 0,
            "created_at": order.get("created_at"),
            "items": order_items,
        })

    return result
