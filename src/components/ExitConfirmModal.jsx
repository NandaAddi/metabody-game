import React from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../stores/useGameStore";
import { GameModal, GameButton } from "./game-ui";

export default function ExitConfirmModal() {
  const showExitConfirm = useGameStore((state) => state.showExitConfirm);
  const setShowExitConfirm = useGameStore((state) => state.setShowExitConfirm);
  const navigate = useNavigate();

  if (!showExitConfirm) return null;

  const handleStay = () => {
    setShowExitConfirm(false);
  };

  const handleExit = () => {
    setShowExitConfirm(false);
    navigate("/");
  };

  const footerActions = (
    <div style={{ display: "flex", gap: "12px", justifyContent: "center", width: "100%" }}>
      <GameButton
        variant="blue"
        shape="rect"
        size="md"
        onClick={handleStay}
        sound="confirm"
      >
        ▶️ Tetap Bermain
      </GameButton>
      <GameButton
        variant="red"
        shape="rect"
        size="md"
        onClick={handleExit}
        sound="cancel"
      >
        🚪 Ya, Keluar
      </GameButton>
    </div>
  );

  const modalContent = (
    <GameModal
      isOpen={true}
      onClose={handleStay}
      title="KELUAR DARI MISI?"
      headerVariant="red"
      headerIcon="⚠️"
      size="md"
      footer={footerActions}
      backdropClose={true}
    >
      <div style={{ textAlign: "center", padding: "12px 10px 4px" }}>
        <p style={{
          color: "#F8FAFC",
          fontSize: "1.08rem",
          fontWeight: 600,
          lineHeight: "1.5",
          margin: "0 0 10px 0",
          fontFamily: "var(--font-display)"
        }}>
          Progres simulasi saat ini akan hilang dan kalian harus memulai ulang dari awal.
        </p>
        <p style={{ color: "#94A3B8", fontSize: "0.9rem", margin: 0 }}>
          Apakah kelompok kalian yakin ingin kembali ke Halaman Menu Utama?
        </p>
      </div>
    </GameModal>
  );

  // Render via portal directly to body to prevent any ancestor clipping/containment
  return ReactDOM.createPortal(modalContent, document.body);
}
