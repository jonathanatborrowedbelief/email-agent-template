# Email Agent + Newsletter Template

A complete email automation system for your business. Built with Next.js, Supabase, Resend, and Gemini AI.

**What you get:**
- A contact form that saves leads and sends instant confirmations
- An AI agent that drafts personalized follow-up emails for your review
- A newsletter system that generates and sends content to subscribers

## Quick Start

```bash
# 1. Clone this repo
git clone https://github.com/jonathanatborrowedbelief/email-agent-template.git
cd email-agent-template

# 2. Install dependencies
npm install

# 3. Copy the env template and fill in your keys
cp .env.local.example .env.local

# 4. Run the dev server
npm run dev
```

Then open [localhost:3000](http://localhost:3000) to see your site.

## Setup Guide

Follow the step-by-step instructions in **[SETUP.md](./SETUP.md)** to:

1. Create your Supabase tables
2. Set up Resend for email sending
3. Get your Gemini API key
4. Customize the template for your business

## Architecture

```
Someone fills out your contact form
        ↓
3 things happen:
  1. Lead saved to Supabase (your CRM)
  2. They get an instant confirmation email
  3. You get a notification email
        ↓
AI drafts a personalized follow-up
        ↓
You review the draft → approve → it sends
        ↓
Lead status: new → contacted → meeting → closed
```

## Files to Customize

Everything you need to change is marked with `🔧 CUSTOMIZE`:

| File | What to change |
|---|---|
| `lib/config.ts` | Business name, description, voice, dropdown options |
| `app/contact/page.tsx` | Form labels and tagline |
| `app/newsletter/page.tsx` | Newsletter signup headline |
| `app/layout.tsx` | Page title and meta description |
| `app/page.tsx` | Landing page content |
| `.env.local` | API keys and domain |

## Tech Stack

| Tool | Purpose | Cost |
|---|---|---|
| [Next.js](https://nextjs.org) | Website framework | Free |
| [Supabase](https://supabase.com) | Database / CRM | Free tier: 50K rows |
| [Resend](https://resend.com) | Email sending | Free tier: 3K emails/month |
| [Gemini AI](https://ai.google.dev) | AI email drafting | Free tier available |

## Going Autonomous

Once your AI drafts are consistently good:

1. Open `app/api/draft-followup/route.ts`
2. Change `draft_status: "pending"` to `draft_status: "approved"`
3. Set up a cron job to call `/api/draft-followup` and `/api/send-approved` every 15 min

Your business now auto-replies to every lead. 24/7.
