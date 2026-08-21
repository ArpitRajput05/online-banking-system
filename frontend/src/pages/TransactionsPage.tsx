import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Transaction } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get<Transaction[]>('/api/transactions/my');
        // Sort descending by date
        const sorted = response.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setTransactions(sorted);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const getTypeBadgeClass = (type: string) => {
    switch(type) {
      case 'CREDIT': return 'badge badge-success';
      case 'DEBIT': return 'badge badge-danger';
      case 'TRANSFER': return 'badge badge-info';
      default: return 'badge';
    }
  };

  const getAmountClass = (type: string) => {
    return (type === 'DEBIT' || type === 'TRANSFER') ? 'text-danger' : 'text-success';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-container">
      <h2>Transaction History</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card overflow-x-auto">
        {transactions.length === 0 ? (
          <p className="text-center py-2">No transactions found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Description</th>
                <th>From/To</th>
                <th>Amount</th>
                <th>Balance After</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{new Date(tx.createdAt).toLocaleString()}</td>
                  <td><span className={getTypeBadgeClass(tx.type)}>{tx.type}</span></td>
                  <td>{tx.description || '-'}</td>
                  <td>
                    {tx.type === 'CREDIT' ? `From: ${tx.senderAccountNumber || 'System'}` : `To: ${tx.receiverAccountNumber}`}
                  </td>
                  <td className={getAmountClass(tx.type)}>
                    {tx.type === 'CREDIT' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </td>
                  <td>${tx.balanceAfter.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;
