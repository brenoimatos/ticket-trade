from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import Response

from app.deps.db import get_async_session
from app.deps.request_params import parse_react_admin_params
from app.deps.users import current_user
from app.dto.request_params import RequestParams
from app.dto.ticket import Ticket as TicketSchema
from app.dto.ticket import TicketCreate
from app.models.ticket import Ticket as TicketModel
from app.models.user import User

router = APIRouter(prefix="/tickets")

@router.post("/", response_model=TicketSchema)
async def create_ticket(
    ticket: TicketCreate,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_user)
) -> Any:
    db_ticket = TicketModel(**ticket.dict(), user_id=user.id)
    session.add(db_ticket)
    await session.commit()
    await session.refresh(db_ticket)
    return db_ticket

@router.get("/", response_model=List[TicketSchema])
async def read_tickets(
    response: Response,
    event_id: int,
    session: AsyncSession = Depends(get_async_session),
    request_params: RequestParams = Depends(parse_react_admin_params(TicketModel)),
) -> Any:
    total = await session.scalar(
        select(func.count(TicketModel.id))
    )
    tickets = (
        await session.execute(
            select(TicketModel)
            .where(TicketModel.event_id == event_id)
            .where(TicketModel.is_sold == False)
            .offset(request_params.skip)
            .limit(request_params.limit)
            .order_by(request_params.order_by)
        )
    ).scalars().all()
    response.headers[
        "Content-Range"
    ] = f"{request_params.skip}-{request_params.skip + len(tickets)}/{total}"
    return tickets
