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

    run(db, "UPDATE certificates SET title = ?, issuer = ?, image_url = ?, date = ? WHERE id = ?", [
      body.title, body.issuer, body.image_url, body.date, params.id
    ]);

    return NextResponse.json({ success: true, data: { id: params.id, ...body } });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update certificate" },
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
    run(db, "DELETE FROM certificates WHERE id = ?", [params.id]);

    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete certificate" },
      { status: 500 }
    );
  }
}
