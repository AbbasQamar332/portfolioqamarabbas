import { NextRequest, NextResponse } from "next/server";
import { getDb, queryAll, run, initializeDatabase } from "@/lib/database";
import { verifyToken } from "@/lib/auth";
import { generateId } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await initializeDatabase();
    const db = await getDb();
    const data = queryAll(db, "SELECT * FROM contacts ORDER BY created_at DESC");

    // Normalize 'is_read' from 0/1 (JSON DB) to boolean (API contract)
    const normalized = data.map((row: Record<string, unknown>) => ({
      ...row,
      is_read: row.is_read === 1 || row.is_read === true,
    }));

    return NextResponse.json({ success: true, data: normalized });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    await initializeDatabase();
    const db = await getDb();
    const id = generateId();

    run(db, "INSERT INTO contacts (id, name, email, subject, message, is_read, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)", [
      id,
      body.name,
      body.email,
      body.subject || "",
      body.message,
      0,
      new Date().toISOString(),
    ]);

    return NextResponse.json(
      { success: true, data: { id, name: body.name, email: body.email, subject: body.subject || "", message: body.message }, message: "Message sent successfully!" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to send message" },
      { status: 500 }
    );
  }
}
