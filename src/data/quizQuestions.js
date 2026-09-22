/**
 * DATA BANK SOAL EVALUASI & KUIS METABODY
 * Mengukur 4 Indikator Keterampilan Berpikir Sistemik (Systems Thinking)
 * Jenjang Kognitif C3 - C6 (Kelas VIII Fase D Kurikulum Merdeka)
 */

export const PRETEST_QUESTIONS = [
  {
    id: 1,
    indicator: "Identifikasi Komponen & Organ",
    level: "C3",
    question: "Manakah di bawah ini yang merupakan pasangan organ ekskresi manusia dan zat sisa metabolik yang dikeluarkannya dengan benar?",
    options: [
      "Paru-paru mengeluarkan oksigen dan uap air",
      "Ginjal mengeluarkan urine yang mengandung urea, air, dan garam mineral",
      "Kulit mengeluarkan feses dan garam mineral",
      "Hati mengeluarkan karbon dioksida dan cairan lambung"
    ],
    answer: 1,
    explanation: "Ginjal berfungsi menyaring darah dan membuang urea, kelebihan air, serta garam mineral dalam bentuk urine. Karbon dioksida dikeluarkan oleh paru-paru, sedangkan feses adalah sisa pencernaan (defekasi), bukan ekskresi."
  },
  {
    id: 2,
    indicator: "Identifikasi Komponen & Organ",
    level: "C4",
    question: "Hati merupakan salah satu organ ekskresi penting. Apa peran utama hati yang berkaitan erat dengan proses ekskresi di ginjal?",
    options: [
      "Menghasilkan sel darah merah baru untuk disaring di nefron",
      "Mengubah zat amonia beracun sisa metabolisme protein menjadi urea yang lebih aman",
      "Menyerap kembali glukosa yang lolos ke kantung empedu",
      "Memompa urine langsung ke kandung kemih"
    ],
    answer: 1,
    explanation: "Hati mendetoksifikasi racun dengan merombak amonia (sisa asam amino) menjadi urea yang larut air melalui siklus ornitin. Urea ini kemudian diedarkan darah menuju ginjal untuk disaring dan dibuang."
  },
  {
    id: 3,
    indicator: "Keterhubungan Dinamis Sebab-Akibat",
    level: "C4",
    question: "Setelah melakukan aktivitas fisik berat seperti berlari mengelilingi lapangan, seseorang bernapas lebih cepat dan kulitnya berkeringat. Penjelasan ilmiah yang paling tepat adalah...",
    options: [
      "Tubuh berhenti melakukan metabolisme untuk menghemat energi",
      "Aktivitas sel meningkat sehingga kebutuhan oksigen dan pembuangan hasil metabolisme meningkat",
      "Ginjal berhenti menyaring darah selama tubuh bergerak aktif",
      "Sistem pencernaan tidak lagi bekerja sehingga energi teralihkan"
    ],
    answer: 1,
    explanation: "Aktivitas lari memacu metabolisme seluler di otot untuk memproduksi energi. Hal ini meningkatkan kebutuhan oksigen (memicu napas lebih cepat dan denyut jantung naik) serta menghasilkan sisa metabolisme berupa CO2 dan panas (memicu pengeluaran keringat)."
  },
  {
    id: 4,
    indicator: "Keterhubungan Dinamis Sebab-Akibat",
    level: "C4",
    question: "Mengapa setelah berolahraga berat di cuaca panas, urine yang dikeluarkan berjumlah lebih sedikit dan warnanya tampak lebih pekat/kuning tua?",
    options: [
      "Sebagian besar cairan tubuh telah keluar dalam bentuk keringat untuk mendinginkan suhu tubuh, sehingga ginjal menghemat air lewat reabsorpsi",
      "Ginjal berhenti bekerja sama sekali saat tubuh sedang bergerak aktif",
      "Zat racun di ginjal berubah menjadi keringat dan keluar lewat pori-pori",
      "Kandung kemih menyerap kembali urine yang sudah terbentuk"
    ],
    answer: 0,
    explanation: "Ketika tubuh banyak berkeringat untuk termoregulasi, volume plasma darah menurun. Nefron ginjal merespons dengan meningkatkan penyerapan kembali (reabsorpsi) air, sehingga urine yang terbentuk bervolume sedikit dan pekat."
  },
  {
    id: 5,
    indicator: "Keterhubungan Dinamis Sebab-Akibat",
    level: "C4",
    question: "Pernyataan yang paling tepat mengenai keterkaitan terpadu antara sistem pencernaan, peredaran darah, pernapasan, dan sistem ekskresi dalam tubuh manusia adalah...",
    options: [
      "Sistem ekskresi bekerja secara mandiri tanpa keterkaitan dengan sistem organ lainnya",
      "Darah hanya berfungsi membawa gas oksigen tanpa membawa sari makanan maupun zat sisa",
      "Sistem pencernaan menyediakan zat yang diserap, darah mengangkut zat, sel menghasilkan sisa metabolisme, dan organ ekskresi membantu mengeluarkannya",
      "Paru-paru hanya berfungsi mengambil oksigen tanpa terlibat dalam proses pengeluaran zat sisa metabolisme"
    ],
    answer: 2,
    explanation: "Keempat sistem terhubung sebagai satu kesatuan: pencernaan mencerna dan menyerap nutrien, darah mengedarkan nutrien dan O2 ke sel, metabolisme sel menghasilkan energi dan zat sisa, lalu organ ekskresi (ginjal, kulit, paru-paru, hati) membuang sisa metabolisme untuk mempertahankan homeostasis."
  },
  {
    id: 6,
    indicator: "Regulasi Homeostasis & Umpan Balik",
    level: "C5",
    question: "Seorang murid jarang minum dan sering melakukan aktivitas fisik di cuaca panas. Berdasarkan fungsi sistem ekskresi, kebiasaan tersebut perlu diperbaiki karena...",
    options: [
      "Tubuh manusia sama sekali tidak memerlukan air saat berkeringat",
      "Kehilangan cairan yang tidak diimbangi asupan air dapat memengaruhi keseimbangan internal (homeostasis) tubuh",
      "Paru-paru akan berhenti mengeluarkan gas karbon dioksida",
      "Sistem pencernaan otomatis berhenti bekerja seketika"
    ],
    answer: 1,
    explanation: "Keringat menyebabkan kehilangan cairan dalam jumlah signifikan. Jika asupan air kurang, osmolalitas darah meningkat dan volume cairan tubuh turun drastis, mengganggu kestabilan homeostasis dan membebani fungsi ginjal."
  },
  {
    id: 7,
    indicator: "Regulasi Homeostasis & Umpan Balik",
    level: "C5",
    question: "Jika seseorang meminum air putih sebanyak 1,5 liter sekaligus saat sedang santai di ruangan berhawa dingin, apa respons fisiologis tubuh untuk menjaga homeostasis?",
    options: [
      "Tubuh akan mengeluarkan banyak keringat dingin",
      "Ginjal akan memproduksi urine yang encer dan berjumlah banyak (sering buang air kecil)",
      "Kadar garam dalam darah akan meningkat drastis",
      "Laju pernapasan akan meningkat dua kali lipat"
    ],
    answer: 1,
    explanation: "Di lingkungan dingin, pengeluaran air lewat kulit (keringat) minimal. Kelebihan cairan dalam tubuh menurunkan osmolalitas darah, memicu ginjal mengurangi reabsorpsi air sehingga terbentuk urine yang encer dan melimpah untuk memulihkan keseimbangan."
  },
  {
    id: 8,
    indicator: "Prediksi Gangguan Sistem Organ",
    level: "C5",
    question: "Jika aliran darah menuju ginjal mengalami gangguan atau penurunan drastis, dampak fisiologis yang paling mungkin terjadi pada tubuh adalah...",
    options: [
      "Penyaringan darah dan proses pembentukan urine terganggu",
      "Makanan padat tidak dapat masuk ke dalam lambung",
      "Udara pernapasan tidak dapat masuk ke dalam saluran trakea",
      "Jantung berhenti memompa darah seketika"
    ],
    answer: 0,
    explanation: "Ginjal membutuhkan pasokan dan tekanan darah yang memadai untuk melakukan filtrasi di glomerulus. Gangguan aliran darah menyebabkan laju filtrasi glomerulus turun drastis sehingga pembentukan urine dan pembuangan zat racun terhambat."
  },
  {
    id: 9,
    indicator: "Prediksi Gangguan Sistem Organ",
    level: "C5",
    question: "Hasil uji laboratorium menunjukkan urine seorang pasien mengandung glukosa dalam kadar tinggi. Berdasarkan proses pembentukan urine di nefron, bagian manakah yang mengalami kegagalan fungsi?",
    options: [
      "Glomerulus gagal menyaring urea dari plasma darah",
      "Tubulus kontortus proksimal gagal melakukan reabsorpsi glukosa secara optimal",
      "Tubulus kontortus distal gagal menambahkan zat racun (augmentasi)",
      "Uretra mengalami penyumbatan oleh kristal garam"
    ],
    answer: 1,
    explanation: "Dalam kondisi normal, 100% glukosa yang lolos ke urine primer akan diserap kembali (reabsorpsi) oleh tubulus kontortus proksimal. Keberadaan glukosa pada urine mengindikasikan gangguan reabsorpsi pada tubulus proksimal (atau melebihi ambang batas ginjal seperti pada diabetes mellitus)."
  },
  {
    id: 10,
    indicator: "Prediksi Gangguan Sistem Organ",
    level: "C6",
    question: "Apabila kedua ginjal seseorang mengalami kerusakan parah (gagal ginjal akut) sehingga tidak dapat memproduksi urine, bagaimana dampak sistemik yang ditimbulkan pada organ tubuh lainnya?",
    options: [
      "Hanya sistem perkemihan yang terganggu, sedangkan sistem peredaran darah tetap normal",
      "Zat racun urea dan kelebihan cairan menumpuk di darah (uremia), membebani kerja jantung dan meracuni sel-sel tubuh",
      "Tubuh otomatis mengganti fungsi ginjal dengan menambah keluaran zat padat lewat usus",
      "Suhu tubuh turun drastis dan kulit menjadi sangat kering tanpa berkeringat"
    ],
    answer: 1,
    explanation: "Tubuh adalah sistem terintegrasi. Gagal ginjal menyebabkan uremia (penumpukan toksin nitrogen) dan hipervolemia (penumpukan cairan) di pembuluh darah, yang memicu hipertensi, edema paru, beban jantung berlebih, hingga kerusakan fungsi otak."
  }
];

