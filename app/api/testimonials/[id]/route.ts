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

    run(db, "UPDATE testimonials SET name = ?, position = ?, company = ?, content = ?, avatar_url = ?, rating = ? WHERE id = ?", [
      body.name || "",
      body.position || "",
      body.company || "",
      body.content || "",
      body.avatar_url || "",
      body.rating || 5,
      params.id,
    ]);

    return NextResponse.json({ success: true, data: { id: params.id, ...body } });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update testimonial" },
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
    run(db, "DELETE FROM testimonials WHERE id = ?", [params.id]);

    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
