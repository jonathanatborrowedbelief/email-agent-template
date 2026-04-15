const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Generic Gemini call — returns the text response
export async function generateWithGemini(prompt: string): Promise<string> {
  const res = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Gemini API error: ${error}`);
  }

  const data = await res.json();
  return data.candidates[0].content.parts[0].text;
}

// ============================================================
// LEAD INTELLIGENCE
// Extracts structured info from a form submission
// ============================================================
export async function extractLeadInfo(submission: {
  name: string;
  interest: string;
  budget: string;
  challenge: string;
  message: string;
}): Promise<Record<string, string>> {
  const prompt = `Extract structured lead information from this form submission.

Name: ${submission.name}
Interest: ${submission.interest}
Budget: ${submission.budget}
Challenge: ${submission.challenge}
Message: ${submission.message}

Return a JSON object with these fields:
- intent: what they actually want (1 sentence)
- urgency: low / medium / high
- budget_tier: budget / mid-range / premium
- key_needs: list of 2-3 specific things they need

Return ONLY valid JSON, no markdown.`;

  const text = await generateWithGemini(prompt);
  // Strip markdown code fences if present
  const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleaned);
}

// ============================================================
// DRAFT FOLLOW-UP EMAIL
// Writes a personalized reply based on lead data
// ============================================================
export async function draftFollowUp(
  lead: {
    name: string;
    interest: string;
    budget: string;
    challenge: string;
    message: string;
  },
  businessContext: string,
  voiceNotes: string
): Promise<string> {
  const prompt = `You are drafting a follow-up email for a business.

BUSINESS CONTEXT:
${businessContext}

VOICE & TONE:
${voiceNotes}

LEAD INFORMATION:
Name: ${lead.name}
What they want: ${lead.interest}
Budget: ${lead.budget}
Their challenge: ${lead.challenge}
Their message: ${lead.message}

Write a warm, personalized follow-up email that:
- Acknowledges their specific challenge by name
- Briefly explains how you can help (2-3 sentences max)
- Suggests a quick 15-minute call
- Keeps it under 150 words
- Sounds human, not corporate — like a real person wrote it
- Does NOT include a subject line — just the body

Return ONLY the email body text.`;

  return generateWithGemini(prompt);
}

// ============================================================
// NEWSLETTER CONTENT
// Generates newsletter from a topic
// ============================================================
export async function generateNewsletter(
  topic: string,
  voiceProfile: string
): Promise<{ subject: string; body: string }> {
  const prompt = `Write a short email newsletter about: ${topic}

VOICE & TONE:
${voiceProfile}

Format:
- Greeting: Hi {{name}},
- 2-3 short paragraphs
- One actionable takeaway or tip
- Friendly sign-off
- Keep it under 250 words
- Tone: conversational, helpful, not salesy

Return the newsletter body only (no subject line).`;

  const body = await generateWithGemini(prompt);

  // Generate subject line separately
  const subject = await generateWithGemini(
    `Write a short, compelling email subject line (under 50 chars) for a newsletter about: ${topic}. Return ONLY the subject line, nothing else.`
  );

  return { subject: subject.trim(), body };
}
