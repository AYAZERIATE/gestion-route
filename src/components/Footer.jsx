import React, { useState, useEffect } from "react";


export default function Footer() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("cner_theme") || "dark"
  );

  
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "cner_theme" && e.newValue) setTheme(e.newValue);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const isDark = theme === "dark";
  const year   = new Date().getFullYear();

  const c = isDark
    ? {
        background:     "rgba(5, 11, 24, 0.97)",
        border:         "rgba(38, 92, 190, 0.18)",
        heading:        "#b8d4f8",
        text:           "#3a608e",
        muted:          "#1e3a5a",
        accent:         "#60a5fa",
        iconStroke:     "#2e5278",
        divider:        "rgba(38,92,190,0.12)",
        tagBg:          "rgba(38,92,190,0.1)",
        tagBorder:      "rgba(38,92,190,0.22)",
        tagColor:       "#3a608e",
      }
    : {
        background:     "rgba(246, 249, 255, 0.98)",
        border:         "rgba(38, 92, 190, 0.1)",
        heading:        "#0d1e3c",
        text:           "#4a6080",
        muted:          "#9ab8d8",
        accent:         "#1a4ec0",
        iconStroke:     "#6080a8",
        divider:        "rgba(38,92,190,0.08)",
        tagBg:          "rgba(38,92,190,0.06)",
        tagBorder:      "rgba(38,92,190,0.15)",
        tagColor:       "#4a70a8",
      };

  const base = {
    fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif",
    fontSize:   "0.8rem",
    lineHeight: 1.7,
  };

  const Label = ({ children }) => (
    <div style={{ fontSize:"0.62rem", fontWeight:700, letterSpacing:"2px",
      textTransform:"uppercase", color: c.muted, marginBottom:10 }}>
      {children}
    </div>
  );

  const Tag = ({ children }) => (
    <span style={{
      display:"inline-block",
      padding:"2px 8px", borderRadius:6, marginRight:5, marginBottom:5,
      fontSize:"0.68rem", fontWeight:600, letterSpacing:"0.04em",
      background: c.tagBg, border:`1px solid ${c.tagBorder}`, color: c.tagColor,
    }}>
      {children}
    </span>
  );

  const InfoRow = ({ icon, children }) => (
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6, color: c.text }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke={c.iconStroke} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d={icon}/>
      </svg>
      <span style={{ fontSize:"0.78rem" }}>{children}</span>
    </div>
  );

  
  return (
    <footer style={{
      ...base,
      background: c.background,
      borderTop:  `1px solid ${c.border}`,
      padding:    "36px 32px 20px",
      transition: "background 0.35s, border-color 0.35s",
    }}>
      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",
        gap:"32px 40px",
        maxWidth:1100, margin:"0 auto",
      }}>

        { }
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:10 }}>
            {}
            <div style={{
              width:30, height:30, borderRadius:8, flexShrink:0,
              background:"linear-gradient(135deg,#2e6ee0,#0a2280)",
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
                <path d="M7 22L7 10L14 10Q18.5 10 18.5 14.2Q18.5 17.2 14.5 17.8L18.5 22"
                  stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
            <span style={{ fontSize:"0.95rem", fontWeight:800, letterSpacing:"0.12em", color: c.heading }}>
              CNER
            </span>
          </div>
          <p style={{ color: c.text, fontSize:"0.77rem", marginBottom:12 }}>
            Plateforme officielle de gestion et de suivi des infrastructures
            routières du Royaume du Maroc.
          </p>
          <div>
            <Tag>Ministère de l'Équipement</Tag>
            <Tag>Maroc</Tag>
            <Tag>v1.0.0</Tag>
          </div>
        </div>

        {}
        <div>
          <Label>Contact</Label>
          <InfoRow icon="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z">
            Avenue Mohammed V, Rabat 10000
          </InfoRow>
          <InfoRow icon="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z">
            +212 5 37 00 00 00
          </InfoRow>
          <InfoRow icon="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
            contact@cner.ma
          </InfoRow>
          <InfoRow icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z">
            Lun – Ven  ·  08h30 – 16h30
          </InfoRow>
        </div>

        {}
        <div>
          <Label>Institutionnel</Label>
          {[
            "Ministère de l'Équipement",
            "Direction des Routes",
            "Centre National des Routes",
            "Politique de confidentialité",
          ].map(link => (
            <div key={link} style={{ marginBottom:6 }}>
              <button
                type="button"
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  color: c.text, textDecoration:"none", fontSize:"0.78rem",
                  display:"inline-flex", alignItems:"center", gap:5,
                  transition:"color 0.18s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = c.accent)}
                onMouseLeave={e => (e.currentTarget.style.color = c.text)}
              >
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
                {link}
              </button>
            </div>
          ))}
        </div>

      </div>

      { }
      <div style={{
        maxWidth:1100, margin:"28px auto 0",
        paddingTop:16,
        borderTop:`1px solid ${c.divider}`,
        display:"flex",
        alignItems:"center",
        justifyContent:"space-between",
        flexWrap:"wrap",
        gap:8,
      }}>
        <span style={{ color: c.muted, fontSize:"0.72rem" }}>
          © {year} CNER — Tous droits réservés
        </span>
        <span style={{ color: c.muted, fontSize:"0.72rem" }}>
          Royaume du Maroc · Ministère de l'Équipement et de l'Eau
        </span>
      </div>
    </footer>
  );
}
