from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class ValidationBase(BaseModel):
    type: str
    is_validated: bool
    identifier: str

class ValidationCreate(ValidationBase):
    user_id: UUID

class Validation(ValidationBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
