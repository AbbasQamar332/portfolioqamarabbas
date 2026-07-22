import { NextRequest, NextResponse } from "next/server";
import { getDb, queryOne, run, initializeDatabase } from "@/lib/database";
import { getAuthenticatedUser } from "@/lib/auth";
import { generateId } from "@/lib/utils";

export async function GET() {
  try {
    await initializeDatabase();
    const db = await getDb();
    const profile = queryOne(db, "SELECT * FROM profiles LIMIT 1");
    return NextResponse.json({ success: true, data: profile });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch profile" },
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
    const existing = queryOne(db, "SELECT id FROM profiles LIMIT 1");

    if (existing) {
      const { social_links, ...fields } = body;
      const socialLinksStr = social_links ? JSON.stringify(social_links) : (existing.social_links || "{}");
      run(db, "UPDATE profiles SET name = ?, title = ?, about = ?, short_bio = ?, email = ?, phone = ?, location = ?, social_links = ?, updated_at = ? WHERE id = ?", [
        fields.name || "", fields.title || "", fields.about || "", fields.short_bio || "",
        fields.email || "", fields.phone || "", fields.location || "", socialLinksStr,
        new Date().toISOString(), existing.id
      ]);
    } else {
      const id = generateId();
      const socialLinksStr = body.social_links ? JSON.stringify(body.social_links) : "{}";
      run(db, "INSERT INTO profiles (id, name, title, about, short_bio, email, phone, location, social_links, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
        id, body.name || "", body.title || "", body.about || "", body.short_bio || "",
        body.email || "", body.phone || "", body.location || "", socialLinksStr,
        new Date().toISOString()
      ]);
    }

    const updated = queryOne(db, "SELECT * FROM profiles LIMIT 1");
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
