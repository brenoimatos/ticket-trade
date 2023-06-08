from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from app.utils.models import StatusEnum


class PhoneShareRequestCreate(BaseModel):
    ticket_id: int

class PhoneShareRequest(PhoneShareRequestCreate):
    id: int
    requester_id: UUID
    receptor_id: UUID
    status: StatusEnum
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
