"use client";

import { Profile } from "@/types";
import { useState, FormEvent } from "react";
import toast from "react-hot-toast";

interface ContactProps {
  profile: Profile | null;
}

export default function Contact({ profile }: ContactProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message || "Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error(data.error || "Failed to send message");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contactDetails = [
    {
      icon: "fas fa-phone-alt",
      label: "Phone",
      value: profile?.phone || "0347 8094332",
    },
    {
      icon: "fas fa-envelope",
      label: "Email",
      value: profile?.email || "sheikhuqamar@gmail.com",
    },
    {
      icon: "fas fa-map-marker-alt",
      label: "Location",
      value: profile?.location || "Gilgit-Baltistan, Pakistan",
    },
  ];

  return (
    <section id="contact" className="section">
      <h2 className="section-title">Get In Touch</h2>
      <p className="contact-description">
        Have a question, a project idea, or just want to say hello? Fill out the
        form below and I&apos;ll get back to you as soon as possible.
      </p>

      <div className="contact-grid">
        {/* Left Side - Contact Info Cards */}
        <div className="contact-info-side">
          <div className="contact-info-cards">
            {contactDetails.map((detail, index) => (
              <div key={index} className="contact-info-card">
                <div className="contact-info-icon">
                  <i className={detail.icon}></i>
                </div>
                <div className="contact-info-text">
                  <span className="contact-info-label">{detail.label}</span>
                  <span className="contact-info-value">{detail.value}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="contact-social-section">
            <p className="contact-social-text">
              <i className="fas fa-share-alt"></i> Follow me on social media
            </p>
            <div className="contact-social-links">
              <a
                href="https://www.linkedin.com/in/qamar-abbas-1181b2402"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social-link"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social-link"
                aria-label="GitHub"
              >
                <i className="fab fa-github"></i>
              </a>
              <a
                href="https://sckarma-tech.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social-link"
                aria-label="Website"
              >
                <i className="fas fa-globe"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="contact-form-header">
            <h3>Send a Message</h3>
            <p>I&apos;ll respond within 24 hours</p>
          </div>

          <div className="contact-form-field">
            <label htmlFor="name">
              <i className="fas fa-user"></i> Your Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="contact-form-field">
            <label htmlFor="email">
              <i className="fas fa-envelope"></i> Your Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="john@example.com"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="contact-form-field">
            <label htmlFor="message">
              <i className="fas fa-comment-dots"></i> Message
            </label>
            <textarea
              id="message"
              placeholder="Write your message here..."
              rows={5}
              required
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="contact-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Sending...
              </>
            ) : (
              <>
                Send Message <i className="fas fa-paper-plane"></i>
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
