
from config.db import client

def get_products(**filters):
    page = filters.get("page", 1)
    limit = filters.get("limit", 10)
    category = filters.get("category")
    q = filters.get("q")
    min_price = filters.get("min_price")
    max_price = filters.get("max_price")
    sort = filters.get("sort")

    start = (page - 1) * limit
    end = start + limit - 1

    query = (
        client
        .table("products")
        .select(
            "id,name,price,stock,image_url,"
            "category:categories(id,name,slug)"
        )
        .range(start, end)
    )

    if category:
        query = query.ilike("categories.name", category)

    if q:
        query = query.ilike("name", f"%{q}%")

    if min_price is not None:
        query = query.gte("price", min_price)

    if max_price is not None:
        query = query.lte("price", max_price)

    if sort == "price_asc":
        query = query.order("price", desc=False)
    elif sort == "price_desc":
        query = query.order("price", desc=True)

    res = query.execute()

    return {
        "page": page,
        "limit": limit,
        "total": res.count,
        "items": res.data
    }

def get_product_by_id(product_id):
    query = (
        client
        .table("products")
        .select(
            "id,name, price,stock,image_url,"
            "category:categories(name,slug)"
        )
        .eq("id", product_id)
        .single()
    )

    res = query.execute()

    return res.data