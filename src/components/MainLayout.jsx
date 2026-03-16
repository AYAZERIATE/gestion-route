
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
export default function MainLayout() {
  return (
    <>
      {}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        html, body, #root {
          margin: 0; padding: 0;
          min-height: 100vh;
          font-family: var(--font);
          background: var(--bg);
          color: var(--text);
          transition: background 0.35s, color 0.35s;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar        { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track  { background: transparent; }
        ::-webkit-scrollbar-thumb  { background: var(--scroll-thumb); border-radius: 4px; }
        * { scrollbar-width: thin; scrollbar-color: var(--scroll-thumb) transparent; }
      `}</style>

      {}
      <div style={{
        display:   "flex",
        minHeight: "100vh",
        background: "var(--bg)",
        transition: "background 0.35s",
      }}>

        {}
        <Sidebar />

        {}
        <div
          className="main-layout__body"
          style={{
            flex:           1,
            display:        "flex",
            flexDirection:  "column",
            minWidth:       0,           
            minHeight:      "100vh",
          }}
        >
          {}
          <main
            className="main-layout__content"
            style={{
              flex:       1,
              overflowY:  "auto",
              padding:    "clamp(16px, 3vw, 32px)",
              transition: "background 0.35s",
            }}
          >
            {
              
            }
            <Outlet />
          </main>

          {}
          <Footer />
        </div>

      </div>
    </>
  );
}
