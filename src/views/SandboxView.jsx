import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../stores/useGameStore";
import { SANDBOX_PRESETS } from "../data/sandboxPresets";
import BodyCanvas from "../components/BodyCanvas";
import StationsControls from "../components/StationsControls";
import MicroNephronModal from "../components/MicroNephronModal";
import KamusModal from "../components/KamusModal";
import NetworkStatusBadge from "../components/NetworkStatusBadge";
import { GameButton } from "../components/game-ui";
import { broadcastClassMessage } from "../services/realtimeSync";
import { useSoundEffects } from "../engine/useSoundEffects";
import "./SandboxView.css";

export default function SandboxView() {
  const navigate = useNavigate();
  const telemetry = useGameStore((state) => state.telemetry);
  const homeostasisIndex = useGameStore((state) => state.homeostasisIndex);
  const sandboxElapsedSeconds = useGameStore((state) => state.sandboxElapsedSeconds || 0);
  const activeSandboxPreset = useGameStore((state) => state.activeSandboxPreset);
  const sandboxStressors = useGameStore((state) => state.sandboxStressors);
  const startSandboxMode = useGameStore((state) => state.startSandboxMode);
  const applySandboxPreset = useGameStore((state) => state.applySandboxPreset);
  const setSandboxStressor = useGameStore((state) => state.setSandboxStressor);
  const exitSandboxMode = useGameStore((state) => state.exitSandboxMode);
  const openMicroLens = useGameStore((state) => state.openMicroLens);
  const openKamus = useGameStore((state) => state.openKamus);
  const tick = useGameStore((state) => state.tick);

  const [broadcastToast, setBroadcastToast] = useState("");

  // Aktifkan SFX reaktif
  useSoundEffects();

  // Inisialisasi Mode Sandbox saat komponen dimuat
  useEffect(() => {
    startSandboxMode("NORMAL");

    // Interval tick lab untuk durasi eksperimen
    const interval = setInterval(() => {
      try {
        if (document.hidden) return;
        tick();
      } catch (e) {
        console.warn("[Metabody] sandbox tick gagal:", e?.message);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      exitSandboxMode();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentPreset =
    SANDBOX_PRESETS.find((p) => p.id === activeSandboxPreset) || SANDBOX_PRESETS[0];

  // Format Elapsed Lab Time mm:ss
  const minutes = Math.floor(sandboxElapsedSeconds / 60);
  const seconds = sandboxElapsedSeconds % 60;
  const labDurationFormatted = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  // Warna indikator Homeostasis
  let hiColor = "var(--color-health-text)";
  let hiBadgeBg = "rgba(34, 197, 94, 0.18)";
  let hiText = "Homeostasis Stabil (Optimal)";
  if (homeostasisIndex < 40) {
    hiColor = "var(--color-danger-text)";
    hiBadgeBg = "rgba(239, 68, 68, 0.2)";
    hiText = "Krisis Homeostasis Ekstrem!";
  } else if (homeostasisIndex < 75) {
    hiColor = "var(--color-warn-text)";
    hiBadgeBg = "rgba(245, 158, 11, 0.2)";
    hiText = "Kompensasi Organ Aktif";
  }

  // Handler Siarkan Telemetri Laboratorium ke Tablet Kelompok
  const handleBroadcastTelemetry = () => {
    broadcastClassMessage("MISSION_TELEMETRY", {
      missionId: "LAB-SANDBOX",
      missionTitle: `Laboratorium: ${currentPreset.name}`,
      heartRate: telemetry.heartRate,
      coreTemp: telemetry.coreTemp,
      sweatRate: telemetry.sweatRate,
      urineVolume: telemetry.urineVolume,
      urineColor: telemetry.urineColor,
      hydration: telemetry.hydration,
      homeostasisIndex,
      timestamp: Date.now()
    });
    setBroadcastToast("📡 Data kondisi tubuh laboratorium berhasil disiarkan ke seluruh tablet siswa!");
    setTimeout(() => setBroadcastToast(""), 4500);
  };

  const activityLabels = ["0. Istirahat (72 BPM)", "1. Jalan Santai (95 BPM)", "2. Lari Olahraga (130 BPM)", "3. Sprint Maraton (165 BPM)"];

  return (
    <div className="sandbox-viewport">
      <div className="sandbox-ambient-grid" />

      {/* 1. Header BioHUD Khusus Sandbox */}
      <header className="sandbox-header">
        {/* Sisi Kiri: Branding & Navigasi */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <GameButton variant="slate" shape="rect" size="sm" onClick={() => navigate("/")} title="Kembali ke Menu Utama">
            🏠 Launcher
          </GameButton>

          <GameButton variant="slate" shape="rect" size="sm" onClick={() => navigate("/arena")} title="Kembali ke Mode Misi">
            🎮 Mode Misi
          </GameButton>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                className="badge-tag"
                style={{
                  background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
                  color: "#FFF",
                  fontWeight: 800
                }}
              >
                ⚗️ MODE SANDBOX
              </span>
              <strong style={{ color: "var(--text-on-dark)", fontSize: "1.1rem" }}>
                Laboratorium Fisiologi Bebas
              </strong>
            </div>
            <div style={{ color: "var(--text-on-dark-dim)", fontSize: "0.8rem", marginTop: "2px" }}>
              Eksplorasi mandiri tanpa batas waktu • Uji respons ekstrem 4 organ ekskresi
            </div>
          </div>

          <NetworkStatusBadge />
        </div>

        {/* Sisi Tengah: Homeostasis Progress Bar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxWidth: "340px", width: "100%", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-on-dark-dim)", fontWeight: 600 }}>
              Keseimbangan Tubuh (Homeostasis):
            </span>
            <span style={{ fontSize: "1.1rem", fontWeight: 800, color: hiColor }}>
              {homeostasisIndex}%
            </span>
          </div>
          <div style={{ width: "100%", height: "12px", background: "rgba(15, 23, 42, 0.8)", borderRadius: "999px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div
              style={{
                width: `${homeostasisIndex}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${hiColor} 0%, #FFFFFF 140%)`,
                boxShadow: `0 0 10px ${hiColor}`,
                transition: "all 0.3s ease"
              }}
            />
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: (telemetry.energy ?? 80) < 35 ? "var(--color-danger-text)" : "var(--color-health-text)" }} title="Energi hasil cerna">
              ⚡ {Math.round(telemetry.energy ?? 80)}%
            </span>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: (telemetry.liverLoad ?? 10) > 40 ? "var(--color-warn-text)" : "var(--color-health-text)" }} title="Beban detoks hati">
              🧪 Hati {Math.round(telemetry.liverLoad ?? 10)}
            </span>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: (telemetry.additiveLoad ?? 0) > 25 ? "var(--color-warn-text)" : "var(--text-on-dark-dim)" }} title="Tumpukan zat aditif">
              🧫 Aditif {Math.round(telemetry.additiveLoad ?? 0)}
            </span>
          </div>
        </div>

        {/* Sisi Kanan: Durasi Lab & Vital Signs */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Timer Durasi Lab */}
          <div
            style={{
              background: "#0F172A",
              border: "1px solid #334155",
              padding: "6px 12px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "var(--color-info-text)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.95rem",
              fontWeight: 700
            }}
            title="Waktu Eksplorasi di Laboratorium"
          >
            <span>⏱️</span>
            <span>{labDurationFormatted}</span>
          </div>

          {/* Tombol Nefron */}
          <GameButton
            variant="purple"
            shape="rect"
            size="sm"
            onClick={openMicroLens}
            title="Buka Laboratorium 3 Gerbang Nefron"
          >
            🔬 Nefron
          </GameButton>

          {/* Tombol Kamus */}
          <GameButton
            variant="blue"
            shape="rect"
            size="sm"
            onClick={openKamus}
            title="Buka Kamus Istilah IPA"
          >
            📖 Kamus
          </GameButton>
        </div>
      </header>

      {/* Banner Toast Siaran Telemetri */}
      {broadcastToast && (
        <div
          style={{
            position: "fixed",
            top: "75px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 999,
            background: "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(12px)",
            border: "2px solid var(--color-health-text)",
            borderRadius: "14px",
            padding: "10px 24px",
            color: "#4ADE80",
            fontWeight: 700,
            fontSize: "0.95rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(34, 197, 94, 0.3)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            animation: "fadeIn 0.3s ease"
          }}
        >
          <span>📡</span>
          <span>{broadcastToast}</span>
        </div>
      )}

      {/* 2. Panggung Utama (Kanvas Si Meta + Konsol Stresor Sains) */}
      <main className="sandbox-main-stage">
        {/* Area Kiri/Tengah: Avatar Si Meta & Hotspots Organ */}
        <section className="sandbox-avatar-area">
          <BodyCanvas />
        </section>

        {/* Area Kanan: Konsol Stresor & Eksperimen Sains */}
        <aside className="sandbox-console-dock">
          {/* Seksi 1: 5 Preset Skenario Ekstrem */}
          <div>
            <div className="sandbox-section-title">
              <span>⚡</span>
              <span>1. Preset Skenario Biologis Ekstrem</span>
            </div>
            <div className="sandbox-presets-grid">
              {SANDBOX_PRESETS.map((p) => {
                const isActive = p.id === activeSandboxPreset;
                return (
                  <button
                    key={p.id}
                    onClick={() => applySandboxPreset(p.id)}
                    className={`sandbox-preset-btn ${isActive ? "active" : ""}`}
                    title={p.tagline}
                  >
                    <span style={{ fontSize: "1.2rem" }}>{p.icon}</span>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <strong style={{ fontSize: "0.82rem", color: isActive ? "var(--color-info-text)" : "var(--text-on-dark)" }}>
                        {p.name}
                      </strong>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Seksi 2: Slider Kendali Variabel Lingkungan & Metabolisme */}
          <div>
            <div className="sandbox-section-title">
              <span>🎛️</span>
              <span>2. Manipulasi Variabel Stresor</span>
            </div>

            <div className="sandbox-slider-group">
              {/* Slider 1: Suhu Lingkungan */}
              <div className="sandbox-slider-item">
                <div className="sandbox-slider-label">
                  <span>🌡️ Suhu Lingkungan:</span>
                  <strong style={{ color: sandboxStressors.ambientTemp > 35 ? "var(--color-danger-text)" : sandboxStressors.ambientTemp < 20 ? "var(--color-info-text)" : "var(--color-health-text)" }}>
                    {sandboxStressors.ambientTemp}°C
                  </strong>
                </div>
                <input
                  type="range"
                  min="14"
                  max="44"
                  value={sandboxStressors.ambientTemp}
                  onChange={(e) => setSandboxStressor("ambientTemp", Number(e.target.value))}
                  className="sandbox-range-input"
                />
              </div>

              {/* Slider 2: Intensitas Aktivitas Fisik */}
              <div className="sandbox-slider-item">
                <div className="sandbox-slider-label">
                  <span>🏃 Intensitas Gerak / Lari:</span>
                  <strong style={{ color: "var(--color-warn-text)" }}>
                    {activityLabels[sandboxStressors.activityLevel] || "Resting"}
                  </strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="1"
                  value={sandboxStressors.activityLevel}
                  onChange={(e) => setSandboxStressor("activityLevel", Number(e.target.value))}
                  className="sandbox-range-input"
                />
              </div>

              {/* Slider 3: Tingkat Hidrasi */}
              <div className="sandbox-slider-item">
                <div className="sandbox-slider-label">
                  <span>💧 Tingkat Hidrasi Tubuh:</span>
                  <strong style={{ color: sandboxStressors.hydrationLevel < 50 ? "var(--color-danger-text)" : "var(--color-info-text)" }}>
                    {sandboxStressors.hydrationLevel}%
                  </strong>
                </div>
                <input
                  type="range"
                  min="30"
                  max="95"
                  value={sandboxStressors.hydrationLevel}
                  onChange={(e) => setSandboxStressor("hydrationLevel", Number(e.target.value))}
                  className="sandbox-range-input"
                />
              </div>

              {/* Slider 4: Beban Toksin Urea */}
              <div className="sandbox-slider-item">
                <div className="sandbox-slider-label">
                  <span>🧪 Beban Racun Urea Darah:</span>
                  <strong style={{ color: sandboxStressors.ureaLoad > 35 ? "var(--color-danger-text)" : "#A855F7" }}>
                    {sandboxStressors.ureaLoad} mg/dL
                  </strong>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={sandboxStressors.ureaLoad}
                  onChange={(e) => setSandboxStressor("ureaLoad", Number(e.target.value))}
                  className="sandbox-range-input"
                />
              </div>
            </div>
          </div>

          {/* Seksi 3: Telaah Sebab-Akibat Biologis */}
          <div>
            <div className="sandbox-section-title">
              <span>🧠</span>
              <span>3. Telaah Kausal Fisiologis (Berpikir Sistemik)</span>
            </div>

            <div className="sandbox-biocausal-card">
              <div style={{ fontWeight: 700, color: "var(--color-info-text)", marginBottom: "6px" }}>
                {currentPreset.tagline}
              </div>
              <p style={{ margin: "0 0 8px", lineHeight: "1.45" }}>
                {currentPreset.scientificExplanation}
              </p>
              <div style={{ background: "rgba(56, 189, 248, 0.12)", border: "1px dashed rgba(56, 189, 248, 0.3)", borderRadius: "8px", padding: "8px 10px", fontSize: "0.8rem", color: "#BAE6FD" }}>
                🎯 <strong>Fokus Observasi Siswa:</strong> {currentPreset.focusObservation}
              </div>
            </div>
          </div>

          {/* Seksi 4: Tombol Aksi Cepat & Siaran LKPD */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "auto" }}>
            <GameButton
              variant="green"
              shape="rect"
              size="md"
              onClick={handleBroadcastTelemetry}
              sound="confirm"
            >
              📡 Siarkan Data Tubuh ke Tablet Siswa
            </GameButton>

            <GameButton
              variant="blue"
              shape="rect"
              size="sm"
              onClick={() => applySandboxPreset("NORMAL")}
              sound="cancel"
              style={{ width: "100%" }}
            >
              🔄 Reset ke Kondisi Normal (100%)
            </GameButton>
          </div>
        </aside>
      </main>

      {/* 3. Panel Kendali 3 Operator Bawah */}
      <footer className="sandbox-bottom-controls">
        <StationsControls />
      </footer>

      {/* Modals */}
      <MicroNephronModal />
      <KamusModal />
    </div>
  );
}
