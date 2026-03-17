import React, { useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useFinance } from "../contexts/FinanceContext";
import { useMarche } from "../contexts/MarcheContext";

// =============================================================================
// MOCK DATA — remplacez par des appels API quand Laravel est prêt
// =============================================================================

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
        background:   "#1e3a8a",
        border:       `1px solid ${hov ? "rgba(255,255,255,0.26)" : "rgba(255,255,255,0.14)"}`,
        borderRadius: 14,
        padding:      "20px 22px",
        display:      "flex",
        alignItems:   "center",
        gap:          16,
        boxShadow:    hov ? "0 10px 28px rgba(0,0,0,0.35)" : "0 2px 10px rgba(0,0,0,0.25)",
        transform:    hov ? "translateY(-3px)" : "none",
        transition:   "all 0.22s ease",
        cursor:       "default",
      }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 12, flexShrink: 0,
        background: "rgba(255,255,255,0.12)",
        border:     "1px solid rgba(255,255,255,0.18)",
        display:    "flex", alignItems: "center", justifyContent: "center",
        fontSize:   "1.4rem",
        color: "#fff",
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "1.2px",
          textTransform: "uppercase", color: "#fff", opacity: 0.85, marginBottom: 4 }}>
          {label}
        </div>
        <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#fff",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {value}
        </div>
        <div style={{ fontSize: "0.7rem", color: "#fff", fontWeight: 600, marginTop: 3, opacity: 0.92 }}>
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
  const { totals } = useFinance();
  const { marches, stats } = useMarche();
  const [hovRow, setHovRow] = useState(null);

  const kpis = useMemo(() => {
    const BLUE_CIEL = "#38bdf8";
    const fmtMoney = (n) =>
      `${Number(n || 0).toLocaleString("fr-MA", { maximumFractionDigits: 0 })} MAD`;

    return [
      {
        label: "Budget Total",
        value: fmtMoney(totals.dotation),
        icon: "💰",
        color: BLUE_CIEL,
        delta: `${totals.txPaye.toFixed(1)}% payé`,
      },
      {
        label: "Marchés Actifs",
        value: String(stats.actifs),
        icon: "📋",
        color: BLUE_CIEL,
        delta: `${stats.total} au total`,
      },
      {
        label: "Engagements",
        value: fmtMoney(totals.engage),
        icon: "📊",
        color: BLUE_CIEL,
        delta: `${totals.txEngage.toFixed(1)}% du budget`,
      },
      {
        label: "Échéances Proches",
        value: "—",
        icon: "⏰",
        color: BLUE_CIEL,
        delta: "À connecter (Schedule)",
      },
    ];
  }, [stats.actifs, stats.total, totals.dotation, totals.engage, totals.txEngage, totals.txPaye]);

  const card = {
    background:   "var(--card-bg, #fff)",
    border:       "1px solid var(--card-border, #e2e8f0)",
    borderRadius: 14,
    overflow:     "hidden",
  };

  const tableCard = {
    background: "#1e3a8a",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 14,
    overflow: "hidden",
  };

  const th = {
    fontSize: "0.6rem", fontWeight: 800, letterSpacing: "1.4px",
    textTransform: "uppercase", color: "#fff", opacity: 0.85,
  };

  return (
    <div
      aria-label={user?.name ? `Dashboard de ${user.name}` : "Dashboard"}
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 4px",
        fontFamily: "var(--font, 'Outfit', system-ui, sans-serif)",
      }}
    >

      {/* ── Header ── */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: "clamp(1.25rem,3vw,1.65rem)", fontWeight: 800,
          color: "var(--text, #1e293b)", letterSpacing: "-0.02em" }}>
          Tableau de Bord
        </h1>
      </div>

      {/* ── Stat cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))",
        gap: 16, marginBottom: 28 }}>
        {kpis.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* ── Main grid: table + activités ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20,
        alignItems: "start" }}>

        {/* ── Marchés récents ── */}
        <div style={tableCard}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.14)",
            display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700,
              color: "#fff" }}>Marchés Récents</h2>
            <span style={{ fontSize: "0.72rem", color: "#fff",
              fontWeight: 600, background: "rgba(255,255,255,0.14)",
              padding: "2px 10px", borderRadius: 20 }}>
              {marches.length} marchés
            </span>
          </div>

          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1.3fr 1fr 1fr",
            padding: "10px 20px", background: "rgba(255,255,255,0.08)",
            borderBottom: "1px solid rgba(255,255,255,0.14)" }}>
            {["Référence","Objet","Montant","Type","Statut"].map((h) => (
              <div key={h} style={th}>{h}</div>
            ))}
          </div>

          {/* Rows */}
          {stats.top5.map((m, i) => (
            <div key={m.id}
              onMouseEnter={() => setHovRow(m.id)}
              onMouseLeave={() => setHovRow(null)}
              style={{
                display:             "grid",
                gridTemplateColumns: "1fr 2fr 1.3fr 1fr 1fr",
                padding:             "13px 20px",
                borderBottom: i < stats.top5.length - 1
                  ? "1px solid rgba(255,255,255,0.12)" : "none",
                background:   hovRow === m.id ? "rgba(255,255,255,0.06)" : "transparent",
                transition:   "background 0.15s",
                alignItems:   "center",
                cursor:       "default",
              }}
            >
              <span style={{ fontSize: "0.72rem", fontWeight: 700,
                color: "rgba(255,255,255,0.92)", fontFamily: "monospace" }}>
                {m.id}
              </span>
              <span style={{ fontSize: "0.8rem", color: "#fff", fontWeight: 500,
                paddingRight: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {m.objet}
              </span>
              <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>
                {fmt(m.montant)}
              </span>
              <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.82)" }}>
                {m.type}
              </span>
              <StatusBadge statut={m.statut} />
            </div>
          ))}

          {stats.top5.length === 0 && (
            <div style={{
              padding: "18px 20px",
              color: "rgba(255,255,255,0.85)",
              fontSize: "0.8rem",
            }}>
              Aucun marché pour le moment. Ajoutez-en dans « Gestion Marché ».
            </div>
          )}
        </div>

        {/* ── Activités récentes ── */}
        <div style={tableCard}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.14)" }}>
            <h2 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700,
              color: "#fff" }}>Activité Récente</h2>
          </div>
          <div style={{ padding: "8px 0" }}>
            {ACTIVITES.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12,
                padding: "12px 20px",
                borderBottom: i < ACTIVITES.length - 1
                  ? "1px solid rgba(255,255,255,0.12)" : "none" }}>
                <span style={{ fontSize: "1.1rem", flexShrink: 0, marginTop: 1 }}>{a.icon}</span>
                <div>
                  <div style={{ fontSize: "0.78rem", color: "#fff",
                    fontWeight: 500, lineHeight: 1.4 }}>{a.text}</div>
                  <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.78)",
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
