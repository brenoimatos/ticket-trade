from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID

from fastapi_users_db_sqlalchemy import GUID
from sqlalchemy import DateTime, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql.functions import func
from sqlalchemy.sql.schema import ForeignKey
from sqlalchemy.sql.sqltypes import DateTime

from app.dal.db import Base

if TYPE_CHECKING:
    from app.models.ticket import Ticket
    from app.models.user import User  # noqa: F401


class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[int] = mapped_column(primary_key=True)
    created: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    buyer_id: Mapped[UUID] = mapped_column(GUID, ForeignKey("users.id"))
    user: Mapped["User"] = relationship("User", back_populates="transactions")

    ticket_id: Mapped[int] = mapped_column(Integer, ForeignKey("tickets.id"))
    ticket: Mapped["Ticket"] = relationship("Ticket", back_populates="transactions")


