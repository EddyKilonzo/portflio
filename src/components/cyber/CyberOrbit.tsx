"use client";

import { allowContinuousWebGL } from "@/lib/motion-gates";
import { getDeviceProfile } from "@/lib/device-profile";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const ACCENT = 0xff4c4c;
const DEEP = 0x1a0f12;

type Props = {
  className?: string;
};

/**
 * Lightweight secondary WebGL accent for the cyber section (not the hero).
 * Respects reduced motion / low-end: static frame only. Pauses when tab hidden.
 */
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
    scene.background = new THREE.Color(DEEP);

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 50);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: !le, alpha: false });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, le ? 1 : 1.75));
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
      new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.35 }),
    );
    halo.rotation.x = Math.PI / 2.4;
    group.add(halo);

    const light = new THREE.PointLight(0xff8888, 1.2, 20);
    light.position.set(2, 3, 4);
    scene.add(light);

    let docHidden = document.hidden;
    const onVis = () => {
      docHidden = document.hidden;
    };
    document.addEventListener("visibilitychange", onVis);

    const clock = new THREE.Clock();
    let raf = 0;

    const tick = () => {
      if (!docHidden) {
        if (runHeavy) {
          const t = clock.getElapsedTime();
          group.rotation.y = t * 0.22;
          group.rotation.x = Math.sin(t * 0.15) * 0.12;
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
      ro.disconnect();
      core.geometry.dispose();
      (core.material as THREE.Material).dispose();
      halo.geometry.dispose();
      (halo.material as THREE.Material).dispose();
      light.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [reducedMotion]);

  return (
    <div
      ref={mountRef}
      className={`pointer-events-none select-none ${className}`}
      aria-hidden
    />
  );
}
