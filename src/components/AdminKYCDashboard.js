// components/AdminKYCDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminKYCDashboard.css';

const AdminKYCDashboard = () => {
  const [pendingKYC, setPendingKYC] = useState([]);
  const [selectedKYC, setSelectedKYC] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchPendingKYC();
  }, []);

  const fetchPendingKYC = async () => {
    try {
      const response = await axios.get('/api/admin/kyc/pending');
      setPendingKYC(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching pending KYC:', err);
      setLoading(false);
    }
  };

  const handleApprove = async (kycId) => {
    setActionLoading(true); 
    try {
      await axios.post(`/api/admin/kyc/verify/${kycId}`, {
        admin_id: localStorage.getItem('admin_id'),
        action: 'approve'
      });
      alert('KYC approved successfully');
      fetchPendingKYC();
      setSelectedKYC(null);
    } catch (err) {
      alert('Error approving KYC: ' + err.message);
    }  finally {
    setActionLoading(false);  // ✅ Add this
  }
  };

  const handleReject = async (kycId) => {
    if (!rejectionReason.trim()) {
      alert('Please provide rejection reason');
      return;
    }
    try {
      await axios.post(`/api/admin/kyc/verify/${kycId}`, {
        admin_id: localStorage.getItem('admin_id'),
        action: 'reject',
        rejection_reason: rejectionReason
      });
      alert('KYC rejected successfully');
      fetchPendingKYC();
      setSelectedKYC(null);
      setRejectionReason('');
    } catch (err) {
      alert('Error rejecting KYC: ' + err.message);
    }
  };

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="admin-kyc-dashboard">
      <h2>KYC Verification Dashboard</h2>
      <p className="count">Pending Submissions: {pendingKYC.length}</p>

      <div className="kyc-list">
        {pendingKYC.map((kyc) => (
          <div
            key={kyc._id}
            className={`kyc-card ${selectedKYC?._id === kyc._id ? 'selected' : ''}`}
            onClick={() => setSelectedKYC(kyc)}
          >
            <div className="vendor-info">
              <h4>{kyc.vendor_id.name}</h4>
              <p>{kyc.vendor_id.email}</p>
              <p className="phone">{kyc.vendor_id.phone}</p>
            </div>
            <div className="submission-date">
              Submitted: {new Date(kyc.submittedAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {selectedKYC && (
        <div className="kyc-details">
          <h3>KYC Details - {selectedKYC.vendor_id.name}</h3>

          <div className="details-section">
            <h4>Aadhar Number</h4>
            <p>{selectedKYC.aadhar.number}</p>
          </div>

          <div className="details-section">
            <h4>Documents</h4>
            <div className="document-list">
              <div className="doc-item">
                <strong>Aadhar Document:</strong>
                <a href={selectedKYC.aadhar.document.filepath} target="_blank" rel="noopener noreferrer">
                  View Document
                </a>
              </div>
              <div className="doc-item">
                <strong>Selfie:</strong>
                <img src={selectedKYC.selfie.filepath} alt="Selfie" className="doc-preview" />
              </div>
              <div className="doc-item">
                <strong>Police Certificate:</strong>
                <a href={selectedKYC.policeVerification.filepath} target="_blank" rel="noopener noreferrer">
                  View Certificate
                </a>
              </div>
            </div>
          </div>

          <div className="action-section">
            <button className="btn btn-approve" onClick={() => handleApprove(selectedKYC._id)}
                disabled={actionLoading}>
              {actionLoading ? 'Processing...' : '✓ Approve'}
            </button>

            <div className="reject-section">
              <textarea
                placeholder="Enter rejection reason (required to reject)"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
              <button className="btn btn-reject" onClick={() => handleReject(selectedKYC._id)}>
                ✗ Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminKYCDashboard;