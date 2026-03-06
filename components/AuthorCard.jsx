"use client";

import { useState } from "react";

export default function AuthorCard({ author, stages, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [noteDraft, setNoteDraft] = useState(author.notes);

  const stage = stages.find((s) => s.id === author.stage);

  const daysSince = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days}d ago`;
  };

  const stageIndex = stages.findIndex((s) => s.id === author.stage);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
      {/* Stage color bar */}
      <div className={`h-1.5 rounded-t-xl ${stage?.color || "bg-slate-300"}`} />

      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Author name + stage badge */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="font-semibold text-slate-900 text-base leading-snug">
              {author.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 leading-tight">
              {author.project}
            </p>
          </div>
          <span
            className={`text-white text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${stage?.color || "bg-slate-400"}`}
          >
            {stage?.label || author.stage}
          </span>
        </div>

        {/* Mini pipeline progress */}
        <div className="flex items-center gap-0.5">
          {stages.map((s, i) => (
            <div
              key={s.id}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i <= stageIndex ? s.color : "bg-slate-100"
              }`}
            />
          ))}
        </div>

        {/* Meta info */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Last contact: {daysSince(author.lastContact)}</span>
          {author.email && (
            <a
              href={`mailto:${author.email}`}
              className="text-blue-500 hover:underline"
            >
              Email
            </a>
          )}
        </div>

        {/* Tags */}
        {author.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {author.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Notes */}
        <div className="text-xs text-slate-600 bg-slate-50 rounded-lg p-2.5 min-h-[3rem]">
          {editingNotes ? (
            <div className="flex flex-col gap-1.5">
              <textarea
                className="w-full text-xs border border-slate-200 rounded p-1.5 resize-none focus:outline-none focus:ring-1 focus:ring-blue-400"
                rows={3}
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onUpdate(author.id, { notes: noteDraft });
                    setEditingNotes(false);
                  }}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setNoteDraft(author.notes);
                    setEditingNotes(false);
                  }}
                  className="text-slate-400 hover:underline"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p
              className="cursor-pointer hover:text-slate-800 transition-colors"
              onClick={() => setEditingNotes(true)}
              title="Click to edit notes"
            >
              {author.notes || (
                <span className="italic text-slate-400">Click to add notes...</span>
              )}
            </p>
          )}
        </div>

        {/* Expand / Actions */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            {expanded ? "Hide actions ▲" : "Actions ▼"}
          </button>
        </div>

        {expanded && (
          <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
            <label className="text-xs font-medium text-slate-500">
              Move stage
            </label>
            <select
              value={author.stage}
              onChange={(e) => onUpdate(author.id, { stage: e.target.value })}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
            >
              {stages.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>

            <label className="text-xs font-medium text-slate-500 mt-1">
              Last contact date
            </label>
            <input
              type="date"
              value={author.lastContact}
              onChange={(e) =>
                onUpdate(author.id, { lastContact: e.target.value })
              }
              className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
            />

            <button
              onClick={() => {
                if (confirm(`Remove ${author.name}?`)) onDelete(author.id);
              }}
              className="mt-2 text-xs text-red-400 hover:text-red-600 text-left transition-colors"
            >
              Remove author
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
