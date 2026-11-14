import { lazy, Suspense, type ComponentType } from "react";

/**
 * Lazy-load a browser-only component (WebGL scenes). Callers only render it
 * after a client-side capability check, so it never runs during SSR, and its
 * code (three.js etc.) stays out of the initial bundle.
 */
export function lazyClient<P extends object>(load: () => Promise<{ default: ComponentType<P> }>) {
  const Lazy = lazy(load);
  return function LazyClient(props: P) {
    return (
      <Suspense fallback={null}>
        <Lazy {...props} />
      </Suspense>
    );
  };
}
