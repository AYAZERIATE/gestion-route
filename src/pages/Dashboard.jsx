import React, { useState } from "react";
import { useAuth  } from "../contexts/AuthContext";

const STATS = [
  { label: "Budget Total",       value: "142 500 000 MAD", icon: "💰", color: "var(--blue-light)", delta: "+3.2%"  },
  { label: "Marchés Actifs",     value: "38",              icon: "📋", color: "var(--success)",    delta: "+5"     },
  { label: "Engagements",        value: "89 300 000 MAD",  icon: "📊", color: "var(--warning)",    delta: "62.7%"  },
  { label: "Échéances Proches",  value: "7",               icon: "⏰", color: "var(--danger)",     delta: "7 jours"},
];

const RECENT_MARCHES = [
  { id: "M-2025-001", objet: "Réhabilitation RN6",         montant: "12 400 000", statut: "En cours",    type: "Travaux"    },
  { id: "M-2025-002", objet: "Étude impact RP403",         montant: "980 000",    statut: "Attribution", type: "Études"     },
  { id: "M-2025-003", objet: "Fourniture signalisation",   montant: "3 200 000",  statut: "Visé",        type: "Fournitures"},
  { id: "M-2025-004", objet: "Mission contrôle Fès-Oujda", montant: "7 100 000",  statut: "Clôturé",     type: "Services"   },
  { id: "M-2025-005", objet: "Entretien RR510",            montant: "5 650 000",  statut: "En cours",    type: "Travaux"    },
];

const STATUS_COLORS = {
  "En cours":    { bg: "rgba(37,99,235,0.15)",   color: "#93c5fd" },
  "Attribution": { bg: "rgba(234,179,8,0.15)",   color: "#fde047" },
  "Visé":        { bg: "rgba(16,185,129,0.15)",  color: "#6ee7b7" },
  "Clôturé":     { bg: "rgba(107,114,128,0.15)", color: "#d1d5db" },
};

function StatCard({ label, value, icon, color, delta }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:    "var(--card)",
        border:        `1px solid ${hov ? "var(--border-hov)" : "var(--border)"}`,
        borderRadius:  14,
        padding:       "20px 22px",
        display:       "flex",
        alignItems:    "center",
        gap:           16,
        cursor:        "default",
        boxShadow:     hov ? "var(--shadow-md)" : "var(--shadow-sm)",
        transform:     hov ? "translateY(-2px)" : "none",
        transition:    "all 0.22s ease",
      }}
    >
      {}
      <div style={{
        width: 48, height: 48, borderRadius: 12, flexShrink: 0,
        background: `color-mix(in srgb, ${color} 15%, transparent)`,
        border:     `1px solid color-mix(in srgb, ${color} 35%, transparent)`,
        display:    "flex", alignItems: "center", justifyContent: "center",
        fontSize:   "1.4rem",
      }}>
        {icon}
      </div>
      {}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "1.2px",
          textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 }}>
          {label}
        </div>
        <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text)",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {value}
        </div>
        <div style={{ fontSize: "0.7rem", color, fontWeight: 600, marginTop: 3 }}>
          {delta}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ statut }) {
  const s = STATUS_COLORS[statut] || { bg: "rgba(38,92,190,0.15)", color: "var(--blue-light)" };
  return (
    <span style={{
      padding:      "3px 10px",
      borderRadius: 20,
      fontSize:     "0.68rem",
      fontWeight:   700,
      background:   s.bg,
      color:        s.color,
      whiteSpace:   "nowrap",
    }}>
      {statut}
    </span>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [hovRow, setHovRow] = useState(null);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", fontFamily: "var(--font)" }}>

      {/* ── Header  */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: "clamp(1.25rem, 3vw, 1.75rem)", fontWeight: 800,
          color: "var(--text)", letterSpacing: "-0.01em" }}>
          Tableau de Bord
        </h1>
        <p style={{ margin: "6px 0 0", fontSize: "0.85rem", color: "var(--text-dim)" }}>
          Bienvenue, <strong style={{ color: "var(--blue-light)" }}>{user?.name}</strong>
          {" "}— {new Date().toLocaleDateString("fr-MA", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
        </p>
      </div>

      {/* ── Stat cards ────────────────────────────────────────────────────── */}
      <div style={{
        display:             "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap:                 16,
        marginBottom:        28,
      }}>
        {STATS.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* ── Recent marchés table ──────────────────────────────────────────── */}
      <div style={{
        background: "var(--card)",
        border:     "1px solid var(--border)",
        borderRadius: 14,
        overflow:   "hidden",
      }}>
        {/* Table header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--divider)",
          display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "var(--text)" }}>
            Marchés Récents
          </h2>
          <span style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 600,
            letterSpacing: "0.05em" }}>
            {RECENT_MARCHES.length} marchés
          </span>
        </div>

        {/* Column headers */}
        <div style={{
          display:             "grid",
          gridTemplateColumns: "1fr 2fr 1.2fr 1fr 1fr",
          padding:             "10px 20px",
          background:          "var(--surface-alt)",
          borderBottom:        "1px solid var(--divider)",
        }}>
          {["Référence", "Objet", "Montant (MAD)", "Type", "Statut"].map(h => (
            <div key={h} style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "1.4px",
              textTransform: "uppercase", color: "var(--muted)" }}>
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        {RECENT_MARCHES.map((m, i) => (
          <div
            key={m.id}
            onMouseEnter={() => setHovRow(m.id)}
            onMouseLeave={() => setHovRow(null)}
            style={{
              display:             "grid",
              gridTemplateColumns: "1fr 2fr 1.2fr 1fr 1fr",
              padding:             "12px 20px",
              borderBottom:        i < RECENT_MARCHES.length - 1 ? "1px solid var(--divider)" : "none",
              background:          hovRow === m.id ? "var(--surface-alt)" : "transparent",
              transition:          "background 0.15s",
              alignItems:          "center",
              cursor:              "default",
            }}
          >
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--blue-light)",
              fontFamily: "monospace" }}>
              {m.id}
            </span>
            <span style={{ fontSize: "0.8rem", color: "var(--text)", fontWeight: 500,
              paddingRight: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {m.objet}
            </span>
            <span style={{ fontSize: "0.78rem", color: "var(--text-dim)", fontWeight: 600 }}>
              {Number(m.montant).toLocaleString("fr-MA")}
            </span>
            <span style={{ fontSize: "0.72rem", color: "var(--label)" }}>
              {m.type}
            </span>
            <StatusBadge statut={m.statut} />
          </div>
        ))}
      </div>

    </div>
  );
}