from typing import List, Optional, Tuple

from sqlalchemy import delete, func, or_, select
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
        total = await session.scalar(
            select(func.count(EventModel.id))
        )
        
        query = select(EventModel).offset(request_params.skip).limit(request_params.limit).order_by(request_params.order_by)
        
        if event_id is not None:
            query = query.where(EventModel.id == event_id)
        if search:
            query = query.where(or_(EventModel.name.ilike(f"%{search}%"), EventModel.location.ilike(f"%{search}%")))
            
        events = (
            await session.execute(query)
        ).scalars().all()
        return events, total

    async def delete_events_by_external_ids(self, session: AsyncSession, external_ticket_ids: List[str]) -> None:
        # Delete all events that have an external_ticket_id in the list
        await session.execute(
            delete(EventModel).where(EventModel.external_ticket_id.in_(external_ticket_ids))
        )

    async def bulk_insert_events(self, session: AsyncSession, events_data: List[dict]) -> None:
        # Bulk insert events
        session.bulk_insert_mappings(EventModel, events_data)
        await session.commit()
