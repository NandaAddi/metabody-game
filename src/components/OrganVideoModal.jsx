import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { ORGAN_VIDEO_DATA } from "../data/organVideoData";
import { GameButton } from "./game-ui";
import "./OrganVideoModal.css";

export default function OrganVideoModal({ organId, isOpen, onClose }) {
  const videoRef = useRef(null);
  const [needsUserGesture, setNeedsUserGesture] = useState(false);

  const organData = ORGAN_VIDEO_DATA[organId] || null;

  // Autoplay saat video dibuka
  useEffect(() => {
    if (!isOpen || !organData) return;

    setNeedsUserGesture(false);
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("[OrganVideoModal] Autoplay dengan suara tertahan browser:", err);
          setNeedsUserGesture(true);
        });
      }
    }
  }, [isOpen, organId, organData]);

  // Tutup / Lewati dengan tombol Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !organData) return null;

  const handleStartVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setNeedsUserGesture(false);
    }
  };

  const modalContent = (
    <div
      className="organ-video-fullscreen-theater"
      role="dialog"
      aria-modal="true"
      aria-label={`Video ${organData.organName}`}
    >
      {/* Tombol Skip Mengambang di Pojok Kanan Atas */}
      <div className="organ-video-skip-floating">
        <GameButton
          variant="gold"
          shape="rect"
          size="md"
          onClick={onClose}
          sound="confirm"
          className="organ-video-skip-btn"
        >
          <span>Lewati Video</span>
          <span className="organ-video-btn-arrow">➔</span>
        </GameButton>
      </div>

      {/* Area Pemutar Video Layar Penuh */}
      <div className="organ-video-screen-container">
        <video
          ref={videoRef}
          src={organData.videoFile}
          className="organ-video-player-fullscreen"
          controls
          autoPlay
          playsInline
          onEnded={onClose}
        >
          Browser Anda tidak mendukung tag video HTML5.
        </video>

        {/* Prompt Play jika browser menahan autoplay bersuara */}
        {needsUserGesture && (
          <div className="organ-video-gesture-overlay" onClick={handleStartVideo}>
            <GameButton
              variant="green"
              shape="rect"
              size="lg"
              sound="confirm"
            >
              <span>▶ Putar Video</span>
            </GameButton>
          </div>
        )}
      </div>
    </div>
  );

  // Gunakan React Portal agar modal video menempel langsung ke document.body
  // dan bebas dari stacking context parent (.arena-center-stage z-index: 10)
  return ReactDOM.createPortal(modalContent, document.body);
}
