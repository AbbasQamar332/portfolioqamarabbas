import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET() {
  try {
    const { data } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .limit(1)
      .single();

    return NextResponse.json({ success: true, data });
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
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { data: existing } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .limit(1)
      .single();

    let result;
    if (existing) {
      const { data } = await supabaseAdmin
        .from("profiles")
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq("id", existing.id)
        .select()
        .single();
      result = data;
    } else {
      const { data } = await supabaseAdmin
        .from("profiles")
        .insert(body)
        .select()
        .single();
      result = data;
    }

    return NextResponse.json({ success: true, data: result });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
