import React, { useState } from "react";
import "./SketchfabEmbedViewer.css";

/**
 * SketchfabEmbedViewer
 * Komponen pemutar model 3D interaktif layar penuh bersih (tanpa watermark / info kreator).
 */
export default function SketchfabEmbedViewer({ sketchfabData, organName, organIcon }) {
  const [isLoading, setIsLoading] = useState(true);

  if (!sketchfabData || !sketchfabData.embedUrl) {
    return (
      <div className="sketchfab-empty-state">
        <span>⚠️ Objek 3D tidak tersedia.</span>
      </div>
    );
  }

  // Parameter Sketchfab ultra-bersih (tanpa info, tanpa kreator, tanpa watermark, tanpa UI tambahan)
  const embedParams = new URLSearchParams({
    autostart: "1",
    preload: "1",
    ui_theme: "dark",
    ui_infos: "0",
    ui_watermark: "0",
    ui_help: "0",
    ui_settings: "0",
    ui_inspector: "0",
    ui_annotations: "0",
    ui_hint: "0",
    ui_stop: "0",
    transparent: "0"
  }).toString();

  const embedSrc = `${sketchfabData.embedUrl}?${embedParams}`;

  return (
    <div className="sketchfab-viewer-container">
      {/* Loading Indicator */}
      {isLoading && (
        <div className="sketchfab-loading-overlay">
          <div className="sketchfab-spinner" />
          <div className="sketchfab-loading-text">
            <span>{organIcon || "🔬"} Menyiapkan Objek 3D {organName || ""}...</span>
            <small>Memuat struktur anatomi interaktif</small>
          </div>
        </div>
      )}

      {/* Iframe Pemutar 3D Layar Penuh */}
      <iframe
        title={organName || sketchfabData.title || "Model 3D Organ"}
        className="sketchfab-iframe"
        frameBorder="0"
        allowFullScreen
        mozallowfullscreen="true"
        webkitallowfullscreen="true"
        allow="autoplay; fullscreen; xr-spatial-tracking"
        xr-spatial-tracking="true"
        execution-while-out-of-viewport="true"
        execution-while-not-rendered="true"
        web-share="true"
        src={embedSrc}
        onLoad={() => setIsLoading(false)}
      />

      {/* Floating Interaction Tips Bersih */}
      <div className="sketchfab-floating-hint">
        <span>👆 Geser untuk Rotasi 360°</span>
        <span>•</span>
        <span>🔍 Scroll / Cubit untuk Zoom</span>
        <span>•</span>
        <span>🖱️ Klik Kanan / Dua Jari untuk Menggeser</span>
      </div>
    </div>
  );
}
