from fastapi import HTTPException, status
from config.db import client
from models import cartModel
from datetime import datetime, timezone, timedelta


def addProductService(product_id, user_id):
    exist = client.table("cart").select("*").eq("product_id", product_id).eq("user_id", user_id).execute()
    
    if exist.data:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Đã có sản phẩm")

    product = cartModel.AddProduct(
        product_id=product_id,
        user_id=user_id
    )
    client.table("cart").insert(product.model_dump(mode="json")).execute()

    return {
        "msg": f"Đã thêm sản phẩm"
    }

def getProductService(product_id, user_id):
    exist = client.table("cart").select("*").eq("product_id", product_id).eq("user_id", user_id).execute()

    if not exist.data:
        return {"qty": 0}

    qty = exist.data[0]['qty']

    return {
        "qty": qty
    }

def cartOperationService(product_id, user_id, operation):
    exist = client.table("cart").select("*").eq("product_id", product_id).eq("user_id", user_id).execute()
    
    if not exist.data:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Không tìm thấy")
   
    cart_item = exist.data[0]

    match operation:
        case cartModel.CartOperations.delete:
            client.table("cart").delete().eq("id", cart_item["id"]).execute()
            return {
                "msg": "Đã bỏ"
            }
        case cartModel.CartOperations.increment:
            client.table("cart").update({
                "qty": cart_item["qty"] + 1,
                "updated_at": datetime.now(cartModel.VN_TZ).isoformat()
            }).eq("id", cart_item["id"]).execute()
            return {
                "msg": "+1"
            }
        case cartModel.CartOperations.decrement:
            if cart_item['qty'] == 1:
                client.table("cart").delete().eq("id", cart_item["id"]).execute()
                return {
                    "msg": "Đã bỏ"
                } 
            client.table("cart").update({
                "qty": cart_item["qty"] - 1,
                "updated_at": datetime.now(cartModel.VN_TZ).isoformat()
            }).eq("id", cart_item["id"]).execute()
            return {
                "msg": "-1"
            }