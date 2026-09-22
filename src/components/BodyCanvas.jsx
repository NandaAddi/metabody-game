import React, { useState, useEffect } from "react";
import { useGameStore } from "../stores/useGameStore";
import SimulationCanvas from "./SimulationCanvas";
import Organ3DModal from "./3d/Organ3DModal";
import OrganVideoModal from "./OrganVideoModal";
import "./BodyCanvas.css";

export default function BodyCanvas() {
  const currentPose = useGameStore((state) => state.currentPose);
  const telemetry = useGameStore((state) => state.telemetry);
  const homeostasisIndex = useGameStore((state) => state.homeostasisIndex);
  const lastAction = useGameStore((state) => state.lastAction);
  const actionFeedback = useGameStore((state) => state.actionFeedback);
  const currentActionCue = useGameStore((state) => state.currentActionCue);
  const activeMission = useGameStore((state) => state.activeMission);
  const gameStatus = useGameStore((state) => state.gameStatus);

  const [selectedOrgan, setSelectedOrgan] = useState(null);
  const [is3DModalOpen, setIs3DModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [flashClass, setFlashClass] = useState("");

  // Animasi flash reaksi saat aksi dilakukan
  useEffect(() => {
    if (lastAction) {
      const isPositive = actionFeedback?.color === "green";
      setFlashClass(isPositive ? "avatar-flash-green" : "avatar-flash-red");
      const timer = setTimeout(() => setFlashClass(""), 400);
      return () => clearTimeout(timer);
    }
  }, [lastAction, actionFeedback]);

  // Data hotspot organ yang mengapit tubuh Si Meta secara simetris tanpa crop
  // Sisi kiri: Paru-Paru, Pabrik Hati, Usus Halus
  // Sisi kanan: Kulit & Keringat, Jantung, Saringan Ginjal
  const organHotspots = [
    {
      id: "lungs",
      name: "Paru-Paru (Pulmo)",
      shortName: "Paru-Paru",
      icon: "🫁",
      image: "organ_lungs.png",
      pos: { top: "40%", left: "20%" },
      side: "left",
      role: "Mengeluarkan gas CO2 dan uap air sisa respirasi seluler.",
      status: `Ventilasi: ${Math.round((telemetry.heartRate || 75) / 4)} x/m`
    },
    {
      id: "liver",
      name: "Pabrik Hati (Hepar)",
      shortName: "Pabrik Hati",
      icon: "🧪",
      image: "organ_liver.png",
      pos: { top: "50%", left: "18%" },
      side: "left",
      role: "Menetralkan racun amonia menjadi urea yang aman disaring ginjal.",
      status: "Detoksifikasi Aktif"
    },
    {
      id: "intestine",
      name: "Usus Halus",
      shortName: "Usus Halus",
      icon: "🍞",
      image: "organ_small_intestine.png",
      pos: { top: "60%", left: "20%" },
      side: "left",
      role: "Menyerap sari-sari makanan ke dalam pembuluh darah.",
      status: "Penyerapan Glukosa"
    },
    {
      id: "skin",
      name: "Kulit & Keringat",
      shortName: "Kulit",
      icon: "💦",
      image: "organ_skin_sweatglands.png",
      pos: { top: "28%", left: "80%" },
      side: "right",
      role: "Mengekskresikan keringat untuk mendinginkan suhu tubuh saat panas/lari.",
      status: `Laju: ${telemetry.sweatRate || 0} mL/j (${telemetry.coreTemp || 37}°C)`
    },
    {
      id: "heart",
      name: "Jantung (Cor)",
      shortName: "Jantung",
      icon: "💓",
      image: "organ_heart.png",
      pos: { top: "42%", left: "80%" },
      side: "right",
      role: "Memompa darah berisi O2 dan glukosa ke sel, serta mengalirkan zat racun ke ginjal.",
      status: `${telemetry.heartRate || 75} BPM`
    },
    {
      id: "kidneys",
      name: "Saringan Ginjal",
      shortName: "Saringan Ginjal",
      icon: "🔬",
      image: "organ_kidneys_pair.png",
      pos: { top: "56%", left: "80%" },
      side: "right",
      role: "Menyaring urea dan kelebihan garam untuk membentuk urine di nefron.",
      status: `Urea: ${telemetry.ureaLevel || 16} mg/dL`
    }
  ];

  const heartBpm = telemetry.heartRate || 75;
  const pulseSpeed = `${(60 / heartBpm).toFixed(2)}s`;

  // Tentukan ekspresi dan pesan langsung Si Meta
  let bubbleMood = "😊";
  let bubbleClass = "bubble-normal";
  let bubbleText = "Tubuhku bugar dan stabil! Terus jaga keseimbanganku ya!";
  const bubbleActionHint = currentActionCue?.label || "";

  if (homeostasisIndex < 40) {
    bubbleMood = "🚨";
    bubbleClass = "bubble-critical";
    // Tier 3 Vygotsky: suara afektif misi di balon, instruksi teknis di banner + hint aksi
    bubbleText = activeMission?.scaffolding?.level3 || currentActionCue?.reason || "Gawat! Kondisiku kritis, cepat bantu aku!";
  } else if (homeostasisIndex < 75) {
    bubbleMood = "😥";
    bubbleClass = "bubble-warning";
    // Tier 2 Vygotsky
    bubbleText = activeMission?.scaffolding?.level2 || activeMission?.scaffolding?.level1 || currentActionCue?.reason || "Aku mulai merasa lelah, bantu aku ya!";
  } else {
    bubbleMood = "😊";
    bubbleClass = "bubble-normal";
    // Tier 1 Vygotsky
    bubbleText = activeMission?.scaffolding?.level1 || currentActionCue?.reason || "Tubuhku bugar dan stabil! Terus jaga keseimbanganku ya!";
  }

  return (
    <div className="body-canvas-stage">
      {/* Balon Dialog Interaktif Si Meta (Pemandu Fokus Tunggal Siswa) */}
      {gameStatus === "playing" && (
        <div className={`simeta-speech-bubble ${bubbleClass}`}>
          <div className="simeta-speech-mood">{bubbleMood}</div>
          <div className="simeta-speech-body">
            <p className="simeta-speech-text">"{bubbleText}"</p>
            {bubbleActionHint && (
              <div className="simeta-speech-action">
                <span>👉</span>
                <span>Aksi sekarang: <strong>{bubbleActionHint}</strong></span>
              </div>
            )}
          </div>
          <div className="simeta-speech-tail" />
        </div>
      )}

      {/* 1. Karakter Si Meta, Kanvas Sirkulasi & Hotspot Organ (Terkelompok untuk Penataan Vertikal) */}
      <div className="simeta-character-container">
        <img
          src={`/simeta/${currentPose}`}
          alt="Si Meta Avatar"
          className={`simeta-natural-avatar ${flashClass}`}
          style={{
            filter: homeostasisIndex < 40
              ? "drop-shadow(0 0 24px rgba(255, 71, 87, 0.8))"
              : "drop-shadow(0 10px 24px rgba(0, 0, 0, 0.35))",
            animation: homeostasisIndex < 40 ? "pulseGlow 1.5s infinite" : "none"
          }}
        />

        {/* 2. Kanvas Partikel Sirkulasi Darah & Nutrisi */}
        <SimulationCanvas />

        {/* 3. Organ Hotspot Pins Mengapit Sisi Tubuh (Kiri & Kanan) */}
        {organHotspots.map((organ) => {
          const isSelected = selectedOrgan?.id === organ.id;
          const isHeart = organ.id === "heart";

          return (
            <button
              type="button"
              key={organ.id}
              onClick={() => setSelectedOrgan(isSelected ? null : organ)}
              className={`organ-hotspot-pin organ-hotspot-badge organ-pin--${organ.side} ${isSelected ? "is-selected" : ""}`}
              style={{
                top: organ.pos.top,
                left: organ.pos.left,
                animation: isHeart
                  ? `heartBeat ${pulseSpeed} infinite ease-in-out`
                  : "floatGentle 3.5s infinite ease-in-out"
              }}
              title={`Sentuh untuk info ${organ.name}`}
            >
              <span className="organ-hotspot-icon">{organ.icon}</span>
              <span>{organ.shortName}</span>
              {/* Titik indikator penunjuk ke arah tubuh */}
              <span className="organ-hotspot-pip" aria-hidden="true" />
            </button>
          );
        })}
      </div>

      {/* 4. Pop-up Kartu Penjelasan Organ Terpilih */}
      {selectedOrgan && (
        <div className="organ-detail-modal">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "1.4rem" }}>{selectedOrgan.icon}</span>
              <h4 style={{ fontFamily: "var(--font-display)", color: "var(--color-info-text)", fontSize: "1.15rem", margin: 0 }}>
                {selectedOrgan.name}
              </h4>
            </div>
            <button
              onClick={() => setSelectedOrgan(null)}
              aria-label="Tutup kartu organ"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                borderRadius: "50%",
                width: "44px",
                height: "44px",
                minWidth: "44px",
                fontSize: "1rem",
                cursor: "pointer",
                color: "var(--text-on-dark)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              ✕
            </button>
          </div>

          <p style={{ fontSize: "0.92rem", color: "var(--text-on-dark)", marginBottom: "10px", lineHeight: "1.45" }}>
            {selectedOrgan.role}
          </p>

          <div style={{
            background: "rgba(56, 189, 248, 0.12)",
            border: "1px solid rgba(56, 189, 248, 0.3)",
            padding: "8px 12px",
            borderRadius: "12px",
            fontSize: "0.85rem",
            fontWeight: 700,
            color: "var(--color-info-text)",
            display: "flex",
            justifyContent: "space-between"
          }}>
            <span>Kondisi Saat Ini:</span>
            <span>{selectedOrgan.status}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "12px" }}>
            <button
              type="button"
              onClick={() => setIsVideoModalOpen(true)}
              className="game-btn game-btn--rect game-btn--orange game-btn--sm"
              style={{ width: "100%", height: "44px", fontSize: "0.86rem" }}
              title="Tonton Video Ilustrasi Fisiologi Si Meta"
            >
              <span className="game-btn__content">
                <span>🎬</span>
                <span>Video Fisiologi</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setIs3DModalOpen(true)}
              className="game-btn game-btn--rect game-btn--blue game-btn--sm"
              style={{ width: "100%", height: "44px", fontSize: "0.86rem" }}
              title="Inspeksi Model 3D Anatomi Organ"
            >
              <span className="game-btn__content">
                <span>🔬</span>
                <span>Model 3D</span>
              </span>
            </button>
          </div>
        </div>
      )}

      {/* 5. Jendela Modal Inspeksi 3D Morfologi Organ */}
      <Organ3DModal
        organId={selectedOrgan?.id}
        isOpen={is3DModalOpen}
        onClose={() => setIs3DModalOpen(false)}
      />

      {/* 6. Jendela Modal Pemutar Video Edukasi Fisiologi */}
      <OrganVideoModal
        organId={selectedOrgan?.id}
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
    </div>
  );
}
