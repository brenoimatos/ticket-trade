from datetime import datetime
from typing import TYPE_CHECKING

from fastapi_users.db import SQLAlchemyBaseUserTableUUID
from fastapi_users_db_sqlalchemy import SQLAlchemyBaseOAuthAccountTableUUID
from sqlalchemy import BigInteger, DateTime, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.dal.db import Base

if TYPE_CHECKING:
    from app.models.event import Event
    from app.models.phone_share_request import PhoneShareRequest
    from app.models.review import Review
    from app.models.ticket import Ticket  # noqa: F401
    from app.models.validation import Validation


class OAuthAccount(SQLAlchemyBaseOAuthAccountTableUUID, Base):
    pass

class User(SQLAlchemyBaseUserTableUUID, Base):
    __tablename__ = "user"
    # User attributes
    first_name: Mapped[str]
    last_name: Mapped[str]
    phone: Mapped[BigInteger] = mapped_column(BigInteger, unique=True)

    # OAuth accounts
    oauth_accounts: Mapped[list[OAuthAccount]] = relationship("OAuthAccount", lazy="joined")

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    # One-to-Many relationships
    tickets: Mapped[list["Ticket"]] = relationship(back_populates="user")
    validations: Mapped[list["Validation"]] = relationship(back_populates="user")

    reviews_received: Mapped[list["Review"]] = relationship(foreign_keys="Review.reviewer_id", back_populates="reviewer")
    reviews_applied: Mapped[list["Review"]] = relationship(foreign_keys="Review.reviewed_id", back_populates="reviewed")

    phone_share_requesters: Mapped[list["PhoneShareRequest"]] = relationship(foreign_keys="PhoneShareRequest.requester_id", back_populates="phone_share_requester")
    phone_share_receptors: Mapped[list["PhoneShareRequest"]] = relationship(foreign_keys="PhoneShareRequest.receptor_id", back_populates="phone_share_receptor")

    events: Mapped[list["Event"]] = relationship("Event", back_populates="user")

    def __repr__(self):
        return f"User(id={self.id!r}, name={self.email!r})"
