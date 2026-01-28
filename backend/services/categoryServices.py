
from config.db import client


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