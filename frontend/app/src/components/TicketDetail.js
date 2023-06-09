// TicketDetail.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TicketDetail({ match }) {
  const [ticket, setTicket] = useState({});

//   useEffect(() => {
//     axios.get(`/api/tickets/${match.params.id}`)
//       .then(res => setTicket(res.data))
//       .catch(err => console.error(err));
//   }, [match.params.id]);

  return (
    <div><h1>TicketDetail</h1></div>
    // <div>
    //   <h2>Price: {ticket.price}</h2>
    //   <p>{ticket.is_for_sale ? 'For Sale' : 'Not for Sale'}</p>
    //   <p>{ticket.is_sold ? 'Sold' : 'Not Sold'}</p>
    //   {/* Show additional ticket details */}
    // </div>
  );
}

export default TicketDetail;
