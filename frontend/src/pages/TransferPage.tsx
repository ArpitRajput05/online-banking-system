import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Beneficiary, BankAccount, Transaction, ApiResponse } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const TransferPage: React.FC = () => {
  const [account, setAccount] = useState<BankAccount | null>(null);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [receiverAccount, setReceiverAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accRes, benRes] = await Promise.all([
          api.get<ApiResponse<BankAccount>>('/api/accounts/my'),
          api.get<ApiResponse<Beneficiary[]>>('/api/beneficiaries')
        ]);
        setAccount(accRes.data.data);
        setBeneficiaries(benRes.data.data || []);
      } catch (err: any) {
        setError('Failed to fetch required data.');
      } finally {
        setPageLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount.');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post<ApiResponse<Transaction>>('/api/transactions/transfer', {
        receiverAccountNumber: receiverAccount,
        amount: numAmount,
        description
      });
      const tx = response.data.data;
      setSuccess(`? Transfer successful! Your new balance is ?${Number(tx.balanceAfter).toFixed(2)}`);
      setAmount('');
      setDescription('');
      if (account) {
        setAccount({ ...account, balance: tx.balanceAfter });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Transfer failed. Please check the details and your balance.');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <LoadingSpinner />;

  return (
    <div className="page-container">
      <h2>?? Transfer Funds</h2>

      <div className="transfer-grid">
        <div className="card">
          <h3>Your Account</h3>
          {account && (
            <div className="balance-info">
              <p className="label">Available Balance</p>
              <h2 className="text-primary">?{Number(account.balance).toFixed(2)}</h2>
              <p className="text-muted">Account: {account.accountNumber}</p>
            </div>
          )}
        </div>

        <div className="card">
          <h3>Make a Transfer</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            {beneficiaries.length > 0 && (
              <div className="form-group">
                <label htmlFor="beneficiarySelect">Quick Select Beneficiary</label>
                <select
                  id="beneficiarySelect"
                  className="form-control"
                  onChange={(e) => setReceiverAccount(e.target.value)}
                  value=""
                >
                  <option value="">-- Select a saved beneficiary --</option>
                  {beneficiaries.map(b => (
                    <option key={b.id} value={b.accountNumber}>
                      {b.beneficiaryName} — {b.accountNumber} ({b.bankName})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="receiver">Receiver Account Number *</label>
              <input
                type="text"
                id="receiver"
                className="form-control"
                placeholder="10-digit account number"
                value={receiverAccount}
                onChange={(e) => setReceiverAccount(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="amount">Amount (?) *</label>
              <input
                type="number"
                id="amount"
                className="form-control"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.01"
                min="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description / Remark</label>
              <input
                type="text"
                id="description"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Rent payment"
              />
            </div>

            <button type="submit" className="btn btn-primary full-width" disabled={loading}>
              {loading ? 'Processing...' : 'Confirm Transfer'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransferPage;
