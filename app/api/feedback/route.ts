import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SAM_SLACK_ID = "U060QT5ND";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

async function getSlackToken(db: ReturnType<typeof getSupabaseAdmin>) {
  if (!db) return null;
  const { data } = await db.from("slack_config").select("bot_token").limit(1).single();
  return data?.bot_token ?? null;
}

async function sendSlackNotification(payload: {
  id: string;
  issue_category: string;
  device_type?: string;
  issue_types?: string[];
  customer_first_name?: string;
  customer_last_name?: string;
  customer_email?: string;
  created_at: string;
}, slackToken: string) {
  try {
    const dmRes = await fetch("https://slack.com/api/conversations.open", {
      method: "POST",
      headers: { Authorization: `Bearer ${slackToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ users: SAM_SLACK_ID }),
    });
    const dmData = await dmRes.json();
    const channelId = dmData.channel?.id;
    if (!channelId) return;

    const customerName = [payload.customer_first_name, payload.customer_last_name].filter(Boolean).join(" ") || "Unknown";
    const issueList = payload.issue_types?.length ? payload.issue_types.join(", ") : "—";
    const deviceLabel = payload.device_type || "—";

    await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: { Authorization: `Bearer ${slackToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        channel: channelId,
        blocks: [
          {
            type: "header",
            text: { type: "plain_text", text: `🎫 New Help Center Ticket` },
          },
          {
            type: "section",
            fields: [
              { type: "mrkdwn", text: `*Category:*\n${payload.issue_category}` },
              { type: "mrkdwn", text: `*Device:*\n${deviceLabel}` },
            ],
          },
          {
            type: "section",
            fields: [
              { type: "mrkdwn", text: `*Issues:*\n${issueList}` },
              { type: "mrkdwn", text: `*Customer:*\n${customerName} (${payload.customer_email || "no email"})` },
            ],
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: { type: "plain_text", text: "View Ticket" },
                style: "primary",
                url: `https://teamsho.app/feedback`,
                action_id: `view_helpcenter_${payload.id}`,
              },
            ],
          },
          { type: "divider" },
        ],
        text: `🎫 New Help Center Ticket — ${payload.issue_category} from ${customerName}`,
      }),
    });
  } catch (err) {
    console.error("[focusv-help/feedback] Slack notification failed:", err);
  }
}

export async function POST(req: NextRequest) {
  const db = getSupabaseAdmin();
  if (!db) {
    console.warn("[focusv-help/feedback] Supabase not configured — skipping insert");
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const body = await req.json();

  // Support both legacy (FeedbackWidget) and new (ContactForm) payloads
  const {
    message,
    page_path,
    screenshot_urls,
    // New contact form fields
    customer_first_name,
    customer_last_name,
    customer_email,
    customer_phone,
    device_type,
    issue_category,
    issue_types,
    order_number,
  } = body;

  if (!message && !issue_category) {
    return NextResponse.json({ error: "message required" }, { status: 400 });
  }

  // Build formatted message string that contains all context
  let formattedMessage = message ?? "";
  if (issue_category) {
    formattedMessage = [
      `[Help Center Ticket]`,
      `Category: ${issue_category}`,
      device_type ? `Device: ${device_type}` : null,
      issue_types?.length ? `Issues: ${issue_types.join(", ")}` : null,
      `Order: ${order_number || "N/A"}`,
      ``,
      message || "(no additional description)",
      ``,
      `---`,
      `Contact: ${[customer_first_name, customer_last_name].filter(Boolean).join(" ")} | ${customer_email || "—"} | ${customer_phone || "—"}`,
    ]
      .filter((line) => line !== null)
      .join("\n");
  }

  // Try inserting with all new structured columns first
  let insertResult = await db
    .from("feedback")
    .insert({
      user_id: null,
      rep_name: "Help Center Team",
      type: "question",
      message: formattedMessage,
      page_path: page_path ?? "/contact",
      page_title: issue_category ? `Contact: ${issue_category}` : null,
      status: "open",
      screenshot_urls: screenshot_urls ?? [],
      // Structured customer fields (requires migration to be run)
      customer_first_name: customer_first_name ?? null,
      customer_last_name: customer_last_name ?? null,
      customer_email: customer_email ?? null,
      customer_phone: customer_phone ?? null,
      device_type: device_type ?? null,
      issue_category: issue_category ?? null,
      issue_types: issue_types ?? null,
      order_number: order_number ?? null,
      source: "help-center",
    })
    .select()
    .single();

  // Fallback: if columns don't exist yet, insert with just original fields
  if (insertResult.error) {
    console.warn("[focusv-help/feedback] Full insert failed, trying fallback:", insertResult.error.message);
    insertResult = await db
      .from("feedback")
      .insert({
        user_id: null,
        rep_name: "Help Center Team",
        type: "question",
        message: formattedMessage,
        page_path: page_path ?? "/contact",
        page_title: issue_category ? `Contact: ${issue_category}` : null,
        status: "open",
        screenshot_urls: screenshot_urls ?? [],
      })
      .select()
      .single();
  }

  if (insertResult.error) {
    console.error("[focusv-help/feedback] insert error:", insertResult.error.message);
    return NextResponse.json({ error: insertResult.error.message }, { status: 500 });
  }

  const data = insertResult.data;

  // Fire Slack DM — non-blocking
  if (issue_category) {
    const slackToken = await getSlackToken(db);
    if (slackToken) {
      sendSlackNotification({
        id: data.id,
        issue_category,
        device_type,
        issue_types,
        customer_first_name,
        customer_last_name,
        customer_email,
        created_at: data.created_at,
      }, slackToken).catch(() => {});
    }
  }

  return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
}
