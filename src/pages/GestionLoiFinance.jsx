import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { useFinance } from '../contexts/FinanceContext';

// ─────────────────────────────────────────────────────────────
// THEME TOKENS
// ─────────────────────────────────────────────────────────────
const THEMES = {
  dark: {
    // Page
    pageBg:              '#03080f',
    pageBgImage:         'radial-gradient(ellipse at 30% 20%, #071428 0%, #03080f 70%)',
    pageColor:           '#e2e8f0',
    // Hero
    badgeBg:             'rgba(42,108,212,0.14)',
    badgeBorder:         'rgba(42,108,212,0.34)',
    badgeColor:          '#60a8e0',
    heroTitle:           '#ffffff',
    heroMuted:           '#2e5278',
    heroAccent:          '#2a6cd4',
    heroAccentGreen:     '#1e7d40',
    kbdBg:               'rgba(36,96,168,0.2)',
    kbdBorder:           'rgba(36,96,168,0.4)',
    kbdColor:            '#5a9acc',
    kbdWrapBg:           'rgba(56,189,248,0.06)',
    kbdWrapBorder:       'rgba(56,189,248,0.15)',
    // Card
    cardBg:              'rgba(10,22,44,0.96)',
    cardBorder:          'rgba(36,96,168,0.28)',
    cardShadow:          '0 28px 70px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.02)',
    cardBackdrop:        'blur(20px)',
    // Section labels
    secColor:            '#5a9acc',
    secBorder:           'rgba(36,96,168,0.2)',
    secDot:              '#2a6cd4',
    dividerColor:        'rgba(36,96,168,0.14)',
    // Fields
    labelDefault:        '#5a80a0',
    labelHover:          '#7ec8f0',
    labelFocused:        '#38bdf8',
    labelCalc:           '#1e4060',
    inputBg:             'rgba(3,8,16,0.9)',
    inputBgFocus:        '#1e3a8a',
    inputBgCalc:         'rgba(18,48,90,0.55)',
    inputBorder:         'rgba(36,96,168,0.36)',
    inputBorderFocus:    '#38bdf8',
    inputBorderError:    '#c03838',
    inputColor:          '#d4e8f8',
    inputColorCalc:      '#5898c8',
    inputShadowFocus:    '0 0 0 3px rgba(56,189,248,0.25)',
    inputShadowHover:    '0 0 0 2px rgba(56,189,248,0.12)',
    inputShadowError:    '0 0 0 2px rgba(192,56,56,0.18)',
    // Buttons
    resetBorder:         'rgba(36,96,168,0.36)',
    resetBorderHover:    '#5a9acc',
    resetColor:          '#2e5278',
    resetColorHover:     '#5a9acc',
    validerBg:           'linear-gradient(135deg,#0e3e8e,#1e5cc4)',
    validerBgHover:      'linear-gradient(135deg,#1a62c8,#3a82f8)',
    validerShadow:       '0 4px 22px rgba(14,62,142,0.6)',
    validerShadowHover:  '0 8px 32px rgba(30,92,196,0.75), 0 0 0 2px rgba(42,108,212,0.4)',
    exportBg:            'linear-gradient(135deg,#0d5228,#1a7038)',
    exportBgHover:       'linear-gradient(135deg,#1a8040,#28b050)',
    exportBgDisabled:    'rgba(10,30,18,0.6)',
    exportBorderDisabled:'rgba(30,125,64,0.35)',
    exportColorDisabled: '#1e5030',
    exportShadow:        '0 4px 22px rgba(13,82,40,0.6)',
    exportShadowHover:   '0 8px 32px rgba(26,112,56,0.75), 0 0 0 2px rgba(30,160,72,0.4)',
    // Table
    tableBg:             'rgba(10,22,44,0.96)',
    tableBorder:         'rgba(36,96,168,0.26)',
    tableShadow:         '0 28px 70px rgba(0,0,0,0.55)',
    thBg:                'rgba(18,48,100,0.28)',
    thColor:             '#5a9acc',
    thBorder:            'rgba(36,96,168,0.35)',
    tdColor:             '#9ab8d0',
    tdCalcColor:         '#4888b8',
    tdBorder:            'rgba(36,96,168,0.09)',
    tdAltBg:             'rgba(18,48,100,0.07)',
    tdIndexColor:        '#2a6cd4',
    totalsColor:         '#2e5278',
    totalsStrong:        '#5a9acc',
    delBg:               'rgba(200,56,56,0.1)',
    delBorder:           'rgba(200,56,56,0.25)',
    delColor:            '#c05050',
    delBgHover:          'rgba(200,56,56,0.25)',
    delColorHover:       '#f87171',
    emptyBorder:         'rgba(36,96,168,0.2)',
    emptyColor:          '#1e3a54',
    emptyAccent:         '#2a6cd4',
    // Toast
    toastSuccessBg:      '#0a2418',
    toastSuccessBorder:  'rgba(30,160,72,0.35)',
    toastSuccessColor:   '#5dcc88',
    toastErrorBg:        '#2a0808',
    toastErrorBorder:    'rgba(200,56,56,0.35)',
    toastErrorColor:     '#e08888',
    // Counter badge
    counterBg:           'linear-gradient(135deg,#0e3e8e,#1e5cc4)',
    counterColor:        '#ffffff',
    counterShadow:       '0 2px 8px rgba(14,62,142,0.5)',
    // Active badge on field
    activeBadgeBg:       'rgba(56,189,248,0.15)',
    activeBadgeBorder:   'rgba(56,189,248,0.3)',
    activeBadgeColor:    '#38bdf8',
    // Toggle
    toggleBg:            'rgba(20,50,120,0.6)',
    toggleBorder:        'rgba(56,189,248,0.25)',
    toggleThumb:         'linear-gradient(135deg,#4a8aff,#1a52d0)',
    toggleThumbShadow:   '0 2px 8px rgba(10,50,200,0.5)',
    toggleIconColor:     '#ffffff',
    toggleLabelColor:    '#5a80a0',
  },
  light: {
    // Page
    pageBg:              '#f0f4fa',
    pageBgImage:         'radial-gradient(ellipse at 30% 20%, #e8f0fc 0%, #f0f4fa 70%)',
    pageColor:           '#1a2540',
    // Hero
    badgeBg:             'rgba(42,108,212,0.08)',
    badgeBorder:         'rgba(42,108,212,0.22)',
    badgeColor:          '#1a5cb8',
    heroTitle:           '#0f1e3c',
    heroMuted:           '#5a78a8',
    heroAccent:          '#1a5cb8',
    heroAccentGreen:     '#0f6e34',
    kbdBg:               'rgba(42,108,212,0.08)',
    kbdBorder:           'rgba(42,108,212,0.22)',
    kbdColor:            '#1a5cb8',
    kbdWrapBg:           'rgba(42,108,212,0.04)',
    kbdWrapBorder:       'rgba(42,108,212,0.14)',
    // Card
    cardBg:              '#ffffff',
    cardBorder:          'rgba(42,108,212,0.14)',
    cardShadow:          '0 8px 40px rgba(42,108,212,0.08), 0 2px 8px rgba(0,0,0,0.04)',
    cardBackdrop:        'none',
    // Section labels
    secColor:            '#1a5cb8',
    secBorder:           'rgba(42,108,212,0.16)',
    secDot:              '#1a5cb8',
    dividerColor:        'rgba(42,108,212,0.1)',
    // Fields
    labelDefault:        '#5a78a8',
    labelHover:          '#1a5cb8',
    labelFocused:        '#1648a0',
    labelCalc:           '#8aabcc',
    inputBg:             '#f7f9fd',
    inputBgFocus:        '#eef3fc',
    inputBgCalc:         '#f0f5fb',
    inputBorder:         'rgba(42,108,212,0.2)',
    inputBorderFocus:    '#1a5cb8',
    inputBorderError:    '#c03838',
    inputColor:          '#0f1e3c',
    inputColorCalc:      '#5a8abf',
    inputShadowFocus:    '0 0 0 3px rgba(42,108,212,0.1)',
    inputShadowHover:    '0 0 0 2px rgba(42,108,212,0.07)',
    inputShadowError:    '0 0 0 2px rgba(192,56,56,0.14)',
    // Buttons
    resetBorder:         'rgba(42,108,212,0.22)',
    resetBorderHover:    '#1a5cb8',
    resetColor:          '#5a78a8',
    resetColorHover:     '#1a5cb8',
    validerBg:           'linear-gradient(135deg,#1648a0,#2a6cd4)',
    validerBgHover:      'linear-gradient(135deg,#1a52c8,#3a82f8)',
    validerShadow:       '0 4px 22px rgba(26,92,180,0.22)',
    validerShadowHover:  '0 8px 32px rgba(26,92,180,0.35), 0 0 0 2px rgba(42,108,212,0.3)',
    exportBg:            'linear-gradient(135deg,#0d6830,#1a8844)',
    exportBgHover:       'linear-gradient(135deg,#1a8040,#28b050)',
    exportBgDisabled:    'rgba(220,235,225,0.8)',
    exportBorderDisabled:'rgba(30,125,64,0.25)',
    exportColorDisabled: '#8ab8a0',
    exportShadow:        '0 4px 22px rgba(13,104,48,0.18)',
    exportShadowHover:   '0 8px 32px rgba(26,128,64,0.3), 0 0 0 2px rgba(30,160,72,0.25)',
    // Table
    tableBg:             '#ffffff',
    tableBorder:         'rgba(42,108,212,0.14)',
    tableShadow:         '0 8px 40px rgba(42,108,212,0.08), 0 2px 8px rgba(0,0,0,0.04)',
    thBg:                'rgba(42,108,212,0.06)',
    thColor:             '#1a5cb8',
    thBorder:            'rgba(42,108,212,0.16)',
    tdColor:             '#2a3e60',
    tdCalcColor:         '#1a6ab0',
    tdBorder:            'rgba(42,108,212,0.07)',
    tdAltBg:             'rgba(42,108,212,0.025)',
    tdIndexColor:        '#1a5cb8',
    totalsColor:         '#5a78a8',
    totalsStrong:        '#1a5cb8',
    delBg:               'rgba(200,56,56,0.06)',
    delBorder:           'rgba(200,56,56,0.2)',
    delColor:            '#c05050',
    delBgHover:          'rgba(200,56,56,0.14)',
    delColorHover:       '#e03030',
    emptyBorder:         'rgba(42,108,212,0.16)',
    emptyColor:          '#8aabcc',
    emptyAccent:         '#1a5cb8',
    // Toast
    toastSuccessBg:      '#f0faf4',
    toastSuccessBorder:  'rgba(30,160,72,0.25)',
    toastSuccessColor:   '#0f6e34',
    toastErrorBg:        '#fdf0f0',
    toastErrorBorder:    'rgba(200,56,56,0.25)',
    toastErrorColor:     '#b83030',
    // Counter badge
    counterBg:           'linear-gradient(135deg,#1648a0,#2a6cd4)',
    counterColor:        '#ffffff',
    counterShadow:       '0 2px 8px rgba(26,92,180,0.25)',
    // Active badge on field
    activeBadgeBg:       'rgba(42,108,212,0.08)',
    activeBadgeBorder:   'rgba(42,108,212,0.22)',
    activeBadgeColor:    '#1a5cb8',
    // Toggle
    toggleBg:            'rgba(230,238,252,0.9)',
    toggleBorder:        'rgba(42,108,212,0.22)',
    toggleThumb:         'linear-gradient(135deg,#f5a623,#e08000)',
    toggleThumbShadow:   '0 2px 8px rgba(180,90,0,0.3)',
    toggleIconColor:     '#ffffff',
    toggleLabelColor:    '#5a78a8',
  },
};

