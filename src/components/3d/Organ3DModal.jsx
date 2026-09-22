import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import SketchfabEmbedViewer from "./SketchfabEmbedViewer";
import { organAnatomyData } from "../../data/organAnatomyData";
import { GameButton } from "../game-ui";
import { playGameClickSFX } from "../../engine/useSoundEffects";
import "./Organ3DModal.css";

const ALL_ORGANS = [
  { id: "skin", name: "Jaringan Kulit", icon: "💦" },
  { id: "kidney", name: "Ginjal Nefron", icon: "🔬" },
  { id: "stomach", name: "Sistem Pencernaan", icon: "🍞" },
  { id: "alveolus", name: "Alveolus", icon: "🫧" },
  { id: "lungs", name: "Paru-Paru", icon: "🫁" }
];

/**
 * Organ3DModal (Organ3DFullscreenTheater)
 * Panggung Teater Interaktif 3D Layar Penuh (Edge-to-Edge Tanpa Pop-up Box)
 * Menampilkan model Sketchfab 3D selayar penuh dengan HUD kontrol mengambang
 */
export default function Organ3DModal({ organId, isOpen, onClose }) {
  const [currentOrganId, setCurrentOrganId] = useState("skin");
  const [selectedHotspotId, setSelectedHotspotId] = useState(null);
  const [showInfoPanel, setShowInfoPanel] = useState(true);

  // Sync prop organId saat dibuka
  useEffect(() => {
    if (organId) {
      const normalized = organId.toLowerCase();
      let mapped = normalized;
      if (normalized === "kidneys") mapped = "kidney";
      else if (normalized === "intestine" || normalized === "liver") mapped = "stomach";
      else if (normalized === "heart") mapped = "lungs";
      else if (!organAnatomyData[mapped]?.sketchfab) mapped = "skin";

      setCurrentOrganId(mapped);
      setSelectedHotspotId(null);
    }
  }, [organId, isOpen]);

  // Cari data anatomi berdasarkan ID organ
  const organKey = currentOrganId || "skin";
  const organData = organAnatomyData[organKey] || organAnatomyData.skin;

  // Hotspot aktif
  const activeHotspot =
    organData.hotspots?.find((h) => h.id === selectedHotspotId) ||
    organData.hotspots?.[0] ||
    null;

  // Dukungan tombol Escape keyboard untuk keluar layar penuh
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectOrgan = (newOrganId) => {
    setCurrentOrganId(newOrganId);
    setSelectedHotspotId(null);
    playGameClickSFX("confirm");
  };

  const handleSelectHotspot = (hotspot) => {
    setSelectedHotspotId(hotspot.id);
    playGameClickSFX("confirm");
  };

  const handleToggleInfo = () => {
    setShowInfoPanel((prev) => !prev);
    playGameClickSFX("normal");
  };

  const modalContent = (
    <div
      className="organ-3d-fullscreen-theater"
      role="dialog"
      aria-modal="true"
      aria-label={`Laboratorium 3D ${organData.name}`}
    >
      {/* 1. LAYER PEMUTAR 3D SKETCHFAB SELAYAR PENUH (EDGE-TO-EDGE) */}
      <div className="organ-3d-fullscreen-canvas">
        <SketchfabEmbedViewer
          key={`sketchfab-fullscreen-${organKey}`}
          sketchfabData={organData.sketchfab}
          organName={organData.name}
          organIcon={organData.icon}
        />
      </div>

      {/* 2. HUD ATAS MENGAMBANG: NAVIGASI ORGAN & TOMBOL KELUAR */}
      <header className="organ-3d-floating-topbar">
        {/* Identitas Organ Aktif */}
        <div className="organ-3d-topbar-brand">
          <span className="organ-3d-topbar-icon">{organData.icon}</span>
          <div className="organ-3d-topbar-titles">
            <span className="organ-3d-topbar-system">{organData.system}</span>
            <h2 className="organ-3d-topbar-name">{organData.name}</h2>
          </div>
        </div>

        {/* Tab Pemilihan 5 Organ 3D */}
        <nav className="organ-3d-floating-nav" aria-label="Pilih Model 3D Organ">
          {ALL_ORGANS.map((org) => {
            const isSelected = currentOrganId === org.id;
            return (
              <button
                key={org.id}
                type="button"
                className={`organ-3d-nav-pill ${isSelected ? "is-selected" : ""}`}
                onClick={() => handleSelectOrgan(org.id)}
              >
                <span className="organ-3d-pill-icon">{org.icon}</span>
                <span className="organ-3d-pill-label">{org.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Tombol Aksi Kanan Atas: Toggle Info & Kembali */}
        <div className="organ-3d-topbar-actions">
          <button
            type="button"
            onClick={handleToggleInfo}
            className={`organ-3d-toggle-info-btn ${showInfoPanel ? "is-active" : ""}`}
            title="Sembunyikan / Tampilkan Panel Penjelasan Anatomi"
          >
            <span>{showInfoPanel ? "📖 Sembunyikan Info" : "📖 Buka Info Anatomi"}</span>
          </button>

          <GameButton
            variant="gold"
            shape="rect"
            size="md"
            onClick={onClose}
            sound="cancel"
            className="organ-3d-close-btn"
          >
            <span>Kembali ke Arena</span>
            <span className="organ-3d-btn-arrow">➔</span>
          </GameButton>
        </div>
      </header>

      {/* 3. HUD SAMPING/BAWAH MENGAMBANG: KARTU PENJELASAN ANATOMI (COLLAPSIBLE) */}
      {showInfoPanel && (
        <aside className="organ-3d-floating-info-card">
          <div className="organ-3d-info-header">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "1.1rem" }}>🔬</span>
              <span style={{ fontWeight: 800, fontSize: "0.86rem", color: "#F8FAFC" }}>
                TITIK ANATOMI & FISIOLOGI
              </span>
            </div>
            <button
              type="button"
              onClick={handleToggleInfo}
              className="organ-3d-info-close-btn"
              title="Tutup Panel Info"
            >
              ✕
            </button>
          </div>

          {/* Chips Titik Anatomi */}
          <div className="organ-3d-info-chips">
            {organData.hotspots?.map((hotspot) => {
              const isActive = activeHotspot?.id === hotspot.id;
              return (
                <button
                  type="button"
                  key={hotspot.id}
                  className={`organ-3d-chip ${isActive ? "is-active" : ""}`}
                  onClick={() => handleSelectHotspot(hotspot)}
                >
                  {hotspot.name}
                </button>
              );
            })}
          </div>

          {/* Kartu Detail Hotspot Terpilih */}
          {activeHotspot && (
            <div className="organ-3d-selected-feature">
              <div className="organ-3d-feature-headline">
                <span className="organ-3d-feature-pin">📍</span>
                <div>
                  <h4 className="organ-3d-feature-title">{activeHotspot.name}</h4>
                  {activeHotspot.latin && (
                    <span className="organ-3d-feature-latin">Istilah: {activeHotspot.latin}</span>
                  )}
                </div>
              </div>
              <p className="organ-3d-feature-text">{activeHotspot.function}</p>
            </div>
          )}

          {/* Fakta Unik Pembelajaran */}
          <div className="organ-3d-funfact-box">
            <span style={{ fontSize: "1.2rem", lineHeight: 1 }}>💡</span>
            <div>
              <strong>Tahukah Kamu?</strong>
              <p>{organData.funFact}</p>
            </div>
          </div>
        </aside>
      )}
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}
