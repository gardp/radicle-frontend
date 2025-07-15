import React, { useState } from 'react';
import '../styles/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    socialMediaLink1: '',
    socialMediaLink2: '',
    services: {
      production: false,
      recording: false,
      mixing: false,
      mastering: false,
      other: false
    },
    otherService: '',
    file: null,
    additionalInfo: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        services: {
          ...prev.services,
          [name]: checked
        }
      }));
    } else if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        file: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!Object.values(formData.services).some(value => value)) {
      newErrors.services = 'Please select at least one service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Here you would typically send the form data to your backend
      console.log('Form data:', formData);
      setSuccessMessage('Thank you for your message! We will get back to you soon.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        socialMediaLink1: '',
        socialMediaLink2: '',
        services: {
          production: false,
          recording: false,
          mixing: false,
          mastering: false,
          other: false
        },
        otherService: '',
        file: null,
        additionalInfo: ''
      });
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-form-container">
        <h2>Get in Touch</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className={`form-control ${errors.name ? 'error' : ''}`}
              value={formData.name}
              onChange={handleInputChange}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-control ${errors.email ? 'error' : ''}`}
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="socialMediaLink1">Social Media Link 1</label>
            <input
              type="text"
              id="socialMediaLink1"
              name="socialMediaLink1"
              className="form-control"
              value={formData.socialMediaLink1}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="socialMediaLink2">Social Media Link 2</label>
            <input
              type="text"
              id="socialMediaLink2"
              name="socialMediaLink2"
              className="form-control"
              value={formData.socialMediaLink2}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Services Required</label>
            <div className="checkbox-group">
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="production"
                  name="production"
                  checked={formData.services.production}
                  onChange={handleInputChange}
                />
                <label htmlFor="production">Production</label>
              </div>
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="recording"
                  name="recording"
                  checked={formData.services.recording}
                  onChange={handleInputChange}
                />
                <label htmlFor="recording">Recording</label>
              </div>
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="mixing"
                  name="mixing"
                  checked={formData.services.mixing}
                  onChange={handleInputChange}
                />
                <label htmlFor="mixing">Mixing</label>
              </div>
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="mastering"
                  name="mastering"
                  checked={formData.services.mastering}
                  onChange={handleInputChange}
                />
                <label htmlFor="mastering">Mastering</label>
              </div>
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="other"
                  name="other"
                  checked={formData.services.other}
                  onChange={handleInputChange}
                />
                <label htmlFor="other">Other</label>
              </div>
            </div>
            {errors.services && <div className="error-message">{errors.services}</div>}
          </div>

          {formData.services.other && (
            <div className="form-group">
              <label htmlFor="otherService">Please specify other service</label>
              <input
                type="text"
                id="otherService"
                name="otherService"
                className="form-control"
                value={formData.otherService}
                onChange={handleInputChange}
              />
            </div>
          )}

          <div className="form-group">
            <label>Upload File (Optional)</label>
            <div className="file-upload">
              <label htmlFor="file" className="file-upload-label">
                {formData.file ? formData.file.name : 'Choose a file...'}
              </label>
              <input
                type="file"
                id="file"
                name="file"
                onChange={handleInputChange}
                accept="audio/*,video/*"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="additionalInfo">Additional Information</label>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              className="form-control"
              value={formData.additionalInfo}
              onChange={handleInputChange}
              rows="4"
            />
          </div>

          <button type="submit" className="submit-btn">
            Send Message
          </button>
        </form>

        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;
