# import importlib
# from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException

# from sqlalchemy import func, or_, select
# from sqlalchemy.ext.asyncio import AsyncSession
# from starlette.responses import Response

# from app.dal.events import EventDal
# from app.deps.db import get_async_session
# from app.deps.request_params import parse_react_admin_params
# from app.deps.users import current_user
# from app.dto.event import Event as EventSchema
# from app.dto.event import EventCreate
# from app.dto.request_params import RequestParams
# from app.models.event import Event as EventModel
# from app.models.user import User
# from app.services.event_service import EventService
# from app.utils.crawler_instance import get_crawler_instance

# from app.utils.models import CrawlerEnum

router = APIRouter(prefix="/events")
# dal = EventDal()
# service = EventService()

# @router.post("/", response_model=EventSchema)
# async def create_event_user(
#     event: EventCreate,
#     session: AsyncSession = Depends(get_async_session),
#     user: User = Depends(current_user),
# ) -> Any:
#     return await dal.create_event_db_user(session, event, user)

# @router.post("/crawler-events", response_model=EventSchema)
# async def create_event_crawler(
#     event: EventCreate,
#     crawler: str,
#     session: AsyncSession = Depends(get_async_session),
# ) -> Any:
#     crawler_instance = get_crawler_instance(crawler)

#     return await service.create_event_db_crawler(session, event, crawler_instance)

# @router.get("/", response_model=List[EventSchema])
# async def read_events(
#     response: Response,
#     search: Optional[str] = None,
#     event_id: Optional[int] = None,
#     session: AsyncSession = Depends(get_async_session),
#     request_params: RequestParams = Depends(parse_react_admin_params(EventModel)),
# ) -> Any:
#     events, total = await dal.read_events_db(session, search, event_id, request_params)
#     response.headers[
#         "Content-Range"
#     ] = f"{request_params.skip}-{request_params.skip + len(events)}/{total}"
#     return events

