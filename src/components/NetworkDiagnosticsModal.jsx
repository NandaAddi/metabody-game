import React, { useState, useEffect } from "react";
import {
  getConnectionInfo,
  onConnectionStatusChange,
  measurePing,
  getCustomSupabaseConfig,
  setCustomSupabaseConfig,
  toggleNetworkMode,
  setSyncSessionCode
} from "../services/realtimeSync";
import { GameModal, GameButton } from "./game-ui";

export default function NetworkDiagnosticsModal({ isOpen, onClose }) {
  const [connInfo, setConnInfo] = useState(getConnectionInfo());
  const [sessionInput, setSessionInput] = useState(connInfo.sessionCode || "META-8A");
  const [showConfig, setShowConfig] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const [customKey, setCustomKey] = useState("");
  const [isPinging, setIsPinging] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const unsub = onConnectionStatusChange((info) => {
      setConnInfo(info);
      setSessionInput(info.sessionCode);
    });
    const cfg = getCustomSupabaseConfig();
    setCustomUrl(cfg.url || "");
    setCustomKey(cfg.key || "");
    return unsub;
  }, []);

  if (!isOpen) return null;

  const handlePing = () => {
    setIsPinging(true);
    measurePing();
    setTimeout(() => setIsPinging(false), 600);
  };

  const handleSaveSession = (e) => {
    e.preventDefault();
    if (sessionInput.trim()) {
      setSyncSessionCode(sessionInput.trim().toUpperCase());
    }
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    setCustomSupabaseConfig(customUrl.trim(), customKey.trim());
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleToggleMode = () => {
    const forceOffline = connInfo.mode === "cloud";
    toggleNetworkMode(forceOffline);
  };

  const statusColor =
    connInfo.status === "connected"
      ? connInfo.mode === "cloud"
        ? "var(--color-health-text)"
        : "var(--color-info-text)"
      : connInfo.status === "connecting"
      ? "var(--color-warn-text)"
      : "var(--color-danger-text)";

  return (
    <GameModal
      isOpen={isOpen}
      title="DIAGNOSTIK JARINGAN KELAS"
      headerVariant="purple"
      headerIcon="📡"
      size="md"
      onClose={onClose}
      footer={
        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", width: "100%" }}>
          <GameButton variant="purple" shape="rect" size="sm" onClick={onClose}>
            Tutup
          </GameButton>
        </div>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", color: "var(--text-on-dark)", fontSize: "0.92rem" }}>
        {/* 1. Status Utama (Frameless Glass & Ambient Shadow) */}
        <div
          style={{
            background: "rgba(15, 23, 42, 0.88)",
            border: "none",
            outline: "none",
            boxShadow: `0 10px 28px rgba(0, 0, 0, 0.5), 0 0 16px ${statusColor}`,
            borderRadius: "16px",
            padding: "14px 18px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <span
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: statusColor,
                  boxShadow: `0 0 10px ${statusColor}`,
                  display: "inline-block",
                  animation: "pulse 2s infinite"
                }}
              />
              <strong style={{ fontSize: "1.05rem", color: "#F8FAFC" }}>
                {connInfo.mode === "cloud"
                  ? "☁️ Mode Supabase Realtime Hub"
                  : "🟢 Mode Offline Standalone (Aman)"}
              </strong>
            </div>
            <div style={{ color: "var(--text-on-dark-dim)", fontSize: "0.85rem" }}>
              Sesi Kelas: <strong style={{ color: "var(--color-info-text)" }}>{connInfo.sessionCode}</strong> | Latensi RTT:{" "}
              <strong style={{ color: "var(--color-health-text)" }}>{connInfo.latencyMs} ms</strong>
            </div>
          </div>

          <GameButton
            variant="blue"
            shape="rect"
            size="sm"
            onClick={handlePing}
            disabled={isPinging}
            sound="normal"
          >
            {isPinging ? "Mengukur..." : "⚡ Uji Ping"}
          </GameButton>
        </div>

        {/* 2. Form Ganti Kode Sesi Kelas */}
        <form
          onSubmit={handleSaveSession}
          style={{
            background: "rgba(30, 41, 59, 0.6)",
            padding: "12px 16px",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.25)"
          }}
        >
          <label style={{ color: "#94A3B8", fontSize: "0.85rem", whiteSpace: "nowrap" }}>
            🔑 Kode Sesi:
          </label>
          <input
            type="text"
            value={sessionInput}
            onChange={(e) => setSessionInput(e.target.value.toUpperCase())}
            maxLength={12}
            style={{
              background: "#0F172A",
              border: "none",
              outline: "none",
              boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.5)",
              color: "#F8FAFC",
              padding: "8px 12px",
              borderRadius: "8px",
              fontSize: "0.95rem",
              fontWeight: 700,
              flex: 1
            }}
          />
          <GameButton type="submit" variant="blue" shape="rect" size="sm" sound="confirm">
            Terapkan
          </GameButton>
        </form>

        {/* 3. Arsitektur Dual Transport & Sakelar */}
        <div style={{ background: "rgba(30, 41, 59, 0.45)", borderRadius: "14px", padding: "14px", border: "none", outline: "none", boxShadow: "0 4px 16px rgba(0, 0, 0, 0.25)" }}>
          <div style={{ fontWeight: 700, marginBottom: "10px", color: "var(--color-nephron-text)" }}>
            🔄 Saluran Transport Aktif:
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>1. Local Broadcast & Event Bus:</span>
              <span style={{ color: "var(--color-health-text)", fontWeight: 700 }}>🟢 Aktif (0-5 ms)</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>2. Supabase Cloud Realtime:</span>
              <span
                style={{
                  color: connInfo.hasSupabase ? "var(--color-health-text)" : "var(--text-on-dark-dim)",
                  fontWeight: 700
                }}
              >
                {connInfo.hasSupabase
                  ? connInfo.mode === "cloud"
                    ? `🟢 Terhubung (${connInfo.latencyMs} ms)`
                    : "🟡 Siap (Sedang Standalone)"
                  : "⚪ Belum Dikonfigurasi (Offline)"}
              </span>
            </div>
          </div>

          <div style={{ marginTop: "14px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <GameButton
              type="button"
              onClick={handleToggleMode}
              variant={connInfo.mode === "cloud" ? "blue" : "green"}
              shape="rect"
              size="sm"
              sound="normal"
              style={{ flex: 1 }}
            >
              {connInfo.mode === "cloud"
                ? "🔌 Alihkan ke Offline Standalone"
                : "☁️ Alihkan ke Supabase Cloud"}
            </GameButton>

            <GameButton
              type="button"
              onClick={() => setShowConfig(!showConfig)}
              variant="blue"
              shape="rect"
              size="sm"
              sound="modal"
            >
              ⚙️ {showConfig ? "Tutup Pengaturan" : "Konfigurasi Cloud"}
            </GameButton>
          </div>
        </div>

        {/* 4. Konfigurasi Kustom Supabase (Opsional) */}
        {showConfig && (
          <form
            onSubmit={handleSaveConfig}
            style={{
              background: "rgba(15, 23, 42, 0.95)",
              border: "none",
              outline: "none",
              boxShadow: "0 12px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(99, 102, 241, 0.3)",
              padding: "16px",
              borderRadius: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            }}
          >
            <div style={{ fontWeight: 700, color: "#818CF8", fontSize: "0.9rem" }}>
              🔑 Konfigurasi Klien Supabase (Langsung di Browser):
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", color: "#94A3B8" }}>Project URL:</label>
              <input
                type="text"
                placeholder="https://xyzcompany.supabase.co"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                style={{
                  width: "100%",
                  background: "#1E293B",
                  border: "none",
                  outline: "none",
                  boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.5)",
                  color: "#FFF",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  fontSize: "0.85rem"
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", color: "#94A3B8" }}>Anon Public Key:</label>
              <input
                type="password"
                placeholder="eyJhbGciOi..."
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                style={{
                  width: "100%",
                  background: "#1E293B",
                  border: "none",
                  outline: "none",
                  boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.5)",
                  color: "#FFF",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  fontSize: "0.85rem"
                }}
              />
            </div>

            {saveSuccess && (
              <div style={{ color: "var(--color-health-text)", fontSize: "0.82rem", fontWeight: 700 }}>
                ✅ Konfigurasi berhasil disimpan! Saluran cloud diperbarui.
              </div>
            )}

            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", alignItems: "center", marginTop: "4px" }}>
              <GameButton
                type="button"
                variant="red"
                shape="rect"
                size="sm"
                sound="cancel"
                onClick={() => {
                  setCustomUrl("");
                  setCustomKey("");
                  setCustomSupabaseConfig("", "");
                  setSaveSuccess(true);
                  setTimeout(() => setSaveSuccess(false), 2000);
                }}
              >
                Hapus Konfigurasi
              </GameButton>
              <GameButton type="submit" variant="blue" shape="rect" size="sm" sound="confirm">
                Simpan & Hubungkan
              </GameButton>
            </div>
          </form>
        )}
      </div>
    </GameModal>
  );
}
