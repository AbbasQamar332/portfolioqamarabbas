import { Profile } from "@/types";

interface FooterProps {
  profile: Profile | null;
}

export default function Footer({ profile }: FooterProps) {
  const socialLinks = profile?.social_links as Record<string, string> | undefined;
  const phone = profile?.phone || "0347 8094332";
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const email = profile?.email || "sheikhuqamar@gmail.com";

  return (
    <footer>
      <div className="social-links">
        <a
          href={socialLinks?.linkedin || "https://www.linkedin.com/in/qamar-abbas-1181b2402"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-linkedin"></i>
        </a>
        <a href={`mailto:${email}`}>
          <i className="fas fa-envelope"></i>
        </a>
        <a href={`tel:${phone}`}>
          <i className="fas fa-phone"></i>
        </a>
        <a href={`https://wa.me/${cleanPhone || "923478094332"}`} target="_blank" rel="noopener noreferrer">
          <i className="fab fa-whatsapp"></i>
        </a>
        <a
          href={socialLinks?.website || "https://sckarma-tech.netlify.app/"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fas fa-globe"></i>
        </a>
      </div>
      <p>&copy; {new Date().getFullYear()} {profile?.name || "Qamar Abbas"}. All rights reserved.</p>
      <p style={{ marginTop: "12px", fontSize: "0.85rem", opacity: 0.6 }}>
        <a href="/admin" style={{ color: "inherit", textDecoration: "none" }}>Manage Portfolio</a>
      </p>
    </footer>
  );
}
