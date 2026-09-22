import { create } from "zustand";
import { MISSIONS } from "../data/missionsData";
import { SANDBOX_PRESETS } from "../data/sandboxPresets";
import {
  calculateHomeostasis,
  stepSimulation,
  applyUserAction,
  applyReabsorption,
  basicFiltration,
  determineSiMetaPose
} from "../engine/simulationMath";

/**
 * Logika evaluasi instruksi aksi target real-time berdasarkan kondisi fisiologis & misi
 */
export function evaluateActionCue(telemetry, activeMission, isTutorialActive, tutorialStep) {
  if (isTutorialActive) {
    switch (tutorialStep) {
      case 1:
        return {
          station: "hud",
          role: "Semua Operator",
          actionKey: null,
          label: "Perhatikan Papan Pantau Tubuh (Bio-HUD) di atas",
          reason: "Lihat Bar Homeostasis untuk memantau keseimbangan tubuh Si Meta.",
          priority: "normal"
        };
      case 2:
        return {
          station: "nutrisi",
          role: "Operator Nutrisi (Kiri)",
          actionKey: "DRINK_WATER",
          label: "Tekan tombol 'Beri Minum Air'",
          reason: "Beri cairan agar hidrasi Si Meta tetap terjaga.",
          priority: "warning"
        };
      case 3:
        return {
          station: "kardio",
          role: "Operator Kardiorespirasi (Tengah)",
          actionKey: "TAKE_REST_BREATH",
          label: "Tekan tombol 'Atur Napas Lambat'",
          reason: "Rilekskan paru-paru untuk menstabilkan detak jantung.",
          priority: "warning"
        };
      case 4:
      default:
        return {
          station: "ready",
          role: "Tim Siap",
          actionKey: null,
          label: "Klik 'Mulai Simulasi Penuh!'",
          reason: "Latihan selesai! Uji koordinasi kalian menjaga tubuh Si Meta.",
          priority: "normal"
        };
    }
  }

  // 1. Kondisi Kritis (Homeostasis Bahaya)
  if (telemetry.hydration < 50) {
    return {
      station: "nutrisi",
      role: "Operator Nutrisi (Kiri)",
      actionKey: "DRINK_WATER",
      label: "Segera Beri Minum Air!",
      reason: "Si Meta dehidrasi berat! Cairan tubuh kritis!",
      priority: "critical"
    };
  }
  if (telemetry.ureaLevel > 35) {
    return {
      station: "ekskresi",
      role: "Operator Ekskresi (Kanan)",
      actionKey: "NEPHRON_FILTER",
      label: "Bilas Glomerulus Ginjal!",
      reason: "Racun urea menumpuk dan meracuni darah!",
      priority: "critical"
    };
  }
  if (telemetry.heartRate > 135 || telemetry.coreTemp > 38.3) {
    return {
      station: "kardio",
      role: "Operator Kardio (Tengah)",
      actionKey: "TAKE_REST_BREATH",
      label: "Atur Napas Lambat!",
      reason: "Jantung & suhu tubuh Si Meta terlampau tinggi!",
      priority: "critical"
    };
  }
  if (telemetry.bloodOsmolality > 305) {
    return {
      station: "nutrisi",
      role: "Operator Nutrisi (Kiri)",
      actionKey: "DRINK_WATER",
      label: "Beri Minum Air!",
      reason: "Darah terlalu kental dan pekat!",
      priority: "critical"
    };
  }
  if ((telemetry.liverLoad ?? 10) > 60) {
    return {
      station: "ekskresi",
      role: "Operator Ekskresi (Kanan)",
      actionKey: "LIVER_DETOX_BOOST",
      label: "Aktifkan Detoks Hati!",
      reason: "Hati kelebihan beban amonia, lemak trans & zat aditif!",
      priority: "critical"
    };
  }
  if ((telemetry.additiveLoad ?? 0) > 55) {
    return {
      station: "ekskresi",
      role: "Operator Ekskresi (Kanan)",
      actionKey: "LIVER_DETOX_BOOST",
      label: "Bersihkan Zat Aditif!",
      reason: "Pewarna, MSG & pengawet menumpuk! Bantu hati mendetoks!",
      priority: "critical"
    };
  }
  if ((telemetry.saltLevel ?? 140) > 165) {
    return {
      station: "ekskresi",
      role: "Operator Ekskresi (Kanan)",
      actionKey: "NEPHRON_FILTER",
      label: "Buang Kelebihan Garam!",
      reason: "Natrium menumpuk! Tekanan darah melonjak, ginjal harus membuangnya!",
      priority: "critical"
    };
  }

  // 2. Kondisi Peringatan (Warning)
  if (telemetry.hydration < 72) {
    return {
      station: "nutrisi",
      role: "Operator Nutrisi (Kiri)",
      actionKey: "DRINK_WATER",
      label: "Beri Minum Air",
      reason: "Cegah dehidrasi agar Si Meta tidak lemas.",
      priority: "warning"
    };
  }
  if (telemetry.ureaLevel > 26) {
    return {
      station: "ekskresi",
      role: "Operator Ekskresi (Kanan)",
      actionKey: "NEPHRON_FILTER",
      label: "Saring Darah di Ginjal",
      reason: "Bersihkan sisa metabolisme sebelum meningkat.",
      priority: "warning"
    };
  }
  if ((telemetry.saltLevel ?? 140) > 150) {
    return {
      station: "ekskresi",
      role: "Operator Ekskresi (Kanan)",
      actionKey: "NEPHRON_FILTER",
      label: "Kurangi Retensi Garam",
      reason: "Garam natrium berlebih menahan air dan membebani jantung serta ginjal.",
      priority: "warning"
    };
  }
  if ((telemetry.energy ?? 80) < 35) {
    return {
      station: "nutrisi",
      role: "Operator Nutrisi (Kiri)",
      actionKey: "EAT_BALANCED_MEAL",
      label: "Beri Makan Gizi Seimbang",
      reason: "Sel kehabisan energi! Isi dengan nasi, lauk, sayur & buah.",
      priority: "warning"
    };
  }
  if ((telemetry.liverLoad ?? 10) > 40) {
    return {
      station: "ekskresi",
      role: "Operator Ekskresi (Kanan)",
      actionKey: "LIVER_DETOX_BOOST",
      label: "Bantu Detoks Hati",
      reason: "Hati mulai lelah mengolah amonia & lemak. Aktifkan detoks!",
      priority: "warning"
    };
  }
  if (telemetry.heartRate > 105) {
    return {
      station: "kardio",
      role: "Operator Kardio (Tengah)",
      actionKey: "TAKE_REST_BREATH",
      label: "Stabilkan Ritme Napas",
      reason: "Kendalikan frekuensi napas agar ritme jantung normal.",
      priority: "warning"
    };
  }

  // 3. Misi Spesifik / Kickoff
  if (activeMission?.id === 2) {
    return {
      station: "kardio",
      role: "Operator Kardiorespirasi",
      actionKey: "TAKE_REST_BREATH",
      label: "Pantau Napas & Suhu Tubuh",
      reason: "Si Meta sedang lari lapangan, pernapasan bekerja keras.",
      priority: "normal"
    };
  }
  if (activeMission?.id === 3) {
    return {
      station: "nutrisi",
      role: "Operator Nutrisi",
      actionKey: "DRINK_WATER",
      label: "Pasok Air Minum Teratur",
      reason: "Cuaca terik siang hari memicu keluarnya keringat deras.",
      priority: "normal"
    };
  }
  if (activeMission?.id === 4) {
    return {
      station: "ekskresi",
      role: "Operator Ekskresi",
      actionKey: "NEPHRON_FILTER",
      label: "Pantau Retensi Garam & Nefron",
      reason: "Camilan gurih asin meningkatkan kepekatan osmolalitas darah.",
      priority: "normal"
    };
  }
  if (activeMission?.id === 5) {
    return {
      station: "ekskresi",
      role: "Operator Ekskresi",
      actionKey: "NEPHRON_FILTER",
      label: "Uji Filtrasi Nefron Ginjal",
      reason: "Optimalkan penyaringan racun dan reabsorpsi cairan.",
      priority: "normal"
    };
  }

  return {
    station: "nutrisi",
    role: "Tim Si Meta",
    actionKey: "DRINK_WATER",
    label: "Pertahankan Keseimbangan",
    reason: "Kondisi tubuh stabil dan prima! Terus pantau kondisi tubuh Si Meta.",
    priority: "normal"
  };
}

