import { NextRequest, NextResponse } from "next/server";
import { getDb, initializeDatabase } from "@/lib/database";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.slice(7);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await initializeDatabase();
    const db = await getDb();

    const data = {
      total_projects: (db["projects"] || []).length,
      total_skills: (db["skills"] || []).length,
      total_certificates: (db["certificates"] || []).length,
      total_gallery: (db["gallery"] || []).length,
      total_contacts: (db["contacts"] || []).length,
      total_testimonials: (db["testimonials"] || []).length,
      last_updated: db["profiles"]?.[0]?.updated_at || null,
    };

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
