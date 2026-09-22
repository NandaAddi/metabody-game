/**
 * SIMULATION ENGINE MATHEMATICAL MODEL
 * Menghitung parameter fisiologis dinamis, Homeostasis Index (HI), dan respons aksi
 */

export const NORMAL_RANGES = {
  coreTemp: 37.0,          // Celcius
  bloodOsmolality: 290,    // mOsm/kg
  heartRate: 75,           // BPM
  hydration: 85,           // %
  ureaLevel: 15,           // mg/dL
  saltLevel: 140,          // mEq/L
  energy: 80,              // % (hasil cerna nutrien: karbo/protein/lemak)
  liverLoad: 10,           // 0-100 (beban detoks hati: amonia, lemak trans, aditif)
  additiveLoad: 0,         // 0-100 (akumulasi zat aditif: pewarna, MSG, pengawet)
};

/**
 * Menghitung Indeks Keseimbangan Tubuh (Homeostasis Index: 0 s.d. 100)
 */
export function calculateHomeostasis(telemetry) {
  const {
    coreTemp = 37.0,
    bloodOsmolality = 290,
    heartRate = 75,
    hydration = 85,
    ureaLevel = 15,
    saltLevel = 140,
    energy = 80,
    liverLoad = 10,
    additiveLoad = 0
  } = telemetry;

  // Penalti deviasi dari nilai faal normal
  const tempPenalty = Math.abs(coreTemp - NORMAL_RANGES.coreTemp) * 10;
  // Hanya darah pekat (hyperosmolality) yang memicu penalti dehidrasi berbahaya
  const osmolalityPenalty = Math.max(0, bloodOsmolality - NORMAL_RANGES.bloodOsmolality) * 0.35;
  const heartPenalty = Math.max(0, heartRate - NORMAL_RANGES.heartRate) * 0.22;
  const hydrationPenalty = Math.max(0, NORMAL_RANGES.hydration - hydration) * 0.55;
  const ureaPenalty = Math.max(0, ureaLevel - NORMAL_RANGES.ureaLevel) * 0.65;
  const saltPenalty = Math.max(0, saltLevel - NORMAL_RANGES.saltLevel) * 0.35;
  // Pencernaan & nutrisi: energi rendah = sel kekurangan bahan bakar metabolisme
  const energyPenalty = Math.max(0, NORMAL_RANGES.energy - energy) * 0.25;
  // Hati: beban detoks tinggi (amonia, lemak trans, aditif) membebani homeostasis
  const liverPenalty = Math.max(0, liverLoad - NORMAL_RANGES.liverLoad) * 0.25;
  // Zat aditif berlebih mengganggu keseimbangan internal
  const additivePenalty = Math.max(0, additiveLoad - NORMAL_RANGES.additiveLoad) * 0.2;

  const totalPenalty = tempPenalty + osmolalityPenalty + heartPenalty + hydrationPenalty + ureaPenalty + saltPenalty + energyPenalty + liverPenalty + additivePenalty;
  const hi = Math.max(0, Math.min(100, Math.round(100 - totalPenalty)));
  return hi;
}

/**
 * Menerapkan peluruhan / perubahan waktu alami (per detik)
 */
