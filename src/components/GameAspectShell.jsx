import React from "react";
import "./GameAspectShell.css";

/**
 * GameAspectShell — Pengunci Rasio Standar 16:9 Sinematik (Konsol Arcade & IFP 65"+)
 * Memastikan tampilan game terkunci presisi di rasio 16:9 seperti video sinematik
 * di monitor ultrawide, laptop 16:10, maupun tablet siswa tanpa distorsi atau regang.
 */
export default function GameAspectShell({ children }) {
  return (
    <div className="game-aspect-shell">
      <div className="game-aspect-frame">
        {children}
      </div>
    </div>
  );
}
