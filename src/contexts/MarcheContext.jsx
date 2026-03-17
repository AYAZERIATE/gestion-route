import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const MarcheContext = createContext(null);

const STORAGE_KEY = "cner_marches_v1";

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

const isCloture = (statut) => {
  const s = String(statut || "").toLowerCase();
  return s.includes("clot") || s.includes("clôt");
};

export function MarcheProvider({ children }) {
  const [marches, setMarches] = useState(() => {
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(marches));
    } catch {
      // ignore storage errors
    }
  }, [marches]);

  const addMarche = useCallback((marche) => {
    setMarches((prev) => {
      const m = marche || {};
      const next = {
        id: m.id || makeId(),
        objet: m.objet ?? "",
        type: m.type ?? "",
        statut: m.statut ?? "En cours",
        montant: toNumber(m.montant),
        avancement: m.avancement ?? "",
        beneficiaire: m.beneficiaire ?? "",
        loiFinance: m.loiFinance ?? "",
      };
      return [...prev, next];
    });
  }, []);

  const updateMarche = useCallback((id, data) => {
    if (!id) return;
    setMarches((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const patch = data || {};
        return {
          ...m,
          objet: patch.objet ?? m.objet,
          type: patch.type ?? m.type,
          statut: patch.statut ?? m.statut,
          montant: patch.montant == null ? m.montant : toNumber(patch.montant),
          avancement: patch.avancement ?? m.avancement,
          beneficiaire: patch.beneficiaire ?? m.beneficiaire,
          loiFinance: patch.loiFinance ?? m.loiFinance,
        };
      })
    );
  }, []);

  const deleteMarche = useCallback((id) => {
    if (!id) return;
    setMarches((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const stats = useMemo(() => {
    const total = marches.length;
    const clotures = marches.reduce((n, m) => n + (isCloture(m.statut) ? 1 : 0), 0);
    const actifs = total - clotures;

    const byType = marches.reduce((acc, m) => {
      const key = m.type || "Non défini";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const top5 = [...marches]
      .sort((a, b) => toNumber(b.montant) - toNumber(a.montant))
      .slice(0, 5);

    return { total, actifs, clotures, byType, top5 };
  }, [marches]);

  const value = useMemo(
    () => ({
      marches,
      stats,
      addMarche,
      updateMarche,
      deleteMarche,
    }),
    [marches, stats, addMarche, updateMarche, deleteMarche]
  );

  return <MarcheContext.Provider value={value}>{children}</MarcheContext.Provider>;
}

export function useMarche() {
  const ctx = useContext(MarcheContext);
  if (!ctx) throw new Error("useMarche() doit être dans <MarcheProvider>.");
  return ctx;
}

export default MarcheContext;

