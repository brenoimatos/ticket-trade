from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import Response

from app.deps.db import get_async_session
from app.deps.request_params import parse_react_admin_params
from app.deps.users import current_user
from app.dto.event import Event as EventSchema
from app.dto.event import EventCreate
from app.dto.request_params import RequestParams
from app.models.event import Event as EventModel
from app.models.user import User

router = APIRouter(prefix="/events")

@router.post("/", response_model=EventSchema)
async def create_event(
    event: EventCreate,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_user),
) -> Any:
    db_event = EventModel(**event.dict(), user_id=user.id)
    session.add(db_event)
    await session.commit()
    await session.refresh(db_event)
    return db_event

@router.get("/", response_model=List[EventSchema])
async def read_events(
    response: Response,
    search: Optional[str] = None,
    event_id: Optional[int] = None,
    session: AsyncSession = Depends(get_async_session),
    request_params: RequestParams = Depends(parse_react_admin_params(EventModel)),
) -> Any:
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
    response.headers[
        "Content-Range"
    ] = f"{request_params.skip}-{request_params.skip + len(events)}/{total}"
    return events
