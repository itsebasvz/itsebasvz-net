/**
 * The ball's motion, in scene units and seconds. Knows nothing about three or
 * the DOM: it takes a box and a timestep and moves a point around inside it.
 *
 * Integration runs on a fixed 1/120 s substep with an accumulator. A variable
 * timestep would make the bounce height depend on the frame rate, and a hard
 * throw at 30 fps would cover most of the arena in one step and pass straight
 * through a wall.
 *
 * It reports position and velocity and nothing else. This module used to be
 * able to run itself forward over a copy of its own state and say exactly where
 * a throw would come to rest — correct, cheap, and the reason the fox looked
 * like a machine. The fox keeps its own rough model of what a ball does now.
 */

/** Walls, already inset by the ball's radius. */
export interface BallBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface BallPhysicsOptions {
  radius: number;
  gravity?: number;
  wallRestitution?: number;
  floorRestitution?: number;
  /** Speed kept along the surface after an impact. */
  tangentFriction?: number;
  /** Exponential decay of velocity in flight, per second. */
  airDrag?: number;
  /** Exponential decay of horizontal speed while touching the floor. */
  rollFriction?: number;
  /** Below this speed on the floor the ball is a candidate for resting. */
  restSpeed?: number;
  /** Seconds under `restSpeed` before it counts as at rest. */
  restHold?: number;
  /** Upward speed below which a bounce is cancelled instead of played out. */
  bounceCutoff?: number;
  /** Impact speed under which a floor hit is not worth reporting. */
  reportSpeed?: number;
  /** Ceiling on release speed, so a flick across the screen stays playable. */
  maxThrow?: number;
}

export interface BallStep {
  /** The ball hit the floor hard enough to be worth reacting to. */
  landed: boolean;
  /** The ball hit any wall, including the floor. */
  bounced: boolean;
  /** The ball came to rest on this step. */
  settled: boolean;
}

export interface BallPhysics {
  readonly x: number;
  readonly y: number;
  /** Velocity in scene units per second. y is positive upward. */
  readonly vx: number;
  readonly vy: number;
  /** Accumulated roll angle, in radians. */
  readonly angle: number;
  readonly held: boolean;
  readonly resting: boolean;
  /** Current speed, in scene units per second. */
  readonly speed: number;
  /** Drops the ball at a point with no velocity. */
  place: (x: number, y: number) => void;
  /** Takes the ball out of the simulation and into the pointer's hand. */
  grab: () => void;
  /** Moves a held ball. Clamped to the bounds by the caller. */
  moveTo: (x: number, y: number) => void;
  /** Hands it back to the simulation with a velocity. */
  release: (vx: number, vy: number) => void;
  /** Adds velocity to a free ball. */
  kick: (vx: number, vy: number) => void;
  advance: (delta: number, bounds: BallBounds) => BallStep;
}

interface BallState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  omega: number;
  resting: boolean;
  restTimer: number;
}

type Settings = Required<Omit<BallPhysicsOptions, "radius">> & { radius: number };

const STEP = 1 / 120;
/** Substeps per frame. Past this the backlog is dropped rather than chased. */
const MAX_SUBSTEPS = 8;

const DEFAULTS = {
  gravity: 32,
  wallRestitution: 0.62,
  floorRestitution: 0.55,
  tangentFriction: 0.94,
  airDrag: 0.14,
  rollFriction: 1.2,
  restSpeed: 0.25,
  restHold: 0.3,
  bounceCutoff: 1.6,
  reportSpeed: 1,
  maxThrow: 28
};

