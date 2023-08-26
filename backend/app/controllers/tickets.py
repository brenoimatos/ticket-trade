# controllers/tickets.py

from typing import Any, List, Optional

from fastapi import APIRouter, Depends
from starlette.responses import Response

from app.deps.request_params import parse_react_admin_params
from app.deps.service import get_ticket_service
from app.deps.users import current_superuser, current_user
from app.dto.request_params import RequestParams
from app.dto.ticket import Ticket as TicketSchema
from app.dto.ticket import TicketCreate, TicketDashStats, TicketInfo
from app.models.ticket import Ticket as TicketModel
from app.models.user import User
from app.services.ticket_service import TicketService

router = APIRouter(prefix="/tickets")


@router.post("/", response_model=TicketSchema)
async def create_ticket(
    ticket: TicketCreate,
    service: TicketService = Depends(get_ticket_service),
    user: User = Depends(current_user)
) -> Any:
    return await service.create_ticket(ticket, user)

@router.get("/", response_model=List[TicketSchema])
async def read_tickets(
    response: Response,
    event_id: int,
    service: TicketService = Depends(get_ticket_service),
    request_params: RequestParams = Depends(parse_react_admin_params(TicketModel)),
) -> Any:
    tickets, total = await service.read_tickets(event_id, request_params)
    response.headers["Content-Range"] = f"{request_params.skip}-{request_params.skip + len(tickets)}/{total}"
    return tickets

@router.get("/info", response_model=List[TicketInfo])
async def read_tickets_info(
    response: Response,
    event_id: Optional[int] = None,
    ticket_id: Optional[int] = None,
    service: TicketService = Depends(get_ticket_service),
    request_params: RequestParams = Depends(parse_react_admin_params(TicketModel)),
) -> Any:
    tickets, total = await service.read_tickets_info(event_id, ticket_id, request_params)
    response.headers["Content-Range"] = f"{request_params.skip}-{request_params.skip + len(tickets)}/{total}"
    return tickets

@router.get("/dash/stats", response_model=List[TicketDashStats])
async def get_dash_tickets_stats(
    service: TicketService = Depends(get_ticket_service),
) -> Any:
    
    return await service.get_dash_tickets_stats()

@router.delete("/{id}", response_model=TicketSchema)
async def delete_ticket(
    id: int,
    service: TicketService = Depends(get_ticket_service),
    user: User = Depends(current_superuser)
) -> Any:
    return await service.delete_ticket(id, user)
