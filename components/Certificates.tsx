import { Certificate } from "@/types";

interface CertificatesProps {
  certificates: Certificate[];
}

export default function Certificates({ certificates }: CertificatesProps) {
  return (
    <section id="courses" className="section">
      <h2 className="section-title">Learning / Courses</h2>
      <div className="skills-grid">
        {/* Static courses from HTML version */}
        <div className="skill-card">
          <i className="fas fa-robot"></i>
          <h3>Generative AI Course (Currently Learning)</h3>
          <p>Ongoing course to master AI tools.</p>
        </div>
        <div className="skill-card">
          <i className="fas fa-bullhorn"></i>
          <h3>Digital Marketing Basics</h3>
          <p>Fundamentals of digital promotion.</p>
        </div>
        <div className="skill-card">
          <i className="fas fa-shopping-cart"></i>
          <h3>eCommerce &amp; Online Selling</h3>
          <p>Practical eCommerce training.</p>
        </div>
        {/* Dynamic certificates from Supabase */}
        {certificates && certificates.length > 0 && certificates.map((cert) => (
          <div className="skill-card" key={cert.id}>
            {cert.image_url ? (
              <img
                src={cert.image_url}
                alt={cert.title}
                className="w-full h-48 object-cover rounded-xl mb-5"
              />
            ) : (
              <i className="fas fa-certificate"></i>
            )}
            <h3>{cert.title}</h3>
            {cert.issuer && (
              <p style={{ color: "#667eea", fontWeight: 500 }}>{cert.issuer}</p>
            )}
            {cert.date && (
              <p style={{ fontSize: "0.9rem", color: "#888", marginTop: "8px" }}>{cert.date}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
