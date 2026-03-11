"use client";

import { useState } from "react";
import AuthorCard from "../components/AuthorCard";
import AddAuthorModal from "../components/AddAuthorModal";
import AGCLifecycle from "../components/AGCLifecycle";
import MessagingHub from "../components/MessagingHub";

export const STAGES = [
  { id: "recruiting",         label: "Prospecting",               hex: "#3F80AE" },
  { id: "nda_pa",             label: "NDA / PA",                  hex: "#2AADD9" },
  { id: "content_alignment",  label: "Content Alignment",         hex: "#09A685" },
  { id: "waitlisted",         label: "Waitlisted",                hex: "#888888" },
  { id: "contracting",        label: "Contracting",               hex: "#89BD83" },
  { id: "pre_production",     label: "Recording Prep",            hex: "#EDD062" },
  { id: "recording",          label: "Recording",                 hex: "#DE7424" },
  { id: "editing",            label: "Editing",                   hex: "#A9260F" },
  { id: "qa_transcripts",     label: "QA + Transcripts",          hex: "#CDAABA" },
  { id: "revisions",          label: "Revisions",                 hex: "#634057" },
  { id: "regression_testing", label: "Done (AGC) / Delivery",     hex: "#3D3D7C" },
  { id: "delivery_payment",   label: "Delivery & Payment",        hex: "#EFE9D3" },
  { id: "offboarding",        label: "Offboarding / Sunset",      hex: "#444444" },
];

const SAMPLE_AUTHORS = [
  {
    id: 1,
    name: "Gillian Whitney",
    authorId: "A1143",
    title: "",
    courseId: "2202",
    courseTitle: "Using AI to Personalize Prospecting",
    stage: "content_alignment",
    lastContact: "2026-03-10",
    email: "gillian@easypeasybooks.com",
    linkedin: "",
    notes: "Accepted course 2202. Excited to get started.",
    pastCourses: [],
  },
  {
    id: 2,
    name: "Angela Best",
    authorId: "A0858",
    title: "",
    courseId: "1639",
    courseTitle: "Why Your Hiring Process Is Turning Candidates Away",
    stage: "revisions",
    lastContact: "2026-03-10",
    email: "angela@orbstaff.com",
    linkedin: "",
    notes: "Reshot lesson 6, uploading now. Lighting issue flagged (HDR on).",
    pastCourses: [],
  },
  {
    id: 3,
    name: "Sanovia G",
    authorId: "A1136",
    title: "",
    courseId: "",
    courseTitle: "",
    stage: "nda_pa",
    lastContact: "2026-03-09",
    email: "findjoy@iamsanovia.com",
    linkedin: "",
    notes: "Onboarding links resolved. Awaiting course assignment.",
    pastCourses: [],
  },
  {
    id: 4,
    name: "Melissa Ramos",
    authorId: "A1095",
    title: "",
    courseId: "",
    courseTitle: "",
    stage: "offboarding",
    lastContact: "2026-03-10",
    email: "melissa@m95machining.com",
    linkedin: "",
    notes: "Course 1520 cancelled. Waiting on call to align before new contracts.",
    pastCourses: [],
  },
  {
    id: 5,
    name: "Harry Portch",
    authorId: "A1113",
    title: "Managing Director, HM Staffing",
    courseId: "2201",
    courseTitle: "Sell Faster with AI",
    stage: "recording",
    lastContact: "2026-03-09",
    email: "Harry@hmstaffing.co.uk",
    linkedin: "",
    notes: "Uploaded colour shot videos. Lighting and eye movement flagged for review.",
    pastCourses: [],
  },
  {
    id: 6,
    name: "Erika Barbosa",
    authorId: "A1131",
    title: "",
    courseId: "2231",
    courseTitle: "Boost Team Performance",
    stage: "pre_production",
    lastContact: "2026-03-06",
    email: "barbosa.erika@gmail.com",
    linkedin: "",
    notes: "Production call done. Excited to start.",
    pastCourses: [],
  },
];

