import React from "react";
import { useGameStore } from "../stores/useGameStore";
import { GameButton, GamePlaque } from "./game-ui";
import "./TutorialSpotlight.css";

export default function TutorialSpotlight() {
  const isTutorialActive = useGameStore((state) => state.isTutorialActive);
  const tutorialStep = useGameStore((state) => state.tutorialStep);
  const nextTutorialStep = useGameStore((state) => state.nextTutorialStep);
  const skipTutorial = useGameStore((state) => state.skipTutorial);
  const finishTutorial = useGameStore((state) => state.finishTutorial);
  const gameStatus = useGameStore((state) => state.gameStatus);

  if (!isTutorialActive || gameStatus !== "playing") {
    return null;
  }

  const stepsData = [
    {
      step: 1,
      title: "Langkah 1: Kenalan dengan Papan Pantau (Bio-HUD)",
      badge: "Langkah 1/4",
      icon: "🧭",
      plaqueVariant: "gold",
      speech:
        "Halo Penjaga Tubuh! Lihat Papan Pantau di atas. Bar Keseimbangan (Homeostasis 100%) menunjukkan kondisi tubuhku. Jika angkanya turun ke warna kuning atau merah, artinya tubuhku butuh bantuan stasiun kalian!",
      ctaText: "Lanjut ke Langkah 2 ➔",
      onCta: nextTutorialStep,
      isInteractiveClick: false
    },
    {
      step: 2,
      title: "Langkah 2: Stasiun Nutrisi & Hidrasi (Kiri)",
      badge: "Langkah 2/4",
      icon: "🥣",
      plaqueVariant: "blue",
      speech:
        "Sekarang giliran Operator Nutrisi di Stasiun Kiri! Coba sentuh tombol 'Beri Minum Air' yang berkedip terang di bawah untuk mengisi cairan tubuhku!",
      ctaText: "Tekan tombol 'Beri Minum Air' di bawah...",
      onCta: null,
      isInteractiveClick: true
    },
    {
      step: 3,
      title: "Langkah 3: Stasiun Gerak & Pernapasan (Tengah)",
      badge: "Langkah 3/4",
      icon: "🫁",
      plaqueVariant: "gold",
      speech:
        "Hebat, cairan tubuhku bertambah! Sekarang giliran Operator Pernapasan di Stasiun Tengah, sentuh tombol 'Atur Napas' yang berkedip untuk menstabilkan detak jantungku!",
      ctaText: "Tekan tombol 'Atur Napas' di bawah...",
      onCta: null,
      isInteractiveClick: true
    },
    {
      step: 4,
      title: "Langkah 4: Siap Menjalankan Misi Kelompok!",
      badge: "Langkah 4/4",
      icon: "🚀",
      plaqueVariant: "green",
      speech:
        "Luar biasa! Kalian sudah paham tugas tiap posisi. Di sebelah kanan ada Stasiun Ekskresi untuk menyaring racun di ginjal. Sekarang, mari mulai misi sesungguhnya! Jaga homeostasisku > 75%!",
      ctaText: "Mulai Misi Penuh! ▶️",
      onCta: finishTutorial,
      isInteractiveClick: false
    }
  ];

  const currentStepInfo = stepsData[tutorialStep - 1] || stepsData[0];

  return (
    <div className="tutorial-spotlight-layer">
      <div className="tutorial-dialog-card">
        {/* Header Ribbon & Skip Button */}
        <div className="tutorial-card-header">
          <GamePlaque
            variant={currentStepInfo.plaqueVariant}
            size="sm"
            icon={currentStepInfo.icon}
          >
            <span>{currentStepInfo.title}</span>
          </GamePlaque>

          <GameButton
            variant="pink"
            shape="rect"
            size="sm"
            onClick={skipTutorial}
            sound="cancel"
            title="Langsung mulai simulasi tanpa panduan"
          >
            ⏩ Lewati
          </GameButton>
        </div>

        {/* Isi Dialog Si Meta */}
        <div className="tutorial-body">
          <div className="tutorial-avatar-mini">
            <div className="tutorial-avatar-glow" />
            <img
              src="/simeta/simeta_idle_happy.png"
              alt="Si Meta Tutor"
              className="tutorial-simeta-img"
            />
          </div>

          <div className="tutorial-speech-bubble">
            <p className="tutorial-speech-text">"{currentStepInfo.speech}"</p>
          </div>
        </div>

        {/* Footer: Progress Dots & Action Button */}
        <div className="tutorial-footer">
          {/* Progress dots */}
          <div className="tutorial-dots">
            {[1, 2, 3, 4].map((s) => (
              <span
                key={s}
                className={`tutorial-dot ${s === tutorialStep ? "active" : s < tutorialStep ? "completed" : ""}`}
                title={`Langkah ${s}`}
              />
            ))}
          </div>

          {currentStepInfo.isInteractiveClick ? (
            <div className="tutorial-prompt-badge">
              <span className="tutorial-prompt-anim">👇</span>
              <span>{currentStepInfo.ctaText}</span>
            </div>
          ) : (
            <GameButton
              variant={tutorialStep === 4 ? "green" : "blue"}
              shape="rect"
              size="md"
              onClick={currentStepInfo.onCta}
              sound={tutorialStep === 4 ? "confirm" : "normal"}
            >
              {currentStepInfo.ctaText}
            </GameButton>
          )}
        </div>
      </div>
    </div>
  );
}
