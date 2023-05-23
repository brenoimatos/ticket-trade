from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID

from fastapi_users_db_sqlalchemy import GUID
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql.functions import func
from sqlalchemy.sql.schema import ForeignKey
from sqlalchemy.sql.sqltypes import DateTime

from app.dal.db import Base

if TYPE_CHECKING:
    from app.models.transaction import Transaction
    from app.models.user import User  # noqa: F401


class Ticket(Base):
    __tablename__ = "tickets"

    id: Mapped[int] = mapped_column(primary_key=True)
    created: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    price: Mapped[float]
    title: Mapped[str]
    url: Mapped[str | None]
    is_sold: Mapped[bool | None]
    
    user_id: Mapped[UUID] = mapped_column(GUID, ForeignKey("users.id"))
    user: Mapped["User"] = relationship("User", back_populates="tickets")
    transactions: Mapped["Transaction"] = relationship("Transaction", back_populates="ticket")  # One-to-Many relationship with Transaction
