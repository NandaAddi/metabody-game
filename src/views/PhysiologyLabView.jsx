import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GameButton } from "../components/game-ui";
import { playGameClickSFX } from "../engine/useSoundEffects";
import "./PhysiologyLabView.css";

const LAB_MODULES = [
  {
    id: "circulatory",
    title: "Sirkulasi Peredaran Darah 3D",
    shortTitle: "Sirkulasi Darah",
    icon: "🩸",
    url: "/simulasi-3d/sirkulasi-darah.html",
    description: "Visualisasi interaktif 3D aliran darah beroksigen (merah) & ber-CO2 (biru) dari jantung ke seluruh organ."
  },
  {
    id: "nephron",
    title: "Filtrasi & Reabsorpsi Nefron 3D",
    shortTitle: "Nefron Ginjal",
    icon: "🔬",
    url: "/simulasi-3d/nefron-ginjal.html",
    description: "Simulasi mikroskopis interaktif 3D tahap filtrasi glomerulus, reabsorpsi glukosa, dan pembentukan urine."
  }
];

export default function PhysiologyLabView() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("circulatory");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const activeModule = LAB_MODULES.find((m) => m.id === activeTab) || LAB_MODULES[0];

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    playGameClickSFX("confirm");
  };

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

  const handleExit = () => {
    playGameClickSFX("cancel");
    navigate("/");
  };

  return (
    <div className="physiology-lab-viewport">
      {/* 1. Header Bar Mengambang (Floating Navigation HUD) */}
      <header className="physiology-lab-header">
        {/* Identitas Brand & Judul */}
        <div className="physiology-lab-brand">
          <img
            src="/src/assets/branding/icon_app_metabody.png"
            alt="METABODY"
            className="physiology-lab-brand-icon"
          />
          <div>
            <span className="physiology-lab-badge">LABORATORIUM FISIOLOGI 3D</span>
            <h1 className="physiology-lab-title">{activeModule.title}</h1>
          </div>
        </div>

        {/* Tab Pemilih Modul Simulasi */}
        <nav className="physiology-lab-tabs" aria-label="Pilih Modul Simulasi 3D">
          {LAB_MODULES.map((mod) => {
            const isSelected = activeTab === mod.id;
            return (
              <button
                key={mod.id}
                type="button"
                className={`physiology-lab-tab-btn ${isSelected ? "is-active" : ""}`}
                onClick={() => handleSelectTab(mod.id)}
              >
                <span className="physiology-lab-tab-icon">{mod.icon}</span>
                <span className="physiology-lab-tab-text">{mod.shortTitle}</span>
              </button>
            );
          })}
        </nav>

        {/* Aksi Kanan: Fullscreen & Kembali */}
        <div className="physiology-lab-actions">
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="physiology-lab-tool-btn"
            title="Mode Layar Penuh"
          >
            {isFullscreen ? "🗗 Keluar Penuh" : "⛶ Layar Penuh"}
          </button>

          <GameButton
            variant="gold"
            shape="rect"
            size="md"
            onClick={handleExit}
            sound="cancel"
            className="physiology-lab-exit-btn"
          >
            <span>🏠 Menu Utama</span>
          </GameButton>
        </div>
      </header>

      {/* 2. Layar Simulasi Interaktif 3D (Iframe Standalone) */}
      <main className="physiology-lab-stage">
        <iframe
          key={activeModule.id}
          title={activeModule.title}
          src={activeModule.url}
          className="physiology-lab-iframe"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          xr-spatial-tracking="true"
        />
      </main>
    </div>
  );
}
