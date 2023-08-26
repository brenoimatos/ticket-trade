from fastapi import Depends
from sqlalchemy.ext.asyncio.session import AsyncSession

from app.dal.events import EventDal
from app.dal.tickets import TicketDal
from app.dal.users import UserDal
from app.deps.db import get_async_session


async def get_user_dal(db_session: AsyncSession = Depends(get_async_session)) -> UserDal:
    return UserDal(db_session)


async def get_event_dal(db_session: AsyncSession = Depends(get_async_session)) -> EventDal:
    return EventDal(db_session)

async def get_ticket_dal(db_session: AsyncSession = Depends(get_async_session)) -> TicketDal:
    return TicketDal(db_session)