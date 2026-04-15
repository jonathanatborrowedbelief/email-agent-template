import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";
import { sendEmail } from "../../../../lib/resend";
import { generateNewsletter } from "../../../../lib/gemini";
import { config } from "../../../../lib/config";

// ============================================================
// NEWSLETTER SYSTEM
//
// Two modes:
//   1. GENERATE + SAVE: POST with { topic: "..." }
//      → AI writes the newsletter → saves as "draft" in Supabase
//      → Review in Supabase dashboard → change status to "approved"
//
//   2. SEND APPROVED: POST with { action: "send" }
//      → Finds approved newsletters → sends to all active subscribers
// ============================================================

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ── Mode 1: Generate a new newsletter ──────────────────
    if (body.topic) {
      const { subject, body: content } = await generateNewsletter(
        body.topic,
        config.newsletterVoice
      );

      const { error } = await supabase.from("newsletters").insert({
        subject,
        body: content,
        topic: body.topic,
        status: "draft",
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        message: "Newsletter drafted",
        subject,
        preview: content.substring(0, 200) + "...",
      });
    }

    // ── Mode 2: Send approved newsletters ──────────────────
    if (body.action === "send") {
      // Get approved newsletters
      const { data: newsletters } = await supabase
        .from("newsletters")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: true })
        .limit(1);

      if (!newsletters || newsletters.length === 0) {
        return NextResponse.json({
          message: "No approved newsletters to send",
          sent: 0,
        });
      }

      const newsletter = newsletters[0];

      // Get active subscribers
      const { data: subscribers } = await supabase
        .from("subscribers")
        .select("*")
        .eq("active", true);

      if (!subscribers || subscribers.length === 0) {
        return NextResponse.json({
          message: "No active subscribers",
          sent: 0,
        });
      }

      let sent = 0;

      for (const sub of subscribers) {
        try {
          // Personalize: replace {{name}} placeholder
          const personalizedBody = newsletter.body.replace(
            /\{\{name\}\}/gi,
            sub.name || "there"
          );

          await sendEmail({
            to: sub.email,
            subject: newsletter.subject,
            text: personalizedBody,
          });

          sent++;

          // Rate limiting: 1 second between sends
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (err) {
          console.error(`Failed to send to ${sub.email}:`, err);
        }
      }

      // Update newsletter record
      await supabase
        .from("newsletters")
        .update({
          status: "sent",
          recipients_count: sent,
          sent_at: new Date().toISOString(),
        })
        .eq("id", newsletter.id);

      return NextResponse.json({
        message: `Newsletter sent to ${sent} subscribers`,
        sent,
      });
    }

    return NextResponse.json(
      { error: 'Send { topic: "..." } to generate or { action: "send" } to send approved' },
      { status: 400 }
    );
  } catch (err) {
    console.error("Newsletter route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
