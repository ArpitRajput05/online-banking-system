import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) =>
    location.pathname === path
      ? { color: '#fff', background: 'rgba(255,255,255,0.15)' }
      : {};

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          SecureBank
        </Link>

        <div className="navbar-links">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard"     style={isActive('/dashboard')}>Dashboard</Link>
              <Link to="/transfer"      style={isActive('/transfer')}>Transfer</Link>
              <Link to="/transactions"  style={isActive('/transactions')}>Transactions</Link>
              <Link to="/beneficiaries" style={isActive('/beneficiaries')}>Beneficiaries</Link>
              {isAdmin && (
                <Link to="/admin" className="admin-link" style={isActive('/admin')}>Admin</Link>
              )}
              <div className="navbar-user">
                <span className="user-greeting">Hi, <span>{user?.username}</span></span>
                <button onClick={handleLogout} className="btn-logout">Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={isActive('/login')}>Login</Link>
              <Link to="/register" className="navbar-register-btn">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
