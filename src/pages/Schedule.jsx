import React, { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS — cohérent avec Sidebar / Footer / MarketForm CNER
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  bg:          "#020b1e",
  surface:     "rgba(8, 18, 46, 0.92)",
  surfaceAlt:  "rgba(12, 24, 58, 0.85)",
  card:        "rgba(10, 20, 50, 0.95)",
  border:      "rgba(38, 92, 190, 0.18)",
  borderHov:   "rgba(67, 138, 255, 0.4)",
  glow:        "0 0 0 3px rgba(38,92,190,0.16)",
  blue:        "#2a6cd4",
  blueLight:   "#60a5fa",
  blueDim:     "#1a3e8c",
  label:       "#3a608e",
  text:        "#b8d4f8",
  textDim:     "#5a80a8",
  muted:       "#1e3a5a",
  divider:     "rgba(38,92,190,0.12)",
  font:        "'DM Sans','Segoe UI',system-ui,sans-serif",
  // event palette
  attribution: { bg: "rgba(37,99,235,0.18)",  border: "#2563eb", text: "#93c5fd", dot: "#3b82f6" },
  visa:        { bg: "rgba(234,179,8,0.15)",   border: "#ca8a04", text: "#fde047", dot: "#eab308" },
  approbation: { bg: "rgba(16,185,129,0.15)",  border: "#059669", text: "#6ee7b7", dot: "#10b981" },
  commencement:{ bg: "rgba(139,92,246,0.18)",  border: "#7c3aed", text: "#c4b5fd", dot: "#8b5cf6" },
  pvrd:        { bg: "rgba(239,68,68,0.15)",   border: "#dc2626", text: "#fca5a5", dot: "#ef4444" },
  caution:     { bg: "rgba(249,115,22,0.15)",  border: "#ea580c", text: "#fdba74", dot: "#f97316" },
  // status
  urgent:      "#ef4444",
  warning:     "#f59e0b",
  ok:          "#10b981",
  done:        "#6b7280",
};

const EVENT_TYPES = {
  attribution:  { label: "Attribution",         ...T.attribution },
  visa:         { label: "Visa",                ...T.visa        },
  approbation:  { label: "Approbation",         ...T.approbation },
  commencement: { label: "Commencement",        ...T.commencement},
  pvrd:         { label: "PVRD",                ...T.pvrd        },
  caution:      { label: "Libération Cautions", ...T.caution     },
};

const TIMELINE_STEPS = ["attribution","visa","approbation","commencement","pvrd","caution"];

// ─────────────────────────────────────────────────────────────────────────────
// SAMPLE DATA — 6 marchés avec toutes leurs dates
// ─────────────────────────────────────────────────────────────────────────────
const offset = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};

