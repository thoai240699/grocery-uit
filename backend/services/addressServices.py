from fastapi import HTTPException, status
import json
import requests
from config.Env import ENVConfig


def _extract_data_list(data: dict | list):
    if isinstance(data, list):
        return data
    if not isinstance(data, dict):
        return []

    payload = data.get("data")
    if isinstance(payload, list):
        return payload
    if isinstance(payload, dict):
        if isinstance(payload.get("data"), list):
            return payload.get("data")
        if isinstance(payload.get("items"), list):
            return payload.get("items")
    return []


def _normalize_address_items(items: list, level: str):
    normalized = []

    for item in items or []:
        if not isinstance(item, dict):
            continue

        if level == "province":
            item_id = item.get("PROVINCE_ID") or item.get("provinceId") or item.get("id")
            item_name = item.get("PROVINCE_NAME") or item.get("provinceName") or item.get("name")
            parent_id = None
        elif level == "district":
            item_id = item.get("DISTRICT_ID") or item.get("districtId") or item.get("id")
            item_name = item.get("DISTRICT_NAME") or item.get("districtName") or item.get("name")
            parent_id = item.get("PROVINCE_ID") or item.get("provinceId")
        else:
            item_id = item.get("WARDS_ID") or item.get("wardId") or item.get("id")
            item_name = item.get("WARDS_NAME") or item.get("wardName") or item.get("name")
            parent_id = item.get("DISTRICT_ID") or item.get("districtId")

        if item_id in (None, "") or not item_name:
            continue

        if str(item_id) == "100000001":
            continue

        normalized.append({
            "id": item_id,
            "name": str(item_name).strip(),
            "parent_id": parent_id,
            "raw": item,
        })

    return normalized


def _viettel_post_call(path: str, payload: dict):
    token = ENVConfig.VIETTEL_POST_TOKEN
    if not token:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Thiếu cấu hình VIETTEL_POST_TOKEN"
        )

    base_url = (ENVConfig.VIETTEL_POST_BASE_URL or "https://partner.viettelpost.vn").rstrip("/")
    url = f"{base_url}{path}"

    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Token": token,
        "User-Agent": "ecommerce-farm/1.0",
    }

    last_error = ""
    for method in ("POST", "GET"):
        try:
            response = requests.request(
                method,
                url,
                json=payload if method == "POST" else None,
                params=payload if method == "GET" else None,
                headers=headers,
                timeout=20,
            )
        except Exception as exc:
            last_error = f"Không kết nối được Viettel Post: {exc}"
            continue

        text_body = (response.text or "").strip()

        data = None
        try:
            data = response.json()
        except Exception:
            if text_body.startswith("{") or text_body.startswith("["):
                try:
                    data = json.loads(text_body)
                except Exception:
                    data = None

        if data is None:
            snippet = text_body[:180] if text_body else "<empty body>"
            last_error = f"Viettel Post phản hồi không phải JSON (HTTP {response.status_code}): {snippet}"
            continue

        if response.status_code >= 400:
            message = data.get("message") if isinstance(data, dict) else "Lỗi gọi API Viettel Post"
            last_error = f"HTTP {response.status_code}: {message}"
            continue

        if isinstance(data, dict):
            api_status = data.get("status")
            if api_status not in (200, True, None):
                last_error = data.get("message") or "Không lấy được dữ liệu địa chỉ"
                continue
            return _extract_data_list(data)

        if isinstance(data, list):
            return data

        last_error = "Dữ liệu Viettel Post không đúng định dạng mong đợi"

    raise HTTPException(status_code=502, detail=last_error or "Lỗi gọi API Viettel Post")


def get_viettel_provinces_service():
    provinces = _viettel_post_call("/v2/categories/listProvince", {})
    return {"items": _normalize_address_items(provinces, "province")}


def get_viettel_districts_service(province_id: str):
    payload = {"provinceId": int(province_id) if str(province_id).isdigit() else province_id}
    districts = _viettel_post_call("/v2/categories/listDistrict", payload)
    return {"items": _normalize_address_items(districts, "district")}


def get_viettel_wards_service(district_id: str):
    payload = {"districtId": int(district_id) if str(district_id).isdigit() else district_id}
    wards = _viettel_post_call("/v2/categories/listWards", payload)
    return {"items": _normalize_address_items(wards, "ward")}
