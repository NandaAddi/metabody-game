# 🧬 METABODY — Game Simulasi Edukasi Fisiologi Tubuh Manusia

> **Game-Based Learning Fisiologi & Homeostasis Tubuh Manusia Berbasis Interactive Flat Panel (IFP) dan Web**  
> Selaras dengan Kurikulum Merdeka Fase D (IPA Biologi SMP Kelas VIII Bab 2: Struktur dan Fungsi Tubuh).

---

## 🎮 Fitur Utama

1. **Simulasi Arena Homeostasis Multi-Stasiun**:
   - Menyeimbangkan 3 parameter vital: Glukosa Darah, Suhu Tubuh ($37^\circ\text{C}$), dan Osmolalitas Darah.
   - 3 Stasiun Kendali Organ: Penyerapan Glukosa & Pabrik Hati, Termoregulasi & Pernapasan, serta Filtrasi Nefron Ginjal.
2. **Inspeksi 3D Anatomi Organ (Sketchfab HD Embed)**:
   - Jaringan Kulit, Ginjal & Nefron, Sistem Pencernaan Manusia, Alveolus Paru-Paru, dan Paru-Paru.
   - Panggung layar penuh *edge-to-edge* yang dioptimalkan untuk layar sentuh IFP 65"+ (Multi-Touch: Rotasi 360°, Pinch-to-Zoom, Pan).
3. **Laboratorium 3D Fisiologi**:
   - Simulasi 3D Sirkulasi Aliran Darah & Jantung dengan partikel $O_2/CO_2$.
   - Simulasi Mikroskopis 3D Filtrasi & Reabsorpsi Nefron Ginjal.
4. **Video Bridging & Edukasi Fisiologi**:
   - Video orientasi fenomena masalah dan ilustrasi fisiologis tiap organ.

---

## 🚀 Panduan Menjalankan Secara Lokal

```bash
# 1. Masuk ke direktori aplikasi
cd metabody-app

# 2. Install dependensi
npm install

# 3. Jalankan server pengembangan lokal
npm run dev
```

Buka peramban di `http://localhost:5173`

---

## ☁️ Panduan Deploy ke Cloudflare Pages

Aplikasi ini telah dikonfigurasi penuh dan siap dideploy secara instan ke **Cloudflare Pages**:

### 1. Pengaturan di Dashboard Cloudflare Pages:
* **Framework preset**: `Vite`
* **Build command**: `npm run build`
* **Build output directory**: `dist`
* **Root directory**: `/` (atau `metabody-app` jika repo mencakup root folder)
* **Node.js version**: `18` atau `20` (disarankan `20`)

### 2. File Routing SPA:
File `public/_redirects` telah disertakan (`/* /index.html 200`) untuk memastikan navigasi React Router berjalan mulus tanpa error 404 saat halaman dimuat ulang (*refresh*).

---

## 🛠️ Tech Stack
* **Framework**: React 19 + Vite 8
* **Routing**: React Router v7
* **State Management**: Zustand
* **3D Rendering**: Sketchfab WebGL Embed & Three.js
* **Styling**: Vanilla CSS (Modular Glassmorphic Game UI System)