export const POSTTEST_QUESTIONS = [
  {
    id: 1,
    indicator: "Identifikasi Komponen & Organ",
    level: "C3",
    question: "Organ ekskresi manusia berikut yang memiliki peran ganda dalam mengeluarkan zat sisa berupa air dan garam mineral sekaligus berfungsi vital dalam termoregulasi (penurunan suhu tubuh) adalah...",
    options: [
      "Ginjal melalui pengeluaran urine",
      "Paru-paru melalui pengeluaran uap air",
      "Kulit melalui pengeluaran keringat",
      "Hati melalui sekresi empedu"
    ],
    answer: 2,
    explanation: "Kulit memiliki kelenjar keringat yang menyekresikan keringat (air, sedikit garam mineral, dan sedikit urea). Penguapan keringat di permukaan kulit menyerap panas tubuh sehingga berfungsi sebagai mekanisme pendinginan (termoregulasi)."
  },
  {
    id: 2,
    indicator: "Identifikasi Komponen & Organ",
    level: "C4",
    question: "Ketika sel-sel tubuh merombak protein menjadi energi, dihasilkan zat sisa beracun berupa amonia. Peran penting organ hati sebelum zat sisa tersebut disaring oleh ginjal adalah...",
    options: [
      "Langsung mengalirkan amonia ke paru-paru untuk diembuskan",
      "Mengubah zat amonia beracun menjadi urea yang lebih aman dan larut air",
      "Mengeluarkan amonia secara utuh melalui pori-pori kulit",
      "Menyimpan amonia di kantung empedu untuk selamanya"
    ],
    answer: 1,
    explanation: "Hati melakukan detoksifikasi melalui siklus urea (ornitin), mereaksikan amonia beracun dengan CO2 menjadi urea yang sifat racunnya jauh lebih rendah, lalu membawanya lewat aliran darah untuk diekskresikan oleh ginjal."
  },
  {
    id: 3,
    indicator: "Keterhubungan Dinamis Sebab-Akibat",
    level: "C4",
    question: "Saat seseorang melakukan lari cepat (sprint) di lapangan sekolah, frekuensi pernapasan dan denyut jantung meningkat secara drastis dan serempak. Hal ini membuktikan prinsip biologis bahwa...",
    options: [
      "Kerja sistem pernapasan, sirkulasi darah, dan ekskresi saling terkoordinasi erat dalam satu kesatuan sistem tubuh",
      "Paru-paru dapat menyuplai oksigen secara mandiri tanpa memerlukan aliran darah",
      "Jantung memompa darah lebih lambat agar tubuh tidak cepat kelelahan",
      "Laju pembentukan urine otomatis meningkat saat seseorang berlari kencang"
    ],
    answer: 0,
    explanation: "Aktivitas kontraksi otot membutuhkan lonjakan pasokan glukosa dan O2 serta menghasilkan banyak CO2 dan panas. Jantung memompa darah lebih deras dan paru-paru bernapas lebih cepat secara terkoordinasi untuk memenuhi kebutuhan metabolisme seluler."
  },
  {
    id: 4,
    indicator: "Keterhubungan Dinamis Sebab-Akibat",
    level: "C4",
    question: "Mengapa orang yang seharian beraktivitas intensif di bawah terik matahari dan mengeluarkan banyak keringat memiliki frekuensi buang air kecil yang sangat sedikit?",
    options: [
      "Saluran uretra tertutup oleh otot panggul yang tegang",
      "Air tubuh banyak terbuang melalui keringat, sehingga ginjal memicu penyerapan kembali (reabsorpsi) air secara maksimal",
      "Ginjal mengubah urine menjadi keringat di dalam jaringan tubuh",
      "Zat sisa metabolisme sudah habis dikeluarkan seluruhnya oleh paru-paru"
    ],
    answer: 1,
    explanation: "Keluarnya keringat menurunkan volume air dalam darah. Otak merespons dengan pelepasan hormon ADH yang memerintahkan tubulus nefron menyerap kembali air sebanyak-banyaknya, menghasilkan urine yang sedikit dan pekat guna menghemat cairan."
  },
  {
    id: 5,
    indicator: "Keterhubungan Dinamis Sebab-Akibat",
    level: "C4",
    question: "Zat sari-sari makanan hasil pencernaan diedarkan oleh pembuluh darah ke seluruh jaringan tubuh. Ke manakah zat metabolik yang sudah tidak diperlukan lagi atau bersifat toksik akhirnya dikeluarkan?",
    options: [
      "Dibiarkan menumpuk secara permanen di dinding pembuluh darah",
      "Dikeluarkan melalui organ ekskresi terpadu: paru-paru (CO2), ginjal (urine/urea), dan kulit (keringat)",
      "Diserap kembali oleh lambung untuk dicerna berulang kali",
      "Didepositkan ke dalam jaringan tulang secara terus-menerus"
    ],
    answer: 1,
    explanation: "Darah membawa zat sisa metabolisme sel ke organ ekskresi spesifik: gas CO2 ke paru-paru, senyawa nitrogen/urea dan kelebihan elektrolit ke ginjal, serta panas dan keringat ke kulit."
  },
  {
    id: 6,
    indicator: "Regulasi Homeostasis & Umpan Balik",
    level: "C5",
    question: "Apakah yang dimaksud dengan konsep Homeostasis pada sistem organ tubuh manusia?",
    options: [
      "Kondisi ketika seluruh organ tubuh berhenti bekerja dan beristirahat secara pasif",
      "Kemampuan sistem organ tubuh mempertahankan kestabilan kondisi fisik dan kimia internal agar tetap seimbang dan optimal",
      "Kondisi saat tubuh menumpuk zat sisa metabolisme sebanyak-banyaknya",
      "Proses membuang seluruh cairan tubuh secara berlebihan melalui nefron"
    ],
    answer: 1,
    explanation: "Homeostasis adalah regulasi dinamis lingkungan internal tubuh (suhu 37°C, osmolalitas darah, kadar glukosa, dan pH) agar tetap dalam batas toleransi normal meskipun lingkungan eksternal berubah."
  },
  {
    id: 7,
    indicator: "Regulasi Homeostasis & Umpan Balik",
    level: "C5",
    question: "Ketika berada di ruangan bersuhu sangat dingin, seseorang hampir tidak mengeluarkan keringat, namun frekuensi berkemih (buang air kecil) menjadi lebih sering. Mekanisme regulasi tubuh yang menjelaskan hal ini adalah...",
    options: [
      "Pembuluh darah kulit melebar dan menyerap uap air dari udara luar",
      "Karena pengeluaran air via kulit minimal, ginjal mengekskresikan kelebihan cairan tubuh dalam bentuk volume urine yang lebih banyak dan encer",
      "Ginjal mengalami pembengkakan akibat penurunan suhu lingkungan",
      "Laju pernapasan melambat drastis sehingga cairan dialihkan ke paru-paru"
    ],
    answer: 1,
    explanation: "Saat suhu lingkungan dingin, pembuluh darah kulit menyempit (vasokonstriksi) dan keringat minimal. Untuk mencegah kelebihan volume cairan dalam sirkulasi darah, ginjal mengekskresikan lebih banyak air menjadi urine encer."
  },
  {
    id: 8,
    indicator: "Prediksi Gangguan Sistem Organ",
    level: "C5",
    question: "Pada proses pembentukan urine di nefron, tahap yang berfungsi menyerap kembali molekul-molekul penting (seperti glukosa, asam amino, air, dan garam) dari urine primer kembali ke aliran darah adalah...",
    options: [
      "Filtrasi pada membran kapiler glomerulus",
      "Reabsorpsi pada tubulus kontortus proksimal dan lengkung Henle",
      "Augmentasi pada tubulus kontortus distal",
      "Defekasi pada usus besar dan rektum"
    ],
    answer: 1,
    explanation: "Reabsorpsi adalah proses esensial di nefron untuk mengambil kembali lebih dari 99% air dan semua zat nutrisi terlarut (glukosa, asam amino) dari filtrat glomerulus (urine primer) agar tidak hilang terbuang."
  },
  {
    id: 9,
    indicator: "Prediksi Gangguan Sistem Organ",
    level: "C5",
    question: "Jika membran filtrasi pada glomerulus ginjal mengalami kerusakan atau kebocoran membran saringan, kelainan apa yang dapat diprediksi terdeteksi dalam urine pasien?",
    options: [
      "Urine yang dihasilkan menjadi murni seperti air mineral jernih",
      "Ditemukan kandungan protein darah (albumin) dan sel darah merah di dalam urine",
      "Kelenjar kulit menghasilkan keringat dengan aroma wangi buah",
      "Kapasitas paru-paru dalam menghirup oksigen meningkat tajam"
    ],
    answer: 1,
    explanation: "Membran glomerulus normal memiliki pori mikroskopis selektif yang menahan molekul besar seperti albumin dan sel darah merah. Jika saringan ini bocor (misalnya pada glomerulonefritis), protein dan darah akan lolos ke kapsula Bowman (proteinuria dan hematuria)."
  },
  {
    id: 10,
    indicator: "Prediksi Gangguan Sistem Organ",
    level: "C6",
    question: "Berdasarkan pemahaman mengenai keterkaitan terpadu antara sistem sirkulasi, pencernaan, respirasi, dan ekskresi, pola kebiasaan hidup apa yang paling tepat untuk menjaga kesehatan ginjal dan organ ekskresi?",
    options: [
      "Sering mengonsumsi makanan asin gurih dan membatasi minum air putih agar tidak sering kencing",
      "Rutin berolahraga teratur, mencukupi asupan air putih minimal 2 liter per hari, dan membatasi konsumsi garam serta makanan berlemak tinggi",
      "Menghindari semua aktivitas fisik agar organ ekskresi tidak bekerja keras",
      "Hanya meminum minuman suplemen energi instan saat haus"
    ],
    answer: 1,
    explanation: "Air putih yang cukup menjaga laju filtrasi ginjal dan mencegah pembentukan batu ginjal; membatasi garam mencegah hipertensi yang merusak kapiler glomerulus; dan olahraga rutin melatih fungsi kardiorespirasi dan sirkulasi darah."
  }
];

