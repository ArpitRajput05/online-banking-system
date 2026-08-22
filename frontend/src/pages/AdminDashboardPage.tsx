import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { AdminUser, AuditLog, ApiResponse } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'audit'>('users');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [usersRes, auditRes] = await Promise.all([
          api.get<ApiResponse<AdminUser[]>>('/api/admin/users'),
          api.get<ApiResponse<AuditLog[]>>('/api/admin/audit-logs')
        ]);
        setUsers(usersRes.data.data || []);
        setAuditLogs(auditRes.data.data || []);
      } catch {
        setError('Failed to load admin data.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-container">
      <h2>Admin Dashboard</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="tab-container">
        <button className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}>
          Users ({users.length})
        </button>
        <button className={`tab-btn ${activeTab === 'audit' ? 'active' : ''}`}
          onClick={() => setActiveTab('audit')}>
          Audit Logs ({auditLogs.length})
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="card">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td><strong>{u.username}</strong></td>
                    <td>{u.email}</td>
                    <td><span className={`badge ${u.role === 'ADMIN' ? 'badge-danger' : 'badge-info'}`}>{u.role}</span></td>
                    <td><span className={`badge ${u.enabled ? 'badge-success' : 'badge-danger'}`}>{u.enabled ? 'Active' : 'Disabled'}</span></td>
                    <td>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="card">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Username</th>
                  <th>Action</th>
                  <th>Details</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map(log => (
                  <tr key={log.id}>
                    <td>{new Date(log.createdAt).toLocaleString('en-IN')}</td>
                    <td><strong>{log.username}</strong></td>
                    <td><span className="badge badge-info">{log.action}</span></td>
                    <td>{log.details}</td>
                    <td className="text-muted">{log.ipAddress}</td>
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

export default AdminDashboardPage;
