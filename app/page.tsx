import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Certificates from "@/components/Certificates";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

async function getData() {
  try {
    const { supabaseAdmin } = await import("@/lib/supabase-server");

    const [profileRes, skillsRes, projectsRes, certificatesRes, educationRes, experiencesRes] =
      await Promise.all([
        supabaseAdmin.from("profiles").select("*").limit(1).single(),
        supabaseAdmin.from("skills").select("*").order("order_index", { ascending: true }),
        supabaseAdmin.from("projects").select("*, project_images(*)").order("created_at", { ascending: false }),
        supabaseAdmin.from("certificates").select("*").order("created_at", { ascending: false }),
        supabaseAdmin.from("education").select("*").order("start_date", { ascending: false }),
        supabaseAdmin.from("experiences").select("*").order("start_date", { ascending: false }),
      ]);

    return {
      profile: profileRes.data,
      skills: skillsRes.data || [],
      projects: projectsRes.data || [],
      certificates: certificatesRes.data || [],
      education: educationRes.data || [],
      experiences: experiencesRes.data || [],
    };
  } catch {
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
      <Hero profile={data.profile} />
      <About profile={data.profile} />
      <Skills skills={data.skills} />
      {data.certificates.length > 0 && <Certificates certificates={data.certificates} />}
      <Experience experiences={data.experiences} />
      <Education education={data.education} />
      <Contact profile={data.profile} />
      <Footer profile={data.profile} />
    </main>
  );
}
