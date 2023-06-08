from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import UUID, DateTime
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.dal.db import Base
from app.utils.models import StatusEnum

if TYPE_CHECKING:
    from app.models.ticket import Ticket
    from app.models.user import User


class Review(Base):
    __tablename__ = 'reviews'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    rating: Mapped[int]  # -1 or +1
    comment: Mapped[Optional[str]] 
    status: Mapped[StatusEnum] = mapped_column(SQLAlchemyEnum(StatusEnum))

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    reviewer_id: Mapped[UUID] = mapped_column(ForeignKey('user.id'))
    reviewer: Mapped["User"] = relationship(foreign_keys=[reviewer_id], back_populates="reviews_received")
    reviewed_id: Mapped[UUID] = mapped_column(ForeignKey('user.id'))
    reviewed: Mapped["User"] = relationship(foreign_keys=[reviewed_id], back_populates="reviews_applied")

    ticket_id: Mapped[int] = mapped_column(ForeignKey('ticket.id'))
    ticket: Mapped["Ticket"] = relationship(back_populates='review')