"use client";

import { useState } from "react";

const phases = [
  {
    id: "recruiting",
    label: "1. Recruiting & Prospecting",
    color: "#3b5bdb",
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
    color: "#0077b6",
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
    color: "#2f9e44",
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
    color: "#4263eb",
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
    color: "#7048e8",
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
    color: "#c92a2a",
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
    color: "#d9480f",
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
    color: "#1864ab",
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
    color: "#e67700",
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
    color: "#5f3dc4",
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
    color: "#087f5b",
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
  manual:         { label: "Manual",     bg: "#fff0f3", border: "#ffc9d3", text: "#c92a2a" },
  automated:      { label: "Automated",  bg: "#ebfbee", border: "#8ce99a", text: "#2f9e44" },
  "semi-automated": { label: "Semi-Auto", bg: "#fff3bf", border: "#ffe066", text: "#e67700" },
};

function getRoleCategory(who) {
  if (who.includes("Author") && !who.includes("Producer")) return "author";
  if (who.includes("Monday") || who.includes("SignRequest") || who.includes("DTOC") || who.includes("JSON")) return "system";
  return "madecraft";
}

export default function AGCLifecycle() {
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

  return (
    <div className="bg-slate-50 min-h-full">

      {/* Stats row */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-6 items-center">
          {[
            { label: "Total Steps", value: totalSteps, color: "#1e293b" },
            { label: "Manual",      value: manualSteps, color: "#c92a2a", pct: Math.round(manualSteps / totalSteps * 100) },
            { label: "Automated",   value: autoSteps,   color: "#2f9e44", pct: Math.round(autoSteps   / totalSteps * 100) },
            { label: "Semi-Auto",   value: semiSteps,   color: "#e67700", pct: Math.round(semiSteps   / totalSteps * 100) },
          ].map((s, i) => (
            <div key={i} className="flex items-baseline gap-2">
              <span className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</span>
              <span className="text-xs text-slate-400 font-medium">
                {s.label}{s.pct !== undefined ? ` (${s.pct}%)` : ""}
              </span>
            </div>
          ))}
          <div className="ml-auto flex gap-6">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-blue-600">{authorSteps}</span>
              <span className="text-xs text-slate-400 font-medium">Author Steps</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-violet-600">{mcSteps}</span>
              <span className="text-xs text-slate-400 font-medium">Madecraft Steps</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter chips */}
      <div className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-2 items-center">
          <span className="text-xs text-slate-400 font-medium mr-2">Filter:</span>
          {[
            { key: "all",       label: "All Steps" },
            { key: "manual",    label: "Manual Only" },
            { key: "automated", label: "Automated / Semi-Auto" },
            { key: "author",    label: "Author Steps" },
            { key: "madecraft", label: "Madecraft Staff" },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                filter === f.key
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Phase list */}
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col gap-1">
        {visible.map((phase, pi) => {
          const isOpen = expandedPhase === phase.id;
          const autoPct = Math.round(phase.steps.filter(s => s.type !== "manual").length / phase.steps.length * 100);

          return (
            <div key={phase.id}>
              {pi > 0 && (
                <div className="flex pl-7 h-4">
                  <div className="w-0.5 h-full bg-slate-200 rounded" />
                </div>
              )}

              {/* Phase header button */}
              <button
                onClick={() => toggle(phase.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 text-left border transition-all ${
                  isOpen
                    ? "bg-white border-slate-300 rounded-t-xl shadow-sm"
                    : "bg-white border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center text-xl shrink-0 border"
                  style={{ background: `${phase.color}14`, borderColor: `${phase.color}30` }}
                >
                  {phase.icon}
                </div>

                {/* Label + sub-info */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-900 text-sm leading-snug">{phase.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {phase.steps.length} steps &middot; {phase.steps.filter(s => s.type === "manual").length} manual &middot; {phase.steps.filter(s => s.type !== "manual").length} auto/semi
                  </div>
                </div>

                {/* Auto % bar */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-24 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-green-500" style={{ width: `${autoPct}%` }} />
                  </div>
                  <span className="text-xs text-slate-400 w-8 text-right">{autoPct}%</span>
                </div>

                <span className={`text-slate-400 text-base shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>▾</span>
              </button>

              {/* Steps */}
              {isOpen && (
                <div className="bg-white border border-t-0 border-slate-300 rounded-b-xl overflow-hidden">
                  {phase.steps.map((step, si) => {
                    const cfg = typeConfig[step.type];
                    const role = getRoleCategory(step.who);
                    return (
                      <div
                        key={si}
                        className="flex gap-4 px-5 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors"
                      >
                        {/* Dot + line */}
                        <div className="flex flex-col items-center pt-1 shrink-0 w-4">
                          <div
                            className="shrink-0"
                            style={{
                              width: step.decision ? 12 : 9,
                              height: step.decision ? 12 : 9,
                              borderRadius: step.decision ? 2 : "50%",
                              background: phase.color,
                              transform: step.decision ? "rotate(45deg)" : "none",
                              boxShadow: `0 0 0 3px ${phase.color}20`,
                            }}
                          />
                          {si < phase.steps.length - 1 && (
                            <div className="w-px flex-1 mt-1 bg-slate-200" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pb-1">
                          <p className="text-sm text-slate-700 leading-relaxed">{step.text}</p>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {/* Type badge */}
                            <span
                              className="text-xs font-semibold px-2 py-0.5 rounded border"
                              style={{ background: cfg.bg, borderColor: cfg.border, color: cfg.text }}
                            >
                              {cfg.label}
                            </span>
                            {/* Who badge */}
                            <span
                              className={`text-xs font-medium px-2 py-0.5 rounded border ${
                                role === "author"
                                  ? "bg-blue-50 text-blue-700 border-blue-100"
                                  : role === "system"
                                  ? "bg-green-50 text-green-700 border-green-100"
                                  : "bg-violet-50 text-violet-700 border-violet-100"
                              }`}
                            >
                              {step.who}
                            </span>
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
        <div className="mt-10 bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Legend</p>
          <div className="flex flex-wrap gap-10">
            <div className="flex flex-col gap-2">
              <p className="text-xs text-slate-400 font-medium mb-1">Step Type</p>
              {Object.entries(typeConfig).map(([, cfg]) => (
                <div key={cfg.label} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: cfg.text }} />
                  <span className="text-xs text-slate-600">{cfg.label}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs text-slate-400 font-medium mb-1">Responsible Party</p>
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded bg-violet-400" /><span className="text-xs text-slate-600">Madecraft Staff</span></div>
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded bg-blue-400" /><span className="text-xs text-slate-600">Author (External)</span></div>
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded bg-green-500" /><span className="text-xs text-slate-600">System / Automation</span></div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs text-slate-400 font-medium mb-1">Progress Bar</p>
              <div className="flex items-center gap-2">
                <div className="w-10 h-2 rounded-full bg-green-500" />
                <span className="text-xs text-slate-600">% of phase that is automated</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded rotate-45 bg-slate-400" />
                <span className="text-xs text-slate-600">Decision point</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-300 mt-4 leading-relaxed">
          Sources: Tiger Team AGC Content Production Playbook · AGC + Monday.com Workflow (Confluence) · Post Production (Confluence) · Regression Testing & DTOCs (Confluence) · AGC Recruiter Training & Onboarding · Sending AGC Invoice for Payment (Confluence)
        </p>
      </div>
    </div>
  );
}