export function stepSimulation(telemetry, decayRates, deltaSeconds = 1) {
  let {
    hydration,
    coreTemp,
    heartRate,
    bloodOsmolality,
    ureaLevel,
    saltLevel,
    sweatRate,
    urineVolume,
    energy = 80,
    liverLoad = 10,
    additiveLoad = 0
  } = telemetry;

  const {
    hydrationDecay = 0.1,
    tempDelta = 0.02,
    heartRateDelta = 0.1,
    ureaAccumulation = 0.1,
    energyDecay = 0.05,
    liverStrain = 0.02
  } = decayRates;

  // Dehidrasi & kenaikan osmolalitas
  hydration = Math.max(10, hydration - hydrationDecay * deltaSeconds);
  bloodOsmolality = Math.min(350, bloodOsmolality + (hydrationDecay * 4) * deltaSeconds);

  // Dinamika keringat berdasarkan suhu
  if (coreTemp > 37.2) {
    sweatRate = Math.min(120, (coreTemp - 37.0) * 45);
  } else {
    sweatRate = Math.max(5, sweatRate - 1);
  }

  // Pendinginan evaporatif alami dari kelenjar keringat (Fisiologi Biologi)
  const sweatCooling = (sweatRate / 100) * 0.045 * deltaSeconds;
  // Kenaikan suhu diseimbangkan oleh penguapan keringat
  coreTemp = Math.min(40.2, Math.max(36.5, coreTemp + (tempDelta * deltaSeconds) - sweatCooling));

  // Denyut jantung menyesuaikan suhu dan hidrasi
  if (coreTemp > 37.5 || hydration < 60) {
    heartRate = Math.min(170, heartRate + (heartRateDelta + 0.2) * deltaSeconds);
  } else {
    heartRate = Math.max(65, heartRate - 0.15 * deltaSeconds);
  }

  // Penumpukan zat sisa urea
  ureaLevel = Math.min(100, ureaLevel + ureaAccumulation * deltaSeconds);

  // Metabolisme energi: sel membakar glukosa dari hasil cerna (Bab 2: kalori & nutrien)
  energy = Math.max(5, Math.min(100, energy - energyDecay * deltaSeconds));

  // Beban hati: memproses amonia protein + lemak trans + zat aditif
  // Hati yang terbebani memperlambat detoks -> urea menumpuk sedikit lebih cepat
  liverLoad = Math.max(0, Math.min(100, liverLoad + liverStrain * deltaSeconds));
  if (liverLoad > 60) {
    ureaLevel = Math.min(100, ureaLevel + 0.05 * deltaSeconds);
  }

  // Zat aditif luruh sangat lambat (butuh detoks hati + hidrasi)
  additiveLoad = Math.max(0, Math.min(100, additiveLoad - 0.01 * deltaSeconds));

  return {
    ...telemetry,
    hydration: Number(hydration.toFixed(1)),
    coreTemp: Number(coreTemp.toFixed(2)),
    heartRate: Math.round(heartRate),
    bloodOsmolality: Math.round(bloodOsmolality),
    ureaLevel: Number(ureaLevel.toFixed(1)),
    saltLevel: Number(saltLevel.toFixed(1)),
    // Presisi 2 desimal: decay kecil (0.01–0.04) lenyap tiap tick bila dibulatkan 1 desimal
    energy: Number(energy.toFixed(2)),
    liverLoad: Number(liverLoad.toFixed(2)),
    additiveLoad: Number(additiveLoad.toFixed(2)),
    sweatRate: Math.round(sweatRate),
    urineVolume: Math.round(urineVolume)
  };
}

/**
 * Menghitung dampak aksi interaktif dari 3 Stasiun IFP
 */
export function applyUserAction(telemetry, actionType) {
  const current = { ...telemetry };

  switch (actionType) {
    case "DRINK_WATER":
      // Memberi minum air putih
      current.hydration = Math.min(100, current.hydration + 14);
      current.bloodOsmolality = Math.max(285, current.bloodOsmolality - 6);
      current.coreTemp = Math.max(36.8, current.coreTemp - 0.2);
      current.urineVolume = current.urineVolume + 15;
      break;

    case "TAKE_REST_BREATH":
      // Mengatur napas dalam & rileks (ventilasi menurunkan BPM & suhu inti)
      current.heartRate = Math.max(68, current.heartRate - 12);
      current.coreTemp = Math.max(36.8, current.coreTemp - 0.35);
      break;

    case "NEPHRON_FILTER":
    case "NEPHRON_CALIBRATE_FILTER":
      return calibrateGlomerulus(current);

    case "NEPHRON_REABSORPTION_BOOST":
      return applyReabsorption(current, 100);

    case "NEPHRON_FLUSH_TOXINS":
      return flushAugmentation(current);

    case "EAT_BALANCED_MEAL":
      return eatBalancedMeal(current);

    case "EAT_INSTANT_SNACK":
      return eatInstantSnack(current);

    case "LIVER_DETOX_BOOST":
      return detoxLiver(current);

    case "SPEED_UP_RUN":
      // Menaikkan kecepatan lari (PJOK): atur tempo — sprint membakar glukosa cepat
      current.heartRate = Math.min(165, current.heartRate + 12);
      current.coreTemp = Math.min(39.5, current.coreTemp + 0.3);
      current.sweatRate = Math.min(100, current.sweatRate + 15);
      current.energy = Math.max(5, Number(((current.energy ?? 80) - 5).toFixed(1)));
      break;

    case "SLOW_DOWN_RUN":
      // Menurunkan kecepatan lari: hemat energi, pulihkan napas
      current.heartRate = Math.max(80, current.heartRate - 10);
      current.sweatRate = Math.max(15, current.sweatRate - 10);
      current.energy = Math.min(100, Number(((current.energy ?? 80) + 3).toFixed(1)));
      break;

    default:
      break;
  }

  return current;
}

