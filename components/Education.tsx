import { Education as EducationType } from "@/types";

interface EducationProps {
  education: EducationType[];
}

export default function Education({ education }: EducationProps) {
  if (!education || education.length === 0) return null;

  return (
    <section id="education" className="section">
      <h2 className="section-title">Education</h2>
      <div className="flex flex-col items-center gap-8">
        {education.map((edu) => (
          <div
            key={edu.id}
            className="bg-gradient-brand text-white p-10 rounded-[20px] text-center max-w-[600px] w-full shadow-lg"
          >
            <h3 className="text-2xl font-bold mb-2">{edu.degree}</h3>
            <p className="text-lg opacity-90 mb-1">{edu.institution}</p>
            {(edu.start_date || edu.end_date) && (
              <p className="opacity-80">
                {edu.start_date} {edu.end_date ? `- ${edu.end_date}` : ""}
              </p>
            )}
            {edu.description && (
              <p className="mt-4 opacity-90">{edu.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
