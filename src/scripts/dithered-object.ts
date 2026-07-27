import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * Vanilla port of Canvas UI's "Dithered Object", reduced to what this portfolio
 * needs: GLB/glTF only, an ordered Bayer or clustered halftone screen, and a
 * three-stop tint ramp so the dither reads in the brand's orange range instead
 * of grayscale. Unlit cells are punched out to transparent rather than filled
 * black, so the object sits on `--color-void` like a screen-printed sticker.
 *
 * Dropped from the original: SVG/bitmap card mounting and contour tracing,
 * Floyd-Steinberg error diffusion, Draco, invert and grayscale toggles.
 */

export type DitherMethod = "bayer" | "halftone";

/** Ramp stops applied to lit cells: shadow, body, highlight. */
export type TintRamp = [string, string, string];

export interface DitheredObjectOptions {
  /** URL of the GLB or glTF model to display. */
  src?: string;
  /**
   * A mesh built in code, as an alternative to `src`. Takes precedence over it.
   * The instance takes ownership and disposes it.
   */
  object?: THREE.Object3D | null;
  /** Dither pattern: an ordered Bayer grid or clustered halftone dots. */
  method?: DitherMethod;
  /** Size of the dither cells in CSS pixels. */
  gridSize?: number;
  /** Extra pixelation applied on top of the grid size (1 to 10). */
  pixelSizeRatio?: number;
  /** Colors mapped to lit cells by luminance: shadow, body, highlight. */
  tint?: TintRamp;
  /** Multiplier applied to luminance before the ramp lookup. */
  toneGain?: number;
  /**
   * Multiplier applied to luminance before the dither threshold. Raising it
   * fills cells in; lowering it opens the screen up. This is the dot gradient,
   * and on a dark subject it is what carries the sense of form.
   */
  ditherGain?: number;
  /**
   * Width of the horizontal fade at the canvas edges, as a fraction of the
   * canvas. Without it an object travelling in from off-frame is sliced by the
   * boundary. A pair sets the left and right edges independently; 0 disables.
   */
  edgeFade?: number | readonly [number, number];
  /** Accent color of the ring light in the studio environment. */
  highlight?: string;
  /** Brightness of the studio environment lighting. */
  environmentIntensity?: number;
  /** Roughness override applied to every material (0 to 1). Negative keeps the asset's own values. */
  roughness?: number;
  /** Size of the longest side of the object in scene units. */
  scale?: number;
  /** Horizontal offset of the object in scene units. */
  xOffset?: number;
  /** Vertical offset of the object in scene units. */
  yOffset?: number;
  /** Yaw applied to the model in radians, to aim it within the composition. */
  yaw?: number;
  /** Strength of the floating bob animation (0 disables). */
  floatIntensity?: number;
  /** Strength of the idle rocking rotation (0 disables). */
  rotationIntensity?: number;
  /** Speed of the float and rocking animation. */
  floatSpeed?: number;
  /** Name of the resting animation clip. Falls back to the first clip. */
  clip?: string;
  /** Playback rate of the resting clip. */
  clipSpeed?: number;
  /** Seconds of stillness between plays of the resting clip, jittered by ±30%. 0 loops it. */
  restHold?: number;
  /** Clip played while travelling. Empty disables the entry and `walkTo`. */
  entryClip?: string;
  /** Playback rate of the travelling clip. 0 inherits `clipSpeed`. */
  entryClipSpeed?: number;
  /** Clip played instead of `entryClip` on long moves. Empty keeps one gait. */
  runClip?: string;
  /** Playback rate of the running clip. 0 inherits `clipSpeed`. */
  runClipSpeed?: number;
  /** Travel speed while running, in scene units per second. */
  runSpeed?: number;
  /** Distance above which a move runs instead of walking, in scene units. */
  runThreshold?: number;
  /**
   * Travel speed in scene units per second. One constant for every move, so
   * stride and ground speed stay matched wherever the object walks.
   */
  walkSpeed?: number;
  /** Scene units the object travels along x during the entry, ending at `xOffset`. */
  entryTravel?: number;
  /**
   * Seconds spent pivoting when a move reverses the facing direction. 0 keeps
   * the object facing one way for good, whatever direction it travels.
   */
  turnDuration?: number;
  /** Crossfade length between clips, in seconds. */
  clipFade?: number;
  /** Let the user orbit the camera by dragging. */
  orbit?: boolean;
  /** Let the user zoom with the scroll wheel or pinch. */
  zoom?: boolean;
  /** Spin the camera around the object turntable-style. */
  autoRotate?: boolean;
  /** Turntable speed when autoRotate is on. */
  autoRotateSpeed?: number;
  /**
   * Scene units visible from top to bottom. The projection is orthographic, so
   * this holds across the whole frame no matter how wide the canvas gets and
   * the object never skews as it travels off-centre.
   */
  frameHeight?: number;
  /** Camera distance from the center of the object. */
  cameraDistance?: number;
  /** Called after the model finishes loading. */
  onLoad?: (() => void) | null;
  /** Called when the model fails to load. */
  onError?: ((error: unknown) => void) | null;
  /**
   * Called every frame, after the idle float has written its transform, so a
   * caller driving the object itself has the last word on `root`.
   */
  onFrame?: ((delta: number, root: THREE.Object3D) => void) | null;
  /** Called when a move ends and nothing is queued behind it. */
  onIdle?: (() => void) | null;
}