export const DETECTIVE_QUIZ = [
  {
    id: "case-1",
    title: "Misteri Urine Kuning Pekat",
    clue: "Setelah jam olahraga lari, urine Si Meta tampak kuning tua dan jumlahnya sedikit.",
    question: "Apa penyebab utama perubahan fisik urine ini?",
    options: [
      "Ginjal Si Meta rusak akibat benturan lari",
      "Banyak cairan keluar sebagai keringat, sehingga ginjal menghemat air lewat reabsorpsi",
      "Si Meta memakan zat pewarna kuning di kantin",
      "Paru-paru berhenti membuang uap air"
    ],
    answer: 1,
    feedbackCorrect: "Tepat sekali, Detektif! Nefron ginjal mendeteksi tubuh kekurangan air akibat keringat, sehingga menyerap kembali air sebanyak-banyaknya!",
    feedbackWrong: "Kurang tepat. Coba ingat hubungan antara keringat di kulit dan jumlah air yang tersisa di dalam darah!"
  },
  {
    id: "case-2",
    title: "Misteri Dada yang Kembang-Kempis",
    clue: "Saat Si Meta sprint kencang, denyut nadinya menembus 140 BPM dan napasnya memburu.",
    question: "Mengapa kedua organ ini bekerja kompak dan serempak?",
    options: [
      "Otot membutuhkan pasokan Oksigen lebih cepat dan menghasilkan banyak CO2 yang harus segera dibuang",
      "Jantung memompa air ke paru-paru agar tidak kering",
      "Untuk menghentikan pengeluaran keringat",
      "Agar makanan di lambung cepat hancur"
    ],
    answer: 0,
    feedbackCorrect: "Analisis mantap! Sel otot membutuhkan banyak energi (ATP), membakar glukosa dengan O2 dan melepas CO2 yang harus dipompa cepat!",
    feedbackWrong: "Perhatikan kebutuhan sel otot saat bergerak intensif!"
  },
  {
    id: "case-3",
    title: "Misteri Saringan Dapur yang Tersumbat",
    clue: "Kadar racun urea di darah Si Meta melonjak dan badannya mulai terasa lemas.",
    question: "Bagian nefron mana yang harus kita periksa dan bersihkan?",
    options: [
      "Kelenjar keringat di kulit",
      "Saringan Glomerulus di dalam kapsula Bowman",
      "Alveolus di paru-paru",
      "Kantung empedu di hati"
    ],
    answer: 1,
    feedbackCorrect: "Hebat! Glomerulus adalah saringan pertama darah. Jika tersumbat, darah kotor tidak tersaring dan racun menumpuk!",
    feedbackWrong:      "Glomerulus adalah saringan utama darah di nefron ginjal!"
  },
  {
    id: "case-4",
    title: "Misteri Jajanan Warna-Warni",
    clue: "Si Meta borong mie instan, gorengan, dan permen warna-warni. Tak lama, tekanan darah naik dan hatinya terasa penuh-mual.",
    question: "Apa penyebab utama dan langkah pemulihan yang tepat?",
    options: [
      "Garam, lemak jahat, dan bahan tambahan pangan membebani jantung serta hati; pulihkan dengan menu segar dan bantu kerja hati",
      "Kekurangan air saja; cukup minum es sirup warna-warni",
      "Paru-paru kotor; cukup atur napas cepat-cepat",
      "Otot lelah; cukup lari sprint tambahan"
    ],
    answer: 0,
    feedbackCorrect: "Tepat! Garam menaikkan tekanan darah, lemak trans + aditif membebani hati. Makanan segar dan detoks hati memulihkan homeostasis!",
    feedbackWrong: "Ingat materi zat aditif dan lemak trans! Jajanan instan membebani hati dan menaikkan garam darah."
  },
  {
    id: "case-5",
    title: "Misteri Pabrik Penawar Racun",
    clue: "Setelah makan banyak protein, amonia beracun muncul di darah. Anehnya, yang bekerja lembur justru hati, bukan ginjal.",
    question: "Mengapa hati harus bekerja dulu sebelum ginjal membuang?",
    options: [
      "Hati menawar racun amonia menjadi zat sisa yang lebih aman, lalu darah mengantarnya ke ginjal untuk dibuang sebagai urine",
      "Hati memompa urine langsung ke kandung kemih",
      "Hati menyimpan amonia selamanya di kantung empedu",
      "Hati mengubah amonia menjadi oksigen untuk paru-paru"
    ],
    answer: 0,
    feedbackCorrect: "Brilian! Itulah poros hati-ginjal: amonia → urea (hati) → urine (ginjal). Tanpa hati, ginjal keracunan amonia!",
    feedbackWrong: "Ingat: amonia terlalu beracun untuk langsung dibuang ginjal. Hati menawarkannya dulu menjadi urea!"
  }
];

