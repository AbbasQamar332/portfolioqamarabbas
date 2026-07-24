import { NextRequest, NextResponse } from "next/server";
import { getDb, run, queryAll, initializeDatabase } from "@/lib/database";
import { getAuthenticatedUser } from "@/lib/auth";
import { generateId } from "@/lib/utils";
import { unlink } from "fs/promises";
import path from "path";

async function deleteImageFiles(images: Record<string, unknown>[]) {
  for (const img of images) {
    const imageUrl = img.image_url as string;
    if (imageUrl && imageUrl.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), "public", imageUrl);
      try { await unlink(filePath); } catch { /* file may not exist on disk */ }
    }
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAuthenticatedUser(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    await initializeDatabase();
    const db = await getDb();
    const { images, ...projectData } = body;

    run(db, "UPDATE projects SET title = ?, description = ?, technologies = ?, github_link = ?, live_link = ?, featured = ?, category = ?, status = ? WHERE id = ?", [
      projectData.title || "",
      projectData.description || "",
      typeof projectData.technologies === "string" ? projectData.technologies : JSON.stringify(projectData.technologies || []),
      projectData.github_link || "",
      projectData.live_link || "",
      projectData.featured ? 1 : 0,
      projectData.category || "General",
      projectData.status || "completed",
      params.id
    ]);

    if (images) {
      // Delete old image files from disk and DB records
      const oldImages = queryAll(db, "SELECT * FROM project_images WHERE project_id = ?", [params.id]);
      await deleteImageFiles(oldImages);
      oldImages.forEach((img: Record<string, unknown>) => {
        run(db, "DELETE FROM project_images WHERE id = ?", [img.id]);
      });

      // Insert new images
      if (Array.isArray(images) && images.length > 0) {
        images.forEach((url: string) => {
          const imgId = generateId();
          run(db, "INSERT INTO project_images (id, project_id, image_url, created_at) VALUES (?, ?, ?, ?)", [
            imgId, params.id, url, new Date().toISOString()
          ]);
        });
      }
    }

    return NextResponse.json({ success: true, data: { id: params.id, ...projectData } });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAuthenticatedUser(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await initializeDatabase();
    const db = await getDb();

    // Delete associated image files from disk and DB records
    const images = queryAll(db, "SELECT * FROM project_images WHERE project_id = ?", [params.id]);
    await deleteImageFiles(images);
    images.forEach((img: Record<string, unknown>) => {
      run(db, "DELETE FROM project_images WHERE id = ?", [img.id]);
    });

    run(db, "DELETE FROM projects WHERE id = ?", [params.id]);

    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
