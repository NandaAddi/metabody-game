import React from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../stores/useGameStore";
import { GameModal, GameButton } from "./game-ui";

export default function PauseOverlay() {
  const gameStatus = useGameStore((state) => state.gameStatus);
  const resumeGame = useGameStore((state) => state.resumeGame);
  const restartMission = useGameStore((state) => state.restartMission);
  const activeMission = useGameStore((state) => state.activeMission);
  const homeostasisIndex = useGameStore((state) => state.homeostasisIndex);
  const remainingSeconds = useGameStore((state) => state.remainingSeconds);
  const navigate = useNavigate();

  if (gameStatus !== "paused") return null;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeFormatted = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  const handleExit = () => {
    navigate("/");
  };

  const handleRestart = () => {
    restartMission();
  };

  const footerActions = (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", marginTop: "8px" }}>
      <GameButton
        variant="gold"
        shape="rect"
        size="lg"
        onClick={resumeGame}
        sound="confirm"
        style={{ width: "100%" }}
      >
        ▶️ Lanjutkan Bermain
      </GameButton>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <GameButton
          variant="purple"
          shape="rect"
          size="md"
          onClick={handleRestart}
          sound="normal"
        >
          🔄 Ulangi Misi
        </GameButton>

        <GameButton
          variant="red"
          shape="rect"
          size="md"
          onClick={handleExit}
          sound="cancel"
        >
          🏠 Menu Utama
        </GameButton>
      </div>
    </div>
  );

  return (
    <GameModal
      isOpen={true}
      title="PERMAINAN DIJEDA"
      headerVariant="gold"
      headerIcon="⏸️"
      onClose={resumeGame}
      size="md"
      footer={footerActions}
    >
      <div style={{ textAlign: "center", padding: "10px 8px 6px" }}>
        <h3 style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.35rem",
          color: "#FFFFFF",
          marginBottom: "4px"
        }}>
          {activeMission?.title || "Misi Simulasi Tubuh"}
        </h3>
        <p style={{ color: "var(--text-on-dark-dim)", fontSize: "0.95rem", marginBottom: "18px" }}>
          Sisa Waktu: <strong style={{ color: "var(--color-info-text)", fontSize: "1.1rem" }}>{timeFormatted}</strong>
        </p>

        {/* Status Dashboard Mini */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          background: "rgba(15, 23, 42, 0.6)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "16px",
          padding: "12px",
          marginBottom: "12px"
        }}>
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-on-dark-dim)", display: "block" }}>Indeks Keseimbangan</span>
            <strong style={{
              fontSize: "1.35rem",
              fontFamily: "var(--font-display)",
              color: homeostasisIndex < 40 ? "var(--color-danger-text)"
                : homeostasisIndex < 70 ? "var(--color-warn-text)"
                : "var(--color-health-text)"
            }}>
              {homeostasisIndex}%
            </strong>
          </div>

          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-on-dark-dim)", display: "block" }}>Kode Target Misi</span>
            <strong style={{
              fontSize: "1.35rem",
              fontFamily: "var(--font-display)",
              color: "#F472B6"
            }}>
              {activeMission?.code || "MISI-01"}
            </strong>
          </div>
        </div>
      </div>
    </GameModal>
  );
}
