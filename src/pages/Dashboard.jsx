import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

// =============================================================================
// MOCK DATA — remplacez par des appels API quand Laravel est prêt
// =============================================================================

const STATS = [
  { label: "Budget Total",      value: "142 500 000 MAD", icon: "💰", color: "#3b82f6", delta: "+3.2% ce mois"   },
  { label: "Marchés Actifs",    value: "38",              icon: "📋", color: "#10b981", delta: "+5 nouveaux"     },
  { label: "Engagements",       value: "89 300 000 MAD",  icon: "📊", color: "#f59e0b", delta: "62.7% du budget" },
  { label: "Échéances Proches", value: "7",               icon: "⏰", color: "#ef4444", delta: "Dans 7 jours"    },
];

const RECENT_MARCHES = [
  { id: "M-2025-001", objet: "Réhabilitation RN6",          montant: 12400000, statut: "En cours",    type: "Travaux"     },
  { id: "M-2025-002", objet: "Étude impact RP403",           montant: 980000,   statut: "Attribution", type: "Études"      },
  { id: "M-2025-003", objet: "Fourniture signalisation",     montant: 3200000,  statut: "Visé",        type: "Fournitures" },
  { id: "M-2025-004", objet: "Mission contrôle Fès-Oujda",  montant: 7100000,  statut: "Clôturé",     type: "Services"    },
  { id: "M-2025-005", objet: "Entretien RR510",             montant: 5650000,  statut: "En cours",    type: "Travaux"     },
];

const ACTIVITES = [
  { icon: "✅", text: "Marché M-2025-003 visé par le contrôle",       time: "Il y a 2h"   },
  { icon: "📄", text: "Nouvelle loi de finance 2025 ajoutée",         time: "Il y a 5h"   },
  { icon: "👤", text: "Utilisateur Ahmed Benali activé",              time: "Hier 14:30"  },
  { icon: "📅", text: "Réunion de suivi RN6 planifiée",               time: "Hier 09:00"  },
  { icon: "🏗️", text: "Marché M-2025-001 — avancement 45%",          time: "Il y a 2j"   },
];

const STATUS_STYLE = {
  "En cours":    { bg: "rgba(59,130,246,0.12)",  color: "#93c5fd" },
  "Attribution": { bg: "rgba(234,179,8,0.12)",   color: "#fde047" },
  "Visé":        { bg: "rgba(16,185,129,0.12)",  color: "#6ee7b7" },
  "Clôturé":     { bg: "rgba(107,114,128,0.12)", color: "#d1d5db" },
};

const fmt = (n) => n.toLocaleString("fr-MA") + " MAD";

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

