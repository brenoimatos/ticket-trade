from typing import Any
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.deps.db import get_async_session
from app.deps.request_params import parse_react_admin_params
from app.deps.users import current_superuser, current_user
from app.dto.request_params import RequestParams
from app.dto.review import Review, ReviewCreate
from app.models.phone_share_request import \
    PhoneShareRequest as PhoneShareRequestModel
from app.models.review import Review as ReviewModel
from app.models.user import User as UserModel
from app.utils.models import StatusEnum

router = APIRouter(prefix="/reviews")

@router.post("/", response_model=Review)
async def create_review(
    review: ReviewCreate,
    session: AsyncSession = Depends(get_async_session),
    user: UserModel = Depends(current_user),
) -> Any:
    db_phone_request = (
        await session.execute(
            select(PhoneShareRequestModel)
            .where(PhoneShareRequestModel.ticket_id == review.ticket_id)
            .where(PhoneShareRequestModel.status == StatusEnum.ACCEPTED)
            .where(or_(
                PhoneShareRequestModel.receptor_id == user.id,
                PhoneShareRequestModel.requester_id == user.id)
            )
    ))
    db_phone_request = db_phone_request.scalar_one_or_none()
    
    if not db_phone_request:
        raise HTTPException(status_code=404, detail="Reviewable ticket not found")
    reviewed_id = (
        db_phone_request.receptor_id if user.id == db_phone_request.requester_id
        else db_phone_request.requester_id
    )
    db_review = ReviewModel(
        rating=review.rating, 
        comment=review.comment, 
        reviewer_id=user.id, 
        reviewed_id=reviewed_id, 
        status=StatusEnum.PENDING, 
        ticket_id=review.ticket_id
    )
    session.add(db_review)
    await session.commit()
    await session.refresh(db_review)

    return db_review


@router.get("/", response_model=list[Review])
async def read_reviews(
    user_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    request_params: RequestParams = Depends(parse_react_admin_params(ReviewModel)),
) -> Any:
    reviews = (
        await session.execute(
            select(ReviewModel, UserModel.name.label('reviewer_name'), UserModel.phone.label('reviewer_phone'))
            .join(ReviewModel.reviewer)
            .where(ReviewModel.reviewed_id == user_id)
            .where(ReviewModel.status == StatusEnum.ACCEPTED)
            .offset(request_params.skip)
            .limit(request_params.limit)
            .order_by(request_params.order_by)
        )
    ).scalars().all()
    return reviews


@router.put("/{request_id}/response", response_model=Review)
async def respond_review_request(
    request_id: int,
    accept: bool,
    session: AsyncSession = Depends(get_async_session),
    super_user: UserModel = Depends(current_superuser),
) -> Any:
    db_review = await session.execute(select(ReviewModel).where(ReviewModel.id == request_id))
    db_review = db_review.scalar_one_or_none()
    
    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")

    if accept:
        db_review.status = StatusEnum.ACCEPTED
    else:
        db_review.status = StatusEnum.REJECTED

    session.add(db_review)
    await session.commit()
    await session.refresh(db_review)

    return db_review