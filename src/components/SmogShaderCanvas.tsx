'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface SmogShaderCanvasProps {
  aqi: number;
  inversionStrength: 'Low' | 'Moderate' | 'Severe' | 'Critical';
}

export const SmogShaderCanvas: React.FC<SmogShaderCanvasProps> = ({ aqi, inversionStrength }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 300;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Number of particles proportional to AQI
    const particleCount = Math.min(Math.max(aqi * 12, 1200), 5500);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const randomSeeds = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Concentrate particles closer to ground (y < 0) when inversion is severe
      const spreadY = inversionStrength === 'Critical' || inversionStrength === 'Severe' ? 1.6 : 3.8;
      const x = (Math.random() - 0.5) * 12;
      const y = (Math.random() * 2 - 1.4) * spreadY;
      const z = (Math.random() - 0.5) * 10;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      randomSeeds[i * 3] = Math.random();
      randomSeeds[i * 3 + 1] = Math.random();
      randomSeeds[i * 3 + 2] = Math.random();

      sizes[i] = Math.random() * 4.0 + 1.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(randomSeeds, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

    // Custom GLSL Shaders for atmospheric aerosol scattering
    const vertexShader = `
      uniform float uTime;
      uniform float uAqi;
      uniform vec2 uMouse;
      attribute vec3 aSeed;
      attribute float aSize;
      varying float vAltitude;
      varying vec3 vPosition;

      void main() {
        vec3 pos = position;
        
        // Browninan winter smog drift & gentle thermal updraft
        float driftX = sin(uTime * 0.4 + aSeed.x * 6.28) * 0.4;
        float driftZ = cos(uTime * 0.35 + aSeed.z * 6.28) * 0.4;
        
        // Cold inversion lid effect: particles trapped below ceiling
        float inversionCeiling = 0.5;
        if (pos.y > inversionCeiling) {
          pos.y = inversionCeiling - abs(sin(uTime * 0.2 + aSeed.y)) * 0.3;
        }

        pos.x += driftX;
        pos.z += driftZ;

        // Subtle mouse turbulence
        float distToMouse = length(pos.xy - uMouse * 4.0);
        pos.xy += normalize(pos.xy - uMouse * 4.0 + 0.001) * exp(-distToMouse * 0.8) * 0.4;

        vAltitude = pos.y;
        vPosition = pos;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = (aSize * (1.0 + (uAqi / 300.0))) * (12.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      uniform float uAqi;
      varying float vAltitude;
      varying vec3 vPosition;

      void main() {
        // Soft circular particle profile
        vec2 center = gl_PointCoord - vec2(0.5);
        float dist = length(center);
        if (dist > 0.5) discard;

        float alpha = smoothstep(0.5, 0.0, dist) * 0.65;

        // Color grading according to AQI and Altitude
        // Low altitude = trapped soot / PM2.5 (brown/amber/crimson)
        // High altitude = cleaner troposphere
        vec3 cleanColor = vec3(0.06, 0.72, 0.53); // Emerald mint
        vec3 moderateColor = vec3(0.95, 0.65, 0.15); // Smog amber
        vec3 severeColor = vec3(0.88, 0.11, 0.28); // Toxic crimson
        vec3 darkSoot = vec3(0.2, 0.18, 0.2); // Carbon soot

        vec3 particleColor;
        if (uAqi < 100.0) {
          particleColor = mix(cleanColor, moderateColor, uAqi / 100.0);
        } else if (uAqi < 250.0) {
          particleColor = mix(moderateColor, severeColor, (uAqi - 100.0) / 150.0);
        } else {
          // Severe smog: mix crimson with dark soot
          particleColor = mix(severeColor, darkSoot, clamp(-vAltitude * 0.4, 0.0, 0.6));
        }

        gl_FragColor = vec4(particleColor, alpha);
      }
    `;

    const uniforms = {
      uTime: { value: 0 },
      uAqi: { value: aqi },
      uMouse: { value: new THREE.Vector2(0, 0) }
    };

    const shaderMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(geometry, shaderMaterial);
    scene.add(particleSystem);

    // Inversion Layer Boundary Plane (Visualizes the cold-air lid)
    const planeGeo = new THREE.PlaneGeometry(14, 8);
    const planeMat = new THREE.MeshBasicMaterial({
      color: aqi > 200 ? 0xff3366 : 0x10b981,
      transparent: true,
      opacity: 0.07,
      side: THREE.DoubleSide
    });
    const inversionPlane = new THREE.Mesh(planeGeo, planeMat);
    inversionPlane.rotation.x = Math.PI / 2.3;
    inversionPlane.position.y = 0.5;
    scene.add(inversionPlane);

    // Mouse & Touch tracking
    const mouse = new THREE.Vector2();
    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      uniforms.uMouse.value.copy(mouse);
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        const rect = container.getBoundingClientRect();
        mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
        uniforms.uMouse.value.copy(mouse);
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      uniforms.uTime.value = elapsedTime;
      uniforms.uAqi.value = aqi;

      // Gentle scene tilt
      particleSystem.rotation.y = elapsedTime * 0.03 + mouse.x * 0.15;
      particleSystem.rotation.x = mouse.y * 0.08;

      inversionPlane.position.y = 0.4 + Math.sin(elapsedTime * 0.8) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      shaderMaterial.dispose();
      planeGeo.dispose();
      planeMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [aqi, inversionStrength]);

  return (
    <div className="relative w-full h-full min-h-[280px] rounded-2xl overflow-hidden pointer-events-auto">
      <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />
      
      {/* 3D Simulation Overlay HUD */}
      <div className="absolute top-3 left-3 pointer-events-none flex items-center space-x-2 text-xs bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-500/20 text-emerald-300">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
        <span className="font-medium tracking-wide">Live Atmospheric Boundary Model</span>
      </div>

      <div className="absolute bottom-3 right-3 pointer-events-none text-xs bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-neutral-300">
        <span>Interactive: Drag to inspect aerosol dispersal</span>
      </div>
    </div>
  );
};
