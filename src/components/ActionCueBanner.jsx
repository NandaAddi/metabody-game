import React from "react";
import { useGameStore } from "../stores/useGameStore";
import "./ActionCueBanner.css";

export default function ActionCueBanner() {
  const currentActionCue = useGameStore((state) => state.currentActionCue);
  const gameStatus = useGameStore((state) => state.gameStatus);

  if (gameStatus !== "playing" || !currentActionCue) {
    return null;
  }

  const { station, role, label, reason, priority } = currentActionCue;

  // Ikon stasiun (satu ikon per stasiun: 💧 nutrisi, 🫁 kardio, 🔬 ekskresi)
  const stationIcon =
    station === "nutrisi"
      ? "💧"
      : station === "kardio"
      ? "🫁"
      : station === "ekskresi"
      ? "🔬"
      : station === "ready"
      ? "🚀"
      : "🧭";

  const priorityClass =
    priority === "critical"
      ? "cue-critical"
      : priority === "warning"
      ? "cue-warning"
      : "cue-normal";

  return (
    <div className={`action-cue-banner-wrapper ${priorityClass}`}>
      <div className="action-cue-badge">
        <span className="cue-icon">{priority === "critical" ? "🚨" : "🎯"}</span>
        <span className="cue-badge-text">
          {priority === "critical" ? "KRISIS GAWAT" : "TARGET AKSI SEKARANG"}
        </span>
      </div>

      <div className="action-cue-content">
        <div className="action-cue-role">
          <span className="action-cue-station-tag">
            {stationIcon} {role}
          </span>
        </div>

        <div className="action-cue-instruction">
          <strong className="action-cue-label">{label}</strong>
          <span className="action-cue-divider">•</span>
          <span className="action-cue-reason">{reason}</span>
        </div>
      </div>
    </div>
  );
}
