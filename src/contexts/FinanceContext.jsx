import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const FinanceContext = createContext(null);

const STORAGE_KEY = "cner_finance_rubriques_v1";

const toNumber = (v) => {
  if (v == null) return 0;
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  if (typeof v === "string") {
    const normalized = v.replace(/\s/g, "").replace(",", ".");
    const n = Number(normalized);
    return Number.isFinite(n) ? n : 0;
  }
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const makeId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
};

export function FinanceProvider({ children }) {
  const [rubriques, setRubriques] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rubriques));
    } catch {
      // ignore storage errors (private mode, quota, etc.)
    }
  }, [rubriques]);

  const addRubrique = useCallback((rubrique) => {
    setRubriques((prev) => {
      const r = rubrique || {};
      const next = {
        id: r.id || makeId(),
        chapitre: r.chapitre ?? "",
        dotation: toNumber(r.dotation),
        engage: toNumber(r.engage),
        paye: toNumber(r.paye),
      };
      return [...prev, next];
    });
  }, []);

  const updateRubrique = useCallback((id, data) => {
    if (!id) return;
    setRubriques((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const patch = data || {};
        return {
          ...r,
          chapitre: patch.chapitre ?? r.chapitre,
          dotation: patch.dotation == null ? r.dotation : toNumber(patch.dotation),
          engage: patch.engage == null ? r.engage : toNumber(patch.engage),
          paye: patch.paye == null ? r.paye : toNumber(patch.paye),
        };
      })
    );
  }, []);

  const deleteRubrique = useCallback((id) => {
    if (!id) return;
    setRubriques((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const totals = useMemo(() => {
    const dotation = rubriques.reduce((s, r) => s + toNumber(r.dotation), 0);
    const engage = rubriques.reduce((s, r) => s + toNumber(r.engage), 0);
    const paye = rubriques.reduce((s, r) => s + toNumber(r.paye), 0);
    const txEngage = dotation > 0 ? (engage / dotation) * 100 : 0;
    const txPaye = dotation > 0 ? (paye / dotation) * 100 : 0;
    return { dotation, engage, paye, txEngage, txPaye };
  }, [rubriques]);

  const value = useMemo(
    () => ({
      rubriques,
      totals,
      addRubrique,
      updateRubrique,
      deleteRubrique,
    }),
    [rubriques, totals, addRubrique, updateRubrique, deleteRubrique]
  );

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance() doit être dans <FinanceProvider>.");
  return ctx;
}

export default FinanceContext;

