from fastapi import HTTPException
from services.addressServices import get_viettel_provinces_service, get_viettel_districts_service, get_viettel_wards_service


def get_viettel_provinces_controller():
    try:
        return get_viettel_provinces_service()
    except HTTPException as exc:
        raise exc
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"{exc}")


def get_viettel_districts_controller(province_id: str):
    try:
        return get_viettel_districts_service(province_id)
    except HTTPException as exc:
        raise exc
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"{exc}")


def get_viettel_wards_controller(district_id: str):
    try:
        return get_viettel_wards_service(district_id)
    except HTTPException as exc:
        raise exc
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"{exc}")
