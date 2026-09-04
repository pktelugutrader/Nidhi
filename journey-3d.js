/**
 * ALAKAAPURI NIDHI — REALISTIC 3D WEALTH JOURNEY ENGINE
 * Technologies: Three.js (WebGL) + GSAP ScrollTrigger + Procedural PBR Modeling + Web Audio API
 * Concept: "Start Investing. Stay Disciplined. Build Your Wealth."
 * 
 * 14-Scene Realistic Financial Documentary Architecture:
 * 01 Decision -> 02 Guidance -> 03 First Step -> 04 Discipline -> 05 Market Cycles -> 06 Long-Term Growth
 * -> 07 Beating Inflation -> 08 Child Education -> 09 Family Milestones -> 10 Home & Wealth
 * -> 11 Retirement -> 12 Goal Matrix -> 13 Rebalancing -> 14 The Complete Journey
 */

(function () {
  'use strict';

  // --- STATE CONFIGURATION ---
  const STATE = {
    scrollProgress: 0,
    targetScroll: 0,
    currentScroll: 0,
    activeSceneIndex: 0,
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
    soundEnabled: false,
    audioCtx: null,
    audioGain: null,
    clock: new THREE.Clock()
  };

  const SCENE_COUNT = 14;
  const SCENE_TITLES = [
    'SCENE 01 · THE DECISION TO INVEST',
    'SCENE 02 · PROPER GUIDANCE',
    'SCENE 03 · START INVESTING',
    'SCENE 04 · DISCIPLINED INVESTING',
    'SCENE 05 · MARKET UPS AND DOWNS',
    'SCENE 06 · WEALTH GROWTH',
    'SCENE 07 · BEATING INFLATION',
    'SCENE 08 · CHILD’S EDUCATION',
    'SCENE 09 · FAMILY MILESTONES',
    'SCENE 10 · HOME & WEALTH CREATION',
    'SCENE 11 · RETIREMENT FREEDOM',
    'SCENE 12 · EVERY GOAL NEEDS A PLAN',
    'SCENE 13 · THE ROLE OF GUIDANCE',
    'SCENE 14 · THE COMPLETE WEALTH JOURNEY'
  ];

  // DOM Elements
  const container = document.getElementById('webgl-container');
  const scrollWrapper = document.getElementById('scroll-wrapper');
  const loader = document.getElementById('loader');
  const loaderBar = document.getElementById('loader-bar');
  const railFill = document.getElementById('railFill');
  const railCounter = document.getElementById('railCounter');
  const railSteps = document.querySelectorAll('.rail-step');
  const storySections = document.querySelectorAll('.story-section');
  const navSceneTitle = document.getElementById('navSceneTitle');
  const audioToggle = document.getElementById('audioToggle');
  const audioStatus = document.getElementById('audioStatus');
  const scrollCue = document.getElementById('scrollCue');

  // --- THREE.JS GLOBALS ---
  let scene, camera, renderer;
  let cameraPath, cameraLookPath;
  let ambientLight, dirSunLight, deskPointLight, marketPointLight, citySunsetLight;

  // Scene Group Objects
  let sceneGroups = [];
  let homeStudyGroup, advisorOfficeGroup, phoneAppGroup, timelineCorridorGroup;
  let marketCycleGroup, wealthGrowthGroup, inflationGroup, universityCampusGroup;
  let celebrationPavilionGroup, modernHomeGroup, retirementOverlookGroup;
  let goalsMatrixGroup, rebalancingOfficeGroup, citySkylineGroup;

  // Dynamic Animated Sub-Meshes
  let laptopScreenMesh, phoneScreenMesh;
  let candlesticks = [];
  let dynamicMarketLine, growthCurveLine, investedBaseLine;
  let cityBuildings = [];

  // --- INITIALIZATION ---
  init();

  function init() {
    updateLoader(15);
    setupThree();
    updateLoader(30);
    createLighting();
    updateLoader(45);
    createCameraSplines();
    updateLoader(65);
    buildAllRealisticScenes();
    updateLoader(85);
    setupScrollSystem();
    setupEventListeners();
    setupAudioHarmonics();

    setTimeout(() => {
      updateLoader(100);
      setTimeout(() => {
        if (loader) loader.classList.add('fade-out');
      }, 350);
    }, 400);

    animate();
  }

  function updateLoader(pct) {
    if (loaderBar) loaderBar.style.width = pct + '%';
  }

  // --- THREE.JS SETUP ---
  function setupThree() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020713, 0.009);

    camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 1200);
    camera.position.set(0, 1.2, 5.5);

    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setClearColor(0x020611, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);
  }

  // --- LIGHTING ---
  function createLighting() {
    ambientLight = new THREE.AmbientLight(0x0a1c38, 0.45);
    scene.add(ambientLight);

    dirSunLight = new THREE.DirectionalLight(0xfff1cf, 0.85);
    dirSunLight.position.set(15, 30, 20);
    dirSunLight.castShadow = true;
    dirSunLight.shadow.mapSize.width = 1024;
    dirSunLight.shadow.mapSize.height = 1024;
    scene.add(dirSunLight);

    // Warm local desk light for Scene 1
    deskPointLight = new THREE.PointLight(0xffbe5c, 1.4, 18);
    deskPointLight.position.set(1.5, 2.2, 2.0);
    scene.add(deskPointLight);

    // Market volatility accent light
    marketPointLight = new THREE.PointLight(0x10b981, 1.0, 30);
    marketPointLight.position.set(0, 8, -135);
    scene.add(marketPointLight);

    // Sunset golden hour light for final scene
    citySunsetLight = new THREE.DirectionalLight(0xff7722, 1.2);
    citySunsetLight.position.set(-20, 15, -450);
    scene.add(citySunsetLight);
  }

  // --- CAMERA SPLINE PATHS (14 Realistic Scenes Along Z-Axis) ---
  function createCameraSplines() {
    const waypoints = [
      new THREE.Vector3(0, 1.2, 5.5),      // 01: Home Study (Facing laptop on desk)
      new THREE.Vector3(0, 2.2, -26),      // 02: Advisor Office (Across advisory desk)
      new THREE.Vector3(0, 1.5, -58),      // 03: Smartphone Investment screen
      new THREE.Vector3(0, 3.0, -92),      // 04: Disciplined SIP timeline
      new THREE.Vector3(0, 4.5, -130),     // 05: Market Ups & Downs (Candlestick chart)
      new THREE.Vector3(0, 5.2, -170),     // 06: Long-term compounding growth
      new THREE.Vector3(0, 3.8, -210),     // 07: Beating Inflation comparison
      new THREE.Vector3(0, 4.0, -250),     // 08: Child's University campus
      new THREE.Vector3(0, 3.6, -290),     // 09: Family Celebration Pavilion
      new THREE.Vector3(0, 4.8, -332),     // 10: Contemporary Family Residence
      new THREE.Vector3(0, 4.0, -374),     // 11: Retirement Overlook Terrace
      new THREE.Vector3(0, 7.5, -418),     // 12: Integrated 7-Goal Matrix
      new THREE.Vector3(0, 2.5, -458),     // 13: Rebalancing & Advisor Review
      new THREE.Vector3(0, 12.0, -510)     // 14: Sunset City Skyline & Finale
    ];

    const lookWaypoints = [
      new THREE.Vector3(0, 0.9, 0),        // Looking at laptop screen
      new THREE.Vector3(0, 1.6, -32),      // Looking at advisor presentation screen
      new THREE.Vector3(0, 1.5, -63),      // Looking at floating smartphone
      new THREE.Vector3(0, 2.2, -98),      // Looking along SIP timeline
      new THREE.Vector3(0, 4.2, -138),     // Looking at red/green market candlesticks
      new THREE.Vector3(0, 4.5, -178),     // Looking at compounding curves
      new THREE.Vector3(0, 3.2, -218),     // Looking at inflation towers
      new THREE.Vector3(0, 3.8, -260),     // Looking at university architectural arch
      new THREE.Vector3(0, 3.2, -300),     // Looking at celebration pavilion
      new THREE.Vector3(0, 4.0, -342),     // Looking at modern family home
      new THREE.Vector3(0, 3.2, -384),     // Looking at sunset retirement overlook
      new THREE.Vector3(0, 4.0, -428),     // Looking down at 7-goal planning matrix
      new THREE.Vector3(0, 2.2, -466),     // Looking at advisor rebalancing dashboard
      new THREE.Vector3(0, 4.0, -560)      // Looking far out at sunset city skyline
    ];

    cameraPath = new THREE.CatmullRomCurve3(waypoints, false, 'catmullrom', 0.25);
    cameraLookPath = new THREE.CatmullRomCurve3(lookWaypoints, false, 'catmullrom', 0.25);
  }

  // --- PROCEDURAL TEXTURES & MATERIALS ---
  function createProceduralWoodTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#1e140d';
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = '#2b1d13';
    ctx.lineWidth = 3;
    for (let i = 0; i < 60; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * 9 + Math.sin(i) * 6);
      ctx.bezierCurveTo(150, i * 9 + Math.cos(i) * 12, 350, i * 9 - Math.sin(i) * 10, 512, i * 9);
      ctx.stroke();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  function createScreenCanvasTexture(title, status, subtitle) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 640;
    const ctx = canvas.getContext('2d');

    // High-tech dark navy screen
    ctx.fillStyle = '#050f1e';
    ctx.fillRect(0, 0, 1024, 640);

    // Top window bar
    ctx.fillStyle = '#0b1d38';
    ctx.fillRect(0, 0, 1024, 60);

    // Window dots
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(40, 30, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath(); ctx.arc(65, 30, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#10b981';
    ctx.beginPath(); ctx.arc(90, 30, 8, 0, Math.PI * 2); ctx.fill();

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Inter, sans-serif';
    ctx.fillText(title, 50, 140);

    // Status Metric Box
    ctx.fillStyle = '#091629';
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 180, 420, 160);
    ctx.fillRect(50, 180, 420, 160);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '24px Inter, sans-serif';
    ctx.fillText('PORTFOLIO VALUE', 80, 230);

    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 56px JetBrains Mono, monospace';
    ctx.fillText(status, 80, 300);

    // Subtitle note
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '22px Inter, sans-serif';
    ctx.fillText(subtitle, 50, 400);

    // Subtle graph grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1.5;
    for (let x = 500; x < 980; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 180); ctx.lineTo(x, 560); ctx.stroke();
    }
    for (let y = 180; y < 580; y += 40) {
      ctx.beginPath(); ctx.moveTo(500, y); ctx.lineTo(980, y); ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  // --- REALISTIC 3D PROCEDURAL HUMAN FIGURE GENERATOR ---
  function createHumanFigure(options) {
    const {
      gender = 'male',
      ageStage = 'young', // 'young', 'mid', 'senior', 'teen'
      pose = 'standing',   // 'standing', 'sitting', 'walking', 'advisor_gesture'
      jacketColor = 0x1e293b,
      shirtColor = 0xffffff,
      pantsColor = 0x0f172a,
      skinTone = 0xb58156, // Realistic Indian skin tone
      hairColor = ageStage === 'senior' ? 0xd1d5db : (ageStage === 'mid' ? 0x2b1d14 : 0x160f0a),
      scale = 1.0
    } = options || {};

    const figure = new THREE.Group();

    // High quality PBR skin and fabric materials
    const skinMat = new THREE.MeshStandardMaterial({ color: skinTone, roughness: 0.65, metalness: 0.08 });
    const hairMat = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.8, metalness: 0.1 });
    const jacketMat = new THREE.MeshStandardMaterial({ color: jacketColor, roughness: 0.45, metalness: 0.2 });
    const shirtMat = new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.5 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: pantsColor, roughness: 0.5, metalness: 0.15 });
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0x0a0f16, roughness: 0.2, metalness: 0.6 });

    // Head
    const headGeo = new THREE.SphereGeometry(0.13, 20, 20);
    headGeo.scale(1.0, 1.15, 1.0);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.set(0, 1.62, 0);
    head.castShadow = true;
    figure.add(head);

    // Hair Style
    const hairGeo = new THREE.SphereGeometry(0.14, 16, 16);
    hairGeo.scale(1.02, 0.8, 1.05);
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 1.68, -0.01);
    figure.add(hair);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.08, 12);
    const neck = new THREE.Mesh(neckGeo, skinMat);
    neck.position.set(0, 1.5, 0);
    figure.add(neck);

    // Torso / Tailored Blazer
    const torsoGeo = new THREE.BoxGeometry(0.38, 0.55, 0.22);
    const torso = new THREE.Mesh(torsoGeo, jacketMat);
    torso.position.set(0, 1.2, 0);
    torso.castShadow = true;
    figure.add(torso);

    // Shirt collar V-neck
    const collarGeo = new THREE.ConeGeometry(0.08, 0.2, 3);
    const collar = new THREE.Mesh(collarGeo, shirtMat);
    collar.position.set(0, 1.34, 0.115);
    collar.rotation.z = Math.PI;
    figure.add(collar);

    if (pose === 'sitting') {
      // Pelvis
      const pelvisGeo = new THREE.BoxGeometry(0.36, 0.15, 0.24);
      const pelvis = new THREE.Mesh(pelvisGeo, pantsMat);
      pelvis.position.set(0, 0.88, 0);
      figure.add(pelvis);

      // Thighs (extending forward along Z)
      [-0.1, 0.1].forEach((tx) => {
        const thighGeo = new THREE.BoxGeometry(0.13, 0.12, 0.42);
        const thigh = new THREE.Mesh(thighGeo, pantsMat);
        thigh.position.set(tx, 0.82, 0.22);
        thigh.castShadow = true;
        figure.add(thigh);

        // Lower Leg (Vertical down)
        const shinGeo = new THREE.BoxGeometry(0.11, 0.44, 0.11);
        const shin = new THREE.Mesh(shinGeo, pantsMat);
        shin.position.set(tx, 0.55, 0.42);
        shin.castShadow = true;
        figure.add(shin);

        // Shoe
        const shoeGeo = new THREE.BoxGeometry(0.12, 0.08, 0.22);
        const shoe = new THREE.Mesh(shoeGeo, shoeMat);
        shoe.position.set(tx, 0.33, 0.47);
        figure.add(shoe);
      });

      // Arms: resting forward toward desk
      [-0.24, 0.24].forEach((ax, idx) => {
        const armGeo = new THREE.CylinderGeometry(0.05, 0.045, 0.42, 12);
        const arm = new THREE.Mesh(armGeo, jacketMat);
        arm.position.set(ax, 1.16, 0.14);
        arm.rotation.x = Math.PI / 3;
        arm.rotation.z = idx === 0 ? -0.15 : 0.15;
        figure.add(arm);

        const handGeo = new THREE.SphereGeometry(0.045, 12, 12);
        const hand = new THREE.Mesh(handGeo, skinMat);
        hand.position.set(ax + (idx === 0 ? 0.05 : -0.05), 1.0, 0.32);
        figure.add(hand);
      });
    } else if (pose === 'advisor_gesture') {
      // Standing advisor gesturing toward screen
      [-0.1, 0.1].forEach((lx) => {
        const legGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.88, 12);
        const leg = new THREE.Mesh(legGeo, pantsMat);
        leg.position.set(lx, 0.48, 0);
        leg.castShadow = true;
        figure.add(leg);

        const shoeGeo = new THREE.BoxGeometry(0.12, 0.08, 0.22);
        const shoe = new THREE.Mesh(shoeGeo, shoeMat);
        shoe.position.set(lx, 0.04, 0.05);
        figure.add(shoe);
      });

      const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.52, 12), jacketMat);
      armL.position.set(-0.24, 1.15, 0);
      figure.add(armL);

      const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.52, 12), jacketMat);
      armR.position.set(0.26, 1.32, 0.2);
      armR.rotation.x = -Math.PI / 3;
      armR.rotation.z = -Math.PI / 6;
      figure.add(armR);

      const handR = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), skinMat);
      handR.position.set(0.38, 1.55, 0.42);
      figure.add(handR);
    } else {
      // Standing / Walking
      [-0.1, 0.1].forEach((lx, idx) => {
        const legGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.88, 12);
        const leg = new THREE.Mesh(legGeo, pantsMat);
        leg.position.set(lx, 0.48, pose === 'walking' ? (idx === 0 ? 0.12 : -0.12) : 0);
        leg.rotation.x = pose === 'walking' ? (idx === 0 ? -0.2 : 0.2) : 0;
        leg.castShadow = true;
        figure.add(leg);

        const shoeGeo = new THREE.BoxGeometry(0.12, 0.08, 0.22);
        const shoe = new THREE.Mesh(shoeGeo, shoeMat);
        shoe.position.set(lx, 0.04, pose === 'walking' ? (idx === 0 ? 0.2 : -0.05) : 0.05);
        figure.add(shoe);
      });

      [-0.24, 0.24].forEach((ax, idx) => {
        const armGeo = new THREE.CylinderGeometry(0.05, 0.045, 0.52, 12);
        const arm = new THREE.Mesh(armGeo, jacketMat);
        arm.position.set(ax, 1.15, 0);
        arm.rotation.x = pose === 'walking' ? (idx === 0 ? 0.2 : -0.2) : 0;
        figure.add(arm);

        const handGeo = new THREE.SphereGeometry(0.045, 12, 12);
        const hand = new THREE.Mesh(handGeo, skinMat);
        hand.position.set(ax, 0.86, 0);
        figure.add(hand);
      });
    }

    if (scale !== 1.0) {
      figure.scale.set(scale, scale, scale);
    }

    return figure;
  }

  // --- REALISTIC 3D EXECUTIVE LUXURY SEDAN GENERATOR ---
  function createRealisticCar() {
    const car = new THREE.Group();

    // Metallic Deep Sapphire Blue PBR Body
    const carBodyMat = new THREE.MeshStandardMaterial({
      color: 0x081f3d,
      metalness: 0.95,
      roughness: 0.15
    });

    const bodyLowerGeo = new THREE.BoxGeometry(4.2, 0.65, 1.85);
    const bodyLower = new THREE.Mesh(bodyLowerGeo, carBodyMat);
    bodyLower.position.set(0, 0.55, 0);
    bodyLower.castShadow = true;
    car.add(bodyLower);

    // Cabin Greenhouse with Tinted Panoramic Glass
    const cabinGeo = new THREE.BoxGeometry(2.4, 0.65, 1.55);
    const cabinMat = new THREE.MeshPhysicalMaterial({
      color: 0x030a14,
      metalness: 0.3,
      roughness: 0.1,
      transparent: true,
      opacity: 0.85
    });
    const cabin = new THREE.Mesh(cabinGeo, cabinMat);
    cabin.position.set(-0.2, 1.12, 0);
    car.add(cabin);

    // LED Headlights (White Emissive)
    const hlGeo = new THREE.BoxGeometry(0.1, 0.14, 0.4);
    const hlMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    [-0.65, 0.65].forEach((hz) => {
      const hl = new THREE.Mesh(hlGeo, hlMat);
      hl.position.set(2.1, 0.65, hz);
      car.add(hl);
    });

    // Taillight Strip (Red Emissive)
    const tlGeo = new THREE.BoxGeometry(0.08, 0.1, 1.6);
    const tlMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const tl = new THREE.Mesh(tlGeo, tlMat);
    tl.position.set(-2.1, 0.68, 0);
    car.add(tl);

    // Wheels (4 Chrome Alloy Wheels with Rubber Tires)
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x11161f, roughness: 0.8 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 });

    [[-1.3, -0.95], [1.3, -0.95], [-1.3, 0.95], [1.3, 0.95]].forEach(([wx, wz]) => {
      const tireGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.24, 24);
      tireGeo.rotateX(Math.PI / 2);
      const tire = new THREE.Mesh(tireGeo, wheelMat);
      tire.position.set(wx, 0.36, wz);
      tire.castShadow = true;
      car.add(tire);

      const rimGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.25, 16);
      rimGeo.rotateX(Math.PI / 2);
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.position.set(wx, 0.36, wz);
      car.add(rim);
    });

    return car;
  }

  // --- BUILD ALL 14 REALISTIC SCENES ---
  function buildAllRealisticScenes() {
    buildScene01HomeStudy();
    buildScene02AdvisorOffice();
    buildScene03PhoneApp();
    buildScene04Timeline();
    buildScene05MarketCycles();
    buildScene06WealthGrowth();
    buildScene07Inflation();
    buildScene08University();
    buildScene09Celebration();
    buildScene10ModernHome();
    buildScene11Retirement();
    buildScene12GoalMatrix();
    buildScene13Rebalancing();
    buildScene14SunsetCity();

    createSubtleCityAtmosphere();
  }

  // --------------------------------------------------------------------------
  // SCENE 01: HOME STUDY & LAPTOP (PORTFOLIO VALUE: ₹0)
  // --------------------------------------------------------------------------
  function buildScene01HomeStudy() {
    homeStudyGroup = new THREE.Group();
    homeStudyGroup.position.set(0, 0, 0);

    const woodTex = createProceduralWoodTexture();

    // Modern Study Desk
    const deskGeo = new THREE.BoxGeometry(4.5, 0.12, 2.2);
    const deskMat = new THREE.MeshStandardMaterial({
      color: 0x221811,
      roughness: 0.35,
      metalness: 0.15,
      map: woodTex
    });
    const deskMesh = new THREE.Mesh(deskGeo, deskMat);
    deskMesh.position.set(0, 0.8, 0);
    deskMesh.receiveShadow = true;
    homeStudyGroup.add(deskMesh);

    // Desk Legs (Matte Black Steel)
    const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 16);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x11161d, roughness: 0.2, metalness: 0.8 });
    [[-2.1, -0.9], [2.1, -0.9], [-2.1, 0.9], [2.1, 0.9]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(lx, 0.4, lz);
      leg.castShadow = true;
      homeStudyGroup.add(leg);
    });

    // Sleek Laptop (Aluminum Unibody)
    const laptopBaseGeo = new THREE.BoxGeometry(0.85, 0.025, 0.6);
    const laptopMat = new THREE.MeshStandardMaterial({ color: 0x2d3748, metalness: 0.85, roughness: 0.25 });
    const laptopBase = new THREE.Mesh(laptopBaseGeo, laptopMat);
    laptopBase.position.set(0, 0.87, 0.2);
    homeStudyGroup.add(laptopBase);

    // Laptop Screen with Glowing Canvas
    const laptopScreenGeo = new THREE.BoxGeometry(0.85, 0.55, 0.02);
    const screenTexture = createScreenCanvasTexture('INVESTMENT PORTFOLIO', '₹0.00', 'Initial State · The Decision to Start');
    const laptopScreenMat = new THREE.MeshStandardMaterial({
      map: screenTexture,
      roughness: 0.1,
      emissive: 0x0c2548,
      emissiveIntensity: 0.65
    });
    laptopScreenMesh = new THREE.Mesh(laptopScreenGeo, laptopScreenMat);
    laptopScreenMesh.position.set(0, 1.15, -0.06);
    laptopScreenMesh.rotation.x = -0.15;
    homeStudyGroup.add(laptopScreenMesh);

    // Desk Chair
    const chairMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 });
    const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.08, 0.75), chairMat);
    chairSeat.position.set(0, 0.5, 0.9);
    homeStudyGroup.add(chairSeat);

    // Seated Young Professional Character (Age ~25, thoughtful posture at desk)
    const youngInvestor = createHumanFigure({
      gender: 'male',
      ageStage: 'young',
      pose: 'sitting',
      jacketColor: 0x1e3a8a,
      pantsColor: 0x1e293b,
      scale: 0.95
    });
    youngInvestor.position.set(0, 0.05, 0.75);
    youngInvestor.rotation.y = Math.PI;
    homeStudyGroup.add(youngInvestor);

    // Architectural Desk Lamp
    const lampMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.3 });
    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.04, 24), lampMat);
    lampBase.position.set(1.4, 0.88, -0.4);
    homeStudyGroup.add(lampBase);

    const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.9, 16), lampMat);
    lampStem.position.set(1.4, 1.3, -0.4);
    homeStudyGroup.add(lampStem);

    const lampHead = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.22, 24), lampMat);
    lampHead.position.set(1.28, 1.7, -0.25);
    lampHead.rotation.x = 0.5;
    lampHead.rotation.z = 0.4;
    homeStudyGroup.add(lampHead);

    // Coffee Mug
    const mug = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.14, 20),
      new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.2 })
    );
    mug.position.set(-1.1, 0.93, 0.3);
    homeStudyGroup.add(mug);

    // Framed Goal Photos in Background
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
    const photoMat = new THREE.MeshStandardMaterial({ color: 0x0f274a, emissive: 0x08172c, roughness: 0.5 });
    [[-1.8, 2.2, -2.5], [0, 2.5, -2.8], [1.8, 2.2, -2.5]].forEach(([fx, fy, fz]) => {
      const frame = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.6, 0.03), frameMat);
      frame.position.set(fx, fy, fz);
      const photo = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.5), photoMat);
      photo.position.set(fx, fy, fz + 0.02);
      homeStudyGroup.add(frame);
      homeStudyGroup.add(photo);
    });

    scene.add(homeStudyGroup);
    sceneGroups.push(homeStudyGroup);
  }

  // --------------------------------------------------------------------------
  // SCENE 02: ADVISOR EXECUTIVE OFFICE
  // --------------------------------------------------------------------------
  function buildScene02AdvisorOffice() {
    advisorOfficeGroup = new THREE.Group();
    advisorOfficeGroup.position.set(0, 0, -32);

    // Executive Glass Desk
    const execDesk = new THREE.Mesh(
      new THREE.BoxGeometry(5.2, 0.1, 2.6),
      new THREE.MeshPhysicalMaterial({
        color: 0x0b1c36,
        transparent: true,
        opacity: 0.85,
        roughness: 0.1,
        transmission: 0.6,
        metalness: 0.2
      })
    );
    execDesk.position.set(0, 1.0, 0);
    advisorOfficeGroup.add(execDesk);

    // Brass Frame Legs
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.25 });
    [-2.4, 2.4].forEach((lx) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.0, 2.4), frameMat);
      leg.position.set(lx, 0.5, 0);
      advisorOfficeGroup.add(leg);
    });

    // Floating Holographic Financial Planning Dashboard
    const hudCanvas = document.createElement('canvas');
    hudCanvas.width = 1024;
    hudCanvas.height = 512;
    const hctx = hudCanvas.getContext('2d');

    hctx.fillStyle = '#061327';
    hctx.fillRect(0, 0, 1024, 512);

    hctx.strokeStyle = '#d4af37';
    hctx.lineWidth = 2;
    hctx.strokeRect(20, 20, 984, 472);

    hctx.fillStyle = '#ffffff';
    hctx.font = 'bold 34px Inter, sans-serif';
    hctx.fillText('FINANCIAL ROADMAP & ASSET ALLOCATION', 50, 80);

    // Risk Meter Dial
    hctx.strokeStyle = '#10b981';
    hctx.lineWidth = 14;
    hctx.beginPath();
    hctx.arc(220, 260, 100, Math.PI * 0.8, Math.PI * 1.8);
    hctx.stroke();

    hctx.fillStyle = '#10b981';
    hctx.font = 'bold 26px Inter, sans-serif';
    hctx.fillText('RISK: MODERATE-EQUITY', 90, 400);

    // Asset Allocation Bars
    const bars = [
      { lbl: 'Large & Mid Cap Equities', pct: '65%', w: 320, c: '#38bdf8' },
      { lbl: 'Sectoral / Strategic Equities', pct: '20%', w: 100, c: '#d4af37' },
      { lbl: 'Debt / Liquid Emergency', pct: '15%', w: 75, c: '#94a3b8' }
    ];
    bars.forEach((b, i) => {
      hctx.fillStyle = '#cbd5e1';
      hctx.font = '20px Inter, sans-serif';
      hctx.fillText(b.lbl + ' (' + b.pct + ')', 480, 180 + i * 80);

      hctx.fillStyle = '#1e293b';
      hctx.fillRect(480, 195 + i * 80, 460, 20);

      hctx.fillStyle = b.c;
      hctx.fillRect(480, 195 + i * 80, b.w, 20);
    });

    const hudTexture = new THREE.CanvasTexture(hudCanvas);
    const hudMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(3.6, 1.8),
      new THREE.MeshBasicMaterial({ map: hudTexture, transparent: true, opacity: 0.92, side: THREE.DoubleSide })
    );
    hudMesh.position.set(0, 2.4, -0.6);
    advisorOfficeGroup.add(hudMesh);

    // Characters: Seated Investor + Standing Financial Advisor Gesturing
    const investor = createHumanFigure({
      gender: 'male',
      ageStage: 'young',
      pose: 'sitting',
      jacketColor: 0x1e3a8a,
      scale: 0.95
    });
    investor.position.set(-1.1, 0.1, 1.1);
    investor.rotation.y = Math.PI;
    advisorOfficeGroup.add(investor);

    const advisor = createHumanFigure({
      gender: 'male',
      ageStage: 'mid',
      pose: 'advisor_gesture',
      jacketColor: 0x0f172a,
      hairColor: 0x111111,
      scale: 1.0
    });
    advisor.position.set(1.2, 0, -1.0);
    advisor.rotation.y = 0;
    advisorOfficeGroup.add(advisor);

    scene.add(advisorOfficeGroup);
    sceneGroups.push(advisorOfficeGroup);
  }

  // --------------------------------------------------------------------------
  // SCENE 03: SMARTPHONE START INVESTING
  // --------------------------------------------------------------------------
  function buildScene03PhoneApp() {
    phoneAppGroup = new THREE.Group();
    phoneAppGroup.position.set(0, 0, -63);

    // 3D Smartphone Device Body
    const phoneBody = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 3.2, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.15 })
    );
    phoneBody.position.set(0, 1.5, 0);
    phoneAppGroup.add(phoneBody);

    // Bezel Border
    const phoneRim = new THREE.Mesh(
      new THREE.BoxGeometry(1.64, 3.24, 0.08),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.95, roughness: 0.2 })
    );
    phoneRim.position.set(0, 1.5, -0.01);
    phoneAppGroup.add(phoneRim);

    // Initial Screen Texture
    updatePhoneTexture('₹10,000');

    // Investor Character standing next to phone
    const investor = createHumanFigure({
      gender: 'male',
      ageStage: 'young',
      pose: 'standing',
      jacketColor: 0x1e3a8a,
      scale: 0.95
    });
    investor.position.set(-1.4, 0, 0);
    investor.rotation.y = Math.PI / 4;
    phoneAppGroup.add(investor);

    scene.add(phoneAppGroup);
    sceneGroups.push(phoneAppGroup);
  }

  function updatePhoneTexture(amtText) {
    const phoneCanvas = document.createElement('canvas');
    phoneCanvas.width = 512;
    phoneCanvas.height = 1024;
    const pctx = phoneCanvas.getContext('2d');

    pctx.fillStyle = '#030a16';
    pctx.fillRect(0, 0, 512, 1024);

    // Status bar
    pctx.fillStyle = '#94a3b8';
    pctx.font = '22px Inter, sans-serif';
    pctx.fillText('09:45', 30, 45);
    pctx.fillText('5G  100%', 380, 45);

    // Success badge circle
    pctx.fillStyle = 'rgba(16, 185, 129, 0.18)';
    pctx.beginPath(); pctx.arc(256, 240, 75, 0, Math.PI * 2); pctx.fill();
    pctx.strokeStyle = '#10b981';
    pctx.lineWidth = 6;
    pctx.stroke();

    pctx.fillStyle = '#10b981';
    pctx.font = 'bold 70px Inter, sans-serif';
    pctx.textAlign = 'center';
    pctx.fillText('✓', 256, 265);

    pctx.fillStyle = '#ffffff';
    pctx.font = 'bold 36px Inter, sans-serif';
    pctx.fillText('Investment Completed', 256, 370);

    pctx.fillStyle = '#94a3b8';
    pctx.font = '22px Inter, sans-serif';
    pctx.fillText('Equity Portfolio · Recurring Mandate', 256, 415);

    // Amount Box
    pctx.fillStyle = 'rgba(212, 175, 55, 0.12)';
    pctx.strokeStyle = '#d4af37';
    pctx.lineWidth = 2;
    pctx.strokeRect(60, 470, 392, 140);
    pctx.fillRect(60, 470, 392, 140);

    pctx.fillStyle = '#cbd5e1';
    pctx.font = '20px Inter, sans-serif';
    pctx.fillText('INITIAL ALLOCATION', 256, 515);

    pctx.fillStyle = '#d4af37';
    pctx.font = 'bold 54px JetBrains Mono, monospace';
    pctx.fillText(amtText, 256, 580);

    pctx.textAlign = 'left';
    pctx.fillStyle = '#94a3b8';
    pctx.font = '22px Inter, sans-serif';
    pctx.fillText('Asset Class: Diversified Equity', 70, 680);
    pctx.fillText('Mode: Monthly Systematic SIP', 70, 725);
    pctx.fillText('Status: Active & Disciplined', 70, 770);

    pctx.fillStyle = '#10b981';
    pctx.fillRect(60, 840, 392, 60);
    pctx.fillStyle = '#020611';
    pctx.font = 'bold 24px Inter, sans-serif';
    pctx.textAlign = 'center';
    pctx.fillText('VIEW REAL-TIME PORTFOLIO', 256, 878);

    const texture = new THREE.CanvasTexture(phoneCanvas);

    if (!phoneScreenMesh) {
      const screenMat = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.1,
        emissive: 0x08182f,
        emissiveIntensity: 0.6
      });
      phoneScreenMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 3.0), screenMat);
      phoneScreenMesh.position.set(0, 1.5, 0.065);
      phoneAppGroup.add(phoneScreenMesh);
    } else {
      phoneScreenMesh.material.map = texture;
      phoneScreenMesh.material.map.needsUpdate = true;
    }
  }

  // --------------------------------------------------------------------------
  // SCENE 04: DISCIPLINED INVESTING TIMELINE CORRIDOR
  // --------------------------------------------------------------------------
  function buildScene04Timeline() {
    timelineCorridorGroup = new THREE.Group();
    timelineCorridorGroup.position.set(0, 0, -98);

    // Glowing Central Capital Conduit
    const conduitGeo = new THREE.CylinderGeometry(0.08, 0.08, 30, 24);
    const conduitMat = new THREE.MeshBasicMaterial({ color: 0xd4af37 });
    const conduit = new THREE.Mesh(conduitGeo, conduitMat);
    conduit.rotation.x = Math.PI / 2;
    conduit.position.set(0, 1.5, 0);
    timelineCorridorGroup.add(conduit);

    // 6 Milestone Rings along the corridor
    const milestones = ['Month 1', 'Month 12', 'Year 2', 'Year 5', 'Year 10', 'Year 15'];
    milestones.forEach((m, idx) => {
      const ringGeo = new THREE.TorusGeometry(1.8 + idx * 0.15, 0.04, 16, 48);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x1e3a8a,
        roughness: 0.2,
        metalness: 0.8
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      const zPos = 12 - idx * 5;
      ring.position.set(0, 1.5, zPos);
      timelineCorridorGroup.add(ring);

      // Milestone Portal Label Plane
      const mCanvas = document.createElement('canvas');
      mCanvas.width = 256;
      mCanvas.height = 128;
      const mctx = mCanvas.getContext('2d');
      mctx.fillStyle = '#ffffff';
      mctx.font = 'bold 36px Rajdhani, sans-serif';
      mctx.textAlign = 'center';
      mctx.fillText(m, 128, 70);

      const mTex = new THREE.CanvasTexture(mCanvas);
      const labelPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(1.6, 0.8),
        new THREE.MeshBasicMaterial({ map: mTex, transparent: true })
      );
      labelPlane.position.set(0, 3.4 + idx * 0.1, zPos);
      timelineCorridorGroup.add(labelPlane);
    });

    scene.add(timelineCorridorGroup);
    sceneGroups.push(timelineCorridorGroup);
  }

  // --------------------------------------------------------------------------
  // SCENE 05: MARKET UPS AND DOWNS (REALISTIC 3D CANDLESTICK CHART)
  // --------------------------------------------------------------------------
  function buildScene05MarketCycles() {
    marketCycleGroup = new THREE.Group();
    marketCycleGroup.position.set(0, 0, -138);

    const gridHelper = new THREE.GridHelper(24, 24, 0xd4af37, 0x1e293b);
    gridHelper.position.set(0, 0, 0);
    marketCycleGroup.add(gridHelper);

    const candleData = [
      { o: 2.0, c: 2.8, h: 3.1, l: 1.8, isGreen: true },
      { o: 2.8, c: 3.6, h: 3.9, l: 2.6, isGreen: true },
      { o: 3.6, c: 4.5, h: 4.8, l: 3.3, isGreen: true },
      { o: 4.5, c: 5.4, h: 5.7, l: 4.2, isGreen: true },
      { o: 5.4, c: 4.2, h: 5.5, l: 3.8, isGreen: false },
      { o: 4.2, c: 3.2, h: 4.4, l: 2.9, isGreen: false },
      { o: 3.2, c: 2.7, h: 3.5, l: 2.4, isGreen: false },
      { o: 2.7, c: 3.1, h: 3.4, l: 2.5, isGreen: true },
      { o: 3.1, c: 3.9, h: 4.2, l: 2.9, isGreen: true },
      { o: 3.9, c: 5.0, h: 5.3, l: 3.7, isGreen: true },
      { o: 5.0, c: 6.2, h: 6.6, l: 4.8, isGreen: true },
      { o: 6.2, c: 7.5, h: 7.9, l: 6.0, isGreen: true },
      { o: 7.5, c: 8.8, h: 9.2, l: 7.2, isGreen: true }
    ];

    const greenMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.2,
      emissive: 0x059669,
      emissiveIntensity: 0.4
    });
    const redMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.2,
      emissive: 0xdc2626,
      emissiveIntensity: 0.4
    });

    const candleCurvePoints = [];

    candleData.forEach((cd, i) => {
      const xPos = -9 + i * 1.5;
      const bodyH = Math.max(0.15, Math.abs(cd.c - cd.o));
      const bodyY = Math.min(cd.o, cd.c) + bodyH / 2;

      const bodyGeo = new THREE.BoxGeometry(0.75, bodyH, 0.75);
      const cMesh = new THREE.Mesh(bodyGeo, cd.isGreen ? greenMat : redMat);
      cMesh.position.set(xPos, bodyY, 0);
      cMesh.castShadow = true;
      marketCycleGroup.add(cMesh);
      candlesticks.push(cMesh);

      const wickGeo = new THREE.CylinderGeometry(0.04, 0.04, cd.h - cd.l, 8);
      const wick = new THREE.Mesh(wickGeo, cd.isGreen ? greenMat : redMat);
      wick.position.set(xPos, cd.l + (cd.h - cd.l) / 2, 0);
      marketCycleGroup.add(wick);

      candleCurvePoints.push(new THREE.Vector3(xPos, cd.c, 0.5));
    });

    // Moving Average Ribbon Line
    const maCurve = new THREE.CatmullRomCurve3(candleCurvePoints);
    const maGeo = new THREE.TubeGeometry(maCurve, 64, 0.07, 12, false);
    const maMat = new THREE.MeshBasicMaterial({ color: 0xffe072 });
    dynamicMarketLine = new THREE.Mesh(maGeo, maMat);
    marketCycleGroup.add(dynamicMarketLine);

    // Advisory Shield Marker
    const shield = new THREE.Mesh(
      new THREE.ConeGeometry(0.8, 1.4, 6),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 })
    );
    shield.rotation.x = Math.PI;
    shield.position.set(0, 1.8, 1.2);
    marketCycleGroup.add(shield);

    scene.add(marketCycleGroup);
    sceneGroups.push(marketCycleGroup);
  }

  // --------------------------------------------------------------------------
  // SCENE 06: WEALTH GROWTH (COMPOUNDING CURVE VS INVESTED BASELINE)
  // --------------------------------------------------------------------------
  function buildScene06WealthGrowth() {
    wealthGrowthGroup = new THREE.Group();
    wealthGrowthGroup.position.set(0, 0, -178);

    // Linear Invested Capital Baseline
    const basePts = [];
    for (let i = 0; i <= 20; i++) {
      basePts.push(new THREE.Vector3(-10 + i * 1.0, 1.0 + i * 0.18, 0));
    }
    const baseCurve = new THREE.CatmullRomCurve3(basePts);
    const baseGeo = new THREE.TubeGeometry(baseCurve, 40, 0.08, 12, false);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.5 });
    investedBaseLine = new THREE.Mesh(baseGeo, baseMat);
    wealthGrowthGroup.add(investedBaseLine);

    // Compounding Equity Portfolio Curve
    const growthPts = [];
    for (let i = 0; i <= 20; i++) {
      const naturalFluctuation = Math.sin(i * 1.4) * 0.25;
      const exponentialLift = Math.pow(i / 8, 2.2);
      growthPts.push(new THREE.Vector3(-10 + i * 1.0, 1.0 + exponentialLift + naturalFluctuation, 0.5));
    }
    const growthCurve = new THREE.CatmullRomCurve3(growthPts);
    const growthGeo = new THREE.TubeGeometry(growthCurve, 64, 0.14, 16, false);
    const growthMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.2,
      emissive: 0x9a7516,
      emissiveIntensity: 0.5
    });
    growthCurveLine = new THREE.Mesh(growthGeo, growthMat);
    wealthGrowthGroup.add(growthCurveLine);

    // Mid-Career Investor Character (Age ~38, confident posture admiring growth)
    const midInvestor = createHumanFigure({
      gender: 'male',
      ageStage: 'mid',
      pose: 'standing',
      jacketColor: 0x0f172a,
      hairColor: 0x221c17,
      scale: 1.0
    });
    midInvestor.position.set(-6, 0.8, 1.5);
    midInvestor.rotation.y = Math.PI / 3;
    wealthGrowthGroup.add(midInvestor);

    // Illuminated Capital Columns
    for (let j = 0; j < 6; j++) {
      const colX = -8 + j * 3.2;
      const colH = 1.2 + Math.pow(j * 0.8, 2.1);
      const col = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, colH, 1.2),
        new THREE.MeshStandardMaterial({
          color: 0x091c38,
          metalness: 0.6,
          roughness: 0.3,
          transparent: true,
          opacity: 0.75
        })
      );
      col.position.set(colX, colH / 2, -1.0);
      wealthGrowthGroup.add(col);
    }

    scene.add(wealthGrowthGroup);
    sceneGroups.push(wealthGrowthGroup);
  }

  // --------------------------------------------------------------------------
  // SCENE 07: BEATING INFLATION (DUAL COMPARISON PILLARS)
  // --------------------------------------------------------------------------
  function buildScene07Inflation() {
    inflationGroup = new THREE.Group();
    inflationGroup.position.set(0, 0, -218);

    // Pillar Left: Cost Today (₹10 Lakh)
    const pillarLeft = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 2.6, 2.0),
      new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.3, metalness: 0.7 })
    );
    pillarLeft.position.set(-3.5, 1.3, 0);
    inflationGroup.add(pillarLeft);

    // Pillar Right: Future Inflated Cost (₹25 Lakh+)
    const pillarRight = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 6.5, 2.0),
      new THREE.MeshStandardMaterial({
        color: 0x7f1d1d,
        roughness: 0.3,
        metalness: 0.7,
        emissive: 0x450a0a,
        emissiveIntensity: 0.3
      })
    );
    pillarRight.position.set(3.5, 3.25, 0);
    inflationGroup.add(pillarRight);

    // Disciplined Equity Portfolio Arc (Soaring above inflation)
    const bridgePts = [
      new THREE.Vector3(-3.5, 2.7, 0),
      new THREE.Vector3(0, 5.5, 0),
      new THREE.Vector3(3.5, 8.2, 0)
    ];
    const bridgeCurve = new THREE.CatmullRomCurve3(bridgePts);
    const bridgeMesh = new THREE.Mesh(
      new THREE.TubeGeometry(bridgeCurve, 32, 0.16, 16, false),
      new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.9,
        emissive: 0xd4af37,
        emissiveIntensity: 0.5
      })
    );
    inflationGroup.add(bridgeMesh);

    scene.add(inflationGroup);
    sceneGroups.push(inflationGroup);
  }

  // --------------------------------------------------------------------------
  // SCENE 08: CHILD'S HIGHER EDUCATION (CAMPUS COLONNADE)
  // --------------------------------------------------------------------------
  function buildScene08University() {
    universityCampusGroup = new THREE.Group();
    universityCampusGroup.position.set(0, 0, -260);

    // Colonnade Pillars
    const archColGeo = new THREE.CylinderGeometry(0.28, 0.32, 5.5, 24);
    const archColMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.25, metalness: 0.4 });

    [-4.5, -2.2, 2.2, 4.5].forEach((cx) => {
      const col = new THREE.Mesh(archColGeo, archColMat);
      col.position.set(cx, 2.75, 0);
      universityCampusGroup.add(col);
    });

    const entablature = new THREE.Mesh(new THREE.BoxGeometry(11.0, 0.7, 1.4), archColMat);
    entablature.position.set(0, 5.85, 0);
    universityCampusGroup.add(entablature);

    // Goal 01 Floating HUD Ring
    const goalRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.6, 0.05, 16, 64),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    goalRing.position.set(0, 3.0, 0.4);
    universityCampusGroup.add(goalRing);

    // Characters: Investor, Spouse & College-bound Child
    const parent = createHumanFigure({
      gender: 'male',
      ageStage: 'mid',
      pose: 'standing',
      jacketColor: 0x1e293b,
      scale: 1.0
    });
    parent.position.set(-1.2, 0, 1.2);
    universityCampusGroup.add(parent);

    const spouse = createHumanFigure({
      gender: 'female',
      ageStage: 'mid',
      pose: 'standing',
      jacketColor: 0x831843,
      scale: 0.94
    });
    spouse.position.set(-1.8, 0, 1.2);
    universityCampusGroup.add(spouse);

    const studentChild = createHumanFigure({
      gender: 'male',
      ageStage: 'teen',
      pose: 'standing',
      jacketColor: 0x0284c7,
      scale: 0.92
    });
    studentChild.position.set(0.6, 0, 1.4);
    universityCampusGroup.add(studentChild);

    scene.add(universityCampusGroup);
    sceneGroups.push(universityCampusGroup);
  }

  // --------------------------------------------------------------------------
  // SCENE 09: FAMILY MILESTONE (CELEBRATION PAVILION)
  // --------------------------------------------------------------------------
  function buildScene09Celebration() {
    celebrationPavilionGroup = new THREE.Group();
    celebrationPavilionGroup.position.set(0, 0, -300);

    const arch = new THREE.Mesh(
      new THREE.TorusGeometry(3.5, 0.12, 16, 64, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.2 })
    );
    arch.position.set(0, 0, 0);
    celebrationPavilionGroup.add(arch);

    [-2.5, -1.0, 1.0, 2.5].forEach((lx) => {
      const lantern = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffd580 })
      );
      lantern.position.set(lx, 2.2 + Math.cos(lx) * 0.5, 0);
      celebrationPavilionGroup.add(lantern);
    });

    // Family Group under the pavilion
    const f1 = createHumanFigure({ gender: 'male', ageStage: 'mid', pose: 'standing', jacketColor: 0xd4af37, scale: 1.0 });
    f1.position.set(-0.6, 0, 0.8);
    celebrationPavilionGroup.add(f1);

    const f2 = createHumanFigure({ gender: 'female', ageStage: 'mid', pose: 'standing', jacketColor: 0xbe123c, scale: 0.95 });
    f2.position.set(0.6, 0, 0.8);
    celebrationPavilionGroup.add(f2);

    scene.add(celebrationPavilionGroup);
    sceneGroups.push(celebrationPavilionGroup);
  }

  // --------------------------------------------------------------------------
  // SCENE 10: CONTEMPORARY FAMILY RESIDENCE (HOME, CAR & ASSETS)
  // --------------------------------------------------------------------------
  function buildScene10ModernHome() {
    modernHomeGroup = new THREE.Group();
    modernHomeGroup.position.set(0, 0, -342);

    // Modern Villa Architectural Volume
    const houseMain = new THREE.Mesh(
      new THREE.BoxGeometry(6.0, 3.8, 4.5),
      new THREE.MeshStandardMaterial({ color: 0x111c2e, roughness: 0.35 })
    );
    houseMain.position.set(0, 1.9, 0);
    modernHomeGroup.add(houseMain);

    // Floor-to-Ceiling Windows
    const windowMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(4.8, 2.2),
      new THREE.MeshStandardMaterial({
        color: 0xffe29a,
        emissive: 0xffae19,
        emissiveIntensity: 0.6,
        roughness: 0.1
      })
    );
    windowMesh.position.set(0, 2.0, 2.26);
    modernHomeGroup.add(windowMesh);

    // Balcony
    const balcony = new THREE.Mesh(
      new THREE.BoxGeometry(6.4, 0.15, 1.4),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.25 })
    );
    balcony.position.set(0, 3.1, 2.8);
    modernHomeGroup.add(balcony);

    // Realistic Modern Luxury Car in Driveway
    const modernCar = createRealisticCar();
    modernCar.position.set(3.8, 0, 2.2);
    modernCar.rotation.y = -Math.PI / 10;
    modernHomeGroup.add(modernCar);

    // Homeowner Investor Standing Proud
    const homeowner = createHumanFigure({
      gender: 'male',
      ageStage: 'mid',
      pose: 'standing',
      jacketColor: 0x1e293b,
      scale: 1.0
    });
    homeowner.position.set(-1.8, 0, 2.8);
    modernHomeGroup.add(homeowner);

    // 4 Asset Ecosystem Orbit Disks
    const orbitColors = [0x38bdf8, 0xd4af37, 0x10b981, 0xa855f7];
    orbitColors.forEach((col, i) => {
      const disk = new THREE.Mesh(
        new THREE.TorusGeometry(3.6 + i * 0.4, 0.03, 12, 48),
        new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.6 })
      );
      disk.rotation.x = Math.PI / 2.2;
      disk.position.set(0, 2.0, 0);
      modernHomeGroup.add(disk);
    });

    scene.add(modernHomeGroup);
    sceneGroups.push(modernHomeGroup);
  }

  // --------------------------------------------------------------------------
  // SCENE 11: RETIREMENT OVERLOOK TERRACE
  // --------------------------------------------------------------------------
  function buildScene11Retirement() {
    retirementOverlookGroup = new THREE.Group();
    retirementOverlookGroup.position.set(0, 0, -384);

    // Terrace Deck Floor
    const terrace = new THREE.Mesh(
      new THREE.CylinderGeometry(5.5, 6.0, 0.3, 32),
      new THREE.MeshStandardMaterial({ color: 0x1a2638, roughness: 0.4 })
    );
    terrace.position.set(0, 0.15, 0);
    retirementOverlookGroup.add(terrace);

    // Brass Handrail
    const rail = new THREE.Mesh(
      new THREE.TorusGeometry(5.2, 0.05, 16, 48, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 })
    );
    rail.position.set(0, 1.1, 0);
    rail.rotation.x = Math.PI / 2;
    retirementOverlookGroup.add(rail);

    // Senior Couple Walking Together on Terrace (Age ~60, relaxed retirement lifestyle)
    const retInvestor = createHumanFigure({
      gender: 'male',
      ageStage: 'senior',
      pose: 'walking',
      jacketColor: 0xe2e8f0,
      pantsColor: 0x64748b,
      hairColor: 0xd1d5db,
      scale: 1.0
    });
    retInvestor.position.set(-0.4, 0.3, 0.5);
    retInvestor.rotation.y = Math.PI / 6;
    retirementOverlookGroup.add(retInvestor);

    const retSpouse = createHumanFigure({
      gender: 'female',
      ageStage: 'senior',
      pose: 'walking',
      jacketColor: 0xfef08a,
      pantsColor: 0x94a3b8,
      hairColor: 0xe2e8f0,
      scale: 0.93
    });
    retSpouse.position.set(0.4, 0.3, 0.4);
    retSpouse.rotation.y = Math.PI / 6;
    retirementOverlookGroup.add(retSpouse);

    // Two Terrace Loungers Facing Sunset
    const chairMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    [-1.8, 1.8].forEach((cx) => {
      const lounger = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 1.8), chairMat);
      lounger.position.set(cx, 0.4, -1.2);
      retirementOverlookGroup.add(lounger);
    });

    scene.add(retirementOverlookGroup);
    sceneGroups.push(retirementOverlookGroup);
  }

  // --------------------------------------------------------------------------
  // SCENE 12: INTEGRATED 7-GOAL PLANNING MATRIX
  // --------------------------------------------------------------------------
  function buildScene12GoalMatrix() {
    goalsMatrixGroup = new THREE.Group();
    goalsMatrixGroup.position.set(0, 0, -428);

    // Central Strategy Hub Ring
    const hub = new THREE.Mesh(
      new THREE.TorusGeometry(2.2, 0.08, 16, 64),
      new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        emissive: 0xd4af37,
        emissiveIntensity: 0.6,
        metalness: 0.9
      })
    );
    hub.position.set(0, 3.5, 0);
    goalsMatrixGroup.add(hub);

    // 7 Radial Goal Satellites
    const goalCount = 7;
    for (let i = 0; i < goalCount; i++) {
      const angle = (i / goalCount) * Math.PI * 2;
      const radius = 5.2;
      const gx = Math.cos(angle) * radius;
      const gy = 3.5 + Math.sin(angle) * 2.6;

      const sat = new THREE.Mesh(
        new THREE.SphereGeometry(0.35, 24, 24),
        new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          emissive: 0x0284c7,
          emissiveIntensity: 0.5,
          roughness: 0.2
        })
      );
      sat.position.set(gx, gy, 0);
      goalsMatrixGroup.add(sat);

      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, radius, 8),
        new THREE.MeshBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.7 })
      );
      beam.position.set(gx / 2, (gy + 3.5) / 2, 0);
      beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(gx, gy - 3.5, 0).normalize());
      goalsMatrixGroup.add(beam);
    }

    scene.add(goalsMatrixGroup);
    sceneGroups.push(goalsMatrixGroup);
  }

  // --------------------------------------------------------------------------
  // SCENE 13: THE ROLE OF GUIDANCE (REBALANCING REVIEW)
  // --------------------------------------------------------------------------
  function buildScene13Rebalancing() {
    rebalancingOfficeGroup = new THREE.Group();
    rebalancingOfficeGroup.position.set(0, 0, -466);

    // Dynamic Concentric Rebalancing Dials
    [1.8, 2.6, 3.4].forEach((r, idx) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.04, 16, 64),
        new THREE.MeshStandardMaterial({
          color: idx === 1 ? 0xd4af37 : 0x38bdf8,
          metalness: 0.85,
          roughness: 0.2
        })
      );
      ring.position.set(0, 2.2, 0);
      ring.rotation.x = Math.PI / 2.6;
      rebalancingOfficeGroup.add(ring);
    });

    // Advisor & Senior Investor Reviewing
    const advReview = createHumanFigure({
      gender: 'male',
      ageStage: 'mid',
      pose: 'advisor_gesture',
      jacketColor: 0x0f172a,
      scale: 1.0
    });
    advReview.position.set(-1.0, 0, 1.2);
    rebalancingOfficeGroup.add(advReview);

    const invReview = createHumanFigure({
      gender: 'male',
      ageStage: 'senior',
      pose: 'standing',
      jacketColor: 0x1e293b,
      hairColor: 0xd1d5db,
      scale: 1.0
    });
    invReview.position.set(1.0, 0, 1.2);
    rebalancingOfficeGroup.add(invReview);

    scene.add(rebalancingOfficeGroup);
    sceneGroups.push(rebalancingOfficeGroup);
  }

  // --------------------------------------------------------------------------
  // SCENE 14: SUNSET CITY SKYLINE & COMPLETE WEALTH JOURNEY
  // --------------------------------------------------------------------------
  function buildScene14SunsetCity() {
    citySkylineGroup = new THREE.Group();
    citySkylineGroup.position.set(0, 0, -560);

    // 40 Glass Architectural Skyscraper Towers
    const towerMat = new THREE.MeshStandardMaterial({ color: 0x06152b, metalness: 0.8, roughness: 0.25 });

    for (let i = 0; i < 40; i++) {
      const tx = (i - 20) * 4.2 + (Math.random() - 0.5) * 2;
      const th = 8 + Math.random() * 22;
      const tw = 2.2 + Math.random() * 1.8;
      const tz = -10 - Math.random() * 45;

      const tower = new THREE.Mesh(new THREE.BoxGeometry(tw, th, tw), towerMat);
      tower.position.set(tx, th / 2, tz);
      citySkylineGroup.add(tower);
      cityBuildings.push(tower);

      if (th > 18) {
        const spire = new THREE.Mesh(
          new THREE.ConeGeometry(0.15, 3.5, 8),
          new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9 })
        );
        spire.position.set(tx, th + 1.75, tz);
        citySkylineGroup.add(spire);
      }
    }

    // Panoramic Sunset Horizon Glow Disk
    const sun = new THREE.Mesh(
      new THREE.CircleGeometry(24, 48),
      new THREE.MeshBasicMaterial({ color: 0xff7b25, transparent: true, opacity: 0.85 })
    );
    sun.position.set(0, 16, -65);
    citySkylineGroup.add(sun);

    // Complete Family Standing on Overlook Facing the Sunset
    const finaleFamily = new THREE.Group();
    const fSeniorM = createHumanFigure({ gender: 'male', ageStage: 'senior', pose: 'standing', jacketColor: 0x0f172a, hairColor: 0xd1d5db, scale: 1.0 });
    fSeniorM.position.set(-0.8, 1.2, -4);
    fSeniorM.rotation.y = Math.PI;
    finaleFamily.add(fSeniorM);

    const fSeniorF = createHumanFigure({ gender: 'female', ageStage: 'senior', pose: 'standing', jacketColor: 0xbe123c, hairColor: 0xe2e8f0, scale: 0.94 });
    fSeniorF.position.set(0, 1.2, -4);
    fSeniorF.rotation.y = Math.PI;
    finaleFamily.add(fSeniorF);

    const fYoungM = createHumanFigure({ gender: 'male', ageStage: 'young', pose: 'standing', jacketColor: 0x1e3a8a, hairColor: 0x111111, scale: 0.96 });
    fYoungM.position.set(0.8, 1.2, -3.8);
    fYoungM.rotation.y = Math.PI;
    finaleFamily.add(fYoungM);

    citySkylineGroup.add(finaleFamily);

    scene.add(citySkylineGroup);
    sceneGroups.push(citySkylineGroup);
  }

  // --- SUBTLE CITY ATMOSPHERE / PARTICLES ---
  function createSubtleCityAtmosphere() {
    const starGeo = new THREE.BufferGeometry();
    const starCount = 800;
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 140;
      positions[i + 1] = Math.random() * 60 + 5;
      positions[i + 2] = -Math.random() * 600;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const starMat = new THREE.PointsMaterial({
      color: 0xd4af37,
      size: 0.35,
      transparent: true,
      opacity: 0.55
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);
  }

  // --- SCROLL & PROGRESSION SYSTEM ---
  function setupScrollSystem() {
    window.addEventListener('scroll', onNativeScroll, { passive: true });
    updateActiveScene(0);
  }

  function onNativeScroll() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return;

    STATE.targetScroll = window.scrollY / maxScroll;
  }

  function updateActiveScene(index) {
    if (index === STATE.activeSceneIndex) return;
    STATE.activeSceneIndex = index;

    // Update Story Sections
    storySections.forEach((sec, idx) => {
      if (idx === index) {
        sec.classList.add('active');
      } else {
        sec.classList.remove('active');
      }
    });

    // Update Nav Header Title
    if (navSceneTitle && SCENE_TITLES[index]) {
      navSceneTitle.textContent = SCENE_TITLES[index];
    }

    // Update Right-side Rail
    railSteps.forEach((step, idx) => {
      if (idx === index) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });

    if (railCounter) {
      const padIndex = (index + 1).toString().padStart(2, '0');
      railCounter.textContent = `${padIndex} / 14`;
    }

    // Hide bottom scroll cue on later scenes
    if (scrollCue) {
      scrollCue.style.opacity = index > 0 ? '0' : '1';
    }
  }

  // --- EVENT LISTENERS & INTERACTIVE WIDGETS ---
  function setupEventListeners() {
    window.addEventListener('resize', onWindowResize);

    // Mouse movement parallax
    window.addEventListener('mousemove', (e) => {
      STATE.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      STATE.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Keyboard navigation (Arrow keys / PageUp / PageDown)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        jumpToScene(Math.min(SCENE_COUNT - 1, STATE.activeSceneIndex + 1));
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        jumpToScene(Math.max(0, STATE.activeSceneIndex - 1));
      }
    });

    // Rail Step Clicks
    railSteps.forEach((btn) => {
      btn.addEventListener('click', () => {
        const stepIdx = parseInt(btn.getAttribute('data-step'), 10);
        jumpToScene(stepIdx);
      });
    });

    // Scene 3 Interactive SIP Pills
    document.querySelectorAll('.sip-pill-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.sip-pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const amt = btn.getAttribute('data-amt');
        const disp = document.getElementById('phoneAmtDisplay');
        if (disp) disp.textContent = amt;
        updatePhoneTexture(amt);
      });
    });

    // Scene 7 Interactive Inflation Scenario Toggles
    document.querySelectorAll('.inf-rate-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.inf-rate-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cost = btn.getAttribute('data-cost');
        const futureVal = document.querySelector('.future-box .inf-val');
        if (futureVal) {
          futureVal.textContent = cost;
          futureVal.style.transform = 'scale(1.1)';
          setTimeout(() => { futureVal.style.transform = 'scale(1)'; }, 200);
        }
      });
    });

    // Audio Toggle
    if (audioToggle) {
      audioToggle.addEventListener('click', toggleAudio);
    }
  }

  function jumpToScene(sceneIdx) {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetY = (sceneIdx / (SCENE_COUNT - 1)) * maxScroll;
    window.scrollTo({
      top: targetY,
      behavior: 'smooth'
    });
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // --- AMBIENT DOCUMENTARY WEB AUDIO HARMONICS ---
  function setupAudioHarmonics() {
    // Initialized on user gesture
  }

  function toggleAudio() {
    if (!STATE.soundEnabled) {
      startAmbientAudio();
      STATE.soundEnabled = true;
      audioToggle.classList.add('active');
      if (audioStatus) audioStatus.textContent = 'ON';
    } else {
      stopAmbientAudio();
      STATE.soundEnabled = false;
      audioToggle.classList.remove('active');
      if (audioStatus) audioStatus.textContent = 'OFF';
    }
  }

  function startAmbientAudio() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!STATE.audioCtx) {
        STATE.audioCtx = new AudioContext();
      }
      if (STATE.audioCtx.state === 'suspended') {
        STATE.audioCtx.resume();
      }

      STATE.audioGain = STATE.audioCtx.createGain();
      STATE.audioGain.gain.setValueAtTime(0.001, STATE.audioCtx.currentTime);
      STATE.audioGain.gain.exponentialRampToValueAtTime(0.12, STATE.audioCtx.currentTime + 3);
      STATE.audioGain.connect(STATE.audioCtx.destination);

      // Warm harmonic drones (C Major / G Major peaceful wealth serenity)
      const freqs = [130.81, 196.00, 261.63, 329.63, 392.00];
      freqs.forEach((f) => {
        const osc = STATE.audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, STATE.audioCtx.currentTime);
        osc.connect(STATE.audioGain);
        osc.start();
      });
    } catch (e) {
      console.warn('AudioContext not allowed yet:', e);
    }
  }

  function stopAmbientAudio() {
    if (STATE.audioGain && STATE.audioCtx) {
      STATE.audioGain.gain.exponentialRampToValueAtTime(0.0001, STATE.audioCtx.currentTime + 0.8);
    }
  }

  // --- ANIMATION LOOP ---
  function animate() {
    requestAnimationFrame(animate);

    const delta = STATE.clock.getDelta();
    const elapsedTime = STATE.clock.getElapsedTime();

    // Smooth Scroll Damping (Lerp)
    STATE.currentScroll += (STATE.targetScroll - STATE.currentScroll) * 0.075;
    const progress = Math.max(0, Math.min(1, STATE.currentScroll));

    // Update Progress Rail Fill
    if (railFill) {
      railFill.style.height = `${progress * 100}%`;
    }

    // Determine current scene index
    const computedSceneIndex = Math.min(
      SCENE_COUNT - 1,
      Math.floor(progress * SCENE_COUNT)
    );
    updateActiveScene(computedSceneIndex);

    // Mouse Parallax Damping
    STATE.mouseX += (STATE.targetMouseX - STATE.mouseX) * 0.05;
    STATE.mouseY += (STATE.targetMouseY - STATE.mouseY) * 0.05;

    // Spline Interpolation for Camera
    if (cameraPath && cameraLookPath) {
      const camPos = cameraPath.getPointAt(progress);
      const lookPos = cameraLookPath.getPointAt(progress);

      camera.position.x = camPos.x + STATE.mouseX * 0.45;
      camera.position.y = camPos.y - STATE.mouseY * 0.35;
      camera.position.z = camPos.z;

      camera.lookAt(lookPos.x + STATE.mouseX * 0.2, lookPos.y, lookPos.z);
    }

    // Subtle Scene Micro-Animations
    candlesticks.forEach((c, idx) => {
      c.position.y += Math.sin(elapsedTime * 1.5 + idx) * 0.001;
    });

    if (citySunsetLight) {
      citySunsetLight.intensity = 1.0 + Math.sin(elapsedTime * 0.8) * 0.2;
    }

    renderer.render(scene, camera);
  }

})();