function StatCard({ label, value, icon, color, delta }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:   "var(--card-bg, #fff)",
        border:       `1px solid ${hov ? color : "var(--card-border, #e2e8f0)"}`,
        borderRadius: 14,
        padding:      "20px 22px",
        display:      "flex",
        alignItems:   "center",
        gap:          16,
        boxShadow:    hov ? `0 8px 24px ${color}22` : "0 2px 8px rgba(0,0,0,0.06)",
        transform:    hov ? "translateY(-3px)" : "none",
        transition:   "all 0.22s ease",
        cursor:       "default",
      }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 12, flexShrink: 0,
        background: `${color}18`,
        border:     `1px solid ${color}30`,
        display:    "flex", alignItems: "center", justifyContent: "center",
        fontSize:   "1.4rem",
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "1.2px",
          textTransform: "uppercase", color: "var(--text-secondary, #64748b)", marginBottom: 4 }}>
          {label}
        </div>
        <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text, #1e293b)",
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
  const s = STATUS_STYLE[statut] || { bg: "rgba(59,130,246,0.12)", color: "#93c5fd" };
  return (
    <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: "0.68rem",
      fontWeight: 700, background: s.bg, color: s.color, whiteSpace: "nowrap" }}>
      {statut}
    </span>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function Dashboard() {
  const { user } = useAuth();
  const [hovRow, setHovRow] = useState(null);

  const card = {
    background:   "var(--card-bg, #fff)",
    border:       "1px solid var(--card-border, #e2e8f0)",
    borderRadius: 14,
    overflow:     "hidden",
  };

  const th = {
    fontSize: "0.6rem", fontWeight: 800, letterSpacing: "1.4px",
    textTransform: "uppercase", color: "var(--text-secondary, #64748b)",
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 4px",
      fontFamily: "var(--font, 'Outfit', system-ui, sans-serif)" }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: "clamp(1.25rem,3vw,1.65rem)", fontWeight: 800,
          color: "var(--text, #1e293b)", letterSpacing: "-0.02em" }}>
          Tableau de Bord
        </h1>
        <p style={{ margin: "6px 0 0", fontSize: "0.85rem", color: "var(--text-secondary, #64748b)" }}>
          Bienvenue,{" "}
          <strong style={{ color: "var(--accent-color, #3b82f6)" }}>{user?.name}</strong>
          {" "}—{" "}
          {new Date().toLocaleDateString("fr-MA", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
          })}
        </p>
      </div>

      {/* ── Stat cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))",
        gap: 16, marginBottom: 28 }}>
        {STATS.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* ── Main grid: table + activités ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20,
        alignItems: "start" }}>

        {/* ── Marchés récents ── */}
        <div style={card}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--card-border,#e2e8f0)",
            display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700,
              color: "var(--text, #1e293b)" }}>Marchés Récents</h2>
            <span style={{ fontSize: "0.72rem", color: "var(--text-secondary,#64748b)",
              fontWeight: 600, background: "var(--card-border,#e2e8f0)",
              padding: "2px 10px", borderRadius: 20 }}>
              {RECENT_MARCHES.length} marchés
            </span>
          </div>

          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1.3fr 1fr 1fr",
            padding: "10px 20px", background: "rgba(0,0,0,0.02)",
            borderBottom: "1px solid var(--card-border,#e2e8f0)" }}>
            {["Référence","Objet","Montant","Type","Statut"].map((h) => (
              <div key={h} style={th}>{h}</div>
            ))}
          </div>

          {/* Rows */}
          {RECENT_MARCHES.map((m, i) => (
            <div key={m.id}
              onMouseEnter={() => setHovRow(m.id)}
              onMouseLeave={() => setHovRow(null)}
              style={{
                display:             "grid",
                gridTemplateColumns: "1fr 2fr 1.3fr 1fr 1fr",
                padding:             "13px 20px",
                borderBottom: i < RECENT_MARCHES.length - 1
                  ? "1px solid var(--card-border,#e2e8f0)" : "none",
                background:   hovRow === m.id ? "rgba(59,130,246,0.03)" : "transparent",
                transition:   "background 0.15s",
                alignItems:   "center",
                cursor:       "default",
              }}
            >
              <span style={{ fontSize: "0.72rem", fontWeight: 700,
                color: "var(--accent-color,#3b82f6)", fontFamily: "monospace" }}>
                {m.id}
              </span>
              <span style={{ fontSize: "0.8rem", color: "var(--text,#1e293b)", fontWeight: 500,
                paddingRight: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {m.objet}
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary,#64748b)", fontWeight: 600 }}>
                {fmt(m.montant)}
              </span>
              <span style={{ fontSize: "0.72rem", color: "var(--text-secondary,#64748b)" }}>
                {m.type}
              </span>
              <StatusBadge statut={m.statut} />
            </div>
          ))}
        </div>

        {/* ── Activités récentes ── */}
        <div style={card}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--card-border,#e2e8f0)" }}>
            <h2 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700,
              color: "var(--text,#1e293b)" }}>Activité Récente</h2>
          </div>
          <div style={{ padding: "8px 0" }}>
            {ACTIVITES.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12,
                padding: "12px 20px",
                borderBottom: i < ACTIVITES.length - 1
                  ? "1px solid var(--card-border,#e2e8f0)" : "none" }}>
                <span style={{ fontSize: "1.1rem", flexShrink: 0, marginTop: 1 }}>{a.icon}</span>
                <div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text,#1e293b)",
                    fontWeight: 500, lineHeight: 1.4 }}>{a.text}</div>
                  <div style={{ fontSize: "0.68rem", color: "var(--text-secondary,#64748b)",
                    marginTop: 3 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Responsive: stack on mobile ── */}
      <style>{`
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: 1fr 320px"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="gridTemplateColumns: 1fr 2fr"] {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}