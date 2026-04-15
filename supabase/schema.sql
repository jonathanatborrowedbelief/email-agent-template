-- ============================================================
-- Community Automations: Supabase Schema
-- Run this in Supabase SQL Editor (one time)
-- ============================================================

-- Lead / contact submissions (your CRM)
create table if not exists leads (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),

  -- Contact info
  name text not null,
  email text not null,

  -- Qualifying fields (customize the labels for your niche)
  interest text,          -- "What are you looking for?"
  budget text,            -- Budget range
  challenge text,         -- "Biggest challenge right now?"
  message text,           -- Free-form project description

  -- Lead pipeline status
  status text default 'new' check (status in ('new', 'contacted', 'meeting', 'closed', 'lost')),

  -- AI follow-up drafting
  ai_draft text,
  draft_status text default 'pending' check (draft_status in ('pending', 'approved', 'sent', 'skipped')),
  follow_up_sent_at timestamptz,

  -- Extracted lead intelligence (from Gemini)
  lead_info jsonb
);

-- Newsletter subscribers
create table if not exists subscribers (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  email text unique not null,
  name text,
  active boolean default true
);

-- Newsletter archive (track what you've sent)
create table if not exists newsletters (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  subject text not null,
  body text not null,
  topic text,
  status text default 'draft' check (status in ('draft', 'approved', 'sent')),
  recipients_count int default 0,
  sent_at timestamptz
);

-- Indexes for common queries
create index if not exists idx_leads_status on leads(status);
create index if not exists idx_leads_draft_status on leads(draft_status);
create index if not exists idx_subscribers_active on subscribers(active);
create index if not exists idx_newsletters_status on newsletters(status);

-- Row-level security
alter table leads enable row level security;
alter table subscribers enable row level security;
alter table newsletters enable row level security;
