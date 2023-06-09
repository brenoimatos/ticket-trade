// TicketDetail.js
import React from 'react';
import TicketDetailComponent from '../components/TicketDetail';

function TicketDetail({ match }) {
  return (
    <div>
      <TicketDetailComponent match={match} />
    </div>
  );
}

export default TicketDetail;
