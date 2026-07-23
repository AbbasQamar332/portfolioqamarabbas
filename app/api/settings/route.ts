import { NextRequest, NextResponse } from "next/server";
import { getDb, run, queryAll, queryOne, initializeDatabase } from "@/lib/database";
import { getAuthenticatedUser } from "@/lib/auth";
import { generateId } from "@/lib/utils";

export async function GET() {
  try {
    await initializeDatabase();
    const db = await getDb();
    const rows = queryAll(db, "SELECT * FROM settings");

    const settings: Record<string, unknown> = {};
    for (const row of rows) {
      settings[row.key as string] = row.value;
    }

    return NextResponse.json({ success: true, data: settings });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await getAuthenticatedUser(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    await initializeDatabase();
    const db = await getDb();

    for (const [key, value] of Object.entries(body)) {
      // Check if the key already exists
      const existing = queryOne(db, "SELECT id FROM settings WHERE key = ?", [key]);

      if (existing) {
        // UPDATE
        run(db, "UPDATE settings SET value = ?, updated_at = ? WHERE key = ?", [
          value,
          new Date().toISOString(),
          key,
        ]);
      } else {
        // INSERT
        const id = generateId();
        run(db, "INSERT INTO settings (id, key, value, updated_at) VALUES (?, ?, ?, ?)", [
          id,
          key,
          value,
          new Date().toISOString(),
        ]);
      }
    }

    return NextResponse.json({ success: true, message: "Settings updated" });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
