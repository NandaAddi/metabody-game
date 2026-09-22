import { useEffect, useRef } from "react";
import { useGameStore } from "../stores/useGameStore";

/**
 * useSoundEffects — Hook untuk SFX reaktif saat pemain melakukan aksi.
 * Menggunakan Web Audio API ringan untuk SFX sintetis (tanpa file audio eksternal).
 * Respectful terhadap isSoundMuted state.
 */

// Singleton AudioContext: cegah memory leak (browser limit ~6 context per tab).
// Context dibuat sekali dan dipakai ulang untuk semua SFX.
let sharedAudioCtx = null;

function getAudioContext() {
  try {
    if (typeof window === "undefined") return null;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!sharedAudioCtx || sharedAudioCtx.state === "closed") {
      sharedAudioCtx = new AC();
    }
    // Autoplay policy: resume jika suspended akibat belum ada gesture user
    if (sharedAudioCtx.state === "suspended") {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch (e) {
    console.warn("[Metabody SFX] AudioContext tidak tersedia:", e?.message);
    return null;
  }
}

// Helper: mainkan osc + gain lalu bersihkan node agar tidak menumpuk
function scheduleBlip({ type = "sine", freqStart = 440, freqEnd = null, gainStart = 0.05, duration = 0.08, delay = 0 }) {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, t0);
    if (freqEnd !== null && freqEnd !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, freqEnd), t0 + duration);
    }
    gain.gain.setValueAtTime(gainStart, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
    osc.onended = () => {
      try {
        osc.disconnect();
        gain.disconnect();
      } catch {
        // ignore disconnect errors
      }
    };
  } catch (e) {
    console.warn("[Metabody SFX] Gagal menjadwalkan blip:", e?.message);
  }
}

// Synthesize cute voice blip for character speech typewriter (Animal Crossing / Undertale style)
export function playVoiceBlip() {
  try {
    const isMuted = useGameStore.getState().isSoundMuted;
    if (isMuted) return;
    // Sedikit variasi nada agar suara bicara terasa hidup dan ekspresif
    const pitch = 540 + Math.random() * 70;
    scheduleBlip({ type: "triangle", freqStart: pitch, gainStart: 0.035, duration: 0.045 });
  } catch (e) {
    console.warn("[Metabody SFX] playVoiceBlip gagal:", e?.message);
  }
}

// Synthesize tactile game UI click SFX for buttons & popups
export function playGameClickSFX(type = "normal") {
  try {
    const isMuted = useGameStore.getState().isSoundMuted;
    if (isMuted) return;

    if (type === "cancel" || type === "close") {
      scheduleBlip({ type: "sine", freqStart: 460, freqEnd: 280, gainStart: 0.05, duration: 0.07 });
    } else if (type === "confirm" || type === "next") {
      scheduleBlip({ type: "triangle", freqStart: 520, freqEnd: 840, gainStart: 0.06, duration: 0.085 });
    } else {
      // Normal juicy pop
      scheduleBlip({ type: "sine", freqStart: 360, freqEnd: 620, gainStart: 0.055, duration: 0.06 });
    }
  } catch (e) {
    console.warn("[Metabody SFX] playGameClickSFX gagal:", e?.message);
  }
}

// Synthesize quick SFX using Web Audio API (no external files needed)
function playSynthSFX(type) {
  try {
    const isMuted = useGameStore.getState().isSoundMuted;
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    const cleanup = () => {
      try {
        oscillator.disconnect();
        gainNode.disconnect();
      } catch {
        // ignore
      }
    };
    oscillator.onended = cleanup;

    switch (type) {
      case "DRINK_WATER":
        // Bubbly water sound — ascending frequency sweep
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(200, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);
        oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.35);
        break;

      case "TAKE_REST_BREATH":
        // Calming exhale — low frequency fade
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(300, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.5);
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.5);
        break;

      case "NEPHRON_FILTER":
        // Filter whoosh — descending sweep
        oscillator.type = "sawtooth";
        oscillator.frequency.setValueAtTime(1200, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.25);
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.3);
        break;

      case "SPEED_UP_RUN":
        // Quick energetic beep — rising
        oscillator.type = "square";
        oscillator.frequency.setValueAtTime(400, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.12);
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.15);
        break;

      case "SLOW_DOWN_RUN":
        // Slower descending tone
        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(600, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.25);
        break;

      case "CRITICAL_WARNING":
        // Urgent alarm beep-beep
        oscillator.type = "square";
        oscillator.frequency.setValueAtTime(880, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
        gainNode.gain.setValueAtTime(0, ctx.currentTime + 0.08);
        gainNode.gain.setValueAtTime(0.12, ctx.currentTime + 0.12);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.22);
        break;

      case "CHIME_DING":
        // Friendly ascending two-tone arcade chime (E5 659Hz -> G#5 830Hz)
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(659, ctx.currentTime);
        oscillator.frequency.setValueAtTime(830, ctx.currentTime + 0.08);
        gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.3);
        break;

      default:
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(440, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
    }
  } catch (e) {
    console.warn("[Metabody SFX] playSynthSFX gagal:", e?.message);
  }
}

export function useSoundEffects() {
  const isSoundMuted = useGameStore((state) => state.isSoundMuted);
  const lastAction = useGameStore((state) => state.lastAction);
  const homeostasisIndex = useGameStore((state) => state.homeostasisIndex);
  const cueChangeId = useGameStore((state) => state.cueChangeId);
  const gameStatus = useGameStore((state) => state.gameStatus);
  const prevHI = useRef(homeostasisIndex);
  const prevCueId = useRef(cueChangeId);

  // SFX saat pemain menekan tombol aksi
  useEffect(() => {
    if (!lastAction || isSoundMuted) return;
    playSynthSFX(lastAction.type);
  }, [lastAction, isSoundMuted]);

  // SFX peringatan kritis saat HI turun ke bawah 40
  useEffect(() => {
    if (isSoundMuted) return;
    if (homeostasisIndex < 40 && prevHI.current >= 40) {
      playSynthSFX("CRITICAL_WARNING");
    }
    prevHI.current = homeostasisIndex;
  }, [homeostasisIndex, isSoundMuted]);

  // SFX Chime ("Ding! ✨") saat target aksi berganti atau tutorial lanjut
  useEffect(() => {
    if (isSoundMuted) return;
    if (prevCueId.current !== cueChangeId && gameStatus === "playing") {
      playSynthSFX("CHIME_DING");
    }
    prevCueId.current = cueChangeId;
  }, [cueChangeId, isSoundMuted, gameStatus]);
}
