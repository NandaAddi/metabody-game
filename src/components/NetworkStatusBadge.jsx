import React, { useState, useEffect } from "react";
import { getConnectionInfo, onConnectionStatusChange } from "../services/realtimeSync";
import NetworkDiagnosticsModal from "./NetworkDiagnosticsModal";

export default function NetworkStatusBadge({ theme = "auto", role = "default" }) {
  const [connInfo, setConnInfo] = useState(getConnectionInfo());
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    return onConnectionStatusChange((info) => {
      setConnInfo(info);
    });
  }, []);

  const isCloud = connInfo.mode === "cloud";
  const isConnected = connInfo.status === "connected";
  const isStudent = role === "student";

  const dotColor = isConnected
    ? isCloud
      ? "var(--color-health-text)" // Hijau Zamrud (Cloud)
      : "var(--color-info-text)" // Biru Langit (Offline Standalone)
    : connInfo.status === "connecting"
    ? "var(--color-warn-text)"
    : "var(--color-danger-text)";

  let labelText = isConnected
    ? isStudent
      ? "Terhubung ke Guru"
      : isCloud
      ? `Cloud (${connInfo.latencyMs}ms)`
      : "Lokal Standalone"
    : connInfo.status === "connecting"
    ? "Menghubungkan..."
    : isStudent
    ? "Belum Terhubung"
    : "Terputus";

  const handleClick = () => {
    if (!isStudent) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div
        role={isStudent ? "status" : "button"}
        onClick={handleClick}
        className="network-status-badge"
        title={
          isStudent
            ? `Status koneksi kelompok: ${labelText} (Sesi ${connInfo.sessionCode})`
            : "Klik untuk membuka diagnostik jaringan & uji ping"
        }
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(15, 23, 42, 0.75)",
          backdropFilter: "blur(8px)",
          border: "1.5px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "999px",
          padding: "5px 12px",
          cursor: isStudent ? "default" : "pointer",
          fontSize: "0.82rem",
          fontWeight: 700,
          color: "var(--text-on-dark)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
          transition: "all 0.2s ease"
        }}
          onMouseEnter={(e) => {
            if (!isStudent) {
              e.currentTarget.style.transform = "translateY(-1px) scale(1.02)";
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(0, 0, 0, 0.35)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isStudent) {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.25)";
            }
          }}
      >
        <span
          style={{
            width: "9px",
            height: "9px",
            borderRadius: "50%",
            background: dotColor,
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
            display: "inline-block",
            animation: "pulse 2s infinite"
          }}
        />
        <span style={{ color: dotColor, letterSpacing: "0.3px" }}>{labelText}</span>
          <span
            style={{
              background: "rgba(255, 255, 255, 0.12)",
              padding: "1px 6px",
              borderRadius: "4px",
              fontSize: "0.75rem",
              color: "var(--text-on-dark-dim)"
            }}
          >
          {connInfo.sessionCode}
        </span>
      </div>

      {!isStudent && (
        <NetworkDiagnosticsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
