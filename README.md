# CORE — AGC Author Lifecycle Tool
**By Madecraft** · [madecraft.space](https://madecraft.space)

CORE is Madecraft's internal author management and communication hub. It tracks every author from initial recruiting through final delivery and payment, with built-in messaging (Gmail + Slack), stage-based email templates, and a full visual process map.

---

## What It Does

| Tab | What's There |
|---|---|
| **Process Map** | Visual flowchart of the 11-stage AGC author journey (Figma embed) + a detailed step-by-step breakdown filterable by manual/automated/author/staff actions |
| **Authors** | Cards for every author — stage, course, last contact, notes. Filter by pipeline stage, search by name or course. Add, edit, or delete authors. |
| **Messages** | Unified inbox per author. Send emails via Gmail, post to Slack, or save internal notes. Stage-based template suggestions auto-fill with the author's name and course details. |

---

## The 11 Pipeline Stages

1. Recruiting & Prospecting
2. NDA / Publishing Agreement
3. Content Alignment
4. Contracting
5. Pre-Production
6. Recording & Footage Handoff
7. Editing (Post-Production)
8. QA + Transcripts
9. Revisions & Final Export
10. Regression Testing & DTOC
11. Delivery & Payment

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + CSS custom properties
- **Deployment:** Vercel (auto-deploys on every push to `main`)
- **Gmail:** Google Gmail API via OAuth 2.0 (`googleapis`)
- **Slack:** Slack Web API (`@slack/web-api`)

---

## Running Locally

**Prerequisites:** Node.js 18+, npm

```bash
# 1. Clone the repo
git clone https://github.com/Madecraft-Christopher/author-hub.git
cd author-hub

# 2. Install dependencies
npm install

# 3. Create your local environment file
cp .env.example .env.local
# Then fill in your credentials (see Environment Variables below)

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env.local` file in the root of the project (never commit this file — it's gitignored).

```env
# ── Gmail ──────────────────────────────────────────────────
GOOGLE_CLIENT_ID=        # From Google Cloud Console → Credentials
GOOGLE_CLIENT_SECRET=    # From Google Cloud Console → Credentials
GOOGLE_REDIRECT_URI=     # https://your-domain.com/api/gmail/callback
GOOGLE_REFRESH_TOKEN=    # Generated during the Gmail auth flow (see below)
GMAIL_SENDER=            # Your Gmail address (e.g. christopher@onlymadecraft.com)

# ── Slack ───────────────────────────────────────────────────
SLACK_BOT_TOKEN=         # xoxb-... token from your Slack App
SLACK_DEFAULT_CHANNEL=   # e.g. #madecraft-authors
```

In production, add these to **Vercel → Project Settings → Environment Variables** instead of a `.env.local` file.

---

## Connecting Gmail

Gmail lets CORE send and receive real emails from inside the Messages tab.

**Step 1 — Google Cloud Setup**
1. Go to [console.cloud.google.com](https://console.cloud.google.com) → create a new project (e.g. `Madecraft CORE`)
2. Search for **Gmail API** → Enable it
3. Go to **APIs & Services → Credentials → + Create Credentials → OAuth client ID**
4. Set up the consent screen if prompted (External, add your email as a test user)
5. Application type: **Web application**
6. Add an authorized redirect URI: `https://madecraft.space/api/gmail/callback`
7. Copy the **Client ID** and **Client Secret**

**Step 2 — Add to Vercel**

Add these environment variables in Vercel:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI` → `https://madecraft.space/api/gmail/callback`
- `GMAIL_SENDER` → `christopher@onlymadecraft.com`

Redeploy after adding them.

**Step 3 — Authorize**
1. Visit `https://madecraft.space/api/gmail/auth`
2. Sign in with your Google account and click Allow
3. You'll see a page with your **Refresh Token** — copy it
4. Add it to Vercel as `GOOGLE_REFRESH_TOKEN` → Redeploy

Gmail is now live. The Messages tab will pull real email threads per author and send emails directly from your account.

---

## Connecting Slack

Slack lets CORE post internal team notifications (e.g. "Footage ready for editing") to your workspace channels.

**Step 1 — Create a Slack App**
1. Go to [api.slack.com/apps](https://api.slack.com/apps) → **Create New App → From Scratch**
2. Name: `Madecraft CORE`, choose your Madecraft workspace
3. Go to **OAuth & Permissions → Bot Token Scopes** → add:
   - `chat:write`
   - `chat:write.public`
4. Click **Install to Workspace → Allow**
5. Copy the **Bot User OAuth Token** (starts with `xoxb-`)

**Step 2 — Add to Vercel**

Add these environment variables in Vercel:
- `SLACK_BOT_TOKEN` → your `xoxb-...` token
- `SLACK_DEFAULT_CHANNEL` → e.g. `#madecraft-authors`

Redeploy. Slack messages sent from CORE will now post live to your workspace.

---

## API Routes

| Route | Method | What It Does |
|---|---|---|
| `/api/connections` | GET | Returns which integrations are currently connected |
| `/api/gmail/auth` | GET | Starts the Gmail OAuth flow |
| `/api/gmail/callback` | GET | Handles Google's OAuth redirect and returns the refresh token |
| `/api/gmail/send` | POST | Sends an email via Gmail API |
| `/api/gmail/messages` | GET | Fetches email threads for a given author email address |
| `/api/slack/send` | POST | Posts a message to a Slack channel |

---

## Project Structure

```
author-hub/
├── app/
│   ├── page.jsx              # Main app — tabs, author state, layout
│   ├── layout.jsx            # Root layout + fonts
│   ├── globals.css           # Design tokens (colors, fonts, spacing)
│   └── api/
│       ├── connections/      # GET — check Gmail/Slack status
│       ├── gmail/
│       │   ├── auth/         # Start OAuth flow
│       │   ├── callback/     # Handle OAuth redirect
│       │   ├── send/         # Send email
│       │   └── messages/     # Fetch thread by author email
│       └── slack/
│           └── send/         # Post message to channel
├── components/
│   ├── AGCLifecycle.jsx      # Process Map tab (Figma embed + step detail)
│   ├── AuthorCard.jsx        # Individual author card
│   ├── AddAuthorModal.jsx    # Add new author form
│   ├── EditAuthorModal.jsx   # Edit author details
│   └── MessagingHub.jsx      # Full messaging interface
├── public/                   # Static assets
├── .env.local                # Local secrets (never commit)
└── README.md                 # This file
```

---

## Deployment

This project auto-deploys via Vercel. Every push to the `main` branch triggers a new production deployment at [madecraft.space](https://madecraft.space).

To deploy manually:
```bash
git add .
git commit -m "your message"
git push
```

Vercel handles the rest.

---

## Roadmap

- [x] Author pipeline dashboard (11 stages)
- [x] Messaging hub with Gmail + Slack integration
- [x] Stage-based email templates
- [x] Process map with Figma flowchart embed
- [ ] Supabase database (persistent author data across sessions)
- [ ] Real Gmail thread sync per author
- [ ] AI message drafting using Madecraft process docs
- [ ] Author count column per pipeline stage
- [ ] Google Drive integration (view shared docs per author)

---

*Built by Madecraft · christopher@onlymadecraft.com*
