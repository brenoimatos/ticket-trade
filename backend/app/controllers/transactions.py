from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio.session import AsyncSession
from starlette.responses import Response

from app.deps.db import get_async_session
from app.deps.request_params import parse_react_admin_params
from app.deps.users import current_user
from app.dto.request_params import RequestParams
from app.dto.transaction import Transaction as TransactionSchema
from app.dto.transaction import TransactionCreate
from app.models.ticket import Ticket as TicketModel
from app.models.transaction import Transaction as TransactionModel
from app.models.user import User

router = APIRouter(prefix="/transaction")


@router.get("", response_model=List[TransactionSchema])
async def get_transactions(
    response: Response,
    session: AsyncSession = Depends(get_async_session),
    request_params: RequestParams = Depends(parse_react_admin_params(TransactionModel)),
    user: User = Depends(current_user),
) -> Any:
    total = await session.scalar(
        select(func.count(TransactionModel.id).filter(TransactionModel.buyer_id == user.id))
    )
    transactions = (
        (
            await session.execute(
                select(TransactionModel)
                .offset(request_params.skip)
                .limit(request_params.limit)
                .order_by(request_params.order_by)
                .filter(TransactionModel.buyer_id == user.id)
            )
        )
        .scalars()
        .all()
    )
    response.headers[
        "Content-Range"
    ] = f"{request_params.skip}-{request_params.skip + len(transactions)}/{total}"
    return transactions


@router.post("", response_model=TransactionSchema, status_code=201)
async def create_transaction(
    transaction_in: TransactionCreate,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_user),
) -> Any:
    ticket = (
        await session.execute(
            select(TicketModel).where(TicketModel.id == transaction_in.ticket_id)
        )
    ).scalar_one_or_none()
    if ticket is None or ticket.is_sold or ticket.user_id == user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ticket is already sold or does not exist or is from same user.",
        )
    db_transaction = TransactionModel(
        **transaction_in.dict(), buyer_id=user.id
    )
    session.add(db_transaction)
    ticket.is_sold = True
    session.add(ticket)

    await session.commit()
    await session.refresh(db_transaction)
    return db_transaction