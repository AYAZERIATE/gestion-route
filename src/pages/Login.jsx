import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MdEmail, MdLock, MdVisibility, MdVisibilityOff,
  MdArrowForward, MdCheckCircle, MdError, MdLogin,
} from "react-icons/md";
import { AuthContext } from "../contexts/AuthContext";
import SidePanel   from "../components/SidePanel";
import ThemeToggle from "../components/ThemeToggle";
import "../styles/auth.css";

function validate(form) {
  const errs = {};
  if (!form.email) {
    errs.email = "L'adresse email est requise.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errs.email = "Format d'email invalide.";
  }
  if (!form.password) errs.password = "Le mot de passe est requis.";
  return errs;
}

export default function Login() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const auth      = useContext(AuthContext);
  const from      = location.state?.from?.pathname || "/dashboard";

  const [form,    setForm]    = useState({ email: "", password: "" });
  const [errors,  setErrors]  = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [authErr, setAuthErr] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
    if (authErr) setAuthErr("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setAuthErr("");

    try {
      if (typeof auth?.login !== "function") throw new Error("AuthContext non disponible.");

      const result = await auth.login(form.email, form.password);

      if (result?.success) {
        setSuccess(true);
        setTimeout(() => navigate(from, { replace: true }), 900);
      } else {
        setAuthErr(result?.message || "Identifiants incorrects.");
      }
    } catch (err) {
      setAuthErr(err?.message || "Erreur inattendue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <SidePanel />
      <main className="auth-form-panel">
        <ThemeToggle />
        <div className="form-card">

          <div className="form-header">
            <div className="page-label"><MdLogin size={12} /> Connexion</div>
            <h1>Bon retour</h1>
            <p>Connectez-vous à votre espace institutionnel CNER.</p>
          </div>

          {authErr && (
            <div className="field-error" style={{ marginBottom: 16, padding: "10px 14px" }}>
              <MdError size={14} /> {authErr}
            </div>
          )}
          {success && (
            <div className="success-banner">
              <MdCheckCircle size={18} /> Connexion réussie ! Redirection…
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="l-email">Adresse Gmail</label>
              <div className="input-wrap">
                <input id="l-email" className={`form-input${errors.email ? " error-input" : ""}`}
                  type="email" name="email" placeholder="vous@gmail.com"
                  autoComplete="email" value={form.email} onChange={handleChange} />
                <span className="input-icon"><MdEmail /></span>
              </div>
              {errors.email && <div className="field-error"><MdError size={13}/> {errors.email}</div>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="l-pass">Mot de passe</label>
              <div className="input-wrap">
                <input id="l-pass"
                  className={`form-input has-eye${errors.password ? " error-input" : ""}`}
                  type={showPwd ? "text" : "password"} name="password"
                  placeholder="Votre mot de passe" autoComplete="current-password"
                  value={form.password} onChange={handleChange} />
                <span className="input-icon"><MdLock /></span>
                <button type="button" className="eye-btn"
                  onClick={() => setShowPwd(v => !v)}
                  aria-label={showPwd ? "Masquer" : "Afficher"}>
                  {showPwd ? <MdVisibilityOff size={17}/> : <MdVisibility size={17}/>}
                </button>
              </div>
              {errors.password && <div className="field-error"><MdError size={13}/> {errors.password}</div>}
            </div>

            <button type="submit" className="btn-submit" disabled={loading || success}>
              {loading ? <><span className="btn-spinner"/> Vérification…</>
                       : <>Se connecter <MdArrowForward size={18}/></>}
            </button>
          </form>

          <div className="form-footer">
            Vous n'avez pas de compte ?{" "}
            <button onClick={() => navigate("/register")}>S'inscrire</button>
          </div>
        </div>
      </main>
    </div>
  );
}