// Memuat progress misi dari localStorage
function loadMissionProgress() {
  try {
    const saved = localStorage.getItem("metabody_progress");
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn("[Metabody] Progress korup/kepenuhan, reset ke awal:", e?.message);
  }
  const initial = {};
  MISSIONS.forEach((m) => { initial[m.id] = { completed: false, stars: 0 }; });
  return initial;
}

function saveMissionProgress(progress) {
  try { localStorage.setItem("metabody_progress", JSON.stringify(progress)); } catch (e) {
    console.warn("[Metabody] Gagal menyimpan progress (quota penuh/mode privat):", e?.message);
  }
}

// Inisialisasi cooldown kosong
const EMPTY_COOLDOWNS = {
  DRINK_WATER: 0,
  TAKE_REST_BREATH: 0,
  NEPHRON_FILTER: 0,
  NEPHRON_CALIBRATE_FILTER: 0,
  NEPHRON_REABSORPTION_BOOST: 0,
  NEPHRON_FLUSH_TOXINS: 0,
  SPEED_UP_RUN: 0,
  SLOW_DOWN_RUN: 0,
  EAT_BALANCED_MEAL: 0,
  EAT_INSTANT_SNACK: 0,
  LIVER_DETOX_BOOST: 0
};

// Default telemetri pencernaan-hati-aditif agar save lama tetap kompatibel
const DIGESTION_DEFAULTS = {
  energy: 80,
  liverLoad: 10,
  additiveLoad: 0
};

function withDigestionDefaults(telemetry = {}) {
  return { ...DIGESTION_DEFAULTS, ...telemetry };
}

// In-memory atomic timestamp lock untuk mencegah race condition sentuhan serentak multi-touch IFP (Audit P0)
// JS single-threaded: cek + set berjalan sinkron sehingga aman dari interleave.
// Lock diclear saat ganti misi agar tidak bocor antar sesi.
const atomicActionLocks = {};
const VALID_ACTIONS = new Set([
  "DRINK_WATER",
  "TAKE_REST_BREATH",
  "NEPHRON_FILTER",
  "NEPHRON_CALIBRATE_FILTER",
  "NEPHRON_REABSORPTION_BOOST",
  "NEPHRON_FLUSH_TOXINS",
  "SPEED_UP_RUN",
  "SLOW_DOWN_RUN",
  "EAT_BALANCED_MEAL",
  "EAT_INSTANT_SNACK",
  "LIVER_DETOX_BOOST"
]);