/**
 * Formula Filtrasi Awal (Misi 1–4, tombol stasiun kanan)
 * Efek separuh dari kalibrasi penuh: darah disaring kasar, sebagian urea
 * lolos. Pembersihan tuntas membutuhkan 3 gerbang nefron (Misi 5 / Lab Nefron).
 */
export function basicFiltration(telemetry) {
  return {
    ...telemetry,
    ureaLevel: Math.max(10, Number((telemetry.ureaLevel - 5).toFixed(1))),
    saltLevel: Math.max(136, Number((telemetry.saltLevel - 1).toFixed(1))),
    urineVolume: telemetry.urineVolume + 10
  };
}

/**
 * Formula khusus Gerbang 1: Filtrasi Glomerulus (Pori <= 8 nm)
 * Menyaring sel darah merah & protein, menghasilkan urine primer
 */
export function calibrateGlomerulus(telemetry) {
  return {
    ...telemetry,
    ureaLevel: Math.max(10, Number((telemetry.ureaLevel - 10).toFixed(1))),
    saltLevel: Math.max(136, Number((telemetry.saltLevel - 3).toFixed(1))),
    urineVolume: telemetry.urineVolume + 20
  };
}

/**
 * Formula khusus Gerbang 2: Reabsorpsi Tubulus Proksimal (0 - 100%)
 * Menarik kembali glukosa, asam amino, dan air ke sirkulasi darah
 */
export function applyReabsorption(telemetry, ratePercent = 100) {
  const current = { ...telemetry };
  if (ratePercent >= 85) {
    current.hydration = Math.min(100, Number((current.hydration + 8 * (ratePercent / 100)).toFixed(1)));
    current.bloodOsmolality = Math.max(285, Math.round(current.bloodOsmolality - 4 * (ratePercent / 100)));
  } else {
    // Reabsorpsi rendah: glukosa bocor, dehidrasi ringan
    current.hydration = Math.max(10, Number((current.hydration - 2).toFixed(1)));
  }
  return current;
}

/**
 * Formula khusus Gerbang 3: Augmentasi Tubulus Distal
 * Membuang sisa amonia, kelebihan urea & garam ke tubulus kolektivus
 */
export function flushAugmentation(telemetry) {
  return {
    ...telemetry,
    ureaLevel: Math.max(10, Number((telemetry.ureaLevel - 18).toFixed(1))),
    saltLevel: Math.max(136, Number((telemetry.saltLevel - 5).toFixed(1))),
    urineVolume: telemetry.urineVolume + 25
  };
}

/**
 * AKSI PENCERNAAN SEIMBANG (Bab 2: Piring Makan Saya)
 * Nasi + lauk protein + sayur + buah + susu: energi naik, hati ringan,
 * osmolalitas stabil. Merujuk metode "piring makan saya" & 4 sehat 5 sempurna.
 * Bukan makanan ajaib: protein lauk ikut menambah urea, dan perut kenyang
 * membuat porsi berikutnya kurang bertenaga (diminishing returns).
 */
