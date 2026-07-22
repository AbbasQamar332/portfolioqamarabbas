import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getAuthenticatedUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const admin = await getAuthenticatedUser(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const field = (formData.get("field") as string) || "profile_picture";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = `profiles/${fileName}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("portfolio")
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: "3600",
      });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabaseAdmin.storage
      .from("portfolio")
      .getPublicUrl(filePath);

    const imageUrl = urlData.publicUrl;

    const { data: existing } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .limit(1)
      .single();

    if (existing) {
      await supabaseAdmin
        .from("profiles")
        .update({ [field]: imageUrl, updated_at: new Date().toISOString() })
        .eq("id", existing.id);
    } else {
      await supabaseAdmin
        .from("profiles")
        .insert({ [field]: imageUrl } as never);
    }

    return NextResponse.json({ success: true, data: { url: imageUrl } });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Upload failed" },
      { status: 500 }
    );
  }
}
