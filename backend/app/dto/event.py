from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class EventBase(BaseModel):
    name: str
    location: str
    date: datetime
    ticket_url: str
    
class EventCreate(EventBase):
    pass

class Event(EventBase):
    id: int
    created_at: datetime
    updated_at: datetime
    user_id: UUID

    class Config:
        orm_mode = True
