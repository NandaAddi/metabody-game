import React from "react";
import { useGameStore } from "../stores/useGameStore";
import { GameButton } from "./game-ui";
import "./StationsControls.css";

/**
 * Komponen tombol stasiun terintegrasi GameButton dengan cooldown & target cue
 */
function StationButton({
  actionType,
  label,
  icon,
  variant = "blue",
  size = "md",
  style = {},
  isAvailable = true,
  sound = "normal"
}) {
  const triggerAction = useGameStore((state) => state.triggerAction);
  const cooldown = useGameStore((state) => state.actionCooldowns[actionType] || 0);
  const gameStatus = useGameStore((state) => state.gameStatus);
  const currentActionCue = useGameStore((state) => state.currentActionCue);
  const isTutorialActive = useGameStore((state) => state.isTutorialActive);

  const isTargetCue = currentActionCue && currentActionCue.actionKey === actionType;
  const isOnCooldown = cooldown > 0;
  // Saat tutorial aktif, tombol selain target di-disable agar siswa fokus
  const isTutorialLocked = isTutorialActive && !isTargetCue;
  const isDisabled = isOnCooldown || gameStatus !== "playing" || !isAvailable || isTutorialLocked;

  return (
    <div className="station-action-btn-wrapper">
      {/* Floating cue pointer badge */}
      {isTargetCue && !isOnCooldown && isAvailable && (
        <div className="button-cue-tag">
          <span className="cue-finger-icon">👆</span>
          <span>TEKAN INI</span>
        </div>
      )}

      {/* Cooldown overlay */}
      {isOnCooldown && (
        <div className="station-cooldown-overlay">
          <span className="station-cooldown-number">{cooldown}s</span>
        </div>
      )}

      {/* Lock overlay untuk aksi yang belum dibuka */}
      {!isAvailable && (
        <div className="station-locked-overlay">
          <span style={{ fontSize: "1.2rem" }}>🔒</span>
        </div>
      )}

      <GameButton
        variant={variant}
        shape="rect"
        size={size}
        icon={icon}
        onClick={() => !isDisabled && triggerAction(actionType)}
        disabled={isDisabled}
        sound={sound}
        style={{
          width: "100%",
          opacity: !isAvailable || isTutorialLocked ? 0.45 : isOnCooldown ? 0.6 : 1,
          outline: isTargetCue ? "2.5px solid #FBBF24" : "none",
          outlineOffset: "2px",
          transform: isTargetCue ? "scale(1.02)" : "scale(1)",
          ...style
        }}
      >
        {label}
      </GameButton>
    </div>
  );
}

