// components/VendorKYCForm.jsx
import React, { useState } from 'react';
import axiosInstance from '../api/axiosinstance';  
import './vendorKYCForm.css';

const VendorKYCForm = ({ vendorId, onSuccess }) => {
  const [formData, setFormData] = useState({
    aadhar_number: '',
    aadhar_document: null,
    selfie: null,
    police_certificate: null
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'aadhar_number') {
      // Format Aadhar: XXXX-XXXX-XXXX
      const formatted = value.replace(/\D/g, '').slice(0, 12);
      const parts = formatted.match(/.{1,4}/g) || [];
      setFormData({ ...formData, [name]: parts.join('-') });
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({ ...formData, [name]: files[0] });
      
      // Create preview for images
      if (name === 'selfie') {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview({ ...preview, selfie: e.target.result });
        };
        reader.readAsDataURL(files[0]);
      }
    }
  };

  const validateForm = () => {
    if (!formData.aadhar_number || formData.aadhar_number.replace(/\D/g, '').length !== 12) {
      setError('Please enter a valid 12-digit Aadhar number');
      return false;
    }
    if (!formData.aadhar_document) {
      setError('Please upload Aadhar document');
      return false;
    }
    if (!formData.selfie) {
      setError('Please upload selfie photo');
      return false;
    }
    if (!formData.police_certificate) {
      setError('Please upload police verification certificate');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setLoading(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append('vendor_id', vendorId);
      formDataObj.append('aadhar_number', formData.aadhar_number);
      formDataObj.append('aadhar_document', formData.aadhar_document);
      formDataObj.append('selfie', formData.selfie);
      formDataObj.append('police_certificate', formData.police_certificate);

      const response = await axiosInstance.post(
        '/kyc/submit',
        formDataObj,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setSuccess(true);
      setFormData({
        aadhar_number: '',
        aadhar_document: null,
        selfie: null,
        police_certificate: null
      });
      
      if (onSuccess) onSuccess(response.data);

      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit KYC');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kyc-form-container">
      <h2>KYC Verification</h2>
      <p className="kyc-subtitle">Complete your KYC to start selling</p>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">KYC submitted successfully! Your documents are under review.</div>}

      <form onSubmit={handleSubmit}>
        {/* Aadhar Section */}
        <div className="form-section">
          <h3>Aadhar Details</h3>
          <div className="form-group">
            <label>Aadhar Number *</label>
            <input
              type="text"
              name="aadhar_number"
              placeholder="XXXX-XXXX-XXXX"
              value={formData.aadhar_number}
              onChange={handleInputChange}
              maxLength="14"
              required
            />
            <small>12-digit Aadhar number from UIDAI</small>
          </div>

          <div className="form-group">
            <label>Aadhar Document (PDF/JPG/PNG) *</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                name="aadhar_document"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                required
              />
              <span className="file-label">
                {formData.aadhar_document ? formData.aadhar_document.name : 'Choose file'}
              </span>
            </div>
            <small>Max 5MB. Upload clear photo of both sides or PDF</small>
          </div>
        </div>

        {/* Selfie Section */}
        <div className="form-section">
          <h3>Selfie Verification</h3>
          <div className="form-group">
            <label>Selfie Photo (JPG/PNG) *</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                name="selfie"
                accept="image/*"
                onChange={handleFileChange}
                capture="environment"
                required
              />
              <span className="file-label">
                {formData.selfie ? formData.selfie.name : 'Choose file'}
              </span>
            </div>
            <small>Ensure good lighting and clear face visibility. No filters or edits.</small>
          </div>
          {preview.selfie && (
            <div className="preview">
              <img src={preview.selfie} alt="Selfie preview" />
            </div>
          )}
        </div>

        {/* Police Verification Section */}
        <div className="form-section">
          <h3>Police Verification Certificate</h3>
          <div className="form-group">
            <label>Police Verification Certificate (PDF/JPG/PNG) *</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                name="police_certificate"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                required
              />
              <span className="file-label">
                {formData.police_certificate ? formData.police_certificate.name : 'Choose file'}
              </span>
            </div>
            <small>Max 5MB. Upload police verification certificate from your local police station.</small>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? 'Submitting...' : 'Submit KYC'}
        </button>
      </form>
    </div>
  );
};

export default VendorKYCForm;