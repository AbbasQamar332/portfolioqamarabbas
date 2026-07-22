import { Certificate } from "@/types";
import ScrollReveal from "./ScrollReveal";

interface CertificatesProps {
  certificates: Certificate[];
}

export default function Certificates({ certificates }: CertificatesProps) {
  if (!certificates || certificates.length === 0) return null;

  return (
    <section id="certificates" className="section !bg-[#f8f9ff] dark:!bg-dark-800 max-w-full">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="section-title">Learning / Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certificates.map((cert) => (
            <ScrollReveal key={cert.id}>
              <div className="skill-card">
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
                  <p className="text-primary-500 font-medium">{cert.issuer}</p>
                )}
                {cert.date && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {cert.date}
                  </p>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
