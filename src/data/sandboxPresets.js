/**
 * PRESET SKENARIO LABORATORIUM SAINS (MODE SANDBOX METABODY)
 * Menyediakan simulasi kondisi faal biologis ekstrem untuk observasi
 * keterhubungan 4 organ ekskresi dan regulasi homeostasis tubuh.
 */

export const SANDBOX_PRESETS = [
  {
    id: "NORMAL",
    name: "Homeostasis Ideal (100%)",
    icon: "🧪",
    badgeColor: "#22C55E",
    tagline: "Kondisi Fisiologis Istirahat Sempurna",
    stressors: {
      activityLevel: "Resting",
      ambientTemp: 26,     // °C
      hydrationLevel: 90,  // %
      ureaLoad: 15         // mg/dL
    },
    telemetry: {
      hydration: 90,
      coreTemp: 37.0,
      heartRate: 72,
      bloodOsmolality: 288,
      ureaLevel: 15,
      saltLevel: 138,
      sweatRate: 15,
      urineVolume: 120,
      energy: 85,
      liverLoad: 8,
      additiveLoad: 0,
      urineColor: "Kuning Muda Jernih",
      bloodPressure: "118/76 mmHg"
    },
    scientificExplanation:
      "Semua organ bekerja harmonis: ginjal memproduksi urine normal, kulit mempertahankan suhu stabil via keringat minimal, dan paru-paru menjaga saturasi oksigen optimal.",
    focusObservation: "Amati bagaimana 4 organ ekskresi mempertahankan parameter darah dalam rentang sempit tanpa fluktuasi drastis."
  },
  {
    id: "HEAT_STROKE",
    name: "Sengatan Panas & Dehidrasi",
    icon: "☀️",
    badgeColor: "#EF4444",
    tagline: "Heat Stroke & Uji Hormon ADH Ginjal",
    stressors: {
      activityLevel: "Moderate",
      ambientTemp: 41,     // °C cuaca terik
      hydrationLevel: 38,  // % dehidrasi berat
      ureaLoad: 28
    },
    telemetry: {
      hydration: 38,
      coreTemp: 39.8,
      heartRate: 132,
      bloodOsmolality: 312,
      ureaLevel: 32,
      saltLevel: 148,
      sweatRate: 95,
      urineVolume: 22,
      energy: 50,
      liverLoad: 25,
      additiveLoad: 5,
      urineColor: "Kuning Pekat / Cokelat Tua",
      bloodPressure: "102/64 mmHg"
    },
    scientificExplanation:
      "Suhu tinggi memicu keringat deras oleh kelenjar keringat kulit untuk termoregulasi. Akibat kehilangan air, darah memekat (osmolaritas naik), memicu hipotalamus merilis ADH sehingga tubulus ginjal menyerap kembali air secara maksimal dan volume urine menyusut tajam.",
    focusObservation: "Perhatikan korelasi antara tingginya laju keringat dengan merosotnya volume urine Si Meta (Keterhubungan Kulit & Ginjal)."
  },
  {
    id: "MARATHON",
    name: "Olahraga Lari Maraton Berat",
    icon: "🏃",
    badgeColor: "#F59E0B",
    tagline: "Metabolisme Tinggi & Kelelahan Kardio",
    stressors: {
      activityLevel: "Extreme",
      ambientTemp: 31,
      hydrationLevel: 55,
      ureaLoad: 35
    },
    telemetry: {
      hydration: 55,
      coreTemp: 38.6,
      heartRate: 162,
      bloodOsmolality: 298,
      ureaLevel: 34,
      saltLevel: 142,
      sweatRate: 85,
      urineVolume: 40,
      energy: 45,
      liverLoad: 28,
      additiveLoad: 6,
      urineColor: "Kuning Tua Pekat",
      bloodPressure: "145/88 mmHg"
    },
    scientificExplanation:
      "Kontraksi otot terus-menerus meningkatkan produksi asam laktat, CO2, dan panas tubuh. Paru-paru meningkatkan laju ventilasi, jantung memompa cepat, dan aliran darah dialihkan ke otot dan kulit, sementara filtrasi ginjal melambat sementara (oliguria olahraga).",
    focusObservation: "Amati peningkatan drastis denyut nadi bersamaan dengan pengeluaran panas via keringat berlebih."
  },
  {
    id: "GLUKOSURIA",
    name: "Sindrom Kebocoran Glukosa",
    icon: "🍬",
    badgeColor: "#A855F7",
    tagline: "Glukosuria & Beban Transpor Maksimum Nefron",
    stressors: {
      activityLevel: "Resting",
      ambientTemp: 27,
      hydrationLevel: 62,
      ureaLoad: 25
    },
    telemetry: {
      hydration: 62,
      coreTemp: 37.1,
      heartRate: 82,
      bloodOsmolality: 318,
      ureaLevel: 22,
      saltLevel: 139,
      sweatRate: 18,
      urineVolume: 240,    // poliuria osmotik
      energy: 70,
      liverLoad: 20,
      additiveLoad: 8,
      urineColor: "Kuning Pucat Manis (Glukosa Positif)",
      bloodPressure: "128/82 mmHg"
    },
    scientificExplanation:
      "Kadar glukosa darah melebihi ambang batas serap tubulus proksimal (Transport Maximum > 180 mg/dL). Glukosa yang tidak terserap menarik air secara osmotik ke tubulus, memicu diuresis osmotik (sering buang air kecil dalam jumlah banyak) dan rasa haus berkelanjutan.",
    focusObservation: "Uji daya serap pompa reabsorpsi di Laboratorium Nefron untuk melihat apakah glukosa dapat diselamatkan kembali ke darah."
  },
  {
    id: "COLD_STRESS",
    name: "Paparan Suhu Dingin Ekstrem",
    icon: "❄️",
    badgeColor: "#0EA5E9",
    tagline: "Vasokonstriksi Kulit & Diuresis Suhu Dingin",
    stressors: {
      activityLevel: "Resting",
      ambientTemp: 14,     // °C suhu dingin
      hydrationLevel: 88,
      ureaLoad: 16
    },
    telemetry: {
      hydration: 88,
      coreTemp: 36.2,
      heartRate: 64,
      bloodOsmolality: 285,
      ureaLevel: 18,
      saltLevel: 136,
      sweatRate: 0,        // keringat terhenti
      urineVolume: 210,    // volume urine meningkat tajam
      energy: 78,
      liverLoad: 9,
      additiveLoad: 0,
      urineColor: "Bening Transparan / Encer",
      bloodPressure: "130/84 mmHg"
    },
    scientificExplanation:
      "Untuk mencegah hilangnya panas, pembuluh darah kapiler kulit menyempit (vasokonstriksi) dan kelenjar keringat pasif. Tekanan darah di organ dalam sedikit naik, menstimulasi ginjal membuang kelebihan cairan sehingga urine menjadi banyak dan sangat encer (cold diuresis).",
    focusObservation: "Amati mengapa di tempat ber-AC dingin atau musim hujan kita jarang berkeringat namun sangat sering ingin buang air kecil!"
  },
  {
    id: "GIZI_SEIMBANG",
    name: "Makan Gizi Seimbang",
    icon: "🍱",
    badgeColor: "#22C55E",
    tagline: "Piring Makan Saya & Empedu Hati Optimal",
    stressors: {
      activityLevel: "Resting",
      ambientTemp: 26,
      hydrationLevel: 90,
      ureaLoad: 16
    },
    telemetry: {
      hydration: 90,
      coreTemp: 37.0,
      heartRate: 74,
      bloodOsmolality: 289,
      ureaLevel: 16,
      saltLevel: 139,
      sweatRate: 12,
      urineVolume: 130,
      energy: 92,
      liverLoad: 6,
      additiveLoad: 0,
      urineColor: "Kuning Muda Jernih",
      bloodPressure: "116/74 mmHg"
    },
    scientificExplanation:
      "Menu piring makan saya (nasi + lauk protein + sayur + buah + susu) dicerna menjadi glukosa, asam amino, dan lemak. Darah mengangkut nutrien ke sel untuk energi; serat memperlancar usus; hati ringan memproduksi empedu untuk mencerna lemak dan mengubah sedikit amonia menjadi urea.",
    focusObservation: "Bandingkan energi, beban hati, dan warna urine skenario ini dengan skenario Jajanan Kantin. Mengapa makanan segar menjaga homeostasis lebih stabil?"
  },
  {
    id: "JAJANAN_KANTIN",
    name: "Jajanan Kantin Berlebih",
    icon: "🍟",
    badgeColor: "#EF4444",
    tagline: "Lemak Trans, Garam & Zat Aditif",
    stressors: {
      activityLevel: "Resting",
      ambientTemp: 28,
      hydrationLevel: 68,
      ureaLoad: 24
    },
    telemetry: {
      hydration: 66,
      coreTemp: 37.3,
      heartRate: 102,
      bloodOsmolality: 312,
      ureaLevel: 26,
      saltLevel: 156,
      sweatRate: 22,
      urineVolume: 75,
      energy: 68,
      liverLoad: 55,
      additiveLoad: 48,
      urineColor: "Kuning Tua Keruh",
      bloodPressure: "142/92 mmHg"
    },
    scientificExplanation:
      "Gorengan (lemak trans), mie instan (garam + MSG + pengawet), dan permen warna-warni (pewarna + pemanis buatan) membebani hati sebagai pabrik detoks. Natrium berlebih menaikkan tekanan darah dan memaksa glomerulus bekerja keras; hati yang lelah gagal mengubah amonia menjadi urea secara optimal.",
    focusObservation: "Uji tombol Detoks Hati dan Makan Gizi Seimbang untuk memulihkan! Amati penurunan beban hati, zat aditif, dan tekanan osmolalitas darah."
  }
];
