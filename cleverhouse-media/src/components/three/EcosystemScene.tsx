import { Canvas, useFrame, useLoader, type ThreeEvent } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type Node = { id: string; label: string };

function labelTexture(text: string) {
  const c = document.createElement("canvas");
  const s = 2;
  c.width = 512 * s;
  c.height = 128 * s;
  const g = c.getContext("2d")!;
  g.scale(s, s);
  g.font = "500 44px 'Space Grotesk', ui-sans-serif, system-ui";
  g.fillStyle = "#F4EDE4";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(text, 256, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function Hub() {
  const tex = useLoader(THREE.TextureLoader, "/brand/chm-mark.png");
  tex.colorSpace = THREE.SRGBColorSpace;
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    ref.current!.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.35;
  });
  return (
    <group ref={ref}>
      <mesh>
        <planeGeometry args={[0.95, 1.07]} />
        <meshBasicMaterial map={tex} transparent side={THREE.DoubleSide} />
      </mesh>
      <mesh>
        <ringGeometry args={[0.9, 0.915, 96]} />
        <meshBasicMaterial color="#B88058" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Pulse({ from, to, speed, offset, color }: { from: THREE.Vector3; to: THREE.Vector3; speed: number; offset: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = (clock.elapsedTime * speed + offset) % 1;
    ref.current!.position.lerpVectors(from, to, t);
    (ref.current!.material as THREE.MeshBasicMaterial).opacity = Math.sin(t * Math.PI);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.035, 10, 10]} />
      <meshBasicMaterial color={color} transparent />
    </mesh>
  );
}

function Network({ nodes, active, onSelect }: { nodes: readonly Node[]; active: number; onSelect: (i: number) => void }) {
  const group = useRef<THREE.Group>(null);
  const [hover, setHover] = useState<number | null>(null);
  const positions = useMemo(
    () =>
      nodes.map((_, i) => {
        const a = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
        return new THREE.Vector3(Math.cos(a) * 2.6, Math.sin(a) * 1.55, Math.sin(a * 2) * 0.6);
      }),
    [nodes],
  );
  const labels = useMemo(() => nodes.map((n) => labelTexture(n.label)), [nodes]);
  const center = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const spokes = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pts: number[] = [];
    positions.forEach((p) => pts.push(0, 0, 0, p.x, p.y, p.z));
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, [positions]);
  const ring = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pts: number[] = [];
    positions.forEach((p, i) => {
      const q = positions[(i + 1) % positions.length];
      pts.push(p.x, p.y, p.z, q.x, q.y, q.z);
      if (i % 2 === 0) {
        const r = positions[(i + 2) % positions.length];
        pts.push(p.x, p.y, p.z, r.x, r.y, r.z);
      }
    });
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, [positions]);
  const activeLine = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, 0], 3));
    return g;
  }, []);

  useFrame(({ clock, pointer }) => {
    const g = group.current!;
    g.rotation.y += ((pointer.x * 0.35 + Math.sin(clock.elapsedTime * 0.15) * 0.15) - g.rotation.y) * 0.04;
    g.rotation.x += (-pointer.y * 0.2 - g.rotation.x) * 0.04;
    const p = positions[active];
    const arr = activeLine.attributes.position.array as Float32Array;
    arr[3] = p.x;
    arr[4] = p.y;
    arr[5] = p.z;
    activeLine.attributes.position.needsUpdate = true;
  });

  useEffect(() => {
    document.body.style.cursor = hover !== null ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hover]);

  return (
    <group ref={group}>
      <Suspense fallback={null}>
        <Hub />
      </Suspense>
      <lineSegments geometry={spokes}>
        <lineBasicMaterial color="#B88058" transparent opacity={0.28} />
      </lineSegments>
      <lineSegments geometry={ring}>
        <lineBasicMaterial color="#F4EDE4" transparent opacity={0.08} />
      </lineSegments>
      <lineSegments geometry={activeLine}>
        <lineBasicMaterial color="#9BD8CB" transparent opacity={0.9} />
      </lineSegments>
      {positions.map((p, i) => (
        <Pulse key={`in${i}`} from={p} to={center} speed={0.22 + i * 0.03} offset={i * 0.17} color={i === active ? "#9BD8CB" : "#E2B48A"} />
      ))}
      {positions.map((p, i) => (
        <Pulse key={`out${i}`} from={center} to={positions[(i + 2) % positions.length]} speed={0.16} offset={i * 0.31} color="#CF9A6A" />
      ))}
      {positions.map((p, i) => {
        const on = i === active || i === hover;
        return (
          <group key={nodes[i].id} position={p}>
            <mesh
              onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                e.stopPropagation();
                setHover(i);
              }}
              onPointerOut={() => setHover(null)}
              onClick={(e: ThreeEvent<MouseEvent>) => {
                e.stopPropagation();
                onSelect(i);
              }}
              scale={on ? 1.35 : 1}
            >
              <sphereGeometry args={[0.16, 24, 24]} />
              <meshBasicMaterial color={i === active ? "#9BD8CB" : "#B88058"} />
            </mesh>
            <mesh scale={on ? 1.35 : 1}>
              <ringGeometry args={[0.24, 0.255, 48]} />
              <meshBasicMaterial color={i === active ? "#9BD8CB" : "#E2B48A"} transparent opacity={on ? 0.9 : 0.35} side={THREE.DoubleSide} />
            </mesh>
            <sprite position={[0, -0.48, 0]} scale={[1.4, 0.35, 1]}>
              <spriteMaterial map={labels[i]} transparent opacity={on ? 1 : 0.7} depthWrite={false} />
            </sprite>
          </group>
        );
      })}
    </group>
  );
}

export default function EcosystemScene({ nodes, active, onSelect, className }: { nodes: readonly Node[]; active: number; onSelect: (i: number) => void; className?: string }) {
  const [visible, setVisible] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    if (wrap.current) io.observe(wrap.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={wrap} className={className}>
      <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0, 6.4], fov: 45 }} gl={{ alpha: true, antialias: true }} frameloop={visible ? "always" : "never"}>
        <Network nodes={nodes} active={active} onSelect={onSelect} />
      </Canvas>
    </div>
  );
}
