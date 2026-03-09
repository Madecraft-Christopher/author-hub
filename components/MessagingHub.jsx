"use client";

import { useState, useRef, useEffect } from "react";

// ─── Templates keyed by stage ──────────────────────────────────────────────
const TEMPLATES = {
  recruiting: [
    {
      id: "outreach",
      label: "Initial Outreach",
      channel: "email",
      subject: "Collaboration Opportunity — Madecraft",
      body: `Hi {{authorName}},

I came across your work and was really impressed by your expertise in {{topic}}. We're currently developing new content in this space and think you'd be a fantastic fit.

Madecraft partners with subject matter experts to create high-quality e-learning courses distributed on LinkedIn Learning, Pluralsight, and other major platforms.

Would you be open to a quick conversation about a potential collaboration? I'd love to share more details.

Best,
{{senderName}}
Madecraft`,
    },
    {
      id: "rejection",
      label: "Rejection — Not a Fit",
      channel: "email",
      subject: "Re: Madecraft Collaboration",
      body: `Hi {{authorName}},

Thank you so much for your time and for sharing your sample content with us. After careful review, we've decided to move in a different direction at this time.

We genuinely appreciate your interest in working with Madecraft and encourage you to reapply in the future — our needs are always evolving.

Thank you again,
{{senderName}}
Madecraft`,
    },
    {
      id: "second_sample",
      label: "Request 2nd Sample",
      channel: "email",
      subject: "One More Step — Additional Sample Request",
      body: `Hi {{authorName}},

Thank you for submitting your initial sample — we're intrigued! Before we move forward, we'd love to see one more video on a topic of your choice to get a fuller picture of your teaching style.

Please record a 2–5 minute lesson and share the link when ready. No pressure on production quality — we just want to see how you explain concepts.

Looking forward to it!

{{senderName}}
Madecraft`,
    },
  ],
  nda_pa: [
    {
      id: "welcome",
      label: "Welcome — Next Steps to Get Started",
      channel: "email",
      subject: "Welcome to Madecraft — Next Steps to Get Started",
      body: `Hi {{authorName}},

Welcome to Madecraft — we're so excited to be working with you!

You'll be receiving an NDA and Publishing Agreement shortly via SignRequest. Please review and sign both documents at your earliest convenience.

Once signed, we'll move into the Content Alignment phase where we'll align on course topics and get the ball rolling.

In the meantime, feel free to reach out with any questions.

Best,
{{senderName}}
Madecraft`,
    },
  ],
  content_alignment: [
    {
      id: "profile_request",
      label: "Author Profile Asset Request",
      channel: "email",
      subject: "Profile Assets Needed — Headshot, Bio & Lower Third",
      body: `Hi {{authorName}},

Exciting news — we're ready to move into Content Alignment! To get started, we'll need a few things from you:

1. Professional headshot (high-res, 1MB+)
2. Short bio (2–3 sentences, written in third person)
3. On-screen lower third name/title (e.g. "Jane Smith | Data Scientist")

Please send these over at your earliest convenience so we can get your profile set up in our system.

Thanks so much!

{{senderName}}
Madecraft`,
    },
    {
      id: "course_proposal",
      label: "Course Proposal",
      channel: "email",
      subject: "Course Proposal — Topics & Compensation",
      body: `Hi {{authorName}},

Based on our alignment conversation, here is the proposed course plan for your review:

Course Title: {{courseTitle}}
Course ID: {{courseId}}
Estimated Length: TBD
Compensation: Per your publishing agreement

Please reply to confirm you're happy to move forward with this proposal. Once confirmed, we'll send over the Statement of Work.

Looking forward to creating something great together!

{{senderName}}
Madecraft`,
    },
  ],
  contracting: [
    {
      id: "contracts_sent",
      label: "Contracts Coming Your Way",
      channel: "email",
      subject: "Your Madecraft Contract Is On Its Way",
      body: `Hi {{authorName}},

Great news — your Statement of Work for "{{courseTitle}}" has been sent via SignRequest. Please check your inbox for the contract documents.

Once signed, we'll kick off production and get you everything you need to get started. If you have any questions about the terms, don't hesitate to reach out.

Thanks so much!

{{senderName}}
Madecraft`,
    },
  ],
  pre_production: [
    {
      id: "kickoff",
      label: "Production Kickoff",
      channel: "email",
      subject: "Let's Go! Your Production Kickoff for {{courseTitle}}",
      body: `Hi {{authorName}},

We're officially in production — exciting! Here's everything you need to get started:

📁 Your Google Drive course folder: [link]
📋 Course outline template: [link]
🎥 Recording training videos: [link]
✅ Author checklist: [link]

Your first step is to review the course outline and finalize your bullet points for each lesson. Once you're happy with it, record a short rehearsal video (any lesson) and share it back with me.

Any questions at all, just reply to this email. We're here to support you every step of the way.

Let's make something great!

{{senderName}}
Madecraft`,
    },
    {
      id: "ready_to_record",
      label: "You're Ready to Record!",
      channel: "email",
      subject: "You're Ready to Record! 🎬",
      body: `Hi {{authorName}},

Your rehearsal video looks fantastic — great energy, clear audio, and solid framing. You are officially cleared to record your full course!

A few reminders before you hit record:
• Vertical format (9:16), 4K or 1080p, 60fps preferred
• Each lesson should be at least 60 seconds
• Upload all final files to your Google Drive folder when done

We can't wait to see the finished content. You've got this!

{{senderName}}
Madecraft`,
    },
  ],
  recording: [
    {
      id: "rerecord_request",
      label: "Re-record Request",
      channel: "email",
      subject: "A Few Revisions Needed — {{courseTitle}}",
      body: `Hi {{authorName}},

Thank you so much for submitting your footage — you're almost there! We reviewed the videos and have a few small revision requests before we can approve:

[List specific revision notes here]

Please re-record the affected lessons and re-upload to your Google Drive folder. If anything is unclear, just reply and we'll jump on a quick call.

You're doing great — almost at the finish line!

{{senderName}}
Madecraft`,
    },
    {
      id: "videos_approved",
      label: "Your Videos Are Approved!",
      channel: "email",
      subject: "Your Videos Are Approved! ✅",
      body: `Hi {{authorName}},

Excellent work — your footage for "{{courseTitle}}" has been reviewed and approved! Your videos are now in the hands of our post-production team.

Here's what happens next:
1. Our editors will edit, color-grade, and add captions
2. The course goes through QA + transcript review
3. We'll reach out if any revisions are needed

Thank you for all your hard work. We're really excited about this course!

{{senderName}}
Madecraft`,
    },
    {
      id: "slack_footage_ready",
      label: "Notify Team — Footage Ready",
      channel: "slack",
      body: `📹 Footage approved and uploaded for *{{authorName}}* — {{courseTitle}} ({{courseId}}). Ready for editing. LucidLink link added to Monday card.`,
    },
  ],
  editing: [
    {
      id: "slack_ready_for_qa",
      label: "Notify Team — Ready for QA",
      channel: "slack",
      body: `✂️ Editing complete for *{{courseTitle}}* ({{courseId}}). Frame.io review link added to Monday card. Ready for QA + Transcripts.`,
    },
  ],
  qa_transcripts: [
    {
      id: "slack_qa_done",
      label: "Notify Team — QA Complete",
      channel: "slack",
      body: `🔎 QA + Transcripts complete for *{{courseTitle}}* ({{courseId}}). Moving to Revisions.`,
    },
  ],
  delivery_payment: [
    {
      id: "course_live",
      label: "Course Is Live!",
      channel: "email",
      subject: "Your Course Is Live! 🚀",
      body: `Hi {{authorName}},

Incredible news — "{{courseTitle}}" is now live and available to learners worldwide!

You can find your course on:
• LinkedIn Learning
• Pluralsight
• Cornerstone

Thank you for your hard work and dedication throughout this process. It's been a genuine pleasure working with you, and we hope this is the first of many courses together.

Payment will be processed within the next two weeks per your agreement.

Congratulations — you're officially a published Madecraft author!

{{senderName}}
Madecraft`,
    },
  ],
};

