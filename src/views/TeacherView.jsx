import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useGameStore } from "../stores/useGameStore";
import SystemsThinkingRadarChart from "../components/SystemsThinkingRadarChart";
import NetworkStatusBadge from "../components/NetworkStatusBadge";
import { GameButton } from "../components/game-ui";
import { broadcastClassMessage, subscribeClassMessages, setSyncSessionCode } from "../services/realtimeSync";
import "./TeacherView.css";

export default function TeacherView() {
  const sessionCode = useGameStore((state) => state.sessionCode);
  const setSessionCode = useGameStore((state) => state.setSessionCode);
  const currentStage = useGameStore((state) => state.currentStage);
  const setStage = useGameStore((state) => state.setStage);
  const isOfflineMode = useGameStore((state) => state.isOfflineMode);
  const toggleOfflineMode = useGameStore((state) => state.toggleOfflineMode);

  // Autentikasi PIN Guru (Ibu Endang / Peneliti)
  const [pinInput, setPinInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState(false);

  // Notifikasi & feedback sinkronisasi real-time
  const [stageFeedback, setStageFeedback] = useState("");
  const [lastUpdatedGroup, setLastUpdatedGroup] = useState(null);

  // Data Rekap Nilai Kelompok Penelitian Kelas 8-A (Dilengkapi 4 Indikator Berpikir Sistemik)
  const [teamsRecords, setTeamsRecords] = useState([
    {
      groupNumber: 1, groupName: "Kelompok Nefron", leader: "Ahmad", pretest: 40, posttest: 80,
      preIndicators: { komponen: 50, keterhubungan: 33, regulasi: 50, prediksi: 33 },
      postIndicators: { komponen: 100, keterhubungan: 67, regulasi: 100, prediksi: 67 }
    },
    {
      groupNumber: 2, groupName: "Kelompok Glomerulus", leader: "Budi", pretest: 30, posttest: 70,
      preIndicators: { komponen: 50, keterhubungan: 33, regulasi: 0, prediksi: 33 },
      postIndicators: { komponen: 100, keterhubungan: 67, regulasi: 50, prediksi: 67 }
    },
    {
      groupNumber: 3, groupName: "Kelompok Alveolus", leader: "Citra", pretest: 50, posttest: 90,
      preIndicators: { komponen: 50, keterhubungan: 67, regulasi: 50, prediksi: 33 },
      postIndicators: { komponen: 100, keterhubungan: 100, regulasi: 100, prediksi: 67 }
    },
    {
      groupNumber: 4, groupName: "Kelompok Hepar", leader: "Dimas", pretest: 30, posttest: 60,
      preIndicators: { komponen: 0, keterhubungan: 33, regulasi: 50, prediksi: 33 },
      postIndicators: { komponen: 50, keterhubungan: 67, regulasi: 50, prediksi: 67 }
    },
    {
      groupNumber: 5, groupName: "Kelompok Integumen", leader: "Eka", pretest: 40, posttest: 70,
      preIndicators: { komponen: 50, keterhubungan: 33, regulasi: 50, prediksi: 33 },
      postIndicators: { komponen: 100, keterhubungan: 67, regulasi: 50, prediksi: 67 }
    },
    {
      groupNumber: 6, groupName: "Kelompok Homeostasis", leader: "Fajar", pretest: 50, posttest: 80,
      preIndicators: { komponen: 50, keterhubungan: 67, regulasi: 50, prediksi: 33 },
      postIndicators: { komponen: 100, keterhubungan: 67, regulasi: 100, prediksi: 67 }
    },
    {
      groupNumber: 7, groupName: "Kelompok Reabsorpsi", leader: "Gita", pretest: 30, posttest: 70,
      preIndicators: { komponen: 50, keterhubungan: 0, regulasi: 50, prediksi: 33 },
      postIndicators: { komponen: 100, keterhubungan: 67, regulasi: 50, prediksi: 67 }
    },
    {
      groupNumber: 8, groupName: "Kelompok Augmentasi", leader: "Hadi", pretest: 40, posttest: 90,
      preIndicators: { komponen: 50, keterhubungan: 33, regulasi: 50, prediksi: 33 },
      postIndicators: { komponen: 100, keterhubungan: 100, regulasi: 100, prediksi: 67 }
    },
  ]);

  // Pastikan scrolling aktif di body & root saat berada di halaman guru
  useEffect(() => {
    document.body.classList.add("page-scrollable");
    return () => {
      document.body.classList.remove("page-scrollable");
    };
  }, []);

  // Listener sinkronisasi real-time antar-perangkat (StudentView ➔ TeacherView)
  useEffect(() => {
    setSyncSessionCode(sessionCode);
    const unsubscribe = subscribeClassMessages((msg) => {
      if (msg.type === "TEAM_PROGRESS_UPDATE" && msg.payload) {
        const payload = msg.payload;

        // Picu animasi sorotan baris kelompok yang baru update
        if (payload.groupNumber) {
          setLastUpdatedGroup(payload.groupNumber);
          setTimeout(() => setLastUpdatedGroup(null), 3500);
        }

        setTeamsRecords((prev) => {
          const index = prev.findIndex((t) => t.groupNumber === payload.groupNumber);
          if (index >= 0) {
            const updated = [...prev];
            updated[index] = {
              ...updated[index],
              groupName: payload.groupName || updated[index].groupName,
              leader: payload.leader || updated[index].leader,
              pretest: payload.pretest !== null && payload.pretest !== undefined ? payload.pretest : updated[index].pretest,
              posttest: payload.posttest !== null && payload.posttest !== undefined ? payload.posttest : updated[index].posttest,
              preIndicators: payload.preIndicators || updated[index].preIndicators,
              postIndicators: payload.postIndicators || updated[index].postIndicators,
              lkpdDone: payload.lkpdDone !== undefined ? payload.lkpdDone : updated[index].lkpdDone
            };
            return updated;
          } else {
            return [
              ...prev,
              {
                groupNumber: payload.groupNumber,
                groupName: payload.groupName || `Kelompok ${payload.groupNumber}`,
                leader: payload.leader || "Murid",
                pretest: payload.pretest || 0,
                posttest: payload.posttest || 0,
                preIndicators: payload.preIndicators || { komponen: 0, keterhubungan: 0, regulasi: 0, prediksi: 0 },
                postIndicators: payload.postIndicators || { komponen: 0, keterhubungan: 0, regulasi: 0, prediksi: 0 },
                lkpdDone: payload.lkpdDone || false
              }
            ];
          }
        });
      }
    });
    return unsubscribe;
  }, [sessionCode]);

  // Handler pengalihan tahap kelas otomatis ke seluruh layar IFP & tablet
  const handleStageSwitch = (newStage) => {
    setStage(newStage);
    broadcastClassMessage("STAGE_CHANGE", {
      stage: newStage,
      sessionCode,
      timestamp: Date.now()
    });
    const stageNames = {
      pretest: "Tahap 1: Pre-test Siswa (10 Soal HOTS)",
      gameplay: "Tahap 2: Gameplay Arena IFP & LKPD Inkuiri Digital",
      posttest: "Tahap 3: Post-test Evaluasi Akhir",
      closed: "Tahap 4: Rekap Nilai N-Gain & Profil Berpikir Sistemik"
    };
    setStageFeedback(`📢 Tahapan seluruh kelas berhasil dialihkan ke: ${stageNames[newStage] || newStage}`);
    setTimeout(() => setStageFeedback(""), 5000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput === "123456") {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // Hitung N-Gain Hake (1998)
  const calculateGain = (pre, post) => {
    if (100 - pre <= 0) return { gain: 1.0, category: "Tinggi" };
    const g = Number(((post - pre) / (100 - pre)).toFixed(2));
    let cat = "Rendah";
    if (g >= 0.7) cat = "Tinggi";
    else if (g >= 0.3) cat = "Sedang";
    return { gain: g, category: cat };
  };

  // 1-Klik Ekspor ke File Excel (.xlsx) Siap Olah SPSS Lengkap 4 Indikator
  const handleExportExcel = () => {
    const exportData = teamsRecords.map((t, idx) => {
      const { gain, category } = calculateGain(t.pretest, t.posttest);
      const preInd = t.preIndicators || { komponen: t.pretest, keterhubungan: t.pretest, regulasi: t.pretest, prediksi: t.pretest };
      const postInd = t.postIndicators || { komponen: t.posttest, keterhubungan: t.posttest, regulasi: t.posttest, prediksi: t.posttest };

      return {
        No: idx + 1,
        "Nomor Kelompok": `Kelompok ${t.groupNumber}`,
        "Nama Kelompok": t.groupName,
        "Ketua Kelompok": t.leader,
        "Skor Pre-test Total": t.pretest,
        "Skor Post-test Total": t.posttest,
        "Skor N-Gain Total (g)": gain,
        "Kategori Efektivitas": category,
        "Pre - Komponen (%)": preInd.komponen,
        "Post - Komponen (%)": postInd.komponen,
        "Gain - Komponen": calculateGain(preInd.komponen, postInd.komponen).gain,
        "Pre - Keterhubungan (%)": preInd.keterhubungan,
        "Post - Keterhubungan (%)": postInd.keterhubungan,
        "Gain - Keterhubungan": calculateGain(preInd.keterhubungan, postInd.keterhubungan).gain,
        "Pre - Regulasi (%)": preInd.regulasi,
        "Post - Regulasi (%)": postInd.regulasi,
        "Gain - Regulasi": calculateGain(preInd.regulasi, postInd.regulasi).gain,
        "Pre - Prediksi (%)": preInd.prediksi,
        "Post - Prediksi (%)": postInd.prediksi,
        "Gain - Prediksi": calculateGain(preInd.prediksi, postInd.prediksi).gain,
      };
    });

    // Baris Rata-rata Kelas
    exportData.push({
      No: "-",
      "Nomor Kelompok": "RATA-RATA KELAS",
      "Nama Kelompok": `Kelas (${sessionCode})`,
      "Ketua Kelompok": "Seluruh Siswa",
      "Skor Pre-test Total": avgPre,
      "Skor Post-test Total": avgPost,
      "Skor N-Gain Total (g)": classGain.gain,
      "Kategori Efektivitas": classGain.category,
      "Pre - Komponen (%)": classIndicators.pre.komponen,
      "Post - Komponen (%)": classIndicators.post.komponen,
      "Gain - Komponen": calculateGain(classIndicators.pre.komponen, classIndicators.post.komponen).gain,
      "Pre - Keterhubungan (%)": classIndicators.pre.keterhubungan,
      "Post - Keterhubungan (%)": classIndicators.post.keterhubungan,
      "Gain - Keterhubungan": calculateGain(classIndicators.pre.keterhubungan, classIndicators.post.keterhubungan).gain,
      "Pre - Regulasi (%)": classIndicators.pre.regulasi,
      "Post - Regulasi (%)": classIndicators.post.regulasi,
      "Gain - Regulasi": calculateGain(classIndicators.pre.regulasi, classIndicators.post.regulasi).gain,
      "Pre - Prediksi (%)": classIndicators.pre.prediksi,
      "Post - Prediksi (%)": classIndicators.post.prediksi,
      "Gain - Prediksi": calculateGain(classIndicators.pre.prediksi, classIndicators.post.prediksi).gain,
    });

    // Buat worksheet dan workbook
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Rekap_N-Gain_SPSS");

    // Simpan file
    XLSX.writeFile(wb, `Rekap_Nilai_NGain_${sessionCode}_SMPN25_Lengkap.xlsx`);
  };

  // Hitung rata-rata kelas
  const avgPre = Math.round(teamsRecords.reduce((acc, r) => acc + r.pretest, 0) / teamsRecords.length);
  const avgPost = Math.round(teamsRecords.reduce((acc, r) => acc + r.posttest, 0) / teamsRecords.length);
  const classGain = calculateGain(avgPre, avgPost);

  // Rata-rata 4 Indikator Berpikir Sistemik Kelas
  const classIndicators = {
    pre: {
      komponen: Math.round(teamsRecords.reduce((acc, r) => acc + (r.preIndicators?.komponen ?? r.pretest), 0) / teamsRecords.length),
      keterhubungan: Math.round(teamsRecords.reduce((acc, r) => acc + (r.preIndicators?.keterhubungan ?? r.pretest), 0) / teamsRecords.length),
      regulasi: Math.round(teamsRecords.reduce((acc, r) => acc + (r.preIndicators?.regulasi ?? r.pretest), 0) / teamsRecords.length),
      prediksi: Math.round(teamsRecords.reduce((acc, r) => acc + (r.preIndicators?.prediksi ?? r.pretest), 0) / teamsRecords.length),
    },
    post: {
      komponen: Math.round(teamsRecords.reduce((acc, r) => acc + (r.postIndicators?.komponen ?? r.posttest), 0) / teamsRecords.length),
      keterhubungan: Math.round(teamsRecords.reduce((acc, r) => acc + (r.postIndicators?.keterhubungan ?? r.posttest), 0) / teamsRecords.length),
      regulasi: Math.round(teamsRecords.reduce((acc, r) => acc + (r.postIndicators?.regulasi ?? r.posttest), 0) / teamsRecords.length),
      prediksi: Math.round(teamsRecords.reduce((acc, r) => acc + (r.postIndicators?.prediksi ?? r.posttest), 0) / teamsRecords.length),
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="teacher-viewport" style={{ alignItems: "center" }}>
        <div className="teacher-card" style={{ maxWidth: "420px", width: "100%", textAlign: "center" }}>
          <span style={{ fontSize: "2.5rem" }}>🔐</span>
          <h2 style={{ fontFamily: "var(--font-display)", margin: "10px 0 6px" }}>
            Dasbor Guru & Peneliti
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "20px" }}>
            Masukkan PIN Pengajar untuk membuka konsol kendali pembelajaran kelas.
          </p>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input
              type="password"
              maxLength="6"
              placeholder="PIN Otorisasi (Default: 123456)"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              style={{
                padding: "12px",
                fontSize: "1.2rem",
                textAlign: "center",
                letterSpacing: "4px",
                borderRadius: "12px",
                border: "none",
                outline: "none",
                background: "#F1F5F9"
              }}
            />
            {pinError && (
              <div style={{ color: "var(--color-accent-red)", fontSize: "0.85rem", fontWeight: 700 }}>
                PIN salah! Silakan masukkan 123456.
              </div>
            )}
            <GameButton type="submit" variant="green" shape="rect" size="md" sound="confirm" style={{ width: "100%" }}>
              Masuk Konsol Guru
            </GameButton>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-viewport">
      <div className="teacher-container">
        {/* Header Dasbor */}
        <header className="teacher-card teacher-header">
          <div>
            <span className="teacher-role-badge">
              🧑‍🏫 Command Center Guru • SMPN 25 Malang
            </span>
            <h1 className="teacher-title">
              Kendali Kelas: <span className="teacher-session-tag">{sessionCode}</span>
              <span style={{ fontSize: "1.05rem", fontWeight: 600, color: "#64748B" }}>Kelas VIII-A IPA</span>
            </h1>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <NetworkStatusBadge role="teacher" />
            <button
              onClick={() => setIsAuthenticated(false)}
              className="teacher-btn-logout"
              title="Keluar dari Konsol Guru"
            >
              <span>🚪</span>
              <span>Keluar</span>
            </button>
          </div>
        </header>

        {/* 1. Pengendali Tahapan Pembelajaran (Stage Switcher) */}
        <section className="teacher-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
            <div>
              <h3 style={{ fontFamily: "var(--font-display)", color: "#0F172A", margin: "0 0 4px", fontSize: "1.15rem", fontWeight: 800 }}>
                🎛️ Kendali Tahap Pembelajaran
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#64748B", margin: 0 }}>
                Sinkronisasi otomatis ke layar IFP Arcade & seluruh tablet kelompok siswa
              </p>
            </div>
            <span style={{
              fontSize: "0.78rem",
              fontWeight: 700,
              color: "#0369A1",
              background: "rgba(3, 105, 161, 0.08)",
              padding: "4px 12px",
              borderRadius: "999px"
            }}>
              ● Real-time Live Sync
            </span>
          </div>

          <div className="stage-control-track">
            <button
              onClick={() => handleStageSwitch("pretest")}
              className={`stage-button ${currentStage === "pretest" ? "active" : ""}`}
            >
              <span className="stage-step-badge">1</span>
              <span>Pre-test Siswa</span>
            </button>
            <button
              onClick={() => handleStageSwitch("gameplay")}
              className={`stage-button ${currentStage === "gameplay" ? "active" : ""}`}
            >
              <span className="stage-step-badge">2</span>
              <span>Gameplay IFP & LKPD</span>
            </button>
            <button
              onClick={() => handleStageSwitch("posttest")}
              className={`stage-button ${currentStage === "posttest" ? "active" : ""}`}
            >
              <span className="stage-step-badge">3</span>
              <span>Post-test Evaluasi</span>
            </button>
            <button
              onClick={() => handleStageSwitch("closed")}
              className={`stage-button ${currentStage === "closed" ? "active" : ""}`}
            >
              <span className="stage-step-badge">4</span>
              <span>Rekap & Selesai</span>
            </button>
          </div>

          {stageFeedback && (
            <div className="stage-feedback-banner">
              <span>📢</span>
              <span>{stageFeedback}</span>
            </div>
          )}
        </section>

        {/* 2. Kartu Rangkuman Nilai & Uji N-Gain Kelas */}
        <section className="metric-cards-grid">
          <div className="teacher-metric-card">
            <div className="metric-card-header">
              <span>📝</span>
              <span>Rata-rata Pre-test Kelas</span>
            </div>
            <div className="metric-card-val" style={{ color: "#0369A1" }}>
              {avgPre}
            </div>
            <div className="metric-card-pill" style={{ background: "rgba(3, 105, 161, 0.08)", color: "#0369A1" }}>
              Skor Awal Kelas
            </div>
          </div>

          <div className="teacher-metric-card">
            <div className="metric-card-header">
              <span>🎯</span>
              <span>Rata-rata Post-test Kelas</span>
            </div>
            <div className="metric-card-val" style={{ color: "#059669" }}>
              {avgPost}
            </div>
            <div className="metric-card-pill" style={{ background: "rgba(16, 185, 129, 0.1)", color: "#059669" }}>
              +{Math.max(0, avgPost - avgPre)} Poin Peningkatan
            </div>
          </div>

          <div className="teacher-metric-card">
            <div className="metric-card-header">
              <span>📈</span>
              <span>Gain Ternormalisasi Rata-rata (⟨g⟩)</span>
            </div>
            <div className="metric-card-val" style={{ color: "#059669" }}>
              {classGain.gain}
            </div>
            <div className="metric-card-pill" style={{
              background: classGain.category === "Tinggi" ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.12)",
              color: classGain.category === "Tinggi" ? "#059669" : "#D97706"
            }}>
              Efektivitas: {classGain.category}
            </div>
          </div>
        </section>

        {/* 3. Profil Berpikir Sistemik Rata-rata Kelas (Radar Chart) */}
        <section className="teacher-card" style={{ padding: "28px" }}>
          <SystemsThinkingRadarChart
            pretestScores={classIndicators.pre}
            posttestScores={classIndicators.post}
            title={`Profil Berpikir Sistemik Rata-rata Kelas (${sessionCode})`}
            subtitle="Agregasi Capaian 4 Indikator Seluruh Kelompok Siswa SMPN 25 Malang (Pre-test vs Post-test)"
            showLegend={true}
            showDetails={true}
          />
        </section>

        {/* 4. Tabel Monitoring Progres Kelompok & Tombol Ekspor Excel */}
        <section className="teacher-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h3 style={{ fontFamily: "var(--font-display)", color: "#0F172A", margin: "0 0 4px", fontSize: "1.2rem", fontWeight: 800 }}>
                📊 Data Capaian Berpikir Sistemik Kelompok Siswa
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#64748B", margin: 0 }}>
                Data gain ternormalisasi siap diolah pada Bab IV Skripsi (Uji Paired t-Test di SPSS).
              </p>
            </div>
            <button
              onClick={handleExportExcel}
              className="teacher-btn-excel"
              title="Unduh data capaian dalam format Excel .xlsx"
            >
              <span>📊</span>
              <span>Ekspor 1-Klik ke Excel (.xlsx)</span>
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="teacher-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Kelompok</th>
                  <th>Ketua</th>
                  <th>Pre-test</th>
                  <th>Post-test</th>
                  <th>N-Gain (⟨g⟩)</th>
                  <th>Kategori</th>
                </tr>
              </thead>
              <tbody>
                {teamsRecords.map((t, idx) => {
                  const { gain, category } = calculateGain(t.pretest, t.posttest);
                  const isRecentlyUpdated = lastUpdatedGroup === t.groupNumber;
                  return (
                    <tr
                      key={t.groupNumber}
                      style={{
                        background: isRecentlyUpdated ? "rgba(16, 185, 129, 0.12)" : undefined
                      }}
                    >
                      <td style={{ fontWeight: 600, color: "#64748B" }}>{idx + 1}</td>
                      <td style={{ fontWeight: 700 }}>
                        {t.groupName}
                        {isRecentlyUpdated && (
                          <span
                            style={{
                              marginLeft: "8px",
                              background: "#059669",
                              color: "#FFF",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              padding: "2px 8px",
                              borderRadius: "999px"
                            }}
                          >
                            ✨ Live!
                          </span>
                        )}
                      </td>
                      <td style={{ color: "#475569" }}>{t.leader}</td>
                      <td style={{ color: "#0369A1", fontWeight: 700 }}>{t.pretest}</td>
                      <td style={{ color: "#059669", fontWeight: 700 }}>{t.posttest}</td>
                      <td style={{ fontWeight: 800 }}>{gain}</td>
                      <td>
                        <span className={`status-pill status-pill--${category.toLowerCase()}`}>
                          {category}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
