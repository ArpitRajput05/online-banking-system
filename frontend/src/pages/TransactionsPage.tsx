import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Transaction, ApiResponse } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get<ApiResponse<Transaction[]>>('/api/transactions/my');
        setTransactions(response.data.data || []);
      } catch {
        setError('Failed to load transaction history.');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const getTypeBadge = (type: string) => {
    if (type === 'CREDIT')   return 'badge badge-success';
    if (type === 'TRANSFER') return 'badge badge-info';
    return 'badge badge-danger';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-container">
      <h2>Transaction History</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {transactions.length === 0 ? (
        <div className="card empty-state">
          <p>No transactions yet. Make your first transfer!</p>
        </div>
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>To / From</th>
                  <th>Amount</th>
                  <th>Balance After</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id}>
                    <td>{new Date(tx.createdAt).toLocaleString('en-IN')}</td>
                    <td><span className={getTypeBadge(tx.type)}>{tx.type}</span></td>
                    <td>{tx.description || '—'}</td>
                    <td className="account-number">{tx.receiverAccountNumber}</td>
                    <td className={tx.type === 'CREDIT' ? 'amount-credit' : 'amount-debit'}>
                      {tx.type === 'CREDIT' ? '+' : '-'} Rs.{Number(tx.amount).toFixed(2)}
                    </td>
                    <td>Rs.{Number(tx.balanceAfter).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;