export interface DitheredObjectInstance {
  /** Update options live. Changing src loads the new model. */
  setOptions: (options: DitheredObjectOptions) => void;
  /** Crossfade to another clip of the loaded model. Cancels any move in progress. */
  playClip: (name: string, fade?: number) => void;
  /**
   * Walk to a scene-space x, pivoting first when the move reverses direction.
   * `onArrive` fires once the object comes to rest.
   */
  walkTo: (x: number, onArrive?: () => void) => void;
  /**
   * Pivot on the spot to face a direction, without travelling. Ignored while a
   * move is in progress, which already owns the facing.
   */
  face: (direction: number) => void;
  /** Scene units per CSS pixel, for placing DOM markers over the canvas. */
  unitsPerPixel: () => number;
  /** Where the object currently stands along x, in scene units. */
  positionX: () => number;
  /** Canvas-local CSS pixels to a point on the z = 0 plane. */
  toScene: (point: { x: number; y: number }) => { x: number; y: number };
  /** A point on the z = 0 plane to canvas-local CSS pixels. */
  toCanvas: (point: { x: number; y: number }) => { x: number; y: number };
  /** Re-read canvas size. Call when the element is resized. */
  resize: () => void;
  /** Stop the loop and release all GPU resources. */
  destroy: () => void;
}

const DEFAULTS: Required<DitheredObjectOptions> = {
  src: "",
  object: null,
  method: "bayer",
  gridSize: 4,
  pixelSizeRatio: 1,
  tint: ["#7a2f0a", "#ff761a", "#ffd2a8"],
  toneGain: 1,
  ditherGain: 1,
  edgeFade: 0,
  highlight: "#ff761a",
  environmentIntensity: 0.1,
  roughness: -1,
  scale: 3,
  xOffset: 0,
  yOffset: 0,
  yaw: 0,
  floatIntensity: 2,
  rotationIntensity: 1,
  floatSpeed: 2,
  clip: "",
  clipSpeed: 1,
  restHold: 0,
  entryClip: "",
  entryClipSpeed: 0,
  runClip: "",
  runClipSpeed: 0,
  runSpeed: 0,
  runThreshold: 0,
  walkSpeed: 1.7,
  entryTravel: 0,
  turnDuration: 0.45,
  clipFade: 0.6,
  orbit: true,
  zoom: false,
  autoRotate: false,
  autoRotateSpeed: 2,
  frameHeight: 4.66,
  cameraDistance: 4.2,
  onLoad: null,
  onError: null,
  onFrame: null,
  onIdle: null
};

const POST_VERT = `
out vec2 vUv;
void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

const POST_FRAG = `
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform sampler2D tDiffuse;
uniform vec2 uResolution;
uniform float uGridSize;
uniform float uPixelSizeRatio;
uniform float uToneGain;
uniform float uDitherGain;
uniform float uEdgeFadeL;
uniform float uEdgeFadeR;
uniform int uMethod;
uniform vec3 uTintLow;
uniform vec3 uTintMid;
uniform vec3 uTintHigh;

const mat4 THRESHOLDS = mat4(
  0.94118, 0.29412, 0.76471, 0.05882,
  0.47059, 0.70588, 0.23529, 0.52941,
  0.82353, 0.11765, 0.88235, 0.17647,
  0.35294, 0.58824, 0.41176, 0.64706
);

const float SCREEN_ANGLE = 0.70710678;
const float CORNER_REACH = 1.41421356;
const vec3 LUMA = vec3(0.2126, 0.7152, 0.0722);

vec3 toSrgb(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), c));
}

float bayerThreshold(vec2 cellCoord) {
  ivec2 p = ivec2(mod(cellCoord, 4.0));
  return THRESHOLDS[p.x][p.y];
}

float halftoneThreshold(vec2 cellCoord) {
  vec2 screen = vec2(
    cellCoord.x * SCREEN_ANGLE - cellCoord.y * SCREEN_ANGLE,
    cellCoord.x * SCREEN_ANGLE + cellCoord.y * SCREEN_ANGLE
  );
  return clamp(length(fract(screen) - 0.5) * CORNER_REACH, 0.0, 1.0);
}

float thresholdAt(vec2 cellCoord) {
  if (uMethod == 1) return halftoneThreshold(cellCoord);
  return bayerThreshold(cellCoord);
}

vec3 ramp(float t) {
  return t < 0.5
    ? mix(uTintLow, uTintMid, t * 2.0)
    : mix(uTintMid, uTintHigh, (t - 0.5) * 2.0);
}

