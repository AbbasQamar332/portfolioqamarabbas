import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getAuthenticatedUser } from "@/lib/auth";
import { generateId } from "@/lib/utils";

export async function GET() {
  try {
    const { data } = await supabaseAdmin
      .from("projects")
      .select("*, project_images(*)")
      .order("created_at", { ascending: false });

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getAuthenticatedUser(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { images, ...projectData } = body;
    const projectId = generateId();

    const { data, error } = await supabaseAdmin
      .from("projects")
      .insert({ ...projectData, id: projectId })
      .select()
      .single();

    if (error) throw error;

    if (images && images.length > 0) {
      const projectImages = images.map((url: string) => ({
        id: generateId(),
        project_id: projectId,
        image_url: url,
      }));
      await supabaseAdmin.from("project_images").insert(projectImages);
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to create project" },
      { status: 500 }
    );
  }
}
