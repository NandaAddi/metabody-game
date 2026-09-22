import React, { useState, useEffect } from "react";
import { useGameStore } from "../stores/useGameStore";
import { PRETEST_QUESTIONS, POSTTEST_QUESTIONS, calculateIndicatorScores } from "../data/quizQuestions";
import SystemsThinkingRadarChart from "../components/SystemsThinkingRadarChart";
import NetworkStatusBadge from "../components/NetworkStatusBadge";
import { GameButton } from "../components/game-ui";
import { LocalStorageService } from "../services/storageFallback";
import { broadcastClassMessage, subscribeClassMessages, setSyncSessionCode } from "../services/realtimeSync";
import "./StudentView.css";

export default function StudentView() {
  const telemetry = useGameStore((state) => state.telemetry);
  const homeostasisIndex = useGameStore((state) => state.homeostasisIndex);

  // Tab navigasi di tablet siswa
  const [activeTab, setActiveTab] = useState("registrasi");

  // Data Pendaftaran Kelompok
  const [teamData, setTeamData] = useState({
    sessionCode: "META-8A",
    groupNumber: 1,
    groupName: "Kelompok Nefron Hebat",
    leaderName: "Ahmad",
    observerName: "Budi",
    recorderName: "Citra",
    pilotName: "Dimas",
    presenterName: "Eka"
  });
  const [isRegistered, setIsRegistered] = useState(false);

  // Jawaban & Skor Pre-test
  const [pretestAnswers, setPretestAnswers] = useState({});
  const [pretestScore, setPretestScore] = useState(null);

  // Telemetri real-time yang diterima dari layar IFP & notifikasi sinkronisasi
  const [incomingTelemetry, setIncomingTelemetry] = useState(null);
  const [telemetryAlert, setTelemetryAlert] = useState("");
  const [teacherStageNotice, setTeacherStageNotice] = useState("");

  // Data LKPD Digital
  const [lkpdData, setLkpdData] = useState({
    tableSantai: { pulse: 75, temp: 37.0, sweat: 10, urineVol: 120, urineColor: "Kuning Muda Jernih" },
    tableLari: { pulse: "", temp: "", sweat: "", urineVol: "", urineColor: "" },
    q1: "",
    q2: "",
    q3: "",
    q4: ""
  });

  // Data Pencocokan 4 Organ & Zat Sisa (Tahap 4 LKPD Modul Ajar)
  const [organMatching, setOrganMatching] = useState({
    ginjal: "",
    kulit: "",
    paru: "",
    hati: ""
  });
  const [feedbackOrgan, setFeedbackOrgan] = useState(null);

  // Data Model 3 Tahap Pembentukan Urine (Tahap H LKPD Modul Ajar)
  const [urinePhases, setUrinePhases] = useState({
    p1: { phase: "", location: "", result: "" },
    p2: { phase: "", location: "", result: "" },
    p3: { phase: "", location: "", result: "" },
    finalFlow: ""
  });
  const [feedbackUrine, setFeedbackUrine] = useState(null);

  // Data Exit Ticket & Refleksi Diri (Tahap L Modul Ajar)
  const [exitTicket, setExitTicket] = useState({
    conceptUnderstood: "",
    convincingEvidence: "",
    confusingPart: "",
    healthyHabit: ""
  });

  // Jawaban & Skor Post-test
  const [posttestAnswers, setPosttestAnswers] = useState({});
  const [posttestScore, setPosttestScore] = useState(null);

  // Pastikan scrolling aktif di body & root saat berada di halaman kelompok
  useEffect(() => {
    document.body.classList.add("page-scrollable");
    return () => {
      document.body.classList.remove("page-scrollable");
    };
  }, []);

  // Muat data dari LocalStorage jika ada sesi tersimpan sebelumnya
  useEffect(() => {
    const saved = LocalStorageService.getSession(teamData.sessionCode);
    if (saved && saved.teamData) {
      setTeamData(saved.teamData);
      setIsRegistered(true);
      if (saved.pretestScore !== undefined) setPretestScore(saved.pretestScore);
      if (saved.pretestAnswers) setPretestAnswers(saved.pretestAnswers);
      if (saved.lkpdData) setLkpdData(saved.lkpdData);
      if (saved.organMatching) setOrganMatching(saved.organMatching);
      if (saved.urinePhases) setUrinePhases(saved.urinePhases);
      if (saved.exitTicket) setExitTicket(saved.exitTicket);
      if (saved.posttestScore !== undefined) setPosttestScore(saved.posttestScore);
      if (saved.posttestAnswers) setPosttestAnswers(saved.posttestAnswers);
    }
  }, []);

  // Listener sinkronisasi tahapan kelas & telemetri dari IFP/Guru
  useEffect(() => {
    setSyncSessionCode(teamData.sessionCode);

    const unsubscribe = subscribeClassMessages((msg) => {
      // 1. Sinkronisasi Perubahan Tahap Pembelajaran oleh Guru
      if (msg.type === "STAGE_CHANGE" && msg.payload) {
        const targetStage = msg.payload.stage;
        const stageMap = {
          pretest: { tab: "pretest", label: "Tahap 1: Tes Awal Pemahaman" },
          gameplay: { tab: "lkpd", label: "Tahap 2: Simulasi Game & Lembar Penyelidikan" },
          posttest: { tab: "posttest", label: "Tahap 3: Tes Akhir Pemahaman" },
          closed: { tab: "resume", label: "Tahap 4: Rangkuman Belajar Selesai" }
        };
        if (stageMap[targetStage]) {
          setTeacherStageNotice(`📢 Guru mengalihkan tahapan kelas ke: ${stageMap[targetStage].label}`);
          if (isRegistered) {
            setActiveTab(stageMap[targetStage].tab);
          }
          setTimeout(() => setTeacherStageNotice(""), 6500);
        }
      }

      // 2. Aliran Data Tubuh Si Meta Real-Time dari Layar Kelas
      if (msg.type === "MISSION_TELEMETRY" && msg.payload) {
        const t = msg.payload;
        setIncomingTelemetry(t);
        setTelemetryAlert(
          `📡 Data Tubuh Si Meta Diterima dari Layar Depan! (Jantung: ${t.heartRate} BPM, Suhu: ${t.coreTemp}°C, Keringat: ${t.sweatRate} mL/jam)`
        );

        // Otomatis update tabel data pengamatan LKPD
        setLkpdData((prev) => {
          const updated = {
            ...prev,
            tableLari: {
              pulse: t.heartRate || prev.tableLari.pulse || 128,
              temp: t.coreTemp || prev.tableLari.temp || 38.1,
              sweat: t.sweatRate || prev.tableLari.sweat || 65,
              urineVol: t.urineVolume || prev.tableLari.urineVol || 35,
              urineColor: t.urineColor || prev.tableLari.urineColor || "Kuning Pekat / Jingga Tua"
            }
          };
          LocalStorageService.saveSession(teamData.sessionCode, { lkpdData: updated });
          return updated;
        });

        setTimeout(() => setTelemetryAlert(""), 8000);
      }
    });

    return unsubscribe;
  }, [teamData.sessionCode, isRegistered]);

  // Simpan progres ke LocalStorage & broadcast secara berkala
  const persistProgress = (override = {}) => {
    const currentPayload = {
      teamData,
      pretestScore,
      pretestAnswers,
      lkpdData,
      organMatching,
      urinePhases,
      exitTicket,
      posttestScore,
      posttestAnswers,
      ...override
    };
    LocalStorageService.saveSession(teamData.sessionCode, currentPayload);
    LocalStorageService.saveTeamAnswers(teamData.sessionCode, teamData.groupNumber, currentPayload);
    broadcastClassMessage("TEAM_PROGRESS_UPDATE", {
      groupNumber: teamData.groupNumber,
      groupName: teamData.groupName,
      leader: teamData.leaderName,
      pretest: currentPayload.pretestScore !== undefined ? currentPayload.pretestScore : pretestScore,
      posttest: currentPayload.posttestScore !== undefined ? currentPayload.posttestScore : posttestScore,
      preIndicators: calculateIndicatorScores(currentPayload.pretestAnswers || pretestAnswers, PRETEST_QUESTIONS),
      postIndicators: currentPayload.posttestScore !== null && currentPayload.posttestScore !== undefined ? calculateIndicatorScores(currentPayload.posttestAnswers || posttestAnswers, POSTTEST_QUESTIONS) : null,
      lkpdDone: Boolean(lkpdData.q1 && organMatching.ginjal && urinePhases.p1.phase)
    });
  };

  // 1. Submit Registrasi
  const handleRegister = (e) => {
    e.preventDefault();
    setIsRegistered(true);
    setActiveTab("pretest");
    persistProgress({ teamData, isRegistered: true });
  };

  // 2. Submit Pre-test
  const handlePretestSubmit = () => {
    let correct = 0;
    PRETEST_QUESTIONS.forEach((q) => {
      if (pretestAnswers[q.id] === q.answer) {
        correct += 1;
      }
    });
    const score = (correct / PRETEST_QUESTIONS.length) * 100;
    setPretestScore(score);
    setActiveTab("lkpd");
    persistProgress({ pretestScore: score, pretestAnswers });
  };

  // 3. Salin Data Telemetri Langsung dari IFP
  const handleFetchTelemetry = () => {
    const source = incomingTelemetry || telemetry;
    const updated = {
      ...lkpdData,
      tableLari: {
        pulse: source.heartRate || 128,
        temp: source.coreTemp || 38.1,
        sweat: source.sweatRate || 65,
        urineVol: source.urineVolume || 35,
        urineColor: source.urineColor || (source.hydration < 60 ? "Kuning Pekat / Jingga Tua" : "Kuning Normal")
      }
    };
    setLkpdData(updated);
    persistProgress({ lkpdData: updated });
    setTelemetryAlert("✅ Data tubuh Si Meta dari layar kelas berhasil disalin!");
    setTimeout(() => setTelemetryAlert(""), 4000);
  };

  // 4. Validasi Formatif Organ & Zat Sisa
  const handleCheckOrganMatching = () => {
    const isGinjalCorrect = organMatching.ginjal === "Urine (Air, Urea, dan Garam Mineral)";
    const isKulitCorrect = organMatching.kulit === "Keringat (Air, Garam, dan Sedikit Urea)";
    const isParuCorrect = organMatching.paru === "Karbon Dioksida (CO2) dan Uap Air (H2O)";
    const isHatiCorrect = organMatching.hati === "Cairan Empedu & Hasil Perombakan Sel Darah Merah";

    const allCorrect = isGinjalCorrect && isKulitCorrect && isParuCorrect && isHatiCorrect;

    if (allCorrect) {
      setFeedbackOrgan({
        isCorrect: true,
        message: "🎉 Luar biasa! Seluruh pasangan organ ekskresi dan zat sisanya sudah 100% tepat!"
      });
    } else {
      setFeedbackOrgan({
        isCorrect: false,
        message: "💡 Coba periksa kembali! Ingat: paru-paru mengeluarkan CO2 & uap air, hati membuang empedu/urea, kulit mengeluarkan keringat, dan ginjal menyaring urine."
      });
    }
    persistProgress({ organMatching });
  };

  // 5. Validasi Formatif Model 3 Tahap Pembentukan Urine
  const handleCheckUrinePhases = () => {
    const p1Ok = urinePhases.p1.phase === "Filtrasi (Penyaringan)" &&
                 urinePhases.p1.location === "Glomerulus & Kapsula Bowman" &&
                 urinePhases.p1.result === "Urine Primer (Filtrat Glomerulus)";

    const p2Ok = urinePhases.p2.phase === "Reabsorpsi (Penyerapan Kembali)" &&
                 urinePhases.p2.location === "Tubulus Kontortus Proksimal & Lengkung Henle" &&
                 urinePhases.p2.result === "Urine Sekunder (Filtrat Tubulus)";

    const p3Ok = urinePhases.p3.phase === "Augmentasi (Pengeluaran Zat Sisa)" &&
                 urinePhases.p3.location === "Tubulus Kontortus Distal & Tubulus Kolektivus" &&
                 urinePhases.p3.result === "Urine Sesungguhnya (Air Seni Sejati)";

    const allOk = p1Ok && p2Ok && p3Ok;

    if (allOk) {
      setFeedbackUrine({
        isCorrect: true,
        message: "🏆 Sempurna! Skema alur Filtrasi ➔ Reabsorpsi ➔ Augmentasi beserta lokasi dan hasilnya sudah 100% akurat sesuai struktur nefron!"
      });
    } else {
      setFeedbackUrine({
        isCorrect: false,
        message: "💡 Cermati kembali urutan 3 tahap nefron! Tahap 1 penyaringan di glomerulus menghasilkan urine primer, tahap 2 penyerapan zat berguna di TKP menghasilkan urine sekunder, dan tahap 3 augmentasi di TKD menghasilkan urine sesungguhnya."
      });
    }
    persistProgress({ urinePhases });
  };

  // 6. Submit Post-test
  const handlePosttestSubmit = () => {
    let correct = 0;
    POSTTEST_QUESTIONS.forEach((q) => {
      if (posttestAnswers[q.id] === q.answer) {
        correct += 1;
      }
    });
    const score = (correct / POSTTEST_QUESTIONS.length) * 100;
    setPosttestScore(score);
    setActiveTab("resume");
    persistProgress({ posttestScore: score, posttestAnswers });
  };

  // Hitung N-Gain jika kedua tes selesai
  let nGain = null;
  let nGainCategory = "-";
  if (pretestScore !== null && posttestScore !== null) {
    if (100 - pretestScore <= 0) {
      nGain = 1.0;
    } else {
      nGain = ((posttestScore - pretestScore) / (100 - pretestScore)).toFixed(2);
    }
    if (nGain >= 0.7) nGainCategory = "Tinggi (Sangat Efektif)";
    else if (nGain >= 0.3) nGainCategory = "Sedang (Cukup Efektif)";
    else nGainCategory = "Rendah";
  }

  return (
    <div className="student-viewport">
      <div className="student-container">
        {/* Header Terminal Siswa */}
        <header className="student-header-card">
          <div className="student-header-top">
            <div className="student-header-title-wrap">
              <span
                className="badge-tag"
                style={{
                  background: "rgba(3, 105, 161, 0.12)",
                  color: "var(--color-primary-dark)",
                  border: "1px solid rgba(3, 105, 161, 0.25)",
                  alignSelf: "flex-start",
                  fontWeight: 700,
                  fontSize: "0.82rem"
                }}
              >
                📱 Ruang Belajar Kelompok
              </span>
              <h2 className="student-header-title">
                {isRegistered ? `${teamData.groupName} (Kelompok ${teamData.groupNumber})` : "Lembar Kerja Siswa Digital"}
              </h2>
            </div>
            {/* Lencana Sinyal & Status Terhubung */}
            <NetworkStatusBadge role="student" />
          </div>

          {/* Tab Navigation */}
          {isRegistered && (
            <div className="student-tab-bar">
              <button
                onClick={() => setActiveTab("pretest")}
                className={`student-tab-btn ${activeTab === "pretest" ? "active" : ""}`}
              >
                <span className="student-tab-step">1</span>
                <span>Pre-test {pretestScore !== null ? `(${pretestScore})` : ""}</span>
              </button>
              <button
                onClick={() => setActiveTab("lkpd")}
                className={`student-tab-btn ${activeTab === "lkpd" ? "active" : ""}`}
              >
                <span className="student-tab-step">2</span>
                <span>LKPD Inkuiri</span>
              </button>
              <button
                onClick={() => setActiveTab("posttest")}
                className={`student-tab-btn ${activeTab === "posttest" ? "active" : ""}`}
              >
                <span className="student-tab-step">3</span>
                <span>Post-test {posttestScore !== null ? `(${posttestScore})` : ""}</span>
              </button>
              <button
                onClick={() => setActiveTab("resume")}
                className={`student-tab-btn ${activeTab === "resume" ? "active" : ""}`}
              >
                <span className="student-tab-step">4</span>
                <span>Resume & N-Gain</span>
              </button>
            </div>
          )}
        </header>

        {/* Notifikasi Toast Sinkronisasi Kelas */}
        {teacherStageNotice && (
          <div className="sync-toast-banner sync-toast-stage">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.2rem" }}>🔔</span>
              <span>{teacherStageNotice}</span>
            </div>
            <button
              onClick={() => setTeacherStageNotice("")}
              aria-label="Tutup notifikasi"
              style={{ background: "none", border: "none", color: "#C7D2FE", cursor: "pointer", fontSize: "1rem", minWidth: "44px", minHeight: "44px", padding: "10px" }}
            >
              ✕
            </button>
          </div>
        )}

        {telemetryAlert && (
          <div className="sync-toast-banner sync-toast-telemetry">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.2rem" }}>📊</span>
              <span>{telemetryAlert}</span>
            </div>
            <button
              onClick={() => setTelemetryAlert("")}
              aria-label="Tutup notifikasi"
              style={{ background: "none", border: "none", color: "#A7F3D0", cursor: "pointer", fontSize: "1rem", minWidth: "44px", minHeight: "44px", padding: "10px" }}
            >
              ✕
            </button>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 1: REGISTRASI KELOMPOK (5 PERAN FORMAL MODUL AJAR)           */}
        {/* ================================================================ */}
        {!isRegistered && (
          <div className="student-card">
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--color-primary-dark)", marginBottom: "8px" }}>
              Pendaftaran Sesi Kelas & 5 Peran Kelompok
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "20px" }}>
              Bekerjasamalah dengan membagi peran tanggung jawab kepada setiap anggota kelompok.
            </p>

            <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="student-grid-3cols">
                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>Kode Sesi Kelas:</label>
                  <input
                    type="text"
                    required
                    value={teamData.sessionCode}
                    onChange={(e) => setTeamData({ ...teamData, sessionCode: e.target.value })}
                    className="student-input"
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>Nomor Kelompok:</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    required
                    value={teamData.groupNumber}
                    onChange={(e) => setTeamData({ ...teamData, groupNumber: Number(e.target.value) })}
                    className="student-input"
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>Nama Julukan Kelompok:</label>
                  <input
                    type="text"
                    required
                    value={teamData.groupName}
                    onChange={(e) => setTeamData({ ...teamData, groupName: e.target.value })}
                    className="student-input"
                  />
                </div>
              </div>

              <h4 style={{ fontFamily: "var(--font-display)", color: "var(--color-secondary-dark)", marginTop: "8px" }}>
                Nama 5 Anggota Kelompok:
              </h4>

              <div className="student-grid-2cols">
                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "4px" }}>1. Ketua Kelompok (Pengatur Tim):</label>
                  <input
                    type="text"
                    required
                    value={teamData.leaderName}
                    onChange={(e) => setTeamData({ ...teamData, leaderName: e.target.value })}
                    className="student-input"
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "4px" }}>2. Pengamat (Visual & Urin):</label>
                  <input
                    type="text"
                    required
                    value={teamData.observerName}
                    onChange={(e) => setTeamData({ ...teamData, observerName: e.target.value })}
                    className="student-input"
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "4px" }}>3. Pencatat (Data LKPD):</label>
                  <input
                    type="text"
                    required
                    value={teamData.recorderName}
                    onChange={(e) => setTeamData({ ...teamData, recorderName: e.target.value })}
                    className="student-input"
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "4px" }}>4. Operator Layar (Pemain):</label>
                  <input
                    type="text"
                    required
                    value={teamData.pilotName}
                    onChange={(e) => setTeamData({ ...teamData, pilotName: e.target.value })}
                    className="student-input"
                  />
                </div>
                <div className="student-col-span-2">
                  <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "4px" }}>5. Penyaji (Presentasi Penyelidikan):</label>
                  <input
                    type="text"
                    required
                    value={teamData.presenterName}
                    onChange={(e) => setTeamData({ ...teamData, presenterName: e.target.value })}
                    className="student-input"
                  />
                </div>
              </div>

              <GameButton
                type="submit"
                variant="green"
                shape="rect"
                size="md"
                sound="confirm"
                style={{ marginTop: "16px", width: "100%" }}
              >
                🚀 Masuk Sesi & Mulai Pre-test!
              </GameButton>
            </form>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 2: MODUL PRE-TEST (10 SOAL BERPIKIR SISTEMIK)                */}
        {/* ================================================================ */}
        {isRegistered && activeTab === "pretest" && (
          <div className="student-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontFamily: "var(--font-display)", color: "var(--color-primary-dark)" }}>
                📝 Tes Awal (Pre-test) Pemahaman Sistem Tubuh
              </h3>
              <span className="badge-tag" style={{ background: "#E2E8F0" }}>
                10 Pertanyaan Pemahaman
              </span>
            </div>

            {pretestScore !== null && (
              <div style={{ background: "rgba(46, 213, 115, 0.15)", padding: "14px", borderRadius: "var(--radius-md)", marginBottom: "16px" }}>
                <strong>Hasil Pre-test Anda: {pretestScore} / 100</strong>. Anda dapat melanjutkan ke tahap LKPD Inkuiri!
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {PRETEST_QUESTIONS.map((q, idx) => (
                <div key={q.id} style={{ borderBottom: "1px solid #E2E8F0", paddingBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, fontSize: "1.02rem", color: "#0F172A", lineHeight: "1.4" }}>
                      {idx + 1}. {q.question}
                    </span>
                    <span style={{
                      fontSize: "0.82rem",
                      background: "rgba(3, 105, 161, 0.12)",
                      color: "var(--color-primary-dark)",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.3px"
                    }}>
                      {q.indicator} ({q.level})
                    </span>
                  </div>
                  <div>
                    {q.options.map((opt, optIdx) => (
                      <label
                        key={optIdx}
                        className={`quiz-option-label ${pretestAnswers[q.id] === optIdx ? "selected" : ""}`}
                      >
                        <input
                          type="radio"
                          name={`pretest_${q.id}`}
                          checked={pretestAnswers[q.id] === optIdx}
                          onChange={() => setPretestAnswers({ ...pretestAnswers, [q.id]: optIdx })}
                          style={{ marginRight: "4px" }}
                        />
                        <span className="option-badge">{String.fromCharCode(65 + optIdx)}</span>
                        <span style={{ flex: 1, fontSize: "0.95rem", lineHeight: "1.4" }}>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {pretestScore === null && (
              <GameButton
                onClick={handlePretestSubmit}
                disabled={Object.keys(pretestAnswers).length < PRETEST_QUESTIONS.length}
                variant="green"
                shape="rect"
                size="md"
                sound="confirm"
                style={{ marginTop: "24px", width: "100%" }}
              >
                ✅ Selesai & Simpan Skor Pre-test
              </GameButton>
            )}
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 3: LKPD INKUIRI DIGITAL DENGAN SALIN TELEMETRI REALTIME      */}
        {/* ================================================================ */}
        {isRegistered && activeTab === "lkpd" && (
          <div className="student-card">
            <div className="lkpd-action-header">
              <h3 style={{ fontFamily: "var(--font-display)", color: "var(--color-secondary-dark)", margin: 0 }}>
                📋 Lembar Kerja Penyelidikan Inkuiri (LKPD Digital)
              </h3>
              <div className="lkpd-telemetry-controls">
                {incomingTelemetry ? (
                  <span style={{
                    background: "rgba(16, 185, 129, 0.12)",
                    color: "#059669",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    padding: "4px 12px",
                    borderRadius: "999px",
                    border: "none"
                  }}>
                    ✨ Terhubung ke Layar Kelas
                  </span>
                ) : (
                  <span style={{
                    background: "rgba(3, 105, 161, 0.08)",
                    color: "#0369A1",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    padding: "4px 12px",
                    borderRadius: "999px",
                    border: "none"
                  }}>
                    📡 Menunggu Data Layar Kelas
                  </span>
                )}
                <GameButton
                  onClick={handleFetchTelemetry}
                  variant="blue"
                  shape="rect"
                  size="sm"
                  sound="confirm"
                >
                  📥 Salin Data Tubuh dari Layar Depan
                </GameButton>
              </div>
            </div>

            {/* ============================================================ */}
            {/* TABEL 1: DATA PENGAMATAN FISIOLOGI SI META (SANTAI VS LARI)  */}
            {/* ============================================================ */}
            <h4 style={{ fontFamily: "var(--font-display)", marginTop: "12px", marginBottom: "8px" }}>
              Tabel 1: Data Pengamatan Fisiologi Si Meta
            </h4>

            {/* Desktop / Tablet Comparative Table */}
            <div className="lkpd-desktop-table">
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #F1F5F9" }}>
                    <th style={{ padding: "12px 10px", color: "#475569", fontWeight: 700 }}>Kondisi Aktivitas</th>
                    <th style={{ padding: "12px 10px", color: "#475569", fontWeight: 700 }}>Denyut Nadi (BPM)</th>
                    <th style={{ padding: "12px 10px", color: "#475569", fontWeight: 700 }}>Suhu Tubuh (°C)</th>
                    <th style={{ padding: "12px 10px", color: "#475569", fontWeight: 700 }}>Laju Keringat</th>
                    <th style={{ padding: "12px 10px", color: "#475569", fontWeight: 700 }}>Volume Urine</th>
                    <th style={{ padding: "12px 10px", color: "#475569", fontWeight: 700 }}>Warna Urine</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "12px 10px", fontWeight: 700 }}>1. Santai Membaca Buku (Misi 1)</td>
                    <td style={{ padding: "12px 10px" }}>{lkpdData.tableSantai.pulse} BPM</td>
                    <td style={{ padding: "12px 10px" }}>{lkpdData.tableSantai.temp}°C</td>
                    <td style={{ padding: "12px 10px" }}>{lkpdData.tableSantai.sweat} mL/jam</td>
                    <td style={{ padding: "12px 10px" }}>{lkpdData.tableSantai.urineVol} mL</td>
                    <td style={{ padding: "12px 10px" }}>{lkpdData.tableSantai.urineColor}</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid #F1F5F9", background: "rgba(3, 105, 161, 0.05)" }}>
                    <td style={{ padding: "12px 10px", fontWeight: 700 }}>2. Olahraga Lari Lapangan (Misi 2)</td>
                    <td style={{ padding: "12px 10px", color: "#0369A1", fontWeight: 700 }}>{lkpdData.tableLari.pulse || "Tekan 'Salin Data'"}</td>
                    <td style={{ padding: "12px 10px" }}>{lkpdData.tableLari.temp || "-"}</td>
                    <td style={{ padding: "12px 10px" }}>{lkpdData.tableLari.sweat || "-"}</td>
                    <td style={{ padding: "12px 10px" }}>{lkpdData.tableLari.urineVol || "-"}</td>
                    <td style={{ padding: "12px 10px" }}>{lkpdData.tableLari.urineColor || "-"}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mobile Adaptive Cards for Tabel 1 */}
            <div className="lkpd-mobile-cards">
              <div className="lkpd-card-item">
                <div className="lkpd-card-title">
                  <span>📖 1. Santai Membaca Buku (Misi 1)</span>
                  <span className="badge-tag" style={{ background: "#E2E8F0", color: "#334155", fontSize: "0.82rem" }}>Normal</span>
                </div>
                <div className="lkpd-metrics-grid">
                  <div className="lkpd-metric-pill">
                    <span className="lkpd-metric-label">Denyut Nadi</span>
                    <span className="lkpd-metric-value">{lkpdData.tableSantai.pulse} BPM</span>
                  </div>
                  <div className="lkpd-metric-pill">
                    <span className="lkpd-metric-label">Suhu Tubuh</span>
                    <span className="lkpd-metric-value">{lkpdData.tableSantai.temp}°C</span>
                  </div>
                  <div className="lkpd-metric-pill">
                    <span className="lkpd-metric-label">Laju Keringat</span>
                    <span className="lkpd-metric-value">{lkpdData.tableSantai.sweat} mL/jam</span>
                  </div>
                  <div className="lkpd-metric-pill">
                    <span className="lkpd-metric-label">Volume Urine</span>
                    <span className="lkpd-metric-value">{lkpdData.tableSantai.urineVol} mL</span>
                  </div>
                  <div className="lkpd-metric-pill" style={{ gridColumn: "1 / -1" }}>
                    <span className="lkpd-metric-label">Warna Urine</span>
                    <span className="lkpd-metric-value">{lkpdData.tableSantai.urineColor}</span>
                  </div>
                </div>
              </div>

              <div className="lkpd-card-item lkpd-card-item--active">
                <div className="lkpd-card-title">
                  <span>🏃 2. Olahraga Lari Lapangan (Misi 2)</span>
                  <span className="badge-tag" style={{ background: "rgba(3, 105, 161, 0.12)", color: "var(--color-primary-dark)", fontSize: "0.82rem" }}>Aktivitas Berat</span>
                </div>
                <div className="lkpd-metrics-grid">
                  <div className="lkpd-metric-pill">
                    <span className="lkpd-metric-label">Denyut Nadi</span>
                    <span className="lkpd-metric-value">{lkpdData.tableLari.pulse || "Tekan 'Salin Data'"}</span>
                  </div>
                  <div className="lkpd-metric-pill">
                    <span className="lkpd-metric-label">Suhu Tubuh</span>
                    <span className="lkpd-metric-value">{lkpdData.tableLari.temp ? `${lkpdData.tableLari.temp}°C` : "-"}</span>
                  </div>
                  <div className="lkpd-metric-pill">
                    <span className="lkpd-metric-label">Laju Keringat</span>
                    <span className="lkpd-metric-value">{lkpdData.tableLari.sweat ? `${lkpdData.tableLari.sweat} mL/jam` : "-"}</span>
                  </div>
                  <div className="lkpd-metric-pill">
                    <span className="lkpd-metric-label">Volume Urine</span>
                    <span className="lkpd-metric-value">{lkpdData.tableLari.urineVol ? `${lkpdData.tableLari.urineVol} mL` : "-"}</span>
                  </div>
                  <div className="lkpd-metric-pill" style={{ gridColumn: "1 / -1" }}>
                    <span className="lkpd-metric-label">Warna Urine</span>
                    <span className="lkpd-metric-value">{lkpdData.tableLari.urineColor || "-"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ============================================================ */}
            {/* TABEL 2: PENYELIDIKAN 4 ORGAN & ZAT SISA (TAHAP 4 LKPD)      */}
            {/* ============================================================ */}
            <div className="lkpd-section-header">
              <h4 style={{ fontFamily: "var(--font-display)", color: "var(--color-primary-dark)", margin: 0 }}>
                Tabel 2: Identifikasi 4 Organ Ekskresi Manusia & Zat Sisa
              </h4>
              <span className="badge-tag" style={{ background: "rgba(91, 200, 245, 0.15)", color: "var(--color-primary-dark)", fontSize: "0.8rem" }}>
                Aktivitas Penyelidikan Organ
              </span>
            </div>

            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "10px" }}>
              Diskusikan bersama kelompok dan pasangkan setiap organ ekskresi dengan zat sisa metabolik yang dikeluarkannya!
            </p>

            {/* Desktop Table for Tabel 2 */}
            <div className="lkpd-desktop-table">
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #F1F5F9" }}>
                    <th style={{ padding: "12px 10px", width: "22%", color: "#475569", fontWeight: 700 }}>Organ Ekskresi</th>
                    <th style={{ padding: "12px 10px", width: "42%", color: "#475569", fontWeight: 700 }}>Pilih Zat Sisa yang Dikeluarkan</th>
                    <th style={{ padding: "12px 10px", width: "36%", color: "#475569", fontWeight: 700 }}>Peran Utama dalam Homeostasis</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "10px", fontWeight: 700 }}>
                      <span style={{ marginRight: "6px" }}>🔬</span> Ginjal (Ren)
                    </td>
                    <td style={{ padding: "8px" }}>
                      <select
                        className={`lkpd-select-field ${feedbackOrgan ? (organMatching.ginjal === "Urine (Air, Urea, dan Garam Mineral)" ? "correct" : "incorrect") : ""}`}
                        value={organMatching.ginjal}
                        onChange={(e) => {
                          setOrganMatching({ ...organMatching, ginjal: e.target.value });
                          setFeedbackOrgan(null);
                        }}
                      >
                        <option value="">-- Pilih Zat Sisa Ginjal --</option>
                        <option value="Urine (Air, Urea, dan Garam Mineral)">Urine (Air, Urea, dan Garam Mineral)</option>
                        <option value="Keringat (Air, Garam, dan Sedikit Urea)">Keringat (Air, Garam, dan Sedikit Urea)</option>
                        <option value="Karbon Dioksida (CO2) dan Uap Air (H2O)">Karbon Dioksida (CO2) dan Uap Air (H2O)</option>
                        <option value="Cairan Empedu & Hasil Perombakan Sel Darah Merah">Cairan Empedu & Hasil Perombakan Sel Darah Merah</option>
                      </select>
                    </td>
                    <td style={{ padding: "10px", fontSize: "0.82rem", color: "var(--text-muted)" }}>
                      Menyaring darah, membuang urea & menjaga osmolalitas cairan internal
                    </td>
                  </tr>

                  <tr style={{ borderBottom: "1px solid #F1F5F9", background: "rgba(3, 105, 161, 0.04)" }}>
                    <td style={{ padding: "10px", fontWeight: 700 }}>
                      <span style={{ marginRight: "6px" }}>💦</span> Kulit (Integumen)
                    </td>
                    <td style={{ padding: "8px" }}>
                      <select
                        className={`lkpd-select-field ${feedbackOrgan ? (organMatching.kulit === "Keringat (Air, Garam, dan Sedikit Urea)" ? "correct" : "incorrect") : ""}`}
                        value={organMatching.kulit}
                        onChange={(e) => {
                          setOrganMatching({ ...organMatching, kulit: e.target.value });
                          setFeedbackOrgan(null);
                        }}
                      >
                        <option value="">-- Pilih Zat Sisa Kulit --</option>
                        <option value="Urine (Air, Urea, dan Garam Mineral)">Urine (Air, Urea, dan Garam Mineral)</option>
                        <option value="Keringat (Air, Garam, dan Sedikit Urea)">Keringat (Air, Garam, dan Sedikit Urea)</option>
                        <option value="Karbon Dioksida (CO2) dan Uap Air (H2O)">Karbon Dioksida (CO2) dan Uap Air (H2O)</option>
                        <option value="Cairan Empedu & Hasil Perombakan Sel Darah Merah">Cairan Empedu & Hasil Perombakan Sel Darah Merah</option>
                      </select>
                    </td>
                    <td style={{ padding: "10px", fontSize: "0.82rem", color: "var(--text-muted)" }}>
                      Termoregulasi pendinginan tubuh melalui penguapan air & garam
                    </td>
                  </tr>

                  <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "10px", fontWeight: 700 }}>
                      <span style={{ marginRight: "6px" }}>🫁</span> Paru-Paru (Pulmo)
                    </td>
                    <td style={{ padding: "8px" }}>
                      <select
                        className={`lkpd-select-field ${feedbackOrgan ? (organMatching.paru === "Karbon Dioksida (CO2) dan Uap Air (H2O)" ? "correct" : "incorrect") : ""}`}
                        value={organMatching.paru}
                        onChange={(e) => {
                          setOrganMatching({ ...organMatching, paru: e.target.value });
                          setFeedbackOrgan(null);
                        }}
                      >
                        <option value="">-- Pilih Zat Sisa Paru-paru --</option>
                        <option value="Urine (Air, Urea, dan Garam Mineral)">Urine (Air, Urea, dan Garam Mineral)</option>
                        <option value="Keringat (Air, Garam, dan Sedikit Urea)">Keringat (Air, Garam, dan Sedikit Urea)</option>
                        <option value="Karbon Dioksida (CO2) dan Uap Air (H2O)">Karbon Dioksida (CO2) dan Uap Air (H2O)</option>
                        <option value="Cairan Empedu & Hasil Perombakan Sel Darah Merah">Cairan Empedu & Hasil Perombakan Sel Darah Merah</option>
                      </select>
                    </td>
                    <td style={{ padding: "10px", fontSize: "0.82rem", color: "var(--text-muted)" }}>
                      Mengeluarkan gas sisa respirasi seluler (CO2) dan uap air
                    </td>
                  </tr>

                  <tr style={{ borderBottom: "1px solid #F1F5F9", background: "rgba(3, 105, 161, 0.04)" }}>
                    <td style={{ padding: "10px", fontWeight: 700 }}>
                      <span style={{ marginRight: "6px" }}>🧪</span> Hati (Hepar)
                    </td>
                    <td style={{ padding: "8px" }}>
                      <select
                        className={`lkpd-select-field ${feedbackOrgan ? (organMatching.hati === "Cairan Empedu & Hasil Perombakan Sel Darah Merah" ? "correct" : "incorrect") : ""}`}
                        value={organMatching.hati}
                        onChange={(e) => {
                          setOrganMatching({ ...organMatching, hati: e.target.value });
                          setFeedbackOrgan(null);
                        }}
                      >
                        <option value="">-- Pilih Zat Sisa Hati --</option>
                        <option value="Urine (Air, Urea, dan Garam Mineral)">Urine (Air, Urea, dan Garam Mineral)</option>
                        <option value="Keringat (Air, Garam, dan Sedikit Urea)">Keringat (Air, Garam, dan Sedikit Urea)</option>
                        <option value="Karbon Dioksida (CO2) dan Uap Air (H2O)">Karbon Dioksida (CO2) dan Uap Air (H2O)</option>
                        <option value="Cairan Empedu & Hasil Perombakan Sel Darah Merah">Cairan Empedu & Hasil Perombakan Sel Darah Merah</option>
                      </select>
                    </td>
                    <td style={{ padding: "10px", fontSize: "0.82rem", color: "var(--text-muted)" }}>
                      Detoksifikasi amonia menjadi urea & ekskresi zat warna empedu (bilirubin)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mobile Adaptive Cards for Tabel 2 */}
            <div className="lkpd-mobile-cards">
              {/* Ginjal Card */}
              <div className="lkpd-card-item">
                <div className="lkpd-card-title">
                  <span>🔬 Ginjal (Ren)</span>
                </div>
                <div className="lkpd-organ-role-desc">
                  💡 <strong>Peran:</strong> Menyaring darah, membuang urea & menjaga osmolalitas cairan tubuh.
                </div>
                <div className="lkpd-organ-field-group">
                  <label className="lkpd-organ-field-label">Pilih Zat Sisa yang Dikeluarkan:</label>
                  <select
                    className={`lkpd-select-field ${feedbackOrgan ? (organMatching.ginjal === "Urine (Air, Urea, dan Garam Mineral)" ? "correct" : "incorrect") : ""}`}
                    value={organMatching.ginjal}
                    onChange={(e) => {
                      setOrganMatching({ ...organMatching, ginjal: e.target.value });
                      setFeedbackOrgan(null);
                    }}
                  >
                    <option value="">-- Pilih Zat Sisa Ginjal --</option>
                    <option value="Urine (Air, Urea, dan Garam Mineral)">Urine (Air, Urea, dan Garam Mineral)</option>
                    <option value="Keringat (Air, Garam, dan Sedikit Urea)">Keringat (Air, Garam, dan Sedikit Urea)</option>
                    <option value="Karbon Dioksida (CO2) dan Uap Air (H2O)">Karbon Dioksida (CO2) dan Uap Air (H2O)</option>
                    <option value="Cairan Empedu & Hasil Perombakan Sel Darah Merah">Cairan Empedu & Hasil Perombakan Sel Darah Merah</option>
                  </select>
                </div>
              </div>

              {/* Kulit Card */}
              <div className="lkpd-card-item">
                <div className="lkpd-card-title">
                  <span>💦 Kulit (Integumen)</span>
                </div>
                <div className="lkpd-organ-role-desc">
                  💡 <strong>Peran:</strong> Termoregulasi pendinginan tubuh melalui penguapan keringat & garam.
                </div>
                <div className="lkpd-organ-field-group">
                  <label className="lkpd-organ-field-label">Pilih Zat Sisa yang Dikeluarkan:</label>
                  <select
                    className={`lkpd-select-field ${feedbackOrgan ? (organMatching.kulit === "Keringat (Air, Garam, dan Sedikit Urea)" ? "correct" : "incorrect") : ""}`}
                    value={organMatching.kulit}
                    onChange={(e) => {
                      setOrganMatching({ ...organMatching, kulit: e.target.value });
                      setFeedbackOrgan(null);
                    }}
                  >
                    <option value="">-- Pilih Zat Sisa Kulit --</option>
                    <option value="Urine (Air, Urea, dan Garam Mineral)">Urine (Air, Urea, dan Garam Mineral)</option>
                    <option value="Keringat (Air, Garam, dan Sedikit Urea)">Keringat (Air, Garam, dan Sedikit Urea)</option>
                    <option value="Karbon Dioksida (CO2) dan Uap Air (H2O)">Karbon Dioksida (CO2) dan Uap Air (H2O)</option>
                    <option value="Cairan Empedu & Hasil Perombakan Sel Darah Merah">Cairan Empedu & Hasil Perombakan Sel Darah Merah</option>
                  </select>
                </div>
              </div>

              {/* Paru-paru Card */}
              <div className="lkpd-card-item">
                <div className="lkpd-card-title">
                  <span>🫁 Paru-Paru (Pulmo)</span>
                </div>
                <div className="lkpd-organ-role-desc">
                  💡 <strong>Peran:</strong> Mengeluarkan gas sisa respirasi seluler (CO2) dan uap air (H2O).
                </div>
                <div className="lkpd-organ-field-group">
                  <label className="lkpd-organ-field-label">Pilih Zat Sisa yang Dikeluarkan:</label>
                  <select
                    className={`lkpd-select-field ${feedbackOrgan ? (organMatching.paru === "Karbon Dioksida (CO2) dan Uap Air (H2O)" ? "correct" : "incorrect") : ""}`}
                    value={organMatching.paru}
                    onChange={(e) => {
                      setOrganMatching({ ...organMatching, paru: e.target.value });
                      setFeedbackOrgan(null);
                    }}
                  >
                    <option value="">-- Pilih Zat Sisa Paru-paru --</option>
                    <option value="Urine (Air, Urea, dan Garam Mineral)">Urine (Air, Urea, dan Garam Mineral)</option>
                    <option value="Keringat (Air, Garam, dan Sedikit Urea)">Keringat (Air, Garam, dan Sedikit Urea)</option>
                    <option value="Karbon Dioksida (CO2) dan Uap Air (H2O)">Karbon Dioksida (CO2) dan Uap Air (H2O)</option>
                    <option value="Cairan Empedu & Hasil Perombakan Sel Darah Merah">Cairan Empedu & Hasil Perombakan Sel Darah Merah</option>
                  </select>
                </div>
              </div>

              {/* Hati Card */}
              <div className="lkpd-card-item">
                <div className="lkpd-card-title">
                  <span>🧪 Hati (Hepar)</span>
                </div>
                <div className="lkpd-organ-role-desc">
                  💡 <strong>Peran:</strong> Detoksifikasi amonia menjadi urea & ekskresi zat warna empedu (bilirubin).
                </div>
                <div className="lkpd-organ-field-group">
                  <label className="lkpd-organ-field-label">Pilih Zat Sisa yang Dikeluarkan:</label>
                  <select
                    className={`lkpd-select-field ${feedbackOrgan ? (organMatching.hati === "Cairan Empedu & Hasil Perombakan Sel Darah Merah" ? "correct" : "incorrect") : ""}`}
                    value={organMatching.hati}
                    onChange={(e) => {
                      setOrganMatching({ ...organMatching, hati: e.target.value });
                      setFeedbackOrgan(null);
                    }}
                  >
                    <option value="">-- Pilih Zat Sisa Hati --</option>
                    <option value="Urine (Air, Urea, dan Garam Mineral)">Urine (Air, Urea, dan Garam Mineral)</option>
                    <option value="Keringat (Air, Garam, dan Sedikit Urea)">Keringat (Air, Garam, dan Sedikit Urea)</option>
                    <option value="Karbon Dioksida (CO2) dan Uap Air (H2O)">Karbon Dioksida (CO2) dan Uap Air (H2O)</option>
                    <option value="Cairan Empedu & Hasil Perombakan Sel Darah Merah">Cairan Empedu & Hasil Perombakan Sel Darah Merah</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px" }}>
              <GameButton
                onClick={handleCheckOrganMatching}
                variant="blue"
                shape="rect"
                size="sm"
                sound="confirm"
                style={{ width: "100%", maxWidth: "300px" }}
              >
                🔍 Cek Kebenaran Pasangan Organ
              </GameButton>
            </div>

            {feedbackOrgan && (
              <div className={feedbackOrgan.isCorrect ? "feedback-card-success" : "feedback-card-hint"}>
                <span>{feedbackOrgan.isCorrect ? "✅" : "💡"}</span>
                <span>{feedbackOrgan.message}</span>
              </div>
            )}

            {/* ============================================================ */}
            {/* TABEL 3: MODEL 3 TAHAP PEMBENTUKAN URINE (TAHAP H LKPD)      */}
            {/* ============================================================ */}
            <div className="lkpd-section-header" style={{ marginTop: "32px" }}>
              <h4 style={{ fontFamily: "var(--font-display)", color: "var(--color-accent-purple)", margin: 0 }}>
                Tabel 3: Model Rekonstruksi 3 Tahap Pembentukan Urine di Nefron
              </h4>
              <span className="badge-tag" style={{ background: "rgba(155, 81, 224, 0.15)", color: "var(--color-accent-purple)", fontSize: "0.8rem" }}>
                Aktivitas Skema Nefron
              </span>
            </div>

            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "10px" }}>
              Gunakan informasi dari <em>Kaca Pembesar Nefron</em> di layar depan kelas untuk menyusun urutan tahap, lokasi, dan zat hasil penyaringan!
            </p>

            {/* Desktop Table for Tabel 3 */}
            <div className="lkpd-desktop-table-nefron">
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #F1F5F9" }}>
                    <th style={{ padding: "12px 10px", width: "12%", color: "#475569", fontWeight: 700 }}>Urutan</th>
                    <th style={{ padding: "12px 10px", width: "28%", color: "#475569", fontWeight: 700 }}>Nama Tahap Proses</th>
                    <th style={{ padding: "12px 10px", width: "32%", color: "#475569", fontWeight: 700 }}>Lokasi Utama di Nefron</th>
                    <th style={{ padding: "12px 10px", width: "28%", color: "#475569", fontWeight: 700 }}>Hasil Cairan Saringan</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Tahap 1 */}
                  <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "10px", fontWeight: 700, textAlign: "center" }}>
                      Tahap 1
                    </td>
                    <td style={{ padding: "8px" }}>
                      <select
                        className="lkpd-select-field"
                        value={urinePhases.p1.phase}
                        onChange={(e) => {
                          setUrinePhases({
                            ...urinePhases,
                            p1: { ...urinePhases.p1, phase: e.target.value }
                          });
                          setFeedbackUrine(null);
                        }}
                      >
                        <option value="">-- Pilih Tahap 1 --</option>
                        <option value="Filtrasi (Penyaringan)">Filtrasi (Penyaringan)</option>
                        <option value="Reabsorpsi (Penyerapan Kembali)">Reabsorpsi (Penyerapan Kembali)</option>
                        <option value="Augmentasi (Pengeluaran Zat Sisa)">Augmentasi (Pengeluaran Zat Sisa)</option>
                      </select>
                    </td>
                    <td style={{ padding: "8px" }}>
                      <select
                        className="lkpd-select-field"
                        value={urinePhases.p1.location}
                        onChange={(e) => {
                          setUrinePhases({
                            ...urinePhases,
                            p1: { ...urinePhases.p1, location: e.target.value }
                          });
                          setFeedbackUrine(null);
                        }}
                      >
                        <option value="">-- Pilih Lokasi Tahap 1 --</option>
                        <option value="Glomerulus & Kapsula Bowman">Glomerulus & Kapsula Bowman</option>
                        <option value="Tubulus Kontortus Proksimal & Lengkung Henle">Tubulus Kontortus Proksimal & Lengkung Henle</option>
                        <option value="Tubulus Kontortus Distal & Tubulus Kolektivus">Tubulus Kontortus Distal & Tubulus Kolektivus</option>
                      </select>
                    </td>
                    <td style={{ padding: "8px" }}>
                      <select
                        className="lkpd-select-field"
                        value={urinePhases.p1.result}
                        onChange={(e) => {
                          setUrinePhases({
                            ...urinePhases,
                            p1: { ...urinePhases.p1, result: e.target.value }
                          });
                          setFeedbackUrine(null);
                        }}
                      >
                        <option value="">-- Pilih Hasil Tahap 1 --</option>
                        <option value="Urine Primer (Filtrat Glomerulus)">Urine Primer (Filtrat Glomerulus)</option>
                        <option value="Urine Sekunder (Filtrat Tubulus)">Urine Sekunder (Filtrat Tubulus)</option>
                        <option value="Urine Sesungguhnya (Air Seni Sejati)">Urine Sesungguhnya (Air Seni Sejati)</option>
                      </select>
                    </td>
                  </tr>

                  {/* Tahap 2 */}
                  <tr style={{ borderBottom: "1px solid #F1F5F9", background: "rgba(79, 70, 229, 0.04)" }}>
                    <td style={{ padding: "10px", fontWeight: 700, textAlign: "center" }}>
                      Tahap 2
                    </td>
                    <td style={{ padding: "8px" }}>
                      <select
                        className="lkpd-select-field"
                        value={urinePhases.p2.phase}
                        onChange={(e) => {
                          setUrinePhases({
                            ...urinePhases,
                            p2: { ...urinePhases.p2, phase: e.target.value }
                          });
                          setFeedbackUrine(null);
                        }}
                      >
                        <option value="">-- Pilih Tahap 2 --</option>
                        <option value="Filtrasi (Penyaringan)">Filtrasi (Penyaringan)</option>
                        <option value="Reabsorpsi (Penyerapan Kembali)">Reabsorpsi (Penyerapan Kembali)</option>
                        <option value="Augmentasi (Pengeluaran Zat Sisa)">Augmentasi (Pengeluaran Zat Sisa)</option>
                      </select>
                    </td>
                    <td style={{ padding: "8px" }}>
                      <select
                        className="lkpd-select-field"
                        value={urinePhases.p2.location}
                        onChange={(e) => {
                          setUrinePhases({
                            ...urinePhases,
                            p2: { ...urinePhases.p2, location: e.target.value }
                          });
                          setFeedbackUrine(null);
                        }}
                      >
                        <option value="">-- Pilih Lokasi Tahap 2 --</option>
                        <option value="Glomerulus & Kapsula Bowman">Glomerulus & Kapsula Bowman</option>
                        <option value="Tubulus Kontortus Proksimal & Lengkung Henle">Tubulus Kontortus Proksimal & Lengkung Henle</option>
                        <option value="Tubulus Kontortus Distal & Tubulus Kolektivus">Tubulus Kontortus Distal & Tubulus Kolektivus</option>
                      </select>
                    </td>
                    <td style={{ padding: "8px" }}>
                      <select
                        className="lkpd-select-field"
                        value={urinePhases.p2.result}
                        onChange={(e) => {
                          setUrinePhases({
                            ...urinePhases,
                            p2: { ...urinePhases.p2, result: e.target.value }
                          });
                          setFeedbackUrine(null);
                        }}
                      >
                        <option value="">-- Pilih Hasil Tahap 2 --</option>
                        <option value="Urine Primer (Filtrat Glomerulus)">Urine Primer (Filtrat Glomerulus)</option>
                        <option value="Urine Sekunder (Filtrat Tubulus)">Urine Sekunder (Filtrat Tubulus)</option>
                        <option value="Urine Sesungguhnya (Air Seni Sejati)">Urine Sesungguhnya (Air Seni Sejati)</option>
                      </select>
                    </td>
                  </tr>

                  {/* Tahap 3 */}
                  <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "10px", fontWeight: 700, textAlign: "center" }}>
                      Tahap 3
                    </td>
                    <td style={{ padding: "8px" }}>
                      <select
                        className="lkpd-select-field"
                        value={urinePhases.p3.phase}
                        onChange={(e) => {
                          setUrinePhases({
                            ...urinePhases,
                            p3: { ...urinePhases.p3, phase: e.target.value }
                          });
                          setFeedbackUrine(null);
                        }}
                      >
                        <option value="">-- Pilih Tahap 3 --</option>
                        <option value="Filtrasi (Penyaringan)">Filtrasi (Penyaringan)</option>
                        <option value="Reabsorpsi (Penyerapan Kembali)">Reabsorpsi (Penyerapan Kembali)</option>
                        <option value="Augmentasi (Pengeluaran Zat Sisa)">Augmentasi (Pengeluaran Zat Sisa)</option>
                      </select>
                    </td>
                    <td style={{ padding: "8px" }}>
                      <select
                        className="lkpd-select-field"
                        value={urinePhases.p3.location}
                        onChange={(e) => {
                          setUrinePhases({
                            ...urinePhases,
                            p3: { ...urinePhases.p3, location: e.target.value }
                          });
                          setFeedbackUrine(null);
                        }}
                      >
                        <option value="">-- Pilih Lokasi Tahap 3 --</option>
                        <option value="Glomerulus & Kapsula Bowman">Glomerulus & Kapsula Bowman</option>
                        <option value="Tubulus Kontortus Proksimal & Lengkung Henle">Tubulus Kontortus Proksimal & Lengkung Henle</option>
                        <option value="Tubulus Kontortus Distal & Tubulus Kolektivus">Tubulus Kontortus Distal & Tubulus Kolektivus</option>
                      </select>
                    </td>
                    <td style={{ padding: "8px" }}>
                      <select
                        className="lkpd-select-field"
                        value={urinePhases.p3.result}
                        onChange={(e) => {
                          setUrinePhases({
                            ...urinePhases,
                            p3: { ...urinePhases.p3, result: e.target.value }
                          });
                          setFeedbackUrine(null);
                        }}
                      >
                        <option value="">-- Pilih Hasil Tahap 3 --</option>
                        <option value="Urine Primer (Filtrat Glomerulus)">Urine Primer (Filtrat Glomerulus)</option>
                        <option value="Urine Sekunder (Filtrat Tubulus)">Urine Sekunder (Filtrat Tubulus)</option>
                        <option value="Urine Sesungguhnya (Air Seni Sejati)">Urine Sesungguhnya (Air Seni Sejati)</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mobile Adaptive Cards for Tabel 3 */}
            <div className="lkpd-mobile-cards-nefron">
              {/* Tahap 1 Mobile Card */}
              <div className="lkpd-card-item lkpd-card-item--purple">
                <div className="lkpd-card-title">
                  <span>⚡ Tahap 1 Nefron</span>
                </div>
                <div className="lkpd-organ-field-group">
                  <label className="lkpd-organ-field-label">1. Nama Tahap Proses:</label>
                  <select
                    className="lkpd-select-field"
                    value={urinePhases.p1.phase}
                    onChange={(e) => {
                      setUrinePhases({
                        ...urinePhases,
                        p1: { ...urinePhases.p1, phase: e.target.value }
                      });
                      setFeedbackUrine(null);
                    }}
                  >
                    <option value="">-- Pilih Tahap 1 --</option>
                    <option value="Filtrasi (Penyaringan)">Filtrasi (Penyaringan)</option>
                    <option value="Reabsorpsi (Penyerapan Kembali)">Reabsorpsi (Penyerapan Kembali)</option>
                    <option value="Augmentasi (Pengeluaran Zat Sisa)">Augmentasi (Pengeluaran Zat Sisa)</option>
                  </select>
                </div>
                <div className="lkpd-organ-field-group">
                  <label className="lkpd-organ-field-label">2. Lokasi Utama di Nefron:</label>
                  <select
                    className="lkpd-select-field"
                    value={urinePhases.p1.location}
                    onChange={(e) => {
                      setUrinePhases({
                        ...urinePhases,
                        p1: { ...urinePhases.p1, location: e.target.value }
                      });
                      setFeedbackUrine(null);
                    }}
                  >
                    <option value="">-- Pilih Lokasi Tahap 1 --</option>
                    <option value="Glomerulus & Kapsula Bowman">Glomerulus & Kapsula Bowman</option>
                    <option value="Tubulus Kontortus Proksimal & Lengkung Henle">Tubulus Kontortus Proksimal & Lengkung Henle</option>
                    <option value="Tubulus Kontortus Distal & Tubulus Kolektivus">Tubulus Kontortus Distal & Tubulus Kolektivus</option>
                  </select>
                </div>
                <div className="lkpd-organ-field-group">
                  <label className="lkpd-organ-field-label">3. Hasil Cairan Saringan:</label>
                  <select
                    className="lkpd-select-field"
                    value={urinePhases.p1.result}
                    onChange={(e) => {
                      setUrinePhases({
                        ...urinePhases,
                        p1: { ...urinePhases.p1, result: e.target.value }
                      });
                      setFeedbackUrine(null);
                    }}
                  >
                    <option value="">-- Pilih Hasil Tahap 1 --</option>
                    <option value="Urine Primer (Filtrat Glomerulus)">Urine Primer (Filtrat Glomerulus)</option>
                    <option value="Urine Sekunder (Filtrat Tubulus)">Urine Sekunder (Filtrat Tubulus)</option>
                    <option value="Urine Sesungguhnya (Air Seni Sejati)">Urine Sesungguhnya (Air Seni Sejati)</option>
                  </select>
                </div>
              </div>

              {/* Tahap 2 Mobile Card */}
              <div className="lkpd-card-item lkpd-card-item--purple">
                <div className="lkpd-card-title">
                  <span>⚡ Tahap 2 Nefron</span>
                </div>
                <div className="lkpd-organ-field-group">
                  <label className="lkpd-organ-field-label">1. Nama Tahap Proses:</label>
                  <select
                    className="lkpd-select-field"
                    value={urinePhases.p2.phase}
                    onChange={(e) => {
                      setUrinePhases({
                        ...urinePhases,
                        p2: { ...urinePhases.p2, phase: e.target.value }
                      });
                      setFeedbackUrine(null);
                    }}
                  >
                    <option value="">-- Pilih Tahap 2 --</option>
                    <option value="Filtrasi (Penyaringan)">Filtrasi (Penyaringan)</option>
                    <option value="Reabsorpsi (Penyerapan Kembali)">Reabsorpsi (Penyerapan Kembali)</option>
                    <option value="Augmentasi (Pengeluaran Zat Sisa)">Augmentasi (Pengeluaran Zat Sisa)</option>
                  </select>
                </div>
                <div className="lkpd-organ-field-group">
                  <label className="lkpd-organ-field-label">2. Lokasi Utama di Nefron:</label>
                  <select
                    className="lkpd-select-field"
                    value={urinePhases.p2.location}
                    onChange={(e) => {
                      setUrinePhases({
                        ...urinePhases,
                        p2: { ...urinePhases.p2, location: e.target.value }
                      });
                      setFeedbackUrine(null);
                    }}
                  >
                    <option value="">-- Pilih Lokasi Tahap 2 --</option>
                    <option value="Glomerulus & Kapsula Bowman">Glomerulus & Kapsula Bowman</option>
                    <option value="Tubulus Kontortus Proksimal & Lengkung Henle">Tubulus Kontortus Proksimal & Lengkung Henle</option>
                    <option value="Tubulus Kontortus Distal & Tubulus Kolektivus">Tubulus Kontortus Distal & Tubulus Kolektivus</option>
                  </select>
                </div>
                <div className="lkpd-organ-field-group">
                  <label className="lkpd-organ-field-label">3. Hasil Cairan Saringan:</label>
                  <select
                    className="lkpd-select-field"
                    value={urinePhases.p2.result}
                    onChange={(e) => {
                      setUrinePhases({
                        ...urinePhases,
                        p2: { ...urinePhases.p2, result: e.target.value }
                      });
                      setFeedbackUrine(null);
                    }}
                  >
                    <option value="">-- Pilih Hasil Tahap 2 --</option>
                    <option value="Urine Primer (Filtrat Glomerulus)">Urine Primer (Filtrat Glomerulus)</option>
                    <option value="Urine Sekunder (Filtrat Tubulus)">Urine Sekunder (Filtrat Tubulus)</option>
                    <option value="Urine Sesungguhnya (Air Seni Sejati)">Urine Sesungguhnya (Air Seni Sejati)</option>
                  </select>
                </div>
              </div>

              {/* Tahap 3 Mobile Card */}
              <div className="lkpd-card-item lkpd-card-item--purple">
                <div className="lkpd-card-title">
                  <span>⚡ Tahap 3 Nefron</span>
                </div>
                <div className="lkpd-organ-field-group">
                  <label className="lkpd-organ-field-label">1. Nama Tahap Proses:</label>
                  <select
                    className="lkpd-select-field"
                    value={urinePhases.p3.phase}
                    onChange={(e) => {
                      setUrinePhases({
                        ...urinePhases,
                        p3: { ...urinePhases.p3, phase: e.target.value }
                      });
                      setFeedbackUrine(null);
                    }}
                  >
                    <option value="">-- Pilih Tahap 3 --</option>
                    <option value="Filtrasi (Penyaringan)">Filtrasi (Penyaringan)</option>
                    <option value="Reabsorpsi (Penyerapan Kembali)">Reabsorpsi (Penyerapan Kembali)</option>
                    <option value="Augmentasi (Pengeluaran Zat Sisa)">Augmentasi (Pengeluaran Zat Sisa)</option>
                  </select>
                </div>
                <div className="lkpd-organ-field-group">
                  <label className="lkpd-organ-field-label">2. Lokasi Utama di Nefron:</label>
                  <select
                    className="lkpd-select-field"
                    value={urinePhases.p3.location}
                    onChange={(e) => {
                      setUrinePhases({
                        ...urinePhases,
                        p3: { ...urinePhases.p3, location: e.target.value }
                      });
                      setFeedbackUrine(null);
                    }}
                  >
                    <option value="">-- Pilih Lokasi Tahap 3 --</option>
                    <option value="Glomerulus & Kapsula Bowman">Glomerulus & Kapsula Bowman</option>
                    <option value="Tubulus Kontortus Proksimal & Lengkung Henle">Tubulus Kontortus Proksimal & Lengkung Henle</option>
                    <option value="Tubulus Kontortus Distal & Tubulus Kolektivus">Tubulus Kontortus Distal & Tubulus Kolektivus</option>
                  </select>
                </div>
                <div className="lkpd-organ-field-group">
                  <label className="lkpd-organ-field-label">3. Hasil Cairan Saringan:</label>
                  <select
                    className="lkpd-select-field"
                    value={urinePhases.p3.result}
                    onChange={(e) => {
                      setUrinePhases({
                        ...urinePhases,
                        p3: { ...urinePhases.p3, result: e.target.value }
                      });
                      setFeedbackUrine(null);
                    }}
                  >
                    <option value="">-- Pilih Hasil Tahap 3 --</option>
                    <option value="Urine Primer (Filtrat Glomerulus)">Urine Primer (Filtrat Glomerulus)</option>
                    <option value="Urine Sekunder (Filtrat Tubulus)">Urine Sekunder (Filtrat Tubulus)</option>
                    <option value="Urine Sesungguhnya (Air Seni Sejati)">Urine Sesungguhnya (Air Seni Sejati)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Skema Rantai Alur Nefron */}
            <div style={{
              margin: "14px 0",
              padding: "10px 14px",
              background: "#F8FAFC",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
              lineHeight: "1.6"
            }}>
              <strong>Alur Pembentukan:</strong>
              <span>Darah Arteri</span>
              <span>➔</span>
              <span style={{ color: "var(--color-primary-dark)", fontWeight: 700 }}>
                {urinePhases.p1.result || "(Urine Primer)"}
              </span>
              <span>➔</span>
              <span style={{ color: "var(--color-secondary-dark)", fontWeight: 700 }}>
                {urinePhases.p2.result || "(Urine Sekunder)"}
              </span>
              <span>➔</span>
              <span style={{ color: "var(--color-accent-purple)", fontWeight: 700 }}>
                {urinePhases.p3.result || "(Urine Sesungguhnya)"}
              </span>
              <span>➔ Kandung Kemih</span>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px" }}>
              <GameButton
                onClick={handleCheckUrinePhases}
                variant="purple"
                shape="rect"
                size="sm"
                sound="confirm"
                style={{ width: "100%", maxWidth: "300px" }}
              >
                🔍 Cek Kebenaran Model Nefron
              </GameButton>
            </div>

            {feedbackUrine && (
              <div className={feedbackUrine.isCorrect ? "feedback-card-success" : "feedback-card-hint"}>
                <span>{feedbackUrine.isCorrect ? "🏆" : "💡"}</span>
                <span>{feedbackUrine.message}</span>
              </div>
            )}

            {/* 4 Pertanyaan Inkuiri Resmi Modul Ajar */}
            <h4 style={{ fontFamily: "var(--font-display)", marginTop: "32px", marginBottom: "12px", color: "var(--color-primary-dark)" }}>
              Pertanyaan Diskusi Kelompok:
            </h4>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ fontWeight: 700, fontSize: "0.95rem", display: "block", marginBottom: "6px" }}>
                  1. Setelah kita makan, zat-zat hasil pencernaan diedarkan oleh darah. Ke mana zat yang tidak diperlukan tubuh akhirnya pergi?
                </label>
                <textarea
                  rows="3"
                  value={lkpdData.q1}
                  onChange={(e) => setLkpdData({ ...lkpdData, q1: e.target.value })}
                  placeholder="Tuliskan analisis kelompok Anda mengenai alur pengeluaran zat sisa makanan..."
                  className="student-textarea"
                />
              </div>

              <div>
                <label style={{ fontWeight: 700, fontSize: "0.95rem", display: "block", marginBottom: "6px" }}>
                  2. Mengapa setelah berolahraga kita berkeringat dan napas menjadi lebih cepat? Jelaskan hubungan kerja sama jantung, paru-paru, dan kulit!
                </label>
                <textarea
                  rows="3"
                  value={lkpdData.q2}
                  onChange={(e) => setLkpdData({ ...lkpdData, q2: e.target.value })}
                  placeholder="Tuliskan alasan kenaikan napas dan keluarnya keringat berdasarkan data simulasi..."
                  className="student-textarea"
                />
              </div>

              <div>
                <label style={{ fontWeight: 700, fontSize: "0.95rem", display: "block", marginBottom: "6px" }}>
                  3. Mengapa ginjal berhubungan sangat erat dengan aliran darah?
                </label>
                <textarea
                  rows="3"
                  value={lkpdData.q3}
                  onChange={(e) => setLkpdData({ ...lkpdData, q3: e.target.value })}
                  placeholder="Tuliskan fungsi penyaringan nefron terhadap darah kotor..."
                  className="student-textarea"
                />
              </div>

              <div>
                <label style={{ fontWeight: 700, fontSize: "0.95rem", display: "block", marginBottom: "6px" }}>
                  4. Jika paru-paru sudah mengeluarkan karbon dioksida, mengapa tubuh manusia masih membutuhkan organ ekskresi lain (ginjal, kulit, dan hati)?
                </label>
                <textarea
                  rows="3"
                  value={lkpdData.q4}
                  onChange={(e) => setLkpdData({ ...lkpdData, q4: e.target.value })}
                  placeholder="Tuliskan pembagian tugas spesifik antar-organ ekskresi..."
                  className="student-textarea"
                />
              </div>
            </div>

            <GameButton
              onClick={() => setActiveTab("posttest")}
              variant="green"
              shape="rect"
              size="md"
              sound="next"
              style={{ marginTop: "24px", width: "100%" }}
            >
              ➡️ Lanjut ke Post-test Evaluasi Akhir
            </GameButton>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 4: MODUL POST-TEST                                           */}
        {/* ================================================================ */}
        {isRegistered && activeTab === "posttest" && (
          <div className="student-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontFamily: "var(--font-display)", color: "var(--color-accent-green-dark)" }}>
                🎯 Tes Akhir (Post-test) Pemahaman Sistem Tubuh
              </h3>
              <span className="badge-tag" style={{ background: "#E2E8F0" }}>
                10 Pertanyaan Pemahaman
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {POSTTEST_QUESTIONS.map((q, idx) => (
                <div key={q.id} style={{ borderBottom: "1px solid #E2E8F0", paddingBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, fontSize: "1.02rem", color: "#0F172A", lineHeight: "1.4" }}>
                      {idx + 1}. {q.question}
                    </span>
                    <span style={{
                      fontSize: "0.82rem",
                      background: "rgba(46, 213, 115, 0.15)",
                      color: "var(--color-accent-green-dark)",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.3px"
                    }}>
                      {q.indicator} ({q.level})
                    </span>
                  </div>
                  <div>
                    {q.options.map((opt, optIdx) => (
                      <label
                        key={optIdx}
                        className={`quiz-option-label ${posttestAnswers[q.id] === optIdx ? "selected" : ""}`}
                      >
                        <input
                          type="radio"
                          name={`posttest_${q.id}`}
                          checked={posttestAnswers[q.id] === optIdx}
                          onChange={() => setPosttestAnswers({ ...posttestAnswers, [q.id]: optIdx })}
                          style={{ marginRight: "4px" }}
                        />
                        <span className="option-badge">{String.fromCharCode(65 + optIdx)}</span>
                        <span style={{ flex: 1, fontSize: "0.95rem", lineHeight: "1.4" }}>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <GameButton
              onClick={handlePosttestSubmit}
              disabled={Object.keys(posttestAnswers).length < POSTTEST_QUESTIONS.length}
              variant="green"
              shape="rect"
              size="md"
              sound="confirm"
              style={{ marginTop: "24px", width: "100%" }}
            >
              🏆 Kirim Jawaban Post-test & Lihat Hasil Belajar!
            </GameButton>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 5: RESUME & HASIL N-GAIN AKHIR                               */}
        {/* ================================================================ */}
        {isRegistered && activeTab === "resume" && (
          <div className="student-card">
            <h2 style={{ fontFamily: "var(--font-display)", color: "var(--color-accent-green-dark)", textAlign: "center", fontSize: "1.35rem" }}>
              🎓 Rekapitulasi Hasil Pembelajaran Kelompok
            </h2>

            <div className="resume-score-grid">
              <div className="resume-score-card">
                <div className="resume-score-title">Skor Pre-test</div>
                <div className="resume-score-number" style={{ color: "var(--color-primary-dark)" }}>
                  {pretestScore !== null ? pretestScore : 0}
                </div>
              </div>
              <div className="resume-score-card">
                <div className="resume-score-title">Skor Post-test</div>
                <div className="resume-score-number" style={{ color: "var(--color-accent-green-dark)" }}>
                  {posttestScore !== null ? posttestScore : 0}
                </div>
              </div>
              <div className="resume-score-card resume-score-card--highlight">
                <div className="resume-score-title">Tingkat Peningkatan (N-Gain)</div>
                <div className="resume-score-number" style={{ color: "var(--color-accent-green-dark)" }}>
                  {nGain !== null ? nGain : 0}
                </div>
                <div className="resume-score-category">
                  {nGainCategory}
                </div>
              </div>
            </div>

            <div style={{ background: "#F8FAFC", padding: "18px 20px", borderRadius: "16px", marginBottom: "20px", border: "none", outline: "none", boxShadow: "0 4px 12px rgba(15, 23, 42, 0.04)" }}>
              <h4 style={{ fontFamily: "var(--font-display)", marginBottom: "8px", fontSize: "0.95rem" }}>Anggota Kelompok:</h4>
              <p style={{ fontSize: "0.88rem", lineHeight: "1.6", margin: 0 }}>
                Ketua: <strong>{teamData.leaderName}</strong> | Pengamat: <strong>{teamData.observerName}</strong> | Pencatat: <strong>{teamData.recorderName}</strong> | Pilot IFP: <strong>{teamData.pilotName}</strong> | Penyaji: <strong>{teamData.presenterName}</strong>
              </p>
            </div>

            {/* ============================================================ */}
            {/* GRAFIK RADAR 4 INDIKATOR BERPIKIR SISTEMIK (SPIDER CHART)    */}
            {/* ============================================================ */}
            <div style={{
              background: "#F8FAFC",
              border: "none",
              outline: "none",
              borderRadius: "18px",
              padding: "20px",
              marginBottom: "24px",
              boxShadow: "0 4px 14px rgba(15, 23, 42, 0.04)"
            }}>
              <SystemsThinkingRadarChart
                pretestScores={calculateIndicatorScores(pretestAnswers, PRETEST_QUESTIONS)}
                posttestScores={posttestScore !== null ? calculateIndicatorScores(posttestAnswers, POSTTEST_QUESTIONS) : null}
                title={`Profil Berpikir Sistem: ${teamData.groupName}`}
                subtitle="Peta Kekuatan Keterampilan Berpikir Sistem Kelompok"
                showLegend={true}
                showDetails={true}
              />
            </div>

            {/* ============================================================ */}
            {/* FORM EXIT TICKET & REFLEKSI DIRI MURID (BAB L MODUL AJAR)    */}
            {/* ============================================================ */}
            <div style={{
              background: "rgba(3, 105, 161, 0.06)",
              border: "none",
              outline: "none",
              borderRadius: "18px",
              padding: "20px",
              marginBottom: "24px",
              boxShadow: "0 4px 14px rgba(3, 105, 161, 0.06)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span style={{ fontSize: "1.4rem" }}>🌱</span>
                <h3 style={{ fontFamily: "var(--font-display)", color: "var(--color-primary-dark)", margin: 0, fontSize: "1.1rem" }}>
                  Refleksi Akhir & Komitmen Hidup Sehat
                </h3>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "16px", lineHeight: "1.4" }}>
                Diskusikan bersama kelompok mengenai hal berharga yang telah dipelajari dan komitmen kebiasaan sehat sehari-hari untuk menjaga organ tubuh.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ fontWeight: 700, fontSize: "0.9rem", display: "block", marginBottom: "4px" }}>
                    1. Konsep Utama yang Berhasil Kelompok Kami Pahami:
                  </label>
                  <textarea
                    rows="2"
                    value={exitTicket.conceptUnderstood}
                    onChange={(e) => {
                      const updated = { ...exitTicket, conceptUnderstood: e.target.value };
                      setExitTicket(updated);
                      persistProgress({ exitTicket: updated });
                    }}
                    placeholder="Contoh: Kami memahami bahwa sistem pencernaan, sirkulasi darah, napas, dan ekskresi bekerja terhubung menjaga homeostasis..."
                    className="student-textarea"
                  />
                </div>

                <div>
                  <label style={{ fontWeight: 700, fontSize: "0.9rem", display: "block", marginBottom: "4px" }}>
                    2. Pengalaman Menarik Saat Menjalankan Eksperimen di Game METABODY:
                  </label>
                  <textarea
                    rows="2"
                    value={exitTicket.gameExperience}
                    onChange={(e) => {
                      const updated = { ...exitTicket, gameExperience: e.target.value };
                      setExitTicket(updated);
                      persistProgress({ exitTicket: updated });
                    }}
                    placeholder="Contoh: Sangat seru melihat bagaimana saat Si Meta berolahraga, laju napas dan denyut jantung meningkat bersamaan dengan keringat..."
                    className="student-textarea"
                  />
                </div>

                <div>
                  <label style={{ fontWeight: 700, fontSize: "0.9rem", display: "block", marginBottom: "4px" }}>
                    3. Pertanyaan / Rasa Ingin Tahu yang Masih Ingin Kami Pelajari Lebih Lanjut:
                  </label>
                  <textarea
                    rows="2"
                    value={exitTicket.questionsRemaining}
                    onChange={(e) => {
                      const updated = { ...exitTicket, questionsRemaining: e.target.value };
                      setExitTicket(updated);
                      persistProgress({ exitTicket: updated });
                    }}
                    placeholder="Contoh: Bagaimana teknologi cuci darah (hemodialisis) bekerja meniru nefron ginjal manusia?"
                    className="student-textarea"
                  />
                </div>

                <div>
                  <label style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--color-accent-green-dark)", display: "block", marginBottom: "4px" }}>
                    4. Komitmen 1 Kebiasaan Hidup Sehat yang Akan Diterapkan:
                  </label>
                  <textarea
                    rows="2"
                    value={exitTicket.healthyHabit}
                    onChange={(e) => {
                      const updated = { ...exitTicket, healthyHabit: e.target.value };
                      setExitTicket(updated);
                      persistProgress({ exitTicket: updated });
                    }}
                    placeholder="Contoh: Saya berkomitmen rutin minum air putih minimal 2 liter per hari, tidak menahan buang air kecil, dan membatasi gorengan asin..."
                    className="student-textarea"
                    style={{ border: "none", outline: "none", background: "rgba(16, 185, 129, 0.08)", borderRadius: "10px", padding: "12px" }}
                  />
                </div>
              </div>
            </div>

            {/* Rangkuman Cetak Laporan Fisik Komprehensif (Terlihat saat Print PDF) */}
            <div className="print-only-block" style={{ display: "none", borderTop: "2px solid #0F172A", paddingTop: "14px", marginTop: "20px" }}>
              <h3 style={{ textAlign: "center", marginBottom: "4px" }}>
                LEMBAR KERJA PENYELIDIKAN & EVALUASI SISTEM EKSKRESI
              </h3>
              <p style={{ textAlign: "center", fontSize: "0.85rem", color: "#64748B", marginBottom: "16px" }}>
                SMP Negeri 25 Malang • Kurikulum Merdeka Fase D Kelas VIII • Media Pembelajaran METABODY
              </p>

              <div style={{ marginBottom: "12px", fontSize: "0.88rem", lineHeight: "1.6" }}>
                <strong>Kelompok:</strong> {teamData.groupName} (Kelompok {teamData.groupNumber}) | <strong>Kode Sesi:</strong> {teamData.sessionCode}<br />
                <strong>Ketua:</strong> {teamData.leaderName} | <strong>Pengamat:</strong> {teamData.observerName || "-"} | <strong>Pencatat:</strong> {teamData.recorderName || "-"} | <strong>Pilot IFP:</strong> {teamData.pilotName || "-"} | <strong>Penyaji:</strong> {teamData.presenterName || "-"}
              </div>

              <div style={{ marginBottom: "14px" }}>
                <strong>Hasil Model 3 Tahap Urine:</strong><br />
                1. {urinePhases.p1.phase || "Filtrasi"} di {urinePhases.p1.location || "Glomerulus"} ➔ {urinePhases.p1.result || "Urine Primer"}<br />
                2. {urinePhases.p2.phase || "Reabsorpsi"} di {urinePhases.p2.location || "TKP"} ➔ {urinePhases.p2.result || "Urine Sekunder"}<br />
                3. {urinePhases.p3.phase || "Augmentasi"} di {urinePhases.p3.location || "TKD"} ➔ {urinePhases.p3.result || "Urine Sesungguhnya"}
              </div>

              <div style={{ marginBottom: "14px" }}>
                <strong>Analisis Inkuiri Diskusi Kelompok:</strong><br />
                1. Alur Zat Sisa: {lkpdData.q1 || "-"}<br />
                2. Hubungan Olahraga & Keringat: {lkpdData.q2 || "-"}<br />
                3. Hubungan Darah & Ginjal: {lkpdData.q3 || "-"}<br />
                4. Pembagian Peran 4 Organ: {lkpdData.q4 || "-"}
              </div>

              <div style={{ marginBottom: "14px" }}>
                <strong>Capaian 4 Indikator Berpikir Sistemik (Systems Thinking):</strong><br />
                {(() => {
                  const preInd = calculateIndicatorScores(pretestAnswers, PRETEST_QUESTIONS);
                  const postInd = posttestScore !== null ? calculateIndicatorScores(posttestAnswers, POSTTEST_QUESTIONS) : null;
                  return (
                    <span style={{ fontSize: "0.84rem", lineHeight: "1.5" }}>
                      • 1. Komponen & Organ: Pre {preInd.komponen}% ➔ Post {postInd ? `${postInd.komponen}%` : "-"}%<br />
                      • 2. Keterhubungan Dinamis: Pre {preInd.keterhubungan}% ➔ Post {postInd ? `${postInd.keterhubungan}%` : "-"}%<br />
                      • 3. Regulasi Homeostasis: Pre {preInd.regulasi}% ➔ Post {postInd ? `${postInd.regulasi}%` : "-"}%<br />
                      • 4. Prediksi Gangguan Faal: Pre {preInd.prediksi}% ➔ Post {postInd ? `${postInd.prediksi}%` : "-"}%
                    </span>
                  );
                })()}
              </div>

              <div style={{ marginBottom: "14px" }}>
                <strong>Komitmen Pola Hidup Sehat:</strong><br />
                <em>"{exitTicket.healthyHabit || "-"}"</em>
              </div>
            </div>

            <GameButton
              onClick={() => window.print()}
              variant="blue"
              shape="rect"
              size="md"
              sound="confirm"
              style={{ width: "100%" }}
            >
              🖨️ Cetak / Simpan Laporan Kelompok (PDF)
            </GameButton>
          </div>
        )}
      </div>
    </div>
  );
}