// ─── Sample seed messages ───────────────────────────────────────────────────
const SEED_MESSAGES = [
  { id: "s1", authorId: 1, channel: "email", direction: "outbound", subject: "Welcome to Madecraft — Next Steps to Get Started", body: "Hi Sarah, welcome to Madecraft — we're so excited to be working with you! You'll be receiving an NDA and Publishing Agreement shortly via SignRequest...", timestamp: "2026-02-20T09:00:00", status: "sent" },
  { id: "s2", authorId: 1, channel: "email", direction: "inbound", subject: "Re: Welcome to Madecraft", body: "Hi Christopher! Thank you so much — I'm thrilled to be working with Madecraft. I've reviewed the documents and everything looks great. Signing now!", timestamp: "2026-02-20T11:34:00", status: "received" },
  { id: "s3", authorId: 1, channel: "email", direction: "outbound", subject: "Let's Go! Your Production Kickoff for UX Design Fundamentals", body: "Hi Sarah, we're officially in production — exciting! Here's everything you need to get started...", timestamp: "2026-02-28T10:15:00", status: "sent" },
  { id: "s4", authorId: 1, channel: "slack", direction: "outbound", subject: null, body: "📹 Footage approved and uploaded for *Sarah Mitchell* — UX Design Fundamentals (CRS-101). Ready for editing.", timestamp: "2026-03-04T14:00:00", status: "sent" },
  { id: "s5", authorId: 2, channel: "email", direction: "outbound", subject: "Your Videos Are Approved! ✅", body: "Excellent work — your footage for Deep Learning for Everyone has been reviewed and approved! Your videos are now in the hands of our post-production team...", timestamp: "2026-02-25T09:30:00", status: "sent" },
  { id: "s6", authorId: 2, channel: "email", direction: "inbound", subject: "Re: Your Videos Are Approved!", body: "Amazing! Thank you so much. Really happy with how they turned out. Can't wait to see the final edit!", timestamp: "2026-02-25T16:45:00", status: "received" },
  { id: "s7", authorId: 3, channel: "email", direction: "outbound", subject: "Your Madecraft Contract Is On Its Way", body: "Hi Priya, great news — your Statement of Work for Mindful Leadership has been sent via SignRequest. Please check your inbox...", timestamp: "2026-02-28T11:00:00", status: "sent" },
  { id: "s8", authorId: 4, channel: "email", direction: "outbound", subject: "Collaboration Opportunity — Madecraft", body: "Hi Marcus, I came across your work and was really impressed by your expertise in data-driven growth. We're currently developing content in this space...", timestamp: "2026-03-01T09:00:00", status: "sent" },
  { id: "s9", authorId: 5, channel: "email", direction: "outbound", subject: "Your Course Is Live! 🚀", body: "Hi Elena, incredible news — Building Resilient Teams is now live and available to learners worldwide! You can find your course on LinkedIn Learning, Pluralsight, and Cornerstone...", timestamp: "2026-02-15T10:00:00", status: "sent" },
  { id: "s10", authorId: 5, channel: "email", direction: "inbound", subject: "Re: Your Course Is Live!", body: "Oh my gosh this is so exciting!! Thank you Christopher and the whole Madecraft team. What an incredible experience from start to finish. Can't wait to work together again!", timestamp: "2026-02-15T12:18:00", status: "received" },
];