export default function StationsControls() {
  const telemetry = useGameStore((state) => state.telemetry);
  const activeMission = useGameStore((state) => state.activeMission);
  const openMicroLens = useGameStore((state) => state.openMicroLens);

  const available = activeMission.availableActions || [
    "DRINK_WATER", "TAKE_REST_BREATH", "NEPHRON_FILTER", "SPEED_UP_RUN", "SLOW_DOWN_RUN",
    "EAT_BALANCED_MEAL", "EAT_INSTANT_SNACK", "LIVER_DETOX_BOOST"
  ];

  const isAvail = (action) => available.includes(action);

  return (
    <footer className="stations-master-dock">
      {/* ------------------------------------------------------------------ */}
      {/* STASIUN 1 (KIRI): NUTRISI & CAIRAN TUBUH (Operator Sentuh 1)        */}
      {/* ------------------------------------------------------------------ */}
      <div className="station-pod station-pod--nutrisi">
        <div className="station-pod__header">
          <div className="station-pod__title-box">
            <span className="station-pod__icon">💧</span>
            <div>
              <span className="station-pod__operator-badge">Operator 1 (Kiri)</span>
              <h4 className="station-pod__title">Nutrisi & Pencernaan</h4>
            </div>
          </div>

          <span style={{
            color: telemetry.hydration < 50 ? "var(--color-danger-text)" : "var(--color-health-text)",
            fontSize: "0.78rem",
            fontWeight: 800,
            display: "inline-flex",
            alignItems: "center",
            gap: "5px"
          }}>
            <span style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: telemetry.hydration < 50 ? "#EF4444" : "#22C55E"
            }} />
            {telemetry.hydration < 50 ? "Dehidrasi!" : "Cairan Aman"}
          </span>
        </div>

        {/* Telemetry Metrics: 3 Kolom Sejajar */}
        <div className="station-pod__telemetry station-pod__telemetry--cols3">
          <div className="station-metric">
            <span className="station-metric__label">Hidrasi</span>
            <span className="station-metric__val" style={{ color: telemetry.hydration < 50 ? "var(--color-danger-text)" : "var(--color-info-text)" }}>
              {Math.round(telemetry.hydration)}%
            </span>
          </div>
          <div className="station-metric">
            <span className="station-metric__label">Kepekatan Darah</span>
            <span
              className="station-metric__val"
              style={{ color: telemetry.bloodOsmolality > 300 ? "var(--color-warn-text)" : "var(--text-on-dark)" }}
            >
              {telemetry.bloodOsmolality} <small>mOsm</small>
            </span>
          </div>
          <div className="station-metric">
            <span className="station-metric__label">Energi Cerna</span>
            <span
              className="station-metric__val"
              style={{ color: (telemetry.energy ?? 80) < 35 ? "var(--color-danger-text)" : "var(--color-health-text)" }}
            >
              {Math.round(telemetry.energy ?? 80)}%
            </span>
          </div>
        </div>

        <div className="station-actions">
          <StationButton
            actionType="DRINK_WATER"
            icon="🥤"
            label="Beri Minum Air (+250 mL)"
            variant="blue"
            size="md"
            isAvailable={isAvail("DRINK_WATER")}
            sound="confirm"
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <StationButton
              actionType="EAT_BALANCED_MEAL"
              icon="🍱"
              label="Gizi Seimbang"
              variant="green"
              size="sm"
              isAvailable={isAvail("EAT_BALANCED_MEAL")}
              sound="confirm"
            />
            <StationButton
              actionType="EAT_INSTANT_SNACK"
              icon="🍟"
              label="Jajan Instan"
              variant="red"
              size="sm"
              isAvailable={isAvail("EAT_INSTANT_SNACK")}
              sound="normal"
            />
          </div>
        </div>
        <div className="station-footnote">
          🍱 = nasi+lauk+sayur+buah &nbsp;•&nbsp; 🍟 = garam, lemak & aditif
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* STASIUN 2 (TENGAH): GERAK & PERNAPASAN (Operator Sentuh 2)         */}
      {/* ------------------------------------------------------------------ */}
      <div className="station-pod station-pod--kardio">
        <div className="station-pod__header">
          <div className="station-pod__title-box">
            <span className="station-pod__icon">🫁</span>
            <div>
              <span className="station-pod__operator-badge">Operator 2 (Tengah)</span>
              <h4 className="station-pod__title">Gerak & Pernapasan</h4>
            </div>
          </div>

          <span style={{
            color: telemetry.coreTemp > 37.6 ? "var(--color-warn-text)" : "var(--color-info-text)",
            fontSize: "0.78rem",
            fontWeight: 800,
            display: "inline-flex",
            alignItems: "center",
            gap: "5px"
          }}>
            <span style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: telemetry.coreTemp > 37.6 ? "#F59E0B" : "#38BDF8"
            }} />
            {telemetry.coreTemp > 37.6 ? "Keringat Deras" : "Napas Teratur"}
          </span>
        </div>

        {/* Telemetry Metrics: 3 Kolom Sejajar */}
        <div className="station-pod__telemetry station-pod__telemetry--cols3">
          <div className="station-metric">
            <span className="station-metric__label">Detak Jantung</span>
            <span
              className="station-metric__val"
              style={{ color: telemetry.heartRate > 125 ? "var(--color-danger-text)" : telemetry.heartRate > 100 ? "var(--color-warn-text)" : "var(--color-health-text)" }}
            >
              {Math.round(telemetry.heartRate)} <small>BPM</small>
            </span>
          </div>
          <div className="station-metric">
            <span className="station-metric__label">Laju Napas</span>
            <span className="station-metric__val">
              {Math.round(telemetry.heartRate / 4)} <small>x/m</small>
            </span>
          </div>
          <div className="station-metric">
            <span className="station-metric__label">Keringat</span>
            <span className="station-metric__val" style={{ color: "var(--color-info-text)" }}>
              {telemetry.sweatRate} <small>mL/jam</small>
            </span>
          </div>
        </div>

        <div className="station-actions">
          <StationButton
            actionType="TAKE_REST_BREATH"
            icon="🧘"
            label="Atur Napas Lambat"
            variant="green"
            size="md"
            isAvailable={isAvail("TAKE_REST_BREATH")}
            sound="normal"
          />

          <StationButton
            actionType="SPEED_UP_RUN"
            icon="🏃"
            label="Pacu Lari (Aktivitas Lapangan)"
            variant="blue"
            size="sm"
            isAvailable={isAvail("SPEED_UP_RUN")}
            sound="confirm"
          />
        </div>
        <div className="station-footnote">
          🏃 = pacu sirkulasi darah & keringat &nbsp;•&nbsp; 🧘 = rilekskan napas & denyut
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* STASIUN 3 (KANAN): NEFRON GINJAL & EKSKRESI (Operator Sentuh 3)     */}
      {/* ------------------------------------------------------------------ */}
      <div className="station-pod station-pod--ekskresi">
        <div className="station-pod__header">
          <div className="station-pod__title-box">
            <span className="station-pod__icon">🔬</span>
            <div>
              <span className="station-pod__operator-badge">Operator 3 (Kanan)</span>
              <h4 className="station-pod__title">Ekskresi Ginjal & Hati</h4>
            </div>
          </div>

          <span style={{
            color: telemetry.ureaLevel > 35 ? "var(--color-danger-text)" : "var(--color-nephron-text)",
            fontSize: "0.78rem",
            fontWeight: 800,
            display: "inline-flex",
            alignItems: "center",
            gap: "5px"
          }}>
            <span style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: telemetry.ureaLevel > 35 ? "#EF4444" : "#818CF8"
            }} />
            {telemetry.ureaLevel > 35 ? "Zat Sisa Menumpuk!" : "Darah Bersih"}
          </span>
        </div>

        {/* Telemetry Metrics: 4 Kolom 1 Baris Sejajar */}
        <div className="station-pod__telemetry station-pod__telemetry--cols4">
          <div className="station-metric">
            <span className="station-metric__label">Urea</span>
            <span
              className="station-metric__val"
              style={{ color: telemetry.ureaLevel > 35 ? "var(--color-danger-text)" : "var(--color-health-text)" }}
            >
              {Math.round(telemetry.ureaLevel)} <small>mg/dL</small>
            </span>
          </div>
          <div className="station-metric">
            <span className="station-metric__label">Natrium</span>
            <span className="station-metric__val">
              {Math.round(telemetry.saltLevel)} <small>mEq</small>
            </span>
          </div>
          <div className="station-metric">
            <span className="station-metric__label">Beban Hati</span>
            <span
              className="station-metric__val"
              style={{ color: (telemetry.liverLoad ?? 10) > 40 ? "var(--color-warn-text)" : "var(--text-on-dark)" }}
            >
              {Math.round(telemetry.liverLoad ?? 10)}
            </span>
          </div>
          <div className="station-metric">
            <span className="station-metric__label">Zat Aditif</span>
            <span
              className="station-metric__val"
              style={{ color: (telemetry.additiveLoad ?? 0) > 25 ? "var(--color-warn-text)" : "var(--text-on-dark)" }}
            >
              {Math.round(telemetry.additiveLoad ?? 0)}
            </span>
          </div>
        </div>

        <div className="station-actions">
          <StationButton
            actionType="NEPHRON_FILTER"
            icon="🌀"
            label="Saring Nefron (Filtrasi)"
            variant="purple"
            size="md"
            isAvailable={isAvail("NEPHRON_FILTER")}
            sound="confirm"
          />

          <div style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: "8px" }}>
            <StationButton
              actionType="LIVER_DETOX_BOOST"
              icon="🧪"
              label="Detoks Hati"
              variant="purple"
              size="sm"
              isAvailable={isAvail("LIVER_DETOX_BOOST")}
              sound="confirm"
            />

            <GameButton
              variant="slate"
              shape="rect"
              size="sm"
              icon="🔬"
              onClick={openMicroLens}
              sound="modal"
              style={{ width: "100%", fontSize: "0.82rem" }}
            >
              Lab Nefron
            </GameButton>
          </div>
        </div>
        <div className="station-footnote">
          🧪 = amonia → urea (hati) &nbsp;•&nbsp; 🌀 = saring urea (ginjal)
        </div>
      </div>
    </footer>
  );
}
