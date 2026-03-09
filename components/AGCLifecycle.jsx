"use client";

import { useState } from "react";

const FIGMA_URL = "https://www.figma.com/board/Hs1SVciHjwl0COs1VjQwK3/AGC-Author-Journey";
const FIGMA_EMBED = `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(FIGMA_URL)}`;

const phases = [
  {
    id: "recruiting",
    label: "1. Recruiting & Prospecting",
    color: "#3F80AE",
    icon: "🔍",
    steps: [
      { text: "Source author on LinkedIn, TikTok, YouTube, or referral", who: "Recruiter / Producer", type: "manual" },
      { text: "Send personalized outreach message (DM, InMail, email)", who: "Recruiter / Producer", type: "manual" },
      { text: "Author fills out Monday.com application form", who: "Author", type: "manual" },
      { text: "Card auto-created in Monday → Prospective Authors board", who: "Monday.com", type: "automated" },
      { text: "Author ID auto-assigned & creation date populated", who: "Monday.com", type: "automated" },
      { text: "Producer reviews sample video & social profiles", who: "Producer", type: "manual" },
      { text: "Decision: Approve, Request 2nd Sample, or Reject", who: "Producer", type: "manual", decision: true },
      { text: "If rejected → send rejection email template from Monday", who: "Producer", type: "manual" },
      { text: "If 2nd sample needed → send request email; author resubmits", who: "Producer + Author", type: "manual" },
      { text: "Producer confirms Author ID is not a duplicate before advancing", who: "Producer", type: "manual" },
    ],
  },
  {
    id: "nda",
    label: "2. NDA & Publishing Agreement",
    color: "#2AADD9",
    icon: "📝",
    steps: [
      { text: "Producer moves card to \"Approved / NDA & PA Sent\"", who: "Producer", type: "manual" },
      { text: "Acquisition phase auto-updates to Approved", who: "Monday.com", type: "automated" },
      { text: "NDA & Publishing Agreement auto-sent via SignRequest", who: "SignRequest", type: "automated" },
      { text: "Author record auto-created in Monday → Authors board", who: "Monday.com", type: "automated" },
      { text: "Producer sends welcome email: \"Next Steps to Get Started\"", who: "Producer", type: "manual" },
      { text: "Author signs NDA & Publishing Agreement", who: "Author", type: "manual" },
      { text: "Signed PDFs auto-attached to card; card auto-moves to \"Signed\"", who: "Monday.com + SignRequest", type: "automated" },
      { text: "Producer moves card to Content Alignment", who: "Producer", type: "manual" },
    ],
  },
  {
    id: "alignment",
    label: "3. Content Alignment",
    color: "#89BD83",
    icon: "🎯",
    steps: [
      { text: "Producer aligns with author on 1–2 course topics (Taxonomy guidelines)", who: "Producer + Author", type: "manual" },
      { text: "If no aligned topics → move author to Waitlist until new taxonomy order", who: "Producer", type: "manual" },
      { text: "Producer requests author profile: headshot, bio, on-screen lower third", who: "Producer", type: "manual" },
      { text: "Author submits profile assets", who: "Author", type: "manual" },
      { text: "Producer sends course proposal email with topics & compensation", who: "Producer", type: "manual" },
      { text: "Author confirms course proposal", who: "Author", type: "manual" },
      { text: "Producer adds author info (bios, headshot) to Monday → Authors", who: "Producer", type: "manual" },
    ],
  },
  {
    id: "contracting",
    label: "4. Contracting",
    color: "#09A685",
    icon: "📄",
    steps: [
      { text: "Producer reserves Course ID(s) in Monday → Courses → AGC Course Contracts", who: "Producer", type: "manual" },
      { text: "Producer fills in all course metadata (title, target month, amount, etc.)", who: "Producer", type: "manual" },
      { text: "Producer moves card to \"Contracts Sent\"", who: "Producer", type: "manual" },
      { text: "SOW auto-created and sent to author via SignRequest", who: "Monday.com + SignRequest", type: "automated" },
      { text: "\"SOW\" appears in SR column; Producer gets confirmation email", who: "Monday.com", type: "automated" },
      { text: "Producer sends \"Contracts Coming Your Way\" email to author", who: "Producer", type: "manual" },
      { text: "Author signs SOW contract(s)", who: "Author", type: "manual" },
      { text: "Contract Signed Date auto-populated; card auto-moves to \"Contracts Signed\"", who: "Monday.com + SignRequest", type: "automated" },
      { text: "PDF copy of signed SOW auto-attached to card", who: "Monday.com", type: "automated" },
      { text: "Producer receives confirmation email that contracts are signed", who: "Monday.com", type: "automated" },
    ],
  },
  {
    id: "preproduction",
    label: "5. Pre-Production",
    color: "#EDD062",
    icon: "🎬",
    steps: [
      { text: "Producer moves card to \"In Production\" and clicks \"Begin Production\"", who: "Producer", type: "manual" },
      { text: "Acquisition status auto-updates to \"In Production\"; course enters AGC Kanban", who: "Monday.com", type: "automated" },
      { text: "Producer sends production kickoff email (training videos, outline, checklist)", who: "Producer", type: "manual" },
      { text: "Producer prepares Google Drive course folder & shares with author", who: "Producer", type: "manual" },
      { text: "Producer adds course outline link to Monday Kanban card", who: "Producer", type: "manual" },
      { text: "Author reviews outline and finalizes bullet points for each lesson", who: "Author", type: "manual" },
      { text: "Author records & submits rehearsal video", who: "Author", type: "manual" },
      { text: "Producer reviews rehearsal: tech setup, framing, lighting, audio", who: "Producer", type: "manual" },
      { text: "Producer sends \"You're Ready to Record!\" email", who: "Producer", type: "manual" },
      { text: "Producer moves card from Recording Prep → Recording", who: "Producer", type: "manual" },
    ],
  },
  {
    id: "recording",
    label: "6. Recording & Footage Handoff",
    color: "#DE7424",
    icon: "📹",
    steps: [
      { text: "Author records all course videos at home (vertical, 4K/1080p, 60s+ per lesson)", who: "Author", type: "manual" },
      { text: "Author uploads final videos to shared Google Drive folder", who: "Author", type: "manual" },
      { text: "Producer reviews videos against acceptance criteria (video, audio, content, performance)", who: "Producer", type: "manual" },
      { text: "If re-records needed → Producer requests revisions; author re-records", who: "Producer + Author", type: "manual" },
      { text: "Producer downloads footage & uploads to LucidLink → AGC Footage Drop", who: "Producer", type: "manual" },
      { text: "Producer pastes footage link into Monday Kanban card", who: "Producer", type: "manual" },
      { text: "Producer uploads author headshot to Monday card", who: "Producer", type: "manual" },
      { text: "Producer sends \"Your Videos Are Approved!\" email", who: "Producer", type: "manual" },
      { text: "Producer moves card from Recording → Ready for Editing", who: "Producer", type: "manual" },
      { text: "Payment invoice auto-generated; payment status → \"Requested\"", who: "Monday.com", type: "automated" },
      { text: "\"Ready for Editing\" notification auto-sent to Production Team", who: "Monday.com", type: "automated" },
    ],
  },
  {
    id: "editing",
    label: "7. Editing (Post-Production)",
    color: "#A9260F",
    icon: "✂️",
    steps: [
      { text: "Mgr. of Post-Production or Senior Editor assigns an editor", who: "Post-Production Mgr", type: "manual" },
      { text: "Editor reviews footage against acceptance criteria", who: "Editor", type: "manual" },
      { text: "Editor creates course folder from AGC template in LucidLink", who: "Editor", type: "manual" },
      { text: "Editor moves footage from Footage Drop into course folder", who: "Editor", type: "manual" },
      { text: "Editor performs narrative edit, audio/color processing, caption overlays", who: "Editor", type: "manual" },
      { text: "Editor exports draft & uploads to Frame.io → For Review", who: "Editor", type: "manual" },
      { text: "Editor creates Frame.io review link and adds QA link to Monday card", who: "Editor", type: "manual" },
      { text: "Editor adds course duration to QA Roadmap spreadsheet", who: "Editor", type: "manual" },
      { text: "Editor moves card from Editing → QA + Transcripts", who: "Editor", type: "manual" },
    ],
  },
  {
    id: "qa",
    label: "8. QA + Transcripts",
    color: "#CDAABA",
    icon: "🔎",
    steps: [
      { text: "Director of Content Production reviews videos in Frame.io (color, audio, graphics, bugs)", who: "Director of Content Prod.", type: "manual" },
      { text: "Transcript QA editor reviews & revises transcripts", who: "QA Editor", type: "manual" },
      { text: "QA reviewer marks QA status \"Done\" in Monday", who: "Director / QA Reviewer", type: "manual" },
      { text: "Transcript editor marks Transcript status \"Done\" in Monday", who: "QA Editor", type: "manual" },
      { text: "Card auto-moves to Revisions when both QA & Transcripts are Done", who: "Monday.com", type: "automated" },
    ],
  },
  {
    id: "revisions",
    label: "9. Revisions & Final Export",
    color: "#634057",
    icon: "🔧",
    steps: [
      { text: "Editor addresses all Frame.io feedback and corrects bugs", who: "Editor", type: "manual" },
      { text: "Editor exports final _NT .mp4 files and .srt caption files", who: "Editor", type: "manual" },
      { text: "Editor saves finals to LucidLink → Course Folder → Delivery", who: "Editor", type: "manual" },
      { text: "Editor uploads final files to Frame.io → Final folder; adds review link to Monday", who: "Editor", type: "manual" },
      { text: "Editor creates Google Sheet transcript from template", who: "Editor", type: "manual" },
      { text: "Editor verifies lesson count and final duration", who: "Editor", type: "manual" },
      { text: "Editor updates AGC Kanban → Editing Complete & Production Status → Done (AGC)", who: "Editor", type: "manual" },
    ],
  },
  {
    id: "regression",
    label: "10. Regression Testing & DTOC",
    color: "#3D3D7C",
    icon: "✅",
    steps: [
      { text: "Producer performs regression testing: compares V2 edits against V1 QA comments in Frame.io", who: "Producer", type: "manual" },
      { text: "If errors found → tag editor + Mike in Monday; editor re-exports; producer re-tests", who: "Producer + Editor", type: "manual" },
      { text: "Producer opens DTOC link; confirms SRT data in column J", who: "Producer", type: "manual" },
      { text: "Producer runs Auto DTOC tool → generates chapter/lesson names & learning goals", who: "Auto DTOC Script", type: "semi-automated" },
      { text: "Producer QAs all generated chapter names, lesson names, and learning goals", who: "Producer", type: "manual" },
      { text: "Producer runs \"Generate Course Metadata\" → descriptions, audience, tags, subjects", who: "Auto DTOC Script", type: "semi-automated" },
      { text: "Producer QAs all metadata fields (descriptions, personas, keywords, subjects, thumbnail)", who: "Producer", type: "manual" },
      { text: "Producer runs \"Replace Variables\" via TOC-to-JSON extension", who: "TOC-to-JSON Extension", type: "semi-automated" },
      { text: "Producer runs spell check on all DTOC pages", who: "Producer", type: "manual" },
      { text: "Producer marks Production Status \"Done (AGC)\" in Monday", who: "Producer", type: "manual" },
    ],
  },
  {
    id: "delivery",
    label: "11. Delivery & Payment",
    color: "#09A685",
    icon: "🚀",
    steps: [
      { text: "Delivery request auto-sent when Production Status marked \"Done (AGC)\"", who: "Monday.com", type: "automated" },
      { text: "Course uploaded to S3 & archived on SAN", who: "Delivery / Ops", type: "manual" },
      { text: "Course delivered to partner platforms (LinkedIn Learning, Pluralsight, Cornerstone, etc.)", who: "Delivery / Ops", type: "manual" },
      { text: "Producer confirms total contract amount & downloads payment invoice from Monday", who: "Producer", type: "manual" },
      { text: "Producer edits invoice PDF with payment-due amount, re-uploads to Monday", who: "Producer", type: "manual" },
      { text: "Producer emails invoice to Finance (Marisa) for payment processing", who: "Producer", type: "manual" },
      { text: "Finance processes payment to author (target: within 2 weeks of recording)", who: "Finance (Marisa)", type: "manual" },
    ],
  },
];

