import React from "react";
import { SYSTEMS_THINKING_INDICATORS, calculateIndicatorGain } from "../data/quizQuestions";

/**
 * SystemsThinkingRadarChart
 * Grafik Jaring Laba-Laba (Spider / Radar Chart) Poligon 4 Sumbu
 * Mengukur 4 Indikator Berpikir Sistemik (Systems Thinking) SMP Kurikulum Merdeka
 *
 * @param {Object} props
 * @param {Object} props.pretestScores - Skor Pre-test { komponen, keterhubungan, regulasi, prediksi }
 * @param {Object} [props.posttestScores] - Skor Post-test { komponen, keterhubungan, regulasi, prediksi }
 * @param {string} [props.title] - Judul grafik
 * @param {string} [props.subtitle] - Deskripsi singkat
 * @param {boolean} [props.showLegend=true] - Tampilkan legenda Pre vs Post
 * @param {boolean} [props.showDetails=true] - Tampilkan kartu rincian per indikator
 * @param {boolean} [props.isDarkTheme=false] - Mode gelap untuk arena/modal
 */
export default function SystemsThinkingRadarChart({
  pretestScores = { komponen: 0, keterhubungan: 0, regulasi: 0, prediksi: 0 },
  posttestScores = null,
  title = "Profil 4 Indikator Berpikir Sistemik (Systems Thinking)",
  subtitle = "Analisis Capaian Kemampuan Bernalar Ilmiah & Pemahaman Sistem Tubuh Terintegrasi",
  showLegend = true,
  showDetails = true,
  isDarkTheme = false
}) {
  // Dimensi SVG
  const width = 460;
  const height = 400;
  const cx = width / 2;
  const cy = height / 2 - 10;
  const radius = 120;

  // 4 Sudut Aksis (Top, Right, Bottom, Left)
  const angles = [
    -Math.PI / 2, // 0: Top (Komponen)
    0,            // 1: Right (Keterhubungan)
    Math.PI / 2,  // 2: Bottom (Regulasi)
    Math.PI       // 3: Left (Prediksi)
  ];

  // Tingkat Cincin Konsentris Grid
  const levels = [0.25, 0.50, 0.75, 1.00];

  // Helper konversi nilai polar ke kartesius
  const getCoordinates = (valueRatio, angleIndex) => {
    const angle = angles[angleIndex];
    const r = radius * Math.max(0, Math.min(1, valueRatio));
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle)
    };
  };

  // Helper poligon SVG dari array titik
  const buildPolygonPoints = (scoresObj) => {
    if (!scoresObj) return "";
    return SYSTEMS_THINKING_INDICATORS.map((ind, idx) => {
      const val = (scoresObj[ind.key] ?? 0) / 100;
      const pt = getCoordinates(val, idx);
      return `${pt.x},${pt.y}`;
    }).join(" ");
  };

  const prePoints = buildPolygonPoints(pretestScores);
  const postPoints = posttestScores ? buildPolygonPoints(posttestScores) : null;

  // Warna tema
  const textColor = isDarkTheme ? "#F1F5F9" : "#1E293B";
  const textMuted = isDarkTheme ? "#94A3B8" : "#64748B";
  const gridStroke = isDarkTheme ? "rgba(255, 255, 255, 0.15)" : "#CBD5E1";
  const cardBg = isDarkTheme ? "rgba(15, 23, 42, 0.7)" : "#F8FAFC";
  const cardBorder = isDarkTheme ? "rgba(255, 255, 255, 0.12)" : "#E2E8F0";

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Header Grafik */}
      <div style={{ textAlign: "center" }}>
        <h3 style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.2rem",
          color: textColor,
          margin: "0 0 4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px"
        }}>
          <span>🕸️</span>
          <span>{title}</span>
        </h3>
        {subtitle && (
          <p style={{ color: textMuted, fontSize: "0.85rem", margin: 0 }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Legenda Komparasi */}
      {showLegend && (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "24px",
          fontSize: "0.85rem",
          fontWeight: 700
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{
              display: "inline-block",
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#0284C7"
            }} />
            <span style={{ color: "#0284C7" }}>Pre-test (Awal)</span>
          </div>

          {posttestScores && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "#16A34A"
              }} />
              <span style={{ color: "#16A34A" }}>Post-test (Setelah Game METABODY)</span>
            </div>
          )}
        </div>
      )}

      {/* Kontainer SVG Radar Canvas */}
      <div style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: "100%", maxWidth: "460px", height: "auto", overflow: "visible" }}
        >
          <defs>
            {/* Gradien Area Pre-test */}
            <radialGradient id="preGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(56, 189, 248, 0.45)" />
              <stop offset="100%" stopColor="rgba(2, 132, 199, 0.15)" />
            </radialGradient>

            {/* Gradien Area Post-test */}
            <radialGradient id="postGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(34, 197, 94, 0.6)" />
              <stop offset="100%" stopColor="rgba(22, 163, 74, 0.2)" />
            </radialGradient>

            {/* Filter Bayangan */}
            <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Cincin Konsentris Poligon Grid (25%, 50%, 75%, 100%) */}
          {levels.map((lvl) => {
            const pts = angles.map((ang) => {
              const r = radius * lvl;
              return `${cx + r * Math.cos(ang)},${cy + r * Math.sin(ang)}`;
            }).join(" ");

            return (
              <g key={lvl}>
                <polygon
                  points={pts}
                  fill={lvl === 1.0 ? (isDarkTheme ? "rgba(30, 41, 59, 0.4)" : "rgba(241, 245, 249, 0.6)") : "none"}
                  stroke={gridStroke}
                  strokeWidth={lvl === 1.0 ? "1.8" : "1"}
                  strokeDasharray={lvl === 1.0 ? "none" : "3 3"}
                />
                {/* Nilai Persentase Cincin */}
                <text
                  x={cx + 6}
                  y={cy - radius * lvl + 4}
                  fill={textMuted}
                  fontSize="9"
                  fontFamily="sans-serif"
                  fontWeight="600"
                >
                  {lvl * 100}%
                </text>
              </g>
            );
          })}

          {/* Garis Sumbu Aksis */}
          {angles.map((ang, idx) => {
            const outerX = cx + radius * Math.cos(ang);
            const outerY = cy + radius * Math.sin(ang);
            return (
              <line
                key={idx}
                x1={cx}
                y1={cy}
                x2={outerX}
                y2={outerY}
                stroke={gridStroke}
                strokeWidth="1.5"
              />
            );
          })}

          {/* Area Data Poligon Pre-test */}
          {prePoints && (
            <polygon
              points={prePoints}
              fill="url(#preGradient)"
              stroke="#0284C7"
              strokeWidth="2.5"
              strokeDasharray="5 3"
              filter="url(#radarGlow)"
              style={{ transition: "all 0.5s ease" }}
            />
          )}

          {/* Area Data Poligon Post-test */}
          {postPoints && (
            <polygon
              points={postPoints}
              fill="url(#postGradient)"
              stroke="#16A34A"
              strokeWidth="3"
              filter="url(#radarGlow)"
              style={{ transition: "all 0.5s ease" }}
            />
          )}

          {/* Titik Data Pre-test Vertex */}
          {SYSTEMS_THINKING_INDICATORS.map((ind, idx) => {
            const val = (pretestScores[ind.key] ?? 0) / 100;
            const pt = getCoordinates(val, idx);
            return (
              <circle
                key={`pre-${idx}`}
                cx={pt.x}
                cy={pt.y}
                r="4.5"
                fill="#0284C7"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            );
          })}

          {/* Titik Data Post-test Vertex */}
          {posttestScores && SYSTEMS_THINKING_INDICATORS.map((ind, idx) => {
            const val = (posttestScores[ind.key] ?? 0) / 100;
            const pt = getCoordinates(val, idx);
            return (
              <circle
                key={`post-${idx}`}
                cx={pt.x}
                cy={pt.y}
                r="5.5"
                fill="#16A34A"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            );
          })}

          {/* Label Sumbu Luar */}
          {SYSTEMS_THINKING_INDICATORS.map((ind, idx) => {
            const ang = angles[idx];
            // Posisi label di luar lingkaran
            const offset = 34;
            const labelX = cx + (radius + offset) * Math.cos(ang);
            const labelY = cy + (radius + offset) * Math.sin(ang);

            let textAnchor = "middle";
            let dy = "0.35em";
            if (idx === 0) { // Top
              textAnchor = "middle";
              dy = "-0.6em";
            } else if (idx === 1) { // Right
              textAnchor = "start";
              dy = "0.35em";
            } else if (idx === 2) { // Bottom
              textAnchor = "middle";
              dy = "1.2em";
            } else if (idx === 3) { // Left
              textAnchor = "end";
              dy = "0.35em";
            }

            const preVal = pretestScores[ind.key] ?? 0;
            const postVal = posttestScores ? posttestScores[ind.key] ?? 0 : null;

            return (
              <g key={ind.key} transform={`translate(${labelX}, ${labelY})`}>
                <text
                  textAnchor={textAnchor}
                  dy={dy}
                  fill={textColor}
                  fontSize="11"
                  fontWeight="700"
                  fontFamily="var(--font-display, sans-serif)"
                >
                  {ind.icon} {ind.shortLabel}
                </text>
                <text
                  textAnchor={textAnchor}
                  dy={idx === 0 ? "-1.9em" : idx === 2 ? "2.4em" : "1.6em"}
                  fill={postVal !== null ? "#16A34A" : "#0284C7"}
                  fontSize="10"
                  fontWeight="800"
                >
                  {postVal !== null ? `Pre: ${preVal}% ➔ Post: ${postVal}%` : `Skor: ${preVal}%`}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Kartu Rincian 4 Indikator Berpikir Sistemik */}
      {showDetails && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "12px",
          marginTop: "8px"
        }}>
          {SYSTEMS_THINKING_INDICATORS.map((ind) => {
            const preVal = pretestScores[ind.key] ?? 0;
            const postVal = posttestScores ? posttestScores[ind.key] ?? 0 : null;
            const gainObj = postVal !== null ? calculateIndicatorGain(preVal, postVal) : null;
            const delta = postVal !== null ? postVal - preVal : 0;

            return (
              <div
                key={ind.key}
                style={{
                  background: cardBg,
                  border: "none",
                  outline: "none",
                  boxShadow: isDarkTheme ? "0 8px 24px rgba(0,0,0,0.35)" : "0 4px 14px rgba(15, 23, 42, 0.08)",
                  borderRadius: "12px",
                  padding: "12px 14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "1.1rem" }}>{ind.icon}</span>
                    <strong style={{ fontSize: "0.85rem", color: textColor }}>
                      {ind.label}
                    </strong>
                  </div>

                  {gainObj && (
                    <span style={{
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      padding: "2px 8px",
                      borderRadius: "999px",
                      background: delta >= 0 ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                      color: delta >= 0 ? "#16A34A" : "#DC2626"
                    }}>
                      {delta >= 0 ? `+${delta}% (g: ${gainObj.gain})` : `${delta}%`}
                    </span>
                  )}
                </div>

                <p style={{ fontSize: "0.76rem", color: textMuted, margin: "0", lineHeight: "1.35" }}>
                  {ind.description}
                </p>

                {/* Progress Bar Pre vs Post */}
                <div style={{ marginTop: "4px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.74rem", fontWeight: 700, marginBottom: "2px" }}>
                    <span style={{ color: "#0284C7" }}>Pre: {preVal}%</span>
                    {postVal !== null && <span style={{ color: "#16A34A" }}>Post: {postVal}%</span>}
                  </div>

                  <div style={{
                    width: "100%",
                    height: "8px",
                    background: isDarkTheme ? "rgba(255, 255, 255, 0.1)" : "#E2E8F0",
                    borderRadius: "4px",
                    overflow: "hidden",
                    position: "relative"
                  }}>
                    {/* Bar Pre-test */}
                    <div style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      height: "100%",
                      width: `${preVal}%`,
                      background: "#38BDF8",
                      opacity: 0.6,
                      borderRadius: "4px"
                    }} />
                    {/* Bar Post-test */}
                    {postVal !== null && (
                      <div style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        height: "100%",
                        width: `${postVal}%`,
                        background: "#22C55E",
                        borderRadius: "4px",
                        boxShadow: "0 0 8px rgba(34, 197, 94, 0.6)"
                      }} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
