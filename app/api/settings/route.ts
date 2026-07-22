import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET() {
  try {
    const { data } = await supabaseAdmin
      .from("settings")
      .select("*");

    const settings: Record<string, unknown> = {};
    data?.forEach((s: { key: string; value: unknown }) => {
      settings[s.key] = s.value;
    });

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

    for (const [key, value] of Object.entries(body)) {
      const { data: existing } = await supabaseAdmin
        .from("settings")
        .select("id")
        .eq("key", key)
        .single();

      if (existing) {
        await supabaseAdmin
          .from("settings")
          .update({ value, updated_at: new Date().toISOString() })
          .eq("key", key);
      } else {
        await supabaseAdmin
          .from("settings")
          .insert({ key, value });
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
