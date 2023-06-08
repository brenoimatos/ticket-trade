from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import UUID, DateTime
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.dal.db import Base
from app.utils.models import StatusEnum

if TYPE_CHECKING:
    from app.models.ticket import Ticket
    from app.models.user import User  # noqa: F401


class PhoneShareRequest(Base):
    __tablename__ = 'phone_share_request'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    status: Mapped[StatusEnum] = mapped_column(SQLAlchemyEnum(StatusEnum))
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    requester_id: Mapped[UUID] = mapped_column(ForeignKey('user.id'))
    receptor_id: Mapped[UUID] = mapped_column(ForeignKey('user.id'))
    phone_share_requester: Mapped["User"] = relationship(foreign_keys=[requester_id], back_populates="phone_share_requesters")
    phone_share_receptor: Mapped["User"] = relationship(foreign_keys=[receptor_id], back_populates="phone_share_receptors")

    ticket_id: Mapped[int] = mapped_column(ForeignKey('ticket.id'))
    ticket: Mapped["Ticket"] = relationship(back_populates='phone_share_requests')