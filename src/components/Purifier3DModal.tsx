'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { X, Play, Pause, Layers, Wind, ShieldCheck, Info } from 'lucide-react';

interface Purifier3DModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Purifier3DModal: React.FC<Purifier3DModalProps> = ({ isOpen, onClose }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [fanSpeed, setFanSpeed] = useState<number>(3); // 1 to 5
  const [isExploded, setIsExploded] = useState<boolean>(false);
  const [isRotating, setIsRotating] = useState<boolean>(true);

  const fanSpeedRef = useRef(fanSpeed);
  fanSpeedRef.current = fanSpeed;

  const explodedRef = useRef(isExploded);
  explodedRef.current = isExploded;

  const isRotatingRef = useRef(isRotating);
  isRotatingRef.current = isRotating;

  useEffect(() => {
    if (!isOpen) return;
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(4, 4, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x34d399, 1.8);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const blueLight = new THREE.PointLight(0x38bdf8, 2, 10);
    blueLight.position.set(0, 3, 0);
    scene.add(blueLight);

    // Group for the entire assembly
    const assemblyGroup = new THREE.Group();
    scene.add(assemblyGroup);

    // 1. Box Fan Frame (Top)
    const fanFrameGeo = new THREE.BoxGeometry(2.2, 0.3, 2.2);
    const fanFrameMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.2,
      roughness: 0.5
    });
    const fanFrame = new THREE.Mesh(fanFrameGeo, fanFrameMat);
    fanFrame.position.y = 1.15;
    assemblyGroup.add(fanFrame);

    // Fan Grille Cutout Ring
    const ringGeo = new THREE.TorusGeometry(0.85, 0.05, 16, 32);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.6 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 1.3;
    assemblyGroup.add(ringMesh);

    // Fan Blade Assembly
    const fanBladeGroup = new THREE.Group();
    fanBladeGroup.position.y = 1.15;
    assemblyGroup.add(fanBladeGroup);

    const hubGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.15, 16);
    const hubMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
    const hub = new THREE.Mesh(hubGeo, hubMat);
    fanBladeGroup.add(hub);

    // 5 Aerodynamic Fan Blades
    for (let b = 0; b < 5; b++) {
      const angle = (b / 5) * Math.PI * 2;
      const bladeGeo = new THREE.BoxGeometry(0.18, 0.03, 0.65);
      const bladeMat = new THREE.MeshStandardMaterial({
        color: 0x059669,
        roughness: 0.3,
        metalness: 0.3
      });
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.position.x = Math.sin(angle) * 0.42;
      blade.position.z = Math.cos(angle) * 0.42;
      blade.rotation.y = angle;
      blade.rotation.x = 0.35; // Pitch angle
      fanBladeGroup.add(blade);
    }

    // 2. Base Floor / Cardboard Bottom
    const bottomGeo = new THREE.BoxGeometry(2.0, 0.1, 2.0);
    const bottomMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
    const bottomMesh = new THREE.Mesh(bottomGeo, bottomMat);
    bottomMesh.position.y = -1.05;
    assemblyGroup.add(bottomMesh);

    // 3. 4 Side MERV-13 Filters
    const filterGeo = new THREE.BoxGeometry(2.0, 2.0, 0.08);
    const filterMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.8,
      wireframe: false
    });

    // Pleated texture simulation with ridges
    const filterNorth = new THREE.Mesh(filterGeo, filterMat);
    filterNorth.position.set(0, 0, 1.0);
    assemblyGroup.add(filterNorth);

    const filterSouth = new THREE.Mesh(filterGeo, filterMat);
    filterSouth.position.set(0, 0, -1.0);
    assemblyGroup.add(filterSouth);

    const filterEast = new THREE.Mesh(filterGeo, filterMat);
    filterEast.rotation.y = Math.PI / 2;
    filterEast.position.set(1.0, 0, 0);
    assemblyGroup.add(filterEast);

    const filterWest = new THREE.Mesh(filterGeo, filterMat);
    filterWest.rotation.y = Math.PI / 2;
    filterWest.position.set(-1.0, 0, 0);
    assemblyGroup.add(filterWest);

    const filters = [filterNorth, filterSouth, filterEast, filterWest];

    // 4. Airflow Particle Simulation (Dirty in -> Clean out)
    const particleCount = 600;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);

    const dirtyColor = new THREE.Color(0xd97706); // Smog ochre
    const cleanColor = new THREE.Color(0x38bdf8); // Clean cyan

    for (let i = 0; i < particleCount; i++) {
      // Spawn dirty particles around the outside perimeter
      const side = Math.floor(Math.random() * 4);
      let px = 0, py = (Math.random() - 0.5) * 1.8, pz = 0;
      let vx = 0, vy = 0, vz = 0;

      if (side === 0) {
        px = (Math.random() - 0.5) * 2;
        pz = 2.4 + Math.random() * 0.8;
        vz = -0.04;
      } else if (side === 1) {
        px = (Math.random() - 0.5) * 2;
        pz = -2.4 - Math.random() * 0.8;
        vz = 0.04;
      } else if (side === 2) {
        px = 2.4 + Math.random() * 0.8;
        pz = (Math.random() - 0.5) * 2;
        vx = -0.04;
      } else {
        px = -2.4 - Math.random() * 0.8;
        pz = (Math.random() - 0.5) * 2;
        vx = 0.04;
      }

      particlePositions[i * 3] = px;
      particlePositions[i * 3 + 1] = py;
      particlePositions[i * 3 + 2] = pz;

      particleVelocities[i * 3] = vx;
      particleVelocities[i * 3 + 1] = vy;
      particleVelocities[i * 3 + 2] = vz;

      particleColors[i * 3] = dirtyColor.r;
      particleColors[i * 3 + 1] = dirtyColor.g;
      particleColors[i * 3 + 2] = dirtyColor.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.07,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeo, particleMaterial);
    scene.add(particles);

    // Mouse drag rotation
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      assemblyGroup.rotation.y += deltaX * 0.01;
      assemblyGroup.rotation.x += deltaY * 0.01;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const renderLoop = () => {
      animId = requestAnimationFrame(renderLoop);
      const delta = clock.getDelta();
      const speed = fanSpeedRef.current;

      // Rotate fan blades
      fanBladeGroup.rotation.y += delta * speed * 8.0;

      // Auto rotation of whole model when idle
      if (isRotatingRef.current && !isDragging) {
        assemblyGroup.rotation.y += delta * 0.35;
      }

      // Exploded CAD view animation
      const targetOffset = explodedRef.current ? 0.7 : 0.0;
      filterNorth.position.z = THREE.MathUtils.lerp(filterNorth.position.z, 1.0 + targetOffset, 0.08);
      filterSouth.position.z = THREE.MathUtils.lerp(filterSouth.position.z, -1.0 - targetOffset, 0.08);
      filterEast.position.x = THREE.MathUtils.lerp(filterEast.position.x, 1.0 + targetOffset, 0.08);
      filterWest.position.x = THREE.MathUtils.lerp(filterWest.position.x, -1.0 - targetOffset, 0.08);
      fanFrame.position.y = THREE.MathUtils.lerp(fanFrame.position.y, 1.15 + targetOffset * 0.8, 0.08);
      ringMesh.position.y = THREE.MathUtils.lerp(ringMesh.position.y, 1.3 + targetOffset * 0.8, 0.08);
      fanBladeGroup.position.y = THREE.MathUtils.lerp(fanBladeGroup.position.y, 1.15 + targetOffset * 0.8, 0.08);

      // Particle update
      const posAttr = particleGeo.getAttribute('position') as THREE.BufferAttribute;
      const colAttr = particleGeo.getAttribute('color') as THREE.BufferAttribute;
      const pos = posAttr.array as Float32Array;
      const cols = colAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        let x = pos[i * 3];
        let y = pos[i * 3 + 1];
        let z = pos[i * 3 + 2];

        // Check if inside chamber (|x| < 0.9 and |z| < 0.9)
        const isInside = Math.abs(x) < 0.95 && Math.abs(z) < 0.95;

        if (isInside) {
          // Particles sucked UP by fan and purified
          y += 0.04 * (speed * 0.8);
          // Swirl
          const angle = Math.atan2(z, x) + 0.08;
          const rad = Math.sqrt(x * x + z * z);
          x = Math.cos(angle) * rad;
          z = Math.sin(angle) * rad;

          // Shift color to clean cyan
          cols[i * 3] = THREE.MathUtils.lerp(cols[i * 3], cleanColor.r, 0.1);
          cols[i * 3 + 1] = THREE.MathUtils.lerp(cols[i * 3 + 1], cleanColor.g, 0.1);
          cols[i * 3 + 2] = THREE.MathUtils.lerp(cols[i * 3 + 2], cleanColor.b, 0.1);

          // Once blown past fan exhaust (y > 3.2), respawn outside as dirty
          if (y > 3.2) {
            y = (Math.random() - 0.5) * 1.8;
            const side = Math.floor(Math.random() * 4);
            if (side === 0) { x = (Math.random() - 0.5) * 2; z = 2.4; }
            else if (side === 1) { x = (Math.random() - 0.5) * 2; z = -2.4; }
            else if (side === 2) { x = 2.4; z = (Math.random() - 0.5) * 2; }
            else { x = -2.4; z = (Math.random() - 0.5) * 2; }

            cols[i * 3] = dirtyColor.r;
            cols[i * 3 + 1] = dirtyColor.g;
            cols[i * 3 + 2] = dirtyColor.b;
          }
        } else {
          // Moving toward center
          x += (x > 0 ? -1 : 1) * 0.015 * (speed * 0.6);
          z += (z > 0 ? -1 : 1) * 0.015 * (speed * 0.6);
        }

        pos[i * 3] = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = z;
      }

      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
      fanFrameGeo.dispose();
      fanFrameMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      hubGeo.dispose();
      hubMat.dispose();
      filterGeo.dispose();
      filterMat.dispose();
      particleGeo.dispose();
      particleMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const estimatedCadr = Math.round(280 + fanSpeed * 55);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="card-chai relative w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between bg-neutral-100 dark:bg-black/30">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-white dark:bg-black/40 text-brand shadow-xs">
              <Wind className="size-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                3D Corsi-Rosenthal filter simulator
                <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-border/40 px-2.5 py-0.5 rounded-full bg-white dark:bg-transparent shadow-xs">Interactive CAD View</span>
              </h3>
              <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Drag to rotate the box and inspect fluid mechanics</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-500 hover:text-foreground p-1 cursor-pointer"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* 3D Viewport & HUD */}
        <div className="relative flex-1 min-h-[380px] bg-black/50">
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Left HUD: CAD Metrics */}
          <div className="absolute top-4 left-4 space-y-2 pointer-events-none">
            <div className="rounded-lg border border-border/40 bg-black/70 backdrop-blur-sm p-3.5 text-xs text-neutral-200 space-y-2 max-w-[210px] shadow-lg">
              <div className="flex items-center justify-between text-white font-bold">
                <span>Clean air delivery</span>
                <span className="font-mono text-sm">{estimatedCadr} CFM</span>
              </div>
              <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-300"
                  style={{ width: `${(estimatedCadr / 550) * 100}%` }}
                />
              </div>
              <div className="text-[11px] text-neutral-300 space-y-1 pt-1 border-t border-border/40">
                <div className="flex justify-between"><span>Filtration grade:</span> <span className="text-white font-mono font-bold">MERV-13</span></div>
                <div className="flex justify-between"><span>PM2.5 capture:</span> <span className="text-emerald-400 font-mono font-bold">92.4%</span></div>
                <div className="flex justify-between"><span>Build cost:</span> <span className="text-white font-mono font-bold">~$28 total</span></div>
              </div>
            </div>
          </div>

          {/* Right Floating Quick Explainer */}
          <div className="absolute top-4 right-4 max-w-xs rounded-lg border border-border/40 bg-black/70 backdrop-blur-sm p-3.5 text-xs text-neutral-200 space-y-1.5 shadow-lg">
            <div className="flex items-center gap-1.5 text-brand font-bold">
              <ShieldCheck className="size-3.5" />
              <span>Fluid dynamics logic</span>
            </div>
            <p className="text-[11px] leading-relaxed text-neutral-300 font-medium">
              Using 4 filters in a cube increases total surface area by 400 percent, reducing backpressure and allowing maximum clean air throughput.
            </p>
          </div>
        </div>

        {/* Interactive Controls Footer */}
        <div className="px-6 py-3.5 bg-neutral-100 dark:bg-black/40 border-t border-border/60 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-300">Fan speed:</span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setFanSpeed(lvl)}
                  className={`size-7 rounded text-xs font-mono font-bold transition-colors cursor-pointer border shadow-xs ${
                    fanSpeed === lvl
                      ? 'border-brand text-brand bg-brand/10'
                      : 'border-neutral-300 dark:border-border/40 bg-white dark:bg-transparent text-neutral-800 dark:text-neutral-400 hover:text-foreground'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsExploded(!isExploded)}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-neutral-300 dark:border-border/50 bg-white dark:bg-black/20 px-3 text-xs font-bold text-neutral-800 dark:text-neutral-300 hover:text-foreground transition-colors cursor-pointer shadow-xs"
            >
              <Layers className="size-3.5" />
              <span>{isExploded ? 'Assemble unit' : 'Exploded CAD view'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsRotating(!isRotating)}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-neutral-300 dark:border-border/50 bg-white dark:bg-black/20 px-3 text-xs font-bold text-neutral-800 dark:text-neutral-300 hover:text-foreground transition-colors cursor-pointer shadow-xs"
            >
              {isRotating ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
              <span>{isRotating ? 'Pause orbit' : 'Auto orbit'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
