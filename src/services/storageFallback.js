/**
 * OFFLINE STORAGE & BROADCAST FALLBACK
 * Memastikan game dan perekaman data penelitian tetap berjalan mulus
 * meskipun jaringan Wi-Fi sekolah sedang mati atau terputus total.
 */

const STORAGE_PREFIX = "metabody_local_";

export const LocalStorageService = {
  saveSession(sessionCode, data) {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}session_${sessionCode}`, JSON.stringify(data));
    } catch (e) {
      console.error("LocalStorage save error:", e);
    }
  },

  getSession(sessionCode) {
    try {
      const data = localStorage.getItem(`${STORAGE_PREFIX}session_${sessionCode}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn("[Metabody] LocalStorage getSession gagal (data korup/kepenuhan):", e?.message);
      return null;
    }
  },

  saveTeamAnswers(sessionCode, groupNumber, answers) {
    try {
      const key = `${STORAGE_PREFIX}ans_${sessionCode}_g${groupNumber}`;
      localStorage.setItem(key, JSON.stringify(answers));
    } catch (e) {
      console.error("Save team answers error:", e);
    }
  }
};

import { broadcastClassMessage, subscribeClassMessages } from "./realtimeSync";

export function broadcastLocalMessage(type, payload) {
  // 1. Broadcast via realtimeSync bus (Cloud + Local Channel)
  broadcastClassMessage(type, payload);
}

export function subscribeLocalMessage(callback) {
  // Berlangganan via realtimeSync
  return subscribeClassMessages(callback);
}
