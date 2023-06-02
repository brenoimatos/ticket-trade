const apiBaseURL = "http://localhost:9000/api/v1/";

export const getTransactions = () => {
  return fetch(`${apiBaseURL}transactions`).then(res => res.json());
}

export const createTransaction = (transaction) => {
  return fetch(`${apiBaseURL}transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transaction)
  }).then(res => res.json());
}