const typeConfig = {
  manual:           { label: "Manual",    bg: "rgba(169,38,15,0.08)",  border: "rgba(169,38,15,0.25)",  text: "#A9260F" },
  automated:        { label: "Automated", bg: "rgba(9,166,133,0.08)",  border: "rgba(9,166,133,0.25)",  text: "#09A685" },
  "semi-automated": { label: "Semi-Auto", bg: "rgba(154,120,0,0.08)",  border: "rgba(154,120,0,0.25)",  text: "#9A7800" },
};

function getRoleCategory(who) {
  if (who.includes("Author") && !who.includes("Producer")) return "author";
  if (who.includes("Monday") || who.includes("SignRequest") || who.includes("DTOC") || who.includes("JSON")) return "system";
  return "madecraft";
}

export default function AGCLifecycle() {
  const [view, setView] = useState("flowchart");
  const [expandedPhase, setExpandedPhase] = useState(null);
  const [filter, setFilter] = useState("all");

  const totalSteps    = phases.reduce((s, p) => s + p.steps.length, 0);
  const manualSteps   = phases.reduce((s, p) => s + p.steps.filter(x => x.type === "manual").length, 0);
  const autoSteps     = phases.reduce((s, p) => s + p.steps.filter(x => x.type === "automated").length, 0);
  const semiSteps     = phases.reduce((s, p) => s + p.steps.filter(x => x.type === "semi-automated").length, 0);
  const authorSteps   = phases.reduce((s, p) => s + p.steps.filter(x => getRoleCategory(x.who) === "author").length, 0);
  const mcSteps       = phases.reduce((s, p) => s + p.steps.filter(x => getRoleCategory(x.who) === "madecraft").length, 0);

  const toggle = (id) => setExpandedPhase(expandedPhase === id ? null : id);

  const visible = phases.map(p => ({
    ...p,
    steps: filter === "all"       ? p.steps :
           filter === "manual"    ? p.steps.filter(s => s.type === "manual") :
           filter === "automated" ? p.steps.filter(s => s.type !== "manual") :
           filter === "author"    ? p.steps.filter(s => getRoleCategory(s.who) === "author") :
                                    p.steps.filter(s => getRoleCategory(s.who) === "madecraft"),
  })).filter(p => p.steps.length > 0);

  const statItems = [
    { label: "Total Steps", value: totalSteps,   color: "var(--text-primary)" },
    { label: "Manual",      value: manualSteps,  color: "#A9260F", pct: Math.round(manualSteps / totalSteps * 100) },
    { label: "Automated",   value: autoSteps,    color: "#09A685", pct: Math.round(autoSteps   / totalSteps * 100) },
    { label: "Semi-Auto",   value: semiSteps,    color: "#9A7800", pct: Math.round(semiSteps   / totalSteps * 100) },
  ];

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100%", display: "flex", flexDirection: "column" }}>

      {/* View toggle */}
      <div style={{
        background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)",
        padding: "0 40px", display: "flex", gap: 0, alignItems: "center",
      }}>
        {[
          { id: "flowchart", label: "⬡ Flowchart" },
          { id: "detail",    label: "☰ Step-by-Step" },
        ].map((v) => (
          <button key={v.id} onClick={() => setView(v.id)} style={{
            padding: "12px 20px", fontSize: 12, fontWeight: 600,
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "var(--font-inter), sans-serif",
            borderBottom: view === v.id ? "2px solid var(--accent-coral)" : "2px solid transparent",
            color: view === v.id ? "var(--accent-coral)" : "var(--text-muted)",
            transition: "color 0.15s",
          }}>{v.label}</button>
        ))}
        {view === "flowchart" && (
          <a
            href={FIGMA_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              marginLeft: "auto", fontSize: 11, color: "var(--text-muted)",
              textDecoration: "none", fontWeight: 500, padding: "4px 10px",
              borderRadius: 6, border: "1px solid var(--border)",
              display: "flex", alignItems: "center", gap: 5,
            }}
          >
            ↗ Open in Figma
          </a>
        )}
      </div>

      {/* Flowchart view */}
      {view === "flowchart" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "calc(100vh - 160px)" }}>
          <iframe
            src={FIGMA_EMBED}
            allowFullScreen
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              background: "var(--bg-primary)",
            }}
            title="AGC Author Journey Flowchart"
          />
        </div>
      )}

      {/* Detail view */}
      {view === "detail" && (
      <div style={{ flex: 1 }}>

      {/* Stats row */}
      <div style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)", padding: "20px 40px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 28, alignItems: "center" }}>
          {statItems.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontFamily: "monospace", fontSize: 30, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</span>
              <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>
                {s.label}{s.pct !== undefined ? ` (${s.pct}%)` : ""}
              </span>
            </div>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontFamily: "monospace", fontSize: 24, fontWeight: 700, color: "var(--accent-blue)" }}>{authorSteps}</span>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Author Steps</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontFamily: "monospace", fontSize: 24, fontWeight: 700, color: "var(--accent-plum)" }}>{mcSteps}</span>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Madecraft Steps</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter chips */}
      <div style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)", padding: "12px 40px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginRight: 4 }}>Filter:</span>
          {[
            { key: "all",       label: "All Steps" },
            { key: "manual",    label: "Manual Only" },
            { key: "automated", label: "Automated / Semi-Auto" },
            { key: "author",    label: "Author Steps" },
            { key: "madecraft", label: "Madecraft Staff" },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              padding: "6px 14px",
              borderRadius: 20,
              border: "1px solid",
              borderColor: filter === f.key ? "var(--accent-coral)" : "var(--border)",
              background: filter === f.key ? "var(--accent-coral)" : "transparent",
              color: filter === f.key ? "#fff" : "var(--text-muted)",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "var(--font-inter), sans-serif",
            }}>{f.label}</button>
          ))}
        </div>
      </div>

      {/* Phase list */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 40px 64px", display: "flex", flexDirection: "column", gap: 2 }}>
        {visible.map((phase, pi) => {
          const isOpen = expandedPhase === phase.id;
          const autoPct = Math.round(phase.steps.filter(s => s.type !== "manual").length / phase.steps.length * 100);

          return (
            <div key={phase.id}>
              {pi > 0 && (
                <div style={{ paddingLeft: 28, height: 16, display: "flex" }}>
                  <div style={{ width: 2, height: "100%", background: "var(--border)", borderRadius: 1 }} />
                </div>
              )}

              <button
                onClick={() => toggle(phase.id)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 14,
                  padding: "16px 20px", textAlign: "left",
                  background: isOpen ? "var(--bg-surface)" : "var(--bg-card)",
                  border: `1px solid ${isOpen ? phase.color + "55" : "var(--border)"}`,
                  borderRadius: isOpen ? "10px 10px 0 0" : 10,
                  cursor: "pointer", fontFamily: "var(--font-inter), sans-serif",
                  color: "var(--text-primary)",
                  transition: "border-color 0.15s",
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                  background: `${phase.color}18`,
                  border: `1px solid ${phase.color}33`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20,
                }}>{phase.icon}</div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)", letterSpacing: "-0.1px" }}>{phase.label}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>
                    {phase.steps.length} steps &middot; {phase.steps.filter(s => s.type === "manual").length} manual &middot; {phase.steps.filter(s => s.type !== "manual").length} auto/semi
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <div style={{ width: 96, height: 4, borderRadius: 2, background: "var(--border)", overflow: "hidden" }}>
                    <div style={{ width: `${autoPct}%`, height: "100%", background: "var(--accent-teal)", borderRadius: 2 }} />
                  </div>
                  <span style={{ fontFamily: "monospace", fontSize: 11, color: "var(--text-muted)", width: 32, textAlign: "right" }}>{autoPct}%</span>
                </div>

                <span style={{ color: "var(--text-muted)", fontSize: 16, flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
              </button>

              {isOpen && (
                <div style={{
                  background: "var(--bg-card)",
                  border: `1px solid ${phase.color}55`,
                  borderTop: "none",
                  borderRadius: "0 0 10px 10px",
                }}>
                  {phase.steps.map((step, si) => {
                    const cfg = typeConfig[step.type];
                    const role = getRoleCategory(step.who);
                    return (
                      <div key={si} style={{
                        display: "flex", gap: 14, padding: "12px 20px",
                        borderBottom: si < phase.steps.length - 1 ? "1px solid var(--border)" : "none",
                      }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4, flexShrink: 0, width: 16 }}>
                          <div style={{
                            width: step.decision ? 12 : 9,
                            height: step.decision ? 12 : 9,
                            borderRadius: step.decision ? 2 : "50%",
                            background: phase.color,
                            transform: step.decision ? "rotate(45deg)" : "none",
                            boxShadow: `0 0 0 3px ${phase.color}22`,
                            flexShrink: 0,
                          }} />
                          {si < phase.steps.length - 1 && (
                            <div style={{ width: 1.5, flex: 1, marginTop: 4, background: "var(--border)", borderRadius: 1 }} />
                          )}
                        </div>

                        <div style={{ flex: 1, minWidth: 0, paddingBottom: 2 }}>
                          <p style={{ fontSize: 13, color: "var(--text-body)", lineHeight: 1.55, margin: 0 }}>{step.text}</p>
                          <div style={{ display: "flex", gap: 6, marginTop: 7, flexWrap: "wrap" }}>
                            <span style={{
                              fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
                              textTransform: "uppercase", padding: "2px 8px", borderRadius: 4,
                              background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.text,
                            }}>{cfg.label}</span>
                            <span style={{
                              fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 4,
                              background: role === "author" ? "rgba(26,143,184,0.08)" : role === "system" ? "rgba(9,166,133,0.08)" : "rgba(99,64,87,0.08)",
                              color: role === "author" ? "var(--accent-blue)" : role === "system" ? "var(--accent-teal)" : "var(--accent-plum)",
                              border: `1px solid ${role === "author" ? "rgba(26,143,184,0.25)" : role === "system" ? "rgba(9,166,133,0.25)" : "rgba(99,64,87,0.25)"}`,
                            }}>{step.who}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Legend */}
        <div style={{ marginTop: 48, padding: 24, borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-card)" }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 16 }}>Legend</p>
          <div style={{ display: "flex", gap: 36, flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <p style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600, marginBottom: 4 }}>Step Type</p>
              {Object.entries(typeConfig).map(([, cfg]) => (
                <div key={cfg.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 9, height: 9, borderRadius: "50%", background: cfg.text }} />
                  <span style={{ fontSize: 12, color: "var(--text-body)" }}>{cfg.label}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <p style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600, marginBottom: 4 }}>Responsible Party</p>
              {[
                { color: "var(--accent-plum)", label: "Madecraft Staff" },
                { color: "var(--accent-blue)", label: "Author (External)" },
                { color: "var(--accent-teal)", label: "System / Automation" },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 9, height: 9, borderRadius: 2, background: color }} />
                  <span style={{ fontSize: 12, color: "var(--text-body)" }}>{label}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <p style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600, marginBottom: 4 }}>Symbols</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--text-muted)" }} />
                <span style={{ fontSize: 12, color: "var(--text-body)" }}>Standard step</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 9, height: 9, borderRadius: 2, transform: "rotate(45deg)", background: "var(--text-muted)" }} />
                <span style={{ fontSize: 12, color: "var(--text-body)" }}>Decision point</span>
              </div>
            </div>
          </div>
        </div>

        <p style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 16, lineHeight: 1.7, fontFamily: "monospace" }}>
          Sources: Tiger Team AGC Content Production Playbook · AGC + Monday.com Workflow (Confluence) · Post Production (Confluence) · Regression Testing & DTOCs (Confluence) · AGC Recruiter Training · Sending AGC Invoice for Payment (Confluence)
        </p>
      </div>

      </div>
      )}
    </div>
  );
}
