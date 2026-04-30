"use client";

import type { RoleMode } from "@/content/portfolio";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const COLORS: Record<RoleMode, number> = {
  cyber: 0xff4c4c,
  engineering: 0x4c9eff,
  web: 0xa8d9b8,
};

export function RoleParticles({ mode }: { mode: RoleMode }) {
  const mountRef = useRef<HTMLDivElement>(null);
  // Hold material ref so color updates never recreate the WebGL context
  const matRef = useRef<THREE.PointsMaterial | null>(null);

  // Three.js setup — runs once, never on mode change
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const w = mount.clientWidth;
    const h = mount.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const n = 220;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 6;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));

    const mat = new THREE.PointsMaterial({
      color: COLORS[mode],
      size: 0.035,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
    });
    matRef.current = mat;

    const pts = new THREE.Points(geo, mat);
    scene.add(pts);

    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      pts.rotation.y = (t - t0) * 0.00008;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const ro = new ResizeObserver(() => {
      const nw = mount.clientWidth;
      const nh = mount.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    });
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      matRef.current = null;
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Color update — no canvas recreation, just swap the material color
  useEffect(() => {
    if (matRef.current) {
      matRef.current.color.setHex(COLORS[mode]);
    }
  }, [mode]);

  return (
    <div
      ref={mountRef}
      className="pointer-events-none absolute inset-0 opacity-45"
    />
  );
}
