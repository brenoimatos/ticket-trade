from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio.session import AsyncSession
from starlette.responses import Response

from app.deps.db import get_async_session
from app.deps.request_params import parse_react_admin_params
from app.deps.users import current_user
from app.dto.request_params import RequestParams
from app.dto.ticket import Ticket as TicketSchema
from app.dto.ticket import TicketCreate, TicketUpdate
from app.models.ticket import Ticket as TicketModel
from app.models.user import User

router = APIRouter(prefix="/tickets")


@router.get("", response_model=List[TicketSchema])
async def get_tickets(
    response: Response,
    session: AsyncSession = Depends(get_async_session),
    request_params: RequestParams = Depends(parse_react_admin_params(TicketModel)),
    user: User = Depends(current_user),
) -> Any:
    total = await session.scalar(
        select(func.count(TicketModel.id).filter(TicketModel.user_id == user.id))
    )
    tickets = (
        (
            await session.execute(
                select(TicketModel)
                .offset(request_params.skip)
                .limit(request_params.limit)
                .order_by(request_params.order_by)
                .filter(TicketModel.user_id == user.id)
            )
        )
        .scalars()
        .all()
    )
    response.headers[
        "Content-Range"
    ] = f"{request_params.skip}-{request_params.skip + len(tickets)}/{total}"
    return tickets


@router.post("", response_model=TicketSchema, status_code=201)
async def create_ticket(
    ticket_in: TicketCreate,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_user),
) -> Any:
    db_ticket = TicketModel(**ticket_in.dict(), user_id=user.id, is_sold=False)
    session.add(db_ticket)
    await session.commit()
    await session.refresh(db_ticket)
    return db_ticket


@router.put("/{ticket_id}", response_model=TicketSchema)
async def update_ticket(
    ticket_id: int,
    ticket_in: TicketUpdate,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_user),
) -> Any:
    ticket: Optional[TicketModel] = await session.get(TicketModel, ticket_id)
    if not ticket or ticket.user_id != user.id:
        raise HTTPException(404)
    update_data = ticket_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(ticket, field, value)
    session.add(ticket)
    await session.commit()
    return ticket


@router.get("/{ticket_id}", response_model=TicketSchema)
async def get_ticket(
    ticket_id: int,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_user),
) -> Any:
    ticket: Optional[TicketModel] = await session.get(TicketModel, ticket_id)
    if not ticket or ticket.user_id != user.id:
        raise HTTPException(404)
    return ticket


@router.delete("/{ticket_id}")
async def delete_ticket(
    ticket_id: int,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_user),
) -> Any:
    ticket: Optional[TicketModel] = await session.get(TicketModel, ticket_id)
    if not ticket or ticket.user_id != user.id:
        raise HTTPException(404)
    await session.delete(ticket)
    await session.commit()
    return {"success": True}
