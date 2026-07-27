/**
 * The hero's two WebGL props — the fox and the ball — live in separate canvases
 * and separate component scripts, but they share one stage. This module is the
 * seam between them: the constants that have to agree, and a typed mediator so
 * neither component has to reach into the other's DOM.
 *
 * Both component scripts import this statically, so the bundler hands them the
 * same module instance and the state below is genuinely shared.
 */

/**
 * Scene units visible from top to bottom in the fox's canvas. Every other
 * measurement on the stage is derived from this and the fox box's pixel height,
 * which is what keeps "1.2 units" meaning the same size in both canvases.
 */
export const FOX_FRAME_HEIGHT = 4.66;

/** Camera distance. Shared so both cameras sit at the same pitch. */
export const CAMERA_DISTANCE = 4.2;

/**
 * Where the fox's feet sit, as a fraction of its box height measured up from the
 * bottom edge. Derived, not guessed: the bind pose is 79.03 model units tall on
 * a 154.72-unit longest side, so at `scale: 5` the fox stands 2.554 units high
 * with its centre at y = -0.05, putting the feet at y = -1.3275. The camera's
 * 14° pitch scales world y by 0.970, so that lands 1.0421 units above the frame
 * floor — 22.4% of 4.66.
 */
export const FOX_GROUND_INSET = 0.224;

/**
 * `grab` and `carry` mean a hand has it — nothing to chase. `throw` is the
 * release, `bounce` every floor impact, `settled` the moment it stops.
 */
export type BallPhase = "grab" | "carry" | "throw" | "bounce" | "settled";

export interface BallSignal {
  /** Viewport x of the ball's centre right now, in CSS pixels. */
  clientX: number;
  /**
   * Viewport x where the ball is predicted to come to rest, from running the
   * physics forward. Equals `clientX` while it is held. This is what the fox
   * should aim at: chasing `clientX` means always arriving where the ball was.
   */
  restX: number;
  phase: BallPhase;
  /** Ball speed in scene units per second. */
  speed: number;
}

type BallListener = (signal: BallSignal) => void;

const ballListeners = new Set<BallListener>();

/** The ball reports where it hit the floor. */
export function emitBall(signal: BallSignal) {
  for (const listener of ballListeners) listener(signal);
}

/** The fox subscribes. Returns an unsubscribe. */
export function onBall(listener: BallListener) {
  ballListeners.add(listener);
  return () => ballListeners.delete(listener);
}

let foxReady = false;
const foxWaiters = new Set<() => void>();

/** The fox finished its walk-in and is standing on its mark. */
export function markFoxReady() {
  if (foxReady) return;
  foxReady = true;
  for (const waiter of foxWaiters) waiter();
  foxWaiters.clear();
}

/**
 * Runs once the fox is on its mark, or immediately if it already is. The ball
 * drops on this signal, so the two entries read as one choreographed arrival
 * instead of two things booting at once.
 */
export function whenFoxReady(run: () => void) {
  if (foxReady) {
    run();
    return;
  }
  foxWaiters.add(run);
}
