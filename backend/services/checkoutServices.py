from urllib.parse import quote

from fastapi import HTTPException, status

from config.Env import ENVConfig
from models.checkoutModel import PaymentMethod
from services.orderServices import create_order_from_cart, delete_cart_items, mark_order_paid_and_confirmed


def _build_momo_qr_data(order_code: str, amount: int):
    qr_image_url = ENVConfig.MOMO_QR_IMAGE_URL
    receiver_name = ENVConfig.MOMO_RECEIVER_NAME
    receiver_phone = ENVConfig.MOMO_RECEIVER_PHONE

    if not qr_image_url:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Thiếu cấu hình MOMO_QR_IMAGE_URL",
        )

    transfer_content = f"THANH TOAN {order_code}"
    encoded_content = quote(transfer_content)

    qr_url = qr_image_url
    if "{" in qr_image_url and "}" in qr_image_url:
        qr_url = qr_image_url.format(order_id=order_code, amount=amount, content=encoded_content)

    return {
        "qrUrl": qr_url,
        "receiverName": receiver_name,
        "receiverPhone": receiver_phone,
        "transferContent": transfer_content,
    }


def create_checkout_service(user_id: str, phone_no: str, address: str, payment_method: PaymentMethod):
    if payment_method == PaymentMethod.cod:
        order_data = create_order_from_cart(
            user_id=user_id,
            phone_no=phone_no,
            shipping_address=address,
            payment_method=payment_method.value,
            payment_status="cod_pending",
            order_status="pending_payment",
        )
        delete_cart_items(user_id, order_data["cart_item_ids"])
        return {
            "orderId": order_data["order_id"],
            "orderCode": order_data["order_code"],
            "amount": order_data["amount"],
            "payment_method": payment_method,
            "status": "confirmed",
            "message": "Đặt hàng COD thành công, đơn hàng đang chờ xác nhận thanh toán",
        }

    if payment_method == PaymentMethod.mock:
        order_data = create_order_from_cart(
            user_id=user_id,
            phone_no=phone_no,
            shipping_address=address,
            payment_method=payment_method.value,
            payment_status="pending",
            order_status="pending_payment",
        )
        delete_cart_items(user_id, order_data["cart_item_ids"])
        return {
            "orderId": order_data["order_id"],
            "orderCode": order_data["order_code"],
            "amount": order_data["amount"],
            "payment_method": payment_method,
            "status": "pending_confirm",
            "message": "Mock payment đã tạo. Bấm xác nhận để hoàn tất.",
        }

    if payment_method == PaymentMethod.momo_qr:
        order_data = create_order_from_cart(
            user_id=user_id,
            phone_no=phone_no,
            shipping_address=address,
            payment_method=payment_method.value,
            payment_status="pending",
            order_status="pending_payment",
        )
        delete_cart_items(user_id, order_data["cart_item_ids"])
        momo_qr = _build_momo_qr_data(order_code=order_data["order_code"], amount=order_data["amount"])
        return {
            "orderId": order_data["order_id"],
            "orderCode": order_data["order_code"],
            "amount": order_data["amount"],
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


def confirm_checkout_service(staff_id: str, order_id: str, payment_method: PaymentMethod):
    if payment_method not in (PaymentMethod.momo_qr, PaymentMethod.mock):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Chỉ xác nhận cho thanh toán QR MoMo hoặc Mock",
        )

    confirm_result = mark_order_paid_and_confirmed(
        staff_id=staff_id,
        order_id=order_id,
        payment_method=payment_method.value,
    )

    return {
        "orderId": confirm_result["order_id"],
        "orderCode": confirm_result.get("order_code"),
        "payment_method": payment_method,
        "status": "confirmed",
        "message": "Đơn hàng đã được xác nhận" if confirm_result.get("already_paid") else "Xác nhận thanh toán thành công",
    }
