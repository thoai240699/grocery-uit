from fastapi import APIRouter
from fastapi import Depends, HTTPException, Query
import logging

import services.admin.userServices as userServices
from middlewares.VerifyUser import ValidateUser
from models import authModel

router = APIRouter(prefix="/api/admin/users", tags=['User'])

logger = logging.getLogger(__name__)

@router.get("/")
def list_users(
    page: int = Query(1, ge=1),
    limit: int =Query(10, lte=100),
    role: str | None = Query(None, description="User role"),
    q: str | None = None,
    userId: str = Depends(ValidateUser(authModel.RolesEnum.admin))
):
    try:
        return userServices.get_users(
            page=page,
            limit=limit,
            role=role,
            q=q
        )
    except Exception as e:
        logger.exception(e)
        raise HTTPException(status_code=404, detail="Item not found")
    
@router.get("/staff/{user_id}")
def get_user(
    user_id: str,
    userId: str = Depends(ValidateUser(authModel.RolesEnum.admin))
):
    try:
        return userServices.get_staff_by_id(
            user_id
        )
    except Exception as e:
        logger.exception(e)
        raise HTTPException(status_code=404, detail="Item not found")
    

@router.post("/grant-manager/{user_id}")
def grant_manager(
    user_id: str,
    userId: str = Depends(ValidateUser(authModel.RolesEnum.admin))
):
    try:
        return userServices.grant_manager_role(
            user_id
        )
    except Exception as e:
        logger.exception(e)
        raise HTTPException(status_code=404, detail="Item not found")
    
@router.post("/revoke-manager/{user_id}")
def revoke_manager(
    user_id: str,
    userId: str = Depends(ValidateUser(authModel.RolesEnum.admin))
):
    try:
        return userServices.revoke_manager_role(
            user_id
        )
    except Exception as e:
        logger.exception(e)
        raise HTTPException(status_code=404, detail="Item not found")
    
@router.post("/grant-staff/{user_id}")
def grant_staff(
    user_id: str,
    userId: str = Depends(ValidateUser(authModel.RolesEnum.admin))
):
    try:
        return userServices.grant_staff_role(
            user_id
        )
    except Exception as e:
        logger.exception(e)
        raise HTTPException(status_code=404, detail="Item not found")
    
@router.post("/revoke-staff/{user_id}")
def revoke_staff(
    user_id: str,
    userId: str = Depends(ValidateUser(authModel.RolesEnum.admin))
):
    try:
        return userServices.revoke_staff_role(
            user_id
        )
    except Exception as e:
        logger.exception(e)
        raise HTTPException(status_code=404, detail="Item not found")