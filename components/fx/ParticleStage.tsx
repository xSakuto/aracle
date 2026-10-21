"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { buildShape, type ShapeName } from "./shapes";

// Wie sich jede Form im Raum hält: Drehung, Neigung, Grösse.
const POSE: Record<ShapeName, { spin: number; tilt: number; scale: number }> = {
  sphere: { spin: 0.0016, tilt: 0.25, scale: 1 },
  word: { spin: 0, tilt: 0, scale: 1 },
  mountains: { spin: 0.0006, tilt: 0.42, scale: 1 },
  wheel: { spin: 0.0035, tilt: 0.55, scale: 1 },
  racks: { spin: 0.0012, tilt: 0.18, scale: 1 },
  helix: { spin: 0.004, tilt: 0.1, scale: 1 },
  room: { spin: 0.002, tilt: 0.45, scale: 0.95 },
  wave: { spin: 0.0005, tilt: 0.55, scale: 1 },
};

const VERT = /* glsl */ `
  attribute float aRand;
  uniform float uTime;
  uniform float uTurb;
  uniform float uSize;
  uniform float uPixel;
  varying float vRand;
  varying float vDepth;
  void main() {
    vec3 p = position;
    float t = uTime * 0.6 + aRand * 6.2831;
    // Atmen plus Unruhe, die mit der Scrollgeschwindigkeit wächst
    p += vec3(sin(t + p.y * 1.7), cos(t * 0.9 + p.x * 1.3), sin(t * 1.1 + p.z)) * (0.025 + uTurb * 0.35) ;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixel * (0.55 + aRand * 0.9) * (6.0 / -mv.z);
    vRand = aRand;
    vDepth = clamp((-mv.z - 4.0) / 6.0, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vRand;
  varying float vDepth;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float soft = smoothstep(0.5, 0.0, d);
    vec3 col = mix(uColorA, uColorB, step(0.82, vRand));
    float a = soft * mix(1.0, 0.45, vDepth);
    gl_FragColor = vec4(col, a);
  }
`;

export default function ParticleStage() {
  const hostRef = useRef<HTMLDivElement>(null);
  const api = useRef<{ setShape: (s: ShapeName, side: number) => void } | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = innerWidth < 768;
    const N = small ? 5000 : 12000;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // Kein WebGL: die Seite funktioniert auch ohne.
    }
    const dpr = Math.min(devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setSize(innerWidth, innerHeight);
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100);
    camera.position.set(0, 0, 9);

    const cache = new Map<ShapeName, Float32Array>();
    const get = (s: ShapeName) => {
      if (!cache.has(s)) cache.set(s, buildShape(s, N));
      return cache.get(s)!;
    };

    // Start: eine weite Streuung, die sich zur ersten Form zusammenzieht.
    const cur = new Float32Array(N * 3);
    for (let i = 0; i < N * 3; i++) cur[i] = (Math.random() - 0.5) * 18;
    let target = get("sphere");
    const speed = new Float32Array(N);
    const rnd = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      rnd[i] = Math.random();
      speed[i] = 0.018 + Math.random() * 0.05;
    }

    const geo = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(cur, 3);
    posAttr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute("position", posAttr);
    geo.setAttribute("aRand", new THREE.BufferAttribute(rnd, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uTurb: { value: 0 },
        uSize: { value: small ? 3.2 : 3.1 },
        uPixel: { value: dpr },
        uColorA: { value: new THREE.Color("#00ffff") },
        uColorB: { value: new THREE.Color("#ffffff") },
      },
    });
    const points = new THREE.Points(geo, mat);
    const group = new THREE.Group();
    group.add(points);
    scene.add(group);

    let shape: ShapeName = "sphere";
    let side = 0;
    let sideNow = 0;
    let tiltNow = POSE.sphere.tilt;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let lastScroll = scrollY;
    let turb = 0;

    api.current = {
      setShape(s, sd) {
        if (s === shape && sd === side) return;
        shape = s;
        side = small ? 0 : sd;
        target = get(s);
        if (reduce) cur.set(target);
        // Ein kleiner Stoss beim Formwechsel
        turb = Math.min(1, turb + 0.35);
      },
    };

    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / innerWidth) * 2 - 1;
      mouse.ty = (e.clientY / innerHeight) * 2 - 1;
    };
    const onResize = () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    };
    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("resize", onResize);

    let raf = 0;
    let running = true;
    const clock = new THREE.Timer();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!running) return;
      clock.update();
      const dt = Math.min(clock.getDelta(), 0.05) * 60;
      const t = clock.getElapsed();

      // Partikel fliessen versetzt zur Zielform
      if (!reduce) {
        for (let i = 0; i < N; i++) {
          const k = speed[i] * dt;
          const j = i * 3;
          cur[j] += (target[j] - cur[j]) * k;
          cur[j + 1] += (target[j + 1] - cur[j + 1]) * k;
          cur[j + 2] += (target[j + 2] - cur[j + 2]) * k;
        }
        posAttr.needsUpdate = true;
      }

      // Scrollgeschwindigkeit wird zu Unruhe
      const sv = Math.abs(scrollY - lastScroll);
      lastScroll = scrollY;
      turb += (Math.min(sv / 60, 1) - turb) * 0.08;
      mat.uniforms.uTurb.value = reduce ? 0 : turb;
      mat.uniforms.uTime.value = reduce ? 0 : t;

      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      const pose = POSE[shape];
      sideNow += (side - sideNow) * 0.04;
      tiltNow += (pose.tilt - tiltNow) * 0.04;
      if (!reduce) group.rotation.y += pose.spin * dt;
      if (shape === "word") group.rotation.y += (0 - group.rotation.y) * 0.05;
      group.rotation.x = tiltNow + mouse.y * 0.15;
      points.rotation.y = mouse.x * 0.25;
      group.position.x = sideNow * 2.6;
      // Auf schmalen Bildschirmen die Form einpassen
      const fit = Math.min(1, camera.aspect * (shape === "word" ? 1.25 : 1.7));
      group.scale.setScalar(pose.scale * fit);

      renderer.render(scene, camera);
    };
    tick();

    const onVis = () => {
      running = !document.hidden;
      clock.reset();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", onMove);
      removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      api.current = null;
    };
  }, []);

  // Abschnitte melden ihre Form, sobald sie die Bildschirmmitte erreichen.
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-shape]"));
    if (!els.length) {
      api.current?.setShape("sphere", 0);
      return;
    }
    const pick = (el: HTMLElement) => {
      const s = el.dataset.shape as ShapeName;
      const side = el.dataset.shapeSide === "right" ? 1 : el.dataset.shapeSide === "left" ? -1 : 0;
      api.current?.setShape(s, side);
    };
    pick(els[0]);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) pick(e.target as HTMLElement);
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return <div ref={hostRef} className="fx-stage" />;
}
