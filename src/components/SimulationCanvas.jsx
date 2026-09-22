import React, { useEffect, useRef } from "react";
import { BiologicalParticleSystem } from "../engine/particleSystem";
import { useGameStore } from "../stores/useGameStore";

export default function SimulationCanvas() {
  const canvasRef = useRef(null);
  const particleSystemRef = useRef(null);
  const telemetry = useGameStore((state) => state.telemetry);
  const gameStatus = useGameStore((state) => state.gameStatus);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set ukuran kanvas proporsional
    canvas.width = canvas.offsetWidth || 800;
    canvas.height = canvas.offsetHeight || 900;

    const ps = new BiologicalParticleSystem(canvas);
    particleSystemRef.current = ps;
    ps.start();

    const handleResize = () => {
      if (canvas && ps) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        ps.initParticles();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      ps.stop();
    };
  }, []);

  // Update laju partikel setiap telemetri berubah
  useEffect(() => {
    if (particleSystemRef.current) {
      particleSystemRef.current.updateParameters(telemetry);
    }
  }, [telemetry]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 5
      }}
    />
  );
}
