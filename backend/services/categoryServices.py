from config.db import client
from slugify import slugify

def get_categories():

    query = (
        client
        .table("categories")
        .select(
            "name,slug"
        )
    )

    res = query.execute()

    return {
        "total": res.count,
        "items": res.data
    }


def addCategoryService(category_data):
    if not category_data.get("slug"):
        category_data["slug"] = slugify(category_data["name"])
    result = client.table("categories").insert(category_data).execute()
    if not result.data:
        raise ValueError("Không thể thêm danh mục")
    return {
        "msg": "Đã thêm danh mục"
    }