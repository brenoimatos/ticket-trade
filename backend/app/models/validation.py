from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import UUID, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.dal.db import Base

if TYPE_CHECKING:
    from app.models.user import User  # noqa: F401

class Validation(Base):
    __tablename__ = 'validations'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    type: Mapped[str]  # e.g., 'email', 'phone', 'instagram'
    is_validated: Mapped[bool] = mapped_column(default=False)
    identifier: Mapped[str]
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    user_id: Mapped[UUID] = mapped_column(ForeignKey('user.id'))
    user: Mapped["User"] = relationship(back_populates='validations')
