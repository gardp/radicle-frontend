import React, { useState, useEffect } from 'react';
import { contactApi } from '../api';
import '../styles/Contact.css';
// import ReCAPTCHA from 'react-google-recaptcha';


const Contact = () => {
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    socialMediaLink1: '',
    socialMediaLink2: '',
    servicesRequired: {
      production: false,
      recording: false,
      mixing: false,
      mastering: false,
      other: false
    },
    servicesRequiredOther: '',
    file: null,
    additionalInfo: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;

    // Add global callback
    window.recaptchaCallback = (token) => {
      setRecaptchaToken(token);
    };
    window.recaptchaError = () => {
    setErrors(prev => ({ ...prev, recaptcha: 'reCAPTCHA failed to load. Please refresh the page.' }));
  };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      delete window.recaptchaCallback;
      delete window.recaptchaError;
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        servicesRequired: {
          ...prev.servicesRequired,
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

    if (!Object.values(formData.servicesRequired).some(value => value)) {
      newErrors.servicesRequired = 'Please select at least one service';
    }

    if (!recaptchaToken) {
      newErrors.recaptcha = 'Please complete the reCAPTCHA';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Here you would typically send the form data to your backend
      console.log('Form data:', formData);
      const submissionData = new FormData(); //doing this because of the recaptcha
      try {
        submissionData.append('name', formData.name);
        submissionData.append('email', formData.email);
        submissionData.append('socialMediaLink1', formData.socialMediaLink1);
        submissionData.append('socialMediaLink2', formData.socialMediaLink2);
        submissionData.append('servicesRequired', JSON.stringify(formData.servicesRequired));
        submissionData.append('servicesRequiredOther', formData.servicesRequiredOther);
        submissionData.append('recaptchaToken', recaptchaToken);
        if (formData.file) {
          submissionData.append('file', formData.file);
        }
        submissionData.append('additionalInfo', formData.additionalInfo);
        const result = await contactApi.submit(submissionData);
        console.log('Submission result:', result);
        setSuccessMessage('Thank you for your message! We will get back to you soon.');
        // Reset form
        setFormData({
        name: '',
        email: '',
        socialMediaLink1: '',
        socialMediaLink2: '',
        servicesRequired: {
          production: false,
          recording: false,
          mixing: false,
          mastering: false,
          other: false
        },
        servicesRequiredOther: '',
        file: null,
        additionalInfo: ''
      });
      setRecaptchaToken('');
      } catch (error) {
        console.error('Error submitting form:', error);
        setSuccessMessage('There was an error submitting your message. Please try again.');
      }
    }
  };

  return (
    <div className="contact-container page-wrapper">
      <div className="contact-form-container">
        <h2>Get in Touch</h2>
        <form onSubmit={handleSubmit}>
          {console.log('Site key:', process.env.REACT_APP_RECAPTCHA_SITE_KEY)}
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
                  checked={formData.servicesRequired.production}
                  onChange={handleInputChange}
                />
                <label htmlFor="production">Production</label>
              </div>
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="recording"
                  name="recording"
                  checked={formData.servicesRequired.recording}
                  onChange={handleInputChange}
                />
                <label htmlFor="recording">Recording</label>
              </div>
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="mixing"
                  name="mixing"
                  checked={formData.servicesRequired.mixing}
                  onChange={handleInputChange}
                />
                <label htmlFor="mixing">Mixing</label>
              </div>
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="mastering"
                  name="mastering"
                  checked={formData.servicesRequired.mastering}
                  onChange={handleInputChange}
                />
                <label htmlFor="mastering">Mastering</label>
              </div>
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="other"
                  name="other"
                  checked={formData.servicesRequired.other}
                  onChange={handleInputChange}
                />
                <label htmlFor="other">Other</label>
              </div>
            </div>
            {errors.servicesRequired && <div className="error-message">{errors.servicesRequired}</div>}
          </div>

          {formData.servicesRequiredOther && (
            <div className="form-group">
              <label htmlFor="otherService">Please specify other service</label>
              <input
                type="text"
                id="otherService"
                name="otherService"
                className="form-control"
                value={formData.servicesRequiredOther}
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
          <div className="form-group">
            <div 
              className="g-recaptcha" 
              data-sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
              data-callback="recaptchaCallback"
              data-error-callback="recaptchaError"
            ></div>
            {/* ADD THIS - error display */}
            {errors.recaptcha && <div className="error-message">{errors.recaptcha}</div>}
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
