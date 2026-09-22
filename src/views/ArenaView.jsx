import React, { useEffect, useRef, useState } from "react";
import { useGameStore } from "../stores/useGameStore";
import BioHUD from "../components/BioHUD";
import BodyCanvas from "../components/BodyCanvas";
import StationsControls from "../components/StationsControls";
import MicroNephronModal from "../components/MicroNephronModal";
import KamusModal from "../components/KamusModal";
import VictoryDefeatModal from "../components/VictoryDefeatModal";
import PauseOverlay from "../components/PauseOverlay";
import FeedbackOverlay from "../components/FeedbackOverlay";
import TutorialSpotlight from "../components/TutorialSpotlight";
import CharacterDialogBox from "../components/CharacterDialogBox";
import ExitConfirmModal from "../components/ExitConfirmModal";
import { GameButton } from "../components/game-ui";
import { useSoundEffects } from "../engine/useSoundEffects";
import { subscribeClassMessages } from "../services/realtimeSync";
import "./ArenaView.css";

export default function ArenaView() {
  const activeMission = useGameStore((state) => state.activeMission);
  const gameStatus = useGameStore((state) => state.gameStatus);
  const startGameplay = useGameStore((state) => state.startGameplay);
  const tick = useGameStore((state) => state.tick);
  const isSoundMuted = useGameStore((state) => state.isSoundMuted);
  const [isTargetsOpen, setIsTargetsOpen] = useState(true);

  const [stageToast, setStageToast] = useState("");
  const audioRef = useRef(null);

  // Aktifkan SFX reaktif (Audit #2)
  useSoundEffects();

  // Berlangganan pesan tahapan kelas dari Guru
  useEffect(() => {
    const unsub = subscribeClassMessages((msg) => {
      if (msg.type === "STAGE_CHANGE" && msg.payload) {
        const stage = msg.payload.stage;
        const stageLabels = {
          pretest: "Tahap 1: Tes Awal Pemahaman (Layar Siaga)",
          gameplay: "Tahap 2: Simulasi Game Dimulai!",
          posttest: "Tahap 3: Tes Akhir Pemahaman",
          closed: "Tahap 4: Pembelajaran Selesai"
        };
        setStageToast(`📢 Guru mengalihkan tahap kelas: ${stageLabels[stage] || stage}`);
        setTimeout(() => setStageToast(""), 5000);
      }
    });
    return unsub;
  }, []);

  // Timer interval per 1 detik (Singleton guarantee, cegah re-render duplicate clock — Audit P1)
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        // Hemat baterai: skip tick saat tab disembunyikan (browser throttling)
        if (document.hidden) return;
        const { gameStatus } = useGameStore.getState();
        if (gameStatus !== "playing") return;
        useGameStore.getState().tick();
      } catch (e) {
        console.warn("[Metabody] tick gagal:", e?.message);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Audio intro VO Si Meta
  useEffect(() => {
    if (activeMission.audioIntro && !isSoundMuted) {
      try {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = "";
        }
        // NOTE: file VO opsional — jika belum ada di public/assets, gagal diam-diam tanpa merusak game
        const audio = new Audio(`${import.meta.env.BASE_URL}assets/audio/${activeMission.audioIntro}`);
        audioRef.current = audio;
        audio.play().catch(() => {
          // Autoplay diblokir atau file belum ada — abaikan, game tetap jalan
        });
      } catch (e) {
        console.warn("[Metabody] Audio intro gagal dimuat:", e?.message);
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, [activeMission, isSoundMuted]);

  const bgStyle = activeMission.bgImage
    ? {
      backgroundImage: `url('${import.meta.env.BASE_URL}assets/backgrounds/${activeMission.bgImage}')`
    }
    : {};

  return (
    <div className="arena-viewport" style={bgStyle}>
      <div className="arena-overlay-dim" />

      {/* 1. Header: Papan Pantau Tubuh (Bio-HUD) */}
      <BioHUD />

      {/* Banner Notifikasi Alihan Tahap Kelas dari Guru */}
      {stageToast && (
        <div style={{
          position: "fixed",
          top: "80px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 999,
          background: "rgba(15, 23, 42, 0.92)",
          backdropFilter: "blur(12px)",
          border: "2px solid var(--color-info-text)",
          borderRadius: "16px",
          padding: "12px 28px",
          color: "#F8FAFC",
          fontSize: "1.1rem",
          fontWeight: 800,
          boxShadow: "0 14px 36px rgba(0,0,0,0.65)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          animation: "fadeIn 0.3s ease"
        }}>
          <span style={{ fontSize: "1.4rem" }}>📡</span>
          <span>{stageToast}</span>
        </div>
      )}

      {/* 2. Panggung Tengah: Avatar Si Meta + Target Mengambang */}
      <main className="arena-center-stage">
        {/* Floating Left: Target Misi & Pembagian Peran (Collapsible) */}
        <div className="arena-floating-left">
          {!isTargetsOpen ? (
            <button
              type="button"
              className="game-chip"
              onClick={() => setIsTargetsOpen(true)}
              title="Buka Target Misi"
            >
              🎯 Target Misi ({activeMission?.learningFocus?.length || 0}) ▼
            </button>
          ) : (
            <aside className="arena-dock-card arena-dock-card--compact">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "1.1rem" }}>🎯</span>
                  <strong style={{ fontFamily: "var(--font-display)", color: "var(--color-info-text)", fontSize: "0.9rem" }}>
                    Target Misi
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTargetsOpen(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#94A3B8",
                    fontFamily: "var(--font-display, sans-serif)",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    padding: "6px 8px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                  title="Sembunyikan panel"
                >
                  ✕ Tutup
                </button>
              </div>

              {gameStatus === "briefing" ? (
                <div>
                  <h5 style={{ color: "var(--color-warn-text)", fontSize: "0.85rem", margin: "0 0 8px 0" }}>
                    {activeMission.title}
                  </h5>
                  {/* Tugas 3 Pemain */}
                  <div style={{
                    padding: "6px 0",
                    marginBottom: "10px",
                    fontSize: "0.75rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px"
                  }}>
                    <div style={{ color: "var(--color-info-text)" }}>💧 <strong>Pemain 1 (Kiri):</strong> Nutrisi & Air</div>
                    <div style={{ color: "var(--color-warn-text)" }}>🫁 <strong>Pemain 2 (Tengah):</strong> Napas & Gerak</div>
                    <div style={{ color: "var(--color-health-text)" }}>🔬 <strong>Pemain 3 (Kanan):</strong> Saring Ginjal</div>
                  </div>

                  <GameButton
                    variant="gold"
                    shape="rect"
                    size="sm"
                    onClick={startGameplay}
                    style={{ width: "100%", fontSize: "0.82rem" }}
                  >
                    ▶️ Mulai Misi
                  </GameButton>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  {activeMission?.learningFocus?.map((focus, idx) => (
                    <div key={idx} style={{
                      fontSize: "0.76rem",
                      lineHeight: "1.35",
                      color: "#F1F5F9",
                      padding: "6px 0",
                      borderBottom: idx < activeMission.learningFocus.length - 1 ? "1px solid rgba(255, 255, 255, 0.08)" : "none",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "6px"
                    }}>
                      <span style={{ color: "var(--color-health-text)", fontWeight: 800 }}>✓</span>
                      <span>{focus}</span>
                    </div>
                  ))}
                </div>
              )}
            </aside>
          )}
        </div>

        {/* Tengah: Kanvas Si Meta & Hotspots Interaktif */}
        <BodyCanvas />
      </main>

      {/* 3. Footer: 3 Stasiun Kendali Multi-Touch Fisik IFP */}
      <StationsControls />

      {/* 4. Modals & Overlays */}
      <MicroNephronModal />
      <KamusModal />
      <VictoryDefeatModal />
      <PauseOverlay />
      <FeedbackOverlay />
      <TutorialSpotlight />
      <CharacterDialogBox />
      <ExitConfirmModal />
    </div>
  );
}
