import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { qualityTier } from "@/lib/webgl";

export type Intensity = { v: number; scroll: number };

const COPPER = new THREE.Color("#E2B48A");
const COPPER_DEEP = new THREE.Color("#B88058");
const PATINA = new THREE.Color("#9BD8CB");

function dotTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.25, "rgba(255,255,255,0.85)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Drifting "thought" particles — a soft volumetric cloud around the thinker's head. */
function Thoughts({ count, intensity }: { count: number; intensity: Intensity }) {
  const points = useRef<THREE.Points>(null);
  const mat = useRef<THREE.PointsMaterial>(null);
  const { positions, base, colors, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const base = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // biased toward a shell around the head, streaming upward
      const r = 0.8 + Math.pow(Math.random(), 0.6) * 3.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta) * 1.4;
      const y = r * Math.cos(phi) * 0.9 + 0.4;
      const z = r * Math.sin(phi) * Math.sin(theta) * 0.8;
      base.set([x, y, z], i * 3);
      positions.set([x, y, z], i * 3);
      const c = Math.random() > 0.9 ? PATINA : Math.random() > 0.5 ? COPPER : COPPER_DEEP;
      colors.set([c.r, c.g, c.b], i * 3);
      speeds[i] = 0.2 + Math.random() * 0.8;
    }
    return { positions, base, colors, speeds };
  }, [count]);
  const tex = useMemo(() => dotTexture(), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const arr = points.current!.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const s = speeds[i];
      const i3 = i * 3;
      arr[i3] = base[i3] + Math.sin(t * 0.3 * s + i) * 0.12;
      arr[i3 + 1] = base[i3 + 1] + ((t * 0.08 * s + i * 0.37) % 2.4) * 0.35 - 0.4 + intensity.scroll * 1.6 * s;
      arr[i3 + 2] = base[i3 + 2] + Math.cos(t * 0.25 * s + i) * 0.12;
    }
    points.current!.geometry.attributes.position.needsUpdate = true;
    points.current!.rotation.y = t * 0.03;
    if (mat.current) mat.current.opacity = 0.9 * intensity.v * (1 - intensity.scroll * 0.7);
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={mat}
        size={0.055}
        map={tex}
        vertexColors
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

/** A floating wireframe form — the raw shape of an idea. */
function Form({
  geometry,
  position,
  speed = 1,
  scale = 1,
  color = "#CF9A6A",
  intensity,
  delay = 0,
}: {
  geometry: THREE.BufferGeometry;
  position: [number, number, number];
  speed?: number;
  scale?: number;
  color?: string;
  intensity: Intensity;
  delay?: number;
}) {
  const ref = useRef<THREE.LineSegments>(null);
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry, 1), [geometry]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed;
    const m = ref.current!;
    m.rotation.x = t * 0.25;
    m.rotation.y = t * 0.35;
    m.position.y = position[1] + Math.sin(t * 0.8) * 0.12 + intensity.scroll * 0.8;
    const appear = THREE.MathUtils.clamp((intensity.v - delay) / (1 - delay + 0.0001), 0, 1);
    m.scale.setScalar(scale * (0.6 + 0.4 * appear));
    (m.material as THREE.LineBasicMaterial).opacity = appear * 0.75 * (1 - intensity.scroll);
  });
  return (
    <lineSegments ref={ref} position={position} geometry={edges}>
      <lineBasicMaterial color={color} transparent opacity={0} />
    </lineSegments>
  );
}

/** A small "interface" panel — wireframe website fragment. */
function Panel({ position, rotation, intensity }: { position: [number, number, number]; rotation: [number, number, number]; intensity: Intensity }) {
  const ref = useRef<THREE.Group>(null);
  const geo = useMemo(() => {
    const pts: number[] = [];
    const rect = (x: number, y: number, w: number, h: number) => {
      pts.push(x, y, 0, x + w, y, 0, x + w, y, 0, x + w, y - h, 0, x + w, y - h, 0, x, y - h, 0, x, y - h, 0, x, y, 0);
    };
    rect(-0.8, 0.5, 1.6, 1);
    pts.push(-0.8, 0.38, 0, 0.8, 0.38, 0); // browser bar
    rect(-0.7, 0.28, 0.8, 0.12);
    rect(-0.7, 0.1, 0.55, 0.06);
    rect(-0.7, -0.05, 0.4, 0.16);
    rect(0.2, 0.28, 0.5, 0.6);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const g = ref.current!;
    g.position.y = position[1] + Math.sin(t * 0.6) * 0.08 + intensity.scroll * 1.2;
    g.rotation.y = rotation[1] + Math.sin(t * 0.4) * 0.12;
    const appear = THREE.MathUtils.clamp((intensity.v - 0.4) / 0.6, 0, 1);
    ((g.children[0] as THREE.LineSegments).material as THREE.LineBasicMaterial).opacity = appear * 0.7 * (1 - intensity.scroll);
  });
  return (
    <group ref={ref} position={position} rotation={rotation}>
      <lineSegments geometry={geo}>
        <lineBasicMaterial color="#E2B48A" transparent opacity={0} />
      </lineSegments>
    </group>
  );
}

