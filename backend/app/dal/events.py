from datetime import datetime
from typing import List, Optional, Tuple

from sqlalchemy import and_, case, desc, func, join, or_, select

from app.dal.db import Dal
from app.dto.event import EventCreate
from app.dto.request_params import RequestParams
from app.models.event import Event as EventModel
from app.models.ticket import Ticket as TicketModel
from app.models.user import User
from app.utils.models import StatusEnum


class EventDal(Dal):
    async def create_event_db_user(self, event: EventCreate, user: User) -> EventModel:
        db_event = EventModel(**event.dict(), user_id=user.id, status=StatusEnum.PENDING)
        self.session.add(db_event)
        await self.session.commit()
        await self.session.refresh(db_event)
        return db_event

    async def read_events_db(
        self, 
        search: Optional[str],
        event_id: Optional[int],
        request_params: RequestParams
    ) -> Tuple[List[EventModel], int]:
        total_query = select(func.count(EventModel.id))

        query = select(EventModel).offset(request_params.skip).limit(request_params.limit).order_by(request_params.order_by)

        if event_id is not None:
            query = query.where(EventModel.id == event_id)
        else:
            query = query.where(and_(EventModel.status == StatusEnum.ACCEPTED, EventModel.date > datetime.now()))
        if search:
            search_filter = or_(
                EventModel.name.ilike(f"%{search}%"),
                EventModel.location.ilike(f"%{search}%")
            )
            query = query.where(search_filter)
            total_query = total_query.where(search_filter)

        total = await self.session.scalar(total_query)
        events = await self.session.execute(query)
        events = events.scalars().all()
        return events, total

    async def filter_events_by_external_ids(self, external_ticket_ids: List[str]) -> List[str]:
        result = await self.session.execute(
            select(EventModel.external_ticket_id).where(EventModel.external_ticket_id.in_(external_ticket_ids))
        )
        found_ids = [row[0] for row in result]
        return set(found_ids)

    async def bulk_insert_events(self, events_data: List[dict]) -> None:
        events = [EventModel(**event_data) for event_data in events_data]
        self.session.add_all(events)
        return await self.session.commit()

    async def get_adm_user_id(self) -> int:
        ADM_EMAIL = 'breno.imbico@gmail.com'
        result = await self.session.execute(
            select(User.id).where(User.email == ADM_EMAIL)
        )
        user_id = result.scalar_one()
        return user_id
    
    async def get_total_events_with_tickets_count(self) -> int:
        subquery = (
            select(TicketModel.event_id)
            .where(TicketModel.event_id == EventModel.id)
            .exists()
        )
        query = select(func.count()).select_from(EventModel).where(and_(
            EventModel.date >= func.current_timestamp(),
            subquery
        ))
        total = await self.session.scalar(query)
        return total

    async def get_dash_events_hot(self, skip: int, limit: int) -> List[EventModel]:
        stmt = (
            select(
                EventModel.id,
                EventModel.name,
                EventModel.location,
                EventModel.date,
                func.sum(TicketModel.quantity).label('total_tickets'),
                func.sum(
                    case(
                        (TicketModel.is_for_sale == True, TicketModel.quantity),
                        else_=0
                    )
                ).label('tickets_selling'),
                func.sum(
                    case(
                        (TicketModel.is_for_sale == False, TicketModel.quantity),
                        else_=0
                    )
                ).label('tickets_buying'),
                func.avg(
                    case(
                        (TicketModel.is_for_sale == True, TicketModel.price),
                        else_=None
                    )
                ).label('average_price_selling'),
                func.avg(
                    case(
                        (TicketModel.is_for_sale == False, TicketModel.price),
                        else_=None
                    )
                ).label('average_price_buying')
            )
            .select_from(
                join(EventModel, TicketModel, TicketModel.event_id == EventModel.id)
            )
            .where(EventModel.date >= func.current_timestamp())
            .group_by(EventModel.id, EventModel.name, EventModel.date, EventModel.location)
            .order_by(desc(func.sum(TicketModel.quantity)))
            .offset(skip)
            .limit(limit)
        )

        result = await self.session.execute(stmt)
        return result.fetchall()



