"use client";

import { useState } from "react";
import AuthorCard from "../components/AuthorCard";
import AddAuthorModal from "../components/AddAuthorModal";

const STAGES = [
  { id: "prospecting", label: "Prospecting", color: "bg-slate-400" },
  { id: "outreach", label: "Outreach", color: "bg-blue-400" },
  { id: "negotiation", label: "Negotiation", color: "bg-yellow-400" },
  { id: "contract", label: "Contract", color: "bg-orange-400" },
  { id: "in_progress", label: "In Progress", color: "bg-purple-500" },
  { id: "review", label: "Review", color: "bg-pink-500" },
  { id: "published", label: "Published", color: "bg-green-500" },
];

const SAMPLE_AUTHORS = [
  {
    id: 1,
    name: "Sarah Mitchell",
    project: "The Future of Remote Work",
    stage: "in_progress",
    lastContact: "2026-03-04",
    email: "sarah@example.com",
    notes: "Chapter 3 draft submitted. Waiting on revisions.",
    tags: ["Business", "Leadership"],
  },
  {
    id: 2,
    name: "James Okafor",
    project: "Deep Learning for Everyone",
    stage: "review",
    lastContact: "2026-03-05",
    email: "james@example.com",
    notes: "Final manuscript in review. Cover design approved.",
    tags: ["Tech", "AI"],
  },
  {
    id: 3,
    name: "Priya Nair",
    project: "Mindful Leadership",
    stage: "contract",
    lastContact: "2026-02-28",
    email: "priya@example.com",
    notes: "Contract sent. Awaiting signature.",
    tags: ["Leadership", "Wellness"],
  },
  {
    id: 4,
    name: "Marcus Webb",
    project: "The Data-Driven Startup",
    stage: "outreach",
    lastContact: "2026-03-01",
    email: "marcus@example.com",
    notes: "Initial email sent. No response yet.",
    tags: ["Business", "Data"],
  },
  {
    id: 5,
    name: "Elena Vasquez",
    project: "Building Resilient Teams",
    stage: "published",
    lastContact: "2026-02-15",
    email: "elena@example.com",
    notes: "Book live on all platforms. Marketing phase complete.",
    tags: ["Leadership", "HR"],
  },
];

export default function Home() {
  const [authors, setAuthors] = useState(SAMPLE_AUTHORS);
  const [filterStage, setFilterStage] = useState("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filtered = authors.filter((a) => {
    const matchesStage = filterStage === "all" || a.stage === filterStage;
    const matchesSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.project.toLowerCase().includes(search.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const stageCount = (stageId) => authors.filter((a) => a.stage === stageId).length;

  const handleAdd = (newAuthor) => {
    setAuthors((prev) => [
      ...prev,
      { ...newAuthor, id: Date.now() },
    ]);
    setShowModal(false);
  };

  const handleUpdate = (id, updates) => {
    setAuthors((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const handleDelete = (id) => {
    setAuthors((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Author Hub
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Track every author through your publishing process
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ backgroundColor: "#3b5bdb" }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#2f4ac0")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#3b5bdb")}
        >
          + Add Author
        </button>
      </header>

      {/* Pipeline Status Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setFilterStage("all")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              filterStage === "all"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All
            <span className="bg-white bg-opacity-20 text-inherit px-1.5 py-0.5 rounded-full text-xs">
              {authors.length}
            </span>
          </button>

          {STAGES.map((stage, i) => (
            <div key={stage.id} className="flex items-center">
              {i > 0 && (
                <span className="text-slate-300 mx-1 text-lg select-none">›</span>
              )}
              <button
                onClick={() => setFilterStage(stage.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  filterStage === stage.id
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${stage.color}`} />
                {stage.label}
                <span className="bg-white bg-opacity-20 text-inherit px-1.5 py-0.5 rounded-full text-xs">
                  {stageCount(stage.id)}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="px-6 pt-5 pb-3">
        <input
          type="text"
          placeholder="Search authors or projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
        <p className="text-xs text-slate-400 mt-2">
          Showing {filtered.length} of {authors.length} authors
        </p>
      </div>

      {/* Author Cards Grid */}
      <main className="px-6 pb-10">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-lg">No authors found.</p>
            <p className="text-sm mt-1">Try a different filter or add a new author.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
