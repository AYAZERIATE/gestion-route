import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { useMarche } from "../contexts/MarcheContext";

// ─── inline styles — no external CSS file needed ───────────────────────────
const FONT = "'DM Sans', 'Segoe UI', system-ui, sans-serif";

const PALETTE = {
  bg:           "#05080f",
  surface:      "rgba(10, 18, 42, 0.92)",
  surfaceHover: "rgba(14, 26, 58, 0.98)",
  border:       "rgba(38, 92, 190, 0.18)",
  borderFocus:  "rgba(67, 138, 255, 0.55)",
  glow:         "0 0 0 3px rgba(38,92,190,0.18)",
  blue:         "#2a6cd4",
  blueLight:    "#60a5fa",
  blueDark:     "#1a3e8c",
  green:        "#10b981",
  greenDark:    "#065f46",
  amber:        "#f59e0b",
  amberDark:    "#78350f",
  label:        "#3a608e",
  text:         "#b8d4f8",
  placeholder:  "#2a4a70",
  muted:        "#1e3a5a",
  success:      "#34d399",
};

const field = (overrides = {}) => ({
  width: "100%",
  padding: "11px 14px",
  background: "rgba(4, 9, 22, 0.7)",
  border: `1.5px solid ${PALETTE.border}`,
  borderRadius: 10,
  color: PALETTE.text,
  fontFamily: FONT,
  fontSize: "0.875rem",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s, box-shadow 0.2s",
  ...overrides,
});

// ─── tiny hooks ────────────────────────────────────────────────────────────
function useFocus() {
  const [focused, setFocused] = useState(false);
  return {
    focused,
    bind: {
      onFocus: () => setFocused(true),
      onBlur:  () => setFocused(false),
    },
  };
}

// ─── sub-components ────────────────────────────────────────────────────────
function Label({ children, required }) {
  return (
    <label style={{
      display: "block",
      fontSize: "0.68rem",
      fontWeight: 700,
      letterSpacing: "1.8px",
      textTransform: "uppercase",
      color: PALETTE.label,
      marginBottom: 6,
      fontFamily: FONT,
    }}>
      {children}
      {required && <span style={{ color: PALETTE.blueLight, marginLeft: 3 }}>*</span>}
    </label>
  );
}

function Field({ label, required, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <Label required={required}>{label}</Label>
      {children}
    </div>
  );
}

function StyledInput({ name, placeholder, type = "text", value, onChange, required }) {
  const { focused, bind } = useFocus();
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      {...bind}
      style={field({
        borderColor:  focused ? PALETTE.borderFocus : PALETTE.border,
        boxShadow:    focused ? PALETTE.glow : "none",
        "::placeholder": { color: PALETTE.placeholder },
      })}
    />
  );
}

function StyledTextarea({ name, placeholder, value, onChange, required, rows = 3 }) {
  const { focused, bind } = useFocus();
  return (
    <textarea
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      rows={rows}
      {...bind}
      style={field({
        resize: "vertical",
        minHeight: rows * 24,
        borderColor: focused ? PALETTE.borderFocus : PALETTE.border,
        boxShadow:   focused ? PALETTE.glow : "none",
        lineHeight: 1.6,
      })}
    />
  );
}

function StyledSelect({ name, value, onChange, required, children }) {
  const { focused, bind } = useFocus();
  return (
    <div style={{ position: "relative" }}>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        {...bind}
        style={field({
          appearance: "none",
          cursor: "pointer",
          borderColor: focused ? PALETTE.borderFocus : PALETTE.border,
          boxShadow:   focused ? PALETTE.glow : "none",
          color: value ? PALETTE.text : PALETTE.placeholder,
          paddingRight: 36,
        })}
      >
        {children}
      </select>
      {/* chevron */}
      <svg
        width="13" height="13" viewBox="0 0 24 24" fill="none"
        stroke={PALETTE.label} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
        style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
      >
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
  );
}

