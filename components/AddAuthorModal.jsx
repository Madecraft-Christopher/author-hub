"use client";

import { useState } from "react";

export default function AddAuthorModal({ stages, onAdd, onClose }) {
  const [form, setForm] = useState({
    name: "",
    authorId: "",
    title: "",
    courseId: "",
    courseTitle: "",
    email: "",
    linkedin: "",
    stage: "recruiting",
    lastContact: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [pastCourses, setPastCourses] = useState([]);
  const [courseInput, setCourseInput] = useState("");

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const addCourse = () => {
    const val = courseInput.trim();
    if (val && !pastCourses.includes(val)) {
      setPastCourses((prev) => [...prev, val]);
    }
    setCourseInput("");
  };

  const removeCourse = (course) => {
    setPastCourses((prev) => prev.filter((c) => c !== course));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.linkedin.trim()) return;
    onAdd({ ...form, pastCourses });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <h2 className="text-lg font-semibold text-slate-900">Add New Author</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="px-6 py-5 flex flex-col gap-4 overflow-y-auto"
        >
          {/* Name + Author ID */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-500">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={set("name")}
                placeholder="e.g. Jane Smith"
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-500">
                Author ID
              </label>
              <input
                type="text"
                value={form.authorId}
                onChange={set("authorId")}
                placeholder="e.g. AUTH-001"
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Professional Title */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500">
              Title / Role
            </label>
            <input
              type="text"
              value={form.title}
              onChange={set("title")}
              placeholder="e.g. Senior Data Scientist at Acme Corp"
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Course ID + Course Title */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-500">
                Course ID
              </label>
              <input
                type="text"
                value={form.courseId}
                onChange={set("courseId")}
                placeholder="e.g. CRS-204"
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-500">
                Course Title
              </label>
              <input
                type="text"
                value={form.courseTitle}
                onChange={set("courseTitle")}
                placeholder="e.g. Intro to Python"
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={set("email")}
              placeholder="jane@email.com"
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* LinkedIn */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500">
              LinkedIn / Social Media <span className="text-red-400">*</span>
            </label>
            <input
              type="url"
              required
              value={form.linkedin}
              onChange={set("linkedin")}
              placeholder="https://linkedin.com/in/janesmith"
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Stage + Last Contact */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-500">Stage</label>
              <select
                value={form.stage}
                onChange={set("stage")}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              >
                {stages.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-500">
                Last Contact
              </label>
              <input
                type="date"
                value={form.lastContact}
                onChange={set("lastContact")}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Past Courses Completed */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500">
              Past Courses Completed
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={courseInput}
                onChange={(e) => setCourseInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCourse();
                  }
                }}
                placeholder="Type a course title and press Add"
                className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={addCourse}
                className="px-3 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors whitespace-nowrap"
              >
                + Add
              </button>
            </div>
            {pastCourses.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {pastCourses.map((course) => (
                  <span
                    key={course}
                    className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
                  >
                    {course}
                    <button
                      type="button"
                      onClick={() => removeCourse(course)}
                      className="text-blue-400 hover:text-blue-700 leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500">Notes</label>
            <textarea
              value={form.notes}
              onChange={set("notes")}
              rows={3}
              placeholder="Any initial notes..."
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
          </div>

          <p className="text-xs text-slate-400">
            <span className="text-red-400">*</span> Required fields
          </p>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-200 text-slate-600 rounded-lg py-2 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 text-white rounded-lg py-2 text-sm font-medium transition-colors"
              style={{ backgroundColor: "#3b5bdb" }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#2f4ac0")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#3b5bdb")}
            >
              Add Author
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