// ─────────────────────────────────────────────────────────────
// FIELD DEFINITIONS
// ─────────────────────────────────────────────────────────────
const FIELDS = [
  { name: 'loiFinance',                   label: 'Loi de Finance',                  section: 1, required: true  },
  { name: 'numeroDepense',                label: 'Numéro Dépense',                  section: 1, required: true  },
  { name: 'rubrique',                     label: 'Rubrique',                        section: 1, required: true  },
  { name: 'beneficiaire',                 label: 'Bénéficiaire',                    section: 1, required: true  },
  { name: 'objet',                        label: 'Objet',                           section: 1, required: true, spanFull: true },
  { name: 'montantGlobal',               label: 'Montant Global (DHS)',             section: 2, required: true, numeric: true },
  { name: 'montantCaution',              label: 'Montant Caution (DHS)',            section: 2, numeric: true  },
  { name: 'montantRetenueGarantie',      label: 'Retenue de Garantie (DHS)',        section: 2, numeric: true  },
  { name: 'dernierDecompte',             label: 'Dernier Décompte',                 section: 2, numeric: true  },
  { name: 'cp2026',                      label: 'CP 2026 (DHS)',                    section: 2, numeric: true  },
  { name: 'ce2027',                      label: 'CE 2027 (DHS)',                    section: 2, numeric: true  },
  { name: 'montantOrdonnance',           label: 'Montant Ordonnancé (DHS)',         section: 3, numeric: true  },
  { name: 'resteAOrdonnancer',           label: 'Reste à Ordonnancer (DHS)',        section: 3, calc: true     },
  { name: 'tauxEmission',               label: "Taux d'Émission (%)",             section: 3, calc: true     },
  { name: 'dateAttribution',             label: "Date d'Attribution",              section: 4, placeholder: 'JJ/MM/AAAA' },
  { name: 'dateVisa',                    label: 'Date de Visa',                    section: 4, placeholder: 'JJ/MM/AAAA' },
  { name: 'dateApprobation',             label: "Date d'Approbation",              section: 4, placeholder: 'JJ/MM/AAAA' },
  { name: 'dateNotificationApprobation', label: 'Date Notif. Approbation',         section: 4, placeholder: 'JJ/MM/AAAA' },
  { name: 'dateCommencement',            label: 'Date de Commencement',            section: 4, placeholder: 'JJ/MM/AAAA' },
  { name: 'datePVRD',                    label: 'Date de la PVRD',                 section: 4, placeholder: 'JJ/MM/AAAA' },
  { name: 'dateApprobationDD',           label: "Date d'Approbation DD",           section: 4, placeholder: 'JJ/MM/AAAA' },
  { name: 'dateLiberationCautions',      label: 'Date Libération Cautions',        section: 4, placeholder: 'JJ/MM/AAAA' },
];

