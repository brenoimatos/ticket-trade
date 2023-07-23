from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel

from app.dto.user import UserRead


class TicketCreate(BaseModel):
    event_id: int
    price: int
    is_for_sale: bool
    description: Optional[str] = None
    quantity: int
    
class Ticket(TicketCreate):
    id: int
    is_sold: bool
    created_at: datetime
    updated_at: datetime
    user_id: UUID

    class Config:
        orm_mode = True

class TicketInfo(BaseModel):
    event_id: int
    price: float
    is_for_sale: bool
    description: Optional[str]
    id: int
    is_sold: bool
    quantity: int
    created_at: datetime
    updated_at: datetime
    user: UserRead

    class Config:
        orm_mode = True