import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const isLoginSuccessful = true;

    if (isLoginSuccessful) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Student Notes App Login</h2>
        <form onSubmit={handleLogin}>
          <label>
            Username:
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
          <br />
          <label>
            Password:
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <br />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
