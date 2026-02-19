from config.db import client

import logging

logger = logging.getLogger(__name__)

def get_users(**filters):
    page = filters.get("page", 1)
    limit = filters.get("limit", 10)
    role = filters.get("role")
    q = filters.get("q")

    start = (page - 1) * limit
    end = start + limit - 1

    # Build base query for data
    query = (
        client
        .table("users")
        .select(
            "id,name,email,role, phone, dob, address, created_at"
        )
        .range(start, end)
    )

    # Build count query
    count_query = (
        client
        .table("users")
        .select("id", count="exact")
    )

    if role:
        query = query.eq("role", role)
        count_query = count_query.eq("role", role)

    if q:
        query = query.ilike("name", f"%{q}%")
        count_query = count_query.ilike("name", f"%{q}%")

    # Execute queries
    res = query.execute()
    count_res = count_query.execute()

    return {
        "page": page,
        "limit": limit,
        "total": count_res.count,
        "items": res.data
    }

def get_all_employees():
    query = (
        client
        .table("users")
        .select(
            "id,name,email,role, phone, dob, address, created_at"
        )
        .in_("role", ["staff", "manager"])
    )

    count_query = (
        client
        .table("users")
        .select("id", count="exact")
        .in_("role", ["staff", "manager"])
    )

    res = query.execute()
    count_res = count_query.execute()

    return {
        "total": count_res.count,
        "items": res.data
    }

def get_all_customers():
    query = (
        client
        .table("users")
        .select(
            "id,name,email,role, phone, dob, address, created_at"
        )
        .eq("role", "customer")
    )

    count_query = (
        client
        .table("users")
        .select("id", count="exact")
        .eq("role", "customer")
    )

    res = query.execute()
    count_res = count_query.execute()

    return {
        "total": count_res.count,
        "items": res.data
    }

def get_staff_by_id(user_id):
    query = (
        client
        .table("users")
        .select(
            "id,name,email,role, phone, dob, address, created_at"
        )
        .eq("id", user_id)
        .eq("role", "staff")
        .single()
    )

    res = query.execute()

    return res.data

def grant_manager_role(user_id):
    query = (
        client
        .table("users")
        .update({"role": "manager"})
        .eq("id", user_id)
        .eq("role", "staff")
        .single()
    )

    res = query.execute()

    return res.data

def revoke_manager_role(user_id):
    query = (
        client
        .table("users")
        .update({"role": "staff"})
        .eq("id", user_id)
        .eq("role", "manager")
        .single()
    )

    res = query.execute()

    return res.data

def grant_staff_role(user_id):
    query = (
        client
        .table("users")
        .update({"role": "staff"})
        .eq("id", user_id)
        .eq("role", "customer")
        .single()
    )

    res = query.execute()

    return res.data

def revoke_staff_role(user_id):
    query = (
        client
        .table("users")
        .update({"role": "customer"})
        .eq("id", user_id)
        .eq("role", "staff")
        .single()
    )

    res = query.execute()

    return res.data