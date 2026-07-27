import { gsap, ScrollTrigger } from "./register";

/**
 * Scene 02, the signal field.
 *
 * The steps scroll past a sticky column; whichever one sits at the viewport's
 * centre is lit and the rest are held back. A single scrubbed timeline drives
 * both the dimming and the step counter, so the number can never disagree with
 * the type — deriving the counter from the same progress value is the whole
 * reason there is one trigger here instead of one per step.
 */

export interface SignalFieldTargets {
  /** Wrapper that spans the sticky column and the steps. */
  sequence: HTMLElement;
  /** Pieces of the sticky column, animated in on entry. */
  aside: HTMLElement[];
  /** One element per step, in document order. */
  steps: HTMLElement[];
  /** The digit that ticks with the active step. */
  digit: HTMLElement;
  /** Photographic plates below the sequence. */
  plates: HTMLElement[];
}

/** Opacity of a step that is not the active one. */
const DIM = 0.18;
/** Seconds the scrub takes to catch up. Small enough to feel attached to the wheel. */
const SCRUB = 0.25;

export function createSignalField(targets: SignalFieldTargets): () => void {
  const { sequence, aside, steps, digit, plates } = targets;
  const first = steps[0];
  const last = steps[steps.length - 1];
  if (!first || !last || steps.length < 2) return () => {};

  const media = gsap.matchMedia();

  media.add(
    {
      motion: "(prefers-reduced-motion: no-preference)",
      reduced: "(prefers-reduced-motion: reduce)"
    },
    (context) => {
      // Reduced motion keeps every step legible and registers no triggers. The
      // stylesheet collapses the scroll distance to match.
      if (!context.conditions?.motion) {
        gsap.set(steps, { opacity: 1 });
        digit.textContent = String(steps.length);
        return;
      }

      gsap.set(steps, { opacity: (index: number) => (index === 0 ? 1 : DIM) });

      let activeIndex = 0;
      let swap: gsap.core.Timeline | null = null;
      digit.textContent = "1";

      /** Cross-fades the digit, drifting it the way the reader is travelling. */
      const setStep = (index: number) => {
        if (index === activeIndex) return;
        const forward = index > activeIndex;
        activeIndex = index;
        swap?.kill();
        swap = gsap
          .timeline()
          .to(digit, { autoAlpha: 0, y: forward ? -10 : 10, duration: 0.12, ease: "power1.in" })
          .add(() => {
            digit.textContent = String(index + 1);
          })
          .set(digit, { y: forward ? 10 : -10 })
          .to(digit, { autoAlpha: 1, y: 0, duration: 0.22, ease: "power2.out" });
      };

      // Each step brightens as it arrives and dims again as it leaves; running
      // both staggers from time 0 is what overlaps the two halves so no step is
      // ever fully dark between neighbours.
      const dimmer = gsap
        .timeline()
        .to(steps.slice(1), { opacity: 1, stagger: 0.5, ease: "none" })
        .to(steps.slice(0, -1), { opacity: DIM, stagger: 0.5, ease: "none" }, 0);

      ScrollTrigger.create({
        trigger: first,
        endTrigger: last,
        start: "center center",
        end: "center center",
        animation: dimmer,
        scrub: SCRUB,
        onUpdate: (self) => setStep(Math.round(self.progress * (steps.length - 1)))
      });

      // Entry states are applied here rather than in CSS: the scene has to be
      // readable when this module never loads.
      if (aside.length) {
        gsap.from(aside, {
          autoAlpha: 0,
          y: 28,
          duration: 0.9,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: { trigger: sequence, start: "top 78%", once: true }
        });
      }

      const firstPlate = plates[0];
      if (firstPlate) {
        gsap.from(plates, {
          autoAlpha: 0,
          y: 36,
          duration: 1,
          stagger: 0.14,
          ease: "power2.out",
          scrollTrigger: { trigger: firstPlate, start: "top 85%", once: true }
        });
      }

      return () => {
        swap?.kill();
      };
    }
  );

  return () => media.revert();
}