export function eatBalancedMeal(telemetry) {
  const current = { ...telemetry };
  const energyNow = current.energy ?? 80;
  // Kenyang: makin penuh energi, makin kecil tambahan (maksimal +12 saat lapar)
  const energyGain = Math.max(4, Math.round(12 * (1 - energyNow / 150)));
  current.energy = Math.min(100, Number((energyNow + energyGain).toFixed(1)));
  current.hydration = Math.min(100, Number(((current.hydration ?? 85) + 6).toFixed(1)));
  current.bloodOsmolality = Math.max(285, Math.round((current.bloodOsmolality ?? 290) - 4));
  // Protein lauk dirombak menjadi amonia → beban urea ikut naik wajar
  current.ureaLevel = Number(((current.ureaLevel ?? 15) + 3).toFixed(1));
  current.saltLevel = Math.max(136, Number(((current.saltLevel ?? 140) - 2).toFixed(1)));
  // Makanan segar meringankan kerja hati
  current.liverLoad = Math.max(0, Number(((current.liverLoad ?? 10) - 6).toFixed(1)));
  current.additiveLoad = Math.max(0, Number(((current.additiveLoad ?? 0) - 4).toFixed(1)));
  return current;
}

/**
 * AKSI JAJANAN INSTAN (Bab 2: gorengan, mie instan, permen warna-warni)
 * Tinggi garam, lemak trans, pemanis/pewarna/pengawet (zat aditif).
 * Niche: energi INSTAN besar (+10) saat kepepet lapar — tetapi diikuti
 * crash: garam & osmolalitas melonjak, hati terbebani, hidrasi turun.
 * Pilihan observasi: tekan sekali untuk melihat dampaknya, lalu pulihkan.
 */
export function eatInstantSnack(telemetry) {
  const current = { ...telemetry };
  current.energy = Math.min(100, Number(((current.energy ?? 80) + 10).toFixed(1)));
  current.saltLevel = Number(((current.saltLevel ?? 140) + 8).toFixed(1));
  current.bloodOsmolality = Math.min(350, Math.round((current.bloodOsmolality ?? 290) + 8));
  current.ureaLevel = Number(((current.ureaLevel ?? 15) + 4).toFixed(1));
  current.hydration = Math.max(10, Number(((current.hydration ?? 85) - 5).toFixed(1)));
  // Lemak trans + aditif membebani hati (pabrik penawar racun)
  current.liverLoad = Math.min(100, Number(((current.liverLoad ?? 10) + 12).toFixed(1)));
  current.additiveLoad = Math.min(100, Number(((current.additiveLoad ?? 0) + 14).toFixed(1)));
  return current;
}

/**
 * AKSI DETOKS HATI (Hepar): siklus urea / ornitin
 * Hati mengubah amonia beracun sisa rombakan protein menjadi urea yang
 * larut air, lalu darah mengangkutnya ke ginjal untuk dibuang.
 * Catatan biologis: detoks MENAMBAH urea darah (amonia diubah jadi urea),
 * sehingga harus dilanjutkan dengan filtrasi/augmentasi ginjal.
 * Mensimulasikan peran ganda hati sebagai organ ekskresi + pencernaan (empedu).
 */
export function detoxLiver(telemetry) {
  const current = { ...telemetry };
  current.liverLoad = Math.max(0, Number(((current.liverLoad ?? 10) - 18).toFixed(1)));
  current.additiveLoad = Math.max(0, Number(((current.additiveLoad ?? 0) - 10).toFixed(1)));
  // Amonia yang ditawar hati berubah menjadi urea: urea darah NAIK sedikit,
  // lalu ginjal harus menyaringnya (filtrasi/augmentasi) hingga jadi urine.
  current.ureaLevel = Math.min(100, Number(((current.ureaLevel ?? 15) + 4).toFixed(1)));
  current.bloodOsmolality = Math.max(285, Math.round((current.bloodOsmolality ?? 290) - 3));
  current.urineVolume = (current.urineVolume ?? 100) + 5;
  return current;
}

/**
 * Menentukan pose visual Si Meta berdasarkan status & Homeostasis Index
 */
export function determineSiMetaPose(status, hi, telemetry) {
  if (status === "victory") {
    return "simeta_victory_celebrate.png";
  }
  if (status === "defeat" || hi < 30) {
    return "simeta_dizzy_collapse.png";
  }
  if (telemetry.hydration < 50 || telemetry.bloodOsmolality > 310) {
    return "simeta_thirsty_parched.png";
  }
  if (telemetry.coreTemp > 37.6 || telemetry.heartRate > 110) {
    return "simeta_running_sweat.png";
  }
  return "simeta_idle_happy.png";
}
