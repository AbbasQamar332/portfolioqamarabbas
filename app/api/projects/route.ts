import { NextRequest, NextResponse } from "next/server";
import { getDb, queryAll, run, initializeDatabase } from "@/lib/database";
import { getAuthenticatedUser } from "@/lib/auth";
import { generateId } from "@/lib/utils";

export async function GET() {
  try {
    await initializeDatabase();
    const db = await getDb();
    let projects = queryAll(db, "SELECT * FROM projects ORDER BY created_at DESC");

    // Attach images to projects
    projects = projects.map((p: Record<string, unknown>) => {
      const images = queryAll(db, "SELECT * FROM project_images WHERE project_id = ?", [p.id]);
      let techs: string[] = [];
      try {
        techs = typeof p.technologies === "string" ? JSON.parse(p.technologies as string) : (p.technologies as string[] || []);
      } catch {
        techs = [];
      }
      return { ...p, images, technologies: techs };
    });

    return NextResponse.json({ success: true, data: projects });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getAuthenticatedUser(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    await initializeDatabase();
    const db = await getDb();
    const projectId = body.id || generateId();
    const { images, ...projectData } = body;

    run(db, "INSERT INTO projects (id, title, description, technologies, github_link, live_link, featured, category, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
      projectId,
      projectData.title || "",
      projectData.description || "",
      typeof projectData.technologies === "string" ? projectData.technologies : JSON.stringify(projectData.technologies || []),
      projectData.github_link || "",
      projectData.live_link || "",
      projectData.featured ? 1 : 0,
      projectData.category || "General",
      projectData.status || "completed",
      new Date().toISOString()
    ]);

    if (images && Array.isArray(images) && images.length > 0) {
      images.forEach((url: string) => {
        const imgId = generateId();
        run(db, "INSERT INTO project_images (id, project_id, image_url, created_at) VALUES (?, ?, ?, ?)", [
          imgId, projectId, url, new Date().toISOString()
        ]);
      });
    }

    return NextResponse.json({ success: true, data: { id: projectId, ...projectData } }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to create project" },
      { status: 500 }
    );
  }
}
