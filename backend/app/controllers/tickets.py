# controllers/tickets.py

from typing import Any, List, Optional

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import Response

from app.dal.tickets import TicketDal
from app.deps.db import get_async_session
from app.deps.request_params import parse_react_admin_params
from app.deps.users import current_user
from app.dto.request_params import RequestParams
from app.dto.ticket import Ticket as TicketSchema
from app.dto.ticket import TicketCreate, TicketInfo
from app.models.ticket import Ticket as TicketModel
from app.models.user import User

dal = TicketDal()
router = APIRouter(prefix="/tickets")


@router.post("/", response_model=TicketSchema)
async def create_ticket(
    ticket: TicketCreate,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_user)
) -> Any:
    return await dal.create_ticket_db(session, ticket, user)

@router.get("/", response_model=List[TicketSchema])
async def read_tickets(
    response: Response,
    event_id: int,
    session: AsyncSession = Depends(get_async_session),
    request_params: RequestParams = Depends(parse_react_admin_params(TicketModel)),
) -> Any:
    tickets, total = await dal.read_tickets_db(session, event_id, request_params)
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
    tickets, total = await dal.read_tickets_info_db(session, event_id, ticket_id, request_params)
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
    return await dal.delete_ticket_db(session, id, user)