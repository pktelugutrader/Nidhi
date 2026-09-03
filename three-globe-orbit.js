/**
 * Alakaapuri Nidhi - 3D Wealth Universe Engine
 * Dual-rotation planetary system with cinematic camera orbit & 7 Wealth Components
 * Powered by Three.js
 */

// Universal Canvas polyfills for roundRect & ellipse to guarantee 100% browser compatibility
if (typeof CanvasRenderingContext2D !== 'undefined') {
  if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, radii) {
      if (!radii) radii = 0;
      let r = typeof radii === 'number' ? radii : (Array.isArray(radii) ? radii[0] : 0);
      if (w < 2 * r) r = w / 2;
      if (h < 2 * r) r = h / 2;
      this.moveTo(x + r, y);
      this.arcTo(x + w, y, x + w, y + h, r);
      this.arcTo(x + w, y + h, x, y + h, r);
      this.arcTo(x, y + h, x, y, r);
      this.arcTo(x, y, x + w, y, r);
      this.closePath();
      return this;
    };
  }
  if (!CanvasRenderingContext2D.prototype.ellipse) {
    CanvasRenderingContext2D.prototype.ellipse = function(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise) {
      this.save();
      this.translate(x, y);
      this.rotate(rotation || 0);
      this.scale(radiusX, radiusY);
      this.arc(0, 0, 1, startAngle || 0, endAngle !== undefined ? endAngle : 2 * Math.PI, anticlockwise || false);
      this.restore();
    };
  }
}

