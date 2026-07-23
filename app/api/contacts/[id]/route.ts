import { NextRequest, NextResponse } from "next/server";
import { getDb, run, initializeDatabase } from "@/lib/database";
import { verifyToken } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.slice(7);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    await initializeDatabase();
    const db = await getDb();

    // Build dynamic SET clause from body keys
    const updateFields: string[] = [];
    const updateValues: unknown[] = [];

    for (const [key, value] of Object.entries(body)) {
      // Normalize boolean fields to 0/1 for JSON DB
      if (key === "is_read") {
        updateFields.push("is_read = ?");
        updateValues.push(value ? 1 : 0);
      } else if (["name", "email", "subject", "message"].includes(key)) {
        updateFields.push(`${key} = ?`);
        updateValues.push(value);
      }
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid fields to update" },
        { status: 400 }
      );
    }

    updateValues.push(params.id);
    run(
      db,
      `UPDATE contacts SET ${updateFields.join(", ")} WHERE id = ?`,
      updateValues
    );

    return NextResponse.json({ success: true, data: { id: params.id, ...body } });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update contact" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.slice(7);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await initializeDatabase();
    const db = await getDb();
    run(db, "DELETE FROM contacts WHERE id = ?", [params.id]);

    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete contact" },
      { status: 500 }
    );
  }
}
