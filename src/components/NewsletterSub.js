import React, { useState } from "react";
import "../styles/NewsletterSub.css";

const NewsletterSub = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus("Please enter a valid email address");
      return;
    }

    // Here you would typically send this to your backend or newsletter service
    console.log("Subscribing email:", email);
    setStatus("Thank you for subscribing!");
    setEmail("");

    // TODO: Integrate with your newsletter service
    // Example with a backend API call:
    // fetch('/api/subscribe', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email })
    // })
    //   .then(response => response.json())
    //   .then(data => setStatus(data.message))
    //   .catch(error => setStatus('Something went wrong. Please try again.'));
  };

  return (
    <div className="newsletter-container">
      <div className="newsletter-content">
        <h2>Subscribe to Our Newsletter</h2>
        <p>Stay updated with our latest releases and upcoming events!</p>
        
        <form onSubmit={handleSubmit} className="newsletter-form">
          <div className="input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
            />
            <button type="submit">Subscribe</button>
          </div>
          {status && <p className="status-message">{status}</p>}
        </form>
      </div>
    </div>
  );
};

export default NewsletterSub;
