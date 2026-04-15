// ============================================================
// BUSINESS CONFIGURATION
// 🔧 CUSTOMIZE: Every student edits this file for their niche
// ============================================================

export const config = {
  // 🔧 CUSTOMIZE: Your business name
  businessName: "Your Business Name",

  // 🔧 CUSTOMIZE: Describe what your business does (1-2 sentences)
  // This gets fed to Gemini so it writes emails that sound like YOUR business
  businessContext: `We are a [YOUR NICHE] business that helps [YOUR AUDIENCE]
achieve [THEIR GOAL]. We specialize in [YOUR SPECIALTY].`,

  // Examples:
  // "We are a wedding photography studio that helps couples capture their
  //  special day. We specialize in candid, documentary-style photography."
  //
  // "We are an SAT prep tutoring service that helps high school students
  //  boost their scores. We specialize in 1-on-1 coaching with proven methods."
  //
  // "We are an AI automation agency that helps small businesses save time.
  //  We specialize in chatbots, workflow automation, and AI consulting."

  // 🔧 CUSTOMIZE: How should your emails sound?
  voiceNotes: `Professional but warm. Friendly greeting.
Acknowledge their specific needs. Ask a single follow-up question.
Keep it concise — busy people appreciate brevity.
Sign off as "[Your Name] from [Your Business]".`,

  // 🔧 CUSTOMIZE: Newsletter voice (can be different from email voice)
  newsletterVoice: `Casual and informative. Like a smart friend giving an update.
Short paragraphs, no jargon. Include one actionable tip.
End with a friendly sign-off.`,

  // 🔧 CUSTOMIZE: Contact form dropdown options
  // Change these to match YOUR niche
  interestOptions: [
    // Examples for different niches:
    // Photography: "Wedding", "Portrait", "Commercial", "Event"
    // Tutoring: "SAT Prep", "Math", "Science", "College Admissions"
    // AI Agency: "Chatbot", "Workflow Automation", "AI Consulting"
    "Service 1",
    "Service 2",
    "Service 3",
    "Other",
  ],

  budgetOptions: [
    "Under $500",
    "$500 - $2,000",
    "$2,000 - $5,000",
    "$5,000+",
    "Not sure yet",
  ],
};
