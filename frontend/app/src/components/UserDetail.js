// UserDetail.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserDetail({ match }) {
  const [user, setUser] = useState({});

//   useEffect(() => {
//     axios.get(`/api/users/${match.params.id}`)
//       .then(res => setUser(res.data))
//       .catch(err => console.error(err));
//   }, [match.params.id]);

  return (
    <div><h1>UserDetail</h1></div>
    // <div>
    //   <h2>Name: {user.name}</h2>
    //   <p>Phone: {user.phone}</p>
    //   {/* Show additional user details */}
    // </div>
  );
}

export default UserDetail;
