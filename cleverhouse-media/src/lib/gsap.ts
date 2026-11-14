import gsapCore from "gsap";
import { ScrollTrigger as ScrollTriggerPlugin } from "gsap/ScrollTrigger";
import { SplitText as SplitTextPlugin } from "gsap/SplitText";
import { Flip as FlipPlugin } from "gsap/Flip";
import { useGSAP as useGSAPHook } from "@gsap/react";

/**
 * Registers every GSAP plugin the site uses and hands them back.
 *
 * AI Studio's template declares `"sideEffects": false`, which lets the production
 * bundler skip modules that only re-export imports. A bare `registerPlugin()` call
 * here could then be dropped, leaving ScrollTrigger uninitialised ("ka is not a
 * function"). Exporting values that come *out of* this setup call guarantees the
 * registration runs before any component can touch GSAP.
 */
function setup() {
  if (typeof window !== "undefined") {
    gsapCore.registerPlugin(ScrollTriggerPlugin, SplitTextPlugin, FlipPlugin, useGSAPHook);
    gsapCore.defaults({ ease: "expo.out", duration: 1.1 });
    ScrollTriggerPlugin.config({ ignoreMobileResize: true });
  }
  return {
    gsap: gsapCore,
    ScrollTrigger: ScrollTriggerPlugin,
    SplitText: SplitTextPlugin,
    Flip: FlipPlugin,
    useGSAP: useGSAPHook,
  };
}

const registered = setup();

export const gsap = registered.gsap;
export const ScrollTrigger = registered.ScrollTrigger;
export const SplitText = registered.SplitText;
export const Flip = registered.Flip;
export const useGSAP = registered.useGSAP;

export type SplitText = InstanceType<typeof SplitTextPlugin>;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isFinePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
