"use client";

import { useState } from "react";

const phases = [
  {
    id: "recruiting",
    label: "1. Prospecting",
    color: "#3F80AE",
    icon: "🔍",
    monday: "New Recruits (All Content) · Prospective Experts",
    steps: [
      { text: "Expert submits application form", who: "Expert", type: "manual" },
      { text: "Manager assigns Producer to Prospect", who: "Manager", type: "manual" },
      { text: "Producer reviews teaching sample", who: "Producer", type: "manual" },
      { text: "Greenlight team reviews sample", who: "Greenlight Team", type: "manual" },
      { text: "Decision: Approved / Not Approved / Request 2nd Sample", who: "Producer + Greenlight", type: "manual", decision: true },
      { text: "If Not Approved → Expert is not a good fit → Offboarding/Sunset", who: "Producer", type: "manual", exit: true },
      { text: "If 2nd Sample needed → Producer sends request; Expert resubmits", who: "Producer + Expert", type: "manual" },
      { text: "Signal Flare team reviews 2nd sample", who: "Signal Flare", type: "manual" },
      { text: "Signal Flare Approved → advance to NDA", who: "Signal Flare", type: "manual", decision: true },
      { text: "If Signal Flare Not Approved → Offboarding/Sunset", who: "Producer", type: "manual", exit: true },
    ],
  },
  {
    id: "nda_pa",
    label: "2. NDA & Publishing Agreement",
    color: "#2AADD9",
    icon: "📝",
    monday: "New AGC Recruit",
    steps: [
      { text: "Producer moves card to \"Approved / NDA & PA Sent\"", who: "Producer", type: "manual" },
      { text: "NDA & Publishing Agreement sent to Expert via SignRequest", who: "SignRequest", type: "automated" },
      { text: "Expert signs NDA & Publishing Agreement", who: "Expert", type: "manual" },
      { text: "Signed PDFs auto-attached; card moves to NDA & PA Signed", who: "Monday.com + SignRequest", type: "automated" },
      { text: "If Expert becomes unresponsive → Offboarding/Sunset", who: "Producer", type: "manual", exit: true },
    ],
  },
  {
    id: "content_alignment",
    label: "3. Content Alignment",
    color: "#09A685",
    icon: "🎯",
    monday: "New AGC Recruit",
    steps: [
      { text: "Producer meets with Expert to confirm course selection, compensation, and recording date", who: "Producer + Expert", type: "manual" },
      { text: "Decision: Do courses align with Expert's expertise?", who: "Producer", type: "manual", decision: true },
      { text: "If no courses align → move Expert to Waitlisted for Content Alignment", who: "Producer", type: "manual", exit: true },
      { text: "Expert agrees to terms (course, comp, dates)", who: "Expert", type: "manual" },
      { text: "Advance to In Courses / Course Contracts", who: "Producer", type: "manual" },
    ],
  },
  {
    id: "waitlisted",
    label: "Waitlisted for Content Alignment",
    color: "#888888",
    icon: "⏸",
    monday: "New AGC Recruit",
    steps: [
      { text: "No current courses align with Expert's area of expertise", who: "Producer", type: "manual" },
      { text: "Expert placed on hold until new taxonomy order is available", who: "Producer", type: "manual" },
      { text: "Producer monitors taxonomy updates; re-engages Expert when a fit appears", who: "Producer", type: "manual" },
      { text: "If Expert becomes unresponsive during wait → Offboarding/Sunset", who: "Producer", type: "manual", exit: true },
    ],
  },
  {
    id: "contracting",
    label: "4. Course Contracts",
    color: "#89BD83",
    icon: "📄",
    monday: "Course Contracts · All AGC Courses",
    steps: [
      { text: "Manager assigns Producer to Prospect (if not already assigned)", who: "Manager", type: "manual" },
      { text: "Producer secures courses and reserves Course ID(s) in Monday → Course Contracts", who: "Producer", type: "manual" },
      { text: "Producer meets with Expert to finalize course details", who: "Producer + Expert", type: "manual" },
      { text: "Producer sends SOW contract(s) via SignRequest", who: "Producer + SignRequest", type: "automated" },
      { text: "Expert reviews SOW(s)", who: "Expert", type: "manual" },
      { text: "Decision: Expert signs / Expert requests changes / Expert becomes unresponsive", who: "Expert", type: "manual", decision: true },
      { text: "If Expert requests contract changes → Producer negotiates; resubmits", who: "Producer + Expert", type: "manual" },
      { text: "If Expert becomes unresponsive → Offboarding/Sunset", who: "Producer", type: "manual", exit: true },
      { text: "Expert signs SOW(s) → Contracts Signed", who: "Expert", type: "manual" },
      { text: "Contract Signed Date auto-populated; card moves to Contracts Signed", who: "Monday.com + SignRequest", type: "automated" },
      { text: "If Author drops out → Offboarding/Sunset", who: "Producer", type: "manual", exit: true },
    ],
  },
  {
    id: "pre_production",
    label: "5. Recording Prep (In Production)",
    color: "#EDD062",
    icon: "🎬",
    monday: "AGC Pre-Production · All AGC Courses",
    steps: [
      { text: "Producer enters course into production in Monday Kanban", who: "Producer", type: "manual" },
      { text: "Producer prepares course materials and Google Drive course folder", who: "Producer", type: "manual" },
      { text: "Producer sends pre-production kickoff email to Expert", who: "Producer", type: "manual" },
      { text: "Producer reviews course outlines with Expert", who: "Producer + Expert", type: "manual" },
      { text: "Expert records and submits rehearsal video", who: "Expert", type: "manual" },
      { text: "Producer reviews rehearsal video (tech setup, framing, lighting, audio)", who: "Producer", type: "manual" },
      { text: "Producer submits rehearsal to Signal Flare for review", who: "Producer", type: "manual" },
      { text: "Signal Flare team reviews rehearsal sample", who: "Signal Flare", type: "manual" },
      { text: "Decision: Signal Flare Approved / Not Approved", who: "Signal Flare", type: "manual", decision: true },
      { text: "If Not Approved → Offboarding/Sunset", who: "Producer", type: "manual", exit: true },
      { text: "Signal Flare Approved → Producer sends \"You're Ready to Record!\" email", who: "Producer", type: "manual" },
      { text: "If Expert becomes unresponsive → Offboarding/Sunset", who: "Producer", type: "manual", exit: true },
    ],
  },
  {
    id: "recording",
    label: "6. Recording",
    color: "#DE7424",
    icon: "📹",
    monday: "AGC Pre-Production · All AGC Courses",
    steps: [
      { text: "Expert records all course videos (vertical, 4K/1080p) and uploads to Google Drive", who: "Expert", type: "manual" },
      { text: "Producer reviews submitted videos against acceptance criteria", who: "Producer", type: "manual" },
      { text: "Decision: Videos approved / Re-records needed", who: "Producer", type: "manual", decision: true },
      { text: "If re-records needed → Producer requests revisions; Expert re-records and resubmits", who: "Producer + Expert", type: "manual" },
      { text: "Producer approves videos", who: "Producer", type: "manual" },
      { text: "Payment Requested — payment invoice auto-generated in Monday", who: "Monday.com", type: "automated" },
      { text: "Final Frame.io review requested", who: "Producer", type: "manual" },
      { text: "Card moves to Ready for Editing", who: "Producer", type: "manual" },
      { text: "If Author drops out → Offboarding/Sunset", who: "Producer", type: "manual", exit: true },
    ],
  },
  {
    id: "editing",
    label: "7. Editing",
    color: "#A9260F",
    icon: "✂️",
    monday: "All AGC Courses",
    steps: [
      { text: "Manager assigns Editor to course", who: "Manager", type: "manual" },
      { text: "Editor reviews footage", who: "Editor", type: "manual" },
      { text: "Decision: Footage approved / Not approved", who: "Editor", type: "manual", decision: true },
      { text: "If footage NOT approved → flagged for Producer review / re-records", who: "Editor + Producer", type: "manual", exit: true },
      { text: "Editor performs narrative cuts and storyboard/GFX export", who: "Editor", type: "manual" },
      { text: "Editor performs color grading and audio processing", who: "Editor", type: "manual" },
      { text: "Editor exports draft and uploads to Frame.io for review", who: "Editor", type: "manual" },
      { text: "Editing Complete — card moves to QA & Transcripts", who: "Editor", type: "manual" },
    ],
  },
  {
    id: "qa_transcripts",
    label: "8. QA + Transcripts",
    color: "#CDAABA",
    icon: "🔎",
    monday: "All AGC Courses",
    steps: [
      { text: "Producer QAs footage in Frame.io (color, audio, graphics, pacing)", who: "Producer", type: "manual" },
      { text: "Transcripts are audited and revised by QA editor", who: "QA Editor", type: "manual" },
      { text: "QA and Transcript statuses both marked Done in Monday", who: "Producer + QA Editor", type: "manual" },
      { text: "Card auto-moves to Revisions & Finalization", who: "Monday.com", type: "automated" },
    ],
  },
  {
    id: "revisions",
    label: "9. Revisions & Finalization",
    color: "#634057",
    icon: "🔧",
    monday: "All AGC Courses",
    steps: [
      { text: "Editor addresses all QA feedback from Frame.io", who: "Editor", type: "manual" },
      { text: "Editor exports final .mp4 and .srt caption files", who: "Editor", type: "manual" },
      { text: "Editor saves finals to LucidLink → Course Folder → Delivery", who: "Editor", type: "manual" },
      { text: "Course is finalized — Editing Complete status updated in Monday", who: "Editor", type: "manual" },
    ],
  },
  {
    id: "regression_testing",
    label: "10. Done (AGC) — Regression & DTOC",
    color: "#3D3D7C",
    icon: "✅",
    monday: "All AGC Courses",
    steps: [
      { text: "Producer performs regression testing: compares V2 edits vs. V1 QA comments in Frame.io", who: "Producer", type: "manual" },
      { text: "If errors found → Producer tags Editor in Monday; Editor re-exports; Producer re-tests", who: "Producer + Editor", type: "manual" },
      { text: "Producer opens DTOC link and confirms SRT data", who: "Producer", type: "manual" },
      { text: "Producer runs Auto DTOC tool → generates chapter/lesson names and learning goals", who: "Auto DTOC Script", type: "semi-automated" },
      { text: "Producer QAs all generated DTOC fields (names, goals, metadata)", who: "Producer", type: "manual" },
      { text: "Producer runs \"Generate Course Metadata\" → descriptions, audience, tags, subjects", who: "Auto DTOC Script", type: "semi-automated" },
      { text: "Producer runs \"Replace Variables\" via TOC-to-JSON extension", who: "TOC-to-JSON Extension", type: "semi-automated" },
      { text: "Producer runs spell check on all DTOC pages", who: "Producer", type: "manual" },
      { text: "Producer marks Production Status → \"Done (AGC)\" in Monday", who: "Producer", type: "manual" },
    ],
  },
  {
    id: "delivery_payment",
    label: "11. Delivery & Payment",
    color: "#09A685",
    icon: "🚀",
    monday: "Delivery · All AGC Courses",
    steps: [
      { text: "Delivery request auto-sent when Production Status marked \"Done (AGC)\"", who: "Monday.com", type: "automated" },
      { text: "Course uploaded to S3 and archived on SAN", who: "Delivery / Ops", type: "manual" },
      { text: "Course delivered to partner platforms (LinkedIn Learning, Pluralsight, Cornerstone, etc.)", who: "Delivery / Ops", type: "manual" },
      { text: "Producer confirms total contract amount and downloads payment invoice from Monday", who: "Producer", type: "manual" },
      { text: "Producer edits invoice PDF and re-uploads to Monday", who: "Producer", type: "manual" },
      { text: "Producer emails invoice to Finance for payment processing", who: "Producer", type: "manual" },
      { text: "Finance processes payment to Expert", who: "Finance", type: "manual" },
    ],
  },
  {
    id: "offboarding",
    label: "Offboarding / Sunset",
    color: "#444444",
    icon: "🌅",
    monday: "N/A",
    steps: [
      { text: "Expert becomes unresponsive at any stage → Producer initiates offboarding", who: "Producer", type: "manual" },
      { text: "Expert is not approved after sample review → exits process", who: "Producer + Greenlight", type: "manual" },
      { text: "Expert agrees to terms then drops out → card moved to Sunset", who: "Producer", type: "manual" },
      { text: "Author drops out during production → course cancelled or reassigned", who: "Producer + Manager", type: "manual" },
      { text: "Course Cancellation Process initiated if applicable", who: "Producer + Manager", type: "manual" },
      { text: "Card archived in Monday; Expert record updated", who: "Producer", type: "manual" },
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

export default function AGCLifecycle({ authors = [], stages = [] }) {
  const [expandedPhase, setExpandedPhase] = useState(null);

  const authorCountForPhase = (phaseId) =>
    authors.filter((a) => a.stage === phaseId).length;

  const totalSteps    = phases.reduce((s, p) => s + p.steps.length, 0);
  const manualSteps   = phases.reduce((s, p) => s + p.steps.filter(x => x.type === "manual").length, 0);
  const autoSteps     = phases.reduce((s, p) => s + p.steps.filter(x => x.type === "automated").length, 0);
  const semiSteps     = phases.reduce((s, p) => s + p.steps.filter(x => x.type === "semi-automated").length, 0);
  const authorSteps   = phases.reduce((s, p) => s + p.steps.filter(x => getRoleCategory(x.who) === "author").length, 0);
  const mcSteps       = phases.reduce((s, p) => s + p.steps.filter(x => getRoleCategory(x.who) === "madecraft").length, 0);

  const toggle = (id) => setExpandedPhase(expandedPhase === id ? null : id);

  const statItems = [
    { label: "Total Steps", value: totalSteps,   color: "var(--text-primary)" },
    { label: "Manual",      value: manualSteps,  color: "#A9260F", pct: Math.round(manualSteps / totalSteps * 100) },
    { label: "Automated",   value: autoSteps,    color: "#09A685", pct: Math.round(autoSteps   / totalSteps * 100) },
    { label: "Semi-Auto",   value: semiSteps,    color: "#9A7800", pct: Math.round(semiSteps   / totalSteps * 100) },
  ];

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100%" }}>

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


      {/* Phase list */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 40px 64px", display: "flex", flexDirection: "column", gap: 2 }}>
        {phases.map((phase, pi) => {
          const isOpen = expandedPhase === phase.id;
          const autoPct = Math.round(phase.steps.filter(s => s.type !== "manual").length / phase.steps.length * 100);
          const authorCount = authorCountForPhase(phase.id);

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
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                    <span>{phase.steps.length} steps &middot; {phase.steps.filter(s => s.type === "manual").length} manual &middot; {phase.steps.filter(s => s.type !== "manual").length} auto/semi</span>
                    {phase.monday && phase.monday !== "N/A" && (
                      <span style={{ color: "var(--text-muted)", opacity: 0.6 }}>Monday: {phase.monday}</span>
                    )}
                  </div>
                </div>

                {/* Author count badge */}
                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  padding: "4px 12px", borderRadius: 8, flexShrink: 0,
                  background: authorCount > 0 ? `${phase.color}18` : "var(--bg-surface)",
                  border: `1px solid ${authorCount > 0 ? phase.color + "40" : "var(--border)"}`,
                  minWidth: 52,
                }}>
                  <span style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 700, color: authorCount > 0 ? phase.color : "var(--text-muted)", lineHeight: 1 }}>
                    {authorCount}
                  </span>
                  <span style={{ fontSize: 9, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>
                    {authorCount === 1 ? "author" : "authors"}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <div style={{ width: 80, height: 4, borderRadius: 2, background: "var(--border)", overflow: "hidden" }}>
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
                    const isExit = !!step.exit;
                    return (
                      <div key={si} style={{
                        display: "flex", gap: 14, padding: "12px 20px",
                        borderBottom: si < phase.steps.length - 1 ? "1px solid var(--border)" : "none",
                        background: isExit ? "rgba(169,38,15,0.04)" : "transparent",
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
                            {isExit && (
                              <span style={{
                                fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4,
                                background: "rgba(169,38,15,0.1)", border: "1px solid rgba(169,38,15,0.3)",
                                color: "#A9260F", letterSpacing: "0.04em",
                              }}>EXIT PATH</span>
                            )}
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
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 9, height: 9, borderRadius: 2, background: "#A9260F" }} />
                <span style={{ fontSize: 12, color: "var(--text-body)" }}>Exit path (Offboarding/Sunset)</span>
              </div>
            </div>
          </div>
        </div>

        <p style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 16, lineHeight: 1.7, fontFamily: "monospace" }}>
          Sources: Tiger Team AGC Content Production Playbook · AGC + Monday.com Workflow (Confluence) · Post Production (Confluence) · Regression Testing & DTOCs (Confluence) · AGC Recruiter Training · Sending AGC Invoice for Payment (Confluence)
        </p>
      </div>
    </div>
  );
}
