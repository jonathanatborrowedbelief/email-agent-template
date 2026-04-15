import { NextResponse } from "next/server";
import { getSupabase } from "../../../../lib/supabase";
import { sendEmail } from "../../../../lib/resend";
import { config } from "../../../../lib/config";

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    const supabase = getSupabase();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if already subscribed
    const { data: existing } = await supabase
      .from("subscribers")
      .select("id, active")
      .eq("email", email)
      .single();

    if (existing) {
      if (!existing.active) {
        // Reactivate
        await supabase
          .from("subscribers")
          .update({ active: true })
          .eq("id", existing.id);
      }
      return NextResponse.json({ success: true, message: "Already subscribed" });
    }

    // New subscriber
    const { error } = await supabase
      .from("subscribers")
      .insert({ email, name: name || null });

    if (error) {
      console.error("Subscribe error:", error);
      return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
    }

    // Send welcome email
    await sendEmail({
      to: email,
      subject: `Welcome to the ${config.businessName} newsletter!`,
      text: `Hi ${name || "there"},\n\nYou're now on the list! We'll send you helpful updates and tips.\n\nBest,\n${config.businessName}`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscribe route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
