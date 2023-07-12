from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from app.dal.events import EventDal
from app.services.crawler.base_crawler import BaseCrawler


class EventService:
    def __init__(self):
        self.dal = EventDal()

    async def create_event_db_crawler(self, session: AsyncSession, location: str, crawler: BaseCrawler) -> Any:
        # Use the crawler to get events
        events_data = crawler.get_events(location)

        # Convert DataFrame to a list of dictionaries
        events_list = events_data.to_dict(orient='records')

        # Get the list of external_ticket_id values
        external_ticket_ids = list(set([event["external_ticket_id"] for event in events_list]))

        # Delete all events that have an external_ticket_id in the list
        await self.dal.delete_events_by_external_ids(session, external_ticket_ids)

        # Bulk insert events
        await self.dal.bulk_insert_events(session, events_list)

        # Commit the session to save the changes in the database
        await session.commit()

        return location
