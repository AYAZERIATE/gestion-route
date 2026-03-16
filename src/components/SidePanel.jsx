import React from "react";
import { MdSecurity, MdVerified, MdShield } from "react-icons/md";
import { HiLocationMarker } from "react-icons/hi";
import { FaRoad } from "react-icons/fa";

export default function SidePanel() {
  return (
    <aside className="auth-side">
      <div className="side-content">

        {/* Logo emblem + wordmark */}
        <div className="cner-logo">
          <div className="logo-emblem">
            <FaRoad className="logo-icon-main" />
          </div>
          <div className="logo-wordmark">
            <span className="logo-cner">CNER</span>
            <span className="logo-tagline">
              Centre National d'Études et de Recherches Routières
            </span>
          </div>
        </div>

        <div className="side-divider" />

        {/* Description */}
        <div className="side-description">
          <h2>Plateforme de Gestion</h2>
          <p>
            Accédez à votre espace institutionnel pour gérer les études routières,
            consulter les données techniques et suivre les projets d'infrastructure
            en toute sécurité.
          </p>
        </div>

        {/* Badges */}
        <div className="side-badges">
          <span className="side-badge">
            <MdSecurity size={12} /> Sécurisé SSL
          </span>
          <span className="side-badge">
            <MdVerified size={12} /> Certifié
          </span>
          <span className="side-badge">
            <HiLocationMarker size={12} /> Maroc
          </span>
          <span className="side-badge">
            <MdShield size={12} /> Données Protégées
          </span>
        </div>

      </div>
    </aside>
  );
}