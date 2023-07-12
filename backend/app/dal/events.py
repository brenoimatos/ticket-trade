from datetime import datetime
from typing import List, Optional, Tuple

from sqlalchemy import and_, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dto.event import EventCreate
from app.dto.request_params import RequestParams
from app.models.event import Event as EventModel
from app.models.user import User
from app.utils.models import StatusEnum


class EventDal:
    async def create_event_db_user(self, session: AsyncSession, event: EventCreate, user: User) -> EventModel:
        db_event = EventModel(**event.dict(), user_id=user.id, status=StatusEnum.PENDING)
        session.add(db_event)
        await session.commit()
        await session.refresh(db_event)
        return db_event

    async def read_events_db(
        self, 
        session: AsyncSession,
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

        total = await session.scalar(total_query)
        events = await session.execute(query)
        events = events.scalars().all()
        return events, total

    async def filter_events_by_external_ids(self, session: AsyncSession, external_ticket_ids: List[str]) -> List[str]:
        result = await session.execute(
            select(EventModel.external_ticket_id).where(EventModel.external_ticket_id.in_(external_ticket_ids))
        )
        found_ids = [row[0] for row in result]
        return set(found_ids)

    async def bulk_insert_events(self, session: AsyncSession, events_data: List[dict]) -> None:
        events = [EventModel(**event_data) for event_data in events_data]
        session.add_all(events)
        return await session.commit()

    async def get_adm_user_id(self, session: AsyncSession) -> int:
        ADM_EMAIL = 'breno.imbico@gmail.com'
        result = await session.execute(
            select(User.id).where(User.email == ADM_EMAIL)
        )
        user_id = result.scalar_one()
        return user_id


