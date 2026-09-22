/**
 * organAnatomyData.js
 * Basis data morfologi dan anatomi 3D organ tubuh manusia
 * Selaras dengan Kurikulum Merdeka Fase D (SMP Kelas VIII Bab 2: Struktur dan Fungsi Tubuh)
 */

export const SKETCHFAB_MAP = {
  skin: {
    id: "1be1a700aaa64b9a9b67a8c3738ce55c",
    embedUrl: "https://sketchfab.com/models/1be1a700aaa64b9a9b67a8c3738ce55c/embed",
    title: "Jaringan Kulit",
    author: "Sketchfab",
    url: "https://sketchfab.com/models/1be1a700aaa64b9a9b67a8c3738ce55c"
  },
  kidney: {
    id: "78b5f854f82b4deb83c84b986d404572",
    embedUrl: "https://sketchfab.com/models/78b5f854f82b4deb83c84b986d404572/embed",
    title: "Ginjal Nefron",
    author: "niningwidiyanti131",
    url: "https://sketchfab.com/3d-models/ginjal-nefron-78b5f854f82b4deb83c84b986d404572"
  },
  kidneys: {
    id: "78b5f854f82b4deb83c84b986d404572",
    embedUrl: "https://sketchfab.com/models/78b5f854f82b4deb83c84b986d404572/embed",
    title: "Ginjal Nefron",
    author: "niningwidiyanti131",
    url: "https://sketchfab.com/3d-models/ginjal-nefron-78b5f854f82b4deb83c84b986d404572"
  },
  stomach: {
    id: "7a57f74820354cdca18b6c5bf1a9ddfc",
    embedUrl: "https://sketchfab.com/models/7a57f74820354cdca18b6c5bf1a9ddfc/embed",
    title: "Sistem Pencernaan Manusia",
    author: "Sekar Ayu",
    url: "https://sketchfab.com/3d-models/sistem-pencernaan-manusia-7a57f74820354cdca18b6c5bf1a9ddfc"
  },
  intestine: {
    id: "7a57f74820354cdca18b6c5bf1a9ddfc",
    embedUrl: "https://sketchfab.com/models/7a57f74820354cdca18b6c5bf1a9ddfc/embed",
    title: "Sistem Pencernaan Manusia",
    author: "Sekar Ayu",
    url: "https://sketchfab.com/3d-models/sistem-pencernaan-manusia-7a57f74820354cdca18b6c5bf1a9ddfc"
  },
  alveolus: {
    id: "f85a05f676a94e17af787dd21905a16a",
    embedUrl: "https://sketchfab.com/models/f85a05f676a94e17af787dd21905a16a/embed",
    title: "Alveolus",
    author: "roytimmothius",
    url: "https://sketchfab.com/3d-models/alveolus-f85a05f676a94e17af787dd21905a16a"
  },
  lungs: {
    id: "2cb7484e1c384355988711fedcdbf4a8",
    embedUrl: "https://sketchfab.com/models/2cb7484e1c384355988711fedcdbf4a8/embed",
    title: "paru-paru",
    author: "211630014",
    url: "https://sketchfab.com/3d-models/paru-paru-2cb7484e1c384355988711fedcdbf4a8"
  }
};

