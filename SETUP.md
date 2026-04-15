# Email Agent + Newsletter — Build Guide

This guide walks you through adding a **contact form**, **AI email agent**, and **newsletter system** to your existing Next.js website.

When you're done, you'll have:
- A contact form that saves leads to Supabase and sends instant confirmations
- An AI agent that drafts personalized follow-ups for you to review
- A newsletter system that generates and sends content to your subscriber list

**Stack:** Next.js + Supabase + Resend + Gemini AI (all free tier)

---

## Step 1: Supabase Tables (5 min)

1. Open your Supabase project dashboard
2. Go to **SQL Editor** (left sidebar)
3. Paste the contents of `supabase/schema.sql` and click **Run**
4. Check **Table Editor** — you should see `leads`, `subscribers`, and `newsletters`

## Step 2: Install Dependencies (2 min)

In your Next.js project terminal:

```bash
npm install @supabase/supabase-js resend
```

## Step 3: Resend Domain Setup (10 min)

1. Go to [resend.com](https://resend.com) → sign up with GitHub
2. Click **Domains** → **Add Domain** → enter your custom domain
3. Resend shows you **3 DNS records** to add (TXT, MX, CNAME)
4. Go to your domain registrar → add these DNS records
5. Back in Resend → click **Verify** (may take 1-5 min to propagate)
6. Go to **API Keys** → **Create API Key** → copy it

## Step 4: Gemini API Key (2 min)

1. Go to [ai.google.dev](https://ai.google.dev)
2. Sign in with your Google account
3. Click **Get API Key** → **Create API key in new project**
4. Copy the key

## Step 5: Environment Variables (2 min)

1. Copy `.env.local.example` to `.env.local` in your Next.js project root
2. Fill in all values:
   - Supabase URL + service key (from Supabase → Project Settings → API)
   - Resend API key (from Step 3)
   - Gemini API key (from Step 4)
   - Your business name, domain, and notification email

## Step 6: Add the Code Files (5 min)

Copy these files into your Next.js project:

```
your-project/
├── lib/
│   ├── supabase.ts      ← copy from template
│   ├── resend.ts         ← copy from template
│   ├── gemini.ts         ← copy from template
│   └── config.ts         ← copy from template (🔧 CUSTOMIZE THIS)
├── app/
│   ├── contact/
│   │   └── page.tsx      ← copy from template
│   ├── newsletter/
│   │   └── page.tsx      ← copy from template
│   └── api/
│       ├── contact/
│       │   └── route.ts  ← copy from template
│       ├── draft-followup/
│       │   └── route.ts  ← copy from template
│       ├── send-approved/
│       │   └── route.ts  ← copy from template
│       └── newsletter/
│           ├── subscribe/
│           │   └── route.ts  ← copy from template
│           └── send/
│               └── route.ts  ← copy from template
```

## Step 7: Customize for YOUR Business (10 min)

Open `lib/config.ts` and customize:

1. **`businessName`** — Your actual business name
2. **`businessContext`** — 1-2 sentences describing what you do
3. **`voiceNotes`** — How your emails should sound
4. **`interestOptions`** — Dropdown options specific to your niche
5. **`budgetOptions`** — Adjust the ranges for your pricing

Also update the contact form page (`app/contact/page.tsx`):
- Change the tagline
- Adjust the challenge question label for your niche

## Step 8: Test the Contact Form (5 min)

1. Start your dev server: `npm run dev`
2. Go to `localhost:3000/contact`
3. Fill out the form with test data and submit
4. Check:
   - **Supabase** → Table Editor → `leads` table → new row?
   - **Your email** → got a notification?
   - **Test email inbox** → got a confirmation?

## Step 9: Test the AI Follow-Up Agent (5 min)

Call the draft endpoint (from terminal or browser):

```bash
curl -X POST http://localhost:3000/api/draft-followup
```

Then check Supabase → `leads` table → the `ai_draft` column should now have a personalized email.

**To send it:**
1. In Supabase, change `draft_status` from `pending` to `approved`
2. Then call:

```bash
curl -X POST http://localhost:3000/api/send-approved
```

3. Check the lead's inbox — they should receive the AI-drafted email!

## Step 10: Test the Newsletter (5 min)

1. Subscribe yourself: go to `localhost:3000/newsletter`, enter your email
2. Check Supabase → `subscribers` table → you should be there
3. Generate a newsletter:

```bash
curl -X POST http://localhost:3000/api/newsletter/send \
  -H "Content-Type: application/json" \
  -d '{"topic": "3 tips for getting started with AI"}'
```

4. Review in Supabase → `newsletters` table → change `status` to `approved`
5. Send it:

```bash
curl -X POST http://localhost:3000/api/newsletter/send \
  -H "Content-Type: application/json" \
  -d '{"action": "send"}'
```

---

## Going Autonomous

Once your brand voice is dialed in and you trust the AI drafts:

1. Open `app/api/draft-followup/route.ts`
2. Find the line that says `draft_status: "pending"`
3. Change it to `draft_status: "approved"`
4. Now the send endpoint will pick up drafts automatically

Set up a cron job (Vercel Cron or similar) to call both endpoints every 15 min:
- `POST /api/draft-followup`
- `POST /api/send-approved`

Your business now auto-replies to every lead with a personalized, AI-drafted email. 24/7.

---

## Files to Customize (marked with 🔧)

| File | What to customize |
|---|---|
| `lib/config.ts` | Business name, context, voice, dropdown options |
| `app/contact/page.tsx` | Form labels, tagline, question wording |
| `app/newsletter/page.tsx` | Headline, description |
| `.env.local` | API keys, domain, notification email |
