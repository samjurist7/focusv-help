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
    console.warn("[focusv-help/feedback] Supabase not configured — skipping insert");
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const { message, page_path, screenshot_urls } = await req.json();
  if (!message) return NextResponse.json({ error: "message required" }, { status: 400 });

  const { data, error } = await db
    .from("feedback")
    .insert({
      user_id: null,
      rep_name: "Help Center Team",
      type: "suggestion",
      message,
      page_path: page_path ?? "/",
      page_title: null,
      status: "open",
      screenshot_urls: screenshot_urls ?? [],
    })
    .select()
    .single();

  if (error) {
    console.error("[focusv-help/feedback] insert error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
}
