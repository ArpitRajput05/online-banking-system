import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Beneficiary } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const BeneficiaryPage: React.FC = () => {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form state
  const [name, setName] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [bankName, setBankName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchBeneficiaries = async () => {
    try {
      setLoading(true);
      const response = await api.get<Beneficiary[]>('/api/beneficiaries');
      setBeneficiaries(response.data);
    } catch (err: any) {
      setError('Failed to fetch beneficiaries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await api.post('/api/beneficiaries', {
        beneficiaryName: name,
        accountNumber: accountNo,
        bankName: bankName
      });
      setName('');
      setAccountNo('');
      setBankName('');
      fetchBeneficiaries();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add beneficiary');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this beneficiary?')) return;
    
    try {
      await api.delete(`/api/beneficiaries/${id}`);
      fetchBeneficiaries();
    } catch (err: any) {
      setError('Failed to delete beneficiary');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-container">
      <h2>Manage Beneficiaries</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="dashboard-grid">
        <div className="card">
          <h3>Add New Beneficiary</h3>
          <form onSubmit={handleAdd}>
            <div className="form-group">
              <label>Beneficiary Name</label>
              <input 
                type="text" 
                className="form-control" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Account Number</label>
              <input 
                type="text" 
                className="form-control" 
                value={accountNo} 
                onChange={(e) => setAccountNo(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Bank Name</label>
              <input 
                type="text" 
                className="form-control" 
                value={bankName} 
                onChange={(e) => setBankName(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Beneficiary'}
            </button>
          </form>
        </div>

        <div className="card">
          <h3>Saved Beneficiaries</h3>
          {beneficiaries.length === 0 ? (
            <p className="text-muted mt-1">No beneficiaries saved yet.</p>
          ) : (
            <ul className="beneficiary-list">
              {beneficiaries.map(ben => (
                <li key={ben.id} className="beneficiary-item">
                  <div className="ben-details">
                    <h4>{ben.beneficiaryName}</h4>
                    <p>{ben.accountNumber} - {ben.bankName}</p>
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(ben.id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryPage;