const EDITABLE = FIELDS.filter(f => !f.calc);
const EMPTY    = Object.fromEntries(FIELDS.map(f => [f.name, '']));

const parseDate = (v) => {
  if (!v) return null;
  const s = v.trim();
  const dmy = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmy) return new Date(`${dmy[3]}-${dmy[2].padStart(2,'0')}-${dmy[1].padStart(2,'0')}`);
  const iso = s.match(/^\d{4}-\d{2}-\d{2}$/);
  if (iso) return new Date(s);
  return null;
};
const isValidDate = (v) => { const d = parseDate(v); return d && !isNaN(d.getTime()); };

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────
const GestionLoiFinance = () => {
  const { addRubrique, deleteRubrique } = useFinance();

  const [formData,         setFormData]         = useState({ ...EMPTY });
  const [entries,          setEntries]          = useState([]);
  const [errors,           setErrors]           = useState({});
  const [toast,            setToast]            = useState({ show: false, message: '', type: 'success' });
  const [activeIdx,        setActiveIdx]        = useState(0);
  const [btnValiderHover,  setBtnValiderHover]  = useState(false);
  const [btnExportHover,   setBtnExportHover]   = useState(false);
  const [btnResetHover,    setBtnResetHover]    = useState(false);

  const T = THEMES.dark;

  const inputEls = useRef({});
  const setRef = useCallback((name) => (node) => {
    if (node) inputEls.current[name] = node;
  }, []);

  const focusAt = useCallback((idx) => {
    const clamped = Math.max(0, Math.min(idx, EDITABLE.length - 1));
    setActiveIdx(clamped);
    const el = inputEls.current[EDITABLE[clamped].name];
    if (el && document.activeElement !== el) {
      el.focus();
      try { const len = el.value.length; el.setSelectionRange(len, len); } catch (_) {}
    }
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const active = document.activeElement;
      const tag    = active?.tagName ?? '';
      if (e.key === 'Tab') {
        const isOurInput = tag === 'INPUT' && Object.values(inputEls.current).includes(active);
        if (!isOurInput && tag !== 'BODY' && tag !== 'DIV') return;
        e.preventDefault();
        const next = e.shiftKey ? activeIdx - 1 : activeIdx + 1;
        focusAt(next < 0 ? EDITABLE.length - 1 : next >= EDITABLE.length ? 0 : next);
        return;
      }
      if (e.key === 'Enter') {
        if (tag === 'INPUT' || tag === 'BODY') document.querySelector('button[type="submit"]')?.click();
        return;
      }
      if (e.key === 'Escape') { active?.blur?.(); return; }
      const boring = ['Shift','Control','Alt','Meta','CapsLock','Dead',
        'F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12',
        'ArrowUp','ArrowDown','ArrowLeft','ArrowRight',
        'Home','End','PageUp','PageDown','Insert','Delete',
        'ScrollLock','Pause','NumLock','ContextMenu'];
      if (boring.includes(e.key)) return;
      const isOurInput = tag === 'INPUT' && Object.values(inputEls.current).includes(active);
      if (!isOurInput) {
        e.preventDefault();
        focusAt(activeIdx);
        const el = inputEls.current[EDITABLE[activeIdx].name];
        if (el && e.key.length === 1) {
          const nativeInputSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          nativeInputSetter.call(el, el.value + e.key);
          el.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [activeIdx, focusAt]);

  useEffect(() => {
    const g = parseFloat(formData.montantGlobal)     || 0;
    const o = parseFloat(formData.montantOrdonnance) || 0;
    setFormData(prev => ({
      ...prev,
      resteAOrdonnancer: (g - o).toFixed(2),
      tauxEmission:      g > 0 ? ((o / g) * 100).toFixed(2) : '0.00',
    }));
  }, [formData.montantGlobal, formData.montantOrdonnance]); // eslint-disable-line

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(p => ({ ...p, show: false })), 3500);
  };

  const validateForm = () => {
    const e = {};
    FIELDS.forEach(f => {
      if (f.calc) return;
      const v = formData[f.name];
      if (f.required && !v?.trim()) { e[f.name] = 'Ce champ est requis.'; return; }
      if (f.numeric && v && (isNaN(v) || parseFloat(v) < 0)) e[f.name] = 'Valeur numérique invalide (≥ 0).';
      if (f.placeholder === 'JJ/MM/AAAA' && v && !isValidDate(v)) e[f.name] = 'Date invalide (JJ/MM/AAAA).';
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleValider = (ev) => {
    if (ev) ev.preventDefault();
    if (validateForm()) {
      const entryId = Date.now();
      const rubriqueId = String(entryId);

      addRubrique({
        id: rubriqueId,
        chapitre: formData.rubrique || formData.numeroDepense || `Entrée #${entries.length + 1}`,
        dotation: formData.montantGlobal,
        engage: formData.montantOrdonnance,
        paye: formData.dernierDecompte,
      });

      setEntries(prev => [...prev, { ...formData, _id: entryId, _rubriqueId: rubriqueId }]);
      showToast(`✓ Entrée #${entries.length + 1} validée et ajoutée au tableau !`);
      focusAt(0);
    } else {
      showToast('⚠ Corrigez les erreurs avant de valider.', 'error');
    }
  };

  const handleExport = () => {
    if (!entries.length) { showToast("⚠ Aucune entrée. Validez d'abord des données.", 'error'); return; }
    const labelMap = Object.fromEntries(FIELDS.map(f => [f.name, f.label]));
    const rows = entries.map((r, i) => {
      const row = { '#': i + 1 };
      FIELDS.forEach(f => { row[labelMap[f.name]] = r[f.name] ?? ''; });
      return row;
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    ws['!cols'] = Object.keys(rows[0]).map(h => ({ wch: Math.max(h.length + 4, 18) }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Loi de Finance');
    XLSX.writeFile(wb, 'loi_finance_export.xlsx');
    showToast(`✓ ${entries.length} ligne(s) exportée(s) → loi_finance_export.xlsx`);
  };

  const handleReset = () => {
    setFormData({ ...EMPTY });
    setErrors({});
    showToast('Formulaire réinitialisé.');
    setTimeout(() => focusAt(0), 50);
  };

  const handleDelete = (id) => {
    const found = entries.find(e => e._id === id);
    if (found?._rubriqueId) deleteRubrique(found._rubriqueId);
    setEntries(prev => prev.filter(e => e._id !== id));
    showToast('Entrée supprimée.');
  };

  // ─── Field sub-component ────────────────────────────────────
  const Field = ({ fieldDef }) => {
    const { name, label, required, calc, spanFull, placeholder } = fieldDef;
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);
    const isEditableIdx = EDITABLE.findIndex(f => f.name === name);
    const isActiveField = !calc && isEditableIdx === activeIdx;
    const isActive  = !calc && (hovered || focused || isActiveField);
    const hasError  = !!errors[name];

    const borderColor = hasError ? T.inputBorderError : isActive ? T.inputBorderFocus : T.inputBorder;
    const bgColor     = calc ? T.inputBgCalc : isActive ? T.inputBgFocus : T.inputBg;
    const boxShadow   = hasError ? T.inputShadowError
      : focused && !calc ? T.inputShadowFocus
      : isActive && !calc ? T.inputShadowHover : 'none';

    return (
      <div style={{ display:'flex', flexDirection:'column', gap:5, ...(spanFull ? { gridColumn:'1/-1' } : {}), transition:'all 0.2s' }}>
        <label style={{
          fontSize:'0.68rem', fontWeight:700, letterSpacing:'1.1px',
          textTransform:'uppercase', transition:'color 0.2s',
          color: (focused || isActiveField) && !calc ? T.labelFocused : hovered && !calc ? T.labelHover : T.labelDefault,
          display:'flex', alignItems:'center', gap:4,
        }}>
          {label}
          {required && <span style={{ color: T.secDot }}>*</span>}
          {calc && <span style={{ color: T.labelCalc, fontSize:'0.58rem' }}>(auto)</span>}
          {isActiveField && !calc && (
            <span style={{
              marginLeft:4, fontSize:'0.55rem',
              background: T.activeBadgeBg, border:`1px solid ${T.activeBadgeBorder}`,
              color: T.activeBadgeColor, borderRadius:4, padding:'1px 5px', letterSpacing:'0.5px',
            }}>actif</span>
          )}
        </label>
        <input
          ref={calc ? null : setRef(name)}
          type="text"
          name={name}
          value={formData[name]}
          onChange={handleChange}
          readOnly={calc}
          placeholder={calc ? 'Calculé automatiquement' : (placeholder || '')}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => {
            setFocused(true);
            if (!calc) { const idx = EDITABLE.findIndex(f => f.name === name); if (idx !== -1) setActiveIdx(idx); }
          }}
          onBlur={() => setFocused(false)}
          style={{
            padding:'0.62rem 0.8rem', borderRadius:8,
            border:`1px solid ${borderColor}`, backgroundColor: bgColor,
            color: calc ? T.inputColorCalc : T.inputColor,
            fontSize:'0.85rem', outline:'none', width:'100%', boxSizing:'border-box',
            fontStyle: calc ? 'italic' : 'normal', cursor: calc ? 'not-allowed' : 'text',
            boxShadow, transition:'border-color 0.2s, box-shadow 0.2s, background-color 0.2s, color 0.2s',
          }}
        />
        {hasError && <span style={{ color:'#d06060', fontSize:'0.68rem', marginTop:1 }}>⚠ {errors[name]}</span>}
      </div>
    );
  };

  // ── Layout helpers ──────────────────────────────────────────
  const g2  = { display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'1rem 1.5rem' };
  const g3  = { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem 1.4rem' };
  const g4  = { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem 1.3rem' };
  const div = { border:'none', borderTop:`1px solid ${T.dividerColor}`, margin:'1.2rem 0', transition:'border-color 0.3s' };
  const sec = {
    gridColumn:'1/-1', display:'flex', alignItems:'center', gap:8,
    fontSize:'0.7rem', fontWeight:700, letterSpacing:'2.8px', textTransform:'uppercase',
    color: T.secColor, borderBottom:`1px solid ${T.secBorder}`,
    paddingBottom:'0.5rem', marginTop:'0.3rem', marginBottom:'0.1rem',
    transition:'color 0.3s, border-color 0.3s',
  };

  const bySection = (n) => FIELDS.filter(f => f.section === n);
  const TH_COLS = ['#', ...FIELDS.map(f => f.label), 'Action'];

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────
  return (
    <div style={{
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      backgroundColor: T.pageBg,
      backgroundImage: T.pageBgImage,
      color: T.pageColor,
      minHeight:'100vh',
      padding:'2.5rem 1.5rem 4rem',
      boxSizing:'border-box',
      transition:'background-color 0.35s, color 0.35s',
    }}>
      <style>{`
        @keyframes toastSlide {
          from { transform:translateY(12px); opacity:0; }
          to   { transform:translateY(0);    opacity:1; }
        }
        @keyframes pulse {
          0%,100% { box-shadow:0 0 0 0 rgba(42,108,212,0.5); }
          50%      { box-shadow:0 0 0 8px rgba(42,108,212,0); }
        }
        @keyframes pulseGreen {
          0%,100% { box-shadow:0 0 0 0 rgba(30,125,64,0.5); }
          50%      { box-shadow:0 0 0 8px rgba(30,125,64,0); }
        }
        @keyframes toggleBounce {
          0%   { transform:scale(1); }
          40%  { transform:scale(0.88); }
          70%  { transform:scale(1.1); }
          100% { transform:scale(1); }
        }
        .del-btn:hover {
          background:rgba(200,56,56,0.22) !important;
          color:#f87171 !important;
        }
        * { transition: background-color 0.3s, border-color 0.3s, color 0.3s, box-shadow 0.3s; }
        input { transition: background-color 0.2s, border-color 0.2s, box-shadow 0.2s, color 0.2s !important; }
      `}</style>

      <div style={{ maxWidth:1140, margin:'0 auto' }}>

        {/* ── Hero ── */}
        <div style={{ position:'relative', textAlign:'center', marginBottom:'2.4rem' }}>

          <div style={{
            display:'inline-block', background: T.badgeBg, border:`1px solid ${T.badgeBorder}`,
            color: T.badgeColor, fontSize:10, letterSpacing:'3px', textTransform:'uppercase',
            padding:'5px 18px', borderRadius:20, marginBottom:14,
          }}>Finances Publiques</div>

          <h1 style={{ fontSize:'1.9rem', fontWeight:700, margin:'0 0 8px', color: T.heroTitle }}>
            Gestion Loi de Finance
          </h1>
          <p style={{ color: T.heroMuted, fontSize:'0.875rem', margin:0 }}>
            Remplissez le formulaire ·{' '}
            <strong style={{ color: T.heroAccent }}>VALIDER</strong> pour ajouter une ligne ·{' '}
            <strong style={{ color: T.heroAccentGreen }}>EXPORTER VERS EXCEL</strong>
          </p>
          <div style={{
            marginTop:'0.7rem', display:'inline-flex', alignItems:'center', gap:10,
            background: T.kbdWrapBg, border:`1px solid ${T.kbdWrapBorder}`,
            borderRadius:8, padding:'6px 14px',
          }}>
            {[['⌨ Taper','focus automatique'],['Tab →','champ suivant'],['⇧ Tab','champ précédent'],['Enter','valider']].map(([k,v]) => (
              <span key={k} style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:'0.68rem', color: T.heroMuted }}>
                <kbd style={{
                  background: T.kbdBg, border:`1px solid ${T.kbdBorder}`, borderRadius:4,
                  padding:'1px 6px', color: T.kbdColor, fontFamily:'monospace', fontSize:'0.65rem',
                }}>{k}</kbd>
                <span>{v}</span>
              </span>
            ))}
          </div>
        </div>

        {/* ═══════════════ FORM ═══════════════ */}
        <form onSubmit={handleValider} noValidate>
          <div style={{
            backgroundColor: T.cardBg,
            border:`1px solid ${T.cardBorder}`,
            borderRadius:18, padding:'2.2rem 2.4rem',
            boxShadow: T.cardShadow,
            backdropFilter: T.cardBackdrop,
            WebkitBackdropFilter: T.cardBackdrop,
            marginBottom:'1.8rem',
          }}>

            <div style={g2}>
              <div style={sec}><span style={{ color: T.secDot, fontSize:9 }}>◆</span> 1. Identification</div>
              {bySection(1).map(f => <Field key={f.name} fieldDef={f} />)}
            </div>
            <hr style={div} />
            <div style={g3}>
              <div style={sec}><span style={{ color: T.secDot, fontSize:9 }}>◆</span> 2. Informations Financières</div>
              {bySection(2).map(f => <Field key={f.name} fieldDef={f} />)}
            </div>
            <hr style={div} />
            <div style={g3}>
              <div style={sec}><span style={{ color: T.secDot, fontSize:9 }}>◆</span> 3. Calculs &amp; Émissions</div>
              {bySection(3).map(f => <Field key={f.name} fieldDef={f} />)}
            </div>
            <hr style={div} />
            <div style={g4}>
              <div style={sec}>
                <span style={{ color: T.secDot, fontSize:9 }}>◆</span> 4. Dates
                <span style={{ color: T.labelCalc, fontWeight:400, fontSize:'0.6rem', letterSpacing:'1px' }}>(format JJ/MM/AAAA)</span>
              </div>
              {bySection(4).map(f => <Field key={f.name} fieldDef={f} />)}
            </div>

            {/* Buttons */}
            <div style={{ display:'flex', gap:'1rem', marginTop:'2rem', alignItems:'stretch', flexWrap:'wrap' }}>

              <button
                type="button"
                onClick={handleReset}
                onMouseEnter={() => setBtnResetHover(true)}
                onMouseLeave={() => setBtnResetHover(false)}
                style={{
                  padding:'0 1.4rem', borderRadius:10,
                  border: btnResetHover ? `1px solid ${T.resetBorderHover}` : `1px solid ${T.resetBorder}`,
                  background:'transparent',
                  color: btnResetHover ? T.resetColorHover : T.resetColor,
                  fontSize:'0.8rem', fontWeight:600, letterSpacing:'0.8px',
                  textTransform:'uppercase', cursor:'pointer',
                  display:'flex', alignItems:'center', gap:7,
                }}
              >
                <span style={{ fontSize:'1rem' }}>↺</span> Réinitialiser
              </button>

              <button
                type="submit"
                onMouseEnter={() => setBtnValiderHover(true)}
                onMouseLeave={() => setBtnValiderHover(false)}
                style={{
                  flex:1, minHeight:56, borderRadius:12, border:'none', cursor:'pointer',
                  background: btnValiderHover ? T.validerBgHover : T.validerBg,
                  color:'#fff', fontSize:'1rem', fontWeight:800, letterSpacing:'1.5px',
                  textTransform:'uppercase',
                  boxShadow: btnValiderHover ? T.validerShadowHover : T.validerShadow,
                  transform: btnValiderHover ? 'translateY(-2px)' : 'translateY(0)',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:10,
                  animation:'pulse 2.5s infinite',
                }}
              >
                <span style={{
                  display:'inline-flex', alignItems:'center', justifyContent:'center',
                  width:30, height:30, borderRadius:'50%', background:'rgba(255,255,255,0.15)', fontSize:'1rem',
                }}>✔</span>
                <span>
                  VALIDER L'ENTRÉE
                  <span style={{ display:'block', fontSize:'0.62rem', fontWeight:500, letterSpacing:'1px', opacity:0.75, textTransform:'none' }}>
                    Ajoute une ligne · {entries.length} enregistrée{entries.length !== 1 ? 's' : ''}
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={handleExport}
                onMouseEnter={() => setBtnExportHover(true)}
                onMouseLeave={() => setBtnExportHover(false)}
                style={{
                  flex:1, minHeight:56, borderRadius:12,
                  border: entries.length === 0 ? `2px dashed ${T.exportBorderDisabled}` : 'none',
                  cursor: entries.length === 0 ? 'not-allowed' : 'pointer',
                  background: entries.length === 0 ? T.exportBgDisabled : btnExportHover ? T.exportBgHover : T.exportBg,
                  color: entries.length === 0 ? T.exportColorDisabled : '#fff',
                  fontSize:'1rem', fontWeight:800, letterSpacing:'1.5px', textTransform:'uppercase',
                  boxShadow: entries.length === 0 ? 'none' : btnExportHover ? T.exportShadowHover : T.exportShadow,
                  transform: entries.length > 0 && btnExportHover ? 'translateY(-2px)' : 'translateY(0)',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:10,
                  animation: entries.length > 0 ? 'pulseGreen 2.5s infinite' : 'none',
                  opacity: entries.length === 0 ? 0.55 : 1,
                }}
              >
                <span style={{
                  display:'inline-flex', alignItems:'center', justifyContent:'center',
                  width:30, height:30, borderRadius:'50%',
                  background: entries.length === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.18)',
                  fontSize:'1.1rem',
                }}>⬇</span>
                <span>
                  EXPORTER VERS EXCEL
                  <span style={{ display:'block', fontSize:'0.62rem', fontWeight:500, letterSpacing:'1px', opacity:0.8, textTransform:'none' }}>
                    {entries.length === 0 ? "Validez au moins une entrée d'abord" : `${entries.length} ligne${entries.length !== 1 ? 's' : ''} → loi_finance_export.xlsx`}
                  </span>
                </span>
              </button>

            </div>
          </div>
        </form>

        {/* ═══════════════ TABLE ═══════════════ */}
        {entries.length > 0 && (
          <div style={{
            backgroundColor: T.tableBg, border:`1px solid ${T.tableBorder}`,
            borderRadius:18, padding:'1.6rem 2rem', boxShadow: T.tableShadow,
            backdropFilter: T.cardBackdrop, WebkitBackdropFilter: T.cardBackdrop,
          }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.2rem', flexWrap:'wrap', gap:12 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ color: T.secDot, fontSize:9 }}>◆</span>
                <span style={{ fontSize:'0.7rem', fontWeight:700, letterSpacing:'2.8px', textTransform:'uppercase', color: T.secColor }}>
                  Tableau des Entrées Validées
                </span>
                <span style={{
                  background: T.counterBg, color: T.counterColor, borderRadius:20,
                  fontSize:'0.72rem', fontWeight:700, padding:'2px 12px', boxShadow: T.counterShadow,
                }}>
                  {entries.length} ligne{entries.length !== 1 ? 's' : ''}
                </span>
              </div>
              <button
                type="button"
                onClick={handleExport}
                style={{
                  background: T.exportBg, border:'none', borderRadius:8,
                  color:'#fff', fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.8px',
                  textTransform:'uppercase', padding:'8px 18px', cursor:'pointer',
                  boxShadow: T.exportShadow,
                  display:'flex', alignItems:'center', gap:7,
                }}
              >
                <span>⬇</span> Exporter tout vers Excel
              </button>
            </div>

            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'separate', borderSpacing:0, fontSize:'0.72rem', minWidth:1800 }}>
                <thead>
                  <tr>
                    {TH_COLS.map(h => (
                      <th key={h} style={{
                        background: T.thBg, color: T.thColor, fontWeight:700,
                        fontSize:'0.6rem', letterSpacing:'1px', textTransform:'uppercase',
                        padding:'10px 11px', textAlign:'left',
                        borderBottom:`2px solid ${T.thBorder}`, whiteSpace:'nowrap',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {entries.map((row, i) => {
                    const alt = i % 2 === 1 ? { background: T.tdAltBg } : {};
                    const cell = (val, isCalc = false) => (
                      <td style={{
                        color: isCalc ? T.tdCalcColor : T.tdColor,
                        fontStyle: isCalc ? 'italic' : 'normal',
                        padding:'9px 11px', borderBottom:`1px solid ${T.tdBorder}`,
                        whiteSpace:'nowrap', ...alt,
                      }}>
                        {(val !== '' && val != null) ? val : <span style={{ color: T.emptyColor }}>—</span>}
                      </td>
                    );
                    return (
                      <tr key={row._id}>
                        <td style={{ color: T.tdIndexColor, fontWeight:700, padding:'9px 11px', borderBottom:`1px solid ${T.tdBorder}`, ...alt }}>{i + 1}</td>
                        {FIELDS.map(f => cell(row[f.name], f.calc))}
                        <td style={{ padding:'9px 11px', borderBottom:`1px solid ${T.tdBorder}`, ...alt }}>
                          <button
                            type="button"
                            className="del-btn"
                            onClick={() => handleDelete(row._id)}
                            style={{
                              background: T.delBg, border:`1px solid ${T.delBorder}`,
                              borderRadius:6, color: T.delColor, fontSize:'0.7rem', fontWeight:700,
                              padding:'4px 10px', cursor:'pointer', whiteSpace:'nowrap',
                            }}
                          >✕ Supprimer</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ display:'flex', justifyContent:'flex-end', marginTop:'1rem', gap:'2rem', flexWrap:'wrap' }}>
              <span style={{ color: T.totalsColor, fontSize:'0.72rem' }}>
                Total Montant Global :{' '}
                <strong style={{ color: T.totalsStrong }}>
                  {entries.reduce((s,r) => s + (parseFloat(r.montantGlobal) || 0), 0).toLocaleString('fr-FR', { minimumFractionDigits:2 })} DHS
                </strong>
              </span>
              <span style={{ color: T.totalsColor, fontSize:'0.72rem' }}>
                Total Ordonnancé :{' '}
                <strong style={{ color: T.totalsStrong }}>
                  {entries.reduce((s,r) => s + (parseFloat(r.montantOrdonnance) || 0), 0).toLocaleString('fr-FR', { minimumFractionDigits:2 })} DHS
                </strong>
              </span>
            </div>
          </div>
        )}

        {entries.length === 0 && (
          <div style={{
            textAlign:'center', padding:'2rem',
            border:`1px dashed ${T.emptyBorder}`,
            borderRadius:14, color: T.emptyColor, fontSize:'0.82rem',
          }}>
            ↑ Remplissez le formulaire ci-dessus et cliquez sur{' '}
            <strong style={{ color: T.emptyAccent }}>VALIDER L'ENTRÉE</strong>{' '}
            pour ajouter des lignes au tableau.
          </div>
        )}

      </div>

      {/* Toast */}
      {toast.show && (
        <div style={{
          position:'fixed', bottom:'1.6rem', right:'1.6rem',
          padding:'0.85rem 1.4rem', borderRadius:12,
          fontWeight:600, fontSize:'0.875rem',
          boxShadow:'0 16px 48px rgba(0,0,0,0.25)',
          display:'flex', alignItems:'center', gap:10,
          zIndex:1000, animation:'toastSlide 0.25s ease', maxWidth:440,
          ...(toast.type === 'success'
            ? { backgroundColor: T.toastSuccessBg, border:`1px solid ${T.toastSuccessBorder}`, color: T.toastSuccessColor }
            : { backgroundColor: T.toastErrorBg,   border:`1px solid ${T.toastErrorBorder}`,   color: T.toastErrorColor   }),
        }}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default GestionLoiFinance;
