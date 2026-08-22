import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { ApiResponse, AuthResponse } from '../types';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/api/auth/register', { username, email, password });
      login(response.data.data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <div className="auth-logo-text">SB</div>
        <h2>Create Account</h2>
        <p className="subtitle">Join SecureBank — get Rs. 10,000 welcome balance</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" className="form-control" placeholder="Choose a username"
              value={username} onChange={(e) => setUsername(e.target.value)} required minLength={3} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" className="form-control" placeholder="Enter your email"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" className="form-control" placeholder="Minimum 6 characters"
              value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          <button type="submit" className="btn btn-primary full-width" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-links">
          <p>Already have an account? <Link to="/login">Sign in here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
