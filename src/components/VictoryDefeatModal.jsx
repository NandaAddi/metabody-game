import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { useGameStore } from "../stores/useGameStore";
import { MISSIONS } from "../data/missionsData";
import { GameModal, GameButton } from "./game-ui";
import { broadcastClassMessage } from "../services/realtimeSync";

export default function VictoryDefeatModal() {
  const gameStatus = useGameStore((state) => state.gameStatus);
  const earnedStars = useGameStore((state) => state.earnedStars);
  const homeostasisIndex = useGameStore((state) => state.homeostasisIndex);
  const telemetry = useGameStore((state) => state.telemetry);
  const activeMissionId = useGameStore((state) => state.activeMissionId);
  const selectMission = useGameStore((state) => state.selectMission);
  const restartMission = useGameStore((state) => state.restartMission);

  useEffect(() => {
    if (gameStatus === "victory") {
      // Efek pesta confetti kemenangan
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.log("Confetti trigger:", e);
      }

      // Siarkan telemetri biometrik misi ke seluruh tablet kelompok siswa
      const current = MISSIONS.find((m) => m.id === activeMissionId) || MISSIONS[0];
      broadcastClassMessage("MISSION_TELEMETRY", {
        missionId: activeMissionId,
        missionTitle: current.title,
        heartRate: telemetry.heartRate,
        coreTemp: telemetry.coreTemp,
        sweatRate: telemetry.sweatRate,
        urineVolume: telemetry.urineVolume,
        urineColor: telemetry.hydration < 60 ? "Kuning Pekat / Jingga Tua" : "Kuning Normal",
        hydration: telemetry.hydration,
        homeostasisIndex,
        timestamp: Date.now()
      });
    }
  }, [gameStatus, activeMissionId, telemetry, homeostasisIndex]);

  if (gameStatus !== "victory" && gameStatus !== "defeat") return null;

  const isVictory = gameStatus === "victory";
  const hasNextMission = activeMissionId < MISSIONS.length;

  const handleNextMission = () => {
    if (hasNextMission) {
      selectMission(activeMissionId + 1);
    }
  };

  const currentMission = MISSIONS.find((m) => m.id === activeMissionId) || MISSIONS[0];

  const victoryFooter = (
    <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", width: "100%" }}>
      <GameButton
        variant="purple"
        shape="rect"
        size="md"
        onClick={restartMission}
        sound="normal"
      >
        🔄 Main Ulang
      </GameButton>

      {hasNextMission && (
        <GameButton
          variant="green"
          shape="rect"
          size="lg"
          onClick={handleNextMission}
          sound="confirm"
        >
          🚀 Lanjut Misi Berikutnya!
        </GameButton>
      )}
    </div>
  );

  const defeatFooter = (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <GameButton
        variant="red"
        shape="rect"
        size="lg"
        onClick={restartMission}
        sound="confirm"
      >
        🔄 Eksperimen Ulang Bersama Tim
      </GameButton>
    </div>
  );

  return (
    <GameModal
      isOpen={true}
      title={isVictory ? "🏆 MISI BERHASIL!" : "⚠️ SI META KOLAPS!"}
      headerVariant={isVictory ? "gold" : "red"}
      headerIcon={isVictory ? "✨" : "🚨"}
      size="lg"
      footer={isVictory ? victoryFooter : defeatFooter}
    >
      <div style={{ maxHeight: "72vh", overflowY: "auto", paddingRight: "4px" }}>
        {isVictory ? (
          <div style={{ textAlign: "center" }}>
            {/* Lencana / Bintang Kemenangan */}
            <div style={{ margin: "4px 0 12px" }}>
              <img
                src="/rewards/badges_individual_grand_champion.png"
                alt="Medali Juara"
                style={{
                  width: "110px",
                  height: "110px",
                  objectFit: "contain",
                  animation: "floatGentle 3s infinite ease-in-out",
                  filter: "drop-shadow(0 8px 16px rgba(255, 215, 0, 0.4))"
                }}
              />
            </div>

            <h2 style={{ fontFamily: "var(--font-display)", color: "var(--color-health-text)", fontSize: "1.85rem", marginBottom: "4px" }}>
              Luar Biasa, Penjaga Tubuh!
            </h2>
            <p style={{ color: "#94A3B8", fontSize: "1.05rem" }}>
              Kerja sama tim kalian berhasil menjaga kestabilan tubuh Si Meta!
            </p>

            {/* Bintang Rating */}
            <div style={{ fontSize: "2.2rem", margin: "10px 0", filter: "drop-shadow(0 4px 10px rgba(255, 200, 0, 0.5))" }}>
              {earnedStars === 3 ? "⭐⭐⭐" : earnedStars === 2 ? "⭐⭐" : "⭐"}
            </div>

            {/* Refleksi Konseptualisasi Abstrak Kolb */}
            {currentMission?.victoryConceptualization && (
              <div style={{
                background: "rgba(34, 197, 94, 0.15)",
                border: "none",
                outline: "none",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35), 0 0 16px rgba(34, 197, 94, 0.2)",
                borderRadius: "16px",
                padding: "14px 18px",
                margin: "14px 0",
                textAlign: "left",
                fontSize: "0.95rem",
                color: "#F1F5F9"
              }}>
                <strong style={{ color: "var(--color-health-text)", display: "flex", alignItems: "center", gap: "6px" }}>
                  🧠 Telaah Konseptual Ilmiah (Kolb: Abstract Conceptualization):
                </strong>
                <p style={{ marginTop: "6px", lineHeight: "1.5", color: "var(--text-on-dark)" }}>
                  {currentMission.victoryConceptualization}
                </p>
              </div>
            )}

            {/* Rekap Data Telemetri untuk LKPD */}
            <div style={{
              background: "rgba(15, 23, 42, 0.85)",
              border: "none",
              outline: "none",
              boxShadow: "0 12px 30px rgba(0, 0, 0, 0.45), 0 0 18px rgba(56, 189, 248, 0.2)",
              padding: "14px 18px",
              borderRadius: "16px",
              margin: "14px 0",
              textAlign: "left",
              fontSize: "0.92rem"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <h4 style={{ color: "var(--color-info-text)", margin: 0, fontFamily: "var(--font-display)" }}>
                  📊 Ringkasan Kondisi Tubuh (Tersimpan ke LKPD Kelompok):
                </h4>
                <span style={{
                  background: "rgba(34, 197, 94, 0.2)",
                  border: "none",
                  color: "var(--color-health-text)",
                  padding: "3px 8px",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  fontWeight: 700
                }}>
                  📡 Terkirim ke Tablet
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", color: "#CBD5E1" }}>
                <div>Indeks Homeostasis: <strong style={{ color: "var(--color-health-text)" }}>{homeostasisIndex}%</strong></div>
                <div>Volume Urine: <strong style={{ color: "var(--color-warn-text)" }}>{telemetry.urineVolume} mL</strong></div>
                <div>Laju Keringat: <strong style={{ color: "var(--color-info-text)" }}>{telemetry.sweatRate} mL/jam</strong></div>
                <div>Denyut Jantung: <strong style={{ color: "var(--color-danger-text)" }}>{telemetry.heartRate} BPM</strong></div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            {/* Si Meta Kolaps (Safe Failure Humanistik) */}
            <div style={{ margin: "4px 0 12px" }}>
              <img
                src="/simeta/simeta_dizzy_collapse.png"
                alt="Si Meta Kolaps"
                style={{ width: "115px", height: "115px", objectFit: "contain" }}
              />
            </div>

            <h2 style={{ fontFamily: "var(--font-display)", color: "#FB7185", fontSize: "1.85rem", marginBottom: "4px" }}>
              Jangan Menyerah, Penjaga Tubuh!
            </h2>
            <p style={{ color: "#CBD5E1", fontSize: "1rem", marginTop: "4px" }}>
              Homeostasis turun ke <strong style={{ color: "var(--color-danger-text)" }}>{homeostasisIndex}%</strong>. Tubuh manusia memang kompleks, kegagalan ini adalah laboratorium belajar kita!
            </p>

            {/* Kartu Telaah Biologis Ilmiah (Kolb: Reflective Observation) */}
            <div style={{
              background: "rgba(225, 29, 72, 0.15)",
              padding: "16px 18px",
              borderRadius: "16px",
              margin: "16px 0",
              textAlign: "left",
              fontSize: "0.92rem",
              border: "none",
              outline: "none",
              boxShadow: "inset 4px 0 0 #F43F5E, 0 8px 24px rgba(0, 0, 0, 0.4), 0 0 20px rgba(244, 63, 94, 0.25)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
                <span style={{ fontSize: "1.2rem" }}>🔬</span>
                <strong style={{ color: "#FB7185", fontSize: "1.05rem", fontFamily: "var(--font-display)" }}>
                  Kartu Telaah Biologis (Kolb: Observasi Reflektif)
                </strong>
              </div>

              {currentMission?.collapseAnalysis ? (
                <>
                  <div style={{ marginBottom: "8px" }}>
                    <span style={{ color: "#94A3B8", fontWeight: "600" }}>Penyebab Utama: </span>
                    <strong style={{ color: "#FFF" }}>{currentMission.collapseAnalysis.cause}</strong>
                  </div>
                  <div style={{ marginBottom: "8px", lineHeight: "1.45" }}>
                    <span style={{ color: "#94A3B8", fontWeight: "600" }}>Mengapa 4 Sistem Kewalahan: </span>
                    <span style={{ color: "var(--text-on-dark)" }}>{currentMission.collapseAnalysis.systemicReason}</span>
                  </div>
                  <div style={{
                    background: "rgba(15, 23, 42, 0.8)",
                    padding: "10px 14px",
                    borderRadius: "12px",
                    marginTop: "10px",
                    border: "none",
                    outline: "none",
                    boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.1)"
                  }}>
                    <strong style={{ color: "var(--color-info-text)" }}>🎯 Strategi Eksperimen Baru (Active Experimentation): </strong>
                    <span style={{ color: "#F8FAFC" }}>{currentMission.collapseAnalysis.actionPlan}</span>
                  </div>
                </>
              ) : (
                <ul style={{ paddingLeft: "20px", marginTop: "8px", lineHeight: "1.5", color: "var(--text-on-dark)" }}>
                  <li>Jika dehidrasi: Jangan terlambat menekan tombol <strong>Minum Air</strong> di Stasiun 1!</li>
                  <li>Jika napas ngos-ngosan: Segera aktifkan <strong>Atur Napas Rileks</strong> di Stasiun 2!</li>
                  <li>Jika racun urea tinggi: Segera picu <strong>Saringan Nefron</strong> di Stasiun 3!</li>
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </GameModal>
  );
}
