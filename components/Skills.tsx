import { Skill } from "@/types";
import ScrollReveal from "./ScrollReveal";

interface SkillsProps {
  skills: Skill[];
  title?: string;
}

function getIcon(name: string): string {
  const iconMap: Record<string, string> = {
    "Digital Marketing": "fa-bullhorn",
    "Generative AI": "fa-robot",
    "eCommerce": "fa-shopping-cart",
    "eCommerce & Online Selling": "fa-shopping-cart",
    "Content Creation": "fa-pen-fancy",
    "Social Media Marketing": "fa-share-alt",
    "Computer & Internet Skills": "fa-laptop",
  };
  return iconMap[name] || "fa-code";
}

export default function Skills({ skills, title = "Skills" }: SkillsProps) {
  if (!skills || skills.length === 0) return null;

  return (
    <section id="skills" className="section">
      <h2 className="section-title">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {skills.map((skill) => (
          <ScrollReveal key={skill.id}>
            <div className="skill-card">
              {skill.icon_url ? (
                <img
                  src={skill.icon_url}
                  alt={skill.name}
                  className="w-12 h-12 mx-auto mb-5 object-contain"
                />
              ) : (
                <i className={`fas ${getIcon(skill.name)}`}></i>
              )}
              <h3>{skill.name}</h3>
              {skill.percentage > 0 && (
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mt-4">
                  <div
                    className="bg-gradient-brand h-2.5 rounded-full transition-all duration-1000"
                    style={{ width: `${skill.percentage}%` }}
                  ></div>
                </div>
              )}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
