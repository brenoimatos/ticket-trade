import queryString from 'query-string';

const apiBaseURL = "http://localhost:9000/api/v1/";

export const login = (username, password) => {
  return fetch(`${apiBaseURL}auth/jwt/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: queryString.stringify({ username, password }),
    credentials: 'include'
  }).then(res => console.log('Logged on'));
}

export const logout = () => {
  return fetch(`${apiBaseURL}auth/jwt/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }).then(res => res.json());
}

export const register = (email, password) => {
  return fetch(`${apiBaseURL}auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  }).then(res => res.json());
}
