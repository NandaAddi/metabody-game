import React, { useState, useEffect, useRef } from "react";
import { useGameStore } from "../stores/useGameStore";
import { playVoiceBlip } from "../engine/useSoundEffects";
import { GameButton, GamePlaque } from "./game-ui";
import "./CharacterDialogBox.css";

export default function CharacterDialogBox() {
  const gameStatus = useGameStore((state) => state.gameStatus);
  const activeMission = useGameStore((state) => state.activeMission);
  const storyDialogueIndex = useGameStore((state) => state.storyDialogueIndex);
  const nextStoryDialogue = useGameStore((state) => state.nextStoryDialogue);
  const skipStoryDialogue = useGameStore((state) => state.skipStoryDialogue);

  const isCrisisDialogueActive = useGameStore((state) => state.isCrisisDialogueActive);
  const crisisDialogue = useGameStore((state) => state.crisisDialogue);
  const dismissCrisisDialogue = useGameStore((state) => state.dismissCrisisDialogue);

  // Typewriter state
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimerRef = useRef(null);

  // Tentukan apakah mode Briefing atau Crisis
  const isBriefingMode = gameStatus === "briefing";
  const isCrisisMode = isCrisisDialogueActive && crisisDialogue;

  // Data dialog aktif
  const storyDialogues = activeMission?.storyDialogues || [];
  const currentDialogue = isCrisisMode
    ? crisisDialogue
    : storyDialogues[storyDialogueIndex] || {
        speaker: "Si Meta",
        role: "Sahabat Tubuhmu",
        pose: "simeta_idle_happy.png",
        text: activeMission?.briefing || "Halo! Mari kita jaga keseimbangan tubuh bersama!"
      };

  const isLastStoryStep = !isCrisisMode && storyDialogueIndex >= storyDialogues.length - 1;
  const fullText = currentDialogue?.text || "";

  // Efek ketik berjalan (Typewriter)
  useEffect(() => {
    if (!isBriefingMode && !isCrisisMode) return;

    setDisplayedText("");
    setIsTyping(true);

    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
    }

    let charIdx = 0;
    typingTimerRef.current = setInterval(() => {
      charIdx++;
      if (charIdx <= fullText.length) {
        setDisplayedText(fullText.slice(0, charIdx));
        // Mainkan suara blip vokal lembut setiap 3 karakter
        if (charIdx % 3 === 0) {
          playVoiceBlip();
        }
      } else {
        clearInterval(typingTimerRef.current);
        setIsTyping(false);
      }
    }, 24);

    return () => {
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
      }
    };
  }, [fullText, isBriefingMode, isCrisisMode]);

  // Sembunyikan dialog jika tidak relevan
  if (!isBriefingMode && !isCrisisMode) {
    return null;
  }

  // Klik kotak dialog: selesaikan ketik langsung, atau lanjut ke berikutnya
  const handleBoxClick = () => {
    if (isTyping) {
      // Langsung tuntaskan teks
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      setDisplayedText(fullText);
      setIsTyping(false);
    }
  };

  const handleAdvance = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (isTyping) {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      setDisplayedText(fullText);
      setIsTyping(false);
      return;
    }

    if (isCrisisMode) {
      dismissCrisisDialogue();
    } else {
      nextStoryDialogue();
    }
  };

  const handleSkip = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    skipStoryDialogue();
  };

  return (
    <div className={`character-dialog-backdrop ${isCrisisMode ? "crisis-mode" : ""}`}>
      <div
        className={`character-dialog-card ${isCrisisMode ? "crisis-card" : "story-card"}`}
        onClick={handleBoxClick}
      >
        {/* Potret Karakter Ekspresif dengan Bingkai Logam */}
        <div className="dialog-portrait-wrapper">
          <div className="dialog-portrait-glow" />
          <img
            src={`/src/assets/simeta/${currentDialogue.pose}`}
            alt={currentDialogue.speaker}
            className="dialog-portrait-img"
          />
        </div>

        {/* Isi Kotak Dialog */}
        <div className="dialog-main-content">
          {/* Header Dialog: Glossy Nameplate & Skip Button */}
          <div className="dialog-header-row">
            <GamePlaque
              variant={isCrisisMode ? "red" : "purple"}
              size="sm"
              icon={isCrisisMode ? "🚨" : "🌟"}
            >
              <strong style={{ letterSpacing: "0.5px" }}>{currentDialogue.speaker}</strong>
              <span style={{ opacity: 0.85, fontSize: "0.85em", marginLeft: "6px", fontWeight: "normal" }}>
                ({currentDialogue.role})
              </span>
            </GamePlaque>

            {isBriefingMode && storyDialogues.length > 1 && (
              <GameButton
                variant="pink"
                shape="rect"
                size="sm"
                onClick={handleSkip}
                sound="cancel"
                title="Langsung mulai permainan"
              >
                ⏩ Lewati Cerita
              </GameButton>
            )}
          </div>

          {/* Teks Typewriter */}
          <div className="dialog-text-container">
            <p className="dialog-speech-text">
              "{displayedText}"
              {isTyping && <span className="typewriter-cursor">|</span>}
            </p>
          </div>

          {/* Footer: Progress Dots & Action Button */}
          <div className="dialog-footer-row">
            {isBriefingMode && storyDialogues.length > 1 && (
              <div className="dialog-progress-dots">
                {storyDialogues.map((_, idx) => (
                  <span
                    key={idx}
                    className={`dialog-dot ${idx === storyDialogueIndex ? "active" : idx < storyDialogueIndex ? "done" : ""}`}
                  />
                ))}
              </div>
            )}

            <GameButton
              variant={isCrisisMode ? "red" : isLastStoryStep ? "green" : "gold"}
              shape="rect"
              size="md"
              onClick={handleAdvance}
              sound={isLastStoryStep ? "confirm" : "normal"}
            >
              {isCrisisMode
                ? "⚡ Siap, Ambil Tindakan!"
                : isLastStoryStep
                ? "🚀 Mulai Misi Sekarang!"
                : "Lanjut ➔"}
            </GameButton>
          </div>
        </div>
      </div>
    </div>
  );
}
