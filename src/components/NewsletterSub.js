import React, { useState } from "react";
import { newsletterApi } from "../api";
import "../styles/NewsletterSub.css";

const NewsletterSub = () => {
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("all-releases");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus("Please enter a valid email address");
      return;
    }

    //for the name, remove the @ and everything after it
    const name = email.split("@")[0];
    setStatus("Subscribing...");
    try {
      const response = await newsletterApi.subscribe({ email: email, name: name, source: "FOOTER", categories: [category] });
      // Here you would typically send this to your backend or newsletter service
      console.log("Subscribing email:", email);
      setStatus(response.message);
      setEmail("");
      setCategory("all-releases");
      setIsSubmitting(false);
    } catch (error) {
      setStatus("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
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
            <div className="newsletter-category-group">
              <label>
                <input
                  type="radio"
                  name="newsletterCategory"
                  value="all-releases"
                  checked={category === "all-releases"}
                  onChange={(e) => setCategory(e.target.value)}
                />
                All Releases
              </label>
              <label>
                <input
                  type="radio"
                  name="newsletterCategory"
                  value="new-beats-samples"
                  checked={category === "new-beats-samples"}
                  onChange={(e) => setCategory(e.target.value)}
                />
                New Beats-Samples
              </label>
              <label>
                <input
                  type="radio"
                  name="newsletterCategory"
                  value="new-music"
                  checked={category === "new-music"}
                  onChange={(e) => setCategory(e.target.value)}
                />
                New Music
              </label>
            </div>
            <button type="submit" disabled={isSubmitting}>Subscribe</button>
          </div>
          {status && <p className="status-message">{status}</p>}
        </form>
      </div>
    </div>
  );
};

export default NewsletterSub;
