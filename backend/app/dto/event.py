from datetime import datetime
from typing import Optional
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
    location_city: Optional[str]
    location_lat: Optional[float]
    location_lon: Optional[float]
    location_name: Optional[str]
    location_street: Optional[str]
    location_zipcode: Optional[str]
    categories: Optional[list[str]]
    poster_medium: Optional[str]
    poster_small: Optional[str]


    class Config:
        orm_mode = True

class EventDashHot(BaseModel):
    id: int
    name: str
    location: str
    date: datetime
    total_tickets: int
    tickets_selling: Optional[int]
    tickets_buying: Optional[int]
    average_price_selling: Optional[float]
    average_price_buying: Optional[float]

    class Config:
        orm_mode = True