const CHANNEL_ICONS = { email: "✉", slack: "#", note: "📝" };
const CHANNEL_COLORS = { email: "var(--accent-blue)", slack: "#4A154B", note: "var(--accent-gold)" };

function fillTemplate(text, author, senderName = "Christopher") {
  return text
    .replace(/\{\{authorName\}\}/g, author.name)
    .replace(/\{\{courseTitle\}\}/g, author.courseTitle || "[Course Title]")
    .replace(/\{\{courseId\}\}/g, author.courseId || "[Course ID]")
    .replace(/\{\{senderName\}\}/g, senderName)
    .replace(/\{\{topic\}\}/g, author.title || "your area of expertise");
}

function formatTime(ts) {
  const d = new Date(ts);
  const now = new Date();
  const diff = now - d;
  const days = Math.floor(diff / 86400000);
  if (days === 0) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (days === 1) return "Yesterday";
  if (days < 7) return d.toLocaleDateString([], { weekday: "short" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function formatFullTime(ts) {
  return new Date(ts).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function MessagingHub({ authors, stages }) {
  const [messages, setMessages]             = useState(SEED_MESSAGES);
  const [selectedId, setSelectedId]         = useState(authors[0]?.id || null);
  const [search, setSearch]                 = useState("");
  const [channelFilter, setChannelFilter]   = useState("all");
  const [compose, setCompose]               = useState({ channel: "email", subject: "", body: "" });
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const threadRef = useRef(null);

  const selected = authors.find((a) => a.id === selectedId);
  const stage    = stages.find((s) => s.id === selected?.stage);

  // Stage templates for the selected author
  const stageTemplates = selected ? (TEMPLATES[selected.stage] || []) : [];
  const allTemplates   = Object.values(TEMPLATES).flat();

  // Messages for selected author
  const thread = messages
    .filter((m) => m.authorId === selectedId)
    .filter((m) => channelFilter === "all" || m.channel === channelFilter)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  // Last message per author for sidebar preview
  const lastMsg = (authorId) => {
    const msgs = messages.filter((m) => m.authorId === authorId);
    return msgs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0] || null;
  };

  const unreadCount = (authorId) =>
    messages.filter((m) => m.authorId === authorId && m.direction === "inbound" && m.status === "received").length;

  const filteredAuthors = authors.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    (a.courseTitle || "").toLowerCase().includes(search.toLowerCase())
  );

  // Scroll thread to bottom on change
  useEffect(() => {
    if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [selectedId, thread.length]);

  const handleTemplateSelect = (e) => {
    const tplId = e.target.value;
    setSelectedTemplate(tplId);
    if (!tplId) { setCompose((c) => ({ ...c, subject: "", body: "" })); return; }
    const tpl = allTemplates.find((t) => t.id === tplId);
    if (!tpl || !selected) return;
    setCompose({
      channel: tpl.channel,
      subject: tpl.subject ? fillTemplate(tpl.subject, selected) : "",
      body: fillTemplate(tpl.body, selected),
    });
  };

  const handleSend = () => {
    if (!compose.body.trim() || !selected) return;
    const msg = {
      id: `msg-${Date.now()}`,
      authorId: selected.id,
      channel: compose.channel,
      direction: "outbound",
      subject: compose.subject || null,
      body: compose.body,
      timestamp: new Date().toISOString(),
      status: "sent",
    };
    setMessages((prev) => [...prev, msg]);
    setCompose({ channel: compose.channel, subject: "", body: "" });
    setSelectedTemplate("");
  };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 112px)", overflow: "hidden", background: "var(--bg-primary)" }}>

      {/* ── Left Sidebar ── */}
      <div style={{
        width: 280, flexShrink: 0,
        borderRight: "1px solid var(--border)",
        background: "var(--bg-secondary)",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
      }}>
        {/* Sidebar header */}
        <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid var(--border)" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", margin: "0 0 10px 0" }}>
            Authors
          </p>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", background: "var(--bg-surface)",
              border: "1px solid var(--border)", borderRadius: 8,
              padding: "8px 12px", fontSize: 12,
              color: "var(--text-primary)", outline: "none",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          />
        </div>

        {/* Author list */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {filteredAuthors.map((author) => {
            const last   = lastMsg(author.id);
            const unread = unreadCount(author.id);
            const stg    = stages.find((s) => s.id === author.stage);
            const isActive = author.id === selectedId;

            return (
              <button
                key={author.id}
                onClick={() => setSelectedId(author.id)}
                style={{
                  width: "100%", textAlign: "left",
                  padding: "12px 16px",
                  background: isActive ? "var(--bg-surface)" : "transparent",
                  borderBottom: "1px solid var(--border)",
                  borderLeft: isActive ? `3px solid var(--accent-coral)` : "3px solid transparent",
                  cursor: "pointer", border: "none",
                  borderBottom: "1px solid var(--border)",
                  borderLeft: isActive ? `3px solid var(--accent-coral)` : "3px solid transparent",
                  fontFamily: "var(--font-inter), sans-serif",
                  display: "block",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-playfair), Georgia, serif" }}>
                    {author.name}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {unread > 0 && (
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent-coral)", flexShrink: 0, display: "inline-block" }} />
                    )}
                    <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                      {last ? formatTime(last.timestamp) : ""}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{
                    fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 8,
                    background: stg ? `${stg.hex}18` : "var(--border)",
                    color: stg?.hex || "var(--text-muted)",
                    border: `1px solid ${stg?.hex || "var(--border)"}`,
                  }}>{stg?.label}</span>
                </div>
                {last && (
                  <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 220 }}>
                    {last.direction === "outbound" ? "You: " : ""}{last.subject || last.body}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Right Panel ── */}
      {selected ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Thread header */}
          <div style={{
            padding: "14px 24px",
            borderBottom: "1px solid var(--border)",
            background: "var(--bg-secondary)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <h2 style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: 20, fontWeight: 700,
                color: "var(--text-primary)", margin: 0,
              }}>{selected.name}</h2>
              <div style={{ display: "flex", gap: 12, marginTop: 4, alignItems: "center" }}>
                {selected.title && <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{selected.title}</span>}
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10,
                  background: stage ? `${stage.hex}18` : "var(--border)",
                  color: stage?.hex || "var(--text-muted)",
                  border: `1px solid ${stage?.hex || "var(--border)"}`,
                }}>{stage?.label}</span>
                {selected.courseTitle && <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{selected.courseId} · {selected.courseTitle}</span>}
              </div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              {selected.email && (
                <a href={`mailto:${selected.email}`} style={{ fontSize: 12, color: "var(--accent-blue)", textDecoration: "none", fontWeight: 500 }}>
                  ✉ {selected.email}
                </a>
              )}
              {selected.linkedin && (
                <a href={selected.linkedin} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "var(--accent-indigo)", textDecoration: "none", fontWeight: 500 }}>
                  in LinkedIn
                </a>
              )}
            </div>
          </div>

          {/* Channel filter */}
          <div style={{ padding: "8px 24px", borderBottom: "1px solid var(--border)", background: "var(--bg-secondary)", display: "flex", gap: 6 }}>
            {["all", "email", "slack", "note"].map((ch) => (
              <button key={ch} onClick={() => setChannelFilter(ch)} style={{
                padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                cursor: "pointer", fontFamily: "var(--font-inter), sans-serif",
                border: "1px solid",
                borderColor: channelFilter === ch ? "var(--accent-coral)" : "var(--border)",
                background: channelFilter === ch ? "var(--accent-coral)" : "transparent",
                color: channelFilter === ch ? "#fff" : "var(--text-muted)",
              }}>
                {ch === "all" ? "All" : ch === "email" ? "✉ Email" : ch === "slack" ? "# Slack" : "📝 Notes"}
              </button>
            ))}
          </div>

          {/* Message thread */}
          <div ref={threadRef} style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 16, background: "var(--bg-primary)" }}>
            {thread.length === 0 ? (
              <div style={{ textAlign: "center", color: "var(--text-muted)", paddingTop: 60 }}>
                <p style={{ fontSize: 32, marginBottom: 8 }}>✉</p>
                <p style={{ fontSize: 14 }}>No messages yet. Start the conversation below.</p>
                {stageTemplates.length > 0 && (
                  <p style={{ fontSize: 12, marginTop: 6 }}>
                    Suggested for <strong>{stage?.label}</strong>: <em>{stageTemplates[0]?.label}</em>
                  </p>
                )}
              </div>
            ) : (
              thread.map((msg, i) => {
                const isOut = msg.direction === "outbound";
                const prevMsg = thread[i - 1];
                const showDate = !prevMsg || new Date(msg.timestamp).toDateString() !== new Date(prevMsg.timestamp).toDateString();

                return (
                  <div key={msg.id}>
                    {/* Date separator */}
                    {showDate && (
                      <div style={{ textAlign: "center", margin: "8px 0" }}>
                        <span style={{ fontSize: 10, color: "var(--text-muted)", background: "var(--bg-surface)", padding: "3px 12px", borderRadius: 20, fontWeight: 600 }}>
                          {new Date(msg.timestamp).toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
                        </span>
                      </div>
                    )}

                    {/* Message bubble */}
                    <div style={{ display: "flex", justifyContent: isOut ? "flex-end" : "flex-start" }}>
                      <div style={{ maxWidth: "72%", display: "flex", flexDirection: "column", gap: 4 }}>
                        {/* Channel + time label */}
                        <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: isOut ? "flex-end" : "flex-start" }}>
                          <span style={{ fontSize: 10, color: CHANNEL_COLORS[msg.channel], fontWeight: 700 }}>
                            {CHANNEL_ICONS[msg.channel]} {msg.channel.toUpperCase()}
                          </span>
                          <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                            {isOut ? "You" : selected.name.split(" ")[0]} · {formatFullTime(msg.timestamp)}
                          </span>
                        </div>

                        <div style={{
                          background: isOut ? "var(--accent-coral)" : "var(--bg-card)",
                          color: isOut ? "#fff" : "var(--text-body)",
                          borderRadius: isOut ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                          padding: "12px 16px",
                          border: isOut ? "none" : "1px solid var(--border)",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                        }}>
                          {msg.subject && (
                            <p style={{ fontSize: 11, fontWeight: 700, margin: "0 0 6px 0", opacity: isOut ? 0.85 : 1, color: isOut ? "#fff" : "var(--text-muted)" }}>
                              {msg.subject}
                            </p>
                          )}
                          <p style={{ fontSize: 13, margin: 0, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>
                            {msg.body}
                          </p>
                        </div>

                        {/* Pending badge for outbound when not yet connected */}
                        {isOut && (
                          <span style={{ fontSize: 9, color: "var(--text-muted)", textAlign: "right" }}>
                            Saved · Connect {msg.channel === "email" ? "Gmail" : "Slack"} to send live
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ── Compose area ── */}
          <div style={{
            borderTop: "1px solid var(--border)",
            background: "var(--bg-secondary)",
            padding: "16px 24px",
            display: "flex", flexDirection: "column", gap: 10,
          }}>
            {/* Stage suggestion banner */}
            {stageTemplates.length > 0 && (
              <div style={{
                background: stage ? `${stage.hex}10` : "var(--bg-surface)",
                border: `1px solid ${stage?.hex || "var(--border)"}30`,
                borderRadius: 8, padding: "8px 12px",
                display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
              }}>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  Suggested for <strong style={{ color: stage?.hex }}>{stage?.label}</strong>:
                </span>
                {stageTemplates.slice(0, 2).map((t) => (
                  <button key={t.id} onClick={() => {
                    setSelectedTemplate(t.id);
                    setCompose({
                      channel: t.channel,
                      subject: t.subject ? fillTemplate(t.subject, selected) : "",
                      body: fillTemplate(t.body, selected),
                    });
                  }} style={{
                    fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 12,
                    background: stage ? `${stage.hex}18` : "var(--bg-surface)",
                    color: stage?.hex || "var(--text-primary)",
                    border: `1px solid ${stage?.hex || "var(--border)"}40`,
                    cursor: "pointer", fontFamily: "var(--font-inter), sans-serif",
                  }}>
                    {t.label}
                  </button>
                ))}
              </div>
            )}

            {/* Controls row */}
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              {/* Channel selector */}
              <div style={{ display: "flex", gap: 4 }}>
                {[
                  { id: "email", label: "✉ Email" },
                  { id: "slack", label: "# Slack" },
                  { id: "note",  label: "📝 Note" },
                ].map((ch) => (
                  <button key={ch.id} onClick={() => setCompose((c) => ({ ...c, channel: ch.id }))} style={{
                    padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                    cursor: "pointer", fontFamily: "var(--font-inter), sans-serif",
                    border: "1px solid",
                    borderColor: compose.channel === ch.id ? CHANNEL_COLORS[ch.id] : "var(--border)",
                    background: compose.channel === ch.id ? `${CHANNEL_COLORS[ch.id]}14` : "transparent",
                    color: compose.channel === ch.id ? CHANNEL_COLORS[ch.id] : "var(--text-muted)",
                  }}>{ch.label}</button>
                ))}
              </div>

              {/* Template picker */}
              <select value={selectedTemplate} onChange={handleTemplateSelect} style={{
                background: "var(--bg-surface)", border: "1px solid var(--border)",
                borderRadius: 8, padding: "5px 10px", fontSize: 11,
                color: "var(--text-body)", outline: "none",
                fontFamily: "var(--font-inter), sans-serif", cursor: "pointer", flex: 1, maxWidth: 280,
              }}>
                <option value="">Use a template...</option>
                {stageTemplates.length > 0 && (
                  <optgroup label={`✦ ${stage?.label} (current stage)`}>
                    {stageTemplates.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </optgroup>
                )}
                {Object.entries(TEMPLATES).filter(([k]) => k !== selected?.stage).map(([k, tpls]) => {
                  const s = stages.find((st) => st.id === k);
                  return (
                    <optgroup key={k} label={s?.label || k}>
                      {tpls.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
                    </optgroup>
                  );
                })}
              </select>
            </div>

            {/* Subject (email only) */}
            {compose.channel === "email" && (
              <input
                type="text"
                placeholder="Subject"
                value={compose.subject}
                onChange={(e) => setCompose((c) => ({ ...c, subject: e.target.value }))}
                style={{
                  background: "var(--bg-card)", border: "1px solid var(--border)",
                  borderRadius: 8, padding: "8px 12px", fontSize: 12,
                  color: "var(--text-primary)", outline: "none",
                  fontFamily: "var(--font-inter), sans-serif",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent-coral)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            )}

            {/* Body */}
            <textarea
              placeholder={compose.channel === "slack" ? "Message to post in Slack..." : compose.channel === "note" ? "Add an internal note..." : "Write your message..."}
              value={compose.body}
              onChange={(e) => setCompose((c) => ({ ...c, body: e.target.value }))}
              rows={5}
              style={{
                background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: 8, padding: "10px 12px", fontSize: 13,
                color: "var(--text-primary)", outline: "none", resize: "vertical",
                fontFamily: "var(--font-inter), sans-serif", lineHeight: 1.55,
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent-coral)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />

            {/* Send row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                {compose.channel === "email" ? "✉ Gmail not connected — will save as draft" :
                 compose.channel === "slack" ? "# Slack not connected — will save locally" :
                 "📝 Internal note — visible to Madecraft team only"}
              </span>
              <button
                onClick={handleSend}
                disabled={!compose.body.trim()}
                style={{
                  background: compose.body.trim() ? "var(--accent-coral)" : "var(--border)",
                  color: compose.body.trim() ? "#fff" : "var(--text-muted)",
                  border: "none", borderRadius: "var(--radius-btn)",
                  padding: "9px 24px", fontSize: 13, fontWeight: 600,
                  cursor: compose.body.trim() ? "pointer" : "default",
                  fontFamily: "var(--font-inter), sans-serif",
                  transition: "background 0.15s",
                }}
              >
                {compose.channel === "email" ? "Send Email" : compose.channel === "slack" ? "Post to Slack" : "Save Note"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
          <p>Select an author to view messages</p>
        </div>
      )}
    </div>
  );
}
