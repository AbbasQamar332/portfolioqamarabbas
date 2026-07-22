import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.slice(7);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const [
      { count: total_projects },
      { count: total_skills },
      { count: total_certificates },
      { count: total_gallery },
      { count: total_contacts },
      { count: total_testimonials },
      { data: profile },
    ] = await Promise.all([
      supabaseAdmin.from("projects").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("skills").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("certificates").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("gallery").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("contacts").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("testimonials").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("profiles").select("updated_at").limit(1).single(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        total_projects: total_projects || 0,
        total_skills: total_skills || 0,
        total_certificates: total_certificates || 0,
        total_gallery: total_gallery || 0,
        total_contacts: total_contacts || 0,
        total_testimonials: total_testimonials || 0,
        last_updated: profile?.updated_at || null,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
