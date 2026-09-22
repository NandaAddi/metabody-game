import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GameButton, GamePlaque, GameModal } from "../components/game-ui";
import "./GameUIShowcase.css";

export default function GameUIShowcase() {
  const [activeModalType, setActiveModalType] = useState(null); // 'info' | 'reward' | 'danger' | null

  return (
    <div className="showcase-viewport">
      {/* Header Bar */}
      <header className="showcase-header">
        <div className="showcase-title-box">
          <h1>Glossy Chrome & Jelly UI Showcase</h1>
          <p className="showcase-subtitle">
            Katalog Desain Komponen Tombol, Dialog Box, dan Pop-up Game Kasual 2D MetaBody
          </p>
        </div>

        <Link to="/">
          <GameButton variant="blue" shape="rect" size="sm">
            🏠 Ke Launcher
          </GameButton>
        </Link>
      </header>

      {/* SECTION 1: Exact 1-to-1 Match dengan Gambar Referensi User */}
      <section className="showcase-section">
        <h2 className="showcase-section-title">
          <span>🎨</span> Galeri 1-ke-1 Sesuai Gambar Referensi
        </h2>
        <p className="showcase-section-desc">
          Reproduksi 3 baris palet warna (Gold Yellow, Lilac Purple, Pearl Pink) dengan 3 bentuk tombol (Square, Wide Rectangle, Circle).
        </p>

        <div className="showcase-ref-grid">
          {/* Row 1: Golden Yellow */}
          <div className="showcase-row">
            <span className="showcase-row-label">Baris 1 — Golden Yellow / Amber</span>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <GameButton variant="gold" shape="square" size="lg" icon="★" />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <GameButton variant="gold" shape="rect" size="lg" style={{ width: "100%", maxWidth: "420px" }}>
                MULAI PERMAINAN
              </GameButton>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <GameButton variant="gold" shape="circle" size="lg" icon="▶" />
            </div>
          </div>

          {/* Row 2: Lilac Purple */}
          <div className="showcase-row">
            <span className="showcase-row-label">Baris 2 — Lilac / Amethyst Purple</span>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <GameButton variant="purple" shape="square" size="lg" icon="🔬" />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <GameButton variant="purple" shape="rect" size="lg" style={{ width: "100%", maxWidth: "420px" }}>
                LABORATORIUM SAINS
              </GameButton>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <GameButton variant="purple" shape="circle" size="lg" icon="⚙️" />
            </div>
          </div>

          {/* Row 3: Pearl Pink / White Rose */}
          <div className="showcase-row">
            <span className="showcase-row-label">Baris 3 — Pearl / Iridescent Pink</span>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <GameButton variant="pink" shape="square" size="lg" icon="💖" />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <GameButton variant="pink" shape="rect" size="lg" style={{ width: "100%", maxWidth: "420px" }}>
                INFORMASI SISTEM
              </GameButton>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <GameButton variant="pink" shape="circle" size="lg" icon="💬" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Varian Semantik Gameplay MetaBody */}
      <section className="showcase-section">
        <h2 className="showcase-section-title">
          <span>🌿</span> Varian Tambahan Semantik Game MetaBody
        </h2>
        <p className="showcase-section-desc">
          Varian warna aksi game tambahan untuk status Homeostasis (Hijau), Hidrasi/Oksigen (Biru), dan Krisis (Merah).
        </p>

        <div className="showcase-ref-grid">
          {/* Row 4: Emerald Green */}
          <div className="showcase-row">
            <span className="showcase-row-label">Baris 4 — Emerald Green (Homeostasis Seimbang / Sukses)</span>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <GameButton variant="green" shape="square" size="md" icon="✓" />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <GameButton variant="green" shape="rect" size="md" style={{ width: "100%", maxWidth: "380px" }}>
                LANJUT KE MISI BERIKUTNYA
              </GameButton>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <GameButton variant="green" shape="circle" size="md" icon="💧" />
            </div>
          </div>

          {/* Row 5: Sky Blue */}
          <div className="showcase-row">
            <span className="showcase-row-label">Baris 5 — Sky Blue (Hidrasi / Navigasi / Oksigen)</span>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <GameButton variant="blue" shape="square" size="md" icon="📖" />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <GameButton variant="blue" shape="rect" size="md" style={{ width: "100%", maxWidth: "380px" }}>
                BUKA KAMUS BIOLOGI
              </GameButton>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <GameButton variant="blue" shape="circle" size="md" icon="ℹ️" />
            </div>
          </div>

          {/* Row 6: Crimson Red */}
          <div className="showcase-row">
            <span className="showcase-row-label">Baris 6 — Crimson Red (Krisis Tubuh / Tutup / Reset)</span>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <GameButton variant="red" shape="square" size="md" icon="⚠️" />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <GameButton variant="red" shape="rect" size="md" style={{ width: "100%", maxWidth: "380px" }}>
                DARURAT: PULIHKAN TUBUH
              </GameButton>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <GameButton variant="red" shape="circle" size="md" icon="✕" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Presets Ukuran & Plakat Header */}
      <section className="showcase-section">
        <h2 className="showcase-section-title">
          <span>📏</span> Presets Ukuran Tombol & Plakat Judul
        </h2>
        <p className="showcase-section-desc">
          Disesuaikan untuk keterbacaan dan ergonomi sentuhan jari pada layar IFP 65" maupun tablet.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <div style={{ color: "#94A3B8", fontSize: "0.85rem", marginBottom: "8px", fontWeight: "bold" }}>
              PLAKAT HEADER (GAME PLAQUE)
            </div>
            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center" }}>
              <GamePlaque variant="gold" icon="🏆" size="md">KEJUARAAN KELOMPOK</GamePlaque>
              <GamePlaque variant="purple" icon="🧠" size="md">TELAAT ILMIAH</GamePlaque>
              <GamePlaque variant="pink" icon="💬" size="sm">Si Meta</GamePlaque>
              <GamePlaque variant="green" icon="✨" size="sm">Homeostasis 100%</GamePlaque>
              <GamePlaque variant="red" icon="🚨" size="sm">Krisis Suhu Panas</GamePlaque>
            </div>
          </div>

          <div>
            <div style={{ color: "#94A3B8", fontSize: "0.85rem", marginBottom: "8px", fontWeight: "bold" }}>
              PRESET UKURAN TOMBOL (SMALL, MEDIUM, LARGE)
            </div>
            <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
              <GameButton variant="gold" shape="rect" size="sm">Kecil (sm)</GameButton>
              <GameButton variant="gold" shape="rect" size="md">Sedang (md)</GameButton>
              <GameButton variant="gold" shape="rect" size="lg">Besar (lg)</GameButton>
              <GameButton variant="purple" shape="square" size="sm">★</GameButton>
              <GameButton variant="purple" shape="square" size="md">★</GameButton>
              <GameButton variant="purple" shape="square" size="lg">★</GameButton>
              <GameButton variant="pink" shape="circle" size="sm">✕</GameButton>
              <GameButton variant="pink" shape="circle" size="md">✕</GameButton>
              <GameButton variant="pink" shape="circle" size="lg">✕</GameButton>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Live Pop-up Dialog Tester */}
      <section className="showcase-section">
        <h2 className="showcase-section-title">
          <span>🪟</span> Uji Coba Langsung Pop-up Dialog Modal
        </h2>
        <p className="showcase-section-desc">
          Klik tombol di bawah untuk membuka simulasi pop-up dengan bingkai chrome, plakat judul, dan tombol aksi:
        </p>

        <div className="showcase-playground">
          <GameButton
            variant="gold"
            shape="rect"
            size="md"
            onClick={() => setActiveModalType("reward")}
          >
            🏆 Buka Pop-up Hadiah (Gold)
          </GameButton>

          <GameButton
            variant="purple"
            shape="rect"
            size="md"
            onClick={() => setActiveModalType("info")}
          >
            📖 Buka Pop-up Informasi (Purple)
          </GameButton>

          <GameButton
            variant="red"
            shape="rect"
            size="md"
            onClick={() => setActiveModalType("danger")}
          >
            ⚠️ Buka Pop-up Peringatan (Red)
          </GameButton>
        </div>
      </section>

      {/* MODAL SIMULASI 1: Reward Modal */}
      {activeModalType === "reward" && (
        <GameModal
          isOpen={true}
          title="LENCANA PENGHARGAAN"
          headerVariant="gold"
          headerIcon="⭐"
          onClose={() => setActiveModalType(null)}
          footer={
            <div style={{ display: "flex", gap: "12px" }}>
              <GameButton
                variant="gold"
                shape="rect"
                size="md"
                onClick={() => setActiveModalType(null)}
                sound="confirm"
              >
                Klaim Hadiah 🎁
              </GameButton>
            </div>
          }
        >
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "8px" }}>🎖️</div>
            <h3 style={{ fontFamily: "var(--font-display)", color: "#FBBF24", fontSize: "1.4rem", marginBottom: "6px" }}>
              Medali Kolaborasi Tim Hebat!
            </h3>
            <p style={{ color: "#CBD5E1", fontSize: "0.95rem", lineHeight: "1.5" }}>
              Kelompokmu berhasil menyeimbangkan 4 organ ekskresi secara harmonis. Semua sistem bekerja stabil dalam rentang normal!
            </p>
          </div>
        </GameModal>
      )}

      {/* MODAL SIMULASI 2: Info Modal */}
      {activeModalType === "info" && (
        <GameModal
          isOpen={true}
          title="LABORATORIUM NEFRON"
          headerVariant="purple"
          headerIcon="🔬"
          onClose={() => setActiveModalType(null)}
          footer={
            <div style={{ display: "flex", gap: "12px" }}>
              <GameButton
                variant="purple"
                shape="rect"
                size="md"
                onClick={() => setActiveModalType(null)}
              >
                Paham & Kembali
              </GameButton>
            </div>
          }
        >
          <div style={{ padding: "6px 0", color: "#CBD5E1" }}>
            <h3 style={{ fontFamily: "var(--font-display)", color: "#C084FC", fontSize: "1.3rem", marginBottom: "8px" }}>
              Proses Filtrasi Glomerulus
            </h3>
            <p style={{ fontSize: "0.95rem", lineHeight: "1.5", marginBottom: "12px" }}>
              Glomerulus berfungsi menyaring darah dari sel darah merah dan protein besar, menghasilkan filtrat glomerulus (urine primer) yang kaya molekul glukosa dan asam amino.
            </p>
            <div style={{ background: "rgba(168, 85, 247, 0.15)", border: "1px solid rgba(168, 85, 247, 0.35)", borderRadius: "12px", padding: "10px 14px", fontSize: "0.88rem" }}>
              💡 <strong>Tips IFP:</strong> Sentuh membran podosit untuk mengamati aliran filtrat!
            </div>
          </div>
        </GameModal>
      )}

      {/* MODAL SIMULASI 3: Danger Modal */}
      {activeModalType === "danger" && (
        <GameModal
          isOpen={true}
          title="PERINGATAN DEHIDRASI"
          headerVariant="red"
          headerIcon="🚨"
          onClose={() => setActiveModalType(null)}
          footer={
            <div style={{ display: "flex", gap: "12px" }}>
              <GameButton
                variant="red"
                shape="rect"
                size="md"
                onClick={() => setActiveModalType(null)}
                sound="confirm"
              >
                Minum Air Segera 💧
              </GameButton>
              <GameButton
                variant="purple"
                shape="rect"
                size="md"
                onClick={() => setActiveModalType(null)}
              >
                Batal
              </GameButton>
            </div>
          }
        >
          <div style={{ textAlign: "center", padding: "6px 0", color: "#CBD5E1" }}>
            <div style={{ fontSize: "3rem", marginBottom: "6px" }}>⚠️</div>
            <h3 style={{ fontFamily: "var(--font-display)", color: "#F87171", fontSize: "1.35rem", marginBottom: "6px" }}>
              Kadar Air Tubuh Sangat Kritis!
            </h3>
            <p style={{ fontSize: "0.95rem", lineHeight: "1.5" }}>
              Laju keringat tinggi tanpa asupan cairan menyebabkan darah mengental dan ginjal bekerja ekstra keras memekatkan urine!
            </p>
          </div>
        </GameModal>
      )}
    </div>
  );
}
