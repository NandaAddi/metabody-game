import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GameButton } from "../components/game-ui";
import "./BridgingVideoView.css";

export default function BridgingVideoView() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [needsUserGesture, setNeedsUserGesture] = useState(false);

  // Sumber video bridging
  const videoSrc = "./videos/bridging.mp4";

  // Coba autoplay saat komponen dimuat
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn("Autoplay with sound was prevented by browser policy:", err);
        setNeedsUserGesture(true);
      });
    }
  }, []);

  const handleStartVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setNeedsUserGesture(false);
    }
  };

  const handleSkip = () => {
    navigate("/arena");
  };

  return (
    <div className="bridging-theater-viewport">
      {/* Satu-satunya tombol: Skip (Selaras Design System GameButton) */}
      <div className="bridging-skip-floating">
        <GameButton
          variant="gold"
          shape="rect"
          size="md"
          onClick={handleSkip}
          sound="confirm"
          className="bridging-game-skip-btn"
        >
          <span>Lewati Video</span>
          <span className="bridging-btn-arrow">➔</span>
        </GameButton>
      </div>

      {/* Area Pemutar Video Layar Penuh */}
      <div className="bridging-video-container" onClick={handleStartVideo}>
        <video
          ref={videoRef}
          src={videoSrc}
          className="bridging-video-fullscreen"
          autoPlay
          playsInline
          onEnded={handleSkip}
        />

        {/* Prompt Play jika browser menahan autoplay bersuara */}
        {needsUserGesture && (
          <div className="bridging-gesture-overlay" onClick={handleStartVideo}>
            <GameButton
              variant="green"
              shape="rect"
              size="lg"
              sound="confirm"
            >
              ▶ Sentuh untuk Putar Video
            </GameButton>
          </div>
        )}
      </div>
    </div>
  );
}
