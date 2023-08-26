from typing import Any, List

from fastapi.params import Depends
from fastapi.routing import APIRouter
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio.session import AsyncSession
from sqlalchemy.orm import selectinload
from starlette.responses import Response

from app.deps.db import get_async_session
from app.deps.service import get_user_service
from app.deps.users import current_superuser, current_user
from app.dto.user import UserCreate, UserDash, UserDashStats, UserRead
from app.models.user import User
from app.services.user_service import UserService

router = APIRouter()


@router.get("/users", response_model=List[UserRead])
async def get_users(
    response: Response,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_superuser),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    total = await session.scalar(select(func.count(User.id)))
    users = (
        (await session.execute(select(User).offset(skip).limit(limit))).scalars().unique().all()
    )
    response.headers["Content-Range"] = f"{skip}-{skip + len(users)}/{total}"
    return users

@router.get("/users/dash", response_model=List[UserDash])
async def get_dash_users(
    response: Response,
    skip: int = 0,
    limit: int = 100,
    user: User = Depends(current_superuser),
    service: UserService = Depends(get_user_service)
) -> Any:
    total_users = await service.get_total_users_count()
    users = await service.get_dash_users(skip=skip, limit=limit)
    response.headers["Content-Range"] = f"bytes {skip}-{skip + len(users)}/{total_users}"
    return users


@router.get("/users/dash/stats", response_model=List[UserDashStats])
async def get_dash_users_stats(
    user: User = Depends(current_superuser),
    service: UserService = Depends(get_user_service)
) -> Any:
    return await service.get_dash_users_stats()


@router.get("/users/validate", response_model=bool)
async def get_user_validation(
    _: User = Depends(current_user),
) -> Any:
    return True

@router.get("/users/validate/super-user", response_model=bool)
async def get_super_user_validation(
    _: User = Depends(current_superuser),
) -> Any:
    return True
