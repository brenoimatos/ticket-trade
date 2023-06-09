import React, { useState } from 'react';
import { login } from '../api/auth';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password)
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
      // Nesta linha você deve redirecionar o usuário
      window.location.href = '/';
  };

  return (
    <div className='login-container'>
      <form onSubmit={handleSubmit} className="login-form">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="login-input"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="login-input"
      />
      <button type="submit" className="login-button custom-button">
        Login
      </button>
    </form>
    </div>
    
  );
}

export default Login;
