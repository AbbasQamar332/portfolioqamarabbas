import { NextRequest, NextResponse } from "next/server";
import { getDb, queryAll, run, initializeDatabase } from "@/lib/database";
import { getAuthenticatedUser } from "@/lib/auth";
import { generateId } from "@/lib/utils";

export async function GET() {
  try {
    await initializeDatabase();
    const db = await getDb();
    const data = queryAll(db, "SELECT * FROM education ORDER BY start_date DESC");
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch education" },
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

    run(db, "INSERT INTO education (id, degree, institution, field_of_study, start_date, end_date, description, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [
      id, body.degree || "", body.institution || "", body.field_of_study || "", body.start_date || "", body.end_date || "", body.description || "", new Date().toISOString()
    ]);

    return NextResponse.json({ success: true, data: { id, ...body } }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to create education" },
      { status: 500 }
    );
  }
}
