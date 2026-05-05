import React, { useState } from 'react';
import AdminKYCDashboard from '../components/AdminKYCDashboard';
import './AdminPanel.css';

const AdminPanel = () => {
  const [currentTab, setCurrentTab] = useState('kyc');

  return (
    <div className="admin-panel-container">
      <header className="admin-header">
        <div className="admin-logo">Zollowup Admin Panel</div>
        <div className="admin-user">
          <span>Admin</span>
          <button onClick={() => {
            localStorage.removeItem('adminToken');
            window.location.href = '/admin/login';
          }}>
            Logout
          </button>
        </div>
      </header>

      <nav className="admin-nav">
        <button 
          className={`nav-btn ${currentTab === 'kyc' ? 'active' : ''}`}
          onClick={() => setCurrentTab('kyc')}
        >
          📋 KYC Verification
        </button>
        <button 
          className={`nav-btn ${currentTab === 'vendors' ? 'active' : ''}`}
          onClick={() => setCurrentTab('vendors')}
        >
          👥 Vendors
        </button>
        <button 
          className={`nav-btn ${currentTab === 'settings' ? 'active' : ''}`}
          onClick={() => setCurrentTab('settings')}
        >
          ⚙️ Settings
        </button>
      </nav>

      <main className="admin-content">
        {currentTab === 'kyc' && <AdminKYCDashboard />}
        {currentTab === 'vendors' && <div>Vendors Management (Coming Soon)</div>}
        {currentTab === 'settings' && <div>Settings (Coming Soon)</div>}
      </main>
    </div>
  );
};

export default AdminPanel;