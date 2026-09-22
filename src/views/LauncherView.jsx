import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GameButton } from "../components/game-ui";
import { playGameClickSFX } from "../engine/useSoundEffects";
import "./LauncherView.css";

const GREETINGS = [
  "Hai Penjaga Tubuh! Sentuh tombol di sebelah kanan untuk memulai petualangan!",
  "Siap menjaga kestabilan glukosa, suhu, dan osmolalitas darah?",
  "Sentuh 'Mulai Simulasi Arena' untuk ekspedisi 3 stasiun organ!",
  "Jelajahi juga 'Laboratorium 3D Fisiologi' untuk mengamati aliran darah dan nefron!",
  "Ayo amankan tubuh pasien dari gangguan homeostasis!",
];

export default function LauncherView() {
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [isCharacterBouncing, setIsCharacterBouncing] = useState(false);

  // Toggle mode layar penuh (F11 / fullscreen API)
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn("Fullscreen request error:", err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => {
        console.warn("Fullscreen exit error:", err);
      });
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Interaksi saat menyentuh Si Meta
  const handleSimetaClick = () => {
    playGameClickSFX("confirm");
    setIsCharacterBouncing(true);
    setGreetingIndex((prev) => (prev + 1) % GREETINGS.length);
    setTimeout(() => setIsCharacterBouncing(false), 600);
  };

  return (
    <div className="arcade-title-viewport">
      <div className="arcade-ambient-overlay" />

      {/* 1. Header Minimalis Mengambang */}
      <header className="arcade-topbar">
        <div className="arcade-brand">
          <img
            src="/branding/icon_app_metabody.png"
            alt="METABODY Icon"
            className="arcade-brand-icon"
          />
          <span className="arcade-brand-text">METABODY</span>
        </div>

        <div className="arcade-topbar-actions">
          <GameButton
            variant="blue"
            shape="rect"
            size="sm"
            onClick={handleToggleFullscreen}
            sound="normal"
            title="Layar Penuh"
            style={{ minWidth: "140px", height: "36px", fontSize: "0.82rem" }}
          >
            <span>{isFullscreen ? "🗗 Keluar Penuh" : "⛶ Layar Penuh"}</span>
          </GameButton>
        </div>
      </header>

      {/* 2. Panggung Terpisah 2 Kolom (Karakter Besar di Kiri & Menu Sejajar di Kanan) */}
      <main className="arcade-split-stage">
        {/* SISI KIRI: Karakter Si Meta Besar & Megah */}
        <section className="arcade-left-hero">
          <div className="arcade-hero-speech" onClick={handleSimetaClick} title="Klik Si Meta!">
            <span className="arcade-speech-text">{GREETINGS[greetingIndex]}</span>
          </div>

          <div
            className={`arcade-hero-avatar-wrapper ${isCharacterBouncing ? "bounce-pop" : ""}`}
            onClick={handleSimetaClick}
            role="button"
            tabIndex={0}
            title="Sentuh Si Meta untuk menyapa!"
          >
            {/* Bayangan / Pedestal Cahaya di Bawah Kaki */}
            <div className="arcade-hero-pedestal" />
            <img
              src="/simeta/simeta_idle_happy.png"
              alt="Si Meta Karakter"
              className="arcade-hero-avatar-img"
            />
          </div>
        </section>

        {/* SISI KANAN: Logo & Menu Tombol Sejajar Kebawah (Ukuran Seragam Persis) */}
        <section className="arcade-right-menu">
          {/* Logo & Tagline */}
          <div className="arcade-menu-brand-box">
            <img
              src="/branding/logo_metabody_main.png"
              alt="METABODY Logo"
              className="arcade-menu-logo"
            />
            <p className="arcade-menu-tagline">
              Ekspedisi Interaktif Metabolisme Tubuh Manusia
            </p>
          </div>

          {/* Deretan Tombol Menu Vertikal */}
          <div className="arcade-vertical-button-stack">
            {/* 1. Mulai Simulasi Arena (Hero Green) */}
            <GameButton
              variant="green"
              shape="rect"
              size="lg"
              onClick={() => navigate("/bridging")}
              sound="confirm"
              className="arcade-menu-btn"
            >
              <span className="arcade-btn-left">
                <span className="arcade-btn-icon">▶️</span>
                <span className="arcade-btn-label-text">MULAI SIMULASI ARENA</span>
              </span>
              <span className="arcade-btn-arrow">➔</span>
            </GameButton>

            {/* 2. Laboratorium 3D Fisiologi (Blue) */}
            <GameButton
              variant="blue"
              shape="rect"
              size="lg"
              onClick={() => navigate("/laboratorium-3d")}
              sound="confirm"
              className="arcade-menu-btn"
            >
              <span className="arcade-btn-left">
                <span className="arcade-btn-icon">🔬</span>
                <span className="arcade-btn-label-text">LABORATORIUM 3D FISIOLOGI</span>
              </span>
              <span className="arcade-btn-arrow">➔</span>
            </GameButton>
          </div>
        </section>
      </main>

      {/* 3. Footer Sederhana Ramping */}
      <footer className="arcade-footer">
        <p>© 2026 METABODY • Game Simulasi Edukasi Fisiologi Tubuh</p>
      </footer>
    </div>
  );
}
