import React, { useState } from "react";
import { useGameStore } from "../stores/useGameStore";
import { GLOSSARY_TERMS } from "../data/glossaryData";
import { GameModal, GameButton, GamePlaque } from "./game-ui";

export default function KamusModal() {
  const isKamusOpen = useGameStore((state) => state.isKamusOpen);
  const closeKamus = useGameStore((state) => state.closeKamus);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrganFilter, setSelectedOrganFilter] = useState("Semua");

  if (!isKamusOpen) return null;

  const organOptions = ["Semua", "Ginjal", "Kulit", "Paru-Paru", "Hati", "Pencernaan"];

  const filteredTerms = GLOSSARY_TERMS.filter((t) => {
    const matchesSearch =
      t.friendlyTerm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.scientificTerm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.organ.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.definition.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesOrgan =
      selectedOrganFilter === "Semua" ||
      t.organ.toLowerCase().includes(selectedOrganFilter.toLowerCase());

    return matchesSearch && matchesOrgan;
  });

  const getOrganIcon = (organName = "") => {
    const o = organName.toLowerCase();
    if (o.includes("ginjal")) return "🔬";
    if (o.includes("paru")) return "🫁";
    if (o.includes("kulit")) return "💦";
    if (o.includes("hati")) return "🧪";
    if (o.includes("cerna") || o.includes("nutrisi")) return "🍱";
    return "🧬";
  };

  const footerActions = (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", gap: "16px", flexWrap: "wrap" }}>
      <div style={{ fontSize: "0.85rem", color: "var(--text-on-dark-dim)" }}>
        Menemukan <strong style={{ color: "var(--color-info-text)" }}>{filteredTerms.length}</strong> istilah biologi sistem ekskresi.
      </div>

      <GameButton
        variant="blue"
        shape="rect"
        size="md"
        onClick={closeKamus}
        sound="cancel"
      >
        ✕ Tutup Kamus
      </GameButton>
    </div>
  );

  return (
    <GameModal
      isOpen={true}
      title="KAMUS DUAL-LABELING IPA"
      headerVariant="blue"
      headerIcon="📖"
      size="lg"
      onClose={closeKamus}
      footer={footerActions}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {/* Subheader Penjelasan Dual-Labeling */}
        <p style={{ color: "var(--text-on-dark-dim)", fontSize: "0.85rem", margin: 0, lineHeight: "1.4" }}>
          Prinsip <em>Dual-Labeling</em> memadukan istilah ramah anak dengan nomenklatur ilmiah resmi Kurikulum Merdeka Fase D Kelas VIII.
        </p>

        {/* Input Pencarian Istilah Frosted Glass */}
        <div style={{ position: "relative", width: "100%" }}>
          <span style={{
            position: "absolute",
            left: "14px",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "1.05rem",
            color: "var(--color-info-text)",
            pointerEvents: "none"
          }}>
            🔍
          </span>

          <input
            type="text"
            placeholder="Cari istilah, konsep, atau organ (misal: nefron, keringat, filtrasi)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "11px 40px 11px 42px",
              borderRadius: "14px",
              border: "none",
              outline: "none",
              background: "rgba(15, 23, 42, 0.75)",
              color: "var(--text-light)",
              fontFamily: "var(--font-body)",
              fontSize: "0.95rem",
              boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.5), 0 0 16px rgba(56, 189, 248, 0.15)"
            }}
          />

          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              aria-label="Hapus pencarian"
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255, 255, 255, 0.15)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                borderRadius: "50%",
                width: "44px",
                height: "44px",
                minWidth: "44px",
                color: "var(--text-on-dark)",
                fontSize: "0.9rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              title="Hapus pencarian"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Tab Organ */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-on-dark-dim)", marginRight: "2px" }}>Filter:</span>
          {organOptions.map((org) => {
            const isSelected = selectedOrganFilter === org;
            return (
              <button
                key={org}
                type="button"
                onClick={() => setSelectedOrganFilter(org)}
                className={`game-chip${isSelected ? " game-chip--active" : ""}`}
              >
                {org !== "Semua" && getOrganIcon(org)} {org}
              </button>
            );
          })}
        </div>

        {/* Daftar Istilah (Scrollable Container) */}
        <div style={{
          maxHeight: "52vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          paddingRight: "6px"
        }}>
          {filteredTerms.length === 0 ? (
            <div style={{
              textAlign: "center",
              color: "var(--text-on-dark-dim)",
              padding: "40px 20px",
              background: "rgba(15, 23, 42, 0.4)",
              borderRadius: "16px",
              border: "none"
            }}>
              <span style={{ fontSize: "2rem", display: "block", marginBottom: "8px" }}>🔍</span>
              <p style={{ margin: 0 }}>Tidak ada istilah yang cocok dengan kata kunci <em>"{searchTerm}"</em>.</p>
            </div>
          ) : (
            filteredTerms.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "rgba(15, 23, 42, 0.75)",
                  borderRadius: "16px",
                  padding: "16px",
                  border: "none",
                  outline: "none",
                  boxShadow: "inset 4px 0 0 var(--color-info-text), 0 8px 24px rgba(0, 0, 0, 0.35), 0 0 16px rgba(56, 189, 248, 0.1)"
                }}
              >
                {/* Header Kartu Istilah */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
                  <div>
                    <h4 style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.15rem",
                      color: "var(--text-light)",
                      margin: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}>
                      <span>{item.friendlyTerm}</span>
                      <span style={{ fontSize: "0.95rem", color: "var(--color-info-text)", fontStyle: "italic", fontWeight: "normal" }}>
                        ({item.scientificTerm})
                      </span>
                    </h4>
                  </div>

                  <span style={{
                    background: "rgba(56, 189, 248, 0.2)",
                    border: "none",
                    borderRadius: "999px",
                    padding: "4px 12px",
                    fontSize: "0.76rem",
                    fontWeight: 700,
                    color: "var(--color-info-text)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px"
                  }}>
                    {getOrganIcon(item.organ)} {item.organ}
                  </span>
                </div>

                {/* Definisi Ilmiah */}
                <p style={{ margin: "0 0 10px", fontSize: "0.9rem", lineHeight: "1.5", color: "var(--text-on-dark)" }}>
                  {item.definition}
                </p>

                {/* Analogi Sehari-hari */}
                {item.analogy && (
                  <div style={{
                    background: "rgba(251, 191, 36, 0.12)",
                    border: "none",
                    outline: "none",
                    boxShadow: "inset 3px 0 0 var(--color-warn-text)",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    fontSize: "0.83rem",
                    color: "var(--color-warn-text)",
                    lineHeight: "1.4"
                  }}>
                    💡 <strong style={{ color: "var(--color-warn-text)" }}>Analogi Kehidupan:</strong> {item.analogy}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </GameModal>
  );
}
