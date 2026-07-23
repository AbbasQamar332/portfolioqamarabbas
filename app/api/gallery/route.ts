import { NextRequest, NextResponse } from "next/server";
import { getDb, queryAll, run, initializeDatabase } from "@/lib/database";
import { getAuthenticatedUser } from "@/lib/auth";
import { generateId } from "@/lib/utils";

export async function GET() {
  try {
    await initializeDatabase();
    const db = await getDb();
    const data = queryAll(db, "SELECT * FROM gallery ORDER BY created_at DESC");

    // Normalize 'featured' from 0/1 (JSON DB) to boolean (API contract)
    const normalized = data.map((row: Record<string, unknown>) => ({
      ...row,
      featured: row.featured === 1 || row.featured === true,
    }));

    return NextResponse.json({ success: true, data: normalized });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch gallery" },
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
    const id = body.id || generateId();

    const featured = body.featured ? 1 : 0;

    run(db, "INSERT INTO gallery (id, title, description, image_url, category, featured, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)", [
      id,
      body.title || "",
      body.description || "",
      body.image_url || "",
      body.category || "General",
      featured,
      new Date().toISOString(),
    ]);

    return NextResponse.json(
      { success: true, data: { id, ...body } },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to create gallery item" },
      { status: 500 }
    );
  }
}
