from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel

from app.utils.models import StatusEnum


class ReviewCreate(BaseModel):
    rating: int
    comment: str = None
    ticket_id: int

class Review(ReviewCreate):
    id: int
    reviewer_id: UUID
    reviewed_id: UUID
    status: StatusEnum
    created_at: datetime
    updated_at: datetime
    reviewer_name: Optional[str]

    class Config:
        orm_mode = True


class ReviewWithReviewerName(BaseModel):
    review: Review
    reviewer_name: str