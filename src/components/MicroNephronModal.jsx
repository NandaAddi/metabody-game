import React, { useState } from "react";
import { useGameStore } from "../stores/useGameStore";
import { GameModal, GameButton } from "./game-ui";

export default function MicroNephronModal() {
  const isMicroLensOpen = useGameStore((state) => state.isMicroLensOpen);
  const closeMicroLens = useGameStore((state) => state.closeMicroLens);
  const telemetry = useGameStore((state) => state.telemetry);

  // Nephron Molecular Gatekeeper state & actions
  const nephronState = useGameStore((state) => state.nephronState);
  const calibrateGlomerulus = useGameStore((state) => state.calibrateGlomerulus);
  const setReabsorptionRate = useGameStore((state) => state.setReabsorptionRate);
  const flushNephronAugmentation = useGameStore((state) => state.flushNephronAugmentation);

  const [activeZone, setActiveZone] = useState(1);
  const [filtrationPurity, setFiltrationPurity] = useState(98); // %
  const [localMessage, setLocalMessage] = useState("");

  if (!isMicroLensOpen) return null;

  const reabsorptionVal = nephronState?.reabsorptionRate ?? 100;
  const isReabsorptionOptimal = reabsorptionVal >= 85;
  const isFiltrationOptimal = nephronState?.filtrationCalibrated ?? true;
  const isAugmentationOptimal = (nephronState?.augmentationFlushed ?? false) || telemetry.ureaLevel < 30;
  const isAllGatesMastered = isFiltrationOptimal && isReabsorptionOptimal && isAugmentationOptimal;

  // Handlers
  const handleCalibrateFilter = () => {
    setFiltrationPurity(100);
    calibrateGlomerulus();
    setLocalMessage("✅ Pori saringan glomerulus rapat sempurna! Sel darah merah & protein tertahan di pembuluh darah.");
  };

  const handleSliderChange = (e) => {
    const val = Number(e.target.value);
    setReabsorptionRate(val);
    if (val >= 85) {
      setLocalMessage(`✅ Daya serap ${val}%: Seluruh glukosa & 99% air diserap kembali ke kapiler darah.`);
    } else {
      setLocalMessage(`⚠️ Daya serap ${val}%: Waspada! Sebagian glukosa bocor ke urine (Glukosuria)!`);
    }
  };

  const handleFlushAugmentation = () => {
    flushNephronAugmentation();
    setLocalMessage("⚡ Tahap augmentasi aktif! Zat sisa urea dan kelebihan garam dialirkan menuju kandung kemih.");
  };

  const footerActions = (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", gap: "16px", flexWrap: "wrap" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.82rem", color: "#94A3B8" }}>
        <span>🔬</span>
        <span>Jalankan 3 tahap kerja nefron secara bergantian untuk menjaga darah Si Meta tetap sehat.</span>
      </div>

      <GameButton
        variant="purple"
        shape="rect"
        size="md"
        onClick={closeMicroLens}
        sound="cancel"
      >
        ✕ Selesai Memeriksa Nefron
      </GameButton>
    </div>
  );

  return (
    <GameModal
      isOpen={true}
      title="LABORATORIUM NEFRON GINJAL"
      headerVariant="purple"
      headerIcon="🔬"
      size="xl"
      onClose={closeMicroLens}
      backdropClose={true}
      footer={footerActions}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Subheader Ringkas */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
          <div>
            <h3 style={{
              fontFamily: "var(--font-display, sans-serif)",
              fontSize: "1.1rem",
              color: "#FFFFFF",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <span>Simulasi 3 Tahap Kerja Nefron Ginjal</span>
            </h3>
            <p style={{ color: "#94A3B8", fontSize: "0.8rem", margin: "2px 0 0" }}>
              Pilih salah satu tahap di bawah untuk memeriksa dan mengendalikan proses penyaringan darah:
            </p>
          </div>
        </div>

        {/* 3 Interactive Stage Selector Cards (Dual Function: Status + Zone Selector) */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "10px"
        }}>
          {/* Card 1: Filtrasi */}
          <button
            type="button"
            onClick={() => setActiveZone(1)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 12px",
              borderRadius: "12px",
              background: activeZone === 1
                ? "linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(15, 23, 42, 0.85) 100%)"
                : "rgba(15, 23, 42, 0.7)",
              border: activeZone === 1 ? "2px solid #EF4444" : "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: activeZone === 1 ? "0 0 16px rgba(239, 68, 68, 0.45)" : "0 4px 12px rgba(0, 0, 0, 0.3)",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.18s ease",
              transform: activeZone === 1 ? "scale(1.02)" : "scale(1)"
            }}
          >
            <span style={{ fontSize: "1.3rem" }}>{isFiltrationOptimal ? "✅" : "🔴"}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "4px" }}>
                <span style={{ fontSize: "0.7rem", color: activeZone === 1 ? "#FECDD3" : "#94A3B8", textTransform: "uppercase", fontWeight: 700 }}>
                  Tahap 1 (Glomerulus)
                </span>
                <span style={{
                  fontSize: "0.65rem",
                  padding: "1px 5px",
                  borderRadius: "4px",
                  background: isFiltrationOptimal ? "rgba(34, 197, 94, 0.25)" : "rgba(239, 68, 68, 0.25)",
                  color: isFiltrationOptimal ? "var(--color-health-text)" : "var(--color-danger-text)",
                  fontWeight: 700
                }}>
                  {isFiltrationOptimal ? "Optimal" : "Perlu Rapat"}
                </span>
              </div>
              <strong style={{ display: "block", fontSize: "0.84rem", color: isFiltrationOptimal ? "var(--color-health-text)" : "var(--color-danger-text)", marginTop: "2px" }}>
                Filtrasi ➔ Urine Primer
              </strong>
            </div>
          </button>

          {/* Card 2: Reabsorpsi */}
          <button
            type="button"
            onClick={() => setActiveZone(2)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 12px",
              borderRadius: "12px",
              background: activeZone === 2
                ? "linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(15, 23, 42, 0.85) 100%)"
                : "rgba(15, 23, 42, 0.7)",
              border: activeZone === 2 ? "2px solid #F59E0B" : "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: activeZone === 2 ? "0 0 16px rgba(245, 158, 11, 0.45)" : "0 4px 12px rgba(0, 0, 0, 0.3)",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.18s ease",
              transform: activeZone === 2 ? "scale(1.02)" : "scale(1)"
            }}
          >
            <span style={{ fontSize: "1.3rem" }}>{isReabsorptionOptimal ? "✅" : "🟡"}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "4px" }}>
                <span style={{ fontSize: "0.7rem", color: activeZone === 2 ? "#FEF08A" : "#94A3B8", textTransform: "uppercase", fontWeight: 700 }}>
                  Tahap 2 (PCT & Henle)
                </span>
                <span style={{
                  fontSize: "0.65rem",
                  padding: "1px 5px",
                  borderRadius: "4px",
                  background: isReabsorptionOptimal ? "rgba(34, 197, 94, 0.25)" : "rgba(245, 158, 11, 0.25)",
                  color: isReabsorptionOptimal ? "var(--color-health-text)" : "var(--color-warn-text)",
                  fontWeight: 700
                }}>
                  {isReabsorptionOptimal ? "Optimal (100%)" : `${reabsorptionVal}% Bocor!`}
                </span>
              </div>
              <strong style={{ display: "block", fontSize: "0.84rem", color: isReabsorptionOptimal ? "var(--color-health-text)" : "var(--color-warn-text)", marginTop: "2px" }}>
                Reabsorpsi ➔ Urine Sekunder
              </strong>
            </div>
          </button>

          {/* Card 3: Augmentasi */}
          <button
            type="button"
            onClick={() => setActiveZone(3)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 12px",
              borderRadius: "12px",
              background: activeZone === 3
                ? "linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(15, 23, 42, 0.85) 100%)"
                : "rgba(15, 23, 42, 0.7)",
              border: activeZone === 3 ? "2px solid #A855F7" : "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: activeZone === 3 ? "0 0 16px rgba(168, 85, 247, 0.45)" : "0 4px 12px rgba(0, 0, 0, 0.3)",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.18s ease",
              transform: activeZone === 3 ? "scale(1.02)" : "scale(1)"
            }}
          >
            <span style={{ fontSize: "1.3rem" }}>{isAugmentationOptimal ? "✅" : "🟣"}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "4px" }}>
                <span style={{ fontSize: "0.7rem", color: activeZone === 3 ? "#E9D5FF" : "#94A3B8", textTransform: "uppercase", fontWeight: 700 }}>
                  Tahap 3 (DCT & Muara)
                </span>
                <span style={{
                  fontSize: "0.65rem",
                  padding: "1px 5px",
                  borderRadius: "4px",
                  background: isAugmentationOptimal ? "rgba(34, 197, 94, 0.25)" : "rgba(168, 85, 247, 0.25)",
                  color: isAugmentationOptimal ? "var(--color-health-text)" : "var(--color-nephron-text)",
                  fontWeight: 700
                }}>
                  {isAugmentationOptimal ? "Bilas Selesai" : "Siap Dibilas"}
                </span>
              </div>
              <strong style={{ display: "block", fontSize: "0.84rem", color: isAugmentationOptimal ? "var(--color-health-text)" : "var(--color-nephron-text)", marginTop: "2px" }}>
                Augmentasi ➔ Urine Sebenarnya
              </strong>
            </div>
          </button>
        </div>

        {/* Banner Prestasi 3 Gerbang Lengkap */}
        {isAllGatesMastered && (
          <div style={{
            background: "linear-gradient(90deg, rgba(34, 197, 94, 0.25) 0%, rgba(56, 189, 248, 0.25) 100%)",
            border: "1px solid rgba(34, 197, 94, 0.4)",
            boxShadow: "0 4px 16px rgba(34, 197, 94, 0.2)",
            borderRadius: "10px",
            padding: "8px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            animation: "fadeIn 0.3s ease"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "1.2rem" }}>🏆</span>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-health-text)" }}>
                HEBAT! 3 TAHAP NEFRON SEIMBANG: Seluruh tahapan (Filtrasi, Reabsorpsi, Augmentasi) bekerja optimal!
              </span>
            </div>
            <span style={{ fontSize: "0.75rem", color: "#93C5FD", fontWeight: 600 }}>Darah Si Meta Murni & Sehat</span>
          </div>
        )}

        {/* Diagram Nefron 3 Zona Interaktif (Aspect Ratio Aligned & Responsive) */}
        <div style={{
          position: "relative",
          width: "100%",
          maxWidth: "660px",
          margin: "0 auto",
          aspectRatio: "885 / 563",
          maxHeight: "220px",
          background: "radial-gradient(ellipse at center, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.98) 100%)",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "inset 0 2px 10px rgba(0, 0, 0, 0.6), 0 8px 24px rgba(0, 0, 0, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          {/* Nephron Illustration */}
          <img
            src="/micro/micro_nephron_unit.png"
            alt="Diagram Anatomi Nefron Ginjal 3 Tahap"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              filter: "contrast(1.05) drop-shadow(0 4px 10px rgba(0,0,0,0.45))"
            }}
          />

          {/* Active Zone Spotlight Indicator Bar */}
          <div style={{
            position: "absolute",
            bottom: "6px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(10, 15, 29, 0.85)",
            backdropFilter: "blur(4px)",
            padding: "4px 12px",
            borderRadius: "999px",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            fontSize: "0.72rem",
            color: "#E2E8F0",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            zIndex: 10
          }}>
            <span style={{ color: activeZone === 1 ? "#EF4444" : activeZone === 2 ? "#F59E0B" : "#A855F7", fontWeight: 700 }}>
              ● Zona Aktif:
            </span>
            <span>
              {activeZone === 1 && "Zone 1: Glomerulus & Kapsula Bowman (Filtrasi)"}
              {activeZone === 2 && "Zone 2: Tubulus Proksimal & Lengkung Henle (Reabsorpsi)"}
              {activeZone === 3 && "Zone 3: Tubulus Distal & Kolektivus (Augmentasi)"}
            </span>
          </div>

          {/* Hotspot Pin 1: Glomerulus */}
          <button
            type="button"
            onClick={() => setActiveZone(1)}
            title="Pilih Tahap 1: Filtrasi Glomerulus"
            style={{
              position: "absolute",
              top: "8%",
              left: "14%",
              transform: "translate(-50%, 0)",
              padding: "4px 10px",
              borderRadius: "999px",
              background: activeZone === 1
                ? "linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)"
                : "rgba(15, 23, 42, 0.85)",
              color: "#FFFFFF",
              fontFamily: "var(--font-display, sans-serif)",
              fontWeight: 700,
              fontSize: "0.74rem",
              border: activeZone === 1 ? "2px solid #FECDD3" : "1px solid rgba(255, 255, 255, 0.3)",
              cursor: "pointer",
              boxShadow: activeZone === 1 ? "0 0 14px rgba(239, 68, 68, 0.8)" : "0 2px 8px rgba(0, 0, 0, 0.5)",
              zIndex: 5,
              transition: "all 0.18s ease"
            }}
          >
            🔴 1. Glomerulus
          </button>

          {/* Hotspot Pin 2: Reabsorpsi Tubulus */}
          <button
            type="button"
            onClick={() => setActiveZone(2)}
            title="Pilih Tahap 2: Reabsorpsi Tubulus Proksimal"
            style={{
              position: "absolute",
              top: "8%",
              left: "48%",
              transform: "translate(-50%, 0)",
              padding: "4px 10px",
              borderRadius: "999px",
              background: activeZone === 2
                ? "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)"
                : "rgba(15, 23, 42, 0.85)",
              color: "#FFFFFF",
              fontFamily: "var(--font-display, sans-serif)",
              fontWeight: 700,
              fontSize: "0.74rem",
              border: activeZone === 2 ? "2px solid var(--color-warn-text)" : "1px solid rgba(255, 255, 255, 0.3)",
              cursor: "pointer",
              boxShadow: activeZone === 2 ? "0 0 14px rgba(245, 158, 11, 0.8)" : "0 2px 8px rgba(0, 0, 0, 0.5)",
              zIndex: 5,
              transition: "all 0.18s ease"
            }}
          >
            🟡 2. Tubulus Proksimal
          </button>

          {/* Hotspot Pin 3: Augmentasi Distal */}
          <button
            type="button"
            onClick={() => setActiveZone(3)}
            title="Pilih Tahap 3: Augmentasi Tubulus Distal"
            style={{
              position: "absolute",
              top: "8%",
              left: "81%",
              transform: "translate(-50%, 0)",
              padding: "4px 10px",
              borderRadius: "999px",
              background: activeZone === 3
                ? "linear-gradient(135deg, #A855F7 0%, #7E22CE 100%)"
                : "rgba(15, 23, 42, 0.85)",
              color: "#FFFFFF",
              fontFamily: "var(--font-display, sans-serif)",
              fontWeight: 700,
              fontSize: "0.74rem",
              border: activeZone === 3 ? "2px solid var(--color-nephron-text)" : "1px solid rgba(255, 255, 255, 0.3)",
              cursor: "pointer",
              boxShadow: activeZone === 3 ? "0 0 14px rgba(168, 85, 247, 0.8)" : "0 2px 8px rgba(0, 0, 0, 0.5)",
              zIndex: 5,
              transition: "all 0.18s ease"
            }}
          >
            🟣 3. Tubulus Distal
          </button>
        </div>

        {/* Panel Interaktif: Teori Fisiologi (Kiri) vs Konsol Kendali (Kanan) */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "14px" }}>
          {/* Kolom Kiri: Konsep & Telaah Biologis */}
          <div style={{
            background: "rgba(15, 23, 42, 0.75)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
            borderRadius: "14px",
            padding: "14px 16px"
          }}>
            {activeZone === 1 && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "1.2rem" }}>🩸</span>
                  <h4 style={{ color: "var(--color-danger-text)", fontFamily: "var(--font-display, sans-serif)", fontSize: "1rem", margin: 0 }}>
                    1. Penyaringan Pertama (Filtrasi Glomerulus)
                  </h4>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "7px", fontSize: "0.84rem", lineHeight: "1.4", color: "#E2E8F0" }}>
                  <div>
                    <strong style={{ color: "#93C5FD" }}>📍 Lokasi:</strong> Glomerulus yang dibungkus Kapsula Bowman.
                  </div>
                  <div>
                    <strong style={{ color: "#93C5FD" }}>⚙️ Analogi Saringan Teh:</strong> Pori saringan berdiameter ≤ 8 nm. Sel darah merah & protein tertahan di pembuluh darah. Air, glukosa, asam amino, dan urea lolos ke kapsula Bowman.
                  </div>
                  <div style={{ background: "rgba(239, 68, 68, 0.15)", borderLeft: "3px solid var(--color-danger-text)", padding: "5px 10px", borderRadius: "6px" }}>
                    <strong style={{ color: "var(--color-danger-text)" }}>🧪 Filtrat Dihasilkan:</strong> <em>Urine Primer</em>.
                  </div>

                  {/* Komponen Masuk vs Lolos */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                    marginTop: "4px"
                  }}>
                    <div style={{ background: "rgba(239, 68, 68, 0.12)", borderRadius: "8px", padding: "8px" }}>
                      <span style={{ fontSize: "0.72rem", color: "var(--color-danger-text)", fontWeight: 700, display: "block" }}>🛡️ Tertahan di Darah (Molekul Besar):</span>
                      <ul style={{ margin: "4px 0 0 14px", padding: 0, fontSize: "0.74rem", color: "#FECDD3" }}>
                        <li>Sel Darah Merah (Eritrosit)</li>
                        <li>Protein Albumin & Trombosit</li>
                      </ul>
                    </div>
                    <div style={{ background: "rgba(59, 130, 246, 0.12)", borderRadius: "8px", padding: "8px" }}>
                      <span style={{ fontSize: "0.72rem", color: "#93C5FD", fontWeight: 700, display: "block" }}>💧 Lolos ke Bowman (Filtrat):</span>
                      <ul style={{ margin: "4px 0 0 14px", padding: 0, fontSize: "0.74rem", color: "#BFDBFE" }}>
                        <li>Air (H₂O) & Glukosa</li>
                        <li>Asam Amino & Urea</li>
                        <li>Ion Garam (Na⁺, Cl⁻)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeZone === 2 && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "1.2rem" }}>♻️</span>
                  <h4 style={{ color: "var(--color-warn-text)", fontFamily: "var(--font-display, sans-serif)", fontSize: "1rem", margin: 0 }}>
                    2. Penyerapan Kembali (Reabsorpsi Tubulus)
                  </h4>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "7px", fontSize: "0.84rem", lineHeight: "1.4", color: "#E2E8F0" }}>
                  <div>
                    <strong style={{ color: "#93C5FD" }}>📍 Lokasi:</strong> Tubulus Kontortus Proksimal & Lengkung Henle.
                  </div>
                  <div>
                    <strong style={{ color: "#93C5FD" }}>⚙️ Analogi Daur Ulang:</strong> Pompa transpor aktif menarik kembali 100% molekul glukosa, asam amino, dan air berharga kembali ke dalam darah agar tidak terbuang percuma.
                  </div>
                  <div style={{ background: "rgba(245, 158, 11, 0.15)", borderLeft: "3px solid var(--color-warn-text)", padding: "5px 10px", borderRadius: "6px" }}>
                    <strong style={{ color: "var(--color-warn-text)" }}>🧪 Filtrat Dihasilkan:</strong> <em>Urine Sekunder</em>.
                  </div>

                  {/* Komponen Diserap vs Meneruskan */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                    marginTop: "4px"
                  }}>
                    <div style={{ background: "rgba(34, 197, 94, 0.12)", borderRadius: "8px", padding: "8px" }}>
                      <span style={{ fontSize: "0.72rem", color: "var(--color-health-text)", fontWeight: 700, display: "block" }}>🔄 Diserap Kembali ke Darah:</span>
                      <ul style={{ margin: "4px 0 0 14px", padding: 0, fontSize: "0.74rem", color: "#BBF7D0" }}>
                        <li>100% Glukosa (Energi)</li>
                        <li>100% Asam Amino</li>
                        <li>99% Air & Ion Natrium</li>
                      </ul>
                    </div>
                    <div style={{ background: "rgba(245, 158, 11, 0.12)", borderRadius: "8px", padding: "8px" }}>
                      <span style={{ fontSize: "0.72rem", color: "var(--color-warn-text)", fontWeight: 700, display: "block" }}>🧪 Meneruskan ke Henle:</span>
                      <ul style={{ margin: "4px 0 0 14px", padding: 0, fontSize: "0.74rem", color: "#FEF08A" }}>
                        <li>Air sisa & Konsentrat Urea</li>
                        <li>Urobilin (Warna Kuning Urin)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeZone === 3 && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "1.2rem" }}>🧪</span>
                  <h4 style={{ color: "var(--color-nephron-text)", fontFamily: "var(--font-display, sans-serif)", fontSize: "1rem", margin: 0 }}>
                    3. Pengeluaran Sisa Racun (Augmentasi Distal)
                  </h4>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "7px", fontSize: "0.84rem", lineHeight: "1.4", color: "#E2E8F0" }}>
                  <div>
                    <strong style={{ color: "#93C5FD" }}>📍 Lokasi:</strong> Tubulus Kontortus Distal & Tubulus Kolektivus.
                  </div>
                  <div>
                    <strong style={{ color: "#93C5FD" }}>⚙️ Analogi Truk Sampah:</strong> Penambahan zat racun sisa urea, amonia, ion hidrogen (H⁺), dan residu obat ke dalam urine sekunder untuk dibuang keluar tubuh.
                  </div>
                  <div style={{ background: "rgba(168, 85, 247, 0.15)", borderLeft: "3px solid #A855F7", padding: "5px 10px", borderRadius: "6px" }}>
                    <strong style={{ color: "var(--color-nephron-text)" }}>🧪 Filtrat Akhir:</strong> <em>Urine Sesungguhnya (Air Seni Sejati)</em>.
                  </div>

                  {/* Komponen Dibuang Tambahan */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                    marginTop: "4px"
                  }}>
                    <div style={{ background: "rgba(168, 85, 247, 0.12)", borderRadius: "8px", padding: "8px" }}>
                      <span style={{ fontSize: "0.72rem", color: "var(--color-nephron-text)", fontWeight: 700, display: "block" }}>⚡ Dibuang Tambahan ke Urin:</span>
                      <ul style={{ margin: "4px 0 0 14px", padding: 0, fontSize: "0.74rem", color: "#F3E8FF" }}>
                        <li>Sisa Racun Urea & Amonia</li>
                        <li>Ion H⁺ (Jaga pH Darah 7.4)</li>
                        <li>Kelebihan Garam & Obat</li>
                      </ul>
                    </div>
                    <div style={{ background: "rgba(59, 130, 246, 0.12)", borderRadius: "8px", padding: "8px" }}>
                      <span style={{ fontSize: "0.72rem", color: "#93C5FD", fontWeight: 700, display: "block" }}>🚀 Muara Aliran Akhir:</span>
                      <ul style={{ margin: "4px 0 0 14px", padding: 0, fontSize: "0.74rem", color: "#BFDBFE" }}>
                        <li>Tubulus Kolektivus</li>
                        <li>Pelvis Renalis ➔ Ureter</li>
                        <li>Kandung Kemih ➔ Uretra</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Kolom Kanan: Konsol Rekayasa Molekuler Interaktif */}
          <div style={{
            background: "rgba(15, 23, 42, 0.75)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
            borderRadius: "14px",
            padding: "14px 16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}>
            {/* Header Kontrol Molekuler */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "1.1rem" }}>🎛️</span>
                  <h4 style={{ fontFamily: "var(--font-display, sans-serif)", color: "var(--color-info-text)", fontSize: "0.95rem", margin: 0 }}>
                    Kendali Tahap: {activeZone === 1 ? "Filtrasi" : activeZone === 2 ? "Reabsorpsi" : "Augmentasi"}
                  </h4>
                </div>
              </div>

              {/* Status Telemetri Live */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
                background: "rgba(0, 0, 0, 0.35)",
                borderRadius: "10px",
                padding: "8px 10px",
                marginBottom: "10px",
                fontSize: "0.78rem"
              }}>
                <div>
                  <span style={{ color: "#94A3B8", display: "block" }}>Zat Sisa Urea:</span>
                  <strong style={{ color: telemetry.ureaLevel > 35 ? "var(--color-danger-text)" : "var(--color-health-text)", fontSize: "0.92rem" }}>
                    {telemetry.ureaLevel} mg/dL
                  </strong>
                </div>
                <div>
                  <span style={{ color: "#94A3B8", display: "block" }}>Tabung Urine:</span>
                  <strong style={{ color: "var(--color-warn-text)", fontSize: "0.92rem" }}>
                    {telemetry.urineVolume} mL
                  </strong>
                </div>
              </div>

              {/* Kontrol Khusus Zona 1: Kalibrasi Filtrasi */}
              {activeZone === 1 && (
                <div>
                  <p style={{ fontSize: "0.8rem", color: "#94A3B8", margin: "0 0 8px", lineHeight: "1.35" }}>
                    Atur kerapatan pori saringan glomerulus agar sel darah merah dan protein tidak bocor ke urine primer.
                  </p>

                  <div style={{
                    background: "rgba(239, 68, 68, 0.12)",
                    borderRadius: "10px",
                    padding: "8px 12px",
                    marginBottom: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <span style={{ fontSize: "0.78rem", color: "#E2E8F0" }}>Kerapatan Saringan:</span>
                    <strong style={{ color: "var(--color-danger-text)", fontSize: "0.88rem" }}>{filtrationPurity}% (Pori Rapat)</strong>
                  </div>

                  <GameButton
                    variant="red"
                    shape="rect"
                    size="md"
                    onClick={handleCalibrateFilter}
                    sound="confirm"
                    style={{ width: "100%" }}
                  >
                    🔄 Rapatkan Pori Saringan Glomerulus
                  </GameButton>
                </div>
              )}

              {/* Kontrol Khusus Zona 2: Slider Reabsorpsi Glukosa */}
              {activeZone === 2 && (
                <div>
                  <p style={{ fontSize: "0.8rem", color: "#94A3B8", margin: "0 0 8px", lineHeight: "1.35" }}>
                    Atur daya serap pompa aktif tubulus proksimal. Pastikan diatur ke <strong>100%</strong> agar seluruh glukosa terselamatkan ke darah.
                  </p>

                  <div style={{ marginBottom: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <span style={{ fontSize: "0.8rem", color: "#E2E8F0" }}>Daya Serap Pompa:</span>
                      <strong style={{
                        fontSize: "0.92rem",
                        color: isReabsorptionOptimal ? "var(--color-health-text)" : "var(--color-danger-text)"
                      }}>
                        {reabsorptionVal}% {isReabsorptionOptimal ? "(Optimal)" : "(Bocor!)"}
                      </strong>
                    </div>

                    <input
                      type="range"
                      min="50"
                      max="100"
                      step="5"
                      value={reabsorptionVal}
                      onChange={handleSliderChange}
                      style={{
                        width: "100%",
                        height: "8px",
                        borderRadius: "4px",
                        accentColor: isReabsorptionOptimal ? "var(--color-health-text)" : "var(--color-danger-text)",
                        cursor: "pointer"
                      }}
                    />
                  </div>

                  <div style={{
                    fontSize: "0.76rem",
                    padding: "6px 10px",
                    borderRadius: "8px",
                    background: isReabsorptionOptimal ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.18)",
                    color: isReabsorptionOptimal ? "var(--color-health-text)" : "var(--color-danger-text)",
                    lineHeight: "1.35"
                  }}>
                    {isReabsorptionOptimal
                      ? "✨ 100% glukosa & asam amino diserap kembali ke darah. Urine jernih dari gula."
                      : "⚠️ Glukosuria: Glukosa bocor ke urine! Energi tubuh Si Meta terbuang sia-sia!"}
                  </div>
                </div>
              )}

              {/* Kontrol Khusus Zona 3: Katup Buang Racun Augmentasi */}
              {activeZone === 3 && (
                <div>
                  <p style={{ fontSize: "0.8rem", color: "#94A3B8", margin: "0 0 8px", lineHeight: "1.35" }}>
                    Buka katup augmentasi di tubulus distal untuk mengeluarkan sisa amonia, urea cokelat, dan kelebihan garam natrium menuju ureter.
                  </p>

                  <div style={{
                    background: "rgba(168, 85, 247, 0.15)",
                    borderRadius: "10px",
                    padding: "8px 12px",
                    marginBottom: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <span style={{ fontSize: "0.78rem", color: "#E2E8F0" }}>Status Katup Pembuangan:</span>
                    <strong style={{ color: "var(--color-nephron-text)", fontSize: "0.84rem" }}>
                      {nephronState?.augmentationFlushed ? "✅ Terbuka (Darah Bersih)" : "🔒 Siap Dibilas"}
                    </strong>
                  </div>

                  <GameButton
                    variant="purple"
                    shape="rect"
                    size="md"
                    onClick={handleFlushAugmentation}
                    sound="confirm"
                    style={{ width: "100%" }}
                  >
                    ⚡ Buka Katup Buang Racun Urea & Garam
                  </GameButton>
                </div>
              )}
            </div>

            {/* Pesan Feedback Sistem Molekuler Real-time */}
            {(localMessage || nephronState?.message) && (
              <div style={{
                marginTop: "10px",
                padding: "8px 10px",
                background: "rgba(56, 189, 248, 0.15)",
                borderRadius: "8px",
                fontSize: "0.76rem",
                color: "#93C5FD",
                lineHeight: "1.35",
                animation: "fadeIn 0.25s ease"
              }}>
                {localMessage || nephronState?.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </GameModal>
  );
}
