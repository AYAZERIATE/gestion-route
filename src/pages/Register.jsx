import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdEmail, MdLock, MdVisibility, MdVisibilityOff,
  MdArrowForward, MdCheckCircle, MdError, MdPersonAdd,
} from "react-icons/md";

import { AuthContext } from "../contexts/AuthContext";
import SidePanel   from "../components/SidePanel";
import ThemeToggle from "../components/ThemeToggle";
import "../styles/auth.css";

function validate(form) {
  const errs = {};
  if (!form.name) {
    errs.name = "Le nom est requis.";
  }
  if (!form.email) {
    errs.email = "L'adresse email est requise.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errs.email = "Format d'email invalide.";
  }
  if (!form.password) {
    errs.password = "Le mot de passe est requis.";
  } else if (form.password.length < 8) {
    errs.password = "Minimum 8 caractères requis.";
  }
  if (!form.confirm) {
    errs.confirm = "Veuillez confirmer votre mot de passe.";
  } else if (form.password && form.confirm !== form.password) {
    errs.confirm = "Les mots de passe ne correspondent pas.";
  }
  return errs;
}

export default function Register() {
  const navigate = useNavigate();

  const auth     = useContext(AuthContext);
  const register = auth?.register;

  const [form, setForm]           = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors]       = useState({});
  const [showPwd, setShowPwd]     = useState(false);
  const [showConf, setShowConf]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);
  const [serverErr, setServerErr] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
    if (serverErr) setServerErr("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setServerErr("");

    // ── الجزء الوحيد اللي تبدل ──
    const result = await register(form.name, form.email, form.password);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate("/dashboard", { replace: true }), 1000);
    } else {
      setServerErr(result.message || "Une erreur est survenue. Veuillez réessayer.");
    }
    // ────────────────────────────

    setLoading(false);
  };

  return (
    <div className="auth-layout">
      <SidePanel />

      <main className="auth-form-panel">
        <ThemeToggle />

        <div className="form-card">
          <div className="form-header">
            <div className="page-label">
              <MdPersonAdd size={12} /> Nouveau Compte
            </div>
            <h1>Créer un compte</h1>
            <p>Remplissez le formulaire pour accéder à la plateforme CNER.</p>
          </div>

          {serverErr && (
            <div className="field-error" style={{ marginBottom: 16, padding: "10px 14px" }}>
              <MdError size={14} /> {serverErr}
            </div>
          )}

          {success && (
            <div className="success-banner">
              <MdCheckCircle size={18} />
              Compte créé avec succès ! Redirection…
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            {/* Name — جديد */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">Nom complet</label>
              <div className="input-wrap">
                <input
                  id="reg-name"
                  className={`form-input${errors.name ? " error-input" : ""}`}
                  type="text"
                  name="name"
                  placeholder="Votre nom complet"
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
              {errors.name && (
                <div className="field-error"><MdError size={13} /> {errors.name}</div>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Adresse Gmail</label>
              <div className="input-wrap">
                <input
                  id="reg-email"
                  className={`form-input${errors.email ? " error-input" : ""}`}
                  type="email"
                  name="email"
                  placeholder="vous@gmail.com"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                />
                <span className="input-icon"><MdEmail /></span>
              </div>
              {errors.email && (
                <div className="field-error"><MdError size={13} /> {errors.email}</div>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Mot de passe</label>
              <div className="input-wrap">
                <input
                  id="reg-password"
                  className={`form-input has-eye${errors.password ? " error-input" : ""}`}
                  type={showPwd ? "text" : "password"}
                  name="password"
                  placeholder="Minimum 8 caractères"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                />
                <span className="input-icon"><MdLock /></span>
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPwd((v) => !v)}
                  aria-label={showPwd ? "Masquer" : "Afficher"}
                >
                  {showPwd ? <MdVisibilityOff size={17} /> : <MdVisibility size={17} />}
                </button>
              </div>
              {errors.password && (
                <div className="field-error"><MdError size={13} /> {errors.password}</div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirm">Confirmer le mot de passe</label>
              <div className="input-wrap">
                <input
                  id="reg-confirm"
                  className={`form-input has-eye${errors.confirm ? " error-input" : ""}`}
                  type={showConf ? "text" : "password"}
                  name="confirm"
                  placeholder="Répétez votre mot de passe"
                  autoComplete="new-password"
                  value={form.confirm}
                  onChange={handleChange}
                />
                <span className="input-icon"><MdLock /></span>
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowConf((v) => !v)}
                  aria-label={showConf ? "Masquer" : "Afficher"}
                >
                  {showConf ? <MdVisibilityOff size={17} /> : <MdVisibility size={17} />}
                </button>
              </div>
              {errors.confirm && (
                <div className="field-error"><MdError size={13} /> {errors.confirm}</div>
              )}
            </div>

            <button type="submit" className="btn-submit" disabled={loading || success}>
              {loading
                ? <><span className="btn-spinner" /> Création en cours…</>
                : <>S'inscrire <MdArrowForward size={18} /></>
              }
            </button>
          </form>

          <div className="form-footer">
            Vous avez déjà un compte ?{" "}
            <button onClick={() => navigate("/login")}>Se connecter</button>
          </div>
        </div>
      </main>
    </div>
  );
}
