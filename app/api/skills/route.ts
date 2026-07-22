import { NextRequest, NextResponse } from "next/server";
import { getDb, queryAll, run, initializeDatabase } from "@/lib/database";
import { getAuthenticatedUser } from "@/lib/auth";
import { generateId } from "@/lib/utils";

export async function GET() {
  try {
    await initializeDatabase();
    const db = await getDb();
    const data = queryAll(db, "SELECT * FROM skills ORDER BY order_index ASC");
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch skills" },
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

    run(db, "INSERT INTO skills (id, name, category, percentage, icon_url, order_index) VALUES (?, ?, ?, ?, ?, ?)", [
      id, body.name || "", body.category || "General", body.percentage || 0, body.icon_url || "", body.order_index || 0
    ]);

    return NextResponse.json({ success: true, data: { id, ...body } }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to create skill" },
      { status: 500 }
    );
  }
}
