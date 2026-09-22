import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LauncherView from "./views/LauncherView";
import BridgingVideoView from "./views/BridgingVideoView";
import ArenaView from "./views/ArenaView";
import StudentView from "./views/StudentView";
import TeacherView from "./views/TeacherView";
import PhysiologyLabView from "./views/PhysiologyLabView";
import GameUIShowcase from "./views/GameUIShowcase";
import GameAspectShell from "./components/GameAspectShell";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Portal Peluncur Pemilihan Peran (Rasio 16:9 Terkunci) */}
        <Route path="/" element={<GameAspectShell><LauncherView /></GameAspectShell>} />

        {/* Video Bridging / Orientasi Fenomena Masalah (Rasio 16:9 Terkunci) */}
        <Route path="/bridging" element={<GameAspectShell><BridgingVideoView /></GameAspectShell>} />

        {/* Master Game Arena untuk Layar Sentuh IFP (65"+) (Rasio 16:9 Terkunci) */}
        <Route path="/arena" element={<GameAspectShell><ArenaView /></GameAspectShell>} />

        {/* Laboratorium Fisiologi 3D Interaktif (Sirkulasi Darah & Nefron) */}
        <Route path="/laboratorium-3d" element={<PhysiologyLabView />} />
        <Route path="/simulasi-3d" element={<PhysiologyLabView />} />

        {/* Terminal Kelompok Siswa (Tablet/Laptop Siswa) */}
        <Route path="/kelompok" element={<StudentView />} />

        {/* Dasbor Kendali Guru & Peneliti */}
        <Route path="/guru" element={<TeacherView />} />

        {/* Galeri Showcase Glossy Game UI Kit */}
        <Route path="/ui-kit" element={<GameUIShowcase />} />
      </Routes>
    </BrowserRouter>
  );
}
