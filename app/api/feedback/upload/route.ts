import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function POST(req: NextRequest) {
  const db = getSupabaseAdmin();
  if (!db) {
    console.warn("[focusv-help/feedback/upload] Supabase not configured — skipping upload");
    return NextResponse.json({ urls: [] }, { status: 200 });
  }

  const formData = await req.formData();
  const files = formData.getAll("files") as File[];

  if (!files.length) return NextResponse.json({ error: "No files" }, { status: 400 });
  if (files.length > 3) return NextResponse.json({ error: "Max 3 screenshots" }, { status: 400 });

  const urls: string[] = [];

  for (const file of files) {
    const ext = file.name.split(".").pop() ?? "png";
    const path = `feedback/help-center/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const bytes = await file.arrayBuffer();

    const { error } = await db.storage
      .from("crm-files")
      .upload(path, bytes, { contentType: file.type, upsert: false });

    if (error) {
      console.error("[focusv-help/feedback/upload] upload error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data } = db.storage.from("crm-files").getPublicUrl(path);
    urls.push(data.publicUrl);
  }

  return NextResponse.json({ urls });
}
