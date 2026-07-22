import { Profile } from "@/types";

interface FooterProps {
  profile: Profile | null;
}

export default function Footer({ profile }: FooterProps) {
  const socialLinks = profile?.social_links as Record<string, string> | undefined;

  return (
    <footer className="bg-[#0c0c0c] text-white text-center px-[5%] pt-10 pb-5">
      <div className="flex justify-center gap-8 mb-5">
        {socialLinks?.linkedin && (
          <a
            href={socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-3xl text-white hover:text-primary-500 transition-all duration-300 hover:-translate-y-1"
          >
            <i className="fab fa-linkedin"></i>
          </a>
        )}
        {profile?.email && (
          <a
            href={`mailto:${profile.email}`}
            className="text-3xl text-white hover:text-primary-500 transition-all duration-300 hover:-translate-y-1"
          >
            <i className="fas fa-envelope"></i>
          </a>
        )}
        {profile?.phone && (
          <a
            href={`tel:${profile.phone}`}
            className="text-3xl text-white hover:text-primary-500 transition-all duration-300 hover:-translate-y-1"
          >
            <i className="fas fa-phone"></i>
          </a>
        )}
        {socialLinks?.github && (
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-3xl text-white hover:text-primary-500 transition-all duration-300 hover:-translate-y-1"
          >
            <i className="fab fa-github"></i>
          </a>
        )}
      </div>
      <p>&copy; {new Date().getFullYear()} {profile?.name || "Qamar Abbas"}. All rights reserved.</p>
    </footer>
  );
}
