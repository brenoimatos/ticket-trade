from sqlalchemy.orm import Session

from app.dto.ticket import TicketCreate
from app.dto.transaction import TransactionCreate
from app.models.ticket import Ticket
from app.models.transaction import Transaction


def create_ticket(db: Session, ticket: TicketCreate):
    db_ticket = Ticket(**ticket.dict())
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

def get_available_tickets(db: Session):
    return db.query(Ticket).filter(Ticket.is_sold == False).all()

def purchase_ticket(db: Session, transaction: TransactionCreate):
    ticket = db.query(Ticket).filter(Ticket.id == transaction.ticket_id).first()
    if ticket and not ticket.is_sold:
        ticket.is_sold = True
        db_transaction = Transaction(**transaction.dict())
        db.add(db_transaction)
        db.commit()
        db.refresh(db_transaction)
        return db_transaction
    return None
