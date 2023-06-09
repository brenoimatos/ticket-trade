from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class TicketCreate(BaseModel):
    event_id: int
    price: int
    is_for_sale: bool
    
class Ticket(TicketCreate):
    id: int
    is_sold: bool
    created_at: datetime
    updated_at: datetime
    user_id: UUID

    class Config:
        orm_mode = True
