from fastapi import APIRouter
from fastapi import Depends, HTTPException, Query
from app.core.deps import get_db
import logging

from app.services.product_services import get_product_by_id, get_products_2

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

@router.get("/id/{product_id}")
def get_product(
    product_id: str,
    db=Depends(get_db)
):
    try:
        return get_product_by_id(
            db,
            product_id
        )
    except Exception as e:
        logger.exception(e)
        raise HTTPException(status_code=404, detail="Item not found")