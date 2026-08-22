import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { BankAccount, ApiResponse } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [account, setAccount] = useState<BankAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await api.get<ApiResponse<BankAccount>>('/api/accounts/my');
        setAccount(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch account details');
      } finally {
        setLoading(false);
      }
    };
    fetchAccount();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.username}</h1>
        <p className="text-muted">Here is your account overview</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {account ? (
        <div className="dashboard-grid">
          <div className="account-card">
            <div className="account-card-header">
              <h3>{account.accountType} ACCOUNT</h3>
              <span className="badge badge-light">Active</span>
            </div>
            <div className="account-balance">
              <span className="currency-symbol">Rs.</span>
              <span className="amount">{Number(account.balance).toFixed(2)}</span>
            </div>
            <div className="account-details-bottom">
              <div>
                <p className="label">Account Number</p>
                <p className="value">{account.accountNumber}</p>
              </div>
              <div>
                <p className="label">Member Since</p>
                <p className="value">{new Date(account.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
            </div>
          </div>

          <div className="quick-actions card">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <Link to="/transfer" className="btn btn-primary full-width mb-1">
                Transfer Money
              </Link>
              <Link to="/transactions" className="btn btn-secondary full-width mb-1">
                View Transactions
              </Link>
              <Link to="/beneficiaries" className="btn btn-secondary full-width">
                Manage Beneficiaries
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="card">
          <p>No account found. Please contact support.</p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