/** Connected idea nodes. */
function Network({ intensity, offset }: { intensity: Intensity; offset: [number, number, number] }) {
  const group = useRef<THREE.Group>(null);
  const lineMat = useRef<THREE.LineBasicMaterial>(null);
  const dotMat = useRef<THREE.MeshBasicMaterial>(null);
  const nodes = useMemo(
    () =>
      [
        [-1.9, 1.5, 0.2],
        [-1.1, 2.1, -0.4],
        [0.2, 2.35, 0.1],
        [1.5, 1.8, -0.3],
        [2.1, 0.6, 0.3],
        [-2.2, 0.1, -0.2],
        [1.7, -0.6, 0.2],
      ] as [number, number, number][],
    [],
  );
  const lineGeo = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      const b = nodes[(i + 1) % nodes.length];
      pts.push(...a, ...b);
      if (i % 2 === 0) pts.push(...a, 0, 0.6, 0); // spokes to the mind
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, [nodes]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    group.current!.rotation.y = Math.sin(t * 0.15) * 0.25;
    group.current!.position.y = offset[1] + intensity.scroll * 1.4;
    const a = THREE.MathUtils.clamp((intensity.v - 0.55) / 0.45, 0, 1) * (1 - intensity.scroll);
    if (lineMat.current) lineMat.current.opacity = a * 0.28;
    if (dotMat.current) dotMat.current.opacity = a;
  });
  return (
    <group ref={group} position={offset}>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial ref={lineMat} color="#CF9A6A" transparent opacity={0} />
      </lineSegments>
      {nodes.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[i % 3 === 0 ? 0.05 : 0.032, 12, 12]} />
          <meshBasicMaterial ref={i === 0 ? dotMat : undefined} color={i === 4 ? "#9BD8CB" : "#EDCDAE"} transparent opacity={0} />
        </mesh>
      ))}
    </group>
  );
}

function Rig({ center }: { center: THREE.Vector3 }) {
  const { camera, pointer } = useThree();
  useFrame(() => {
    camera.position.x += (pointer.x * 0.6 - camera.position.x) * 0.035;
    camera.position.y += (pointer.y * 0.35 + 0.2 - camera.position.y) * 0.035;
    camera.lookAt(center);
  });
  return null;
}

/** Keeps the second node material in sync (all spheres share opacity via traversal). */
function SyncNodeOpacity() {
  const { scene } = useThree();
  useFrame(() => {
    let master: number | null = null;
    scene.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.MeshBasicMaterial | undefined;
      if ((o as THREE.Mesh).isMesh && m && m.transparent) {
        if (master === null) master = m.opacity;
        else m.opacity = master;
      }
    });
  });
  return null;
}

export default function IdeaField({ intensity, className }: { intensity: Intensity; className?: string }) {
  const [tier, setTier] = useState<"low" | "mid" | "high">("low");
  const [wide, setWide] = useState(true);
  const [visible, setVisible] = useState(true);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTier(qualityTier());
    const mq = window.matchMedia("(min-width: 1024px)");
    const upd = () => setWide(mq.matches);
    upd();
    mq.addEventListener("change", upd);
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    if (wrap.current) io.observe(wrap.current);
    return () => {
      mq.removeEventListener("change", upd);
      io.disconnect();
    };
  }, []);

  const count = tier === "high" ? 2200 : tier === "mid" ? 1400 : 650;
  // Head of the thinker sits right-of-center on desktop, centered on mobile.
  const [aspect, setAspect] = useState(1.6);
  useEffect(() => {
    const r = () => setAspect(window.innerWidth / window.innerHeight);
    r();
    window.addEventListener("resize", r);
    return () => window.removeEventListener("resize", r);
  }, []);
  const cx = wide ? Math.min(2.1, aspect * 1.15) : 0;
  const cy = wide ? 0.5 : 1.1;
  const center = useMemo(() => new THREE.Vector3(cx * 0.4, cy * 0.5, 0), [cx, cy]);
  const geos = useMemo(
    () => ({
      ico: new THREE.IcosahedronGeometry(0.42, 1),
      oct: new THREE.OctahedronGeometry(0.32, 0),
      torus: new THREE.TorusGeometry(0.34, 0.012, 6, 48),
      box: new THREE.BoxGeometry(0.42, 0.42, 0.42),
    }),
    [],
  );

  return (
    <div ref={wrap} className={className} aria-hidden="true">
      <Canvas
        dpr={[1, tier === "high" ? 1.75 : 1.25]}
        camera={{ position: [0, 0.2, 7], fov: 42 }}
        gl={{ antialias: tier !== "low", alpha: true, powerPreference: "high-performance" }}
        frameloop={visible ? "always" : "never"}
        style={{ pointerEvents: "none" }}
      >
        <Rig center={center} />
        <group position={[cx, cy - 0.4, 0]}>
          <Thoughts count={count} intensity={intensity} />
        </group>
        <Network intensity={intensity} offset={[cx, cy - 0.6, -0.5]} />
        <Form geometry={geos.ico} position={[cx - 2.9, cy + 1.1, 0.4]} intensity={intensity} delay={0.3} />
        <Form geometry={geos.oct} position={[cx + 2.1, cy + 1.6, -0.6]} intensity={intensity} speed={1.4} delay={0.45} color="#9BD8CB" />
        <Form geometry={geos.torus} position={[cx + 2.4, cy - 1.2, 0.5]} intensity={intensity} speed={0.8} delay={0.5} />
        <Form geometry={geos.box} position={[cx - 2.4, cy - 1.5, -0.2]} intensity={intensity} speed={0.6} delay={0.6} scale={0.9} />
        {wide && aspect > 1.5 && <Panel position={[cx + 2.3, cy + 0.3, -1]} rotation={[0, -0.5, 0]} intensity={intensity} />}
        <SyncNodeOpacity />
      </Canvas>
    </div>
  );
}
