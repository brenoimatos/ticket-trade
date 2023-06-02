import React from 'react';

function Transaction({ transaction }) {
  return (
    <div>
      <h2>Transaction ID: {transaction.id}</h2>
      <p>Buyer ID: {transaction.buyer_id}</p>
    </div>
  );
}

export default Transaction;
