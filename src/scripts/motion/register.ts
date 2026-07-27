import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Single registration point for GSAP plugins, per `docs/ARCHITECTURE.md` §11.
 * Module evaluation runs once, so importing this anywhere is enough — no scene
 * should call `gsap.registerPlugin` itself.
 */
gsap.registerPlugin(ScrollTrigger);

/**
 * Trigger positions are measured from laid-out text. Web fonts land after the
 * first paint and reflow every line, so any start/end computed before that is
 * stale. Resize is refreshed automatically; this is not.
 */
if (document.fonts) {
  void document.fonts.ready.then(() => ScrollTrigger.refresh());
}

export { gsap, ScrollTrigger };
