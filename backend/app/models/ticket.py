from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import UUID, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql.sqltypes import DateTime

from app.dal.db import Base

if TYPE_CHECKING:
    from app.models.event import Event
    from app.models.phone_share_request import PhoneShareRequest
    from app.models.review import Review
    from app.models.user import User  # noqa: F401


class Ticket(Base):
    __tablename__ = 'ticket'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    price: Mapped[int]
    is_for_sale: Mapped[bool] = mapped_column(default=True)
    is_sold: Mapped[bool] = mapped_column(default=False)
    description: Mapped[str] = mapped_column(nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    event_id: Mapped[int] = mapped_column(ForeignKey('event.id'))
    event: Mapped["Event"] = relationship(back_populates='tickets')

    user_id: Mapped[UUID] = mapped_column(ForeignKey('user.id'))
    user: Mapped["User"] = relationship(back_populates='tickets')

    review: Mapped["Review"] = relationship(back_populates="ticket")
    phone_share_requests: Mapped[list["PhoneShareRequest"]] = relationship(back_populates="ticket")