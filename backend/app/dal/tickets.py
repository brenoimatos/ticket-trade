# dal/tickets.py

from typing import Any, Optional

from fastapi import HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.dto.request_params import RequestParams
from app.dto.ticket import TicketCreate
from app.models.ticket import Ticket as TicketModel
from app.models.user import User


class TicketDal:
    async def create_ticket_db(self, session: AsyncSession, ticket: TicketCreate, user: User) -> Any:
        existing_tickets_count = (
            await session.execute(
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
        session.add(db_ticket)
        await session.commit()
        await session.refresh(db_ticket)
        return db_ticket


    async def read_tickets_db(self, session: AsyncSession, event_id: int, request_params: RequestParams) -> Any:
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
        return tickets, total

    async def read_tickets_info_db(self, session: AsyncSession, event_id: Optional[int], ticket_id: Optional[int], request_params: RequestParams) -> Any:
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
        return tickets, total

    async def delete_ticket_db(self, session: AsyncSession, id: int, user: User) -> Any:
        ticket = await session.get(TicketModel, id)
        
        if not ticket:
            raise HTTPException(status_code=404, detail="Ticket not found")

        if ticket.user_id != user.id:
            raise HTTPException(status_code=403, detail="Not enough permissions")

        await session.delete(ticket)
        await session.commit()

        return ticket