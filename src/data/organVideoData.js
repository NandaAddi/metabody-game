/**
 * Data Definisi Video Edukasi Fisiologi Tubuh Si Meta
 * SMP Kelas VIII - Kurikulum Merdeka (SMPN 25 Malang - Ibu Endang)
 */

import videoIntestine from "../assets/video-sistem/video sistem pencernaan.mp4";
import videoHeart from "../assets/video-sistem/VIDEO SISTEM PEREDARAN DARAH.mp4";
import videoLungs from "../assets/video-sistem/VIDEO SISTEM PERNAPASAN.mp4";
import videoKidneys from "../assets/video-sistem/VIDEO SISTEM EKSKRESI GINJAL.mp4";
import videoLiver from "../assets/video-sistem/VIDEO SISTEM EKSKRESI PABRIK HATI.mp4";
import videoSkin from "../assets/video-sistem/VIDEO SISTEM EKSKRESI KULIT.mp4";

export const ORGAN_VIDEO_DATA = {
  intestine: {
    id: "intestine",
    organName: "Usus Halus & Lambung",
    systemName: "Sistem Pencernaan",
    systemColor: "#FAD02C", // Golden yellow
    icon: "🍞",
    videoFile: videoIntestine,
    duration: "Animasi Edukasi Fisiologi",
    tagline: "Penyerapan Sari Makanan & Pembuangan Ampas Tinja",
    simetaQuote: "Setiap makanan bergizi diserap ususku jadi sari makanan ke darah, ampasnya dibuang lewat tinja agar perutku lega!",
    flow: {
      input: "Makanan (Karbohidrat, Protein, Lemak)",
      process: "Pencernaan kimiawi & penyerapan di vili usus halus",
      distribution: "Kapiler darah mengedarkan glukosa & asam amino ke seluruh sel",
      wasteOutput: "Ampas serat tak tercerna dibuang via anus berupa TINJA / FESES"
    },
    keyConcepts: [
      {
        title: "Penyerapan Sari Makanan",
        desc: "Vili usus halus menyerap molekul nutrisi kecil langsung masuk ke pembuluh darah kapiler."
      },
      {
        title: "Peredaran ke Seluruh Tubuh",
        desc: "Darah membawa sari makanan ke triliunan sel untuk bahan bakar energi dan pertumbuhan."
      },
      {
        title: "Pembuangan Ampas (Defekasi)",
        desc: "Sisa serat yang tidak bisa diserap dipadatkan di usus besar lalu dikeluarkan sebagai feses/tinja."
      }
    ],
    curriculumBadge: "Bab 2: Sistem Pencernaan (Fase D)"
  },

  heart: {
    id: "heart",
    organName: "Jantung (Cor)",
    systemName: "Sistem Peredaran Darah",
    systemColor: "#FF4444", // Cherry red
    icon: "💓",
    videoFile: videoHeart,
    duration: "Animasi Edukasi Fisiologi",
    tagline: "Pompa Utama Pengedar Sari Makanan & Oksigen ke Sel",
    simetaQuote: "Jantungku berdetak 75 kali per menit memompa darah berkecepatan tinggi agar sel-sel tubuhku tidak kelaparan!",
    flow: {
      input: "Darah kaya O2 dari paru & sari makanan dari usus",
      process: "Kontraksi ritmis otot jantung (sistol & diastol) 70-120 BPM",
      distribution: "Pembuluh arteri menyebar darah bersih ke seluruh organ & otot",
      wasteOutput: "Pembuluh vena mengangkut CO2 & urea menuju organ ekskresi"
    },
    keyConcepts: [
      {
        title: "Pompa Sirkulasi Sentral",
        desc: "Jantung memiliki 4 ruang (2 serambi, 2 bilik) yang memompa darah ke seluruh tubuh tanpa henti."
      },
      {
        title: "Pengantar Logistik Sel",
        desc: "Sel darah merah mengantarkan glukosa dan oksigen agar sel bisa hidup dan beraktivitas."
      },
      {
        title: "Jalur Pembersih Racun",
        desc: "Darah balik mengangkut limbah metabolisme sel menuju ginjal, paru-paru, dan hati untuk dibersihkan."
      }
    ],
    curriculumBadge: "Bab 2: Sistem Peredaran Darah (Fase D)"
  },

  lungs: {
    id: "lungs",
    organName: "Paru-Paru (Pulmo)",
    systemName: "Sistem Pernapasan & Ekskresi Paru",
    systemColor: "#00E5FF", // Cyan glow
    icon: "🫁",
    videoFile: videoLungs,
    duration: "Animasi Edukasi Fisiologi",
    tagline: "Menghirup Oksigen, Pembakaran Energi (ATP) & Buang CO2",
    simetaQuote: "Tarik napas segar! Oksigen membakar sari makanan di sel menghasilkan ENERGI, lalu sisa CO2 kuembuskan keluar!",
    flow: {
      input: "Udara bersih mengandung Oksigen (O2)",
      process: "Difusi gas di alveolus & pembakaran respirasi seluler di mitokondria",
      distribution: "Oksigen diikat hemoglobin darah diedarkan ke sel",
      wasteOutput: "Gas Karbondioksida (CO2) & Uap Air (H2O) diembuskan keluar"
    },
    keyConcepts: [
      {
        title: "Pertukaran Gas di Alveolus",
        desc: "Oksigen masuk menembus dinding tipis alveolus ke dalam kapiler darah."
      },
      {
        title: "Penghasil Energi Aktivitas (ATP)",
        desc: "Respirasi seluler: Glukosa + O2 -> ENERGI (ATP) untuk berlari, berpikir, dan melompat."
      },
      {
        title: "Peran Ganda Ekskresi Paru",
        desc: "Paru-paru membuang 2 zat sisa metabolisme sekaligus: gas CO2 dan uap air (H2O)."
      }
    ],
    curriculumBadge: "Bab 2: Pernapasan & Ekskresi (Fase D)"
  },

  kidneys: {
    id: "kidneys",
    organName: "Saringan Ginjal (Ren)",
    systemName: "Sistem Ekskresi Ginjal",
    systemColor: "#FF7A00", // Bright orange
    icon: "🔬",
    videoFile: videoKidneys,
    duration: "Animasi Edukasi Fisiologi",
    tagline: "Filtrasi Darah di 1 Juta Nefron & Pengeluaran Urin",
    simetaQuote: "Ginjalku menyaring ratusan liter darah setiap hari! Racun urea dan kelebihan garam dibuang lewat urin!",
    flow: {
      input: "Darah kotor membawa limbah urea dari pembuluh arteri ginjal",
      process: "Filtrasi glomerulus, Reabsorpsi tubulus, Augmentasi nefron",
      distribution: "Darah bersih dikembalikan ke peredaran tubuh",
      wasteOutput: "Limbah cair URIN (air, urea, garam, zat warna empedu)"
    },
    keyConcepts: [
      {
        title: "3 Tahap Pembentukan Urin",
        desc: "Filtrasi (penyaringan darah) -> Reabsorpsi (serap zat berguna) -> Augmentasi (pelepasan zat sisa)."
      },
      {
        title: "Penjaga Keseimbangan Cairan",
        desc: "Ginjal mengatur jumlah air dan elektrolit dalam darah agar tubuh tidak keracunan."
      },
      {
        title: "Pembuangan Urin",
        desc: "Urin dialirkan melalui ureter ke kantung kemih sebelum dikeluarkan saat buang air kecil."
      }
    ],
    curriculumBadge: "Bab 2: Sistem Ekskresi Ginjal (Fase D)"
  },

  liver: {
    id: "liver",
    organName: "Pabrik Hati (Hepar)",
    systemName: "Sistem Ekskresi Hati",
    systemColor: "#E056FD", // Vibrant purple-rose
    icon: "🧪",
    videoFile: videoLiver,
    duration: "Animasi Edukasi Fisiologi",
    tagline: "Detoksifikasi Racun Amonia jadi Urea & Cairan Empedu",
    simetaQuote: "Hatiku sang pelindung! Racun berbahaya amonia diubah jadi urea aman, dan sel darah tua dirombak jadi getah empedu!",
    flow: {
      input: "Darah kaya racun sisa metabolisme protein (amonia) & eritrosit tua",
      process: "Detoksifikasi enzimatis & pemecahan hemoglobin sel darah merah",
      distribution: "Urea dialirkan ke ginjal; empedu dialirkan ke kantung empedu",
      wasteOutput: "CAIRAN GETAH EMPEDU (pewarna feses & pencerna lemak) serta UREA"
    },
    keyConcepts: [
      {
        title: "Pabrik Detoksifikasi Racun",
        desc: "Hati menetralkan amonia berbahaya hasil metabolisme protein menjadi urea yang aman disaring ginjal."
      },
      {
        title: "Perombakan Sel Darah Merah Tua",
        desc: "Eritrosit yang berumur 120 hari dirombak; zat besi disimpan kembali, hemin diubah jadi bilirubin (empedu)."
      },
      {
        title: "Ekskresi Getah Empedu",
        desc: "Cairan empedu dikeluarkan ke usus dua belas jari untuk mengemulsi lemak makanan dan memberi warna feses/urin."
      }
    ],
    curriculumBadge: "Bab 2: Sistem Ekskresi Hati (Fase D)"
  },

  skin: {
    id: "skin",
    organName: "Kulit & Kelenjar Keringat",
    systemName: "Sistem Ekskresi Kulit",
    systemColor: "#00E5A3", // Neon mint green
    icon: "💦",
    videoFile: videoSkin,
    duration: "Animasi Edukasi Fisiologi",
    tagline: "Termoregulasi Pendingin Tubuh & Pengeluaran Keringat",
    simetaQuote: "Saat aku lari dan gerah, kelenjar keringat kulitku mengeluarkan air dan garam. Keringat menguap, tubuhku sejuk lagi!",
    flow: {
      input: "Kelebihan panas tubuh, air, garam mineral (NaCl), dan sedikit urea",
      process: "Kelenjar keringat di lapisan dermis menyerap panas & memompa cairan",
      distribution: "Keringat mengalir melalui saluran pori-pori ke permukaan kulit",
      wasteOutput: "KERINGAT yang menguap mendinginkan suhu tubuh kembali ke 37°C"
    },
    keyConcepts: [
      {
        title: "Organ Terluas Tubuh",
        desc: "Kulit melindungi organ dalam sekaligus menjadi sarana pembuangan sisa metabolisme."
      },
      {
        title: "Kelenjar Keringat (Glandula Sudorifera)",
        desc: "Terletak di lapisan dermis, menyerap air dan garam berlebih dari kapiler darah sekitar."
      },
      {
        title: "Fungsi Termoregulasi (Suhu 37°C)",
        desc: "Penguapan keringat di permukaan kulit menyerap panas tubuh sehingga suhu kembali seimbang."
      }
    ],
    curriculumBadge: "Bab 2: Sistem Ekskresi Kulit (Fase D)"
  }
};
