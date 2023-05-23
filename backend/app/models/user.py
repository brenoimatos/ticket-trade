import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from fastapi_users.db import SQLAlchemyBaseUserTableUUID
from sqlalchemy import DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql.functions import func

from app.dal.db import Base

if TYPE_CHECKING:
    from app.models.ticket import Ticket  # noqa: F401
    from app.models.transaction import Transaction


class User(SQLAlchemyBaseUserTableUUID, Base):
    __tablename__ = "users"

    created: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    transactions: Mapped["Transaction"] = relationship("Transaction", back_populates="user")  # One-to-Many relationship with Transaction
    tickets: Mapped["Ticket"] = relationship("Ticket", back_populates="user")  # One-to-Many relationship with Ticket

    def __repr__(self):
        return f"User(id={self.id!r}, name={self.email!r})"
