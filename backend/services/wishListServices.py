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
        "msg": "Đã thêm sản phẩm vào danh sách yêu thích"
    }

def getProductService(product_id, user_id):
    existing = client.table("wishlist").select("*").eq("user_id", user_id).eq("product_id", product_id).execute()

    if(existing.data and len(existing.data) > 0):
        return {
            "exist": True
        }
    return {
        "exist": False
    }

def getProductsService(user_id):
    wishlist = client.table("wishlist").select("*").eq("user_id", user_id).execute()

    products = []

    for wishlist_item in wishlist.data or []:
        product_result = client.table("products").select("*").eq("id", wishlist_item["product_id"]).execute()

        if not product_result.data:
            continue

        product = product_result.data[0]

        products.append(product)

    return products

def deleteProductService(product_id, user_id):
    response = client.table("wishlist").delete().eq("user_id", user_id).eq("product_id", product_id).execute()
    
    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sản phẩm không có trong danh sách yêu thích."
        )

    return {
        "msg": "Đã bỏ sản phẩm khỏi danh sách yêu thích"
    }