const TABS = [
  { id: "process",   label: "Process Map" },
  { id: "authors",   label: "Authors" },
  { id: "messages",  label: "Messages" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("process");
  const [authors, setAuthors] = useState(SAMPLE_AUTHORS);
  const [filterStage, setFilterStage] = useState("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filtered = authors.filter((a) => {
    const matchesStage = filterStage === "all" || a.stage === filterStage;
    const matchesSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      (a.courseTitle || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.authorId || "").toLowerCase().includes(search.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const stageCount = (id) => authors.filter((a) => a.stage === id).length;
  const handleAdd    = (a) => { setAuthors((p) => [...p, { ...a, id: Date.now() }]); setShowModal(false); };
  const handleUpdate = (id, u) => setAuthors((p) => p.map((a) => (a.id === id ? { ...a, ...u } : a)));
  const handleDelete = (id)    => setAuthors((p) => p.filter((a) => a.id !== id));

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-primary)" }}>

      {/* ── Header ── */}
      <header style={{
        background: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border)",
        padding: "24px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
      }}>
        <div>
          <p style={{
            fontSize: 10,
            fontFamily: "var(--font-inter), sans-serif",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            marginBottom: 6,
          }}>
            Madecraft &nbsp;·&nbsp; Content Operations & Relationship Engine
          </p>
          <h1 style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            fontSize: 42,
            fontWeight: 700,
            letterSpacing: "-0.5px",
            lineHeight: 1,
            color: "var(--text-primary)",
            margin: 0,
          }}>
            CORE
            <span style={{ color: "var(--accent-gold)", fontStyle: "italic", marginLeft: 12, fontSize: 36 }}>
              AGC Author Lifecycle
            </span>
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 8, fontWeight: 400 }}>
            End-to-end author management — recruiting through final delivery
          </p>
        </div>

        {activeTab === "authors" && (
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: "var(--accent-coral)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--radius-btn)",
              padding: "10px 24px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              letterSpacing: "0.02em",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            + Add Author
          </button>
        )}
      </header>

      {/* ── Tab Bar ── */}
      <div style={{
        background: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border)",
        padding: "0 40px",
        display: "flex",
        gap: 0,
      }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "14px 24px",
              fontSize: 13,
              fontWeight: 500,
              background: "none",
              border: "none",
              borderBottom: activeTab === tab.id
                ? "2px solid var(--accent-coral)"
                : "2px solid transparent",
              color: activeTab === tab.id
                ? "var(--accent-coral)"
                : "var(--text-muted)",
              cursor: "pointer",
              fontFamily: "var(--font-inter), sans-serif",
              transition: "color 0.15s",
              letterSpacing: "0.03em",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-auto">

        {activeTab === "process"  && <AGCLifecycle authors={authors} stages={STAGES} />}
        {activeTab === "messages" && <MessagingHub authors={authors} stages={STAGES} />}

        {activeTab === "authors" && (
          <div>
            {/* Pipeline filter strip */}
            <div style={{
              background: "var(--bg-secondary)",
              borderBottom: "1px solid var(--border)",
              padding: "12px 40px",
              overflowX: "auto",
            }}>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                {/* All button */}
                <button
                  onClick={() => setFilterStage("all")}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "6px 14px",
                    borderRadius: 20,
                    border: "1px solid",
                    borderColor: filterStage === "all" ? "var(--accent-coral)" : "var(--border)",
                    background: filterStage === "all" ? "var(--accent-coral)" : "transparent",
                    color: filterStage === "all" ? "#fff" : "var(--text-muted)",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    fontFamily: "var(--font-inter), sans-serif",
                  }}
                >
                  All
                  <span style={{
                    background: filterStage === "all" ? "rgba(255,255,255,0.2)" : "var(--border)",
                    color: filterStage === "all" ? "#fff" : "var(--text-muted)",
                    borderRadius: 10,
                    padding: "1px 6px",
                    fontSize: 10,
                  }}>{authors.length}</span>
                </button>

                {STAGES.map((stage, i) => (
                  <div key={stage.id} style={{ display: "flex", alignItems: "center" }}>
                    {i > 0 && <span style={{ color: "var(--border-hover)", margin: "0 2px", fontSize: 14 }}>›</span>}
                    <button
                      onClick={() => setFilterStage(stage.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "6px 14px",
                        borderRadius: 20,
                        border: "1px solid",
                        borderColor: filterStage === stage.id ? stage.hex : "var(--border)",
                        background: filterStage === stage.id ? `${stage.hex}22` : "transparent",
                        color: filterStage === stage.id ? stage.hex : "var(--text-muted)",
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        fontFamily: "var(--font-inter), sans-serif",
                      }}
                    >
                      <span style={{
                        width: 7, height: 7, borderRadius: "50%",
                        background: stage.hex,
                        flexShrink: 0,
                      }} />
                      {stage.label}
                      <span style={{
                        background: "var(--border)",
                        color: "var(--text-muted)",
                        borderRadius: 10,
                        padding: "1px 6px",
                        fontSize: 10,
                      }}>{stageCount(stage.id)}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Search */}
            <div style={{ padding: "24px 40px 12px" }}>
              <input
                type="text"
                placeholder="Search by name, course, or author ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "10px 16px",
                  fontSize: 13,
                  color: "var(--text-primary)",
                  width: "100%",
                  maxWidth: 420,
                  outline: "none",
                  fontFamily: "var(--font-inter), sans-serif",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent-coral)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>
                Showing {filtered.length} of {authors.length} authors
              </p>
            </div>

            {/* Author cards */}
            <main style={{ padding: "0 40px 60px" }}>
              {filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
                  <p style={{ fontSize: 18 }}>No authors found.</p>
                  <p style={{ fontSize: 13, marginTop: 6 }}>Try a different filter or add a new author.</p>
                </div>
              ) : (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: 16,
                }}>
                  {filtered.map((author) => (
                    <AuthorCard
                      key={author.id}
                      author={author}
                      stages={STAGES}
                      onUpdate={handleUpdate}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </main>
          </div>
        )}
      </div>

      {showModal && (
        <AddAuthorModal
          stages={STAGES}
          onAdd={handleAdd}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
