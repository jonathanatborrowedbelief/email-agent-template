import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import { sendEmail } from "../../../lib/resend";
import { extractLeadInfo } from "../../../lib/gemini";
import { config } from "../../../lib/config";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, interest, budget, challenge, message } = body;

    // ── 1. Extract lead intelligence with AI ──────────────────
    let leadInfo = null;
    try {
      leadInfo = await extractLeadInfo({ name, interest, budget, challenge, message });
    } catch {
      // Non-fatal: we still save the lead even if AI extraction fails
      console.error("Lead extraction failed, saving raw data");
    }

    // ── 2. Save to Supabase (your CRM) ───────────────────────
    const { error: dbError } = await supabase.from("leads").insert({
      name,
      email,
      interest,
      budget,
      challenge,
      message,
      status: "new",
      draft_status: "pending",
      lead_info: leadInfo,
    });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

    // ── 3. Send confirmation email to the person who inquired ─
    await sendEmail({
      to: email,
      subject: `Thanks for reaching out, ${name}!`,
      text: `Hi ${name},\n\nWe received your inquiry and will get back to you within 24 hours.\n\nBest,\n${config.businessName}`,
    });

    // ── 4. Notify yourself about the new lead ────────────────
    await sendEmail({
      to: process.env.NOTIFICATION_EMAIL!,
      subject: `New lead: ${name}`,
      text: [
        `New submission from ${name} (${email})`,
        ``,
        `Interest: ${interest}`,
        `Budget: ${budget}`,
        `Challenge: ${challenge}`,
        `Message: ${message}`,
        ``,
        leadInfo ? `AI Analysis: ${JSON.stringify(leadInfo, null, 2)}` : "",
        ``,
        `View in Supabase: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`,
      ].join("\n"),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
