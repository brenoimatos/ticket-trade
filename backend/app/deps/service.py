

from fastapi import Depends

from app.dal.events import EventDal
from app.dal.tickets import TicketDal
from app.dal.users import UserDal
from app.deps.dal import get_event_dal, get_ticket_dal, get_user_dal
from app.services.event_service import EventService
from app.services.ticket_service import TicketService
from app.services.user_service import UserService


async def get_user_service(dal: UserDal = Depends(get_user_dal)) -> UserService:
    return UserService(dal)

async def get_event_service(dal: EventDal = Depends(get_event_dal)) -> EventService:
    return EventService(dal)

async def get_ticket_service(dal: TicketDal = Depends(get_ticket_dal)) -> TicketService:
    return TicketService(dal)