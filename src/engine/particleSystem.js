/**
 * PARTICLE SYSTEM FOR METABODY CANVAS 2D
 * Render 60 FPS sirkulasi darah, penyerapan nutrisi, keringat, dan filtrasi nefron
 */

export class BiologicalParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.particles = [];
    this.maxParticles = 65; // Ringan untuk performa IFP 60 FPS
    this.isRunning = false;
    this.animationFrameId = null;

    // Parameter dinamis dari state game
    this.speedMultiplier = 1.0;
    this.sweatIntensity = 10;
  }

  start() {
    this.isRunning = true;
    this.initParticles();
    this.loop = this.loop.bind(this);
    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  updateParameters(telemetry) {
    // Kecepatan aliran partikel dipengaruhi denyut jantung (BPM)
    const bpm = telemetry.heartRate || 75;
    this.speedMultiplier = Math.max(0.6, Math.min(2.2, bpm / 75));
    this.sweatIntensity = telemetry.sweatRate || 10;
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle() {
    const types = ["arterial", "venous", "glucose", "sweat", "nephron"];
    const type = types[Math.floor(Math.random() * types.length)];
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Titik pusat organ tubuh di kanvas (proporsional 0..1 untuk avatar alami utuh)
    // Jantung/Paru ~ (0.48, 0.44), Hati/Lambung ~ (0.48, 0.54), Ginjal ~ (0.48, 0.58)
    let x = w * (0.48 + (Math.random() - 0.5) * 0.22);
    let y = h * (0.50 + (Math.random() - 0.5) * 0.24);
    let vx = (Math.random() - 0.5) * 1.5;
    let vy = (Math.random() - 0.5) * 1.5;
    let radius = Math.random() * 2.5 + 2;
    let color = "#FF4757"; // default merah darah

    if (type === "arterial") {
      color = "#FF2E44"; // Darah kaya O2 (merah segar)
      vy = -Math.abs(vy); // Mengalir ke atas/organ
    } else if (type === "venous") {
      color = "#8A1856"; // Darah kaya CO2 & Urea (merah gelap keunguan)
      vy = Math.abs(vy);  // Mengalir turun ke ginjal/hati
    } else if (type === "glucose") {
      color = "#FFA502"; // Glukosa (kuning keemasan)
      radius = 2.2;
    } else if (type === "sweat") {
      color = "#00D2D3"; // Keringat (cyan muda)
      x = w * (0.40 + Math.random() * 0.26);
      y = h * (0.32 + Math.random() * 0.35);
      vy = Math.abs(vy) * 0.8;
      vx = (Math.random() - 0.5) * 0.5;
    } else if (type === "nephron") {
      color = "#FED330"; // Partikel urine di nefron
      x = w * (0.48 + (Math.random() - 0.5) * 0.12);
      y = h * (0.58 + (Math.random() - 0.5) * 0.10);
      vy = 1.2;
    }

    return {
      x,
      y,
      vx,
      vy,
      radius,
      color,
      type,
      alpha: Math.random() * 0.6 + 0.4,
      life: Math.random() * 100
    };
  }

  loop() {
    if (!this.isRunning) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const w = this.canvas.width;
    const h = this.canvas.height;

    // Update & draw particles
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      p.x += p.vx * this.speedMultiplier;
      p.y += p.vy * this.speedMultiplier;
      p.life += 1;

      // Batas area dada/perut Si Meta
      const minX = w * 0.35;
      const maxX = w * 0.65;
      const minY = h * 0.30;
      const maxY = h * 0.72;

      if (p.x < minX || p.x > maxX || p.y < minY || p.y > maxY || p.life > 160) {
        // Recycle particle
        this.particles[i] = this.createParticle();
        continue;
      }

      // Draw particle dengan efek glow
      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = p.color;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    this.animationFrameId = requestAnimationFrame(this.loop);
  }
}
