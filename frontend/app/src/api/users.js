const apiBaseURL = "http://localhost:9000/api/v1/";

export const getUserById = (id) => {
  return fetch(`${apiBaseURL}users/${id}`).then(res => res.json());
}

export const getUser = () => {
  return fetch(`${apiBaseURL}users/me`, {credentials: 'include'}).then(res => res.json());
}

export const updateUser = (id, user) => {
  return fetch(`${apiBaseURL}users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  }).then(res => res.json());
}

export const deleteUser = (id) => {
  return fetch(`${apiBaseURL}users/${id}`, {
    method: 'DELETE'
  }).then(res => res.json());
}
