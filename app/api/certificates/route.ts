import { NextRequest, NextResponse } from "next/server";
import { getDb, queryAll, run, initializeDatabase } from "@/lib/database";
import { getAuthenticatedUser } from "@/lib/auth";
import { generateId } from "@/lib/utils";

export async function GET() {
  try {
    await initializeDatabase();
    const db = await getDb();
    const data = queryAll(db, "SELECT * FROM certificates ORDER BY created_at DESC");
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch certificates" },
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

    run(db, "INSERT INTO certificates (id, title, issuer, image_url, date, created_at) VALUES (?, ?, ?, ?, ?, ?)", [
      id, body.title || "", body.issuer || "", body.image_url || "", body.date || "", new Date().toISOString()
    ]);

    return NextResponse.json({ success: true, data: { id, ...body } }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to create certificate" },
      { status: 500 }
    );
  }
}
