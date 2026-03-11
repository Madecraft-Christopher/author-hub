"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

const SLACK_CHANNELS = [
  { id: "C09KA41EN3C", name: "#agc-rehearsal-review" },
  { id: "C0AARLM5VNY", name: "#agc-greenlight" },
];

const SOURCES = ["All", "Slack", "Email", "Monday"];

const SOURCE_COLORS = {
  slack: "#4A154B",
  email: "var(--accent-cyan)",
  monday: "#FF3D57",
};

function getSource(item) {
  if (item.channel === "slack") return "slack";
  if (item.channel === "email" || item.direction) return "email";
  return "other";
}

function SourceBadge({ source, channel }) {
  const colors = {
    slack: { bg: "rgba(74,21,75,0.15)", color: "#9B59B6", border: "rgba(74,21,75,0.3)" },
    email: { bg: "rgba(0,188,212,0.12)", color: "var(--accent-cyan)", border: "rgba(0,188,212,0.3)" },
    monday: { bg: "rgba(255,61,87,0.12)", color: "#FF3D57", border: "rgba(255,61,87,0.3)" },
  };
  const c = colors[source] || { bg: "var(--bg-surface)", color: "var(--text-muted)", border: "var(--border)" };
  return (
    <span style={{
      fontSize: 9,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.07em",
      padding: "2px 8px",
      borderRadius: 10,
      background: c.bg,
      color: c.color,
      border: `1px solid ${c.border}`,
      fontFamily: "var(--font-inter), sans-serif",
      flexShrink: 0,
    }}>
      {source === "slack" ? `Slack ${channel || ""}` : source === "email" ? "Email" : source}
    </span>
  );
}

function FeedbackItem({ item }) {
  const [expanded, setExpanded] = useState(false);
  const source = getSource(item);
  const text = item.text || item.body || "";
  const date = new Date(item.timestamp).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
  const time = new Date(item.timestamp).toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit",
  });

  const borderColors = {
    slack: "#9B59B6",
    email: "var(--accent-cyan)",
    monday: "#FF3D57",
  };

  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderLeft: `3px solid ${borderColors[source] || "var(--border)"}`,
      borderRadius: 8,
      padding: "12px 16px",
      display: "flex",
      flexDirection: "column",
      gap: 8,
    }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <SourceBadge source={source} channel={item.source} />
        {item.subject && (
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-body)", flex: 1 }}>
            {item.subject}
          </span>
        )}
        <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: "auto", whiteSpace: "nowrap" }}>
          {date} · {time}
        </span>
      </div>

      {/* Body */}
      <p
        onClick={() => text.length > 300 && setExpanded(!expanded)}
        style={{
          margin: 0,
          fontSize: 13,
          color: "var(--text-body)",
          lineHeight: 1.6,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          cursor: text.length > 300 ? "pointer" : "default",
        }}
      >
        {expanded || text.length <= 300 ? text : `${text.slice(0, 300)}…`}
        {text.length > 300 && (
          <span style={{ color: "var(--accent-coral)", fontSize: 11, marginLeft: 6, fontWeight: 600 }}>
            {expanded ? "Show less" : "Show more"}
          </span>
        )}
      </p>
    </div>
  );
}

export default function FeedbackModal({ author, onClose }) {
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const results = [];

    // Slack — both channels
    if (author.name || author.courseId) {
      for (const ch of SLACK_CHANNELS) {
        const params = new URLSearchParams();
        if (author.name) params.set("name", author.name);
        if (author.courseId) params.set("courseId", author.courseId);
        params.set("channelId", ch.id);
        try {
          const res = await fetch(`/api/slack/messages?${params}`);
          const data = await res.json();
          const tagged = (data.messages || []).map((m) => ({
            ...m,
            channel: "slack",
            source: ch.name,
          }));
          results.push(...tagged);
        } catch (_) {}
      }
    }

    // Gmail
    if (author.email) {
      try {
        const res = await fetch(`/api/gmail/messages?email=${encodeURIComponent(author.email)}`);
        const data = await res.json();
        results.push(...(data.messages || []).map((m) => ({ ...m, channel: "email" })));
      } catch (_) {}
    }

    results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setItems(results);
    setLoading(false);
  }, [author]);

  useEffect(() => {
    loadAll();
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [loadAll, onClose]);

  const filtered = activeTab === "All"
    ? items
    : items.filter((item) => getSource(item) === activeTab.toLowerCase());

  const countFor = (tab) => {
    if (tab === "All") return items.length;
    return items.filter((item) => getSource(item) === tab.toLowerCase()).length;
  };

  const modal = (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(4px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        width: "100%",
        maxWidth: 760,
        maxHeight: "85vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
      }}>

        {/* Header */}
        <div style={{
          padding: "20px 24px 16px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
          flexShrink: 0,
        }}>
          <div>
            <h2 style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: 20,
              fontWeight: 700,
              color: "var(--text-primary)",
              margin: 0,
            }}>
              {author.name}
            </h2>
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "4px 0 0" }}>
              Feedback History · {items.length} item{items.length !== 1 ? "s" : ""}
              {author.authorId && <span style={{ marginLeft: 10, fontFamily: "monospace" }}>{author.authorId}</span>}
              {author.courseId && <span style={{ marginLeft: 8, color: "var(--accent-gold)", fontFamily: "monospace" }}>{author.courseId}</span>}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              width: 32,
              height: 32,
              cursor: "pointer",
              color: "var(--text-muted)",
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex",
          gap: 4,
          padding: "12px 24px 0",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
        }}>
          {SOURCES.map((tab) => {
            const isMonday = tab === "Monday";
            const count = isMonday ? 0 : countFor(tab);
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => !isMonday && setActiveTab(tab)}
                disabled={isMonday}
                title={isMonday ? "Monday.com — coming soon" : undefined}
                style={{
                  padding: "6px 14px",
                  borderRadius: "8px 8px 0 0",
                  border: "none",
                  borderBottom: active ? "2px solid var(--accent-coral)" : "2px solid transparent",
                  background: active ? "var(--bg-card)" : "transparent",
                  color: isMonday ? "var(--text-muted)" : active ? "var(--text-primary)" : "var(--text-muted)",
                  fontSize: 12,
                  fontWeight: active ? 700 : 400,
                  cursor: isMonday ? "not-allowed" : "pointer",
                  opacity: isMonday ? 0.45 : 1,
                  fontFamily: "var(--font-inter), sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "all 0.15s",
                }}
              >
                {tab}
                {!isMonday && count > 0 && (
                  <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    background: active ? "var(--accent-coral)" : "var(--bg-surface)",
                    color: active ? "#fff" : "var(--text-muted)",
                    borderRadius: 10,
                    padding: "1px 6px",
                  }}>
                    {count}
                  </span>
                )}
                {isMonday && (
                  <span style={{ fontSize: 9, color: "var(--text-muted)", fontStyle: "italic" }}>soon</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 24px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 60 }}>
              <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Loading feedback…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60, gap: 8 }}>
              <p style={{ color: "var(--text-muted)", fontSize: 13, margin: 0 }}>
                {activeTab === "All" ? "No feedback found for this author." : `No ${activeTab} feedback found.`}
              </p>
              {activeTab !== "All" && (
                <button onClick={() => setActiveTab("All")} style={{ fontSize: 11, color: "var(--accent-coral)", background: "none", border: "none", cursor: "pointer" }}>
                  View all sources
                </button>
              )}
            </div>
          ) : (
            filtered.map((item) => <FeedbackItem key={item.id + item.timestamp} item={item} />)
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(modal, document.body) : null;
}
