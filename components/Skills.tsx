import { Skill } from "@/types";

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
  return (
    <section id="skills" className="section">
      <h2 className="section-title">{title}</h2>
      <div className="skills-grid">
        {(!skills || skills.length === 0) ? (
          <>
            <div className="skill-card">
              <i className="fas fa-bullhorn"></i>
              <h3>Digital Marketing</h3>
              <p>Basic understanding of digital marketing strategies including promoting products and services through online platforms, social media marketing, and improving brand visibility on the internet.</p>
            </div>
            <div className="skill-card">
              <i className="fas fa-robot"></i>
              <h3>Generative AI</h3>
              <p>Learning and using AI tools to generate content, assist in research, create marketing ideas, and improve productivity in digital work.</p>
            </div>
            <div className="skill-card">
              <i className="fas fa-shopping-cart"></i>
              <h3>eCommerce &amp; Online Selling</h3>
              <p>Experience in online selling platforms including product research, product listing, customer communication, and order management.</p>
            </div>
            <div className="skill-card">
              <i className="fas fa-pen-fancy"></i>
              <h3>Content Creation</h3>
              <p>Ability to create digital content for social media platforms such as posts, short content ideas, and simple promotional material for online audiences.</p>
            </div>
            <div className="skill-card">
              <i className="fas fa-share-alt"></i>
              <h3>Social Media Marketing</h3>
              <p>Understanding how to promote products and services through social media platforms to increase audience engagement and reach potential customers.</p>
            </div>
            <div className="skill-card">
              <i className="fas fa-laptop"></i>
              <h3>Computer &amp; Internet Skills</h3>
              <p>Good knowledge of computer usage including internet research, document preparation, online tools, and digital communication.</p>
            </div>
          </>
        ) : (
          skills.map((skill) => (
            <div className="skill-card" key={skill.id}>
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
            </div>
          ))
        )}
      </div>
    </section>
  );
}
