import uuid
from datetime import datetime
from typing import Optional

from fastapi_users import schemas


class UserBase(schemas.BaseUser[uuid.UUID]):
    first_name: str
    last_name: str
    phone: int

class UserCreate(schemas.BaseUserCreate):
    first_name: str
    last_name: str
    phone: int
    
class UserUpdate(schemas.BaseUserUpdate):
    first_name: Optional[str]
    last_name: Optional[str]
    phone: Optional[int]

class UserRead(UserBase):
    created_at: datetime
    updated_at: datetime