const SAMPLE_MARCHES = [
  {
    id: 1,
    objet: "Réhabilitation RN1 — Lot A",
    rubrique: "Infrastructure",
    loiFinance: "LF-2024",
    beneficiaire: "STGS Maroc",
    montant: 4500000,
    dates: {
      attribution:  offset(-90),
      visa:         offset(-75),
      approbation:  offset(-60),
      commencement: offset(-45),
      pvrd:         offset(30),
      caution:      offset(60),
    },
  },
  {
    id: 2,
    objet: "Études géotechniques RP7",
    rubrique: "Études",
    loiFinance: "LF-2024",
    beneficiaire: "BET Ingénierie",
    montant: 780000,
    dates: {
      attribution:  offset(-30),
      visa:         offset(-15),
      approbation:  offset(-5),
      commencement: offset(2),
      pvrd:         offset(90),
      caution:      offset(120),
    },
  },
  {
    id: 3,
    objet: "Construction pont RR204",
    rubrique: "Ouvrages d'art",
    loiFinance: "LF-2025",
    beneficiaire: "TPCM Construction",
    montant: 12000000,
    dates: {
      attribution:  offset(-10),
      visa:         offset(1),
      approbation:  offset(15),
      commencement: offset(30),
      pvrd:         offset(180),
      caution:      offset(240),
    },
  },
  {
    id: 4,
    objet: "Signalisation horizontale autoroute",
    rubrique: "Sécurité routière",
    loiFinance: "LF-2025",
    beneficiaire: "SafeRoad SARL",
    montant: 2200000,
    dates: {
      attribution:  offset(-120),
      visa:         offset(-100),
      approbation:  offset(-80),
      commencement: offset(-60),
      pvrd:         offset(-5),
      caution:      offset(20),
    },
  },
  {
    id: 5,
    objet: "Audit sécurité réseau routier",
    rubrique: "Études",
    loiFinance: "LF-2024",
    beneficiaire: "Cabinet RouteSecure",
    montant: 350000,
    dates: {
      attribution:  offset(-200),
      visa:         offset(-185),
      approbation:  offset(-170),
      commencement: offset(-155),
      pvrd:         offset(-20),
      caution:      offset(-5),
    },
  },
  {
    id: 6,
    objet: "Travaux d'entretien RP12",
    rubrique: "Entretien",
    loiFinance: "LF-2025",
    beneficiaire: "Entrep. Al Bina",
    montant: 1800000,
    dates: {
      attribution:  offset(5),
      visa:         offset(20),
      approbation:  offset(35),
      commencement: offset(50),
      pvrd:         offset(150),
      caution:      offset(180),
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────────────────────────────────────
const today    = () => new Date().toISOString().split("T")[0];
const diffDays = (dateStr) => {
  const now = new Date(); now.setHours(0,0,0,0);
  const d   = new Date(dateStr); d.setHours(0,0,0,0);
  return Math.round((d - now) / 86400000);
};
const fmt = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-MA", { day:"2-digit", month:"short", year:"numeric" });
};
const fmtShort = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-MA", { day:"2-digit", month:"short" });
};
const getStatus = (dateStr) => {
  const diff = diffDays(dateStr);
  if (diff < 0)  return "late";
  if (diff <= 3) return "urgent";
  return "ok";
};

// Flatten all dates into event list
const buildEvents = (marches) => {
  const events = [];
  marches.forEach(m => {
    Object.entries(m.dates).forEach(([type, date]) => {
      if (date) events.push({ ...m, type, date, id: `${m.id}-${type}` });
    });
  });
  return events.sort((a,b) => a.date.localeCompare(b.date));
};

// Month calendar helpers
const getDaysInMonth = (year, month) => new Date(year, month+1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

// ─────────────────────────────────────────────────────────────────────────────
// ICONS (inline SVG)
// ─────────────────────────────────────────────────────────────────────────────
const Icon = ({ path, size=16, color="currentColor", style={} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"
    style={{ display:"block", flexShrink:0, ...style }}>
    <path d={path}/>
  </svg>
);
const ICONS = {
  calendar:  "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  alert:     "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  check:     "M20 6 9 17l-5-5",
  clock:     "M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zM12 6v6l4 2",
  filter:    "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  export:    "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
  plus:      "M12 5v14M5 12h14",
  chevronL:  "M15 18l-6-6 6-6",
  chevronR:  "M9 18l6-6-6-6",
  list:      "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  timeline:  "M12 20V10M18 20V4M6 20v-4",
  navigate:  "M3 12h18M12 5l7 7-7 7",
  close:     "M18 6L6 18M6 6l12 12",
  warning:   "M12 9v4M12 17h.01",
  money:     "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2",
};

// ─────────────────────────────────────────────────────────────────────────────
// SMALL REUSABLE ATOMS
// ─────────────────────────────────────────────────────────────────────────────
const Badge = ({ type }) => {
  const ev = EVENT_TYPES[type] || EVENT_TYPES.attribution;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:5,
      padding:"2px 9px", borderRadius:20,
      fontSize:"0.62rem", fontWeight:700, letterSpacing:"0.06em",
      textTransform:"uppercase",
      background: ev.bg, border:`1px solid ${ev.border}`, color: ev.text,
    }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:ev.dot, flexShrink:0 }}/>
      {ev.label}
    </span>
  );
};

const StatusPill = ({ dateStr }) => {
  const diff = diffDays(dateStr);
  const status = getStatus(dateStr);
  const cfg = status === "late"
    ? { color: T.urgent,  label: `${Math.abs(diff)}j de retard`, bg: "rgba(239,68,68,0.12)",  border: "rgba(239,68,68,0.3)" }
    : status === "urgent"
    ? { color: T.warning, label: `J-${diff}`,                    bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)" }
    : { color: T.ok,      label: `J+${diff}`,                    bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.25)" };
  return (
    <span style={{
      padding:"2px 8px", borderRadius:20, fontSize:"0.62rem", fontWeight:700,
      background: cfg.bg, border:`1px solid ${cfg.border}`, color: cfg.color,
    }}>
      {cfg.label}
    </span>
  );
};

const Btn = ({ onClick, children, icon, variant="ghost", color }) => {
  const [hov, setHov] = useState(false);
  const col = color || T.blueLight;
  const styles = {
    ghost: {
      background: hov ? `${col}18` : "transparent",
      border: `1.5px solid ${hov ? col : T.border}`,
      color: hov ? col : T.label,
    },
    primary: {
      background: hov ? "#1a5ad4" : T.blue,
      border: `1.5px solid ${hov ? "#4a8aff" : T.blue}`,
      color: "#fff",
    },
  };
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display:"flex", alignItems:"center", gap:6,
        padding:"8px 14px", borderRadius:9,
        fontFamily: T.font, fontSize:"0.75rem", fontWeight:700,
        letterSpacing:"0.05em", textTransform:"uppercase",
        cursor:"pointer", outline:"none", transition:"all 0.18s",
        ...styles[variant],
      }}>
      {icon && <Icon path={icon} size={14}/>}
      {children}
    </button>
  );
};

