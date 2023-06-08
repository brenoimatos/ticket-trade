from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import Response

from app.deps.db import get_async_session
from app.deps.request_params import parse_react_admin_params
from app.deps.users import current_user
from app.dto.phone_share_request import \
    PhoneShareRequest as PhoneShareRequestSchema
from app.dto.phone_share_request import PhoneShareRequestCreate
from app.dto.request_params import RequestParams
from app.models.phone_share_request import \
    PhoneShareRequest as PhoneShareRequestModel
from app.models.ticket import Ticket
from app.models.user import User
from app.utils.models import StatusEnum

router = APIRouter(prefix="/phone_share_requests")

@router.post("/", response_model=PhoneShareRequestSchema)
async def create_phone_share_request(
    phone_share_request: PhoneShareRequestCreate,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_user),
) -> Any:
    db_ticket = await session.execute(select(Ticket).where(Ticket.id == phone_share_request.ticket_id))
    db_ticket = db_ticket.scalar_one()
    db_phone_share_request = PhoneShareRequestModel(
        **phone_share_request.dict(), requester_id=user.id, status=StatusEnum.PENDING, receptor_id=db_ticket.user_id
    )
    session.add(db_phone_share_request)
    await session.commit()
    await session.refresh(db_phone_share_request)
    return db_phone_share_request

@router.put("/{request_id}/response", response_model=PhoneShareRequestSchema)
async def respond_phone_share_request(
    request_id: int,
    accept: bool,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_user),
) -> Any:
    db_phone_share_request = await session.execute(select(PhoneShareRequestModel).where(PhoneShareRequestModel.id == request_id))
    db_phone_share_request = db_phone_share_request.scalar_one_or_none()
    
    if not db_phone_share_request:
        raise HTTPException(status_code=404, detail="PhoneShareRequest not found")
    
    if db_phone_share_request.receptor_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized to respond to this request")

    if accept:
        db_phone_share_request.status = StatusEnum.ACCEPTED
    else:
        db_phone_share_request.status = StatusEnum.REJECTED

    session.add(db_phone_share_request)
    await session.commit()
    await session.refresh(db_phone_share_request)

    return db_phone_share_request

@router.get("/", response_model=List[PhoneShareRequestSchema])
async def read_phone_share_requests(
    response: Response,
    session: AsyncSession = Depends(get_async_session),
    request_params: RequestParams = Depends(parse_react_admin_params(PhoneShareRequestModel)),
    user: User = Depends(current_user),
) -> Any:
    # TODO: Pegar só os do user
    total = await session.scalar(
        select(func.count(PhoneShareRequestModel.id))
    )
    phone_share_requests = (
        await session.execute(
            select(PhoneShareRequestModel)
            .offset(request_params.skip)
            .limit(request_params.limit)
            .order_by(request_params.order_by)
        )
    ).scalars().all()
    response.headers[
        "Content-Range"
    ] = f"{request_params.skip}-{request_params.skip + len(phone_share_requests)}/{total}"
    return phone_share_requests
