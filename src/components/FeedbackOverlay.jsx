import React, { useEffect, useState } from "react";
import { useGameStore } from "../stores/useGameStore";

/**
 * FeedbackOverlay — menampilkan floating text feedback saat pemain melakukan aksi.
 * Contoh: "+14% Hidrasi" naik dan menghilang secara animasi.
 */
export default function FeedbackOverlay() {
  const actionFeedback = useGameStore((state) => state.actionFeedback);
  const [visibleFeedback, setVisibleFeedback] = useState(null);

  useEffect(() => {
    if (actionFeedback && actionFeedback.timestamp) {
      setVisibleFeedback(actionFeedback);
      const timer = setTimeout(() => {
        setVisibleFeedback(null);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [actionFeedback]);

  if (!visibleFeedback) return null;

  const isPositive = visibleFeedback.color === "green";

  return (
    <div
      key={visibleFeedback.timestamp}
      style={{
        position: "fixed",
        top: "38%",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 80,
        pointerEvents: "none",
        animation: "feedbackFloat 1.2s ease-out forwards"
      }}
    >
      <div style={{
        background: isPositive
          ? "linear-gradient(135deg, rgba(46, 213, 115, 0.95), rgba(0, 229, 163, 0.95))"
          : "linear-gradient(135deg, rgba(255, 71, 87, 0.95), rgba(255, 107, 107, 0.95))",
        color: "#FFFFFF",
        padding: "10px 22px",
        borderRadius: "var(--radius-full)",
        fontFamily: "var(--font-display)",
        fontSize: "1.3rem",
        fontWeight: 800,
        boxShadow: isPositive
          ? "0 4px 20px rgba(46, 213, 115, 0.5)"
          : "0 4px 20px rgba(255, 71, 87, 0.5)",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        whiteSpace: "nowrap"
      }}>
        <span>{isPositive ? "✅" : "⚡"}</span>
        <span>{visibleFeedback.label}</span>
      </div>
    </div>
  );
}
