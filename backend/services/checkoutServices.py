from datetime import datetime
import time
import uuid
from urllib.parse import quote

from fastapi import HTTPException, status

from config.Env import ENVConfig
from config.db import client
from models import cartModel
from models.checkoutModel import PaymentMethod


def _mark_cart_purchased(user_id: str):
    if not user_id:
        return
    client.table("cart").update({
        "is_purchased": True,
        "updated_at": datetime.now(cartModel.VN_TZ).isoformat(),
    }).eq("user_id", user_id).eq("is_purchased", False).execute()


def _get_cart_total(user_id: str) -> int:
    cart_result = client.table("cart").select("product_id,qty").eq("is_purchased", False).eq("user_id", user_id).execute()
    cart_items = cart_result.data or []

    if not cart_items:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Giỏ hàng trống")

    product_ids = [item["product_id"] for item in cart_items]
    products_result = client.table("products").select("id,price").in_("id", product_ids).execute()
    product_map = {item["id"]: item for item in (products_result.data or [])}

    total = 0
    for cart_item in cart_items:
        product = product_map.get(cart_item["product_id"])
        if not product:
            continue
        total += int((product.get("price") or 0) * (cart_item.get("qty") or 0))

    if total <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Không thể tạo thanh toán cho giỏ hàng")

    return total


def _build_order_id(user_id: str):
    return f"{user_id}-{int(time.time())}-{uuid.uuid4().hex[:8]}"


def _build_momo_qr_data(order_id: str, amount: int):
    qr_image_url = ENVConfig.MOMO_QR_IMAGE_URL
    receiver_name = ENVConfig.MOMO_RECEIVER_NAME
    receiver_phone = ENVConfig.MOMO_RECEIVER_PHONE

    if not qr_image_url:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Thiếu cấu hình MOMO_QR_IMAGE_URL",
        )

    transfer_content = f"THANH TOAN {order_id}"
    encoded_content = quote(transfer_content)

    qr_url = qr_image_url
    if "{" in qr_image_url and "}" in qr_image_url:
        qr_url = qr_image_url.format(order_id=order_id, amount=amount, content=encoded_content)

    return {
        "qrUrl": qr_url,
        "receiverName": receiver_name,
        "receiverPhone": receiver_phone,
        "transferContent": transfer_content,
    }


def create_checkout_service(user_id: str, phone_no: str, address: str, payment_method: PaymentMethod):
    amount = _get_cart_total(user_id)
    order_id = _build_order_id(user_id)

    if payment_method == PaymentMethod.cod:
        _mark_cart_purchased(user_id)
        return {
            "orderId": order_id,
            "amount": amount,
            "payment_method": payment_method,
            "status": "confirmed",
            "message": "Đặt hàng COD thành công",
        }

    if payment_method == PaymentMethod.mock:
        return {
            "orderId": order_id,
            "amount": amount,
            "payment_method": payment_method,
            "status": "pending_confirm",
            "message": "Mock payment đã tạo. Bấm xác nhận để hoàn tất.",
        }

    if payment_method == PaymentMethod.momo_qr:
        momo_qr = _build_momo_qr_data(order_id=order_id, amount=amount)
        return {
            "orderId": order_id,
            "amount": amount,
            "payment_method": payment_method,
            "status": "pending_transfer",
            "qrUrl": momo_qr["qrUrl"],
            "transferContent": momo_qr["transferContent"],
            "receiverName": momo_qr["receiverName"],
            "receiverPhone": momo_qr["receiverPhone"],
            "message": "Vui lòng quét mã QR MoMo để thanh toán",
            "meta": {
                "phone_no": phone_no,
                "address": address,
            },
        }

    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Phương thức thanh toán không hợp lệ")


def confirm_checkout_service(user_id: str, order_id: str, payment_method: PaymentMethod):
    if not order_id.startswith(f"{user_id}-"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Order không hợp lệ")

    if payment_method not in (PaymentMethod.momo_qr, PaymentMethod.mock):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Chỉ xác nhận cho thanh toán QR MoMo hoặc Mock",
        )

    _mark_cart_purchased(user_id)

    return {
        "orderId": order_id,
        "payment_method": payment_method,
        "status": "confirmed",
        "message": "Xác nhận thanh toán thành công",
    }
