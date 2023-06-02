import React from 'react';

function User({ user }) {
  return (
    <div>
      <h2>{user.email}</h2>
      <p>Active: {user.is_active ? "Yes" : "No"}</p>
    </div>
  );
}

export default User;
