from fastapi import APIRouter

from controllers.addressController import (
    get_viettel_provinces_controller,
    get_viettel_districts_controller,
    get_viettel_wards_controller,
)

router = APIRouter(prefix="/api/v1/address", tags=["address"])


@router.get("/viettel-post/provinces")
def get_viettel_provinces_view():
    return get_viettel_provinces_controller()


@router.get("/viettel-post/districts/{province_id}")
def get_viettel_districts_view(province_id: str):
    return get_viettel_districts_controller(province_id)


@router.get("/viettel-post/wards/{district_id}")
def get_viettel_wards_view(district_id: str):
    return get_viettel_wards_controller(district_id)
