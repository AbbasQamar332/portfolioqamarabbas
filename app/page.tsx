import { initializeDatabase, getDb, queryAll, queryOne } from "@/lib/database";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Certificates from "@/components/Certificates";
import Projects from "@/components/Projects";
import Languages from "@/components/Languages";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

async function getData() {
  try {
    await initializeDatabase();
    const db = await getDb();

    const profile = queryOne(db, "SELECT * FROM profiles LIMIT 1");
    const skills = queryAll(db, "SELECT * FROM skills ORDER BY order_index ASC");
    const projects = queryAll(db, "SELECT * FROM projects ORDER BY created_at DESC");
    const certificates = queryAll(db, "SELECT * FROM certificates ORDER BY created_at DESC");
    const education = queryAll(db, "SELECT * FROM education ORDER BY start_date DESC");
    const experiences = queryAll(db, "SELECT * FROM experiences ORDER BY start_date DESC");

    // Attach images to projects and parse technologies
    const projectsWithImages = projects.map((p: Record<string, unknown>) => {
      const images = queryAll(db, "SELECT * FROM project_images WHERE project_id = ?", [p.id]);
      let techs: string[] = [];
      try {
        techs = typeof p.technologies === "string" ? JSON.parse(p.technologies) : (p.technologies as string[] || []);
      } catch { techs = []; }
      return { ...p, project_images: images, technologies: techs };
    });

    return {
      profile: profile || null,
      skills: skills || [],
      projects: projectsWithImages || [],
      certificates: certificates || [],
      education: education || [],
      experiences: experiences || [],
    };
  } catch (err) {
    console.error("Failed to fetch data:", err);
    return {
      profile: null,
      skills: [],
      projects: [],
      certificates: [],
      education: [],
      experiences: [],
    };
  }
}

export default async function HomePage() {
  const data = await getData();

  return (
    <main>
      <Hero profile={data.profile as any} />
      <About profile={data.profile as any} />
      <Skills skills={data.skills as any} />
      <Certificates certificates={data.certificates as any} />
      <Projects projects={data.projects as any} />
      <Experience experiences={data.experiences as any} />
      <Education education={data.education as any} />
      <Languages />
      <Contact profile={data.profile as any} />
      <Footer profile={data.profile as any} />
    </main>
  );
}
