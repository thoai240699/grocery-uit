from fastapi import HTTPException, status
from config.db import client
from models import cartModel

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