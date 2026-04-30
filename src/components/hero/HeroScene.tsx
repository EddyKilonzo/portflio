"use client";

import { allowContinuousWebGL } from "@/lib/motion-gates";
import { getDeviceProfile } from "@/lib/device-profile";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const SURFACE_MID = 0x2e7a5a;
const BG = 0x0d1f1a;

const vertexAurora = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentAurora = `
uniform float uTime;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

void main() {
  vec2 p = vUv * 2.0 - 1.0;
  float a = sin(p.x * 3.0 + uTime * 0.4) * 0.5 + 0.5;
  float b = cos(p.y * 2.0 - uTime * 0.35) * 0.5 + 0.5;
  vec3 c1 = vec3(0.11, 0.31, 0.23);
  vec3 c2 = vec3(0.18, 0.48, 0.35);
  vec3 c3 = vec3(0.66, 0.85, 0.72);
  vec3 col = mix(c1, c2, a);
  col = mix(col, c3, b * 0.35);
  float edge = smoothstep(1.0, 0.2, length(p));
  float grain = (hash(vUv * 900.0 + uTime * 0.08) - 0.5) * 0.045;
  col += grain;
  gl_FragColor = vec4(col, 0.38 * edge);
}
`;

type Props = {
  className?: string;
  scrollProgressRef: React.MutableRefObject<number>;
  lowEnd?: boolean;
  /** When true, freezes time-based motion; only scroll-driven camera remains. */
  reducedMotion?: boolean;
};

export function HeroScene({
  className = "",
  scrollProgressRef,
  lowEnd = false,
  reducedMotion = false,
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prof = getDeviceProfile();
    const le = lowEnd || prof.lowEnd;
    const runHeavy = allowContinuousWebGL(prof) && !reducedMotion;

    const w = mount.clientWidth;
    const h = mount.clientHeight;
    const scene = new THREE.Scene();
    // No scene.background — transparent canvas so the page shows through

    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ antialias: !le, alpha: true });
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, le ? 1 : 2));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const geo = new THREE.IcosahedronGeometry(1.15, 1);
    const wire = new THREE.MeshBasicMaterial({
      color: SURFACE_MID,
      wireframe: true,
    });
    const mesh = new THREE.Mesh(geo, wire);
    group.add(mesh);

    const particleCount = le ? 800 : 2200;
    const positions = new Float32Array(particleCount * 3);
    const base = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 14;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 8;
      base[i * 3] = x;
      base[i * 3 + 1] = y;
      base[i * 3 + 2] = z;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: SURFACE_MID,
      size: le ? 0.04 : 0.035,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    const points = new THREE.Points(pGeo, pMat);
    group.add(points);

    const auroraGeo = new THREE.PlaneGeometry(20, 12);
    const auroraMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: vertexAurora,
      fragmentShader: fragmentAurora,
      transparent: true,
      depthWrite: false,
    });
    const aurora = new THREE.Mesh(auroraGeo, auroraMat);
    aurora.position.z = -4;
    scene.add(aurora);

    const blobGeo = new THREE.SphereGeometry(0.9, 24, 24);
    const blobs = [0xa8d9b8, 0x2e7a5a, 0x1e4a3a].map((hex, i) => {
      const m = new THREE.MeshBasicMaterial({
        color: hex,
        transparent: true,
        opacity: 0.12,
      });
      const b = new THREE.Mesh(blobGeo, m);
      b.scale.setScalar(1.4 + i * 0.35);
      b.position.set((i - 1) * 2.5, (i % 2) * 1.2 - 0.5, -2 - i * 0.5);
      scene.add(b);
      return b;
    });

    const mouse = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      if (!runHeavy) return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      gsap.to(group.rotation, {
        x: mouse.y * 0.12,
        y: mouse.x * 0.18,
        duration: 0.8,
        ease: "power2.out",
        overwrite: "auto",
      });
    };
    if (runHeavy) {
      window.addEventListener("pointermove", onMove);
    }

    let docHidden = document.hidden;
    const onVis = () => {
      docHidden = document.hidden;
    };
    document.addEventListener("visibilitychange", onVis);

    const clock = new THREE.Clock();
    let raf = 0;

    const tick = () => {
      if (!docHidden) {
        const t = runHeavy ? clock.getElapsedTime() : 0;
        auroraMat.uniforms.uTime.value = t;
        if (runHeavy) {
          mesh.rotation.y = t * 0.15;
          mesh.rotation.x = t * 0.08;
        } else {
          mesh.rotation.y = 0;
          mesh.rotation.x = 0;
        }

        const mx = mouse.x * 3;
        const my = mouse.y * 2;
        blobs.forEach((b, i) => {
          if (runHeavy) {
            b.position.x =
              (i - 1) * 2.5 + Math.sin(t * 0.2 + i) * 0.4 + mx * 0.15;
            b.position.y =
              (i % 2) * 1.2 + Math.cos(t * 0.25 + i * 0.5) * 0.35 + my * 0.12;
          } else {
            b.position.x = (i - 1) * 2.5;
            b.position.y = (i % 2) * 1.2 - 0.5;
          }
        });

        const posAttr = pGeo.getAttribute("position") as THREE.BufferAttribute;
        const arr = posAttr.array as Float32Array;
        if (runHeavy) {
          for (let i = 0; i < particleCount; i++) {
            const bx = base[i * 3]!;
            const by = base[i * 3 + 1]!;
            const bz = base[i * 3 + 2]!;
            const dx = bx - mx * 4;
            const dy = by - my * 3;
            const dz = bz;
            const len = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.01;
            const push = Math.min(1.8 / len, 0.8);
            arr[i * 3] = bx + (dx / len) * push * 0.35;
            arr[i * 3 + 1] = by + (dy / len) * push * 0.35;
            arr[i * 3 + 2] = bz + (dz / len) * push * 0.15;
          }
          posAttr.needsUpdate = true;
        }

        const sp = scrollProgressRef.current;
        camera.position.z = 6 - sp * 2;
        group.scale.setScalar(1 - sp * 0.35);

        renderer.render(scene, camera);
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onResize = () => {
      const nw = mount.clientWidth;
      const nh = mount.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      if (runHeavy) {
        window.removeEventListener("pointermove", onMove);
      }
      ro.disconnect();
      geo.dispose();
      wire.dispose();
      pGeo.dispose();
      pMat.dispose();
      auroraGeo.dispose();
      auroraMat.dispose();
      blobGeo.dispose();
      blobs.forEach((b) => (b.material as THREE.Material).dispose());
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [lowEnd, reducedMotion, scrollProgressRef]);

  return <div ref={mountRef} className={`absolute inset-0 ${className}`} />;
}
