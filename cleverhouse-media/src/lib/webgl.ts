let cached: boolean | null = null;

/** Whether the device should get WebGL enhancements. */
export function canUseWebGL(): boolean {
  if (typeof window === "undefined") return false;
  if (cached !== null) return cached;
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return (cached = false);
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    cached = !!gl;
  } catch {
    cached = false;
  }
  return cached;
}

/** Rough quality tier so phones and low-power machines get lighter scenes. */
export function qualityTier(): "low" | "mid" | "high" {
  if (typeof window === "undefined") return "low";
  const cores = navigator.hardwareConcurrency || 4;
  const small = window.innerWidth < 768;
  // @ts-expect-error deviceMemory is not in all TS DOM libs
  const mem: number = navigator.deviceMemory || 8;
  if (small || cores <= 4 || mem <= 4) return "low";
  if (cores <= 8) return "mid";
  return "high";
}
