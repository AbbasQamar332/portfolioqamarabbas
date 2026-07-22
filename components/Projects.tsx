import { Project } from "@/types";

interface ProjectsProps {
  projects: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
  if (!projects || projects.length === 0) return null;

  return (
    <section id="projects" className="section">
      <h2 className="section-title">Projects</h2>
      <div id="projectsGrid" className="projects-grid">
        {projects.map((proj) => {
          const techArr = Array.isArray(proj.technologies) ? proj.technologies : [];
          const projImage = proj.images && proj.images.length > 0 ? proj.images[0].image_url : "";
          const hasImage = !!projImage;

          return (
            <div className="project-card" key={proj.id}>
              <div className="project-image-wrapper">
                {hasImage ? (
                  <img src={projImage} alt={proj.title} />
                ) : (
                  <i className="fas fa-code project-icon"></i>
                )}
              </div>
              <div className="project-body">
                <h3>{proj.title}</h3>
                {proj.description && <p>{proj.description}</p>}
                {techArr.length > 0 && (
                  <div className="project-tech">
                    {techArr.map((tech, i) => (
                      <span key={i}>{tech}</span>
                    ))}
                  </div>
                )}
                <div className="project-links">
                  {proj.github_link && (
                    <a href={proj.github_link} target="_blank" rel="noopener noreferrer" className="github-link">
                      <i className="fab fa-github"></i> GitHub
                    </a>
                  )}
                  {proj.live_link && (
                    <a href={proj.live_link} target="_blank" rel="noopener noreferrer" className="demo-link">
                      <i className="fas fa-external-link-alt"></i> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
