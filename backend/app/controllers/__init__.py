from fastapi import APIRouter

from app.controllers import (events, phone_share_requests, review, tickets,
                             users)

api_router = APIRouter()

api_router.include_router(users.router, tags=["users"])
api_router.include_router(tickets.router, tags=["tickets"])
api_router.include_router(events.router, tags=["events"])
api_router.include_router(phone_share_requests.router, tags=["phone_share_requests"])
api_router.include_router(review.router, tags=["reviews"])