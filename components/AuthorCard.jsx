"use client";

import { useState } from "react";

export default function AuthorCard({ author, stages, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [noteDraft, setNoteDraft] = useState(author.notes);

  const stage = stages.find((s) => s.id === author.stage);
  const stageIndex = stages.findIndex((s) => s.id === author.stage);

  const daysSince = (dateStr) => {
    if (!dateStr) return "—";
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days}d ago`;
  };

  const card = {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-card)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    transition: "border-color 0.15s",
  };

  return (
    <div
      style={card}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-hover)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
    >
      {/* Stage color bar */}
      <div style={{ height: 4, background: stage?.hex || "var(--border)", width: "100%" }} />

      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>

        {/* Name + stage badge */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <div>
            <h2 style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: 17,
              fontWeight: 700,
              color: "var(--text-primary)",
              margin: 0,
              lineHeight: 1.2,
            }}>
              {author.name}
            </h2>
            {author.title && (
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3, lineHeight: 1.4 }}>
                {author.title}
              </p>
            )}
          </div>
          <span style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.05em",
            padding: "3px 10px",
            borderRadius: 20,
            whiteSpace: "nowrap",
            flexShrink: 0,
            background: stage ? `${stage.hex}22` : "var(--border)",
            color: stage?.hex || "var(--text-muted)",
            border: `1px solid ${stage?.hex || "var(--border)"}`,
            fontFamily: "var(--font-inter), sans-serif",
          }}>
            {stage?.label || author.stage}
          </span>
        </div>

        {/* IDs */}
        {(author.authorId || author.courseId) && (
          <div style={{ display: "flex", gap: 12, fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace" }}>
            {author.authorId && <span>{author.authorId}</span>}
            {author.courseId && <span style={{ color: "var(--accent-gold)" }}>{author.courseId}</span>}
          </div>
        )}

        {/* Course title */}
        {author.courseTitle && (
          <div style={{
            fontSize: 12,
            fontWeight: 600,
            color: "var(--text-body)",
            background: "var(--bg-surface)",
            borderRadius: 6,
            padding: "6px 10px",
            borderLeft: `3px solid ${stage?.hex || "var(--border)"}`,
          }}>
            {author.courseTitle}
          </div>
        )}

        {/* Pipeline progress */}
        <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
          {stages.map((s, i) => (
            <div
              key={s.id}
              title={s.label}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                background: i <= stageIndex ? s.hex : "var(--border)",
                transition: "background 0.2s",
              }}
            />
          ))}
        </div>

        {/* Last contact + links */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11 }}>
          <span style={{ color: "var(--text-muted)" }}>
            Last contact: <span style={{ color: "var(--text-body)" }}>{daysSince(author.lastContact)}</span>
          </span>
          <div style={{ display: "flex", gap: 10 }}>
            {author.email && (
              <a href={`mailto:${author.email}`} style={{ color: "var(--accent-cyan)", textDecoration: "none", fontSize: 11, fontWeight: 500 }}>
                Email
              </a>
            )}
            {author.linkedin && (
              <a href={author.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-blue)", textDecoration: "none", fontSize: 11, fontWeight: 500 }}>
                LinkedIn
              </a>
            )}
          </div>
        </div>

        {/* Past courses */}
        {author.pastCourses?.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Past Courses</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {author.pastCourses.map((c) => (
                <span key={c} style={{
                  fontSize: 10,
                  padding: "2px 8px",
                  borderRadius: 10,
                  background: "var(--bg-surface)",
                  color: "var(--accent-gold)",
                  border: "1px solid var(--border)",
                }}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div style={{
          fontSize: 12,
          background: "var(--bg-surface)",
          borderRadius: 6,
          padding: "10px 12px",
          minHeight: 48,
          color: "var(--text-body)",
        }}>
          {editingNotes ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <textarea
                rows={3}
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                autoFocus
                style={{
                  width: "100%",
                  background: "var(--bg-card)",
                  border: "1px solid var(--accent-coral)",
                  borderRadius: 4,
                  padding: "6px 8px",
                  fontSize: 12,
                  color: "var(--text-primary)",
                  resize: "none",
                  outline: "none",
                  fontFamily: "var(--font-inter), sans-serif",
                }}
              />
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => { onUpdate(author.id, { notes: noteDraft }); setEditingNotes(false); }}
                  style={{ fontSize: 11, fontWeight: 600, color: "var(--accent-coral)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  Save
                </button>
                <button onClick={() => { setNoteDraft(author.notes); setEditingNotes(false); }}
                  style={{ fontSize: 11, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p
              onClick={() => setEditingNotes(true)}
              title="Click to edit notes"
              style={{ margin: 0, cursor: "pointer", lineHeight: 1.5, fontStyle: author.notes ? "normal" : "italic", color: author.notes ? "var(--text-body)" : "var(--text-muted)" }}
            >
              {author.notes || "Click to add notes..."}
            </p>
          )}
        </div>

        {/* Actions toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            padding: 0,
            fontFamily: "var(--font-inter), sans-serif",
          }}
        >
          {expanded ? "Hide actions ▲" : "Actions ▼"}
        </button>

        {expanded && (
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Move Stage</label>
            <select
              value={author.stage}
              onChange={(e) => onUpdate(author.id, { stage: e.target.value })}
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                padding: "6px 10px",
                fontSize: 12,
                color: "var(--text-primary)",
                outline: "none",
                fontFamily: "var(--font-inter), sans-serif",
              }}
            >
              {stages.map((s) => (
                <option key={s.id} value={s.id} style={{ background: "var(--bg-secondary)" }}>{s.label}</option>
              ))}
            </select>

            <label style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Last Contact</label>
            <input
              type="date"
              value={author.lastContact}
              onChange={(e) => onUpdate(author.id, { lastContact: e.target.value })}
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                padding: "6px 10px",
                fontSize: 12,
                color: "var(--text-primary)",
                outline: "none",
                fontFamily: "var(--font-inter), sans-serif",
              }}
            />

            <button
              onClick={() => { if (confirm(`Remove ${author.name}?`)) onDelete(author.id); }}
              style={{
                marginTop: 4,
                fontSize: 11,
                color: "var(--accent-red)",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                padding: 0,
                fontFamily: "var(--font-inter), sans-serif",
              }}
            >
              Remove author
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
