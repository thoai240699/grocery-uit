from fastapi import HTTPException, status
from config.db import client
from datetime import datetime, timezone, timedelta
def toggleProductService(product_id, user_id):
    existing = client.table("wishlist").select("*").eq("user_id", user_id).eq("product_id", product_id).execute()

    if(existing.data and len(existing.data) > 0):
        client.table("wishlist").delete().eq("product_id", product_id).eq("user_id", user_id).execute()
        return {
            "msg": "Đã loại sản phẩm khỏi danh sách yêu thích"
        }

    wishlist_data = {
        "product_id": product_id,
        "user_id": user_id,
        "created_at": datetime.now(timezone(timedelta(hours=7))).isoformat(),
        "updated_at": datetime.now(timezone(timedelta(hours=7))).isoformat(),
    }

    client.table("wishlist").insert(wishlist_data).execute()
    
    return {
        "msg": "Product add to wishlist"
    }