function start3DUniverse() {
  const container = document.getElementById('globe3dContainer');
  if (!container) return;

  if (!window.THREE) {
    // Retry if Three.js is still completing parse
    setTimeout(start3DUniverse, 30);
    return;
  }

  // Clear any existing canvas
  container.innerHTML = '';

  // --- 7 WEALTH SERVICES DATA ---
  const services = [
    {
      id: 'mutual-funds',
      title: 'Mutual Funds',
      badge: 'SIP & Wealth Compounding',
      color: '#d97706',
      glowColor: 0xffa500,
      pedestalHex: 0xd97706,
      url: 'services/mutual-funds/',
      desc: 'AMFI ARN-362567 verified goal-based SIPs, high-growth equity funds, and ELSS tax-saving strategies.',
      iconType: 'mutual-funds'
    },
    {
      id: 'equity',
      title: 'Equity & PMS',
      badge: 'High-Alpha Portfolios',
      color: '#7c3aed',
      glowColor: 0xa855f7,
      pedestalHex: 0x7c3aed,
      url: 'services/equity/',
      desc: 'Disciplined fundamental stock research, concentrated PMS, and SIF portfolios designed for long-term outperformance.',
      iconType: 'equity'
    },
    {
      id: 'derivatives',
      title: 'Derivatives',
      badge: 'Institutional Hedging',
      color: '#0891b2',
      glowColor: 0x06b6d4,
      pedestalHex: 0x0891b2,
      url: 'services/derivatives/',
      desc: 'Rule-based F&O hedging, risk-neutral strategies, and proprietary Cumulative Volume Delta (CVD) order-flow tools.',
      iconType: 'derivatives'
    },
    {
      id: 'health-insurance',
      title: 'Health Insurance',
      badge: 'Medical Safeguard',
      color: '#2563eb',
      glowColor: 0x3b82f6,
      pedestalHex: 0x2563eb,
      url: 'services/insurance/',
      desc: 'Comprehensive cashless family floaters, critical illness riders, and 100% dedicated on-ground claim assistance guarantee.',
      iconType: 'health-insurance'
    },
    {
      id: 'term-insurance',
      title: 'Term Insurance',
      badge: 'Family Protection',
      color: '#16a34a',
      glowColor: 0x22c55e,
      pedestalHex: 0x16a34a,
      url: 'services/insurance/',
      desc: 'High-sum-assured pure risk life cover (15x–20x income replacement rule) ensuring zero financial vulnerability.',
      iconType: 'term-insurance'
    },
    {
      id: 'commodities',
      title: 'Commodities',
      badge: 'Tangible Asset Wealth',
      color: '#d97706',
      glowColor: 0xf59e0b,
      pedestalHex: 0xb45309,
      url: 'services/derivatives/',
      desc: 'MCX Gold, Silver, Crude Oil, and Natural Gas hedging advisory to diversify and protect against macroeconomic inflation.',
      iconType: 'commodities'
    },
    {
      id: 'crypto',
      title: 'Crypto Assets',
      badge: 'Digital Frontier',
      color: '#ec4899',
      glowColor: 0xf43f5e,
      pedestalHex: 0xdb2777,
      url: 'services/derivatives/',
      desc: 'Institutional analysis of digital asset liquidity, market cycle timing, and strict algorithmic risk-mitigation strategies.',
      iconType: 'crypto'
    }
  ];

  // --- SCENE & RENDERER SETUP ---
  const scene = new THREE.Scene();

  let width = container.clientWidth || 1000;
  let height = container.clientHeight || 580;

  const camera = new THREE.PerspectiveCamera(45, width / height, 1, 4000);
  camera.position.set(0, 110, 680);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // --- LIGHTING ---
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.25);
  scene.add(ambientLight);

  const keySunLight = new THREE.DirectionalLight(0xfff5e6, 2.0);
  keySunLight.position.set(450, 320, 500);
  scene.add(keySunLight);

  const fillBlueLight = new THREE.DirectionalLight(0x38bdf8, 1.0);
  fillBlueLight.position.set(-450, -180, -350);
  scene.add(fillBlueLight);

  const topRimLight = new THREE.DirectionalLight(0xffe4b5, 0.8);
  topRimLight.position.set(0, 500, 0);
  scene.add(topRimLight);

  // --- 3D EARTH GLOBE ---
  // Earth axis tilt = 23.4 degrees
  const earthTiltGroup = new THREE.Group();
  earthTiltGroup.rotation.z = 0.41;
  scene.add(earthTiltGroup);

  const globeRadius = 145;
  const globeGeometry = new THREE.SphereGeometry(globeRadius, 64, 64);
  const textureLoader = new THREE.TextureLoader();

  // Load Earth texture
  const earthTexture = textureLoader.load('earth_texture.jpg', () => {
    renderer.render(scene, camera);
  });
  earthTexture.anisotropy = 8;

  const globeMaterial = new THREE.MeshStandardMaterial({
    map: earthTexture,
    roughness: 0.60,
    metalness: 0.20
  });

  const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
  earthTiltGroup.add(globeMesh);

  // Atmospheric Glow Shell
  const atmosGeometry = new THREE.SphereGeometry(globeRadius * 1.035, 48, 48);
  const atmosMaterial = new THREE.MeshBasicMaterial({
    color: 0x60a5fa,
    transparent: true,
    opacity: 0.18,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending
  });
  const atmosMesh = new THREE.Mesh(atmosGeometry, atmosMaterial);
  earthTiltGroup.add(atmosMesh);

  // --- INCLINED ORBITAL RING (MATCHING USER HAND-DRAWN SKETCH) ---
  const orbitRadius = 310;
  const orbitGroup = new THREE.Group();
  orbitGroup.rotation.x = Math.PI * 0.14; // ~25 deg inclined planetary plane
  orbitGroup.rotation.y = -Math.PI * 0.05;
  scene.add(orbitGroup);

  // 1. Solid Luminous Neon Core Ring
  const ringGeom = new THREE.TorusGeometry(orbitRadius, 2.8, 16, 180);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });
  const ringMesh = new THREE.Mesh(ringGeom, ringMat);
  ringMesh.rotation.x = Math.PI / 2;
  orbitGroup.add(ringMesh);

  // 2. Soft Outer Atmospheric Energy Halo Ring
  const outerRingGeom = new THREE.TorusGeometry(orbitRadius, 8.0, 16, 180);
  const outerRingMat = new THREE.MeshBasicMaterial({
    color: 0x0284c7,
    transparent: true,
    opacity: 0.28,
    blending: THREE.AdditiveBlending
  });
  const outerRingMesh = new THREE.Mesh(outerRingGeom, outerRingMat);
  outerRingMesh.rotation.x = Math.PI / 2;
  orbitGroup.add(outerRingMesh);

  // 3. Circulating Orbit Energy Particles
  const particleCount = 240;
  const particleGeom = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleAngles = new Float32Array(particleCount);
  const particleSpeeds = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2;
    particleAngles[i] = angle;
    particleSpeeds[i] = 0.002 + Math.random() * 0.003;
    const r = orbitRadius + (Math.random() - 0.5) * 12;
    particlePositions[i * 3] = Math.cos(angle) * r;
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 6;
    particlePositions[i * 3 + 2] = Math.sin(angle) * r;
  }
  particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0x7dd3fc,
    size: 3.5,
    transparent: true,
    opacity: 0.80,
    blending: THREE.AdditiveBlending
  });
  const particleSystem = new THREE.Points(particleGeom, particleMat);
  orbitGroup.add(particleSystem);

  // --- HIGH-DPI VOLUMETRIC EMBLEM CANVASES ---
  function generateEmblemTexture(service) {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, size, size);

    // Subtle radial backlight
    const bgGlow = ctx.createRadialGradient(256, 256, 40, 256, 256, 230);
    bgGlow.addColorStop(0, `${service.color}44`);
    bgGlow.addColorStop(0.7, `${service.color}11`);
    bgGlow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = bgGlow;
    ctx.beginPath();
    ctx.arc(256, 256, 230, 0, Math.PI * 2);
    ctx.fill();

    switch (service.iconType) {
      case 'mutual-funds':
        drawMutualFundsEmblem(ctx, service);
        break;
      case 'equity':
        drawEquityEmblem(ctx, service);
        break;
      case 'derivatives':
        drawDerivativesEmblem(ctx, service);
        break;
      case 'health-insurance':
        drawHealthInsuranceEmblem(ctx, service);
        break;
      case 'term-insurance':
        drawTermInsuranceEmblem(ctx, service);
        break;
      case 'commodities':
        drawCommoditiesEmblem(ctx, service);
        break;
      case 'crypto':
        drawCryptoEmblem(ctx, service);
        break;
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    return tex;
  }

  // 1. Mutual Funds: 3D Bars, Green Arrow & Golden Rupee Coin
  function drawMutualFundsEmblem(ctx, serv) {
    const bars = [
      { x: 130, h: 90 },
      { x: 185, h: 145 },
      { x: 240, h: 205 },
      { x: 295, h: 275 }
    ];

    bars.forEach((b) => {
      const topY = 380 - b.h;
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(b.x + 4, topY + 4, 40, b.h);

      const barGrad = ctx.createLinearGradient(b.x, topY, b.x + 40, 380);
      barGrad.addColorStop(0, '#fde68a');
      barGrad.addColorStop(0.3, '#d97706');
      barGrad.addColorStop(1, '#78350f');
      ctx.fillStyle = barGrad;
      ctx.fillRect(b.x, topY, 40, b.h);

      ctx.fillStyle = '#fef3c7';
      ctx.beginPath();
      ctx.moveTo(b.x, topY);
      ctx.lineTo(b.x + 12, topY - 10);
      ctx.lineTo(b.x + 52, topY - 10);
      ctx.lineTo(b.x + 40, topY);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.moveTo(b.x + 40, topY);
      ctx.lineTo(b.x + 52, topY - 10);
      ctx.lineTo(b.x + 52, 380 - 10);
      ctx.lineTo(b.x + 40, 380);
      ctx.closePath();
      ctx.fill();
    });

    // Ascending Glowing Green Arrow
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 14;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.shadowColor = '#4ade80';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.moveTo(110, 330);
    ctx.lineTo(195, 240);
    ctx.lineTo(260, 200);
    ctx.lineTo(345, 95);
    ctx.stroke();

    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.moveTo(350, 75);
    ctx.lineTo(365, 125);
    ctx.lineTo(320, 110);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    // Heavy 3D Golden ₹ Rupee Coin
    const cx = 350;
    const cy = 340;
    const r = 58;

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.arc(cx + 6, cy + 6, r, 0, Math.PI * 2);
    ctx.fill();

    const coinGrad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    coinGrad.addColorStop(0, '#fffbeb');
    coinGrad.addColorStop(0.25, '#fbbf24');
    coinGrad.addColorStop(0.7, '#d97706');
    coinGrad.addColorStop(1, '#78350f');
    ctx.fillStyle = coinGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    const innerGrad = ctx.createRadialGradient(cx - 15, cy - 15, 10, cx, cy, r - 8);
    innerGrad.addColorStop(0, '#fef3c7');
    innerGrad.addColorStop(0.6, '#f59e0b');
    innerGrad.addColorStop(1, '#92400e');
    ctx.fillStyle = innerGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 58px "Cinzel", "Playfair Display", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 6;
    ctx.fillText('₹', cx, cy + 3);
    ctx.shadowBlur = 0;
  }

  // 2. Equity: Golden Bull & Green Candlestick Bars
  function drawEquityEmblem(ctx, serv) {
    const sticks = [
      { x: 330, y: 160, h: 140, w: 28 },
      { x: 375, y: 110, h: 190, w: 28 }
    ];
    sticks.forEach((s) => {
      ctx.strokeStyle = '#86efac';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(s.x + s.w / 2, s.y - 20);
      ctx.lineTo(s.x + s.w / 2, s.y + s.h + 20);
      ctx.stroke();

      const cGrad = ctx.createLinearGradient(s.x, s.y, s.x + s.w, s.y);
      cGrad.addColorStop(0, '#4ade80');
      cGrad.addColorStop(0.5, '#22c55e');
      cGrad.addColorStop(1, '#15803d');
      ctx.fillStyle = cGrad;
      ctx.fillRect(s.x, s.y, s.w, s.h);
    });

    // Sculpted Metallic Golden Bull
    ctx.save();
    ctx.translate(70, 160);

    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.beginPath();
    ctx.ellipse(135, 175, 110, 25, 0, 0, Math.PI * 2);
    ctx.fill();

    const bullGrad = ctx.createLinearGradient(30, 20, 220, 160);
    bullGrad.addColorStop(0, '#fffbeb');
    bullGrad.addColorStop(0.2, '#fde68a');
    bullGrad.addColorStop(0.5, '#d97706');
    bullGrad.addColorStop(0.8, '#92400e');
    bullGrad.addColorStop(1, '#451a03');

    ctx.fillStyle = bullGrad;
    ctx.beginPath();
    ctx.moveTo(70, 85);
    ctx.quadraticCurveTo(55, 60, 45, 45);
    ctx.quadraticCurveTo(60, 50, 75, 75);
    ctx.lineTo(85, 70);
    ctx.quadraticCurveTo(95, 40, 105, 30);
    ctx.quadraticCurveTo(95, 55, 90, 75);
    ctx.lineTo(105, 80);
    ctx.quadraticCurveTo(125, 55, 150, 60);
    ctx.lineTo(195, 75);
    ctx.quadraticCurveTo(215, 85, 225, 100);
    ctx.quadraticCurveTo(240, 115, 235, 145);
    ctx.lineTo(215, 165);
    ctx.lineTo(200, 165);
    ctx.lineTo(195, 125);
    ctx.lineTo(165, 130);
    ctx.lineTo(155, 170);
    ctx.lineTo(140, 170);
    ctx.lineTo(145, 115);
    ctx.lineTo(105, 115);
    ctx.lineTo(95, 165);
    ctx.lineTo(80, 165);
    ctx.lineTo(85, 105);
    ctx.quadraticCurveTo(60, 105, 70, 85);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();

    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.shadowColor = '#4ade80';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.moveTo(270, 240);
    ctx.lineTo(315, 170);
    ctx.lineTo(375, 85);
    ctx.stroke();

    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.moveTo(380, 65);
    ctx.lineTo(395, 110);
    ctx.lineTo(350, 95);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // 3. Derivatives: Trading Contract, CALL / PUT Buttons & Price Wave
  function drawDerivativesEmblem(ctx, serv) {
    const x = 120;
    const y = 80;
    const w = 270;
    const h = 330;

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(x + 10, y + 12, w, h);

    const sheetGrad = ctx.createLinearGradient(x, y, x + w, y + h);
    sheetGrad.addColorStop(0, '#ffffff');
    sheetGrad.addColorStop(0.5, '#f1f5f9');
    sheetGrad.addColorStop(1, '#cbd5e1');
    ctx.fillStyle = sheetGrad;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 18);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#94a3b8';
    ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.fillRect(x + 28, y + 36, 120, 10);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(x + 28, y + 54, 180, 7);
    ctx.fillRect(x + 28, y + 68, 140, 7);

    // CALL Button
    const callX = x + 28;
    const callY = y + 95;
    const callW = 95;
    const callH = 46;

    const callGrad = ctx.createLinearGradient(callX, callY, callX, callY + callH);
    callGrad.addColorStop(0, '#4ade80');
    callGrad.addColorStop(1, '#15803d');
    ctx.fillStyle = callGrad;
    ctx.shadowColor = 'rgba(34, 197, 94, 0.4)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.roundRect(callX, callY, callW, callH, 10);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 21px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('CALL', callX + callW / 2, callY + callH / 2 + 1);

    // PUT Button
    const putX = x + 140;
    const putY = y + 95;
    const putW = 95;
    const putH = 46;

    const putGrad = ctx.createLinearGradient(putX, putY, putX, putY + putH);
    putGrad.addColorStop(0, '#f87171');
    putGrad.addColorStop(1, '#b91c1c');
    ctx.fillStyle = putGrad;
    ctx.shadowColor = 'rgba(239, 68, 68, 0.4)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.roundRect(putX, putY, putW, putH, 10);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ffffff';
    ctx.fillText('PUT', putX + putW / 2, putY + putH / 2 + 1);

    // Price Wave Chart
    ctx.strokeStyle = '#0891b2';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(x + 25, y + 260);
    ctx.bezierCurveTo(x + 80, y + 210, x + 110, y + 290, x + 160, y + 230);
    ctx.bezierCurveTo(x + 190, y + 180, x + 220, y + 220, x + 245, y + 175);
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.lineTo(x + 245, y + 295);
    ctx.lineTo(x + 25, y + 295);
    ctx.closePath();
    ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
    ctx.fill();
  }

  // 4. Health Insurance: Medical Shield, White Cross & Chrome Stethoscope
  function drawHealthInsuranceEmblem(ctx, serv) {
    const cx = 256;
    const cy = 230;

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.moveTo(cx, cy - 130 + 10);
    ctx.lineTo(cx + 125, cy - 80 + 10);
    ctx.quadraticCurveTo(cx + 135, cy + 60, cx, cy + 140 + 10);
    ctx.quadraticCurveTo(cx - 135, cy + 60, cx - 125, cy - 80 + 10);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(cx, cy - 130);
    ctx.lineTo(cx + 125, cy - 80);
    ctx.quadraticCurveTo(cx + 135, cy + 60, cx, cy + 140);
    ctx.quadraticCurveTo(cx - 135, cy + 60, cx - 125, cy - 80);
    ctx.closePath();
    ctx.fill();

    const shieldGrad = ctx.createRadialGradient(cx - 30, cy - 30, 20, cx, cy, 120);
    shieldGrad.addColorStop(0, '#60a5fa');
    shieldGrad.addColorStop(0.5, '#2563eb');
    shieldGrad.addColorStop(1, '#1e3a8a');
    ctx.fillStyle = shieldGrad;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 118);
    ctx.lineTo(cx + 112, cy - 72);
    ctx.quadraticCurveTo(cx + 122, cy + 50, cx, cy + 126);
    ctx.quadraticCurveTo(cx - 122, cy + 50, cx - 112, cy - 72);
    ctx.closePath();
    ctx.fill();

    // White Cross
    const crossW = 32;
    const crossL = 96;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.roundRect(cx - crossW / 2, cy - crossL / 2, crossW, crossL, 6);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(cx - crossL / 2, cy - crossW / 2, crossL, crossW, 6);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Stethoscope
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(cx, cy + 40, 140, Math.PI * 0.1, Math.PI * 0.9, false);
    ctx.stroke();

    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(cx + 115, cy + 135, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#475569';
    ctx.stroke();

    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.arc(cx + 115, cy + 135, 14, 0, Math.PI * 2);
    ctx.fill();
  }

  // 5. Term Insurance: Checklist Clipboard & Family Shield
  function drawTermInsuranceEmblem(ctx, serv) {
    const x = 110;
    const y = 80;
    const w = 240;
    const h = 320;

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(x + 10, y + 10, w, h);

    const boardGrad = ctx.createLinearGradient(x, y, x + w, y + h);
    boardGrad.addColorStop(0, '#f1f5f9');
    boardGrad.addColorStop(1, '#94a3b8');
    ctx.fillStyle = boardGrad;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 16);
    ctx.fill();

    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.roundRect(x + w / 2 - 40, y - 12, 80, 28, 8);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(x + w / 2, y + 2, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(x + 16, y + 30, w - 32, h - 50, 8);
    ctx.fill();

    ctx.fillStyle = '#1e293b';
    ctx.font = '900 17px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TERM INSURANCE', x + w / 2, y + 60);

    const itemsY = [y + 95, y + 140, y + 185];
    itemsY.forEach((iy) => {
      ctx.strokeStyle = '#16a34a';
      ctx.lineWidth = 3;
      ctx.strokeRect(x + 36, iy, 24, 24);

      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x + 39, iy + 12);
      ctx.lineTo(x + 46, iy + 19);
      ctx.lineTo(x + 56, iy + 6);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(x + 72, iy + 7, 105, 10);
    });

    // Family Protection Shield
    const sx = 320;
    const sy = 285;
    const sw = 65;

    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.arc(sx + 5, sy + 5, sw, 0, Math.PI * 2);
    ctx.fill();

    const shieldGrad = ctx.createLinearGradient(sx - sw, sy - sw, sx + sw, sy + sw);
    shieldGrad.addColorStop(0, '#4ade80');
    shieldGrad.addColorStop(0.5, '#16a34a');
    shieldGrad.addColorStop(1, '#064e3b');
    ctx.fillStyle = shieldGrad;
    ctx.beginPath();
    ctx.arc(sx, sy, sw, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(sx - 16, sy - 18, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(sx - 26, sy - 5, 20, 32, 6);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(sx + 16, sy - 18, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(sx + 6, sy - 5, 20, 32, 6);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(sx, sy, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(sx - 7, sy + 9, 14, 18, 4);
    ctx.fill();
  }

  // 6. Commodities: Stack of Gold Bullion Bars & Flame
  function drawCommoditiesEmblem(ctx, serv) {
    const cx = 256;
    const cy = 250;

    function drawGoldBar(bx, by, bw, bh) {
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.beginPath();
      ctx.roundRect(bx + 4, by + 4, bw, bh, 6);
      ctx.fill();

      const topGrad = ctx.createLinearGradient(bx, by, bx + bw, by + bh);
      topGrad.addColorStop(0, '#fef08a');
      topGrad.addColorStop(0.4, '#eab308');
      topGrad.addColorStop(0.8, '#ca8a04');
      topGrad.addColorStop(1, '#713f12');
      ctx.fillStyle = topGrad;
      ctx.beginPath();
      ctx.roundRect(bx, by, bw, bh, 6);
      ctx.fill();

      ctx.strokeStyle = '#fffbeb';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#713f12';
      ctx.font = '900 13px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('999.9  FINE GOLD', bx + bw / 2, by + bh / 2 + 4);
    }

    drawGoldBar(110, 270, 140, 55);
    drawGoldBar(260, 270, 140, 55);
    drawGoldBar(185, 205, 140, 55);

    ctx.save();
    ctx.translate(cx, 120);

    const flameGrad = ctx.createRadialGradient(0, 30, 5, 0, 10, 55);
    flameGrad.addColorStop(0, '#fef08a');
    flameGrad.addColorStop(0.4, '#f97316');
    flameGrad.addColorStop(1, '#dc2626');
    ctx.fillStyle = flameGrad;
    ctx.shadowColor = '#fb923c';
    ctx.shadowBlur = 20;

    ctx.beginPath();
    ctx.moveTo(0, -40);
    ctx.bezierCurveTo(35, -10, 45, 25, 25, 45);
    ctx.bezierCurveTo(15, 55, -15, 55, -25, 45);
    ctx.bezierCurveTo(-45, 25, -35, -10, 0, -40);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  // 7. Crypto: 3D Blockchain Hexagon, Bitcoin & Ethereum
  function drawCryptoEmblem(ctx, serv) {
    const cx = 256;
    const cy = 240;
    const r = 120;

    ctx.save();
    ctx.translate(cx, cy);

    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    drawHexPath(ctx, 6, 6, r);
    ctx.fill();

    const hexGrad = ctx.createLinearGradient(-r, -r, r, r);
    hexGrad.addColorStop(0, '#831843');
    hexGrad.addColorStop(0.5, '#be185d');
    hexGrad.addColorStop(1, '#500724');
    ctx.fillStyle = hexGrad;
    drawHexPath(ctx, 0, 0, r);
    ctx.fill();

    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 6;
    ctx.shadowColor = '#fb7185';
    ctx.shadowBlur = 18;
    drawHexPath(ctx, 0, 0, r);
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.strokeStyle = 'rgba(254, 205, 211, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(0, r);
    ctx.moveTo(-r * 0.86, -r * 0.5);
    ctx.lineTo(r * 0.86, r * 0.5);
    ctx.moveTo(-r * 0.86, r * 0.5);
    ctx.lineTo(r * 0.86, -r * 0.5);
    ctx.stroke();

    const ethGrad = ctx.createLinearGradient(0, -60, 0, 50);
    ethGrad.addColorStop(0, '#ffffff');
    ethGrad.addColorStop(0.5, '#67e8f9');
    ethGrad.addColorStop(1, '#0284c7');
    ctx.fillStyle = ethGrad;

    ctx.beginPath();
    ctx.moveTo(0, -60);
    ctx.lineTo(40, -10);
    ctx.lineTo(0, 10);
    ctx.lineTo(-40, -10);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.lineTo(40, 0);
    ctx.lineTo(0, 60);
    ctx.lineTo(-40, 0);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#fef08a';
    ctx.font = '900 48px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#eab308';
    ctx.shadowBlur = 14;
    ctx.fillText('₿', 0, 0);
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  function drawHexPath(ctx, x, y, r) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      const hx = x + r * Math.cos(a);
      const hy = y + r * Math.sin(a);
      if (i === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
  }

  // --- CREATE 3D PEDESTAL MESHES FOR ALL 7 COMPONENTS ---
  const pedestalGroups = [];
  const raycastTargets = [];
  const serviceCount = services.length;

  services.forEach((serv, i) => {
    const pGroup = new THREE.Group();
    pGroup.userData = { index: i, service: serv };

    const baseAngle = (i / serviceCount) * Math.PI * 2;
    pGroup.userData.baseAngle = baseAngle;

    // 1. SOLID 3D CYLINDER BASE
    const cylGeom = new THREE.CylinderGeometry(48, 52, 18, 48);
    const cylMat = new THREE.MeshStandardMaterial({
      color: serv.pedestalHex,
      metalness: 0.85,
      roughness: 0.20,
      emissive: serv.pedestalHex,
      emissiveIntensity: 0.22
    });
    const cylMesh = new THREE.Mesh(cylGeom, cylMat);
    cylMesh.castShadow = true;
    cylMesh.receiveShadow = true;
    cylMesh.userData = { index: i };
    pGroup.add(cylMesh);
    raycastTargets.push(cylMesh);

    // 2. Beveled Metallic Gold Rim
    const rimGeom = new THREE.TorusGeometry(48, 2.2, 16, 48);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xffe4b5,
      metalness: 0.95,
      roughness: 0.1
    });
    const rim = new THREE.Mesh(rimGeom, rimMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 9;
    pGroup.add(rim);

    // 3. Underside Neon Halo Glow
    const haloGeom = new THREE.CircleGeometry(60, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: serv.glowColor,
      transparent: true,
      opacity: 0.50,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const halo = new THREE.Mesh(haloGeom, haloMat);
    halo.rotation.x = Math.PI / 2;
    halo.position.y = -9.2;
    pGroup.add(halo);

    // 4. Pedestal Front Plaque
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 512;
    labelCanvas.height = 128;
    const lctx = labelCanvas.getContext('2d');
    lctx.fillStyle = 'rgba(7, 26, 47, 0.95)';
    lctx.beginPath();
    lctx.roundRect(16, 16, 480, 96, 24);
    lctx.fill();
    lctx.lineWidth = 4;
    lctx.strokeStyle = serv.color;
    lctx.stroke();

    lctx.fillStyle = '#ffffff';
    lctx.font = '900 36px "Cinzel", "Inter", sans-serif';
    lctx.textAlign = 'center';
    lctx.textBaseline = 'middle';
    lctx.letterSpacing = '2px';
    lctx.shadowColor = 'rgba(0,0,0,0.8)';
    lctx.shadowBlur = 8;
    lctx.fillText(serv.title.toUpperCase(), 256, 64);

    const labelTex = new THREE.CanvasTexture(labelCanvas);
    const labelMat = new THREE.MeshBasicMaterial({
      map: labelTex,
      transparent: true
    });
    const labelPlane = new THREE.Mesh(new THREE.PlaneGeometry(60, 15), labelMat);
    labelPlane.position.set(0, 0, 52);
    pGroup.add(labelPlane);

    // 5. 3D VOLUMETRIC FLOATING EMBLEM (Always camera-facing)
    const emblemTex = generateEmblemTexture(serv);
    const emblemMat = new THREE.MeshBasicMaterial({
      map: emblemTex,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const emblemMesh = new THREE.Mesh(new THREE.PlaneGeometry(110, 110), emblemMat);
    emblemMesh.position.set(0, 65, 0);
    emblemMesh.userData = { index: i };
    pGroup.add(emblemMesh);
    raycastTargets.push(emblemMesh);

    // 6. Interactive Highlight Ring
    const selectRingGeom = new THREE.TorusGeometry(58, 3.0, 16, 48);
    const selectRingMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending
    });
    const selectRing = new THREE.Mesh(selectRingGeom, selectRingMat);
    selectRing.rotation.x = Math.PI / 2;
    selectRing.position.y = 12;
    pGroup.add(selectRing);
    pGroup.userData.selectRing = selectRing;

    orbitGroup.add(pGroup);
    pedestalGroups.push(pGroup);
  });

  // --- ORBIT & DUAL-ROTATION STATE ---
  let orbitAngle = 0;
  let targetOrbitAngle = 0;
  let activeIndex = 0;
  let isDragging = false;
  let previousMouseX = 0;
  let dragVelocity = 0;
  let cameraOrbitalAngle = 0;

  // Initialize HUD
  updateHUD(0);

  // Position pedestals along the ring
  function updatePedestalPositions() {
    pedestalGroups.forEach((pGroup) => {
      const totalAngle = orbitAngle + pGroup.userData.baseAngle;
      const x = Math.cos(totalAngle) * orbitRadius;
      const z = Math.sin(totalAngle) * orbitRadius;
      pGroup.position.set(x, 0, z);

      const emblem = pGroup.children.find(c => c.geometry && c.geometry.type === 'PlaneGeometry' && c.position.y > 30);
      if (emblem) {
        emblem.quaternion.copy(camera.quaternion);
      }
    });
  }
  updatePedestalPositions();

  // --- SELECTION & ROTATION LOGIC ---
  window.select3DService = function(index) {
    selectService(index);
  };

  function selectService(index) {
    const targetBase = pedestalGroups[index].userData.baseAngle;
    const needed = (Math.PI / 2) - targetBase;
    targetOrbitAngle = Math.round(orbitAngle / (Math.PI * 2)) * (Math.PI * 2) + needed;
    updateHUD(index);
  }

  // --- HUD CARD SYNCHRONIZATION ---
  const hudTitle = document.getElementById('globeHudTitle');
  const hudBadge = document.getElementById('globeHudBadge');
  const hudDesc = document.getElementById('globeHudDesc');
  const hudLink = document.getElementById('globeHudLink');

  function updateHUD(index) {
    activeIndex = index;
    const serv = services[index];

    if (hudTitle) {
      hudTitle.style.opacity = '0';
      setTimeout(() => {
        hudTitle.textContent = serv.title;
        hudTitle.style.color = serv.color;
        hudTitle.style.opacity = '1';
      }, 100);
    }
    if (hudBadge) {
      hudBadge.textContent = serv.badge;
      hudBadge.style.borderColor = serv.color;
      hudBadge.style.color = serv.color;
    }
    if (hudDesc) {
      hudDesc.style.opacity = '0';
      setTimeout(() => {
        hudDesc.textContent = serv.desc;
        hudDesc.style.opacity = '1';
      }, 100);
    }
    if (hudLink) {
      hudLink.href = serv.url;
      hudLink.style.background = `linear-gradient(135deg, ${serv.color} 0%, #c9a227 100%)`;
    }

    pedestalGroups.forEach((pg, i) => {
      if (pg.userData.selectRing) {
        pg.userData.selectRing.material.opacity = (i === index) ? 0.85 : 0.0;
        pg.userData.selectRing.material.color.setHex(serv.glowColor);
      }
    });
  }

  function detectFrontService() {
    let closestIndex = 0;
    let maxZ = -Infinity;

    pedestalGroups.forEach((pg, i) => {
      const worldPos = new THREE.Vector3();
      pg.getWorldPosition(worldPos);
      if (worldPos.z > maxZ) {
        maxZ = worldPos.z;
        closestIndex = i;
      }
    });

    if (closestIndex !== activeIndex) {
      updateHUD(closestIndex);
    }
  }

  // --- INTERACTION: DRAG TO ROTATE ---
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMouseX = e.clientX;
    dragVelocity = 0;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - previousMouseX;
    previousMouseX = e.clientX;
    dragVelocity = deltaX * 0.005;
    orbitAngle += dragVelocity;
    targetOrbitAngle = orbitAngle;
  });

  container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      previousMouseX = e.touches[0].clientX;
      dragVelocity = 0;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - previousMouseX;
    previousMouseX = e.touches[0].clientX;
    dragVelocity = deltaX * 0.006;
    orbitAngle += dragVelocity;
    targetOrbitAngle = orbitAngle;
  }, { passive: true });

  // --- INTERACTION: SCROLL-DRIVEN ORBIT ---
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;
    orbitAngle += scrollDelta * 0.0022;
    targetOrbitAngle = orbitAngle;
  }, { passive: true });

  // --- RAYCASTER (CLICK TO SELECT) ---
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  container.addEventListener('click', (e) => {
    const rect = container.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(raycastTargets);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      if (hit.userData && hit.userData.index !== undefined) {
        selectService(hit.userData.index);
      }
    }
  });

  // --- CONTINUOUS ANIMATION & DUAL-ROTATION RENDER LOOP ---
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // 1. MOTION 1: Earth Continuous Self-Centric Axial Rotation
    globeMesh.rotation.y += delta * 0.40;

    // 2. MOTION 2: Orbit Path Progression
    if (!isDragging) {
      orbitAngle += delta * 0.18;
      orbitAngle += (targetOrbitAngle - orbitAngle) * 0.06;
    } else {
      dragVelocity *= 0.94;
      orbitAngle += dragVelocity;
      targetOrbitAngle = orbitAngle;
    }

    // 3. MOTION 3: Cinematic Camera Sweeping Orbit (Google Flow Choreography)
    cameraOrbitalAngle += delta * 0.10;
    const camDist = 650;
    camera.position.x = Math.sin(cameraOrbitalAngle) * 75;
    camera.position.y = 110 + Math.sin(elapsedTime * 0.6) * 30;
    camera.position.z = camDist;
    camera.lookAt(0, -5, 0);

    // 4. Update Circulating Orbit Particles
    const posAttr = particleGeom.attributes.position;
    for (let i = 0; i < particleCount; i++) {
      particleAngles[i] += particleSpeeds[i];
      const r = orbitRadius + Math.sin(elapsedTime * 2 + i) * 4;
      posAttr.setX(i, Math.cos(particleAngles[i]) * r);
      posAttr.setZ(i, Math.sin(particleAngles[i]) * r);
    }
    posAttr.needsUpdate = true;

    // 5. Update 3D Pedestal Positions & Floating Bob
    pedestalGroups.forEach((pg, i) => {
      const totalAngle = orbitAngle + pg.userData.baseAngle;
      const x = Math.cos(totalAngle) * orbitRadius;
      const z = Math.sin(totalAngle) * orbitRadius;
      const bobY = Math.sin(elapsedTime * 2.4 + i * 0.9) * 4;
      pg.position.set(x, bobY, z);

      // Keep emblem billboarded toward camera
      const emblem = pg.children.find(c => c.geometry && c.geometry.type === 'PlaneGeometry' && c.position.y > 30);
      if (emblem) {
        emblem.quaternion.copy(camera.quaternion);
      }
    });

    // 6. Detect Front-facing active service
    detectFrontService();

    renderer.render(scene, camera);
  }

  // Initial direct render so canvas is NEVER blank on frame 0
  renderer.render(scene, camera);

  // Start continuous loop
  animate();

  // --- WINDOW RESIZE ---
  window.addEventListener('resize', () => {
    if (!container) return;
    width = container.clientWidth || 1000;
    height = container.clientHeight || 580;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
}

// Ensure startup when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start3DUniverse);
} else {
  start3DUniverse();
}
