from fastapi import APIRouter

from app.controllers import tickets, transactions, users

api_router = APIRouter()

api_router.include_router(users.router, tags=["users"])
api_router.include_router(tickets.router, tags=["tickets"])
api_router.include_router(transactions.router, tags=["transactions"])