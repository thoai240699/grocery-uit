from config.db import client

def add_profile_to_product(product):
    if not product or not product.get('id'):
        return product
    
    try:
        profile = client.table("product_profiles").select("*").eq("product_id", product['id']).execute()
        product['profile'] = profile.data[0] if profile.data else None
    except Exception:
        product['profile'] = None
    
    return product

def get_products(**filters):
    page = filters.get("page", 1)
    limit = filters.get("limit", 10)
    category_id = filters.get("category_id")
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
            "id,name,slug,price,stock,image_url,"
            "category:categories(id,name,slug)",
            count="exact"
        )
        .range(start, end)
    )

    if category_id:
        query = query.eq("category_id", category_id)
    elif category:
        by_name = (
            client
            .table("categories")
            .select("id")
            .ilike("name", category)
            .execute()
        )
        category_ids = [item["id"] for item in (by_name.data or [])]

        if not category_ids:
            by_slug = (
                client
                .table("categories")
                .select("id")
                .ilike("slug", category)
                .execute()
            )
            category_ids = [item["id"] for item in (by_slug.data or [])]

        if not category_ids:
            return {
                "page": page,
                "limit": limit,
                "total": 0,
                "items": []
            }
        query = query.in_("category_id", category_ids)

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
    else:
        query = query.order("id", desc=True)

    res = query.execute()

    return {
        "page": page,
        "limit": limit,
        "total": res.count if res.count is not None else 0,
        "items": res.data if res.data else []
    }

def get_product_by_id(product_id):
    query = (
        client
        .table("products")
        .select(
            "id,name,slug,price,stock,image_url,"
            "category:categories(id,name,slug)"
        )
        .eq("id", product_id)
        .single()
    )

    res = query.execute()

    product = add_profile_to_product(res.data)

    return product

def get_product_by_slug(product_slug):
    query = (
        client
        .table("products")
        .select(
            "id,name,slug,price,stock,image_url,"
            "category:categories(id,name,slug)"
        )
        .eq("slug", product_slug)
        .single()
    )

    res = query.execute()
    
    product = add_profile_to_product(res.data)

    return product

def addProductService(product_data):
    result = client.table("products").insert(product_data).execute()
    if not result.data:
        raise ValueError("Không thể thêm sản phẩm")
    return {
        "msg": "Đã thêm sản phẩm"
    }