export const organAnatomyData = {
  skin: {
    id: "skin",
    name: "Kulit & Jaringan Integumen (Skin)",
    system: "Sistem Ekskresi & Termoregulasi",
    icon: "💦",
    color: "#0284C7",
    description:
      "Organ terluar pelindung tubuh yang mengekskresikan keringat (air, garam, dan sedikit urea) untuk menurunkan suhu tubuh saat berolahraga dan kepanasan.",
    funFact:
      "Kulit manusia memiliki sekitar 2 hingga 4 juta kelenjar keringat yang bekerja otomatis saat otak mendeteksi kenaikan suhu tubuh di atas 37°C!",
    sketchfab: SKETCHFAB_MAP.skin,
    hotspots: [
      {
        id: "epidermis",
        name: "Epidermis (Lapisan Kulit Ari)",
        position: [0.0, 0.9, 0.3],
        latin: "Epidermis",
        function:
          "Lapisan epitel terluar tahan air yang melindungi tubuh dari kuman patogen serta memiliki pori-pori tempat keluarnya tetesan keringat."
      },
      {
        id: "sweat-gland",
        name: "Kelenjar Keringat (Glandula Sudorifera)",
        position: [0.2, -0.1, 0.4],
        latin: "Glandula sudorifera",
        function:
          "Saluran pipa melingkar di lapisan dermis yang menyerap air, garam natrium, dan sisa metabolisme dari kapiler darah lalu mengeluarkannya ke permukaan kulit."
      },
      {
        id: "capillaries",
        name: "Pembuluh Kapiler Kulit",
        position: [-0.4, -0.4, 0.3],
        latin: "Vas capillare",
        function:
          "Melebar (vasodilatasi) saat tubuh panas agar darah melepaskan panas ke udara luar, dan menyempit (vasokonstriksi) saat tubuh kedinginan."
      },
      {
        id: "dermis",
        name: "Lapisan Dermis (Kulit Jangat)",
        position: [0.3, 0.2, 0.2],
        latin: "Dermis",
        function:
          "Lapisan tebal di bawah epidermis yang kaya pembuluh darah, ujung saraf perasa panas/dingin/sentuhan, dan akar rambut."
      }
    ]
  },

  kidney: {
    id: "kidney",
    name: "Ginjal & Nefron (Renal)",
    system: "Sistem Ekskresi & Osmoregulasi",
    icon: "🔬",
    color: "#4F46E5",
    description:
      "Sepasang organ berbentuk seperti kacang merah yang bertugas menyaring limbah metabolisme (terutama urea dan kelebihan garam) dari darah untuk dijadikan urine.",
    funFact:
      "Setiap ginjal mengandung sekitar 1 juta unit penyaring mikroskopis yang disebut nefron. Dalam sehari, ginjal menyaring sekitar 180 liter cairan darah!",
    sketchfab: SKETCHFAB_MAP.kidney,
    hotspots: [
      {
        id: "glomerulus",
        name: "Glomerulus & Kapsula Bowman (Filtrasi)",
        position: [1.2, 0.5, 0.4],
        latin: "Glomerulus & Capsula Bowman",
        function:
          "Anyaman kapiler darah bertekanan tinggi tempat terjadinya tahap pertama Filtrasi penyaringan darah kotor menghasilkan Urine Primer."
      },
      {
        id: "tubulus-proximal",
        name: "Tubulus Proksimal (Reabsorpsi)",
        position: [0.3, -0.2, 0.5],
        latin: "Tubulus contortus proximalis",
        function:
          "Saluran penyerapan kembali 100% zat berguna seperti glukosa, asam amino, dan 99% air ke kapiler darah menghasilkan Urine Sekunder."
      },
      {
        id: "henle-loop",
        name: "Lengkung Henle",
        position: [0.1, -0.8, 0.3],
        latin: "Ansa Henle",
        function:
          "Saluran berbentuk huruf U yang mengatur keseimbangan konsentrasi air dan garam natrium (osmoregulasi cairan tubuh)."
      },
      {
        id: "tubulus-distal",
        name: "Tubulus Distal & Kolektivus (Augmentasi)",
        position: [-0.6, 0.0, 0.3],
        latin: "Tubulus contortus distalis",
        function:
          "Tahap penambahan zat racun sisa urea, amonia, dan obat-obatan untuk membentuk Urine Sesungguhnya yang siap dialirkan ke kantung kemih."
      },
      {
        id: "cortex",
        name: "Korteks Renalis (Kulit Ginjal)",
        position: [0.8, 0.7, 0.2],
        latin: "Cortex renalis",
        function:
          "Lapisan luar ginjal yang menjadi rumah bagi jutaan badan Malpighi (Glomerulus + Kapsula Bowman)."
      }
    ]
  },

  stomach: {
    id: "stomach",
    name: "Sistem Pencernaan Manusia (Digestive)",
    system: "Sistem Pencernaan Makanan",
    icon: "🍞",
    color: "#F59E0B",
    description:
      "Saluran terintegrasi dari kerongkongan, lambung, hingga usus halus dan usus besar yang mencerna makanan menjadi nutrisi glukosa dan menyerapnya ke darah.",
    funFact:
      "Panjang seluruh saluran pencernaan manusia jika dibentangkan bisa mencapai sekitar 8-9 meter dari mulut hingga ujung saluran pembuangan!",
    sketchfab: SKETCHFAB_MAP.stomach,
    hotspots: [
      {
        id: "stomach-gaster",
        name: "Lambung (Gaster)",
        position: [-0.2, 0.4, 0.4],
        latin: "Gaster / Ventriculus",
        function:
          "Meremas makanan secara mekanis dan mencampurnya dengan asam klorida (HCl) serta enzim pepsin pemecah protein menjadi bubur kimus."
      },
      {
        id: "small-intestine",
        name: "Usus Halus (Duodenum, Jejunum, Ileum)",
        position: [0.0, -0.3, 0.5],
        latin: "Intestinum tenue",
        function:
          "Tempat utama pencernaan kimiawi lanjutan oleh enzim pankreas/empedu dan penyerapan 90% sari-sari makanan glukosa ke pembuluh kapiler darah."
      },
      {
        id: "large-intestine",
        name: "Usus Besar (Kolon)",
        position: [0.6, -0.2, 0.3],
        latin: "Intestinum crassum",
        function:
          "Menyerap kembali kelebihan air dan mineral dari ampas makanan serta membentuk massa feses dengan bantuan bakteri pembusuk E. coli."
      },
      {
        id: "esophagus",
        name: "Kerongkongan (Esofagus)",
        position: [0.0, 1.1, 0.1],
        latin: "Esophagus",
        function:
          "Saluran pipa berotot yang mendorong gumpalan bolus makanan dari mulut menuju lambung melalui gerakan peristaltik bergelombang."
      }
    ]
  },

  alveolus: {
    id: "alveolus",
    name: "Alveolus (Kantung Udara Mikroskopis)",
    system: "Sistem Pernapasan & Difusi Gas",
    icon: "🫧",
    color: "#06B6D4",
    description:
      "Kantung udara mikroskopis bergelembung di ujung bronkiolus tempat terjadinya pertukaran gas O2 (masuk ke darah) dan CO2 (dibuang ke udara luar).",
    funFact:
      "Terdapat sekitar 300-500 juta kantung alveolus di paru-paru manusia yang dilapisi oleh jaringan pembuluh darah kapiler yang sangat rapat!",
    sketchfab: SKETCHFAB_MAP.alveolus,
    hotspots: [
      {
        id: "capillary-net",
        name: "Anyaman Kapiler Darah",
        position: [0.2, 0.1, 0.5],
        latin: "Plexus capillaris",
        function:
          "Jejaring pembuluh darah kapiler halus yang membungkus dinding alveolus untuk menangkap molekul oksigen dan melepaskan karbon dioksida."
      },
      {
        id: "alveolar-sac",
        name: "Dinding Kantung Alveolus",
        position: [-0.3, 0.3, 0.4],
        latin: "Saccus alveolaris",
        function:
          "Dinding epitel selapis pipih yang sangat tipis (hanya 0.5 mikron) untuk memaksimalkan laju difusi respirasi gas O2 dan CO2."
      },
      {
        id: "bronchiole",
        name: "Bronkiolus Respiratori",
        position: [0.0, -0.6, 0.2],
        latin: "Bronchiolus respiratorius",
        function:
          "Saluran pipa udara halus terkecil yang mengantarkan oksigen dari percabangan bronkus langsung menuju kelompok kantung alveolus."
      }
    ]
  },

  lungs: {
    id: "lungs",
    name: "Paru-Paru (Pulmo)",
    system: "Sistem Pernapasan & Ekskresi Gas",
    icon: "🫁",
    color: "#0284C7",
    description:
      "Sepasang organ spons elastis di dalam rongga dada tempat terjadinya pertukaran gas vital: menyerap oksigen untuk energi sel dan membuang karbon dioksida serta uap air.",
    funFact:
      "Jika seluruh gelembung alveolus di dalam kedua paru-paru dibentangkan rata, luas permukaannya bisa mencapai sekitar 70 meter persegi atau seukuran lapangan bulu tangkis!",
    sketchfab: SKETCHFAB_MAP.lungs,
    hotspots: [
      {
        id: "trachea",
        name: "Trakea (Batang Tenggorokan)",
        position: [0.0, 1.2, 0.2],
        latin: "Trachea",
        function:
          "Pipa tulang rawan cincin tempat udara masuk dan disaring dari partikel debu oleh silia halus sebelum masuk ke percabangan paru-paru."
      },
      {
        id: "bronchi",
        name: "Bronkus (Cabang Tenggorokan)",
        position: [0.1, 0.5, 0.1],
        latin: "Bronchus principalis",
        function:
          "Percabangan trakea menjadi dua cabang utama yang membawa aliran udara bersih masing-masing menuju paru-paru kanan dan paru-paru kiri."
      },
      {
        id: "right-lung",
        name: "Paru-Paru Kanan (3 Lobus)",
        position: [-1.0, -0.2, 0.4],
        latin: "Pulmo dexter",
        function:
          "Memiliki tiga belahan (lobus superior, medius, inferior). Ukurannya sedikit lebih besar daripada paru-paru kiri karena posisi hati di bawahnya."
      },
      {
        id: "left-lung",
        name: "Paru-Paru Kiri (2 Lobus)",
        position: [1.0, -0.2, 0.4],
        latin: "Pulmo sinister",
        function:
          "Memiliki dua belahan (lobus superior & inferior) dengan lekukan khusus (incisura cardiaca) untuk memberi ruang bagi posisi jantung di dada kiri."
      },
      {
        id: "alveoli",
        name: "Alveolus (Kantung Udara)",
        position: [0.9, -0.8, 0.5],
        latin: "Alveoli pulmonis",
        function:
          "Gelembung udara berdinding satu lapis sel tipis yang diselimuti kapiler darah. Tempat difusi pertukaran O2 masuk ke darah dan CO2 keluar ke udara."
      }
    ]
  },

  heart: {
    id: "heart",
    name: "Jantung (Cor)",
    system: "Sistem Peredaran Darah (Kardiovaskular)",
    icon: "❤️",
    color: "#EF4444",
    description:
      "Pompa otot berongga seukuran kepalan tangan yang bekerja memompa darah beroksigen ke seluruh jaringan sel tubuh dan mengalirkan darah ber-CO2 ke paru-paru.",
    funFact:
      "Dalam kondisi istirahat siswa SMP, jantung berdetak sekitar 70-80 kali per menit dan memompa sekitar 5 liter darah ke seluruh tubuh tanpa henti!",
    hotspots: [
      {
        id: "right-atrium",
        name: "Serambi Kanan (Atrium Kanan)",
        position: [-0.8, 0.4, 0.5],
        latin: "Atrium dextrum",
        function:
          "Menerima darah kaya karbon dioksida (CO2) dan sisa metabolisme yang kembali dari seluruh jaringan sel tubuh melalui vena kava."
      },
      {
        id: "right-ventricle",
        name: "Bilik Kanan (Ventrikel Kanan)",
        position: [-0.6, -0.7, 0.6],
        latin: "Ventriculus dexter",
        function:
          "Memompa darah miskin oksigen/kaya CO2 keluar jantung menuju paru-paru melalui arteri pulmonalis untuk dibersihkan."
      },
      {
        id: "left-atrium",
        name: "Serambi Kiri (Atrium Kiri)",
        position: [0.8, 0.5, -0.3],
        latin: "Atrium sinistrum",
        function:
          "Menerima darah segar kaya oksigen (O2) yang baru saja selesai dibersihkan di alveolus paru-paru melalui vena pulmonalis."
      },
      {
        id: "left-ventricle",
        name: "Bilik Kiri (Ventrikel Kiri)",
        position: [0.7, -0.8, 0.5],
        latin: "Ventriculus sinister",
        function:
          "Memiliki dinding otot paling tebal dan kuat karena bertugas memompa darah bertekanan tinggi kaya O2 dan nutrisi ke seluruh penjuru tubuh."
      },
      {
        id: "aorta",
        name: "Aorta (Batang Nadi Besar)",
        position: [0.1, 1.2, 0.2],
        latin: "Aorta ascendens",
        function:
          "Pembuluh arteri terbesar di tubuh manusia yang melengkung di atas jantung untuk mendistribusikan darah segar ke kepala, tangan, organ dalam, dan kaki."
      }
    ]
  },

  liver: {
    id: "liver",
    name: "Pabrik Hati (Hepar)",
    system: "Sistem Pencernaan & Ekskresi Detoksifikasi",
    icon: "🧪",
    color: "#D97706",
    description:
      "Kelenjar terbesar di tubuh manusia yang berfungsi memecah senyawa racun berbahaya (seperti amonia sisa perombakan protein menjadi urea) serta menghasilkan cairan empedu.",
    funFact:
      "Hati adalah satu-satunya organ dalam tubuh manusia yang memiliki kemampuan regenerasi luar biasa—dapat tumbuh kembali ke ukuran semula meski terpotong!",
    hotspots: [
      {
        id: "right-lobe",
        name: "Lobus Kanan Hati (Lobus Terbesar)",
        position: [-0.6, 0.1, 0.4],
        latin: "Lobus dexter hepatis",
        function:
          "Bagian utama hati tempat berjuta-juta sel hepatosit menetralkan racun amonia beracun menjadi urea yang siap disalurkan ke darah dan dibuang ginjal."
      },
      {
        id: "left-lobe",
        name: "Lobus Kiri Hati",
        position: [0.8, 0.2, 0.2],
        latin: "Lobus sinister hepatis",
        function:
          "Menyimpan kelebihan glukosa darah dalam bentuk glikogen (cadangan energi) serta membantu sintesis protein plasma darah."
      },
      {
        id: "gallbladder",
        name: "Kantung Empedu (Vesica Fellea)",
        position: [-0.3, -0.6, 0.5],
        latin: "Vesica fellea",
        function:
          "Kantung hijau penampung cairan empedu hasil sekresi hati yang bertugas mengemulsikan lemak makanan di usus 12 jari."
      }
    ]
  }
};

// Aliases agar cocok dengan semua variasi id di kanvas game
organAnatomyData.kidneys = organAnatomyData.kidney;
organAnatomyData.intestine = organAnatomyData.stomach;
