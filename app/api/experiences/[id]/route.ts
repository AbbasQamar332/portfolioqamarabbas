import { NextRequest, NextResponse } from "next/server";
import { getDb, run, initializeDatabase } from "@/lib/database";
import { getAuthenticatedUser } from "@/lib/auth";

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

    // Normalize 'current' from boolean (API contract) to 0/1 (JSON DB)
    const current = body.current ? 1 : 0;

    run(db, "UPDATE experiences SET company = ?, position = ?, description = ?, start_date = ?, end_date = ?, current = ? WHERE id = ?", [
      body.company || "",
      body.position || "",
      body.description || "",
      body.start_date || "",
      body.end_date || "",
      current,
      params.id,
    ]);

    return NextResponse.json({ success: true, data: { id: params.id, ...body } });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update experience" },
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
    run(db, "DELETE FROM experiences WHERE id = ?", [params.id]);

    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete experience" },
      { status: 500 }
    );
  }
}
