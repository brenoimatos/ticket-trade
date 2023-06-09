import uuid
from typing import Optional

from fastapi_users import schemas


class UserBase(schemas.BaseUser[uuid.UUID]):
    name: str
    phone: int

class UserCreate(schemas.BaseUserCreate):
    name: str
    phone: int

class UserUpdate(schemas.BaseUserUpdate):
    name: Optional[str]
    phone: Optional[int]

class UserRead(UserBase):
    pass