// Review.js
import React, { useState } from 'react';
import axios from 'axios';

function Review({ ticketId }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     axios.post('/api/reviews', {
//       rating,
//       comment,
//       ticket_id: ticketId,
//       // Include additional fields as needed
//     })
//     .then(response => console.log(response))
//     .catch(error => console.error(error));
//   }

  return (
    <div><h1>Review</h1></div>
    // <form onSubmit={handleSubmit}>
    //   <input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(e.target.value)} />
    //   <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
    //   <button type="submit">Submit Review</button>
    // </form>
  );
}

export default Review;
