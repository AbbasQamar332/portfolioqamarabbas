"use client";

import { Profile } from "@/types";
import { useTheme } from "./ThemeProvider";
import { useState, useRef, useEffect } from "react";

interface HeroProps {
  profile: Profile | null;
}

export default function Hero({ profile }: HeroProps) {
  const { theme, toggleTheme } = useTheme();
  const [profilePic, setProfilePic] = useState<string>("");
  const [showRemove, setShowRemove] = useState(false);
  const heroFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("portfolio_profile_pic");
    if (saved) {
      setProfilePic(saved);
      setShowRemove(true);
    } else if (profile?.profile_picture) {
      setProfilePic(profile.profile_picture);
    }
  }, [profile]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Image too large. Max 2MB allowed.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setProfilePic(dataUrl);
      setShowRemove(true);
      localStorage.setItem("portfolio_profile_pic", dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePic = () => {
    if (confirm("Remove profile picture?")) {
      setProfilePic("");
      setShowRemove(false);
      localStorage.removeItem("portfolio_profile_pic");
    }
  };

  return (
    <section id="hero" className="hero">
      <div className="hero-bg"></div>
      <div className="hero-content">
        <div className="profile-pic-container">
          {profilePic ? (
            <img src={profilePic} alt="Profile" className="profile-pic" />
          ) : (
            <div className="profile-pic-placeholder">
              <i className="fas fa-user"></i>
            </div>
          )}
          <label htmlFor="heroPicInput" className="profile-pic-overlay" title="Change Profile Picture">
            <i className="fas fa-camera"></i>
          </label>
          <input
            type="file"
            id="heroPicInput"
            accept="image/*"
            style={{ display: "none" }}
            ref={heroFileInputRef}
            onChange={handleFileSelect}
          />
          {showRemove && (
            <button className="profile-pic-remove" onClick={handleRemovePic} title="Remove Profile Picture">
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
        <h1 className="hero-title">{profile?.name || "Qamar Abbas"}</h1>
        <p className="hero-subtitle">{profile?.title || "Generative AI | eCommerce"}</p>
        <p className="hero-location">
          <i className="fas fa-map-marker-alt"></i> {profile?.location || "Gilgit-Baltistan, Pakistan"}
        </p>
        <p className="hero-intro">
          {profile?.short_bio || "Motivated BBA graduate skilled in Digital Marketing, Generative AI, eCommerce. Helping businesses grow online."}
        </p>
        <div className="hero-buttons">
          <button onClick={toggleTheme} className="btn btn-secondary theme-toggle" title="Toggle theme">
            <i className={`fas ${theme === "dark" ? "fa-sun" : "fa-moon"}`}></i>
          </button>
          <a href="#work" className="btn btn-primary"><i className="fas fa-briefcase"></i> View Work</a>
          <a href="#contact" className="btn btn-secondary"><i className="fas fa-envelope"></i> Contact Me</a>
        </div>
      </div>
    </section>
  );
}
