from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.dal.db import Base

if TYPE_CHECKING:
    from app.models.ticket import Ticket
    from app.models.user import User

    
class Event(Base):
    __tablename__ = 'event'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    location: Mapped[str]
    date: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    ticket_url: Mapped[str]
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    user_id: Mapped[UUID] = mapped_column(ForeignKey('user.id'))
    user: Mapped["User"] = relationship(back_populates="events")

    tickets: Mapped[list["Ticket"]] = relationship(back_populates="event")