from typing import Any

from app.dal.events import EventDal
from app.services.crawler.base_crawler import BaseCrawler
from app.utils.models import StatusEnum


class EventService:
    def __init__(self, event_dal: EventDal):
        self.dal = event_dal
    
    async def create_event_user(self, event, user):
        return await self.dal.create_event_db_user(event, user)

    async def read_events(self, search, event_id, request_params):
        return await self.dal.read_events_db(search, event_id, request_params)

    async def create_event_db_crawler(self, location: str, crawler: BaseCrawler) -> int:
        adm_user_id = await self.dal.get_adm_user_id()
        events_data = crawler.get_events(location).assign(location=location, status=StatusEnum.ACCEPTED, user_id=adm_user_id)
        events_list = events_data.to_dict(orient='records')

        external_ticket_ids = list(set([event["external_ticket_id"] for event in events_list]))

        external_ids_in_db = await self.dal.filter_events_by_external_ids(external_ticket_ids)

        events_to_insert = events_data[~events_data["external_ticket_id"].isin(external_ids_in_db)]

        inserted_events = await self.dal.bulk_insert_events(events_to_insert.to_dict(orient='records'))

        return len(events_to_insert)
    
    async def get_total_events_with_tickets_count(self) -> int:
        return await self.dal.get_total_events_with_tickets_count()

    async def get_dash_events_hot(self, skip: int, limit: int) -> list[Any]:
        return await self.dal.get_dash_events_hot(skip, limit)
