import { NextRequest, NextResponse } from "next/server";
import { getDb, queryOne, run, initializeDatabase } from "@/lib/database";
import { getAuthenticatedUser } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const admin = await getAuthenticatedUser(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const field = (formData.get("field") as string) || "profile_picture";

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, fileName);

    await mkdir(uploadDir, { recursive: true });
    await writeFile(filePath, buffer);

    const imageUrl = `/uploads/${fileName}`;

    await initializeDatabase();
    const db = await getDb();
    const existing = queryOne(db, "SELECT id FROM profiles LIMIT 1");

    if (existing) {
      run(db, `UPDATE profiles SET ${field} = ?, updated_at = ? WHERE id = ?`, [imageUrl, new Date().toISOString(), existing.id]);
    } else {
      const { generateId } = await import("@/lib/utils");
      run(db, `INSERT INTO profiles (id, ${field}, updated_at) VALUES (?, ?, ?)`, [generateId(), imageUrl, new Date().toISOString()]);
    }

    return NextResponse.json({ success: true, data: { url: imageUrl } });
  } catch {
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}
