import { gsap, ScrollTrigger } from "./register";

/**
 * Scene 02, the signal field.
 *
 * The steps scroll past a sticky column; whichever one sits at the viewport's
 * centre is lit and the rest are held back. A single scrubbed timeline drives
 * the dimming, the step counter and the plate handover, so none of the three can
 * disagree with the others — deriving all of them from the same progress value
 * is the whole reason there is one trigger here instead of one per step.
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
  /**
   * The two plates stacked in the sticky column, in document order. The first
   * is painted over the second and is the only one that moves.
   */
  photos: HTMLElement[];
}

/** Opacity of a step that is not the active one. */
const DIM = 0.18;
/** Seconds the scrub takes to catch up. Small enough to feel attached to the wheel. */
const SCRUB = 0.25;
/**
 * The step the second plate lands on. The dissolve runs across the leg that
 * arrives at it: it plays while the reader travels and is finished by the time
 * that step is centred. With five modules, step 03 is the middle of the run.
 *
 * It has to *finish* on a step rather than straddle one. `motion.css` puts
 * `scroll-snap-type: y proximity` on the root and every step snaps to centre,
 * so step centres are the only places a reader ever comes to rest — measured,
 * not assumed: a wheel gesture lands on 0.25, 0.5, 0.75, 1 and nothing between.
 * Centring the dissolve on step 03 would therefore park them on a permanent
 * half-and-half of two photographs, which reads as a mistake rather than a
 * change, and they would never once see it move.
 */
const SWAP_STEP = 3;

export function createSignalField(targets: SignalFieldTargets): () => void {
  const { sequence, aside, steps, digit, photos } = targets;
  const first = steps[0];
  const last = steps[steps.length - 1];
  if (!first || !last || steps.length < 2) return () => {};

  // The plate dissolves as one thing, but its caption cannot: a photograph is
  // opaque and hides the one beneath it, while a caption is type over nothing,
  // so two of them in the same cell simply print over each other.
  const topPicture = photos[0]?.querySelector<HTMLElement>("picture") ?? null;
  const labels = photos.map((photo) => photo.querySelector<HTMLElement>("figcaption"));
  const [outgoingLabel, incomingLabel] = labels;

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
        // Both plates on show, unstacked by the stylesheet: same scenes, same
        // photographs, same order, with nothing to scrub the handover. The
        // labels are set too because the stacked stylesheet holds the second one
        // back, and here there is no handover coming to bring it in.
        gsap.set([...photos, topPicture, ...labels].filter(Boolean), { opacity: 1 });
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

      /**
       * Hands the column's plate over on the way to `SWAP_STEP`.
       *
       * Only the top photograph moves: the one underneath stays fully opaque, so
       * the column is never empty and the background never shows through. Fading
       * both — one out while the other comes in — would let a quarter of
       * `--color-void` through at the crossing point and read as a dip to black.
       *
       * The captions are the exception, and they get a gap instead of a cross.
       * Nothing sits behind a line of mono type, so any blend of the two is two
       * labels printed over each other. One leaves before the other arrives; the
       * beat with neither is a fraction of a step and reads as the label simply
       * changing.
       *
       * Smoothed, because a linear ramp bolted to the wheel reads mechanical.
       */
      const landing = gsap.utils.clamp(2, steps.length, SWAP_STEP);
      const swapFrom = (landing - 2) / (steps.length - 1);
      const swapSpan = 1 / (steps.length - 1);

      const smooth = (x: number) => x * x * (3 - 2 * x);
      /** Where `t` sits inside a slice of the handover, smoothed and clamped. */
      const phase = (t: number, from: number, to: number) =>
        smooth(gsap.utils.clamp(0, 1, (t - from) / (to - from)));

      const set = (el: HTMLElement | null) => (el ? gsap.quickSetter(el, "opacity") : null);
      const fadePicture = set(topPicture);
      const fadeLabelOut = set(outgoingLabel ?? null);
      const fadeLabelIn = set(incomingLabel ?? null);

      const setPhoto = (progress: number) => {
        const t = gsap.utils.clamp(0, 1, (progress - swapFrom) / swapSpan);
        fadePicture?.(1 - smooth(t));
        fadeLabelOut?.(1 - phase(t, 0, 0.45));
        fadeLabelIn?.(phase(t, 0.55, 1));
      };
      // Set once here rather than waiting for the first scroll: the trigger only
      // starts reporting once the sequence is in range, and the plate has to be
      // right before then.
      setPhoto(0);

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
        onUpdate: (self) => {
          setStep(Math.round(self.progress * (steps.length - 1)));
          setPhoto(self.progress);
        }
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

      return () => {
        swap?.kill();
      };
    }
  );

  return () => media.revert();
}
