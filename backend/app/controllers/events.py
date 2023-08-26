from typing import Any, List, Optional

from fastapi import APIRouter, Depends
from starlette.responses import Response

from app.deps.request_params import parse_react_admin_params
from app.deps.service import get_event_service
from app.deps.users import current_user
from app.dto.event import Event as EventSchema
from app.dto.event import EventCreate
from app.dto.request_params import RequestParams
from app.models.event import Event as EventModel
from app.models.user import User
from app.services.event_service import EventService
from app.utils.crawler_instance import get_crawler_instance
from app.utils.models import CrawlerEnum

router = APIRouter(prefix="/events")

@router.post("/", response_model=EventSchema)
async def create_event_user(
    event: EventCreate,
    user: User = Depends(current_user),
    service: EventService = Depends(get_event_service)
) -> Any:
    return await service.create_event_user(event, user)

@router.post("/crawler-events", response_model=int)
async def create_event_crawler(
    location: str,
    crawler: CrawlerEnum,
    service: EventService = Depends(get_event_service)
) -> Any:
    crawler_instance = get_crawler_instance(crawler)
    return await service.create_event_db_crawler(location, crawler_instance)

@router.get("/", response_model=List[EventSchema])
async def read_events(
    response: Response,
    search: Optional[str] = None,
    event_id: Optional[int] = None,
    request_params: RequestParams = Depends(parse_react_admin_params(EventModel)),
    service: EventService = Depends(get_event_service)
) -> Any:
    events, total = await service.read_events(search, event_id, request_params)
    response.headers["Content-Range"] = f"{request_params.skip}-{request_params.skip + len(events)}/{total}"
    return events