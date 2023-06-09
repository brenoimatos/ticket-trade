// PhoneShareRequest.js
import React, { useState } from 'react';
import axios from 'axios';

function PhoneShareRequest({ ticketId }) {
  const [requestSent, setRequestSent] = useState(false);

//   const handleRequest = () => {
//     axios.post('/api/phoneShareRequests', {
//       ticket_id: ticketId,
//       // Include additional fields as needed
//     })
//     .then(response => setRequestSent(true))
//     .catch(error => console.error(error));
//   }

  return (
    <div><h1>PhoneShare</h1></div>
    // <button onClick={handleRequest}>
    //   {requestSent ? 'Request Sent' : 'Request Phone Share'}
    // </button>
  );
}

export default PhoneShareRequest;
