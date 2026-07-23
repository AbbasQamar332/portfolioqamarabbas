import { NextRequest, NextResponse } from "next/server";
import { getDb, queryAll, run, initializeDatabase } from "@/lib/database";
import { getAuthenticatedUser } from "@/lib/auth";
import { generateId } from "@/lib/utils";

export async function GET() {
  try {
    await initializeDatabase();
    const db = await getDb();
    const data = queryAll(db, "SELECT * FROM experiences ORDER BY start_date DESC");

    // Normalize 'current' from 0/1 (JSON DB) to boolean (API contract)
    const normalized = data.map((row: Record<string, unknown>) => ({
      ...row,
      current: row.current === 1 || row.current === true,
    }));

    return NextResponse.json({ success: true, data: normalized });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch experiences" },
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

    // Normalize 'current' from boolean (API contract) to 0/1 (JSON DB)
    const current = body.current ? 1 : 0;

    run(db, "INSERT INTO experiences (id, company, position, description, start_date, end_date, current) VALUES (?, ?, ?, ?, ?, ?, ?)", [
      id,
      body.company || "",
      body.position || "",
      body.description || "",
      body.start_date || "",
      body.end_date || "",
      current,
    ]);

    return NextResponse.json(
      { success: true, data: { id, ...body } },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to create experience" },
      { status: 500 }
    );
  }
}