export const useGameStore = create((set, get) => ({
  // Session & Stage Context
  sessionCode: "META-8A",
  currentStage: "gameplay", // 'waiting' | 'pretest' | 'gameplay' | 'posttest' | 'closed'
  isOfflineMode: true,      // Standalone first guarantee

  // Mission State
  activeMissionId: 1,
  activeMission: MISSIONS[0],
  gameStatus: "briefing",   // 'briefing' | 'playing' | 'victory' | 'defeat' | 'paused'
  remainingSeconds: 90,
  elapsedSeconds: 0,

  // Tutorial State (Onboarding Misi 1)
  isTutorialActive: true,
  tutorialStep: 1,          // 1: Cek HUD, 2: Minum Air, 3: Atur Napas, 4: Selesai

  // Story Narrative Dialogues (Visual Novel Character Dialog Box)
  storyDialogueIndex: 0,
  isCrisisDialogueActive: false,
  crisisDialogue: null,
  crisisEventsSeen: {
    dehydration: false,
    urea: false,
    tachycardia: false
  },

  // Real-time Action Cue Banner
  currentActionCue: evaluateActionCue(MISSIONS[0].initialState, MISSIONS[0], true, 1),
  cueChangeId: 1,           // incremented to trigger chime audio

  // Telemetry & Homeostasis
  telemetry: { ...MISSIONS[0].initialState },
  homeostasisIndex: 100,
  currentPose: "simeta_idle_happy.png",
  earnedStars: 3,
  badgeUnlocked: null,

  // Action Cooldown System (Audit #1)
  actionCooldowns: { ...EMPTY_COOLDOWNS },

  // Action Feedback / Juice (Audit #2)
  lastAction: null,       // { type: 'DRINK_WATER', timestamp: Date.now() }
  actionFeedback: null,   // { label: '+14% Hidrasi', color: 'green', timestamp: Date.now() }

  // Persistent Mission Progress (Audit #4)
  missionProgress: loadMissionProgress(),

  // Pause state tracking (Audit #5)
  _previewStatus: null,   // status sebelum pause (untuk resume)

  // UI Modals
  isMicroLensOpen: false,
  isMissionMapOpen: false,
  isKamusOpen: false,
  isSoundMuted: false,
  showExitConfirm: false,

  // Telemetry History Snapshot (Untuk Salin ke LKPD)
  telemetrySnapshot: null,

  // Nephron 3 Molecular Gates State (Misi 5 & MicroNephronModal)
  nephronState: {
    filtrationCalibrated: true,
    reabsorptionRate: 100, // %
    augmentationFlushed: false,
    stageFeedback: {
      filtration: "optimal",
      reabsorption: "optimal",
      augmentation: "ready"
    },
    message: ""
  },

  // Mode Sandbox Laboratorium Bebas
  isSandboxMode: false,
  activeSandboxPreset: "NORMAL",
  sandboxStressors: {
    activityLevel: 0,    // 0: Istirahat, 1: Jalan, 2: Lari, 3: Sprint
    ambientTemp: 26,     // °C
    hydrationLevel: 90,  // %
    ureaLoad: 15         // mg/dL
  },
  sandboxElapsedSeconds: 0,

  // ------------------------------------------------------------------------
  // ACTIONS
  // ------------------------------------------------------------------------

  setSessionCode: (code) => set({ sessionCode: code }),
  setStage: (stage) => set({ currentStage: stage }),
  toggleSound: () => set((state) => ({ isSoundMuted: !state.isSoundMuted })),
  toggleOfflineMode: () => set((state) => ({ isOfflineMode: !state.isOfflineMode })),

  openMicroLens: () => set({ isMicroLensOpen: true }),
  closeMicroLens: () => set({ isMicroLensOpen: false }),
  openKamus: () => set({ isKamusOpen: true }),
  closeKamus: () => set({ isKamusOpen: false }),
  openMissionMap: () => set({ isMissionMapOpen: true }),
  closeMissionMap: () => set({ isMissionMapOpen: false }),
  setShowExitConfirm: (val) => set({ showExitConfirm: val }),

  // ---- Nephron 3 Molecular Gatekeeper Handlers (Misi 5) ----
  calibrateGlomerulus: () => {
    const { gameStatus, telemetry } = get();
    if (gameStatus === "playing") {
      get().triggerAction("NEPHRON_CALIBRATE_FILTER");
    } else {
      const updated = applyUserAction(telemetry, "NEPHRON_CALIBRATE_FILTER");
      set({ telemetry: updated, homeostasisIndex: calculateHomeostasis(updated) });
    }
    set((state) => ({
      nephronState: {
        ...state.nephronState,
        filtrationCalibrated: true,
        stageFeedback: {
          ...state.nephronState.stageFeedback,
          filtration: "optimal"
        },
        message: "Membran glomerulus terkalibrasi ke 8 nm! Sel darah & protein tertahan sempurna di pembuluh darah."
      }
    }));
  },

  setReabsorptionRate: (rate) => {
    const isOptimal = rate >= 85;
    const { gameStatus, telemetry } = get();
    if (isOptimal) {
      if (gameStatus === "playing") {
        get().triggerAction("NEPHRON_REABSORPTION_BOOST");
      } else {
        const updated = applyUserAction(telemetry, "NEPHRON_REABSORPTION_BOOST");
        set({ telemetry: updated, homeostasisIndex: calculateHomeostasis(updated) });
      }
    } else {
      // Sub-optimal: glukosa + air bocor ke urine — terapkan langsung agar ada konsekuensi nyata.
      // Sengaja tanpa cooldown: ini penalti, bukan aksi penyelamat.
      const updated = applyReabsorption(telemetry, rate);
      const updatedHI = calculateHomeostasis(updated);
      const updatedPose = determineSiMetaPose(gameStatus, updatedHI, updated);
      set({
        telemetry: updated,
        homeostasisIndex: updatedHI,
        currentPose: updatedPose,
        actionFeedback: {
          label: `− Glukosa bocor! Serap ${rate}% (Glukosuria)`,
          color: "red",
          timestamp: Date.now()
        }
      });
    }
    set((state) => ({
      nephronState: {
        ...state.nephronState,
        reabsorptionRate: rate,
        stageFeedback: {
          ...state.nephronState.stageFeedback,
          reabsorption: isOptimal ? "optimal" : "glucose_leak"
        },
        message: isOptimal
          ? `${rate}% Reabsorpsi Optimal: 100% glukosa & air ditarik kembali ke darah!`
          : `⚠️ Daya serap ${rate}%: Waspada! Glukosa berharga bocor ke urine primer (Glukosuria)!`
      }
    }));
  },

  flushNephronAugmentation: () => {
    const { gameStatus, telemetry } = get();
    if (gameStatus === "playing") {
      get().triggerAction("NEPHRON_FLUSH_TOXINS");
    } else {
      const updated = applyUserAction(telemetry, "NEPHRON_FLUSH_TOXINS");
      set({ telemetry: updated, homeostasisIndex: calculateHomeostasis(updated) });
    }
    set((state) => ({
      nephronState: {
        ...state.nephronState,
        augmentationFlushed: true,
        stageFeedback: {
          ...state.nephronState.stageFeedback,
          augmentation: "flushed"
        },
        message: "Katup augmentasi terbuka! Racun urea & kelebihan natrium berhasil dibuang keluar tubuh."
      }
    }));
  },

  // ---- Tutorial Handlers (Onboarding Misi 1) ----
  nextTutorialStep: () => {
    const { tutorialStep, telemetry, activeMission } = get();
    const nextStep = tutorialStep + 1;
    if (nextStep > 4) {
      get().finishTutorial();
    } else {
      const newCue = evaluateActionCue(telemetry, activeMission, true, nextStep);
      set((state) => ({
        tutorialStep: nextStep,
        currentActionCue: newCue,
        cueChangeId: state.cueChangeId + 1
      }));
    }
  },

  skipTutorial: () => {
    const { telemetry, activeMission } = get();
    const newCue = evaluateActionCue(telemetry, activeMission, false, 0);
    set((state) => ({
      isTutorialActive: false,
      tutorialStep: 0,
      currentActionCue: newCue,
      cueChangeId: state.cueChangeId + 1
    }));
  },

  finishTutorial: () => {
    const { telemetry, activeMission } = get();
    const newCue = evaluateActionCue(telemetry, activeMission, false, 0);
    set((state) => ({
      isTutorialActive: false,
      tutorialStep: 0,
      currentActionCue: newCue,
      cueChangeId: state.cueChangeId + 1
    }));
  },

  // ---- Story Narrative & Crisis Dialogues (Audit RPG Dialog) ----
  nextStoryDialogue: () => {
    const { activeMission, storyDialogueIndex } = get();
    const dialogues = activeMission.storyDialogues || [];
    const nextIdx = storyDialogueIndex + 1;
    if (nextIdx >= dialogues.length) {
      // Selesai membaca narasi, langsung mulai simulasi!
      get().startGameplay();
    } else {
      set({ storyDialogueIndex: nextIdx });
    }
  },

  skipStoryDialogue: () => {
    get().startGameplay();
  },

  triggerCrisisDialogue: (type) => {
    const { isCrisisDialogueActive, gameStatus } = get();
    if (isCrisisDialogueActive || gameStatus !== "playing") return;

    let dialogue = null;
    if (type === "dehydration") {
      dialogue = {
        speaker: "Si Meta",
        role: "Krisis Dehidrasi",
        pose: "simeta_thirsty_parched.png",
        text: "Aduh! Tenggorokanku terbakar dan kepalaku pusing! Operator Nutrisi di Stasiun Kiri, tolong segera tekan tombol 'Beri Minum Air'!",
        targetAction: "DRINK_WATER",
        priority: "critical"
      };
    } else if (type === "urea") {
      dialogue = {
        speaker: "Si Meta",
        role: "Keracunan Urea",
        pose: "simeta_dizzy_collapse.png",
        text: "Gawat! Racun urea di darahku melebihi batas aman dan mulai meracuni sel! Operator Ekskresi di Stasiun Kanan, cepat bilas nefron ginjal!",
        targetAction: "NEPHRON_FILTER",
        priority: "critical"
      };
    } else if (type === "tachycardia") {
      dialogue = {
        speaker: "Si Meta",
        role: "Suhu & Jantung Kritis",
        pose: "simeta_running_sweat.png",
        text: "Jantungku berdegup terlalu kencang dan suhu badanku naik tinggi! Operator Kardiorespirasi di Stasiun Tengah, segera atur napas rileks!",
        targetAction: "TAKE_REST_BREATH",
        priority: "critical"
      };
    } else if (type === "liver") {
      dialogue = {
        speaker: "Si Meta",
        role: "Hati Lelah (Beban Detoks)",
        pose: "simeta_thirsty_parched.png",
        text: "Aduh, ulu hatiku terasa penuh dan mual! Hati bekerja keras mengubah amonia, lemak trans & zat aditif jadi urea. Operator Ekskresi di Stasiun Kanan, aktifkan Detoks Hati dan hindari jajan instan dulu ya!",
        targetAction: "LIVER_DETOX_BOOST",
        priority: "critical"
      };
    } else if (type === "energy") {
      dialogue = {
        speaker: "Si Meta",
        role: "Energi Drop (Lapar Nutrien)",
        pose: "simeta_thirsty_parched.png",
        text: "Perutku keroncongan dan badanku lemas! Sel-selku kehabisan glukosa dari makanan. Operator Nutrisi, beri aku makan gizi seimbang: nasi, lauk, sayur & buah!",
        targetAction: "EAT_BALANCED_MEAL",
        priority: "critical"
      };
    } else if (type === "misi5_filtrasi") {
      dialogue = {
        speaker: "Si Meta",
        role: "Glomerulus Tersumbat",
        pose: "simeta_dizzy_collapse.png",
        text: "Pori membran glomerulusku tersumbat kotoran protein! Buka Kaca Pembesar Nefron di atas dan putar kalibrasi membran ke ukuran 8 nm!",
        targetAction: "openMicroLens",
        priority: "critical"
      };
    } else if (type === "misi5_reabsorpsi") {
      dialogue = {
        speaker: "Si Meta",
        role: "Peringatan Glukosuria",
        pose: "simeta_thirsty_parched.png",
        text: "Daya serap tubulus proksimal melemah! Glukosa energiku bocor ke urine! Buka Lab Nefron dan geser slider daya serap ke 100%!",
        targetAction: "openMicroLens",
        priority: "critical"
      };
    } else if (type === "misi5_augmentasi") {
      dialogue = {
        speaker: "Si Meta",
        role: "Toksin Urea Kritis",
        pose: "simeta_dizzy_collapse.png",
        text: "Urea dan amonia sudah menumpuk di tubulus distal! Buka Lab Nefron dan tarik katup buang racun augmentasi sekarang!",
        targetAction: "openMicroLens",
        priority: "critical"
      };
    }

    if (dialogue) {
      set((state) => ({
        isCrisisDialogueActive: true,
        crisisDialogue: dialogue,
        gameStatus: "paused",
        _previewStatus: "playing",
        cueChangeId: state.cueChangeId + 1
      }));
    }
  },

  dismissCrisisDialogue: () => {
    const { crisisDialogue, _previewStatus } = get();
    const targetAction = crisisDialogue?.targetAction;
    set({
      isCrisisDialogueActive: false,
      crisisDialogue: null,
      gameStatus: _previewStatus || "playing",
      _previewStatus: null
    });
    if (targetAction === "openMicroLens") {
      get().openMicroLens();
    }
    // Sorot tombol penyelamat
    if (targetAction) {
      const { telemetry, activeMission } = get();
      const newCue = evaluateActionCue(telemetry, activeMission, false, 0);
      set((state) => ({
        currentActionCue: {
          ...newCue,
          actionKey: targetAction,
          priority: "critical"
        },
        cueChangeId: state.cueChangeId + 1
      }));
    }
  },

  // ---- Pause / Resume (Audit #5) ----
  pauseGame: () => {
    const { gameStatus } = get();
    if (gameStatus !== "playing") return;
    set({ gameStatus: "paused", _previewStatus: "playing" });
  },

  resumeGame: () => {
    const { gameStatus } = get();
    if (gameStatus !== "paused") return;
    set({ gameStatus: "playing", _previewStatus: null });
  },

  // Inisialisasi Misi
  selectMission: (missionId) => {
    const mission = MISSIONS.find((m) => m.id === missionId) || MISSIONS[0];
    const initialTelemetry = withDigestionDefaults(mission.initialState);
    const initialHI = calculateHomeostasis(initialTelemetry);
    const initialPose = determineSiMetaPose("briefing", initialHI, initialTelemetry);
    const isTutorial = mission.id === 1;
    const initialCue = evaluateActionCue(initialTelemetry, mission, isTutorial, isTutorial ? 1 : 0);

    // Bersihkan atomic timestamp lock
    for (const key in atomicActionLocks) {
      delete atomicActionLocks[key];
    }

    set((state) => ({
      activeMissionId: mission.id,
      activeMission: mission,
      telemetry: initialTelemetry,
      homeostasisIndex: initialHI,
      currentPose: initialPose,
      remainingSeconds: mission.durationSeconds,
      elapsedSeconds: 0,
      gameStatus: "briefing",
      earnedStars: 3,
      badgeUnlocked: null,
      actionCooldowns: { ...EMPTY_COOLDOWNS },
      lastAction: null,
      actionFeedback: null,
      isMicroLensOpen: false,
      isKamusOpen: false,
      showExitConfirm: false,
      isTutorialActive: isTutorial,
      tutorialStep: isTutorial ? 1 : 0,
      storyDialogueIndex: 0,
      isCrisisDialogueActive: false,
      crisisDialogue: null,
      crisisEventsSeen: {
        dehydration: false,
        urea: false,
        tachycardia: false,
        liver: false,
        energy: false,
        misi5_filtrasi: false,
        misi5_reabsorpsi: false,
        misi5_augmentasi: false
      },
      nephronState: {
        filtrationCalibrated: mission.id !== 5,
        reabsorptionRate: mission.id === 5 ? 70 : 100,
        augmentationFlushed: false,
        stageFeedback: {
          filtration: mission.id === 5 ? "clogged" : "optimal",
          reabsorption: mission.id === 5 ? "glucose_leak" : "optimal",
          augmentation: "ready"
        },
        message: mission.id === 5 ? "⚠️ Pori saringan glomerulus tersumbat! Kalibrasi ke 8 nm untuk memulai pembentukan urine." : ""
      },
      currentActionCue: initialCue,
      cueChangeId: state.cueChangeId + 1
    }));
  },

  // Memulai Timer Gameplay
  startGameplay: () => {
    const { activeMissionId, telemetry, activeMission } = get();
    const isTutorial = activeMissionId === 1;
    const initialCue = evaluateActionCue(telemetry, activeMission, isTutorial, isTutorial ? 1 : 0);
    set((state) => ({
      gameStatus: "playing",
      isTutorialActive: isTutorial,
      tutorialStep: isTutorial ? 1 : 0,
      currentActionCue: initialCue,
      cueChangeId: state.cueChangeId + 1
    }));
  },

  // Jantung Simulasi (Dipanggil setiap 1 detik)
  tick: () => {
    const {
      gameStatus,
      remainingSeconds,
      elapsedSeconds,
      telemetry,
      activeMission,
      actionCooldowns,
      isTutorialActive,
      crisisEventsSeen
    } = get();

    // Skip tick saat pause, briefing, atau game over
    if (gameStatus !== "playing") return;

    // Mode Sandbox: lab hidup — telemetri meluruh tiap detik sesuai stresor,
    // tanpa countdown kalah (eksplorasi bebas)
    if (get().isSandboxMode) {
      const newElapsed = (get().sandboxElapsedSeconds || 0) + 1;
      const newCooldowns = { ...actionCooldowns };
      for (const key in newCooldowns) {
        if (newCooldowns[key] > 0) {
          newCooldowns[key] = Math.max(0, newCooldowns[key] - 1);
        }
      }
      const stress = get().sandboxStressors || {};
      // activityLevel bisa angka (slider 0-3) atau label preset ("Resting"/"Moderate"/"Extreme")
      const actRaw = stress.activityLevel;
      const actIdx = typeof actRaw === "number"
        ? Math.max(0, Math.min(3, actRaw))
        : { resting: 0, moderate: 1, extreme: 2 }[String(actRaw || "").toLowerCase()] ?? 0;
      const ambient = Number(stress.ambientTemp) || 26;
      const ureaLoad = Number(stress.ureaLoad) || 15;
      const heat = Math.max(0, ambient - 26);
      const sandboxDecay = {
        hydrationDecay: 0.05 + actIdx * 0.08 + heat * 0.015,
        tempDelta: 0.01 + actIdx * 0.02 + Math.max(0, ambient - 30) * 0.01,
        heartRateDelta: 0.05 + actIdx * 0.08,
        ureaAccumulation: 0.05 + (ureaLoad > 20 ? 0.08 : 0),
        energyDecay: 0.03 + actIdx * 0.04,
        liverStrain: 0.01 + (ureaLoad > 20 ? 0.02 : 0)
      };
      const newTelemetry = stepSimulation(telemetry, sandboxDecay, 1);
      const newHI = calculateHomeostasis(newTelemetry);
      const newPose = determineSiMetaPose(gameStatus, newHI, newTelemetry);
      set({
        sandboxElapsedSeconds: newElapsed,
        actionCooldowns: newCooldowns,
        telemetry: newTelemetry,
        homeostasisIndex: newHI,
        currentPose: newPose
      });
      return;
    }

    // Jika tutorial masih aktif, jeda timer & peluruhan faal (safe guided learning)
    if (isTutorialActive) return;

    // Hitung waktu
    const newRemaining = Math.max(0, remainingSeconds - 1);
    const newElapsed = elapsedSeconds + 1;

    // Kurangi semua cooldown aktif (Audit #1)
    const newCooldowns = { ...actionCooldowns };
    for (const key in newCooldowns) {
      if (newCooldowns[key] > 0) {
        newCooldowns[key] = Math.max(0, newCooldowns[key] - 1);
      }
    }

    // Simulasi peluruhan faal
    const newTelemetry = stepSimulation(telemetry, activeMission.decayRates, 1);
    const newHI = calculateHomeostasis(newTelemetry);
    const newPose = determineSiMetaPose(gameStatus, newHI, newTelemetry);

    // Evaluasi event krisis in-game RPG Dialog (Audit Karakter)
    if (!isTutorialActive) {
      // Re-arm krisis umum: setelah pulih cukup jauh (histeresis agar tidak spam),
      // pelanggaran ulang memicu dialog lagi alih-alih sekali per misi.
      let seen = get().crisisEventsSeen;
      const rearm = {};
      if (newTelemetry.hydration >= 60 && seen.dehydration) rearm.dehydration = false;
      if (newTelemetry.ureaLevel <= 25 && seen.urea) rearm.urea = false;
      if (newTelemetry.heartRate <= 110 && seen.tachycardia) rearm.tachycardia = false;
      if ((newTelemetry.liverLoad ?? 10) <= 40 && seen.liver) rearm.liver = false;
      if ((newTelemetry.energy ?? 80) >= 45 && seen.energy) rearm.energy = false;
      if (Object.keys(rearm).length > 0) {
        set((state) => ({ crisisEventsSeen: { ...state.crisisEventsSeen, ...rearm } }));
        seen = { ...seen, ...rearm };
      }
      if (activeMission.id === 5) {
        if (newElapsed >= 15 && !crisisEventsSeen.misi5_filtrasi && !get().nephronState.filtrationCalibrated) {
          set((state) => ({
            crisisEventsSeen: { ...state.crisisEventsSeen, misi5_filtrasi: true }
          }));
          get().triggerCrisisDialogue("misi5_filtrasi");
          return;
        }
        if (newElapsed >= 40 && !crisisEventsSeen.misi5_reabsorpsi && get().nephronState.reabsorptionRate < 85) {
          set((state) => ({
            crisisEventsSeen: { ...state.crisisEventsSeen, misi5_reabsorpsi: true }
          }));
          get().triggerCrisisDialogue("misi5_reabsorpsi");
          return;
        }
        if (newElapsed >= 65 && !crisisEventsSeen.misi5_augmentasi && !get().nephronState.augmentationFlushed) {
          set((state) => ({
            crisisEventsSeen: { ...state.crisisEventsSeen, misi5_augmentasi: true }
          }));
          get().triggerCrisisDialogue("misi5_augmentasi");
          return;
        }
      }

      if (newTelemetry.hydration < 45 && !seen.dehydration) {
        set((state) => ({
          crisisEventsSeen: { ...state.crisisEventsSeen, dehydration: true }
        }));
        get().triggerCrisisDialogue("dehydration");
        return;
      }
      if (newTelemetry.ureaLevel > 35 && !seen.urea) {
        set((state) => ({
          crisisEventsSeen: { ...state.crisisEventsSeen, urea: true }
        }));
        get().triggerCrisisDialogue("urea");
        return;
      }
      if (newTelemetry.heartRate > 135 && !seen.tachycardia) {
        set((state) => ({
          crisisEventsSeen: { ...state.crisisEventsSeen, tachycardia: true }
        }));
        get().triggerCrisisDialogue("tachycardia");
        return;
      }
      if ((newTelemetry.liverLoad ?? 10) > 60 && !seen.liver) {
        set((state) => ({
          crisisEventsSeen: { ...state.crisisEventsSeen, liver: true }
        }));
        get().triggerCrisisDialogue("liver");
        return;
      }
      if ((newTelemetry.energy ?? 80) < 30 && !seen.energy) {
        set((state) => ({
          crisisEventsSeen: { ...state.crisisEventsSeen, energy: true }
        }));
        get().triggerCrisisDialogue("energy");
        return;
      }
    }

    // Evaluasi cue target real-time
    const newCue = evaluateActionCue(newTelemetry, activeMission, false, 0);
    const prevCue = get().currentActionCue;
    const cueChanged = !prevCue || prevCue.label !== newCue.label || prevCue.priority !== newCue.priority;

    // Evaluasi Kondisi Kemenangan / Kekalahan
    if (newHI <= 20) {
      // Kondisi Kolaps — tetap simpan snapshot agar LKPD/refleksi tidak hilang saat kalah
      const collapseSnapshot = {
        missionId: activeMission.id,
        missionTitle: activeMission.title,
        finalHI: newHI,
        hydration: newTelemetry.hydration,
        sweatRate: newTelemetry.sweatRate,
        urineVolume: newTelemetry.urineVolume,
        heartRate: newTelemetry.heartRate,
        coreTemp: newTelemetry.coreTemp,
        energy: newTelemetry.energy ?? 80,
        liverLoad: newTelemetry.liverLoad ?? 10,
        additiveLoad: newTelemetry.additiveLoad ?? 0,
        timestamp: new Date().toLocaleTimeString("id-ID")
      };
      set((state) => ({
        telemetry: newTelemetry,
        homeostasisIndex: newHI,
        currentPose: "simeta_dizzy_collapse.png",
        gameStatus: "defeat",
        remainingSeconds: newRemaining,
        elapsedSeconds: newElapsed,
        telemetrySnapshot: collapseSnapshot,
        actionCooldowns: newCooldowns,
        currentActionCue: newCue,
        cueChangeId: cueChanged ? state.cueChangeId + 1 : state.cueChangeId
      }));
      return;
    }

    if (newRemaining <= 0) {
      // Waktu Habis - Evaluasi Menang
      const won = newHI >= activeMission.winCriteria.minHomeostasis;
      const stars = newHI >= 85 ? 3 : newHI >= 65 ? 2 : 1;
      const finalPose = won ? "simeta_victory_celebrate.png" : "simeta_dizzy_collapse.png";

      // Snapshot data akhir untuk LKPD
      const snapshot = {
        missionId: activeMission.id,
        missionTitle: activeMission.title,
        finalHI: newHI,
        hydration: newTelemetry.hydration,
        sweatRate: newTelemetry.sweatRate,
        urineVolume: newTelemetry.urineVolume,
        heartRate: newTelemetry.heartRate,
        coreTemp: newTelemetry.coreTemp,
        energy: newTelemetry.energy ?? 80,
        liverLoad: newTelemetry.liverLoad ?? 10,
        additiveLoad: newTelemetry.additiveLoad ?? 0,
        timestamp: new Date().toLocaleTimeString("id-ID")
      };

      // Simpan progress misi jika menang (Audit #4)
      if (won) {
        const progress = { ...get().missionProgress };
        const prev = progress[activeMission.id] || { completed: false, stars: 0 };
        progress[activeMission.id] = {
          completed: true,
          stars: Math.max(prev.stars, stars)
        };
        saveMissionProgress(progress);
        set({ missionProgress: progress });
      }

      set((state) => ({
        telemetry: newTelemetry,
        homeostasisIndex: newHI,
        currentPose: finalPose,
        gameStatus: won ? "victory" : "defeat",
        earnedStars: stars,
        remainingSeconds: 0,
        elapsedSeconds: newElapsed,
        telemetrySnapshot: snapshot,
        actionCooldowns: newCooldowns,
        currentActionCue: newCue,
        cueChangeId: cueChanged ? state.cueChangeId + 1 : state.cueChangeId
      }));
      return;
    }

    set((state) => ({
      telemetry: newTelemetry,
      homeostasisIndex: newHI,
      currentPose: newPose,
      remainingSeconds: newRemaining,
      elapsedSeconds: newElapsed,
      actionCooldowns: newCooldowns,
      currentActionCue: newCue,
      cueChangeId: cueChanged ? state.cueChangeId + 1 : state.cueChangeId
    }));
  },

  // Eksekusi Aksi Stasiun Multi-Touch IFP (dengan Cooldown & Atomic Lock — Audit P0)
  triggerAction: (actionType) => {
    if (!actionType || !VALID_ACTIONS.has(actionType)) {
      console.warn("[Metabody] triggerAction ditolak: aksi tidak dikenal:", actionType);
      return;
    }
    const { telemetry, gameStatus, actionCooldowns, activeMission, isTutorialActive, tutorialStep } = get();
    if (gameStatus !== "playing") return;
    if (!activeMission) return;

    // 1. Cek Atomic Timestamp Lock (mencegah simultaneous multi-touch race condition di IFP)
    // Set lock SEBELUM komputasi berat agar tap kedua dalam frame yang sama langsung ditolak.
    const now = Date.now();
    const lastTriggered = atomicActionLocks[actionType] || 0;
    const missionCooldowns = activeMission.cooldowns || {};
    const cooldownDuration = missionCooldowns[actionType] || 5;
    const cooldownMs = cooldownDuration * 950; // buffer toleransi 50ms

    if (now - lastTriggered < cooldownMs || (actionCooldowns[actionType] || 0) > 0) {
      return; // Tolak mentah-mentah jika masih dalam interval cooldown
    }
    atomicActionLocks[actionType] = now;

    // Misi 1–4: tombol stasiun "Saring Nefron" hanya filtrasi awal (efek separuh).
    // Pembersihan tuntas butuh 3 gerbang nefron (Misi 5 / Lab Nefron via NEPHRON_CALIBRATE_FILTER).
    const updatedTelemetry = (actionType === "NEPHRON_FILTER" && activeMission.id !== 5)
      ? basicFiltration(telemetry)
      : applyUserAction(telemetry, actionType);
    const updatedHI = calculateHomeostasis(updatedTelemetry);
    const updatedPose = determineSiMetaPose(gameStatus, updatedHI, updatedTelemetry);

    // Hitung perubahan untuk feedback visual (Audit #2)
    const hiDelta = updatedHI - get().homeostasisIndex;
    const feedbackLabel = actionType === "DRINK_WATER"
      ? `+${Math.round(updatedTelemetry.hydration - telemetry.hydration)}% Hidrasi`
      : actionType === "TAKE_REST_BREATH"
      ? `−${Math.round(telemetry.heartRate - updatedTelemetry.heartRate)} BPM`
      : actionType === "NEPHRON_FILTER" || actionType === "NEPHRON_CALIBRATE_FILTER"
      ? `−${Math.round(telemetry.ureaLevel - updatedTelemetry.ureaLevel)} Urea (Filtrasi)`
      : actionType === "NEPHRON_REABSORPTION_BOOST"
      ? `+${Math.round(updatedTelemetry.hydration - telemetry.hydration)}% Air (Reabsorpsi)`
      : actionType === "NEPHRON_FLUSH_TOXINS"
      ? `−${Math.round(telemetry.ureaLevel - updatedTelemetry.ureaLevel)} Urea (Augmentasi)`
      : actionType === "EAT_BALANCED_MEAL"
      ? `+${Math.round((updatedTelemetry.energy ?? 80) - (telemetry.energy ?? 80))} Energi (Gizi Seimbang)`
      : actionType === "EAT_INSTANT_SNACK"
      ? `+${Math.round((updatedTelemetry.additiveLoad ?? 0) - (telemetry.additiveLoad ?? 0))} Aditif! Hati +${Math.round((updatedTelemetry.liverLoad ?? 10) - (telemetry.liverLoad ?? 10))}`
      : actionType === "LIVER_DETOX_BOOST"
      ? `−${Math.round((telemetry.liverLoad ?? 10) - (updatedTelemetry.liverLoad ?? 10))} Beban Hati (Detoks)`
      : actionType === "SPEED_UP_RUN"
      ? `+${Math.round(updatedTelemetry.heartRate - telemetry.heartRate)} BPM`
      : `Aksi Dijalankan`;

    // Set cooldown berdasarkan config misi
    const newCooldowns = { ...actionCooldowns, [actionType]: cooldownDuration };

    // Cek auto-advance jika tutorial aktif
    let nextStep = tutorialStep;
    if (isTutorialActive) {
      if (tutorialStep === 2 && actionType === "DRINK_WATER") {
        nextStep = 3;
      } else if (tutorialStep === 3 && actionType === "TAKE_REST_BREATH") {
        nextStep = 4;
      }
    }

    const newCue = evaluateActionCue(updatedTelemetry, activeMission, isTutorialActive, nextStep);
    const cueChanged = !get().currentActionCue || get().currentActionCue.label !== newCue.label;

    set((state) => ({
      telemetry: updatedTelemetry,
      homeostasisIndex: updatedHI,
      currentPose: updatedPose,
      actionCooldowns: newCooldowns,
      lastAction: { type: actionType, timestamp: Date.now() },
      actionFeedback: {
        label: feedbackLabel,
        color: hiDelta >= 0 ? "green" : "red",
        timestamp: Date.now()
      },
      tutorialStep: nextStep,
      currentActionCue: newCue,
      cueChangeId: cueChanged ? state.cueChangeId + 1 : state.cueChangeId
    }));
  },

  // Reset Sesi Permainan Saat Ini
  restartMission: () => {
    const { activeMissionId } = get();
    get().selectMission(activeMissionId);
    get().startGameplay();
  },

  // Reset seluruh progress (untuk debugging / guru)
  resetAllProgress: () => {
    const initial = {};
    MISSIONS.forEach((m) => { initial[m.id] = { completed: false, stars: 0 }; });
    saveMissionProgress(initial);
    set({ missionProgress: initial });
  },

  // ------------------------------------------------------------------------
  // SANDBOX LABORATORY ACTIONS
  // ------------------------------------------------------------------------
  startSandboxMode: (presetId = "NORMAL") => {
    const preset = SANDBOX_PRESETS.find((p) => p.id === presetId) || SANDBOX_PRESETS[0];
    const initialTelemetry = withDigestionDefaults(preset.telemetry);
    const hi = calculateHomeostasis(initialTelemetry);
    const pose = determineSiMetaPose("playing", hi, initialTelemetry);

    set({
      isSandboxMode: true,
      activeSandboxPreset: preset.id,
      sandboxStressors: { ...preset.stressors },
      telemetry: initialTelemetry,
      homeostasisIndex: hi,
      currentPose: pose,
      gameStatus: "playing",
      actionCooldowns: { ...EMPTY_COOLDOWNS },
      sandboxElapsedSeconds: 0,
      isTutorialActive: false,
      isCrisisDialogueActive: false
    });
  },

  applySandboxPreset: (presetId) => {
    const preset = SANDBOX_PRESETS.find((p) => p.id === presetId) || SANDBOX_PRESETS[0];
    const newTelemetry = withDigestionDefaults(preset.telemetry);
    const hi = calculateHomeostasis(newTelemetry);
    const pose = determineSiMetaPose("playing", hi, newTelemetry);

    set({
      activeSandboxPreset: preset.id,
      sandboxStressors: { ...preset.stressors },
      telemetry: newTelemetry,
      homeostasisIndex: hi,
      currentPose: pose,
      actionFeedback: {
        label: `🧪 Skenario: ${preset.name}`,
        color: "green",
        timestamp: Date.now()
      }
    });
  },

  setSandboxStressor: (key, value) => {
    const state = get();
    const currentStressors = { ...state.sandboxStressors, [key]: value };
    const updatedTelemetry = { ...state.telemetry };

    if (key === "ambientTemp") {
      const tempDiff = value - 26;
      updatedTelemetry.coreTemp = Number((36.8 + tempDiff * 0.12).toFixed(1));
      const sweat = Math.max(0, Math.round(15 + tempDiff * 6));
      updatedTelemetry.sweatRate = sweat;
      updatedTelemetry.urineVolume = Math.max(15, Math.round(130 - sweat * 1.1));
      if (value > 37) {
        updatedTelemetry.urineColor = "Kuning Pekat / Cokelat Tua";
      } else if (value < 20) {
        updatedTelemetry.urineColor = "Bening Transparan / Encer";
      } else {
        updatedTelemetry.urineColor = "Kuning Muda Jernih";
      }
    } else if (key === "activityLevel") {
      const hrTable = [72, 95, 130, 165];
      updatedTelemetry.heartRate = hrTable[value] || 75;
      const sweatAdd = value * 25;
      updatedTelemetry.sweatRate = Math.max(10, (state.sandboxStressors.ambientTemp > 30 ? 60 : 15) + sweatAdd);
      if (value >= 2) {
        updatedTelemetry.urineVolume = Math.max(20, updatedTelemetry.urineVolume - 25);
      }
    } else if (key === "hydrationLevel") {
      updatedTelemetry.hydration = value;
      updatedTelemetry.bloodOsmolality = Math.round(330 - value * 0.5);
      if (value < 50) {
        updatedTelemetry.urineColor = "Kuning Pekat / Jingga Tua";
      } else {
        updatedTelemetry.urineColor = "Kuning Normal";
      }
    } else if (key === "ureaLoad") {
      updatedTelemetry.ureaLevel = value;
    }

    const newHI = calculateHomeostasis(updatedTelemetry);
    const newPose = determineSiMetaPose("playing", newHI, updatedTelemetry);

    set({
      sandboxStressors: currentStressors,
      telemetry: updatedTelemetry,
      homeostasisIndex: newHI,
      currentPose: newPose
    });
  },

  exitSandboxMode: () => {
    set({
      isSandboxMode: false,
      gameStatus: "briefing",
      telemetry: { ...MISSIONS[0].initialState },
      homeostasisIndex: 100,
      activeMissionId: 1,
      activeMission: MISSIONS[0],
      currentPose: "simeta_idle_happy.png",
      actionCooldowns: { ...EMPTY_COOLDOWNS }
    });
  }
}));
