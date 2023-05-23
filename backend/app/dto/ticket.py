from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class TicketCreate(BaseModel):
    title: str
    url: str
    price: float

class TicketUpdate(BaseModel):
    title: Optional[str]
    url: Optional[str]
    price: Optional[float]
    is_sold: Optional[bool]


class Ticket(TicketCreate):
    id: int
    is_sold: bool
    user_id: UUID

    class Config:
        orm_mode = True