/** One fixed substep. Pure in `state`, so it can be run over a copy. */
function substep(state: BallState, bounds: BallBounds, config: Settings, step: BallStep) {
  state.vy -= config.gravity * STEP;

  const drag = Math.exp(-config.airDrag * STEP);
  state.vx *= drag;
  state.vy *= drag;

  state.x += state.vx * STEP;
  state.y += state.vy * STEP;

  if (state.x <= bounds.minX && state.vx < 0) {
    state.x = bounds.minX;
    state.vx = -state.vx * config.wallRestitution;
    state.vy *= config.tangentFriction;
    step.bounced = true;
  } else if (state.x >= bounds.maxX && state.vx > 0) {
    state.x = bounds.maxX;
    state.vx = -state.vx * config.wallRestitution;
    state.vy *= config.tangentFriction;
    step.bounced = true;
  }
  state.x = Math.min(Math.max(state.x, bounds.minX), bounds.maxX);

  if (state.y >= bounds.maxY && state.vy > 0) {
    state.y = bounds.maxY;
    state.vy = -state.vy * config.wallRestitution;
    state.vx *= config.tangentFriction;
    step.bounced = true;
  }

  let onFloor = false;
  if (state.y <= bounds.minY) {
    state.y = bounds.minY;
    onFloor = true;
    if (state.vy < 0) {
      const impact = -state.vy;
      state.vx *= config.tangentFriction;
      state.vy = impact * config.floorRestitution;
      // A bounce this small would be a sub-pixel jitter that never ends, so
      // the ball is put on the ground instead.
      if (state.vy < config.bounceCutoff) state.vy = 0;
      step.bounced = true;
      if (impact > config.reportSpeed) step.landed = true;
    }
  }

  if (onFloor) {
    state.vx *= Math.exp(-config.rollFriction * STEP);
    // Rolling without slipping: the contact point is stationary, so the
    // angular rate follows straight out of the ground speed.
    state.omega = -state.vx / config.radius;
  } else {
    state.omega *= Math.exp(-0.35 * STEP);
  }
  state.angle += state.omega * STEP;

  const speed = Math.hypot(state.vx, state.vy);
  if (onFloor && speed < config.restSpeed) {
    state.restTimer += STEP;
    if (state.restTimer >= config.restHold && !state.resting) {
      state.resting = true;
      state.vx = 0;
      state.vy = 0;
      state.omega = 0;
      step.settled = true;
    }
  } else {
    state.restTimer = 0;
    if (speed >= config.restSpeed) state.resting = false;
  }
}

export function createBallPhysics(options: BallPhysicsOptions): BallPhysics {
  const config: Settings = { ...DEFAULTS, ...options };

  const live: BallState = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    angle: 0,
    omega: 0,
    resting: false,
    restTimer: 0
  };

  let held = false;
  let carry = 0;

  function clampThrow(value: number) {
    return Math.max(Math.min(value, config.maxThrow), -config.maxThrow);
  }

  return {
    get x() {
      return live.x;
    },
    get y() {
      return live.y;
    },
    get vx() {
      return live.vx;
    },
    get vy() {
      return live.vy;
    },
    get angle() {
      return live.angle;
    },
    get held() {
      return held;
    },
    get resting() {
      return live.resting;
    },
    get speed() {
      return Math.hypot(live.vx, live.vy);
    },
    place(x: number, y: number) {
      live.x = x;
      live.y = y;
      live.vx = 0;
      live.vy = 0;
      live.omega = 0;
      live.resting = false;
      live.restTimer = 0;
      carry = 0;
    },
    grab() {
      held = true;
      live.vx = 0;
      live.vy = 0;
      live.omega = 0;
      live.resting = false;
      live.restTimer = 0;
      carry = 0;
    },
    moveTo(x: number, y: number) {
      live.x = x;
      live.y = y;
    },
    release(vx: number, vy: number) {
      held = false;
      live.vx = clampThrow(vx);
      live.vy = clampThrow(vy);
      live.resting = false;
      live.restTimer = 0;
      carry = 0;
    },
    kick(vx: number, vy: number) {
      if (held) return;
      live.vx = clampThrow(live.vx + vx);
      live.vy = clampThrow(live.vy + vy);
      live.resting = false;
      live.restTimer = 0;
    },
    advance(delta: number, bounds: BallBounds) {
      const step: BallStep = { landed: false, bounced: false, settled: false };
      if (held) {
        carry = 0;
        return step;
      }

      carry += delta;
      let taken = 0;
      while (carry >= STEP && taken < MAX_SUBSTEPS) {
        carry -= STEP;
        taken += 1;
        substep(live, bounds, config, step);
      }
      // A stalled tab hands back a delta measured in seconds. Chasing it would
      // fast-forward the throw; dropping it just resumes from where it stopped.
      if (carry >= STEP) carry = 0;
      return step;
    }
  };
}
