import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { AdminUser, AuditLog } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'logs'>('users');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        if (activeTab === 'users') {
          const res = await api.get<AdminUser[]>('/api/admin/users');
          setUsers(res.data);
        } else {
          const res = await api.get<AuditLog[]>('/api/admin/audit-logs');
          setLogs(res.data);
        }
      } catch (err: any) {
        setError('Failed to load admin data. Ensure you have admin privileges.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  return (
    <div className="page-container">
      <h2>Admin Dashboard</h2>
      
      <div className="admin-tabs mb-2">
        <button 
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('users')}
        >
          Manage Users
        </button>
        <button 
          className={`btn ${activeTab === 'logs' ? 'btn-primary' : 'btn-secondary'} ml-1`}
          onClick={() => setActiveTab('logs')}
        >
          Audit Logs
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card overflow-x-auto">
        {loading ? (
          <LoadingSpinner />
        ) : activeTab === 'users' ? (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td><span className={u.role === 'ADMIN' ? 'badge badge-danger' : 'badge badge-info'}>{u.role}</span></td>
                  <td>
                    <span className={u.enabled ? 'badge badge-success' : 'badge badge-danger'}>
                      {u.enabled ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Time</th>
                <th>User</th>
                <th>Action</th>
                <th>Details</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id}>
                  <td>{new Date(log.createdAt).toLocaleString()}</td>
                  <td>{log.username} (ID: {log.userId})</td>
                  <td><strong>{log.action}</strong></td>
                  <td>{log.details}</td>
                  <td>{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
