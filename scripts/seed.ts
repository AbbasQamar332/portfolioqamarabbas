import { initializeDatabase, getDb, run, saveDb } from "../lib/database";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Seeding database...");

  await initializeDatabase();
  const db = await getDb();

  // Reset all data
  const tables = [
    "admin_users", "profiles", "skills", "projects", "project_images",
    "certificates", "education", "experiences", "gallery", "testimonials",
    "contacts", "settings"
  ];
  for (const table of tables) {
    (<any>db)[table] = [];
  }

  // --- Admin User ---
  const adminId = uuidv4();
  const passwordHash = bcrypt.hashSync("admin123", 12);
  run(db, "INSERT INTO admin_users (id, email, password_hash, name) VALUES (?, ?, ?, ?)", [
    adminId, "qamar@example.com", passwordHash, "Qamar Abbas"
  ]);
  console.log("  ✅ Admin user created (qamar@example.com / admin123)");

  // --- Profile ---
  const profileId = uuidv4();
  const socialLinks = JSON.stringify({
    linkedin: "https://www.linkedin.com/in/qamar-abbas-1181b2402?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    github: "",
    website: "https://sckarma-tech.netlify.app/"
  });
  run(db, "INSERT INTO profiles (id, name, title, about, short_bio, email, phone, location, social_links) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [
    profileId,
    "Qamar Abbas",
    "Generative AI | eCommerce",
    "Motivated and dedicated BBA graduate with knowledge of Digital Marketing, Generative AI, eCommerce, and Content Creation. I aim to use my business and digital skills to help businesses grow online, improve brand visibility, and manage digital platforms effectively while continuing to learn modern technologies.",
    "Motivated BBA graduate skilled in Digital Marketing, Generative AI, eCommerce. Helping businesses grow online.",
    "sheikhuqamar@gmail.com",
    "0347 8094332",
    "Gilgit-Baltistan, Pakistan",
    socialLinks
  ]);
  console.log("  ✅ Profile created");

  // --- Skills ---
  const skills = [
    { name: "Digital Marketing", icon: "fa-bullhorn", desc: "Basic understanding of digital marketing strategies including promoting products and services through online platforms, social media marketing, and improving brand visibility on the internet." },
    { name: "Generative AI", icon: "fa-robot", desc: "Learning and using AI tools to generate content, assist in research, create marketing ideas, and improve productivity in digital work." },
    { name: "eCommerce & Online Selling", icon: "fa-shopping-cart", desc: "Experience in online selling platforms including product research, product listing, customer communication, and order management." },
    { name: "Content Creation", icon: "fa-pen-fancy", desc: "Ability to create digital content for social media platforms such as posts, short content ideas, and simple promotional material for online audiences." },
    { name: "Social Media Marketing", icon: "fa-share-alt", desc: "Understanding how to promote products and services through social media platforms to increase audience engagement and reach potential customers." },
    { name: "Computer & Internet Skills", icon: "fa-laptop", desc: "Good knowledge of computer usage including internet research, document preparation, online tools, and digital communication." },
  ];

  skills.forEach((skill, index) => {
    const id = uuidv4();
    run(db, "INSERT INTO skills (id, name, category, percentage, icon_url, order_index) VALUES (?, ?, ?, ?, ?, ?)", [
      id, skill.name, "General", 0, skill.icon, index
    ]);
  });
  console.log(`  ✅ ${skills.length} skills created`);

  // --- Projects ---
  const projects = [
    {
      title: "Portfolio Website",
      description: "A professional dynamic portfolio website built with Next.js featuring a modern UI, dark/light theme, and content management system.",
      technologies: JSON.stringify(["Next.js", "TypeScript", "Tailwind CSS"]),
      github: "https://github.com/",
      demo: "https://sckarma-tech.netlify.app/",
      created_at: new Date().toISOString()
    },
    {
      title: "eCommerce Platform",
      description: "Online selling platform with product management, customer communication, and order handling system for small business operations.",
      technologies: JSON.stringify(["eCommerce", "Digital Marketing", "SEO"]),
      github: "https://github.com/",
      demo: "#",
      created_at: new Date().toISOString()
    },
    {
      title: "AI Content Generator",
      description: "Leveraging generative AI tools to create marketing content, social media posts, and promotional material for digital audiences.",
      technologies: JSON.stringify(["Generative AI", "Content Creation", "AI Tools"]),
      github: "https://github.com/",
      demo: "#",
      created_at: new Date().toISOString()
    }
  ];

  projects.forEach((proj) => {
    const id = uuidv4();
    run(db, "INSERT INTO projects (id, title, description, technologies, github_link, live_link, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)", [
      id, proj.title, proj.description, proj.technologies, proj.github, proj.demo, proj.created_at
    ]);
  });
  console.log(`  ✅ ${projects.length} projects created`);

  // --- Experience ---
  const experiences = [
    {
      title: "Online Product Selling (Personal Business During Studies)",
      desc: "Sold different products while continuing studies. Managed product sourcing and pricing. Promoted products through online platforms and social media. Communicated with customers and handled orders. Gained practical experience in small business management."
    },
    {
      title: "eBay Seller",
      desc: "Product research, listing, customer service, store management."
    },
    {
      title: "Content Creation",
      desc: "Create simple digital content for social media platforms. Support online promotion of products and ideas."
    }
  ];

  experiences.forEach((exp) => {
    const id = uuidv4();
    run(db, "INSERT INTO experiences (id, company, position, description, start_date, end_date, current) VALUES (?, ?, ?, ?, ?, ?, ?)", [
      id, exp.title, exp.title, exp.desc, "2021", "2025", 0
    ]);
  });
  console.log(`  ✅ ${experiences.length} experiences created`);

  // --- Education ---
  const eduId = uuidv4();
  run(db, "INSERT INTO education (id, degree, institution, start_date, end_date, description) VALUES (?, ?, ?, ?, ?, ?)", [
    eduId, "Bachelor of Business Administration (BBA)", "University of Gilgit-Baltistan", "2021", "End of 2025",
    "Completed BBA with focus on business management and digital skills."
  ]);
  console.log("  ✅ Education created");

  // --- Certificates / Courses ---
  const courses = [
    { title: "Generative AI Course (Currently Learning)", issuer: "Ongoing" },
    { title: "Digital Marketing Basics", issuer: "Course" },
    { title: "eCommerce & Online Selling", issuer: "Course" }
  ];

  courses.forEach((course) => {
    const id = uuidv4();
    run(db, "INSERT INTO certificates (id, title, issuer, image_url, date) VALUES (?, ?, ?, ?, ?)", [
      id, course.title, course.issuer, "", ""
    ]);
  });
  console.log(`  ✅ ${courses.length} courses created`);

  await saveDb();
  console.log("\n🎉 Database seeded successfully!");
  console.log("   Admin login: qamar@example.com / admin123");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
