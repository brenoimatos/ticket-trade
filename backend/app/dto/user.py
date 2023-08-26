import uuid
from datetime import date, datetime
from typing import Optional

from fastapi_users import schemas
from pydantic import BaseModel


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
    avatar: Optional[str]

class UserRead(UserBase):
    created_at: datetime
    updated_at: datetime
    avatar: Optional[str]

class UserDash(BaseModel):
    id: uuid.UUID
    first_name: str
    last_name: str
    created_at: datetime

    class Config:
        orm_mode = True

class UserDashStats(BaseModel):
    created_date: date
    users: int

    class Config:
        orm_mode = True