import { Profile } from "@/types";

interface AboutProps {
  profile: Profile | null;
}

export default function About({ profile }: AboutProps) {
  return (
    <section id="about" className="section">
      <h2 className="section-title">About Me</h2>
      <p className="about-text">
        {profile?.about ||
          "Motivated and dedicated BBA graduate with knowledge of Digital Marketing, Generative AI, eCommerce, and Content Creation. I aim to use my business and digital skills to help businesses grow online, improve brand visibility, and manage digital platforms effectively while continuing to learn modern technologies."}
      </p>
    </section>
  );
}