const SectionTitle = ({ icon, children, count }) => (
  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
    <Icon path={icon} size={14} color={T.blueLight}/>
    <span style={{ fontSize:"0.65rem", fontWeight:800, letterSpacing:"2px",
      textTransform:"uppercase", color: T.label }}>
      {children}
    </span>
    {count !== undefined && (
      <span style={{
        marginLeft:"auto", minWidth:20, height:18, borderRadius:10,
        background:"rgba(38,92,190,0.2)", border:`1px solid ${T.border}`,
        color: T.blueLight, fontSize:"0.6rem", fontWeight:700,
        display:"flex", alignItems:"center", justifyContent:"center", padding:"0 6px",
      }}>
        {count}
      </span>
    )}
  </div>
);

const Divider = () => (
  <div style={{ height:1, background: T.divider, margin:"16px 0" }}/>
);

// ─────────────────────────────────────────────────────────────────────────────
// EVENT CARD
// ─────────────────────────────────────────────────────────────────────────────
const EventCard = ({ event, onClick, selected }) => {
  const [hov, setHov] = useState(false);
  const ev = EVENT_TYPES[event.type];
  const borderCol = selected ? ev.border : hov ? ev.border : T.border;
  return (
    <div onClick={() => onClick(event)}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        padding:"11px 13px", borderRadius:11, cursor:"pointer",
        background: selected ? ev.bg : hov ? "rgba(38,92,190,0.07)" : "transparent",
        border:`1.5px solid ${borderCol}`,
        transition:"all 0.18s",
        marginBottom:8,
      }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:6, marginBottom:6 }}>
        <span style={{ fontSize:"0.78rem", fontWeight:600, color: T.text, lineHeight:1.4, flex:1 }}>
          {event.objet}
        </span>
        <Badge type={event.type}/>
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ fontSize:"0.7rem", color: T.textDim }}>
          {event.beneficiaire}
        </span>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ fontSize:"0.7rem", color: T.label }}>{fmt(event.date)}</span>
          <StatusPill dateStr={event.date}/>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// TIMELINE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const TimelineRow = ({ marche }) => {
  const steps = TIMELINE_STEPS;
  const today_ = today();
  return (
    <div style={{
      background: T.surfaceAlt, border:`1px solid ${T.border}`,
      borderRadius:12, padding:"14px 16px", marginBottom:10,
    }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
        <div>
          <div style={{ fontSize:"0.82rem", fontWeight:700, color: T.text }}>{marche.objet}</div>
          <div style={{ fontSize:"0.68rem", color: T.textDim }}>{marche.beneficiaire} · {marche.loiFinance}</div>
        </div>
        <div style={{ fontSize:"0.72rem", fontWeight:700, color: T.blueLight }}>
          {Number(marche.montant).toLocaleString("fr-MA")} MAD
        </div>
      </div>
      {/* Steps */}
      <div style={{ display:"flex", alignItems:"center", gap:0, position:"relative" }}>
        {steps.map((step, i) => {
          const date = marche.dates[step];
          const past  = date && date <= today_;
          const curr  = date && getStatus(date) === "urgent";
          const late  = date && getStatus(date) === "late";
          const ev    = EVENT_TYPES[step];
          return (
            <React.Fragment key={step}>
              {/* connector */}
              {i > 0 && (
                <div style={{
                  flex:1, height:2,
                  background: past ? ev.border : T.divider,
                  transition:"background 0.3s",
                }}/>
              )}
              {/* dot + label */}
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, minWidth:0 }}>
                <div style={{
                  width:28, height:28, borderRadius:"50%", flexShrink:0,
                  border:`2px solid ${late ? T.urgent : curr ? T.warning : past ? ev.border : T.border}`,
                  background: past ? ev.bg : "rgba(4,9,22,0.6)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow: past ? `0 0 10px ${ev.border}55` : "none",
                  transition:"all 0.3s",
                }}>
                  {past ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke={ev.dot} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : (
                    <div style={{ width:8, height:8, borderRadius:"50%",
                      background: late ? T.urgent : curr ? T.warning : T.muted }}/>
                  )}
                </div>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:"0.58rem", fontWeight:700, color: ev.text,
                    whiteSpace:"nowrap", letterSpacing:"0.04em" }}>
                    {ev.label.split(" ")[0]}
                  </div>
                  <div style={{ fontSize:"0.55rem", color: T.textDim }}>
                    {date ? fmtShort(date) : "—"}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CALENDAR GRID
// ─────────────────────────────────────────────────────────────────────────────
const CalendarView = ({ events, onSelect, selectedDate, onDateChange }) => {
  const [year,  setYear]  = useState(() => new Date().getFullYear());
  const [month, setMonth] = useState(() => new Date().getMonth());

  const daysInMonth  = getDaysInMonth(year, month);
  const firstDayOfMonth = (getFirstDayOfMonth(year, month) + 6) % 7; // Monday first
  const todayStr = today();

  const eventsByDate = useMemo(() => {
    const map = {};
    events.forEach(ev => {
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    });
    return map;
  }, [events]);

  const MONTHS_FR = ["Janvier","Février","Mars","Avril","Mai","Juin",
                     "Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
  const DAYS_FR   = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y-1); } else setMonth(m => m-1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y+1); } else setMonth(m => m+1); };

  return (
    <div style={{
      background: T.card, border:`1px solid ${T.border}`,
      borderRadius:14, padding:"20px 18px", height:"100%",
    }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
        <Btn icon={ICONS.chevronL} onClick={prevMonth}/>
        <span style={{ fontSize:"1rem", fontWeight:800, color: T.text, letterSpacing:"0.04em" }}>
          {MONTHS_FR[month]} {year}
        </span>
        <Btn icon={ICONS.chevronR} onClick={nextMonth}/>
      </div>

      {/* Day headers */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, marginBottom:6 }}>
        {DAYS_FR.map(d => (
          <div key={d} style={{ textAlign:"center", fontSize:"0.6rem", fontWeight:700,
            letterSpacing:"1px", color: T.muted, padding:"4px 0" }}>{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3 }}>
        {/* Empty cells */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`e${i}`} style={{ aspectRatio:"1", borderRadius:8 }}/>
        ))}
        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day  = i + 1;
          const dateStr = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
          const dayEvs  = eventsByDate[dateStr] || [];
          const isToday = dateStr === todayStr;
          const isSel   = dateStr === selectedDate;
          const hasLate = dayEvs.some(ev => getStatus(ev.date) === "late");
          const hasUrg  = dayEvs.some(ev => getStatus(ev.date) === "urgent");

          return (
            <div key={day}
              onClick={() => dayEvs.length && onSelect(dateStr, dayEvs)}
              style={{
                aspectRatio:"1",
                borderRadius:8,
                padding:"3px 2px",
                background: isSel ? "rgba(42,108,212,0.25)" : isToday ? "rgba(38,92,190,0.12)" : "transparent",
                border: `1.5px solid ${isSel ? T.blue : isToday ? T.border : "transparent"}`,
                cursor: dayEvs.length ? "pointer" : "default",
                position:"relative", overflow:"hidden",
                transition:"all 0.15s",
              }}>
              <div style={{
                textAlign:"center", fontSize:"0.68rem", fontWeight: isToday ? 800 : 500,
                color: isToday ? T.blueLight : T.textDim, lineHeight:1,
              }}>{day}</div>
              {/* event dots */}
              {dayEvs.length > 0 && (
                <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center",
                  gap:1.5, marginTop:2, padding:"0 1px" }}>
                  {dayEvs.slice(0,4).map(ev => (
                    <div key={ev.id} style={{
                      width:5, height:5, borderRadius:"50%",
                      background: EVENT_TYPES[ev.type]?.dot || T.blue,
                      boxShadow: hasLate ? `0 0 4px ${T.urgent}` : hasUrg ? `0 0 4px ${T.warning}` : "none",
                    }}/>
                  ))}
                  {dayEvs.length > 4 && (
                    <span style={{ fontSize:"0.48rem", color: T.label, fontWeight:700 }}>
                      +{dayEvs.length-4}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <Divider/>
      <div style={{ display:"flex", flexWrap:"wrap", gap:"8px 14px" }}>
        {Object.entries(EVENT_TYPES).map(([key, ev]) => (
          <div key={key} style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background: ev.dot }}/>
            <span style={{ fontSize:"0.6rem", color: T.textDim }}>{ev.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SIDE PANEL — upcoming / late / done
// ─────────────────────────────────────────────────────────────────────────────
const SidePanel = ({ events, onSelectEvent, selectedEvent }) => {
  const now = today();

  const late     = events.filter(ev => ev.date < now).sort((a,b) => b.date.localeCompare(a.date));
  const upcoming = events.filter(ev => { const d = diffDays(ev.date); return d >= 0 && d <= 7; })
                         .sort((a,b) => a.date.localeCompare(b.date));
  const future   = events.filter(ev => diffDays(ev.date) > 7)
                         .sort((a,b) => a.date.localeCompare(b.date)).slice(0,6);

  const AlertBanner = ({ count, label, color, bg, border }) => count === 0 ? null : (
    <div style={{
      display:"flex", alignItems:"center", gap:8, padding:"8px 12px",
      borderRadius:9, background: bg, border:`1px solid ${border}`,
      marginBottom:10,
    }}>
      <Icon path={ICONS.alert} size={13} color={color}/>
      <span style={{ fontSize:"0.72rem", fontWeight:700, color }}>{count} {label}</span>
    </div>
  );

  return (
    <div style={{
      display:"flex", flexDirection:"column", gap:0,
      background: T.card, border:`1px solid ${T.border}`,
      borderRadius:14, padding:"18px 14px", height:"100%", overflowY:"auto",
    }}>
      {/* Alert banners */}
      <AlertBanner count={late.length}     label="en retard"   color={T.urgent}  bg="rgba(239,68,68,0.08)"  border="rgba(239,68,68,0.2)"/>
      <AlertBanner count={upcoming.filter(e=>diffDays(e.date)<=3).length}
        label="urgents (<3j)" color={T.warning} bg="rgba(245,158,11,0.08)" border="rgba(245,158,11,0.2)"/>

      {/* Late */}
      {late.length > 0 && (
        <>
          <SectionTitle icon={ICONS.alert} count={late.length}>En retard</SectionTitle>
          {late.slice(0,4).map(ev => <EventCard key={ev.id} event={ev} onClick={onSelectEvent}
            selected={selectedEvent?.id === ev.id}/>)}
          {late.length > 4 && (
            <p style={{ fontSize:"0.68rem", color: T.textDim, textAlign:"center" }}>
              +{late.length-4} autres…
            </p>
          )}
          <Divider/>
        </>
      )}

      {/* Upcoming 7 days */}
      <SectionTitle icon={ICONS.clock} count={upcoming.length}>7 prochains jours</SectionTitle>
      {upcoming.length === 0
        ? <p style={{ fontSize:"0.72rem", color: T.textDim }}>Aucun événement cette semaine.</p>
        : upcoming.map(ev => <EventCard key={ev.id} event={ev} onClick={onSelectEvent}
            selected={selectedEvent?.id === ev.id}/>)
      }
      <Divider/>

      {/* Future */}
      <SectionTitle icon={ICONS.list} count={future.length}>À venir</SectionTitle>
      {future.map(ev => <EventCard key={ev.id} event={ev} onClick={onSelectEvent}
        selected={selectedEvent?.id === ev.id}/>)}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DETAIL MODAL
// ─────────────────────────────────────────────────────────────────────────────
const DetailModal = ({ event, onClose }) => {
  if (!event) return null;
  const marche = SAMPLE_MARCHES.find(m => m.id === event.id) || event;
  const ev = EVENT_TYPES[event.type];

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:1000,
      background:"rgba(0,4,18,0.75)", backdropFilter:"blur(6px)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:20,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background:"rgba(8,18,48,0.98)", border:`1.5px solid ${ev.border}`,
        borderRadius:16, padding:"28px 26px", width:"100%", maxWidth:480,
        boxShadow:`0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px ${ev.border}33`,
      }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:18 }}>
          <div>
            <Badge type={event.type}/>
            <h2 style={{ margin:"8px 0 4px", fontSize:"1rem", fontWeight:800,
              color: T.text, fontFamily: T.font }}>{event.objet}</h2>
            <span style={{ fontSize:"0.72rem", color: T.textDim }}>{event.beneficiaire}</span>
          </div>
          <button onClick={onClose} style={{
            background:"transparent", border:"none", cursor:"pointer",
            color: T.label, padding:4,
          }}>
            <Icon path={ICONS.close} size={18}/>
          </button>
        </div>
        <Divider/>
        {/* Details grid */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 20px" }}>
          {[
            ["Date", fmt(event.date)],
            ["Statut", (() => { const d=diffDays(event.date); return d<0?`${Math.abs(d)}j retard`:d===0?"Aujourd'hui":`Dans ${d}j`; })()],
            ["Loi de Finance", event.loiFinance || "—"],
            ["Rubrique", event.rubrique || "—"],
            ["Montant", `${Number(event.montant||0).toLocaleString("fr-MA")} MAD`],
            ["Bénéficiaire", event.beneficiaire],
          ].map(([lbl, val]) => (
            <div key={lbl}>
              <div style={{ fontSize:"0.6rem", fontWeight:700, letterSpacing:"1.5px",
                textTransform:"uppercase", color: T.muted, marginBottom:3 }}>{lbl}</div>
              <div style={{ fontSize:"0.82rem", color: T.text, fontWeight:600 }}>{val}</div>
            </div>
          ))}
        </div>
        <Divider/>
        {/* All dates for this marché */}
        <div style={{ fontSize:"0.62rem", fontWeight:700, letterSpacing:"1.5px",
          textTransform:"uppercase", color: T.muted, marginBottom:10 }}>
          Toutes les dates du marché
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {TIMELINE_STEPS.map(step => {
            const date = marche.dates?.[step];
            const isThis = step === event.type;
            const etev = EVENT_TYPES[step];
            return (
              <div key={step} style={{
                display:"flex", alignItems:"center", justifyContent:"space-between",
                padding:"6px 10px", borderRadius:8,
                background: isThis ? etev.bg : "transparent",
                border:`1px solid ${isThis ? etev.border : "transparent"}`,
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:7,height:7,borderRadius:"50%",background:etev.dot }}/>
                  <span style={{ fontSize:"0.72rem", color: isThis ? etev.text : T.textDim,
                    fontWeight: isThis ? 700 : 400 }}>{etev.label}</span>
                </div>
                <span style={{ fontSize:"0.72rem", color: isThis ? etev.text : T.label }}>
                  {date ? fmt(date) : "—"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FILTER BAR
// ─────────────────────────────────────────────────────────────────────────────
const FilterSelect = ({ label, value, onChange, options }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:4, minWidth:150 }}>
    <label style={{ fontSize:"0.58rem", fontWeight:700, letterSpacing:"1.5px",
      textTransform:"uppercase", color: T.muted, fontFamily: T.font }}>{label}</label>
    <div style={{ position:"relative" }}>
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        width:"100%", padding:"7px 30px 7px 11px", borderRadius:9,
        background:"rgba(4,9,22,0.8)", border:`1.5px solid ${T.border}`,
        color: T.text, fontFamily: T.font, fontSize:"0.78rem",
        outline:"none", appearance:"none", cursor:"pointer",
      }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <Icon path="M6 9l6 6 6-6" size={12} color={T.label} style={{
        position:"absolute", right:9, top:"50%", transform:"translateY(-50%)",
        pointerEvents:"none",
      }}/>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon, color, sub }) => (
  <div style={{
    background: T.surfaceAlt, border:`1px solid ${T.border}`,
    borderRadius:12, padding:"14px 16px",
    display:"flex", alignItems:"center", gap:14,
  }}>
    <div style={{
      width:40, height:40, borderRadius:10, flexShrink:0,
      background:`${color}18`, border:`1px solid ${color}44`,
      display:"flex", alignItems:"center", justifyContent:"center",
    }}>
      <Icon path={icon} size={18} color={color}/>
    </div>
    <div>
      <div style={{ fontSize:"1.35rem", fontWeight:800, color, fontFamily: T.font, lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:"0.65rem", color: T.textDim, marginTop:2 }}>{label}</div>
      {sub && <div style={{ fontSize:"0.6rem", color: T.muted, marginTop:1 }}>{sub}</div>}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function Schedule({ onNavigate }) {
  const [view,          setView]         = useState("calendar"); // calendar | timeline | list
  const [filterLF,      setFilterLF]     = useState("all");
  const [filterRub,     setFilterRub]    = useState("all");
  const [filterBen,     setFilterBen]    = useState("all");
  const [filterType,    setFilterType]   = useState("all");
  const [selectedEvent, setSelectedEvent]= useState(null);
  const [selectedDate,  setSelectedDate] = useState(null);
  const [selectedDayEvs,setSelectedDayEvs]=useState([]);
  const [hovRow,        setHovRow]       = useState(null);

  // Unique filter options
  const loiOptions  = [{ value:"all", label:"Toutes les lois" },
    ...Array.from(new Set(SAMPLE_MARCHES.map(m=>m.loiFinance))).map(v=>({ value:v, label:v }))];
  const rubOptions  = [{ value:"all", label:"Toutes rubriques" },
    ...Array.from(new Set(SAMPLE_MARCHES.map(m=>m.rubrique))).map(v=>({ value:v, label:v }))];
  const benOptions  = [{ value:"all", label:"Tous bénéficiaires" },
    ...Array.from(new Set(SAMPLE_MARCHES.map(m=>m.beneficiaire))).map(v=>({ value:v, label:v }))];
  const typeOptions = [{ value:"all", label:"Tous les types" },
    ...Object.entries(EVENT_TYPES).map(([k,v])=>({ value:k, label:v.label }))];

  const filteredMarches = useMemo(() => SAMPLE_MARCHES.filter(m => (
    (filterLF  === "all" || m.loiFinance   === filterLF) &&
    (filterRub === "all" || m.rubrique     === filterRub) &&
    (filterBen === "all" || m.beneficiaire === filterBen)
  )), [filterLF, filterRub, filterBen]);

  const filteredEvents = useMemo(() => buildEvents(filteredMarches).filter(ev =>
    filterType === "all" || ev.type === filterType
  ), [filteredMarches, filterType]);

  // Stats
  const now = today();
  const lateCount     = filteredEvents.filter(ev => ev.date < now).length;
  const urgentCount   = filteredEvents.filter(ev => { const d=diffDays(ev.date); return d>=0&&d<=3; }).length;
  const upcomingCount = filteredEvents.filter(ev => { const d=diffDays(ev.date); return d>3&&d<=30; }).length;
  const totalMarches  = filteredMarches.length;

  // Export
  const exportExcel = () => {
    const rows = filteredEvents.map(ev => ({
      "Objet":          ev.objet,
      "Bénéficiaire":   ev.beneficiaire,
      "Loi de Finance": ev.loiFinance,
      "Rubrique":       ev.rubrique,
      "Type":           EVENT_TYPES[ev.type]?.label || ev.type,
      "Date":           fmt(ev.date),
      "Statut":         ev.date < now ? "En retard" : diffDays(ev.date)<=3 ? "Urgent" : "À venir",
      "J (différence)": diffDays(ev.date),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Planning CNER");
    saveAs(new Blob([XLSX.write(wb,{bookType:"xlsx",type:"array"})],
      {type:"application/octet-stream"}), "Planning_CNER.xlsx");
  };

  const handleCalendarSelect = (dateStr, evs) => {
    setSelectedDate(dateStr);
    setSelectedDayEvs(evs);
    setSelectedEvent(evs[0]);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-thumb { background:rgba(38,92,190,0.2); border-radius:4px; }
        select option { background:#0a1230; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.6} }
        .sched-anim { animation: fadeUp 0.4s ease both; }
      `}</style>

      <div className="sched-anim" style={{
        minHeight:"100vh",
        background: T.bg,
        fontFamily: T.font,
        color: T.text,
        padding:"24px 20px",
      }}>

        {/* ── PAGE HEADER ── */}
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between",
          flexWrap:"wrap", gap:14, marginBottom:24 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
              <Icon path={ICONS.calendar} size={16} color={T.blueLight}/>
              <span style={{ fontSize:"0.6rem", fontWeight:700, letterSpacing:"2.5px",
                textTransform:"uppercase", color: T.muted }}>
                CNER · Planning Financier
              </span>
            </div>
            <h1 style={{ fontSize:"1.6rem", fontWeight:800, color: T.text, letterSpacing:"-0.01em" }}>
              Calendrier des Marchés
            </h1>
            <p style={{ fontSize:"0.78rem", color: T.textDim, marginTop:4 }}>
              Suivi des échéances — Loi de Finance {new Date().getFullYear()}
            </p>
          </div>

          {/* Quick actions */}
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            <Btn icon={ICONS.export} onClick={exportExcel}>Exporter Excel</Btn>
            {onNavigate && <>
              <Btn icon={ICONS.navigate} onClick={() => onNavigate("gestion")}>Gestion</Btn>
              <Btn icon={ICONS.plus} onClick={() => onNavigate("gestion")} variant="primary">
                Nouveau Marché
              </Btn>
            </>}
          </div>
        </div>

        {/* ── STATS BAR ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",
          gap:10, marginBottom:20 }}>
          <StatCard label="Marchés actifs"    value={totalMarches}  icon={ICONS.list}     color={T.blueLight} />
          <StatCard label="En retard"         value={lateCount}     icon={ICONS.alert}    color={T.urgent}
            sub={lateCount>0?"Attention requise":undefined}/>
          <StatCard label="Urgents (≤3 jours)"value={urgentCount}   icon={ICONS.warning}  color={T.warning}/>
          <StatCard label="À venir (30j)"     value={upcomingCount} icon={ICONS.clock}    color={T.ok}/>
        </div>

        {/* ── FILTERS ── */}
        <div style={{
          background: T.surfaceAlt, border:`1px solid ${T.border}`,
          borderRadius:12, padding:"14px 16px", marginBottom:20,
          display:"flex", flexWrap:"wrap", gap:14, alignItems:"flex-end",
        }}>
          <Icon path={ICONS.filter} size={14} color={T.label} style={{ marginBottom:2 }}/>
          <FilterSelect label="Loi de Finance" value={filterLF}  onChange={setFilterLF}  options={loiOptions}/>
          <FilterSelect label="Rubrique"        value={filterRub} onChange={setFilterRub} options={rubOptions}/>
          <FilterSelect label="Bénéficiaire"    value={filterBen} onChange={setFilterBen} options={benOptions}/>
          <FilterSelect label="Type d'événement"value={filterType}onChange={setFilterType}options={typeOptions}/>

          <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
            {["calendar","timeline","list"].map(v => {
              const icons = { calendar:ICONS.calendar, timeline:ICONS.timeline, list:ICONS.list };
              const labels= { calendar:"Calendrier", timeline:"Timeline", list:"Liste" };
              const active = view === v;
              return (
                <button key={v} onClick={() => setView(v)} style={{
                  display:"flex", alignItems:"center", gap:5, padding:"7px 12px",
                  borderRadius:8, border:`1.5px solid ${active ? T.blue : T.border}`,
                  background: active ? "rgba(42,108,212,0.2)" : "transparent",
                  color: active ? T.blueLight : T.label,
                  fontFamily: T.font, fontSize:"0.72rem", fontWeight:700,
                  cursor:"pointer", outline:"none", transition:"all 0.15s",
                  letterSpacing:"0.04em", textTransform:"uppercase",
                }}>
                  <Icon path={icons[v]} size={13}/>
                  {labels[v]}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        {view === "calendar" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:16, alignItems:"start" }}>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <CalendarView
                events={filteredEvents}
                selectedDate={selectedDate}
                onSelect={handleCalendarSelect}
                onDateChange={() => {}}
              />
              {/* Day detail panel */}
              {selectedDayEvs.length > 0 && (
                <div style={{
                  background: T.card, border:`1px solid ${T.border}`,
                  borderRadius:14, padding:"16px 16px",
                }}>
                  <SectionTitle icon={ICONS.calendar} count={selectedDayEvs.length}>
                    {fmt(selectedDate)}
                  </SectionTitle>
                  {selectedDayEvs.map(ev => (
                    <EventCard key={ev.id} event={ev}
                      onClick={setSelectedEvent}
                      selected={selectedEvent?.id === ev.id}/>
                  ))}
                </div>
              )}
            </div>
            <SidePanel events={filteredEvents} onSelectEvent={setSelectedEvent}
              selectedEvent={selectedEvent}/>
          </div>
        )}

        {view === "timeline" && (
          <div>
            <SectionTitle icon={ICONS.timeline} count={filteredMarches.length}>
              Timeline des marchés
            </SectionTitle>
            {filteredMarches.map(m => <TimelineRow key={m.id} marche={m}/>)}
          </div>
        )}

        {view === "list" && (
          <div style={{
            background: T.card, border:`1px solid ${T.border}`,
            borderRadius:14, overflow:"hidden",
          }}>
            {/* Table header */}
            <div style={{
              display:"grid", gridTemplateColumns:"2fr 1.5fr 1fr 1fr 1fr 1fr",
              gap:0, padding:"10px 16px",
              borderBottom:`1px solid ${T.border}`,
              background: T.surfaceAlt,
            }}>
              {["Objet du marché","Bénéficiaire","Type","Date","Loi Finance","Statut"].map(h => (
                <div key={h} style={{ fontSize:"0.58rem", fontWeight:800, letterSpacing:"1.5px",
                  textTransform:"uppercase", color: T.muted }}>{h}</div>
              ))}
            </div>
            {filteredEvents.map((ev, i) => (
                <div key={ev.id}
                  onClick={() => setSelectedEvent(ev)}
                  onMouseEnter={() => setHovRow(ev.id)}
                  onMouseLeave={() => setHovRow(null)}
                  style={{
                    display:"grid", gridTemplateColumns:"2fr 1.5fr 1fr 1fr 1fr 1fr",
                    gap:0, padding:"11px 16px",
                    borderBottom: i < filteredEvents.length-1 ? `1px solid ${T.divider}` : "none",
                    background: hovRow === ev.id ? "rgba(38,92,190,0.06)" : "transparent",
                    cursor:"pointer", transition:"background 0.15s",
                    alignItems:"center",
                  }}>
                  <span style={{ fontSize:"0.78rem", color: T.text, fontWeight:500 }}>{ev.objet}</span>
                  <span style={{ fontSize:"0.72rem", color: T.textDim }}>{ev.beneficiaire}</span>
                  <Badge type={ev.type}/>
                  <span style={{ fontSize:"0.72rem", color: T.label }}>{fmt(ev.date)}</span>
                  <span style={{ fontSize:"0.7rem", color: T.textDim }}>{ev.loiFinance}</span>
                  <StatusPill dateStr={ev.date}/>
                </div>
            ))}
          </div>
        )}

      </div>

      {/* ── DETAIL MODAL ── */}
      <DetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)}/>
    </>
  );
}