/**
 * METADATA 4 INDIKATOR KETERAMPILAN BERPIKIR SISTEMIK (SYSTEMS THINKING)
 * Sesuai instrumen penelitian skripsi untuk asesmen biologi SMP Kurikulum Merdeka
 */
export const SYSTEMS_THINKING_INDICATORS = [
  {
    key: "komponen",
    label: "Identifikasi Komponen & Organ",
    shortLabel: "1. Komponen & Organ",
    icon: "🫁",
    questionIds: [1, 2],
    description: "Kemampuan mengenali organ-organ ekskresi dan zat metabolik spesifik yang dikeluarkan."
  },
  {
    key: "keterhubungan",
    label: "Keterhubungan Dinamis Sebab-Akibat",
    shortLabel: "2. Keterhubungan Dinamis",
    icon: "🔄",
    questionIds: [3, 4, 5],
    description: "Memahami hubungan fungsional terpadu antara sistem gerak, sirkulasi, respirasi, dan ekskresi."
  },
  {
    key: "regulasi",
    label: "Regulasi Homeostasis & Umpan Balik",
    shortLabel: "3. Regulasi Homeostasis",
    icon: "⚖️",
    questionIds: [6, 7],
    description: "Menjelaskan mekanisme umpan balik tubuh dalam mempertahankan keseimbangan cairan & suhu."
  },
  {
    key: "prediksi",
    label: "Prediksi Gangguan Sistem Organ",
    shortLabel: "4. Prediksi Gangguan / Faal",
    icon: "🩺",
    questionIds: [8, 9, 10],
    description: "Menganalisis dampak kerusakan mikroskopis nefron dan patofisiologi sistem tubuh."
  }
];

