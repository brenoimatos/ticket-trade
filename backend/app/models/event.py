from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import ARRAY, DateTime
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.dal.db import Base
from app.utils.models import StatusEnum

if TYPE_CHECKING:
    from app.models.ticket import Ticket
    from app.models.user import User



class Event(Base):
    __tablename__ = 'event'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(nullable=True)
    location: Mapped[str]
    date: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    status: Mapped[StatusEnum] = mapped_column(SQLAlchemyEnum(StatusEnum), nullable=True)

    location_city: Mapped[str] = mapped_column(nullable=True)
    location_lat: Mapped[float] = mapped_column(nullable=True)
    location_lon: Mapped[float] = mapped_column(nullable=True)
    location_name: Mapped[str] = mapped_column(nullable=True)
    location_street: Mapped[str] = mapped_column(nullable=True)
    location_zipcode: Mapped[str] = mapped_column(nullable=True)
    
    categories: Mapped[list[str]] = mapped_column(ARRAY(String), nullable=True)
    poster_medium: Mapped[str] = mapped_column(nullable=True)
    poster_small: Mapped[str] = mapped_column(nullable=True)
    external_ticket_id: Mapped[int] = mapped_column(nullable=True)
    ticket_url: Mapped[str] = mapped_column(nullable=True)

    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    
    user_id: Mapped[UUID] = mapped_column(ForeignKey('user.id'))
    user: Mapped["User"] = relationship(back_populates="events")

    tickets: Mapped[list["Ticket"]] = relationship(back_populates="event")
