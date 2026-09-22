/**
 * REAL-TIME MULTI-DEVICE CLASSROOM SYNC ENGINE
 * METABODY: Sistem Sinkronisasi Real-Time Tri-Terminal (IFP - Tablet Siswa - Dasbor Guru)
 * 
 * Arsitektur Dual-Transport:
 * 1. Cloud Transport: Supabase Realtime Channels (Broadcast Engine) untuk koneksi antar-perangkat lewat Wi-Fi/Internet.
 * 2. Local Transport: BroadcastChannel API + LocalStorage Event Fallback untuk mode offline / standalone di kelas tanpa internet.
 */

import { createClient } from "@supabase/supabase-js";

const DEFAULT_SESSION_CODE = "META-8A";
const STORAGE_CONFIG_KEY = "metabody_supabase_config";
const STORAGE_SYNC_EVENT_KEY = "metabody_storage_sync_event";

// State internal koneksi
let currentSessionCode = DEFAULT_SESSION_CODE;
let supabaseClient = null;
let supabaseChannel = null;
let broadcastChannel = null;
let connectionMode = "local"; // 'cloud' | 'local'
let connectionStatus = "connected"; // 'connected' | 'connecting' | 'disconnected'
let latencyMs = 8;
let lastPingTime = 0;
let lastPingId = null;
let pingIntervalId = null;
const recentMessageIds = new Set();

const subscribers = new Set();
const statusListeners = new Set();

/**
 * Inisialisasi Supabase Client (dari runtime config atau env)
 */
function initSupabaseClient() {
  try {
    let url = "";
    let key = "";

    // 1. Cek dari localStorage (konfigurasi kustom guru/peneliti)
    const stored = localStorage.getItem(STORAGE_CONFIG_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.url && parsed.key) {
          url = parsed.url;
          key = parsed.key;
        }
      } catch (e) {
        console.warn("Parse stored config error:", e);
      }
    }

    // 2. Cek dari Vite env variables jika belum diisi kustom
    if (!url) {
      const envUrl = import.meta.env.VITE_SUPABASE_URL;
      const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (envUrl && !envUrl.includes("placeholder") && envKey && !envKey.includes("placeholder")) {
        url = envUrl;
        key = envKey;
      }
    }

    if (url && key) {
      supabaseClient = createClient(url, key, {
        realtime: {
          params: {
            eventsPerSecond: 20
          }
        }
      });
      connectionMode = "cloud";
      return true;
    }
  } catch (e) {
    console.warn("Supabase client init failed:", e);
  }

  supabaseClient = null;
  connectionMode = "local";
  return false;
}

/**
 * Hubungkan kanal komunikasi (Cloud & Local)
 */
function setupChannels(sessionCode = DEFAULT_SESSION_CODE) {
  currentSessionCode = sessionCode;

  // 1. Setup Local BroadcastChannel
  try {
    if (broadcastChannel) {
      broadcastChannel.close();
    }
    if (typeof BroadcastChannel !== "undefined") {
      broadcastChannel = new BroadcastChannel(`metabody_class_${sessionCode}`);
      broadcastChannel.onmessage = (event) => {
        handleIncomingMessage(event.data, "local");
      };
    }
  } catch (e) {
    console.warn("BroadcastChannel error:", e);
  }

  // 2. Setup LocalStorage Fallback Listener (antar-jendela/iframe pada browser tertentu)
  if (typeof window !== "undefined") {
    window.removeEventListener("storage", handleStorageEvent);
    window.addEventListener("storage", handleStorageEvent);
  }

  // 3. Setup Supabase Realtime Channel jika tersedia
  if (supabaseClient) {
    try {
      if (supabaseChannel) {
        supabaseClient.removeChannel(supabaseChannel);
      }

      connectionStatus = "connecting";
      notifyStatusChange();

      supabaseChannel = supabaseClient.channel(`class_room_${sessionCode}`, {
        config: {
          broadcast: { self: false }
        }
      });

      supabaseChannel
        .on("broadcast", { event: "class_event" }, ({ payload }) => {
          handleIncomingMessage(payload, "cloud");
        })
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            connectionStatus = "connected";
            connectionMode = "cloud";
            notifyStatusChange();
            // Kirim ping pembuka
            measurePing();
          } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
            connectionStatus = "disconnected";
            connectionMode = "local"; // fallback mulus ke lokal
            notifyStatusChange();
          }
        });
    } catch (err) {
      console.warn("Supabase channel subscribe error:", err);
      connectionMode = "local";
      connectionStatus = "connected";
      notifyStatusChange();
    }
  } else {
    connectionMode = "local";
    connectionStatus = "connected";
    notifyStatusChange();
  }

  // Jalankan periodic ping heartbeat setiap 8 detik
  if (pingIntervalId) clearInterval(pingIntervalId);
  pingIntervalId = setInterval(() => {
    measurePing();
  }, 8000);
}