void main() {
  vec2 fragCoord = vUv * uResolution;
  float pixelSize = uGridSize * uPixelSizeRatio;
  vec2 pixelUv = (floor(fragCoord / pixelSize) + 0.5) * pixelSize / uResolution;
  vec4 tex = texture(tDiffuse, pixelUv);
  vec3 color = toSrgb(tex.rgb);
  float luma = dot(color, LUMA);

  // Cell density runs on normalised luminance. The original compared the raw
  // sum of channels (0 to 3) against the screen (0 to 1), which only dips below
  // the threshold on a near-black pixel. That reads well on a white subject,
  // where the dither lands in the shadows, but a saturated orange sums past 1.5
  // almost everywhere and comes out solid — no dot gradient, and so no form.
  vec2 cellCoord = fragCoord / uGridSize;
  float shade = clamp(luma * uDitherGain, 0.0, 1.0);
  if (shade < thresholdAt(cellCoord) || tex.a < 0.01) {
    outColor = vec4(0.0);
    return;
  }

  // three converts the tint uniforms to linear-sRGB on assignment, so the ramp
  // interpolates in linear — correct — but the result has to be encoded back
  // before it reaches the canvas. Without this the green channel stays crushed
  // and every stop reads a stop redder than it was authored.
  vec3 tinted = ramp(clamp(luma * uToneGain, 0.0, 1.0));

  // Feathers a vertical edge so anything walking in from off-frame arrives as a
  // fade instead of being sliced by the canvas boundary. Independent per side:
  // an object that enters from one edge and then travels to the other wants the
  // feather only where it actually crosses.
  float edge =
    (uEdgeFadeL > 0.0 ? smoothstep(0.0, uEdgeFadeL, vUv.x) : 1.0) *
    (uEdgeFadeR > 0.0 ? smoothstep(0.0, uEdgeFadeR, 1.0 - vUv.x) : 1.0);
  float alpha = tex.a * edge;
  outColor = vec4(toSrgb(tinted) * alpha, alpha);
}`;

interface FormerDef {
  kind: "ring" | "box";
  intensity: number;
  position: [number, number, number];
  scale: [number, number, number];
  lookAtCenter?: boolean;
  withLight?: boolean;
}

const ROOM_BLOCKS: Array<{
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}> = [
  {
    position: [-10.906, -1, 1.846],
    rotation: [0, -0.195, 0],
    scale: [2.328, 7.905, 4.651]
  },
  {
    position: [-5.607, -0.754, -0.758],
    rotation: [0, 0.994, 0],
    scale: [1.97, 1.534, 3.955]
  },
  {
    position: [6.167, -0.16, 7.803],
    rotation: [0, 0.561, 0],
    scale: [3.927, 6.285, 3.687]
  },
  {
    position: [-2.017, 0.018, 6.124],
    rotation: [0, 0.333, 0],
    scale: [2.002, 4.566, 2.064]
  },
  {
    position: [2.291, -0.756, -2.621],
    rotation: [0, -0.286, 0],
    scale: [1.546, 1.552, 1.496]
  },
  {
    position: [-2.193, -0.369, -5.547],
    rotation: [0, 0.516, 0],
    scale: [3.875, 3.487, 2.986]
  }
];

const ROOM_FORMERS: FormerDef[] = [
  {
    kind: "ring",
    intensity: 15,
    position: [2, 3, -2],
    scale: [10, 10, 10],
    lookAtCenter: true
  },
  { kind: "box", intensity: 80, position: [-14, 10, 8], scale: [0.1, 2.5, 2.5] },
  {
    kind: "box",
    intensity: 80,
    position: [-14, 14, -4],
    scale: [0.1, 2.5, 2.5],
    withLight: true
  },
  {
    kind: "box",
    intensity: 23,
    position: [14, 12, 0],
    scale: [0.1, 5, 5],
    withLight: true
  },
  {
    kind: "box",
    intensity: 16,
    position: [0, 9, 14],
    scale: [5, 5, 0.1],
    withLight: true
  },
  {
    kind: "box",
    intensity: 80,
    position: [7, 8, -14],
    scale: [2.5, 2.5, 0.1],
    withLight: true
  },
  {
    kind: "box",
    intensity: 80,
    position: [-7, 16, -14],
    scale: [2.5, 2.5, 0.1],
    withLight: true
  },
  {
    kind: "box",
    intensity: 1,
    position: [0, 20, 0],
    scale: [0.1, 0.1, 0.1],
    withLight: true
  },
  {
    kind: "box",
    intensity: 20,
    position: [0, 15, 0],
    scale: [10, 1, 10],
    withLight: true
  }
];

const CAMERA_DIR = new THREE.Vector3(0, -1, 4).normalize();
const scratchPoint = new THREE.Vector3();
const scratchDirection = new THREE.Vector3();
const MODEL_LIFT = 0.3;
const METHOD_INDEX: Record<DitherMethod, number> = { bayer: 0, halftone: 1 };
/** Seconds the idle float takes to reach full amplitude once the entry lands. */
const SETTLE_TIME = 1.4;
/**
 * Fraction of `runThreshold` a run has to drop under before it hands back to a
 * walk. Hysteresis, not a tuning knob: a caller that keeps refining a
 * destination will sit on the threshold, and one shared value there means a
 * crossfade between the two gaits several times a second.
 */
const RUN_RELEASE = 0.55;

function disposeObject(root: THREE.Object3D) {
  root.traverse((node) => {
    const mesh = node as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const material of materials) {
      if (!material) continue;
      for (const value of Object.values(material)) {
        if (value instanceof THREE.Texture) value.dispose();
      }
      material.dispose();
    }
  });
}

export function createDitheredObject(
  canvas: HTMLCanvasElement,
  options: DitheredObjectOptions = {}
): DitheredObjectInstance | null {
  const config: Required<DitheredObjectOptions> = { ...DEFAULTS, ...options };

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      powerPreference: "high-performance"
    });
  } catch {
    return null;
  }
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 200);
  camera.position.copy(CAMERA_DIR).multiplyScalar(config.cameraDistance);

  const floatGroup = new THREE.Group();
  floatGroup.position.y = MODEL_LIFT;
  const fitGroup = new THREE.Group();
  floatGroup.add(fitGroup);
  scene.add(floatGroup);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.enablePan = false;

  const target = new THREE.WebGLRenderTarget(1, 1, { samples: 4 });
  target.texture.colorSpace = THREE.SRGBColorSpace;

  // Held as a concrete object rather than read back off `material.uniforms`,
  // whose index signature is untyped.
  const uniforms = {
    tDiffuse: { value: target.texture },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uGridSize: { value: 4 },
    uPixelSizeRatio: { value: 1 },
    uToneGain: { value: 1 },
    uDitherGain: { value: 1 },
    uEdgeFadeL: { value: 0 },
    uEdgeFadeR: { value: 0 },
    uMethod: { value: 0 },
    uTintLow: { value: new THREE.Color(DEFAULTS.tint[0]) },
    uTintMid: { value: new THREE.Color(DEFAULTS.tint[1]) },
    uTintHigh: { value: new THREE.Color(DEFAULTS.tint[2]) }
  };

  const postMaterial = new THREE.ShaderMaterial({
    glslVersion: THREE.GLSL3,
    vertexShader: POST_VERT,
    fragmentShader: POST_FRAG,
    uniforms,
    depthTest: false,
    depthWrite: false,
    blending: THREE.NoBlending
  });
  const postGeometry = new THREE.BufferGeometry();
  postGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3)
  );
  const postMesh = new THREE.Mesh(postGeometry, postMaterial);
  postMesh.frustumCulled = false;
  const postScene = new THREE.Scene();
  postScene.add(postMesh);
  const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const pmrem = new THREE.PMREMGenerator(renderer);
  let roomScene: THREE.Scene | null = null;
  let ringMaterial: THREE.MeshBasicMaterial | null = null;
  let envTarget: THREE.WebGLRenderTarget | null = null;
  let envDirty = true;

  function buildRoom() {
    const room = new THREE.Group();
    room.position.set(0, -0.5, 0);
    roomScene = new THREE.Scene();
    roomScene.add(room);

    for (const [x, z] of [
      [-15, 15],
      [15, 15],
      [15, -15],
      [-15, -15]
    ] as const) {
      const spot = new THREE.SpotLight(0xffffff, 2, 0, 0.2, 1, 0);
      spot.position.set(x, 20, z);
      room.add(spot, spot.target);
    }
    const center = new THREE.PointLight(0xffffff, 100, 28, 2);
    center.position.set(0.5, 14, 0.5);
    room.add(center);

    const box = new THREE.BoxGeometry();
    const shell = new THREE.Mesh(
      box,
      new THREE.MeshStandardMaterial({ color: "gray", side: THREE.BackSide })
    );
    shell.position.set(0, 13.2, 0);
    shell.scale.set(31.5, 28.5, 31.5);
    room.add(shell);

    const white = new THREE.MeshStandardMaterial({ color: 0xffffff });
    for (const def of ROOM_BLOCKS) {
      const mesh = new THREE.Mesh(box, white);
      mesh.position.set(...def.position);
      mesh.rotation.set(...def.rotation);
      mesh.scale.set(...def.scale);
      room.add(mesh);
    }

    for (const def of ROOM_FORMERS) {
      const geometry =
        def.kind === "ring" ? new THREE.RingGeometry(0.5, 1, 64) : new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        toneMapped: false
      });
      material.color
        .set(def.kind === "ring" ? config.highlight : "#ffffff")
        .multiplyScalar(def.intensity);
      if (def.kind === "ring") ringMaterial = material;
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...def.position);
      mesh.scale.set(...def.scale);
      if (def.lookAtCenter) mesh.lookAt(0, 0, 0);
      room.add(mesh);
      if (def.withLight) {
        const light = new THREE.PointLight(0xffffff, 100, 28, 2);
        light.position.set(...def.position);
        room.add(light);
      }
    }
  }

  function refreshEnvironment() {
    if (!roomScene) buildRoom();
    if (!roomScene) return;
    if (ringMaterial) ringMaterial.color.set(config.highlight).multiplyScalar(15);
    envTarget?.dispose();
    envTarget = pmrem.fromScene(roomScene, 0, 0.1, 1000);
    scene.environment = envTarget.texture;
  }

  let model: THREE.Object3D | null = null;
  let mixer: THREE.AnimationMixer | null = null;
  const actions = new Map<string, THREE.AnimationAction>();
  let activeAction: THREE.AnimationAction | null = null;
  let restingClip = "";
  // Seconds left on the entry clip. Counted in the render loop rather than with
  // a timer, so an off-screen object does not walk in while nobody is looking.
  let walkRemaining = 0;
  let walkTotal = 0;
  /** Crossfade length for this move, clamped to what its duration can pay for. */
  let walkHandover = 0;
  let walkFrom = 0;
  let walkTarget = 0;
  let walkFaded = false;
  let onWalkArrive: (() => void) | null = null;
  // Pivot in progress, and a move waiting for it to finish.
  let turnRemaining = 0;
  let turnFrom = 0;
  let turnTo = 0;
  let pendingWalk: { x: number; onArrive: (() => void) | null } | null = null;
  /** +1 faces the model's own forward, -1 mirrors it. */
  let facing = 1;
  // Ramps 0 to 1 once the entry lands, so the idle float and rocking fade in
  // instead of bending the walk-in into an arc.
  let settle = 0;
  // Seconds of stillness left before the resting clip plays again.
  let restHoldRemaining = 0;
  let modelMaxDim = 1;
  let loadedSrc: string | null = null;
  let loadedObject: THREE.Object3D | null = null;
  let loadToken = 0;
  let disposed = false;

  const loader = new GLTFLoader();

  function applyRoughness() {
    model?.traverse((node) => {
      const mesh = node as THREE.Mesh;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const material of materials) {
        const standard = material as THREE.MeshStandardMaterial;
        if (!standard || typeof standard.roughness !== "number") continue;
        if (standard.userData.baseRoughness === undefined) {
          standard.userData.baseRoughness = standard.roughness;
        }
        standard.roughness =
          config.roughness >= 0 ? config.roughness : standard.userData.baseRoughness;
      }
    });
  }

  function applyFit() {
    if (!model) return;
    fitGroup.scale.setScalar(config.scale / modelMaxDim);
    fitGroup.rotation.y = config.yaw;
  }

  function clearModel() {
    if (!model) return;
    mixer?.stopAllAction();
    mixer = null;
    actions.clear();
    activeAction = null;
    restingClip = "";
    walkRemaining = 0;
    walkTotal = 0;
    walkHandover = 0;
    walkFaded = false;
    onWalkArrive = null;
    turnRemaining = 0;
    pendingWalk = null;
    facing = 1;
    settle = 0;
    restHoldRemaining = 0;
    fitGroup.remove(model);
    disposeObject(model);
    model = null;
  }

  /** Each travelling clip keeps its own rate so stride and ground stay matched. */
  function speedFor(name: string) {
    if (name === config.runClip && config.runClipSpeed > 0) return config.runClipSpeed;
    if (name === config.entryClip && config.entryClipSpeed > 0) return config.entryClipSpeed;
    return config.clipSpeed;
  }

  /** Crossfades to `name`, or starts it outright if nothing is playing yet. */
  function fadeToClip(name: string, fade = config.clipFade) {
    const next = actions.get(name);
    if (!next || next === activeAction) return;
    restHoldRemaining = 0;
    next.reset();
    next.enabled = true;
    // A held resting clip runs once and clamps; the hold is the stillness.
    const held = name === restingClip && config.restHold > 0;
    next.loop = held ? THREE.LoopOnce : THREE.LoopRepeat;
    next.clampWhenFinished = held;
    next.setEffectiveTimeScale(speedFor(name));
    next.setEffectiveWeight(1);
    next.play();
    if (activeAction && fade > 0) activeAction.crossFadeTo(next, fade, true);
    else activeAction?.stop();
    activeAction = next;
  }

  function adoptModel(object: THREE.Object3D, clips: THREE.AnimationClip[]) {
    clearModel();
    model = object;
    const bounds = new THREE.Box3().setFromObject(model);
    const size = bounds.getSize(new THREE.Vector3());
    const offset = bounds.getCenter(new THREE.Vector3());
    modelMaxDim = Math.max(size.x, size.y, size.z, 1e-4);
    model.position.sub(offset);
    applyRoughness();
    applyFit();
    fitGroup.add(model);

    if (!clips.length) return;
    mixer = new THREE.AnimationMixer(model);
    for (const clip of clips) actions.set(clip.name, mixer.clipAction(clip));
    mixer.addEventListener("finished", (event) => {
      if (event.action !== activeAction || !config.restHold) return;
      // Jittered so a long idle never reads as a metronome.
      restHoldRemaining = config.restHold * (0.7 + Math.random() * 0.6);
    });

    const resting =
      (config.clip ? THREE.AnimationClip.findByName(clips, config.clip) : null) ?? clips[0];
    if (!resting) return;
    restingClip = resting.name;

    const entry = config.entryClip ? actions.get(config.entryClip) : undefined;
    if (reducedMotion || !entry) {
      fadeToClip(restingClip, 0);
      // Reduced motion still gets a posed model, just a frozen one.
      if (reducedMotion) mixer.setTime(resting.duration * 0.5);
      return;
    }

    // The entry is just a walk that starts off to one side.
    floatGroup.position.x = config.xOffset - config.entryTravel;
    beginWalk(config.xOffset, null, 0);
  }

  /**
   * Starts a move, or the pivot that has to precede it. `fade` is the crossfade
   * into the travelling clip; the entry passes 0 because nothing is playing yet.
   */
  function beginWalk(x: number, onArrive: (() => void) | null, fade = config.clipFade) {
    if (!config.entryClip || !actions.has(config.entryClip)) {
      floatGroup.position.x = x;
      onArrive?.();
      return;
    }
    const from = floatGroup.position.x;
    const distance = Math.abs(x - from);
    if (distance < 1e-3) {
      onArrive?.();
      return;
    }

    const direction = x > from ? 1 : -1;
    if (config.turnDuration > 0 && direction !== facing) {
      pendingWalk = { x, onArrive };
      // Stop here. Letting the previous move keep sliding through the pivot
      // carries the object backwards while it faces the other way.
      walkRemaining = 0;
      walkTotal = 0;
      onWalkArrive = null;
      turnFrom = fitGroup.rotation.y;
      turnTo = config.yaw * direction;
      turnRemaining = Math.max(config.turnDuration, 0.001);
      facing = direction;
      return;
    }

    // Gait by distance. Both clips are ground-locked, so the travel speed has to
    // change with the clip or the stride starts sliding. It takes a longer
    // distance to break into a run than it takes to keep one, so a destination
    // being nudged either side of the threshold does not shred the gait.
    const runClip = config.runClip !== "" ? actions.get(config.runClip) : undefined;
    const runnable = runClip !== undefined && config.runSpeed > 0;
    const threshold =
      config.runThreshold * (runnable && activeAction === runClip ? RUN_RELEASE : 1);
    const running = runnable && distance > threshold;
    const gaitClip = running ? config.runClip : config.entryClip;
    const gaitSpeed = running ? config.runSpeed : config.walkSpeed;

    restHoldRemaining = 0;
    walkFrom = from;
    walkTarget = x;
    walkTotal = distance / Math.max(gaitSpeed, 0.001);
    walkRemaining = walkTotal;
    // A move shorter than the crossfade cannot afford a full one at each end.
    // Left unclamped it blends into the travel clip and straight back out on
    // the next frame, and since each blend resets its clip, the object appears
    // to stutter rather than take a short step.
    walkHandover = Math.min(config.clipFade, walkTotal * 0.45);
    walkFaded = false;
    onWalkArrive = onArrive;
    fadeToClip(gaitClip, Math.min(fade, walkHandover));
  }

  async function loadModel() {
    // A mesh built in code needs neither the loader nor a token: it is already
    // here, so it can be adopted synchronously.
    if (config.object) {
      if (config.object === loadedObject) return;
      loadedObject = config.object;
      loadedSrc = null;
      loadToken += 1;
      adoptModel(config.object, []);
      // Deferred so `onLoad` always fires after the factory has returned, the
      // way the async src path does. Firing it inline would hand the caller a
      // callback before it has an instance to call back into.
      queueMicrotask(() => {
        if (!disposed) config.onLoad?.();
      });
      return;
    }
    loadedObject = null;

    const src = config.src;
    if (src === loadedSrc) return;
    loadedSrc = src;
    const token = ++loadToken;
    if (!src) {
      clearModel();
      return;
    }
    try {
      const gltf = await loader.loadAsync(src);
      if (disposed || token !== loadToken) {
        disposeObject(gltf.scene);
        return;
      }
      adoptModel(gltf.scene, gltf.animations);
      config.onLoad?.();
    } catch (error) {
      if (disposed || token !== loadToken) return;
      config.onError?.(error);
    }
  }

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reducedMotion = motionQuery.matches;
  const onMotionChange = () => {
    reducedMotion = motionQuery.matches;
    if (reducedMotion) floatGroup.rotation.set(0, 0, 0);
    applyOptions();
  };
  motionQuery.addEventListener("change", onMotionChange);

  function applyOptions() {
    scene.environmentIntensity = config.environmentIntensity;
    controls.enableRotate = config.orbit;
    controls.enableZoom = config.zoom;
    controls.autoRotate = config.autoRotate && !reducedMotion;
    controls.autoRotateSpeed = config.autoRotateSpeed;
    applyProjection();
    floatGroup.position.x = config.xOffset;
    floatGroup.position.y = MODEL_LIFT + config.yOffset;
    const pr = renderer.getPixelRatio();
    uniforms.uGridSize.value = Math.max(config.gridSize, 1) * pr;
    uniforms.uPixelSizeRatio.value = Math.max(config.pixelSizeRatio, 1);
    uniforms.uToneGain.value = config.toneGain;
    uniforms.uDitherGain.value = config.ditherGain;
    const fade = config.edgeFade;
    uniforms.uEdgeFadeL.value = typeof fade === "number" ? fade : fade[0];
    uniforms.uEdgeFadeR.value = typeof fade === "number" ? fade : fade[1];
    uniforms.uMethod.value = METHOD_INDEX[config.method] ?? 0;
    uniforms.uTintLow.value.set(config.tint[0]);
    uniforms.uTintMid.value.set(config.tint[1]);
    uniforms.uTintHigh.value.set(config.tint[2]);
    for (const [name, entry] of actions) entry.setEffectiveTimeScale(speedFor(name));
    applyRoughness();
    applyFit();
  }

  /** Keeps the visible height fixed and lets the width follow the canvas. */
  function applyProjection() {
    const width = Math.max(canvas.clientWidth, 1);
    const height = Math.max(canvas.clientHeight, 1);
    const halfHeight = config.frameHeight / 2;
    const halfWidth = halfHeight * (width / height);
    camera.left = -halfWidth;
    camera.right = halfWidth;
    camera.top = halfHeight;
    camera.bottom = -halfHeight;
    camera.updateProjectionMatrix();
  }

  function resize() {
    const width = Math.max(canvas.clientWidth, 1);
    const height = Math.max(canvas.clientHeight, 1);
    const pr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(pr);
    renderer.setSize(width, height, false);
    const pixelSize = Math.max(config.gridSize, 1) * Math.max(config.pixelSizeRatio, 1) * pr;
    const targetScale = Math.min(1, 2 / pixelSize);
    target.setSize(
      Math.max(Math.round(width * pr * targetScale), 1),
      Math.max(Math.round(height * pr * targetScale), 1)
    );
    uniforms.uResolution.value.set(Math.round(width * pr), Math.round(height * pr));
    uniforms.uGridSize.value = Math.max(config.gridSize, 1) * pr;
    applyProjection();
  }

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();
  applyOptions();
  void loadModel();

  let inView = true;
  let loopRunning = false;
  let lastTime = 0;
  let elapsed = Math.random() * 100;

  /**
   * Walks the entry clip down, sliding the object to its resting x and handing
   * over to the resting clip one fade-length before the travel ends, so the
   * blend lands with the arrival instead of following it.
   */
  function advanceTurn(delta: number) {
    if (turnRemaining <= 0) return;
    turnRemaining = Math.max(turnRemaining - delta, 0);
    const t = 1 - turnRemaining / Math.max(config.turnDuration, 0.001);
    const eased = t * t * (3 - 2 * t);
    fitGroup.rotation.y = turnFrom + (turnTo - turnFrom) * eased;
    if (turnRemaining > 0) return;
    fitGroup.rotation.y = turnTo;
    const queuedWalk = pendingWalk;
    pendingWalk = null;
    if (queuedWalk) beginWalk(queuedWalk.x, queuedWalk.onArrive);
  }

  function advanceWalk(delta: number) {
    if (walkRemaining <= 0) return;
    walkRemaining = Math.max(walkRemaining - delta, 0);
    // Linear: a walk cycle reads as sliding the moment the travel speed stops
    // matching the stride. The crossfade covers the last stretch, so nothing
    // has to decelerate.
    const progress = 1 - walkRemaining / walkTotal;
    floatGroup.position.x = walkFrom + (walkTarget - walkFrom) * progress;
    if (!walkFaded && walkRemaining <= walkHandover) {
      walkFaded = true;
      fadeToClip(restingClip, walkHandover);
    }
    if (walkRemaining > 0) return;
    floatGroup.position.x = walkTarget;
    const arrived = onWalkArrive;
    onWalkArrive = null;
    arrived?.();
    // The callback is free to start the next move, so idle means idle.
    if (walkRemaining <= 0 && turnRemaining <= 0 && !pendingWalk) config.onIdle?.();
  }

  /** Counts down the stillness, then replays the resting clip from the top. */
  function advanceRestHold(delta: number) {
    if (restHoldRemaining <= 0) return;
    restHoldRemaining -= delta;
    if (restHoldRemaining > 0) return;
    restHoldRemaining = 0;
    const rest = actions.get(restingClip);
    if (!rest || rest !== activeAction) return;
    rest.reset();
    rest.play();
  }

  function tick(time: number) {
    if (!inView) {
      lastTime = 0;
      stopLoop();
      return;
    }
    const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.1) : 0;
    lastTime = time;
    if (envDirty) {
      envDirty = false;
      refreshEnvironment();
    }
    controls.update();

    if (!reducedMotion) {
      elapsed += delta * config.floatSpeed;
      mixer?.update(delta);
      advanceTurn(delta);
      advanceWalk(delta);
      advanceRestHold(delta);

      const moving = walkRemaining > 0 || turnRemaining > 0;
      settle = moving ? 0 : Math.min(settle + delta / SETTLE_TIME, 1);
      const weight = settle * settle * (3 - 2 * settle);
      floatGroup.rotation.x = (Math.cos(elapsed / 4) / 8) * config.rotationIntensity * weight;
      floatGroup.rotation.y = (Math.sin(elapsed / 4) / 8) * config.rotationIntensity * weight;
      floatGroup.rotation.z = (Math.sin(elapsed / 4) / 20) * config.rotationIntensity * weight;
      floatGroup.position.y =
        MODEL_LIFT +
        config.yOffset +
        (Math.sin(elapsed / 1.5) / 10) * config.floatIntensity * weight;
    }

    // Last, so a caller driving the object itself overwrites the idle transform
    // rather than fighting it every other frame.
    config.onFrame?.(delta, floatGroup);

    renderer.setRenderTarget(target);
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
    renderer.render(postScene, postCamera);
  }

  function startLoop() {
    if (loopRunning || !inView || disposed) return;
    loopRunning = true;
    renderer.setAnimationLoop(tick);
  }

  function stopLoop() {
    if (!loopRunning) return;
    loopRunning = false;
    renderer.setAnimationLoop(null);
  }

  const viewObserver =
    typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver((entries) => {
          inView = entries[entries.length - 1]?.isIntersecting ?? true;
          if (inView) startLoop();
          else stopLoop();
        })
      : null;
  viewObserver?.observe(canvas);

  startLoop();

  return {
    setOptions(next: DitheredObjectOptions) {
      const previousHighlight = config.highlight;
      const previousDistance = config.cameraDistance;
      Object.assign(config, next);
      if (config.highlight !== previousHighlight) envDirty = true;
      if (config.cameraDistance !== previousDistance) {
        camera.position.copy(CAMERA_DIR).multiplyScalar(config.cameraDistance);
      }
      applyOptions();
      resize();
      void loadModel();
      startLoop();
    },
    playClip(name: string, fade?: number) {
      walkRemaining = 0;
      turnRemaining = 0;
      pendingWalk = null;
      onWalkArrive = null;
      fadeToClip(name, fade);
    },
    walkTo(x: number, onArrive?: () => void) {
      if (reducedMotion) {
        floatGroup.position.x = x;
        onArrive?.();
        return;
      }
      beginWalk(x, onArrive ?? null);
      startLoop();
    },
    face(direction: number) {
      if (reducedMotion || config.turnDuration <= 0) return;
      // A move already decides which way the object points; overriding it here
      // would leave it walking backwards.
      if (walkRemaining > 0 || turnRemaining > 0 || pendingWalk) return;
      const sign = direction >= 0 ? 1 : -1;
      if (sign === facing) return;
      turnFrom = fitGroup.rotation.y;
      turnTo = config.yaw * sign;
      turnRemaining = config.turnDuration;
      facing = sign;
      startLoop();
    },
    unitsPerPixel() {
      // Orthographic, so this ratio is exact everywhere in the frame.
      return config.frameHeight / Math.max(canvas.clientHeight, 1);
    },
    positionX() {
      return floatGroup.position.x;
    },
    toScene(point: { x: number; y: number }) {
      // Unprojecting gives a point on the near plane; the camera looks down 14°,
      // so it has to be walked along the view direction to reach z = 0. Deriving
      // the vertical scale by hand would drop that cosine and put every wall a
      // few pixels off.
      const width = Math.max(canvas.clientWidth, 1);
      const height = Math.max(canvas.clientHeight, 1);
      const near = scratchPoint
        .set((point.x / width) * 2 - 1, 1 - (point.y / height) * 2, -1)
        .unproject(camera);
      camera.getWorldDirection(scratchDirection);
      const travel = Math.abs(scratchDirection.z) > 1e-6 ? -near.z / scratchDirection.z : 0;
      return {
        x: near.x + scratchDirection.x * travel,
        y: near.y + scratchDirection.y * travel
      };
    },
    toCanvas(point: { x: number; y: number }) {
      const ndc = scratchPoint.set(point.x, point.y, 0).project(camera);
      return {
        x: (ndc.x * 0.5 + 0.5) * Math.max(canvas.clientWidth, 1),
        y: (1 - (ndc.y * 0.5 + 0.5)) * Math.max(canvas.clientHeight, 1)
      };
    },
    resize,
    destroy() {
      disposed = true;
      loadToken += 1;
      stopLoop();
      observer.disconnect();
      viewObserver?.disconnect();
      motionQuery.removeEventListener("change", onMotionChange);
      controls.dispose();
      clearModel();
      if (roomScene) disposeObject(roomScene);
      envTarget?.dispose();
      pmrem.dispose();
      target.dispose();
      postGeometry.dispose();
      postMaterial.dispose();
      renderer.dispose();
    }
  };
}
