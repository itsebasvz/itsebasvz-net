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
 * release, `track` a periodic look while it is in the air, `bounce` every floor
 * impact, `settled` the moment it stops.
 */
export type BallPhase = "grab" | "carry" | "throw" | "track" | "bounce" | "settled";

/**
 * What the ball is doing, as an observer would see it — never where it is going
 * to end up. The ball can run its own integrator forward and answer that
 * exactly, and for a while it did; handing the answer to the fox made the fox
 * omniscient, and an animal that is already standing on the landing spot three
 * bounces early does not read as an animal. Predicting is the fox's job now,
 * and getting it wrong is the point.
 */
export interface BallSignal {
  /**
   * Viewport x of the ball's centre, in CSS pixels. The only quantity here that
   * needs converting: the two canvases share a scale but not an origin, so
   * lengths and speeds cross between them unchanged and positions do not.
   */
  clientX: number;
  /** Height of the ball's centre above its resting level, in scene units. */
  height: number;
  /** Velocity in scene units per second. y is positive upward. */
  vx: number;
  vy: number;
  phase: BallPhase;
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

/** The side walls of the arena, in viewport CSS pixels. */
export interface ArenaSpan {
  left: number;
  right: number;
}

let arena: ArenaSpan | null = null;

/** The ball measures the walls off the layout; it publishes them here. */
export function setArena(span: ArenaSpan) {
  arena = span;
}

/**
 * The fox reads them to keep a guess inside the room. It is allowed to know
 * this much: it has watched the ball come off those walls all along.
 */
export function getArena() {
  return arena;
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
