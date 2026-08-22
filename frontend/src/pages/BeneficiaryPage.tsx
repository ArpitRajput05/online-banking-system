import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Beneficiary, BeneficiaryRequest, ApiResponse } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const BeneficiaryPage: React.FC = () => {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [name, setName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [adding, setAdding] = useState(false);

  const fetchBeneficiaries = async () => {
    try {
      const response = await api.get<ApiResponse<Beneficiary[]>>('/api/beneficiaries');
      setBeneficiaries(response.data.data || []);
    } catch {
      setError('Failed to load beneficiaries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBeneficiaries(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setAdding(true);
    try {
      await api.post<ApiResponse<Beneficiary>>('/api/beneficiaries', {
        beneficiaryName: name,
        accountNumber,
        bankName
      } as BeneficiaryRequest);
      setSuccess('Beneficiary added successfully.');
      setName(''); setAccountNumber(''); setBankName('');
      fetchBeneficiaries();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add beneficiary.');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Remove this beneficiary?')) return;
    try {
      await api.delete(`/api/beneficiaries/${id}`);
      setBeneficiaries(prev => prev.filter(b => b.id !== id));
      setSuccess('Beneficiary removed.');
    } catch {
      setError('Failed to remove beneficiary.');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-container">
      <h2>Beneficiary Management</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="transfer-grid">
        <div className="card">
          <h3>Add Beneficiary</h3>
          <form onSubmit={handleAdd}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" className="form-control" placeholder="Beneficiary full name"
                value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Account Number</label>
              <input type="text" className="form-control" placeholder="10-digit account number"
                value={accountNumber} onChange={e => setAccountNumber(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Bank Name</label>
              <input type="text" className="form-control" placeholder="e.g., SecureBank"
                value={bankName} onChange={e => setBankName(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary full-width" disabled={adding}>
              {adding ? 'Adding...' : 'Add Beneficiary'}
            </button>
          </form>
        </div>

        <div className="card">
          <h3>Saved Beneficiaries ({beneficiaries.length})</h3>
          {beneficiaries.length === 0 ? (
            <p className="text-muted">No beneficiaries added yet.</p>
          ) : (
            <div className="beneficiary-list">
              {beneficiaries.map(b => (
                <div key={b.id} className="beneficiary-item">
                  <div className="beneficiary-info">
                    <strong>{b.beneficiaryName}</strong>
                    <p>{b.accountNumber}</p>
                    <small>{b.bankName}</small>
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(b.id)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryPage;
