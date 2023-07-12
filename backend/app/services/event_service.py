from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from app.dal.events import EventDal
from app.services.crawler.base_crawler import BaseCrawler
from app.utils.models import StatusEnum


class EventService:
    def __init__(self):
        self.dal = EventDal()

    async def create_event_db_crawler(self, session: AsyncSession, location: str, crawler: BaseCrawler) -> int:
        adm_user_id = await self.dal.get_adm_user_id(session)
        events_data = crawler.get_events(location).assign(location=location, status=StatusEnum.ACCEPTED, user_id=adm_user_id)
        events_list = events_data.to_dict(orient='records')

        external_ticket_ids = list(set([event["external_ticket_id"] for event in events_list]))

        external_ids_in_db = await self.dal.filter_events_by_external_ids(session, external_ticket_ids)

        events_to_insert = events_data[~events_data["external_ticket_id"].isin(external_ids_in_db)]

        inserted_events = await self.dal.bulk_insert_events(session, events_to_insert.to_dict(orient='records'))

        await session.commit()

        return len(events_to_insert)
