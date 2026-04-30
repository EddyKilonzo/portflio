"use client";

import { allowContinuousWebGL } from "@/lib/motion-gates";
import { getDeviceProfile } from "@/lib/device-profile";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const ACCENT = 0xff4c4c;

type Props = {
  className?: string;
};

export function CyberOrbit({ className = "" }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prof = getDeviceProfile();
    const le = prof.lowEnd;
    const runHeavy = allowContinuousWebGL(prof) && !reducedMotion;

    const w = Math.max(1, mount.clientWidth);
    const h = Math.max(1, mount.clientHeight);
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 50);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: !le, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, le ? 1 : 1.75));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.1, 1),
      new THREE.MeshBasicMaterial({ color: ACCENT, wireframe: true }),
    );
    group.add(core);

    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(1.55, 0.04, 12, 48),
      new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.45 }),
    );
    halo.rotation.x = Math.PI / 2.4;
    group.add(halo);

    const orbitRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.0, 0.02, 8, 64),
      new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.15 }),
    );
    orbitRing.rotation.x = Math.PI / 5;
    group.add(orbitRing);

    // Mouse tracking
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMouseMove = (e: MouseEvent) => {
      if (!runHeavy) return;
      const rect = mount.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      targetX = ((e.clientX - cx) / (rect.width / 2)) * 0.5;
      targetY = ((e.clientY - cy) / (rect.height / 2)) * -0.5;
    };

    const onMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    mount.addEventListener("mousemove", onMouseMove);
    mount.addEventListener("mouseleave", onMouseLeave);

    let docHidden = document.hidden;
    const onVis = () => { docHidden = document.hidden; };
    document.addEventListener("visibilitychange", onVis);

    const clock = new THREE.Clock();
    let raf = 0;

    const tick = () => {
      if (!docHidden) {
        if (runHeavy) {
          const t = clock.getElapsedTime();
          // Smooth lerp toward mouse
          currentX += (targetX - currentX) * 0.06;
          currentY += (targetY - currentY) * 0.06;
          group.rotation.y = t * 0.22 + currentX;
          group.rotation.x = Math.sin(t * 0.15) * 0.12 + currentY;
          halo.rotation.z = t * 0.35;
        }
        renderer.render(scene, camera);
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onResize = () => {
      const nw = Math.max(1, mount.clientWidth);
      const nh = Math.max(1, mount.clientHeight);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      mount.removeEventListener("mousemove", onMouseMove);
      mount.removeEventListener("mouseleave", onMouseLeave);
      ro.disconnect();
      core.geometry.dispose();
      (core.material as THREE.Material).dispose();
      halo.geometry.dispose();
      (halo.material as THREE.Material).dispose();
      orbitRing.geometry.dispose();
      (orbitRing.material as THREE.Material).dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [reducedMotion]);

  return (
    <div
      ref={mountRef}
      className={`select-none ${className}`}
      aria-hidden
    />
  );
}
