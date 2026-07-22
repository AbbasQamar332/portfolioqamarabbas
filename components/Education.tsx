import { Education as EducationType } from "@/types";

interface EducationProps {
  education: EducationType[];
}

export default function Education({ education }: EducationProps) {
  const defaultEducation = {
    degree: "Bachelor of Business Administration (BBA)",
    period: "2021 - End of 2025",
  };

  const hasData = education && education.length > 0;

  return (
    <section id="education" className="section">
      <h2 className="section-title">Education</h2>
      <div className="education-card">
        <h3>{hasData ? education[0].degree : defaultEducation.degree}</h3>
        <p>
          {hasData
            ? `${education[0].start_date || ""} ${education[0].end_date ? `- ${education[0].end_date}` : ""}`
            : defaultEducation.period}
        </p>
        {hasData && education[0].description && (
          <p style={{ marginTop: "16px", opacity: 0.9 }}>{education[0].description}</p>
        )}
      </div>
    </section>
  );
}
