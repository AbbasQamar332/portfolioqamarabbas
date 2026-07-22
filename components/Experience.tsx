import { Experience as ExperienceType } from "@/types";

interface ExperienceProps {
  experiences: ExperienceType[];
}

export default function Experience({ experiences }: ExperienceProps) {
  const defaultExperiences = [
    {
      id: "1",
      title: "Online Product Selling (Personal Business During Studies)",
      description: "Sold different products while continuing studies. Managed product sourcing and pricing. Promoted products through online platforms and social media. Communicated with customers and handled orders. Gained practical experience in small business management.",
    },
    {
      id: "2",
      title: "eBay Seller",
      description: "Product research, listing, customer service, store management.",
    },
    {
      id: "3",
      title: "Content Creation",
      description: "Create simple digital content for social media platforms. Support online promotion of products and ideas.",
    },
  ];

  const items = experiences && experiences.length > 0
    ? experiences.map((exp) => ({
        id: exp.id,
        title: exp.position || exp.company || "",
        description: exp.description || "",
      }))
    : defaultExperiences;

  const renderedItems = items.map((item: { id: string; title: string; description: string }) => (
    <div className="timeline-item" key={item.id}>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </div>
  ));

  return (
    <section id="work" className="section" style={{ background: "#f8f9ff", maxWidth: "100%", paddingLeft: "5%", paddingRight: "5%" }}>
      <div className="timeline">
        <h2 className="section-title">Experience</h2>
        {renderedItems}
      </div>
    </section>
  );
}