function ActionBtn({ onClick, type = "button", color, hoverColor, icon, children }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 7,
        padding: "10px 18px",
        border: `1.5px solid ${hov ? color : "rgba(38,92,190,0.22)"}`,
        borderRadius: 10,
        background: hov ? `${color}22` : "rgba(4,9,22,0.6)",
        color: hov ? color : PALETTE.label,
        fontFamily: FONT,
        fontSize: "0.78rem",
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        cursor: "pointer",
        transition: "all 0.2s",
        outline: "none",
        whiteSpace: "nowrap",
      }}
    >
      {icon}
      {children}
    </button>
  );
}

// ─── icons ─────────────────────────────────────────────────────────────────
const IconExcel = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/>
  </svg>
);
const IconWord = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="9" y1="13" x2="15" y2="13"/>
  </svg>
);
const IconSave = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/>
    <polyline points="7 3 7 8 15 8"/>
  </svg>
);

// ─── TOAST ─────────────────────────────────────────────────────────────────
function Toast({ message, type, onDone }) {
  const [visible, setVisible] = useState(true);
  React.useEffect(() => {
    const t = setTimeout(() => { setVisible(false); setTimeout(onDone, 300); }, 2800);
    return () => clearTimeout(t);
  }, [onDone]);

  const color = type === "success" ? PALETTE.success : PALETTE.blueLight;
  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 9999,
      display: "flex", alignItems: "center", gap: 10,
      padding: "12px 20px",
      background: "rgba(5,11,28,0.97)",
      border: `1.5px solid ${color}44`,
      borderRadius: 12,
      boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${color}22`,
      color: color,
      fontFamily: FONT,
      fontSize: "0.82rem",
      fontWeight: 600,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(12px)",
      transition: "opacity 0.3s, transform 0.3s",
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {type === "success"
          ? <><polyline points="20 6 9 17 4 12"/></>
          : <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>
        }
      </svg>
      {message}
    </div>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────
export default function MarketForm() {
  const { addMarche } = useMarche();
  const [formData, setFormData] = useState({
    nom: "", type: "", objet: "", montant: "", avancement: "",
  });
  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => setToast({ message, type, key: Date.now() });

  const handleChange = (e) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = `M-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;
    addMarche({
      id,
      objet: [formData.nom, formData.objet].filter(Boolean).join(" — "),
      type: formData.type,
      statut: "En cours",
      montant: formData.montant,
      avancement: formData.avancement,
      beneficiaire: "",
      loiFinance: "",
    });
    showToast("Marché enregistré avec succès");
    setFormData({ nom: "", type: "", objet: "", montant: "", avancement: "" });
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet([formData]);
    const workbook  = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Marché");
    const buf  = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf], { type: "application/octet-stream" }), "Marche.xlsx");
    showToast("Export Excel réussi");
  };

  const exportToWord = () => {
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ text: "Gestion du Marché", heading: HeadingLevel.HEADING_1 }),
          new Paragraph(""),
          ...[
            ["Nom du marché",     formData.nom],
            ["Type du marché",    formData.type],
            ["Objet du marché",   formData.objet],
            ["Montant",           formData.montant ? `${Number(formData.montant).toLocaleString("fr-MA")} MAD` : ""],
            ["Avancement",        formData.avancement],
          ].map(([label, val]) =>
            new Paragraph({
              children: [
                new TextRun({ text: `${label} : `, bold: true }),
                new TextRun(val || "—"),
              ],
            })
          ),
        ],
      }],
    });
    Packer.toBlob(doc).then(blob => { saveAs(blob, "Marche.docx"); showToast("Export Word réussi"); });
  };

  return (
    <>
      {/* Google font import */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;} input::placeholder,textarea::placeholder{color:${PALETTE.placeholder}!important;}
        select option{background:#0a1230;color:${PALETTE.text};}
        input[type=number]::-webkit-inner-spin-button{opacity:.4;}
      `}</style>

      {/* background — match CNER dark aesthetic */}
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #020714 0%, #051030 50%, #020c28 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
        fontFamily: FONT,
      }}>
        <div style={{ width: "100%", maxWidth: 520 }}>

          {/* ── Header ── */}
          <div style={{ marginBottom: 28, paddingLeft: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              {/* mini logo */}
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: "linear-gradient(135deg,#2e6ee0,#0a2280)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 16px rgba(10,44,160,0.45)",
              }}>
                <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
                  <path d="M7 22L7 10L14 10Q18.5 10 18.5 14.2Q18.5 17.2 14.5 17.8L18.5 22"
                    stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "2px",
                  textTransform: "uppercase", color: PALETTE.muted }}>
                  CNER · Gestion Routière
                </div>
                <div style={{ fontSize: "1.15rem", fontWeight: 800, color: PALETTE.text,
                  letterSpacing: "0.02em" }}>
                  Nouveau Marché
                </div>
              </div>
            </div>
          </div>

          {/* ── Card ── */}
          <div style={{
            background: PALETTE.surface,
            border: `1px solid ${PALETTE.border}`,
            borderRadius: 16,
            boxShadow: "0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(38,92,190,0.07)",
            backdropFilter: "blur(24px)",
            padding: "32px 28px",
          }}>

            {/* ── section divider ── */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
              <div style={{ flex: 1, height: 1, background: PALETTE.border }} />
              <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "2px",
                textTransform: "uppercase", color: PALETTE.muted }}>
                Informations du marché
              </span>
              <div style={{ flex: 1, height: 1, background: PALETTE.border }} />
            </div>

            <form onSubmit={handleSubmit}>

              <Field label="Nom du marché" required>
                <StyledInput name="nom" placeholder="Ex : Construction RN1 — Lot 3"
                  value={formData.nom} onChange={handleChange} required />
              </Field>

              <Field label="Type de marché" required>
                <StyledSelect name="type" value={formData.type} onChange={handleChange} required>
                  <option value="">— Sélectionner le type —</option>
                  <option value="Travaux">Travaux</option>
                  <option value="Services">Services</option>
                  <option value="Fournitures">Fournitures</option>
                  <option value="Études">Études &amp; Ingénierie</option>
                </StyledSelect>
              </Field>

              <Field label="Objet du marché" required>
                <StyledTextarea name="objet" placeholder="Description détaillée de l'objet du marché…"
                  value={formData.objet} onChange={handleChange} required rows={3} />
              </Field>

              <Field label="Montant (MAD)" required>
                <div style={{ position: "relative" }}>
                  <StyledInput name="montant" type="number" placeholder="0.00"
                    value={formData.montant} onChange={handleChange} required />
                  <span style={{
                    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                    fontSize: "0.72rem", fontWeight: 700, color: PALETTE.muted, letterSpacing: "1px",
                    pointerEvents: "none",
                  }}>MAD</span>
                </div>
              </Field>

              <Field label="Avancement" required>
                <StyledTextarea name="avancement" placeholder="État d'avancement, observations, jalons atteints…"
                  value={formData.avancement} onChange={handleChange} required rows={4} />
              </Field>

              {/* ── Divider ── */}
              <div style={{ height: 1, background: PALETTE.border, margin: "24px 0 20px" }} />

              {/* ── Actions ── */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <ActionBtn onClick={exportToExcel} color="#10b981" icon={<IconExcel />}>
                  Excel
                </ActionBtn>
                <ActionBtn onClick={exportToWord} color="#60a5fa" icon={<IconWord />}>
                  Word
                </ActionBtn>
                <div style={{ flex: 1 }} />
                <ActionBtn type="submit" color="#34d399" icon={<IconSave />}>
                  Enregistrer
                </ActionBtn>
              </div>

            </form>
          </div>

          {/* ── footer note ── */}
          <p style={{ textAlign: "center", marginTop: 18,
            fontSize: "0.68rem", color: PALETTE.muted, fontFamily: FONT }}>
            © {new Date().getFullYear()} CNER — Tous droits réservés
          </p>
        </div>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <Toast key={toast.key} message={toast.message} type={toast.type}
          onDone={() => setToast(null)} />
      )}
    </>
  );
}
