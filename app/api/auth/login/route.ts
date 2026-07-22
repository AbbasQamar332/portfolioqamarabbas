import { NextRequest, NextResponse } from "next/server";
import { comparePassword, generateToken } from "@/lib/auth";
import { getDb, queryOne, initializeDatabase } from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    await initializeDatabase();
    const db = await getDb();
    const user = queryOne(db, "SELECT * FROM admin_users WHERE email = ?", [email]);

    if (!user || !comparePassword(password, user.password_hash as string)) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = generateToken({ id: user.id as string, email: user.email as string });

    return NextResponse.json({
      success: true,
      data: {
        token,
        user: { id: user.id, email: user.email, name: user.name },
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
