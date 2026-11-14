// Explicitly registers React Three Fiber's elements (<mesh>, <points>, <shaderMaterial>, ...)
// in React's JSX namespace. @react-three/fiber v9 normally does this on import; declaring it
// here keeps type checking stable in hosted builders (e.g. GoHighLevel AI Studio).
import type { ThreeElements } from "@react-three/fiber";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

export {};
