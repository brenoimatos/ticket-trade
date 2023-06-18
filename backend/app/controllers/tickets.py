from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload
from starlette.responses import Response

from app.deps.db import get_async_session
from app.deps.request_params import parse_react_admin_params
from app.deps.users import current_user
from app.dto.request_params import RequestParams
from app.dto.ticket import Ticket as TicketSchema
from app.dto.ticket import TicketCreate, TicketInfo
from app.models.ticket import Ticket as TicketModel
from app.models.user import User

router = APIRouter(prefix="/tickets")

@router.post("/", response_model=TicketSchema)
async def create_ticket(
    ticket: TicketCreate,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_user)
) -> Any:
    existing_ticket = (
        await session.execute(
            select(TicketModel).where(
                TicketModel.user_id == user.id, 
                TicketModel.event_id == ticket.event_id)
        )
    ).scalar_one_or_none()

    if existing_ticket is not None:
        raise HTTPException(
            status_code=400, 
            detail="Para anunciar um novo ingresso para o mesmo evento, exclua o ingresso anteriormente criado."
        )

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



@router.get("/info", response_model=List[TicketInfo])
async def read_tickets_info(
    response: Response,
    event_id: Optional[int] = None,
    ticket_id: Optional[int] = None,
    session: AsyncSession = Depends(get_async_session),
    request_params: RequestParams = Depends(parse_react_admin_params(TicketModel)),
) -> Any:
    total = await session.scalar(
        select(func.count(TicketModel.id))
    )
    tickets_query = select(TicketModel)

    if event_id is not None:
        tickets_query = tickets_query.where(TicketModel.event_id == event_id)
    if ticket_id is not None:
        tickets_query = tickets_query.where(TicketModel.id == ticket_id)

    tickets_query = (
        tickets_query.where(TicketModel.is_sold == False)
        .offset(request_params.skip)
        .limit(request_params.limit)
        .order_by(request_params.order_by)
        .options(joinedload(TicketModel.user))
    )
    
    tickets = (
        await session.execute(tickets_query)
    ).unique().scalars().all()
    response.headers[
        "Content-Range"
    ] = f"{request_params.skip}-{request_params.skip + len(tickets)}/{total}"
    return tickets


@router.delete("/{id}", response_model=TicketSchema)
async def delete_ticket(
    id: int,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_user)
) -> Any:
    ticket = await session.get(TicketModel, id)
    
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    if ticket.user_id != user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    await session.delete(ticket)
    await session.commit()

    return ticket
