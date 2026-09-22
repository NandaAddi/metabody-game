/**
 * DATA MISI & SKENARIO SIMULASI METABODY
 * Berlandaskan 5 Teori Pembelajaran:
 * 1. Konstruktivisme (Piaget & Vygotsky) - Manipulasi Mandiri & Krisis Fisiologis
 * 2. Humanistik (Rogers & Maslow) - Empati Si Meta & Safe Failure Environment
 * 3. Experiential Learning (Kolb, 1984) - Siklus CE -> RO -> AC -> AE
 * 4. Sosial-Kultural (Vygotsky) - 3-Tier Adaptive Scaffolding MKO
 * 5. Game-Based Learning (Yam San Chee, 2015) - 5 Pilar Transformasional
 */

export const MISSIONS = [
  {
    id: 1,
    code: "MISI-1",
    title: "Kenalan dengan Si Meta",
    subTitle: "Memahami Indikator Keseimbangan Tubuh (Homeostasis)",
    bgImage: "bg_misi1_kamar.png",
    audioIntro: "vo_misi1_intro.mp3",
    durationSeconds: 90,
    briefing: "Halo teman-teman! Kenalkan, aku Si Meta. Sekarang aku lagi santai membaca buku di kamar. Yuk perhatikan Papan Pantau Tubuh dan bantu aku menjaga ritme tubuhku agar tetap seimbang dan sehat!",
    storyDialogues: [
      {
        speaker: "Si Meta",
        role: "Sahabat Tubuhmu",
        pose: "simeta_idle_happy.png",
        text: "Halo teman-teman Penjaga Tubuh! Kenalkan, aku Si Meta. Hari ini aku sedang santai membaca buku di kamar."
      },
      {
        speaker: "Si Meta",
        role: "Sahabat Tubuhmu",
        pose: "simeta_idle_happy.png",
        text: "Meskipun aku sedang diam santai, organ tubuhku tetap bekerja menjaga ritme keseimbangan (Homeostasis) agar aku tetap sehat!"
      },
      {
        speaker: "Si Meta",
        role: "Sahabat Tubuhmu",
        pose: "simeta_character_design.png",
        text: "Tugas kalian bertiga: Operator Nutrisi di kiri siapkan air minum, Operator Kardio di tengah jaga napas, dan Operator Ekskresi di kanan pantau ginjal. Siap bantu aku?"
      }
    ],
    initialState: {
      hydration: 85,           // % (cairan tubuh optimal)
      coreTemp: 37.0,          // Celcius (normal)
      heartRate: 75,           // BPM (denyut istirahat)
      bloodOsmolality: 290,    // mOsm/kg (ideal)
      ureaLevel: 15,           // mg/dL (aman)
      saltLevel: 138,          // mEq/L (normal)
      sweatRate: 10,           // mL/jam
      urineVolume: 120,        // mL
      energy: 80,              // % (hasil cerna nutrien)
      liverLoad: 10,           // 0-100 (beban detoks hati)
      additiveLoad: 0,         // 0-100 (zat aditif)
      activityIntensity: "Santai (Resting)",
    },
    decayRates: {
      hydrationDecay: 0.08,    // kehilangan air lambat
      tempDelta: 0.01,
      heartRateDelta: 0.0,
      ureaAccumulation: 0.05,
      energyDecay: 0.04,       // lapar perlahan saat santai
      liverStrain: 0.01,
    },
    winCriteria: {
      minHomeostasis: 75,
      minTimeSeconds: 60,
    },
    // Aksi yang tersedia untuk misi ini (progressive disclosure, semua 3 operator aktif)
    availableActions: ["DRINK_WATER", "TAKE_REST_BREATH", "NEPHRON_FILTER", "EAT_BALANCED_MEAL", "LIVER_DETOX_BOOST"],
    // Cooldown per aksi dalam detik (tutorial = pendek)
    cooldowns: {
      DRINK_WATER: 3,
      TAKE_REST_BREATH: 3,
      NEPHRON_FILTER: 3,
      EAT_BALANCED_MEAL: 6,
      LIVER_DETOX_BOOST: 6,
      SPEED_UP_RUN: 3,
      SLOW_DOWN_RUN: 3
    },
    learningFocus: [
      "Mengidentifikasi letak dan fungsi 4 organ ekskresi",
      "Memahami makna angka Homeostasis 100%",
      "Mencoba fungsi tombol Minum Air, Pengatur Napas, dan Filter Ginjal",
      "Mengenal alur makanan → pencernaan → darah → sel (sumber energi)"
    ],
    lkpdQuestions: [
      "Berapakah denyut nadi dan suhu tubuh Si Meta saat santai membaca buku?",
      "Bagaimana warna urine Si Meta saat kondisi air tubuhnya cukup?",
      "Dari mana sel tubuh memperoleh energi? Jelaskan peran sistem pencernaan dan darah!"
    ],
    // 3-Tier Scaffolding Vygotsky
    scaffolding: {
      level1: "Wah, tubuhku terasa rileks, tapi jangan lupa terus amati indikator ya!",
      level2: "Perhatikan Papan Pantau Tubuh di kanan! Pastikan angka Homeostasis tetap stabil di atas 75%.",
      level3: "Coba pencet tombol Minum Air di Stasiun Kiri agar kamu terbiasa mengontrol organ tubuhku!"
    },
    // Reflective Observation Kolb (Safe-to-fail Rogers)
    collapseAnalysis: {
      cause: "Ketidakseimbangan Ringan (Lalai Memantau)",
      systemicReason: "Meskipun Si Meta sedang santai membaca buku, tubuh tetap kehilangan cairan secara perlahan melalui pernapasan dan penguapan kulit alami.",
      actionPlan: "Coba lagi dan amati penurunan hidrasi. Berikan air minum sebelum nilai homeostasis turun di bawah batas aman."
    },
    // Abstract Conceptualization Kolb
    victoryConceptualization: "Hebat! Kalian berhasil membuktikan bahwa tubuh yang sehat selalu melakukan regulasi homeostasis secara konstan, bahkan saat beristirahat santai."
  },
  {
    id: 2,
    code: "MISI-2",
    title: "Tantangan Lari Lapangan",
    subTitle: "Menganalisis Keterkaitan Napas, Sirkulasi, dan Keringat",
    bgImage: "bg_misi2_lapangan.png",
    audioIntro: "vo_misi2_lari.mp3",
    durationSeconds: 120,
    briefing: "Ayo teman-teman, sekarang waktunya ujian lari mengelilingi lapangan sekolah! Otot kakiku membakar energi sangat cepat. Tolong bantu atur napas dan minumku ya supaya aku nggak pingsan!",
    storyDialogues: [
      {
        speaker: "Si Meta",
        role: "Pelari Lapangan",
        pose: "simeta_running_sweat.png",
        text: "Pffhh... panas banget hari ini! Guru PJOK meminta kita lari keliling lapangan sekolah!"
      },
      {
        speaker: "Si Meta",
        role: "Pelari Lapangan",
        pose: "simeta_running_sweat.png",
        text: "Otot kakiku membakar banyak energi! Denyut jantungku melonjak dan keringat mulai membanjiri kulitku!"
      },
      {
        speaker: "Si Meta",
        role: "Pelari Lapangan",
        pose: "simeta_thirsty_parched.png",
        text: "Operator Napas, atur ventilasiku agar tidak sesak! Operator Nutrisi, pasok air minum agar aku tidak pingsan di lapangan!"
      }
    ],
    initialState: {
      hydration: 80,
      coreTemp: 37.2,
      heartRate: 90,
      bloodOsmolality: 295,
      ureaLevel: 18,
      saltLevel: 140,
      sweatRate: 35,
      urineVolume: 90,
      energy: 75,
      liverLoad: 14,
      additiveLoad: 2,
      activityIntensity: "Olahraga Berat (Lari Cepat)",
    },
    decayRates: {
      hydrationDecay: 0.30,    // dehidrasi akibat keringat
      tempDelta: 0.045,        // laju kenaikan suhu yang seimbang dengan pendinginan evaporatif
      heartRateDelta: 0.15,    // kenaikan denyut jantung yang proporsional
      ureaAccumulation: 0.12,
      energyDecay: 0.12,       // otot membakar glukosa cepat saat lari
      liverStrain: 0.03,
    },
    winCriteria: {
      minHomeostasis: 65,
      minTimeSeconds: 90,
    },
    availableActions: ["DRINK_WATER", "TAKE_REST_BREATH", "SPEED_UP_RUN", "SLOW_DOWN_RUN", "EAT_BALANCED_MEAL", "LIVER_DETOX_BOOST"],
    cooldowns: {
      DRINK_WATER: 5,
      TAKE_REST_BREATH: 4,
      NEPHRON_FILTER: 5,
      EAT_BALANCED_MEAL: 8,
      LIVER_DETOX_BOOST: 8,
      SPEED_UP_RUN: 3,
      SLOW_DOWN_RUN: 3
    },
    learningFocus: [
      "Mengamati respons simultan jantung (BPM naik) dan paru-paru",
      "Menganalisis fungsi kelenjar keringat mendinginkan suhu tubuh",
      "Memahami mengapa urine menjadi lebih sedikit dan pekat saat berolahraga"
    ],
    lkpdQuestions: [
      "Mengapa denyut jantung dan laju napas Si Meta meningkat bersamaan saat berlari?",
      "Ke mana sebagian besar cairan tubuh keluar saat olahraga: lewat ginjal atau kulit?"
    ],
    // 3-Tier Scaffolding Vygotsky
    scaffolding: {
      level1: "Hosh... hosh... napasku mulai tersengal dan keringat mengucur deras!",
      level2: "Detak jantung melonjak ke zona merah (>120 BPM) dan suhu tubuh memanas! Otot butuh banyak oksigen!",
      level3: "Operator Kardiorespirasi cepat naikkan frekuensi napas, dan Operator Nutrisi segera beri air minum!"
    },
    // Reflective Observation Kolb (Safe-to-fail Rogers)
    collapseAnalysis: {
      cause: "Kelelahan Ekstrem & Dehidrasi Olahraga",
      systemicReason: "Otot yang bekerja keras membakar glukosa dan oksigen dengan cepat serta memicu lonjakan panas. Kelenjar keringat memompa air untuk pendinginan, tetapi karena tidak diimbangi minum, volume darah menyusut dan jantung kelelahan.",
      actionPlan: "Pada percobaan ulang, berikan air minum secara berkala dan sinkronkan napas paru-paru dengan kecepatan gerak lari."
    },
    // Abstract Conceptualization Kolb
    victoryConceptualization: "Luar biasa! Kalian membuktikan bahwa sistem otot, sirkulasi darah, pernapasan, dan kelenjar keringat bekerja serempak dalam menjaga homeostasis saat berolahraga."
  },
  {
    id: 3,
    code: "MISI-3",
    title: "Krisis Dehidrasi Kiki",
    subTitle: "Regulasi Osmolalitas & Reabsorpsi Air di Nefron",
    bgImage: "bg_misi3_taman_terik.png",
    audioIntro: "vo_misi3_haus.mp3",
    durationSeconds: 100,
    briefing: "Aduh... matahari siang ini terik banget! Tenggorokanku kering dan badanku lemas. Darahku mulai mengental karena kekurangan cairan. Tolong beri aku minum air sekarang ya sebelum aku kolaps!",
    storyDialogues: [
      {
        speaker: "Si Meta",
        role: "Sahabat Tubuhmu",
        pose: "simeta_thirsty_parched.png",
        text: "Aduh... Matahari siang ini terik sekali! Kerongkonganku mulai terasa sangat kering dan panas..."
      },
      {
        speaker: "Si Meta",
        role: "Sahabat Tubuhmu",
        pose: "simeta_thirsty_parched.png",
        text: "Keringatku terus keluar mendinginkan badan, tapi air dalam darahku terkuras habis hingga darah jadi sangat pekat!"
      },
      {
        speaker: "Si Meta",
        role: "Sahabat Tubuhmu",
        pose: "simeta_dizzy_collapse.png",
        text: "Operator Nutrisi, cepat pasok air minum! Operator Ekskresi, tahan reabsorpsi air di nefron agar aku tidak kolaps!"
      }
    ],
    initialState: {
      hydration: 45,           // krisis dehidrasi
      coreTemp: 38.2,          // demam akibat panas lingkungan
      heartRate: 110,          // kompensasi takikardia
      bloodOsmolality: 315,    // darah kental
      ureaLevel: 28,
      saltLevel: 148,
      sweatRate: 60,
      urineVolume: 30,         // urine sedikit sekali
      energy: 55,
      liverLoad: 22,
      additiveLoad: 5,
      activityIntensity: "Terik Matahari (Dehidrasi)",
    },
    decayRates: {
      hydrationDecay: 0.40,
      tempDelta: 0.10,
      heartRateDelta: 0.30,
      ureaAccumulation: 0.20,
      energyDecay: 0.08,
      liverStrain: 0.04,
    },
    winCriteria: {
      minHomeostasis: 70,
      minTimeSeconds: 70,
    },
    availableActions: ["DRINK_WATER", "TAKE_REST_BREATH", "NEPHRON_FILTER", "EAT_BALANCED_MEAL", "LIVER_DETOX_BOOST"],
    cooldowns: {
      DRINK_WATER: 4,
      TAKE_REST_BREATH: 5,
      NEPHRON_FILTER: 6,
      EAT_BALANCED_MEAL: 8,
      LIVER_DETOX_BOOST: 8,
      SPEED_UP_RUN: 5,
      SLOW_DOWN_RUN: 5
    },
    learningFocus: [
      "Menganalisis mekanisme rasa haus sebagai alarm umpan balik tubuh",
      "Memahami peran hormon penahan air dan reabsorpsi nefron",
      "Menyelamatkan Si Meta dengan asupan hidrasi seimbang"
    ],
    lkpdQuestions: [
      "Apa yang dirasakan tubuh saat osmolalitas darah meningkat di atas batas normal?",
      "Mengapa warna urine yang dihasilkan saat dehidrasi berwarna kuning pekat?"
    ],
    // 3-Tier Scaffolding Vygotsky
    scaffolding: {
      level1: "Bibirku pecah-pecah... rasanya haus sekali dan pandanganku mulai kabur...",
      level2: "Peringatan! Osmolalitas darah melonjak di atas 310 mOsm! Darah Si Meta sangat kental!",
      level3: "Darurat dehidrasi! Operator Nutrisi segera tekan tombol Air Minum 2-3 kali untuk mengencerkan plasma darah!"
    },
    // Reflective Observation Kolb (Safe-to-fail Rogers)
    collapseAnalysis: {
      cause: "Syok Dehidrasi Akut (Hiperosmolalitas)",
      systemicReason: "Penguapan air lewat keringat di bawah terik matahari menguras plasma darah. Nefron ginjal mereabsorpsi air secara maksimal sehingga urin berhenti dan menjadi sangat pekat, namun tanpa pasokan minum baru, volume sirkulasi tidak mencukupi.",
      actionPlan: "Segera beri air minum setiap cooldown siap (jangan menunggu haus), sinkronkan dengan atur napas agar jantung tidak kelelahan."
    },
    // Abstract Conceptualization Kolb
    victoryConceptualization: "Hebat! Kalian memahami mekanisme rasa haus dan kompensasi ginjal memekatkan urin demi menyelamatkan pasokan air di pembuluh darah."
  },
  {
    id: 4,
    code: "MISI-4",
    title: "Bahaya Gorengan Asin",
    subTitle: "Nutrien, Zat Aditif & Keseimbangan Elektrolit Garam",
    bgImage: "bg_misi4_kantin.png",
    audioIntro: "vo_misi4_garam.mp3",
    durationSeconds: 110,
    briefing: "Waduh, kebanyakan jajan gorengan asin, mie instan, dan permen warna-warni di kantin nih! Lemak trans, garam natrium berlebih, plus zat pemanis, pewarna, MSG dan pengawet menumpuk! Jantungku berdebar, tekanan darah naik, dan hatiku lelah mendetoks! Tolong bantu dengan makanan gizi seimbang dan detoks hati ya — ingat, detoks mengubah amonia jadi urea, jadi lanjutkan dengan saring ginjal!",
    storyDialogues: [
      {
        speaker: "Si Meta",
        role: "Sahabat Tubuhmu",
        pose: "simeta_idle_happy.png",
        text: "Nyam! Tadi istirahat aku jajan gorengan gurih, mie instan, dan permen warna-warni di kantin sekolah. Rasanya enak banget!"
      },
      {
        speaker: "Si Meta",
        role: "Sahabat Tubuhmu",
        pose: "simeta_thirsty_parched.png",
        text: "Tapi waduh... garam natrium dan lemak trans melonjak! Pewarna, pemanis buatan, MSG dan pengawet juga ikut masuk. Darahku mengental dan hatiku bekerja lembur mendetoks!"
      },
      {
        speaker: "Si Meta",
        role: "Sahabat Tubuhmu",
        pose: "simeta_character_design.png",
        text: "Operator Ekskresi, buang garam berlebih lewat nefron ginjal dan aktifkan Detoks Hati agar amonia diubah jadi urea yang aman! Operator Nutrisi, beri aku makan gizi seimbang (nasi, lauk, sayur, buah) dan air minum!"
      }
    ],
    initialState: {
      hydration: 70,
      coreTemp: 37.1,
      heartRate: 105,
      bloodOsmolality: 310,
      ureaLevel: 22,
      saltLevel: 155,          // hipernatremia (kelebihan garam)
      sweatRate: 20,
      urineVolume: 80,
      energy: 65,              // energi cepat dari karbo instan, tapi tidak tahan lama
      liverLoad: 48,           // hati terbebani lemak trans + aditif
      additiveLoad: 42,        // pewarna, MSG, pengawet menumpuk
      activityIntensity: "Kelebihan Garam & Zat Aditif",
    },
    decayRates: {
      hydrationDecay: 0.20,
      tempDelta: 0.02,
      heartRateDelta: 0.15,
      ureaAccumulation: 0.25,
      energyDecay: 0.10,       // crash energi setelah gula instan habis
      liverStrain: 0.08,       // hati bekerja ekstra mengolah aditif
    },
    winCriteria: {
      minHomeostasis: 70,
      minTimeSeconds: 80,
    },
    availableActions: ["DRINK_WATER", "NEPHRON_FILTER", "TAKE_REST_BREATH", "EAT_BALANCED_MEAL", "EAT_INSTANT_SNACK", "LIVER_DETOX_BOOST"],
    cooldowns: {
      DRINK_WATER: 5,
      TAKE_REST_BREATH: 5,
      NEPHRON_FILTER: 5,
      EAT_BALANCED_MEAL: 6,
      EAT_INSTANT_SNACK: 6,
      LIVER_DETOX_BOOST: 6,
      SPEED_UP_RUN: 5,
      SLOW_DOWN_RUN: 5
    },
    learningFocus: [
      "Membedakan menu gizi seimbang (piring makan saya) vs jajanan instan tinggi garam-lemak",
      "Mengidentifikasi zat aditif: pemanis, pewarna, penyedap (MSG), pengawet dan risikonya",
      "Memahami peran hati mengubah amonia beracun menjadi urea + menghasilkan empedu",
      "Menganalisis proses augmentasi dalam membuang ion natrium berlebih",
      "Membiasakan pola makan rendah garam, rendah lemak trans, dan cukup air putih"
    ],
    lkpdQuestions: [
      "Bagaimana kebiasaan mengonsumsi makanan asin memengaruhi kerja penyaringan ginjal?",
      "Organ apa yang membantu membuang kelebihan garam selain ginjal?",
      "Kelompokkan jajanan kantin Si Meta ke dalam 6 nutrien + zat aditif! Mana yang termasuk karbohidrat, protein, lemak, dan zat aditif?",
      "Jelaskan alur: amonia (sisa protein) → hati (siklus urea) → darah → ginjal (urine)! Mengapa hati disebut pabrik penawar racun?"
    ],
    // 3-Tier Scaffolding Vygotsky
    scaffolding: {
      level1: "Duh, dadaku berdebar aneh dan leherku terasa kencang... perutku juga mual.",
      level2: "Garam natrium 155 mEq/L! Beban hati 48 dan zat aditif 42! Tekanan darah melonjak!",
      level3: "Beri makan gizi seimbang + air putih, operasikan augmentasi ginjal, lalu aktifkan Detoks Hati! Hindari tombol jajan instan kecuali untuk observasi!"
    },
    // Reflective Observation Kolb (Safe-to-fail Rogers)
    collapseAnalysis: {
      cause: "Hipertensi, Beban Hati & Tumpukan Zat Aditif",
      systemicReason: "Natrium berlebih menahan air di pembuluh darah, memicu lonjakan tekanan darah dan membebani pompa jantung serta glomerulus. Lemak trans, pewarna, MSG dan pengawet menambah beban detoks hati; jika hati lelah, amonia gagal diubah jadi urea dan meracuni darah.",
      actionPlan: "Beri makan gizi seimbang dan air putih, aktifkan Detoks Hati untuk mengubah amonia menjadi urea, lalu percepat filtrasi ginjal untuk membuang urea tersebut. Gunakan tombol jajan instan hanya untuk mengamati dampaknya, lalu pulihkan."
    },
    // Abstract Conceptualization Kolb
    victoryConceptualization: "Sangat baik! Kalian membuktikan bahwa makanan asin + lemak trans + zat aditif memperberat kerja jantung, hati, dan ginjal. Hati yang sehat mengubah amonia menjadi urea agar ginjal mudah membuangnya — itulah teamwork pencernaan, darah, dan ekskresi!"
  },
  {
    id: 5,
    code: "MISI-5",
    title: "Darurat Uremia Nefron",
    subTitle: "Rekonstruksi 3 Tahap Pembentukan Urine di Nefron",
    bgImage: "bg_misi5_lab_nefron.png",
    audioIntro: "vo_misi5_nefron.mp3",
    durationSeconds: 120,
    briefing: "Darurat teman-teman! Saringan nefron ginjalku tersumbat dan darahku mulai kotor keracunan urea! Ayo buka Kaca Pembesar Nefron, operasikan 3 Gerbang Molekuler (Filtrasi, Reabsorpsi, Augmentasi), dan buang racun dari tubuhku!",
    storyDialogues: [
      {
        speaker: "Si Meta",
        role: "Peneliti Fisiologi",
        pose: "simeta_character_design.png",
        text: "Selamat datang di tantangan tingkat lanjut! Kali ini kita akan melakukan rekonstruksi 3 gerbang pembentukan urin di nefron ginjalku."
      },
      {
        speaker: "Si Meta",
        role: "Peneliti Fisiologi",
        pose: "simeta_dizzy_collapse.png",
        text: "Racun urea sisa pembongkaran protein menumpuk di aliran darah. Saringan glomerulus tersumbat dan katup augmentasi tertutup!"
      },
      {
        speaker: "Si Meta",
        role: "Peneliti Fisiologi",
        pose: "simeta_idle_happy.png",
        text: "Buka Kaca Pembesar Nefron di atas! Lakukan 3 aksi: 1) Kalibrasi filtrasi, 2) Setel reabsorpsi ke 100%, dan 3) Buka katup buang racun urea!"
      }
    ],
    initialState: {
      hydration: 65,
      coreTemp: 37.4,
      heartRate: 115,
      bloodOsmolality: 305,
      ureaLevel: 60,           // uremia tinggi bahaya (selaras dengan scaffolding level2)
      saltLevel: 142,
      sweatRate: 15,
      urineVolume: 40,
      energy: 50,
      liverLoad: 35,
      additiveLoad: 10,
      activityIntensity: "Penyumbatan Saringan Nefron",
    },
    decayRates: {
      hydrationDecay: 0.15,
      tempDelta: 0.04,
      heartRateDelta: 0.20,
      ureaAccumulation: 0.50,  // racun menumpuk drastis
      energyDecay: 0.08,
      liverStrain: 0.05,
    },
    winCriteria: {
      minHomeostasis: 70,
      minTimeSeconds: 90,
    },
    availableActions: [
      "DRINK_WATER",
      "NEPHRON_FILTER",
      "TAKE_REST_BREATH",
      "NEPHRON_CALIBRATE_FILTER",
      "NEPHRON_REABSORPTION_BOOST",
      "NEPHRON_FLUSH_TOXINS",
      "EAT_BALANCED_MEAL",
      "LIVER_DETOX_BOOST"
    ],
    cooldowns: {
      DRINK_WATER: 6,
      TAKE_REST_BREATH: 6,
      NEPHRON_FILTER: 6,
      NEPHRON_CALIBRATE_FILTER: 4,
      NEPHRON_REABSORPTION_BOOST: 4,
      NEPHRON_FLUSH_TOXINS: 4,
      EAT_BALANCED_MEAL: 8,
      LIVER_DETOX_BOOST: 6,
      SPEED_UP_RUN: 7,
      SLOW_DOWN_RUN: 7
    },
    learningFocus: [
      "Membedakan fungsi 3 zona nefron: Filtrasi, Reabsorpsi, dan Augmentasi",
      "Memahami bahaya uremia (penumpukan urea dalam darah)",
      "Menjelaskan poros hati-ginjal: amonia → urea (hati) → urine (ginjal)",
      "Interaksi langsung membersihkan glomerulus yang tersumbat"
    ],
    lkpdQuestions: [
      "Apa yang terjadi jika tahap filtrasi di glomerulus tidak berjalan dengan baik?",
      "Sebutkan 3 zat yang diserap kembali ke dalam darah pada tahap reabsorpsi!",
      "Mengapa hati harus mengubah amonia menjadi urea dulu sebelum dibuang ginjal? Apa jadinya jika hati gagal?"
    ],
    // 3-Tier Scaffolding Vygotsky
    scaffolding: {
      level1: "Badanku lemas sekali dan mual... racun seperti mengendap di dalam darahku...",
      level2: "Toksisitas urea darah menembus 60 mg/dL! Nefron ginjal tersumbat!",
      level3: "Buka Kaca Pembesar Nefron di Stasiun Tengah sekarang! Putar saringan glomerulus dan buka katup augmentasi!"
    },
    // Reflective Observation Kolb (Safe-to-fail Rogers)
    collapseAnalysis: {
      cause: "Uremia Akut (Kegagalan Penyaringan Nefron)",
      systemicReason: "Glomerulus yang tersumbat membuat sisa perombakan protein (urea) tidak dapat disaring ke kapsula Bowman, akibatnya urea menumpuk di sirkulasi darah dan meracuni sel-sel tubuh. Hati yang terbebani juga kewalahan mengubah amonia baru menjadi urea aman.",
      actionPlan: "Buka mikrolensa nefron tanpa menunda, aktifkan Detoks Hati untuk mengubah amonia menjadi urea (urea darah naik sementara!), lalu bersihkan glomerulus (filtrasi) dan buang partikel urea cokelat (augmentasi)."
    },
    // Abstract Conceptualization Kolb
    victoryConceptualization: "Master Nefron! Kalian berhasil menguasai 3 tahapan pembentukan urin (Filtrasi, Reabsorpsi, dan Augmentasi), memahami poros hati-ginjal (amonia → urea → urine), serta menyelamatkan Si Meta dari racun metabolik!"
  }
];
