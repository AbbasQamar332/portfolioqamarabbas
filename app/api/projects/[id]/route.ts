import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getAuthenticatedUser } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAuthenticatedUser(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { images, ...projectData } = body;

    const { data, error } = await supabaseAdmin
      .from("projects")
      .update(projectData)
      .eq("id", params.id)
      .select()
      .single();

    if (error) throw error;

    if (images) {
      await supabaseAdmin
        .from("project_images")
        .delete()
        .eq("project_id", params.id);

      if (images.length > 0) {
        const { v4: uuidv4 } = await import("uuid");
        const projectImages = images.map((url: string) => ({
          id: uuidv4(),
          project_id: params.id,
          image_url: url,
        }));
        await supabaseAdmin.from("project_images").insert(projectImages);
      }
    }

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAuthenticatedUser(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabaseAdmin
      .from("projects")
      .delete()
      .eq("id", params.id);

    if (error) throw error;
    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
