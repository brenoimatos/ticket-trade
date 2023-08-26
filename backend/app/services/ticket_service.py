import asyncio
from concurrent.futures import ThreadPoolExecutor
from typing import Any, Optional

from app.dal.tickets import TicketDal
from app.dto.request_params import RequestParams
from app.dto.ticket import TicketCreate
from app.models.ticket import Ticket
from app.models.user import User
from app.utils.process_data import fill_missing_days


class TicketService:
    def __init__(self, ticket_dal: TicketDal):
        self.dal = ticket_dal

    async def create_ticket(self, ticket: TicketCreate, user: User) -> list[Ticket]:
        return await self.dal.create_ticket_db(ticket, user)

    async def read_tickets(self, event_id: int, request_params: RequestParams) -> list[Ticket]:
        return await self.dal.read_tickets_db(event_id, request_params)

    async def read_tickets_info(self, event_id: Optional[int], ticket_id: Optional[int], request_params: RequestParams) -> Any:
        return await self.dal.read_tickets_info_db(event_id, ticket_id, request_params)

    async def delete_ticket(self, id: int, user: User) -> Ticket:
        return await self.dal.delete_ticket_db(id, user)
    
    async def get_dash_tickets_stats(self) -> Any:
        return await self.dal.get_dash_tickets_stats()

    async def get_dash_tickets_stats(self) -> Any:
        rows = await self.dal.get_dash_tickets_stats()
        loop = asyncio.get_event_loop()
        filled_rows = await loop.run_in_executor(
            ThreadPoolExecutor(), fill_missing_days,
            rows, ['created_date', 'selling_tickets', 'buying_tickets'], 'created_date'
        )
        return filled_rows


