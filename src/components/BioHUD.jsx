import React from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../stores/useGameStore";
import { GameButton } from "./game-ui";
import "./BioHUD.css";

export default function BioHUD() {
  const homeostasisIndex = useGameStore((state) => state.homeostasisIndex);
  const telemetry = useGameStore((state) => state.telemetry);
  const remainingSeconds = useGameStore((state) => state.remainingSeconds);
  const activeMission = useGameStore((state) => state.activeMission);
  const isSoundMuted = useGameStore((state) => state.isSoundMuted);
  const toggleSound = useGameStore((state) => state.toggleSound);
  const openKamus = useGameStore((state) => state.openKamus);
  const gameStatus = useGameStore((state) => state.gameStatus);
  const pauseGame = useGameStore((state) => state.pauseGame);
  const setShowExitConfirm = useGameStore((state) => state.setShowExitConfirm);
  const navigate = useNavigate();

  // Format Timer mm:ss
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeFormatted = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  const isTimerUrgent = remainingSeconds <= 30 && gameStatus === "playing";

  // Evaluasi warna, teks status, & mood avatar Si Meta
  let hiColor = "var(--color-health-text, #4ADE80)";
  let hiText = "Sehat & Seimbang";
  let avatarMoodIcon = "😊";

  if (homeostasisIndex < 40) {
    hiColor = "var(--color-danger-text, #F87171)";
    hiText = "Kritis Bahaya!";
    avatarMoodIcon = "🚨";
  } else if (homeostasisIndex < 75) {
    hiColor = "var(--color-warn-text, #FBBF24)";
    hiText = "Peringatan Waspada";
    avatarMoodIcon = "😥";
  }

  // Mini indikator pencernaan-hati-aditif (Bab 2: nutrien, hati, zat aditif)
  const energy = telemetry?.energy ?? 80;
  const liverLoad = telemetry?.liverLoad ?? 10;
  const additiveLoad = telemetry?.additiveLoad ?? 0;

  const energyColor = energy < 35 ? "var(--color-danger-text, #F87171)" : energy < 60 ? "var(--color-warn-text, #FBBF24)" : "var(--color-health-text, #4ADE80)";
  const liverColor = liverLoad > 60 ? "var(--color-danger-text, #F87171)" : liverLoad > 40 ? "var(--color-warn-text, #FBBF24)" : "var(--color-health-text, #4ADE80)";
  const additiveColor = additiveLoad > 55 ? "var(--color-danger-text, #F87171)" : additiveLoad > 25 ? "var(--color-warn-text, #FBBF24)" : "var(--text-on-dark-dim, #CBD5E1)";

  const handleMenuClick = () => {
    if (gameStatus === "playing" || gameStatus === "paused") {
      setShowExitConfirm(true);
    } else {
      navigate("/");
    }
  };

  return (
    <header className="hud-master-dock">
      {/* ------------------------------------------------------------------ */}
      {/* ZONE 1: LEFT CLUSTER (Navigasi Menu, Misi, & Stopwatch Timer)       */}
      {/* ------------------------------------------------------------------ */}
      <div className="hud-left-cluster">
        {/* Tombol Lingkaran Arcade Menu Utama */}
        <GameButton
          variant="slate"
          shape="circle"
          size="md"
          onClick={handleMenuClick}
          title="Kembali ke Menu Utama"
          style={{ width: "42px", height: "42px", minWidth: "42px", minHeight: "42px", fontSize: "1.05rem" }}
        >
          🏠
        </GameButton>

        {/* Plaque Identitas Misi */}
        <div className="hud-mission-badge">
          <span className="hud-mission-tag">{activeMission.code}</span>
          <span className="hud-mission-title">{activeMission.title}</span>
        </div>

        {/* Arcade Stopwatch Timer */}
        <div className={`hud-stopwatch ${isTimerUrgent ? "is-urgent" : ""}`} title="Sisa Waktu Simulasi Misi">
          <span className="hud-stopwatch-icon">{isTimerUrgent ? "⏳" : "⏱️"}</span>
          <span className="hud-stopwatch-digits">{timeFormatted}</span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* ZONE 2: CENTER VITALITY CAPSULE (Homeostasis Si Meta)               */}
      {/* ------------------------------------------------------------------ */}
      <div className="hud-vitality-capsule">
        {/* Baris Atas: Mini Avatar Reaktif + Judul + Skor % + Status Dot */}
        <div className="hud-vitality-top">
          <div className="hud-vitality-avatar-box">
            <span className="hud-vitality-avatar" title={`Kondisi Si Meta: ${hiText}`}>
              {avatarMoodIcon}
            </span>
            <span className="hud-vitality-label">Keseimbangan Tubuh</span>
          </div>

          <div className="hud-vitality-score">
            <span className="hud-vitality-num" style={{ color: hiColor }}>
              {homeostasisIndex}%
            </span>
            <span className="hud-vitality-status" style={{ color: hiColor }}>
              <span className="status-dot" style={{ backgroundColor: hiColor }} />
              {hiText}
            </span>
          </div>
        </div>

        {/* Chunky Jelly Progress Bar Track */}
        <div className="hud-jelly-bar-track">
          <div
            className="hud-jelly-bar-fill"
            style={{
              transform: `scaleX(${Math.max(0, Math.min(100, homeostasisIndex)) / 100})`,
              background: `linear-gradient(90deg, ${hiColor} 0%, #FFFFFF 170%)`
            }}
          >
            {/* Specular Light Reflection Arc */}
            <span className="hud-jelly-shine" />
          </div>
        </div>

        {/* Sub-Metrics Strip (3 Kolom Terintegrasi) */}
        <div className="hud-submetrics-strip">
          <div className="hud-submetric" title="Energi hasil cerna (karbohidrat, protein, lemak)">
            <span>⚡ Energi</span>
            <strong style={{ color: energyColor }}>{Math.round(energy)}%</strong>
          </div>

          <div className="hud-submetric-divider" />

          <div className="hud-submetric" title="Beban detoksifikasi racun di hati">
            <span>🧪 Beban Hati</span>
            <strong style={{ color: liverColor }}>{Math.round(liverLoad)}</strong>
          </div>

          <div className="hud-submetric-divider" />

          <div className="hud-submetric" title="Akumulasi zat aditif sintetis (pewarna/pengawet/MSG)">
            <span>🧫 Zat Aditif</span>
            <strong style={{ color: additiveColor }}>{Math.round(additiveLoad)}</strong>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* ZONE 3: RIGHT CLUSTER (Kamus IPA CTA & Utilitas Arcade Seragam)     */}
      {/* ------------------------------------------------------------------ */}
      <div className="hud-right-cluster">
        {/* Tombol Kamus Bantuan IPA (Featured CTA) */}
        <GameButton
          variant="blue"
          shape="rect"
          size="sm"
          onClick={openKamus}
          icon="📖"
          title="Buka Kamus Istilah IPA Kurikulum Merdeka"
          style={{ height: "42px", padding: "0 14px", fontSize: "0.85rem" }}
        >
          Kamus IPA
        </GameButton>

        {/* Tombol Laboratorium 3D Fisiologi */}
        <GameButton
          variant="gold"
          shape="rect"
          size="sm"
          onClick={() => window.open("/laboratorium-3d", "_blank")}
          icon="🔬"
          title="Buka Laboratorium 3D Fisiologi (Sirkulasi Darah & Nefron)"
          style={{ height: "42px", padding: "0 12px", fontSize: "0.85rem" }}
        >
          Lab 3D
        </GameButton>

        {/* Tombol Lingkaran Arcade Jeda Permainan */}
        {gameStatus === "playing" && (
          <GameButton
            variant="slate"
            shape="circle"
            size="md"
            onClick={pauseGame}
            title="Jeda Permainan"
            style={{ width: "42px", height: "42px", minWidth: "42px", minHeight: "42px", fontSize: "1rem" }}
          >
            ⏸️
          </GameButton>
        )}

        {/* Tombol Lingkaran Arcade Toggle Suara */}
        <GameButton
          variant="slate"
          shape="circle"
          size="md"
          onClick={toggleSound}
          title={isSoundMuted ? "Bunyikan Suara" : "Senyapkan Suara (Mute)"}
          style={{ width: "42px", height: "42px", minWidth: "42px", minHeight: "42px", fontSize: "1.05rem" }}
        >
          {isSoundMuted ? "🔇" : "🔊"}
        </GameButton>
      </div>
    </header>
  );
}
