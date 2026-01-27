from fastapi import APIRouter
from fastapi import Depends, HTTPException, Query
import logging

from services.productServices import get_products_2

router = APIRouter()

logger = logging.getLogger(__name__)

@router.get("/")
def list_products(
    page: int = Query(1, ge=1),
    limit: int = Query(10, le=100),
    category: str | None = Query(None, description="Category name"),
    q: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    sort: str | None = None,
):
    try:
        return get_products_2(
            page=page,
            limit=limit,
            category=category,
            q=q,
            min_price=min_price,
            max_price=max_price,
            sort=sort
        )
    except Exception as e:
        logger.exception(e)
        raise HTTPException(status_code=404, detail="Item not found")

# @router.get("/id/{product_id}")
# def get_product(
#     product_id: str,
# ):
#     try:
#         return get_product_by_id(
#             product_id
#         )
#     except Exception as e:
#         logger.exception(e)
#         raise HTTPException(status_code=404, detail="Item not found")