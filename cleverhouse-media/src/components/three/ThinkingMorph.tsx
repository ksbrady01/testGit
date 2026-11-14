import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { qualityTier } from "../../lib/webgl";

/**
 * Particles morph from an abstract cloud of thought into structure:
 * THINK (cloud) → DESIGN (wireframe layout) → BUILD (screen) → CONNECT (network) → GROW (rising chart)
 * `progress.v` ranges 0 → 4 and is driven by scroll.
 */
export type MorphProgress = { v: number };

function shapes(n: number) {
  const rnd = (a: number, b: number) => a + Math.random() * (b - a);
  const out: Float32Array[] = [];

  // 0 THINK — soft cloud
  const think = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const r = Math.cbrt(Math.random()) * 1.9;
    const t = Math.random() * Math.PI * 2;
    const p = Math.acos(2 * Math.random() - 1);
    think.set([r * Math.sin(p) * Math.cos(t) * 1.25, r * Math.cos(p) * 1.05, r * Math.sin(p) * Math.sin(t) * 0.9], i * 3);
  }
  out.push(think);

  // 1 DESIGN — wireframe layout outlines
  const rects: [number, number, number, number][] = [
    [-2, 1.4, 4, 0.35], // nav
    [-2, 0.85, 2.3, 1.3], // hero copy block
    [0.5, 0.85, 1.5, 1.3], // hero image
    [-2, -0.7, 1.2, 0.95],
    [-0.6, -0.7, 1.2, 0.95],
    [0.8, -0.7, 1.2, 0.95],
  ];
  const perim = rects.map(([, , w, h]) => 2 * (w + h));
  const total = perim.reduce((a, b) => a + b, 0);
  const design = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    let d = Math.random() * total;
    let k = 0;
    while (k < perim.length - 1 && d > perim[k]!) {
      d -= perim[k]!;
      k++;
    }
    const [x, y, w, h] = rects[k]!;
    let px, py;
    if (d < w) [px, py] = [x + d, y];
    else if (d < w + h) [px, py] = [x + w, y - (d - w)];
    else if (d < 2 * w + h) [px, py] = [x + w - (d - w - h), y - h];
    else [px, py] = [x, y - h + (d - 2 * w - h)];
    design.set([px, py, rnd(-0.03, 0.03)], i * 3);
  }
  out.push(design);

  // 2 BUILD — dense screen grid
  const build = new Float32Array(n * 3);
  const cols = Math.ceil(Math.sqrt(n * 1.6));
  const rows = Math.ceil(n / cols);
  for (let i = 0; i < n; i++) {
    const cx = i % cols;
    const cy = Math.floor(i / cols);
    build.set([-2 + (cx / (cols - 1)) * 4, 1.4 - (cy / Math.max(rows - 1, 1)) * 2.6, 0], i * 3);
  }
  out.push(build);

  // 3 CONNECT — nodes on a ring with links
  type Vec3 = [number, number, number];
  const nodes: Vec3[] = Array.from({ length: 7 }, (_, k): Vec3 => {
    const a = (k / 7) * Math.PI * 2 + 0.3;
    return [Math.cos(a) * 1.8, Math.sin(a) * 1.2, Math.sin(a * 2) * 0.4];
  });
  nodes.push([0, 0, 0]);
  const connect = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    if (i % 3 === 0) {
      const a = nodes[i % nodes.length]!;
      const r = 0.16;
      connect.set([a[0] + rnd(-r, r), a[1] + rnd(-r, r), a[2] + rnd(-r, r)], i * 3);
    } else {
      const a = nodes[i % 7]!;
      const b = (i % 2 ? nodes[7] : nodes[(i + 1) % 7])!;
      const t = Math.random();
      connect.set([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t], i * 3);
    }
  }
  out.push(connect);

  // 4 GROW — rising columns + trend line
  const grow = new Float32Array(n * 3);
  const bars = 7;
  for (let i = 0; i < n; i++) {
    if (i % 5 === 0) {
      const t = Math.random();
      grow.set([-2 + t * 4, -1.2 + Math.pow(t, 1.6) * 2.9 + 0.25, 0.05], i * 3);
    } else {
      const b = i % bars;
      const h = 0.4 + (b / (bars - 1)) * 2.3;
      grow.set([-1.9 + b * 0.62 + rnd(0, 0.38), -1.3 + Math.random() * h, rnd(-0.05, 0.05)], i * 3);
    }
  }
  out.push(grow);
  return out;
}

function Particles({ progress, count }: { progress: MorphProgress; count: number }) {
  const ref = useRef<THREE.Points>(null);
  const targets = useMemo(() => shapes(count), [count]);
  const positions = useMemo(() => new Float32Array(targets[0]!), [targets]);
  const colors = useMemo(() => {
    const c = new Float32Array(count * 3);
    const a = new THREE.Color("#E2B48A");
    const b = new THREE.Color("#9BD8CB");
    const d = new THREE.Color("#B88058");
    for (let i = 0; i < count; i++) {
      const col = i % 11 === 0 ? b : i % 2 ? a : d;
      c.set([col.r, col.g, col.b], i * 3);
    }
    return c;
  }, [count]);
  const smooth = useRef(0);

  useFrame(({ clock }) => {
    smooth.current += (progress.v - smooth.current) * 0.08;
    const p = THREE.MathUtils.clamp(smooth.current, 0, 4);
    const i0 = Math.floor(p);
    const i1 = Math.min(i0 + 1, 4);
    const f = p - i0;
    const e = f * f * (3 - 2 * f);
    const A = targets[i0]!;
    const B = targets[i1]!;
    const t = clock.elapsedTime;
    const attr = ref.current!.geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const jitter = 0.04 * (1 - Math.abs(e - 0.5) * 2) + (i0 === 0 && f < 0.3 ? 0.04 : 0);
    for (let i = 0; i < count * 3; i += 3) {
      const w = Math.sin(t * 0.8 + i) * jitter;
      arr[i] = A[i]! + (B[i]! - A[i]!) * e + w;
      arr[i + 1] = A[i + 1]! + (B[i + 1]! - A[i + 1]!) * e + Math.cos(t * 0.7 + i) * jitter;
      arr[i + 2] = A[i + 2]! + (B[i + 2]! - A[i + 2]!) * e;
    }
    attr.needsUpdate = true;
    ref.current!.rotation.y = Math.sin(t * 0.2) * 0.18 + (p < 1 ? (1 - p) * t * 0.05 : 0);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} vertexColors transparent opacity={0.95} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
    </points>
  );
}

export default function ThinkingMorph({ progress, className }: { progress: MorphProgress; className?: string }) {
  const [count, setCount] = useState(900);
  const [visible, setVisible] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const t = qualityTier();
    setCount(t === "high" ? 2400 : t === "mid" ? 1600 : 900);
    const io = new IntersectionObserver(([e]) => setVisible(!!e?.isIntersecting));
    if (wrap.current) io.observe(wrap.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={wrap} className={className} aria-hidden="true">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 6], fov: 45 }} gl={{ alpha: true, antialias: false }} frameloop={visible ? "always" : "never"}>
        <Particles key={count} progress={progress} count={count} />
      </Canvas>
    </div>
  );
}