function handleStorageEvent(e) {
  if (e.key === STORAGE_SYNC_EVENT_KEY && e.newValue) {
    try {
      const data = JSON.parse(e.newValue);
      handleIncomingMessage(data, "storage");
    } catch (err) {
      console.warn("[Metabody Sync] Pesan storage korup, dilewati:", err?.message);
    }
  }
}

/**
 * Penanganan pesan masuk (dengan dedup ID)
 */
function handleIncomingMessage(message, source) {
  if (!message || !message.id || !message.type) return;

  // Cegah pemrosesan duplikat pesan yang sama dari dual-channel
  if (recentMessageIds.has(message.id)) return;
  recentMessageIds.add(message.id);
  if (recentMessageIds.size > 200) {
    // Bersihkan id lama tanpa reassign (jaga referensi Set tetap stabil)
    const arr = Array.from(recentMessageIds);
    const keep = arr.slice(arr.length - 100);
    recentMessageIds.clear();
    for (const id of keep) recentMessageIds.add(id);
  }

  // Filter session code jika pesan menyertakannya
  if (message.sessionCode && message.sessionCode !== currentSessionCode) {
    return;
  }

  // Tangani protokol Ping / Pong latensi internal
  if (message.type === "PING_HEARTBEAT") {
    // Balas pong
    const pongMsg = {
      id: `pong_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type: "PONG_HEARTBEAT",
      sessionCode: currentSessionCode,
      pingId: message.id,
      pingTimestamp: message.timestamp,
      timestamp: Date.now()
    };
    sendRaw(pongMsg);
    return;
  }

  if (message.type === "PONG_HEARTBEAT") {
    if (message.pingId === lastPingId && message.pingTimestamp) {
      const delta = Date.now() - message.pingTimestamp;
      latencyMs = Math.max(1, delta);
      notifyStatusChange();
    }
    return;
  }

  // Sebarkan ke seluruh subscriber aplikasi (StudentView, TeacherView, ArenaView)
  subscribers.forEach((cb) => {
    try {
      cb(message);
    } catch (err) {
      console.error("Error in sync subscriber callback:", err);
    }
  });
}

function sendRaw(message) {
  let sentViaBroadcast = false;

  // 1. Kirim via BroadcastChannel lokal (primary local transport)
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage(message);
      sentViaBroadcast = true;
    } catch (e) {
      // Fallback ke localStorage jika BroadcastChannel gagal
      sentViaBroadcast = false;
    }
  }

  // 2. Kirim via LocalStorage HANYA jika BroadcastChannel tidak aktif/didukung
  if (!sentViaBroadcast && typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(STORAGE_SYNC_EVENT_KEY, JSON.stringify({ ...message, _rnd: Math.random() }));
    } catch (e) {
      // Quota penuh / mode privat: sinkronisasi lokal dilewati, game tetap jalan
      console.warn("[Metabody Sync] LocalStorage penuh, pesan lokal dilewati:", e?.message);
    }
  }

  // 3. Kirim via Supabase Cloud Realtime jika terhubung
  if (supabaseChannel && connectionMode === "cloud" && connectionStatus === "connected") {
    try {
      supabaseChannel.send({
        type: "broadcast",
        event: "class_event",
        payload: message
      });
    } catch (err) {
      console.warn("Failed to send Supabase broadcast:", err);
    }
  }
}

/**
 * Kirim pesan kelas (Broadcast API)
 * @param {string} type - 'STAGE_CHANGE' | 'MISSION_TELEMETRY' | 'TEAM_PROGRESS_UPDATE'
 * @param {object} payload - data muatan pesan
 */
export function broadcastClassMessage(type, payload = {}) {
  const message = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    type,
    payload,
    sessionCode: currentSessionCode,
    timestamp: Date.now()
  };

  // Catat sendiri ID agar tidak memproses ulang pesan sendiri
  recentMessageIds.add(message.id);

  sendRaw(message);
  return message;
}

/**
 * Berlangganan seluruh pesan kelas
 * @param {function} callback
 * @returns {function} unsubscribe
 */
export function subscribeClassMessages(callback) {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

/**
 * Ukur latensi jaringan (Ping RTT)
 */
export function measurePing() {
  lastPingTime = Date.now();
  lastPingId = `ping_${lastPingTime}_${Math.random().toString(36).substring(2, 7)}`;
  const pingMsg = {
    id: lastPingId,
    type: "PING_HEARTBEAT",
    sessionCode: currentSessionCode,
    timestamp: lastPingTime
  };
  sendRaw(pingMsg);

  // Jika setelah 1.5 detik tidak ada balasan pong (misal hanya 1 tab aktif tanpa server cloud), estimasi latensi wajar
  setTimeout(() => {
    if (Date.now() - lastPingTime > 1400 && latencyMs > 50) {
      latencyMs = connectionMode === "cloud" ? 45 : 3;
      notifyStatusChange();
    }
  }, 1500);
}

/**
 * Dapatkan informasi status jaringan saat ini
 */
export function getConnectionInfo() {
  return {
    mode: connectionMode,
    status: connectionStatus,
    latencyMs,
    sessionCode: currentSessionCode,
    hasSupabase: Boolean(supabaseClient)
  };
}

/**
 * Berlangganan pembaruan status koneksi
 */
export function onConnectionStatusChange(callback) {
  statusListeners.add(callback);
  callback(getConnectionInfo());
  return () => {
    statusListeners.delete(callback);
  };
}

function notifyStatusChange() {
  const info = getConnectionInfo();
  statusListeners.forEach((cb) => {
    try {
      cb(info);
    } catch (e) {
      // Ignore
    }
  });
}

/**
 * Atur kode sesi aktif kelas (misal: 'META-8A')
 */
export function setSyncSessionCode(sessionCode) {
  if (sessionCode && sessionCode !== currentSessionCode) {
    setupChannels(sessionCode);
  }
}

/**
 * Simpan konfigurasi Supabase kustom dari dialog guru
 */
export function setCustomSupabaseConfig(url, key) {
  if (!url || !key) {
    localStorage.removeItem(STORAGE_CONFIG_KEY);
  } else {
    localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify({ url, key }));
  }
  initSupabaseClient();
  setupChannels(currentSessionCode);
  return getConnectionInfo();
}

/**
 * Ambil konfigurasi Supabase kustom yang tersimpan
 */
export function getCustomSupabaseConfig() {
  try {
    const stored = localStorage.getItem(STORAGE_CONFIG_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    // Ignore
  }
  return {
    url: import.meta.env.VITE_SUPABASE_URL || "",
    key: import.meta.env.VITE_SUPABASE_ANON_KEY || ""
  };
}

/**
 * Paksa reconnect atau ganti ke Offline Mode
 */
export function toggleNetworkMode(forceOffline = false) {
  if (forceOffline) {
    if (supabaseChannel && supabaseClient) {
      try {
        supabaseClient.removeChannel(supabaseChannel);
      } catch (e) {
        // Ignore
      }
    }
    supabaseChannel = null;
    connectionMode = "local";
    connectionStatus = "connected";
    latencyMs = 2;
    notifyStatusChange();
  } else {
    initSupabaseClient();
    setupChannels(currentSessionCode);
  }
  return getConnectionInfo();
}

// Inisialisasi awal saat modul dimuat
initSupabaseClient();
setupChannels(DEFAULT_SESSION_CODE);
