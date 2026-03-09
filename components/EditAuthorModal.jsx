"use client";

import { useState } from "react";

const inputStyle = {
  background: "var(--bg-surface)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  padding: "10px 14px",
  fontSize: 13,
  color: "var(--text-primary)",
  width: "100%",
  outline: "none",
  fontFamily: "var(--font-inter), sans-serif",
  transition: "border-color 0.15s",
};

const labelStyle = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--text-muted)",
  fontFamily: "var(--font-inter), sans-serif",
};

function Field({ label, required, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={labelStyle}>
        {label} {required && <span style={{ color: "var(--accent-coral)" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

export default function EditAuthorModal({ author, stages, onSave, onClose }) {
  const [form, setForm] = useState({
    name:        author.name        || "",
    authorId:    author.authorId    || "",
    title:       author.title       || "",
    courseId:    author.courseId    || "",
    courseTitle: author.courseTitle || "",
    email:       author.email       || "",
    linkedin:    author.linkedin    || "",
    stage:       author.stage       || "recruiting",
    lastContact: author.lastContact || new Date().toISOString().split("T")[0],
    notes:       author.notes       || "",
  });
  const [pastCourses, setPastCourses] = useState(author.pastCourses || []);
  const [courseInput, setCourseInput] = useState("");

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const addCourse = () => {
    const val = courseInput.trim();
    if (val && !pastCourses.includes(val)) setPastCourses((p) => [...p, val]);
    setCourseInput("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.linkedin.trim()) return;
    onSave(author.id, { ...form, pastCourses });
  };

  const focusIn  = (e) => (e.target.style.borderColor = "var(--accent-coral)");
  const focusOut = (e) => (e.target.style.borderColor = "var(--border)");

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 50, padding: 16,
    }}>
      <div style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        width: "100%",
        maxWidth: 520,
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
        }}>
          <div>
            <h2 style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: 22,
              fontWeight: 700,
              color: "var(--text-primary)",
              margin: 0,
            }}>
              Edit Author
            </h2>
            <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
              Editing <span style={{ color: "var(--accent-gold)" }}>{author.name}</span>
            </p>
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "none",
            color: "var(--text-muted)", fontSize: 22, cursor: "pointer",
            lineHeight: 1, padding: 4,
          }}>×</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>

          {/* Name + Author ID */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Name" required>
              <input type="text" required value={form.name} onChange={set("name")}
                style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
            </Field>
            <Field label="Author ID">
              <input type="text" value={form.authorId} onChange={set("authorId")}
                style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
            </Field>
          </div>

          {/* Title */}
          <Field label="Title / Role">
            <input type="text" value={form.title} onChange={set("title")}
              style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
          </Field>

          {/* Course ID + Title */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Course ID">
              <input type="text" value={form.courseId} onChange={set("courseId")}
                style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
            </Field>
            <Field label="Course Title">
              <input type="text" value={form.courseTitle} onChange={set("courseTitle")}
                style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
            </Field>
          </div>

          {/* Email */}
          <Field label="Email" required>
            <input type="email" required value={form.email} onChange={set("email")}
              style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
          </Field>

          {/* LinkedIn */}
          <Field label="LinkedIn / Social Media" required>
            <input type="url" required value={form.linkedin} onChange={set("linkedin")}
              style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
          </Field>

          {/* Stage + Last Contact */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Stage">
              <select value={form.stage} onChange={set("stage")}
                style={{ ...inputStyle, cursor: "pointer" }} onFocus={focusIn} onBlur={focusOut}>
                {stages.map((s) => (
                  <option key={s.id} value={s.id} style={{ background: "var(--bg-secondary)" }}>{s.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Last Contact">
              <input type="date" value={form.lastContact} onChange={set("lastContact")}
                style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
            </Field>
          </div>

          {/* Past Courses */}
          <Field label="Past Courses Completed">
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                value={courseInput}
                onChange={(e) => setCourseInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCourse(); } }}
                placeholder="Add a course and press Enter or Add"
                style={{ ...inputStyle, flex: 1 }}
                onFocus={focusIn} onBlur={focusOut}
              />
              <button type="button" onClick={addCourse} style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "0 16px",
                fontSize: 12,
                color: "var(--text-body)",
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontFamily: "var(--font-inter), sans-serif",
              }}>+ Add</button>
            </div>
            {pastCourses.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                {pastCourses.map((c) => (
                  <span key={c} style={{
                    display: "flex", alignItems: "center", gap: 4,
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    padding: "3px 10px",
                    fontSize: 11,
                    color: "var(--accent-gold)",
                  }}>
                    {c}
                    <button type="button" onClick={() => setPastCourses((p) => p.filter((x) => x !== c))}
                      style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 0, fontSize: 14, lineHeight: 1 }}>×</button>
                  </span>
                ))}
              </div>
            )}
          </Field>

          {/* Notes */}
          <Field label="Notes">
            <textarea value={form.notes} onChange={set("notes")} rows={3}
              style={{ ...inputStyle, resize: "none" }}
              onFocus={focusIn} onBlur={focusOut} />
          </Field>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
            <button type="button" onClick={onClose} style={{
              flex: 1,
              background: "none",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-btn)",
              padding: "11px 0",
              fontSize: 13,
              fontWeight: 600,
              color: "var(--text-muted)",
              cursor: "pointer",
              fontFamily: "var(--font-inter), sans-serif",
            }}>Cancel</button>
            <button type="submit" style={{
              flex: 1,
              background: "var(--accent-coral)",
              border: "none",
              borderRadius: "var(--radius-btn)",
              padding: "11px 0",
              fontSize: 13,
              fontWeight: 600,
              color: "#fff",
              cursor: "pointer",
              fontFamily: "var(--font-inter), sans-serif",
            }}>Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
