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

  return (
    <section id="contact" className="section">
      <h2 className="section-title">Contact</h2>
      <div className="contact-info">
        <p><i className="fas fa-phone"></i> {profile?.phone || "0347 8094332"}</p>
        <p><i className="fas fa-envelope"></i> {profile?.email || "sheikhuqamar@gmail.com"}</p>
        <p><i className="fas fa-map-marker-alt"></i> {profile?.location || "Gilgit-Baltistan, Pakistan"}</p>
      </div>
      <form onSubmit={handleSubmit} className="contact-form">
        <input
          type="text"
          placeholder="Your Name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Your Email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <textarea
          placeholder="Your Message"
          rows={5}
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />
        <div className="contact-form-btn-wrapper">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
            {loading ? " Sending..." : " Send Message"}
          </button>
        </div>
      </form>
    </section>
  );
}
