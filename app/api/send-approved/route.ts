import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import { sendEmail } from "../../../lib/resend";

// ============================================================
// SEND APPROVED DRAFTS
// Finds leads where draft_status = "approved" and sends them.
//
// How to use:
//   - Review drafts in Supabase dashboard
//   - Change draft_status from "pending" to "approved"
//   - Call this endpoint: POST /api/send-approved
//   - Or set up a cron job to check every 15 min
// ============================================================

export async function POST() {
  try {
    const { data: approved, error } = await supabase
      .from("leads")
      .select("*")
      .eq("draft_status", "approved");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!approved || approved.length === 0) {
      return NextResponse.json({ message: "No approved drafts to send", sent: 0 });
    }

    let sent = 0;

    for (const lead of approved) {
      try {
        await sendEmail({
          to: lead.email,
          subject: `Following up on your inquiry, ${lead.name}`,
          text: lead.ai_draft,
        });

        await supabase
          .from("leads")
          .update({
            draft_status: "sent",
            status: "contacted",
            follow_up_sent_at: new Date().toISOString(),
          })
          .eq("id", lead.id);

        sent++;
      } catch (err) {
        console.error(`Failed to send to ${lead.email}:`, err);
      }
    }

    return NextResponse.json({ message: `Sent ${sent} follow-ups`, sent });
  } catch (err) {
    console.error("Send approved error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
