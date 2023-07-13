from sqlalchemy.orm import Session

from app.dto.ticket import TicketCreate
from app.models.ticket import Ticket


def create_ticket(db: Session, ticket: TicketCreate):
    db_ticket = Ticket(**ticket.dict())
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

def get_available_tickets(db: Session):
    return db.query(Ticket).filter(Ticket.is_sold == False).all()
