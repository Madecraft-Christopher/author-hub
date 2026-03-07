"use client";

import { useState } from "react";
import AuthorCard from "../components/AuthorCard";
import AddAuthorModal from "../components/AddAuthorModal";
import AGCLifecycle from "../components/AGCLifecycle";

export const STAGES = [
  { id: "recruiting",         label: "Recruiting",                hex: "#3F80AE" },
  { id: "nda_pa",             label: "NDA / PA",                  hex: "#2AADD9" },
  { id: "content_alignment",  label: "Content Alignment",         hex: "#09A685" },
  { id: "contracting",        label: "Contracting",               hex: "#89BD83" },
  { id: "pre_production",     label: "Pre-Production",            hex: "#EDD062" },
  { id: "recording",          label: "Recording & Handoff",       hex: "#DE7424" },
  { id: "editing",            label: "Editing",                   hex: "#A9260F" },
  { id: "qa_transcripts",     label: "QA + Transcripts",          hex: "#CDAABA" },
  { id: "revisions",          label: "Revisions",                 hex: "#634057" },
  { id: "regression_testing", label: "Regression Testing & DTOC", hex: "#3D3D7C" },
  { id: "delivery_payment",   label: "Delivery & Payment",        hex: "#EFE9D3" },
];

const SAMPLE_AUTHORS = [
  {
    id: 1,
    name: "Sarah Mitchell",
    authorId: "AUTH-001",
    title: "Senior UX Designer at Acme Studio",
    courseId: "CRS-101",
    courseTitle: "UX Design Fundamentals",
    stage: "recording",
    lastContact: "2026-03-04",
    email: "sarah@example.com",
    linkedin: "https://linkedin.com/in/sarahmitchell",
    notes: "Module 3 draft submitted. Waiting on revisions.",
    pastCourses: ["Intro to Design Thinking"],
  },
  {
    id: 2,
    name: "James Okafor",
    authorId: "AUTH-002",
    title: "ML Engineer at DataCo",
    courseId: "CRS-204",
    courseTitle: "Deep Learning for Everyone",
    stage: "qa_transcripts",
    lastContact: "2026-03-05",
    email: "james@example.com",
    linkedin: "https://linkedin.com/in/jamesokafor",
    notes: "Final content in review. Assessments approved.",
    pastCourses: ["Python for Beginners", "Data Science Essentials"],
  },
  {
    id: 3,
    name: "Priya Nair",
    authorId: "AUTH-003",
    title: "Leadership Coach & Speaker",
    courseId: "CRS-310",
    courseTitle: "Mindful Leadership",
    stage: "contracting",
    lastContact: "2026-02-28",
    email: "priya@example.com",
    linkedin: "https://linkedin.com/in/priyanair",
    notes: "Contract sent. Awaiting signature.",
    pastCourses: [],
  },
  {
    id: 4,
    name: "Marcus Webb",
    authorId: "AUTH-004",
    title: "Startup Founder & Growth Advisor",
    courseId: "",
    courseTitle: "",
    stage: "nda_pa",
    lastContact: "2026-03-01",
    email: "marcus@example.com",
    linkedin: "https://linkedin.com/in/marcuswebb",
    notes: "Initial outreach sent. No response yet.",
    pastCourses: [],
  },
  {
    id: 5,
    name: "Elena Vasquez",
    authorId: "AUTH-005",
    title: "Head of People Operations",
    courseId: "CRS-415",
    courseTitle: "Building Resilient Teams",
    stage: "delivery_payment",
    lastContact: "2026-02-15",
    email: "elena@example.com",
    linkedin: "https://linkedin.com/in/elenavasquez",
    notes: "Course live on platform. Marketing phase complete.",
    pastCourses: ["HR Fundamentals", "Talent Acquisition Strategies"],
  },
];

const TABS = [
  { id: "process", label: "Process Map" },
  { id: "authors", label: "Authors" },
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

        {activeTab === "process" && <AGCLifecycle />}

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
