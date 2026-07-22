import { Experience as ExperienceType } from "@/types";
import ScrollReveal from "./ScrollReveal";

interface ExperienceProps {
  experiences: ExperienceType[];
}

export default function Experience({ experiences }: ExperienceProps) {
  if (!experiences || experiences.length === 0) return null;

  return (
    <section id="work" className="section !bg-[#f8f9ff] dark:!bg-dark-800 max-w-full">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="section-title">Experience</h2>
        <div className="max-w-[800px] mx-auto">
          {experiences.map((exp) => (
            <ScrollReveal key={exp.id}>
              <div className="timeline-item">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold">{exp.position}</h3>
                  {exp.current && (
                    <span className="text-xs bg-gradient-brand text-white px-3 py-1 rounded-full">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-primary-500 font-medium mb-2">{exp.company}</p>
                {(exp.start_date || exp.end_date) && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    {exp.start_date} {exp.end_date ? `- ${exp.end_date}` : ""}
                  </p>
                )}
                <p className="text-gray-600 dark:text-gray-300">{exp.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
