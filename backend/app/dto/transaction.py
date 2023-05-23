from uuid import UUID

from pydantic import BaseModel


class TransactionCreate(BaseModel):
    ticket_id: int


class Transaction(TransactionCreate):
    id: int
    buyer_id: UUID

    class Config:
        orm_mode = True