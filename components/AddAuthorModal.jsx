"use client";

import { useState } from "react";

export default function AddAuthorModal({ stages, onAdd, onClose }) {
  const [form, setForm] = useState({
    name: "",
    project: "",
    email: "",
    stage: "prospecting",
    notes: "",
    tags: "",
    lastContact: new Date().toISOString().split("T")[0],
  });

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.project.trim()) return;
    onAdd({
      ...form,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">Add New Author</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500">
              Author Name *
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
              Project / Book Title *
            </label>
            <input
              type="text"
              required
              value={form.project}
              onChange={set("project")}
              placeholder="e.g. The Art of Scaling"
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="author@email.com"
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

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

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={form.tags}
              onChange={set("tags")}
              placeholder="e.g. Business, Leadership, Tech"
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

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
