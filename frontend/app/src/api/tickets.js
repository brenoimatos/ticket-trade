const apiBaseURL = "http://localhost:9000/api/v1/";

export const getTicket = (id) => {
  return fetch(`${apiBaseURL}ticket/${id}`, {
    credentials: 'include',
  }).then(res => res.json());
}

export const getTickets = () => {
  return fetch(`${apiBaseURL}tickets`, {
    credentials: 'include',
  }).then(res => res.json());
}


export const createTicket = async (ticket) => {
  const res = await fetch(`${apiBaseURL}tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ticket),
    credentials: 'include'
  });
  return await res.json();
}

export const updateTicket = (id, ticket) => {
  return fetch(`${apiBaseURL}tickets/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ticket),
    credentials: 'include',
  }).then(res => res.json());
}

export const deleteTicket = (id) => {
  return fetch(`${apiBaseURL}tickets/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  }).then(res => res.json());
}
