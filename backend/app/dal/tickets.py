# dal/tickets.py

from typing import Any, Optional

from fastapi import HTTPException
from sqlalchemy import Date, case, cast, func, select
from sqlalchemy.orm import joinedload

from app.dal.db import Dal
from app.dto.request_params import RequestParams
from app.dto.ticket import TicketCreate
from app.models.ticket import Ticket as TicketModel
from app.models.user import User


class TicketDal(Dal):
    async def create_ticket_db(self, ticket: TicketCreate, user: User) -> Any:
        existing_tickets_count = (
            await self.session.execute(
                select(func.count(TicketModel.id)).where(
                    TicketModel.user_id == user.id, 
                    TicketModel.event_id == ticket.event_id)
            )
        ).scalar_one_or_none()

        if existing_tickets_count is not None and existing_tickets_count >= 2:
            raise HTTPException(
                status_code=400, 
                detail="Você já possui 2 ingressos para este evento. Para anunciar um novo ingresso para o mesmo evento, exclua um dos ingressos anteriormente criados."
            )

        db_ticket = TicketModel(**ticket.dict(), user_id=user.id)
        self.session.add(db_ticket)
        await self.session.commit()
        await self.session.refresh(db_ticket)
        return db_ticket

    async def read_tickets_db(self, event_id: int, request_params: RequestParams) -> Any:
        total = await self.session.scalar(
            select(func.count(TicketModel.id))
        )
        tickets = (
            await self.session.execute(
                select(TicketModel)
                .where(TicketModel.event_id == event_id)
                .where(TicketModel.is_sold == False)
                .offset(request_params.skip)
                .limit(request_params.limit)
                .order_by(request_params.order_by)
            )
        ).scalars().all()
        return tickets, total

    async def read_tickets_info_db(self, event_id: Optional[int], ticket_id: Optional[int], request_params: RequestParams) -> Any:
        total = await self.session.scalar(
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
            await self.session.execute(tickets_query)
        ).unique().scalars().all()
        return tickets, total

    async def delete_ticket_db(self, id: int, user: User) -> TicketModel:
        ticket = await self.session.get(TicketModel, id)
        
        if not ticket:
            raise HTTPException(status_code=404, detail="Ticket not found")

        if ticket.user_id != user.id:
            raise HTTPException(status_code=403, detail="Not enough permissions")

        await self.session.delete(ticket)
        await self.session.commit()

        return ticket
    
    async def get_dash_tickets_stats(self) -> list[TicketModel]:
        query = (
            select(
                cast(TicketModel.created_at, Date).label('created_date'),
                func.sum(case((TicketModel.is_for_sale == True, 1), else_=0)).label('selling_tickets'),
                func.sum(case((TicketModel.is_for_sale == False, 1), else_=0)).label('buying_tickets')
            )
            .group_by("created_date")
            .order_by("created_date")
        )
        
        result = await self.session.execute(query)
        return result.fetchall()
