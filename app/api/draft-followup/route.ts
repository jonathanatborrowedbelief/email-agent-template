import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import { draftFollowUp } from "../../../lib/gemini";
import { config } from "../../../lib/config";

// ============================================================
// DRAFT FOLLOW-UP EMAILS
// Finds new leads without an AI draft, generates one per lead.
//
// How to use:
//   - Call this endpoint manually: POST /api/draft-followup
//   - Or set up a cron job to call it every 15 min
//   - Drafts go to Supabase with draft_status = "pending"
//   - Review in Supabase dashboard → change to "approved"
//   - Then hit /api/send-approved to send them
//
// 🔧 GRADUATION: To make it fully autonomous, change
//    draft_status from "pending" to "approved" on line 47.
// ============================================================

export async function POST() {
  try {
    // Find leads that don't have a draft yet
    const { data: leads, error } = await supabase
      .from("leads")
      .select("*")
      .is("ai_draft", null)
      .eq("status", "new")
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!leads || leads.length === 0) {
      return NextResponse.json({ message: "No new leads to draft", drafted: 0 });
    }

    let drafted = 0;

    for (const lead of leads) {
      try {
        const draft = await draftFollowUp(
          {
            name: lead.name,
            interest: lead.interest || "",
            budget: lead.budget || "",
            challenge: lead.challenge || "",
            message: lead.message || "",
          },
          config.businessContext,
          config.voiceNotes
        );

        await supabase
          .from("leads")
          .update({
            ai_draft: draft,
            // 🔧 GRADUATION: Change "pending" to "approved" for fully autonomous mode
            draft_status: "pending",
          })
          .eq("id", lead.id);

        drafted++;
      } catch (err) {
        console.error(`Failed to draft for lead ${lead.id}:`, err);
      }
    }

    return NextResponse.json({ message: `Drafted ${drafted} follow-ups`, drafted });
  } catch (err) {
    console.error("Draft followup error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