/**
 * Menghitung skor persentase (0 - 100%) untuk masing-masing 4 indikator
 * @param {Object} answers - Map jawaban murid { [questionId]: selectedOptionIndex }
 * @param {Array} questions - Array soal PRETEST_QUESTIONS atau POSTTEST_QUESTIONS
 * @returns {Object} { komponen: number, keterhubungan: number, regulasi: number, prediksi: number }
 */
export function calculateIndicatorScores(answers = {}, questions = PRETEST_QUESTIONS) {
  const scores = {};
  SYSTEMS_THINKING_INDICATORS.forEach((ind) => {
    let correct = 0;
    const total = ind.questionIds.length;
    ind.questionIds.forEach((id) => {
      const q = questions.find((item) => item.id === id);
      if (q && answers[id] === q.answer) {
        correct += 1;
      }
    });
    scores[ind.key] = total > 0 ? Math.round((correct / total) * 100) : 0;
  });
  return scores;
}

/**
 * Menghitung N-Gain per indikator berpikir sistemik
 * @param {number} pre - Skor pre-test (0-100)
 * @param {number} post - Skor post-test (0-100)
 * @returns {Object} { gain: number, category: string }
 */
export function calculateIndicatorGain(pre = 0, post = 0) {
  if (100 - pre <= 0) return { gain: 1.0, category: "Tinggi" };
  const g = Number(((post - pre) / (100 - pre)).toFixed(2));
  let category = "Rendah";
  if (g >= 0.7) category = "Tinggi";
  else if (g >= 0.3) category = "Sedang";
  return { gain: Math.max(0, g), category };
}
