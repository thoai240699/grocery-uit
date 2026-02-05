from config.db import client

def get_users(**filters):
    page = filters.get("page", 1)
    limit = filters.get("limit", 10)
    role = filters.get("role")
    q = filters.get("q")

    start = (page - 1) * limit
    end = start + limit - 1

    query = (
        client
        .table("users")
        .select(
            "id,name,email,role, phone, dob, address, created_at"
        )
        .range(start, end)
    )

    if role:
        query = query.eq("role", role)

    if q:
        query = query.ilike("name", f"%{q}%")

    res = query.execute()

    return {
        "page": page,
        "limit": limit,
        "total": res.count,
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