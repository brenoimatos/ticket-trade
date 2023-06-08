from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class TicketBase(BaseModel):
    price: int
    is_for_sale: bool
    is_sold: bool = False

class TicketCreate(TicketBase):
    event_id: int
    
class Ticket(TicketCreate):
    id: int
    created_at: datetime
    updated_at: datetime
    user_id: UUID

    class Config:
        orm_mode = True
