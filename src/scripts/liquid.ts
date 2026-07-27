/**
 * Vanilla port of Canvas UI's "Liquid": a pointer-driven fluid simulation drawn
 * as a translucent trail. WebGL2, no dependencies.
 *
 * The original ships two rendering paths. The first captures the live DOM into
 * a canvas through Chrome's experimental `drawElementImage` / `requestPaint`
 * API and warps it; the second, taken whenever that API is missing, draws only
 * the tinted trail. Since the experimental path is behind a flag it would be
 * dead code here, so only the trail path is ported. That also drops the
 * `distortion` and `blend` options, which do nothing without a content texture.
 *
 * Added: `opacity`, which caps the trail's alpha — the one knob that makes the
 * effect discreet without flattening the motion.
 */

export interface LiquidOptions {
  /** Resolution of the simulation grid. */
  simResolution?: number;
  /** Resolution of the fluid trail texture. */
  dyeResolution?: number;
  /** How much the trail persists each frame (closer to 1 lasts longer). */
  densityDissipation?: number;
  /** How much motion persists each frame (closer to 1 lasts longer). */
  velocityDissipation?: number;
  /** How much pressure carries over between frames. */
  pressure?: number;
  /** Pressure solver iterations. */
  pressureIterations?: number;
  /** Rotational force added back into the flow. */
  curl?: number;
  /** Radius of the pointer splat. */
  radius?: number;
  /** Force multiplier applied on pointer movement. */
  force?: number;
  /** Strength of the color tint left by the flow. */
  intensity?: number;
  /** Ceiling applied to the trail's alpha, 0 to 1. */
  opacity?: number;
  /**
   * Fraction of the height, measured from the top, over which the trail fades
   * out completely. 0.75 leaves the bottom quarter clear. 0 disables the fade.
   */
  fadeEnd?: number;
  /** Trail color as [r, g, b] in 0-1 sRGB. Ignored when rainbow is on. */
  color?: [number, number, number];
  /** Color the trail from the flow direction instead of a fixed color. */
  rainbow?: boolean;
}

export interface LiquidElements {
  /** Canvas the effect renders to. */
  output: HTMLCanvasElement;
  /** Element whose pointer movement stirs the fluid. Defaults to the canvas parent. */
  pointerTarget?: HTMLElement;
}

export interface LiquidInstance {
  /** Inject a splat at (x, y) in [0,1] space with velocity (dx, dy). */
  splat: (x: number, y: number, dx: number, dy: number) => void;
  /** Update simulation options live. Resolution changes are ignored. */
  setOptions: (options: LiquidOptions) => void;
  /** Re-read canvas size. Call when the element is resized. */
  resize: () => void;
  /** Stop the loop and release all GPU resources. */
  destroy: () => void;
}

const DEFAULTS: Required<LiquidOptions> = {
  simResolution: 128,
  dyeResolution: 512,
  densityDissipation: 0.96,
  velocityDissipation: 1,
  pressure: 0.8,
  pressureIterations: 4,
  curl: 1.9,
  radius: 0.3,
  force: 1.1,
  intensity: 2,
  opacity: 1,
  fadeEnd: 0,
  color: [0.145, 0.239, 0.867],
  rainbow: false
};

const DT = 1 / 60;

function srgbToLinear(value: number): number {
  return value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
}

const VERT = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aPos;
out vec2 vUv;
out vec2 vL;
out vec2 vR;
out vec2 vT;
out vec2 vB;
uniform vec2 texelSize;
void main () {
  vUv = aPos * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG_DISPLAY = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform sampler2D uFluid;
uniform vec3 uColor;
uniform float uIntensity;
uniform float uOpacity;
uniform float uFadeEnd;
uniform float uRainbow;
vec3 toSrgb (vec3 c) {
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}
void main () {
  vec3 fluid = texture(uFluid, vUv).rgb;
  float mag = length(fluid);
  vec3 tint = uRainbow == 1.0
    ? clamp(fluid / max(mag, 1e-3), 0.0, 1.0)
    : uColor;
  // vUv.y is 1 at the top, so this holds the trail at full strength up there
  // and ramps it to nothing by uFadeEnd of the way down.
  float fade = uFadeEnd > 0.0 ? smoothstep(1.0 - uFadeEnd, 1.0, vUv.y) : 1.0;
  float overlay = (1.0 - exp(-mag * uIntensity * 0.5)) * 0.82 * uOpacity * fade;
  outColor = vec4(toSrgb(clamp(tint, 0.0, 1.0)) * overlay, overlay);
}`;

const FRAG_SPLAT = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform sampler2D uTarget;
uniform float uAspect;
uniform vec3 uColor;
uniform vec2 uPoint;
uniform float uRadius;
void main () {
  vec2 p = vUv - uPoint;
  p.x *= uAspect;
  vec3 splat = exp(-dot(p, p) / uRadius) * uColor;
  vec3 base = texture(uTarget, vUv).xyz;
  outColor = vec4(base + splat, 1.0);
}`;

const FRAG_ADVECT = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform float uDt;
uniform float uDissipation;
void main () {
  vec2 coord = vUv - uDt * texture(uVelocity, vUv).xy * texelSize;
  outColor = uDissipation * texture(uSource, coord);
  outColor.a = 1.0;
}`;

const FRAG_CLEAR = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform sampler2D uTexture;
uniform float uValue;
void main () {
  outColor = uValue * texture(uTexture, vUv);
}`;

const FRAG_DIVERGENCE = `#version 300 es
precision highp float;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
out vec4 outColor;
uniform sampler2D uVelocity;
void main () {
  float L = texture(uVelocity, vL).x;
  float R = texture(uVelocity, vR).x;
  float T = texture(uVelocity, vT).y;
  float B = texture(uVelocity, vB).y;
  vec2 C = texture(uVelocity, vUv).xy;
  if (vL.x < 0.0) { L = -C.x; }
  if (vR.x > 1.0) { R = -C.x; }
  if (vT.y > 1.0) { T = -C.y; }
  if (vB.y < 0.0) { B = -C.y; }
  float div = 0.5 * (R - L + T - B);
  outColor = vec4(div, 0.0, 0.0, 1.0);
}`;

const FRAG_CURL = `#version 300 es
precision highp float;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
out vec4 outColor;
uniform sampler2D uVelocity;
void main () {
  float L = texture(uVelocity, vL).y;
  float R = texture(uVelocity, vR).y;
  float T = texture(uVelocity, vT).x;
  float B = texture(uVelocity, vB).x;
  float vorticity = R - L - T + B;
  outColor = vec4(vorticity, 0.0, 0.0, 1.0);
}`;

const FRAG_VORTICITY = `#version 300 es
precision highp float;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
out vec4 outColor;
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float uCurlStrength;
uniform float uDt;
void main () {
  float L = texture(uCurl, vL).x;
  float R = texture(uCurl, vR).x;
  float T = texture(uCurl, vT).x;
  float B = texture(uCurl, vB).x;
  float C = texture(uCurl, vUv).x;
  vec2 force = vec2(abs(T) - abs(B), abs(R) - abs(L)) * 0.5;
  force /= length(force) + 1.0;
  force *= uCurlStrength * C;
  force.y *= -1.0;
  vec2 velocity = texture(uVelocity, vUv).xy;
  outColor = vec4(velocity + force * uDt, 0.0, 1.0);
}`;

const FRAG_PRESSURE = `#version 300 es
precision highp float;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
out vec4 outColor;
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
void main () {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  float divergence = texture(uDivergence, vUv).x;
  float pressure = (L + R + B + T - divergence) * 0.25;
  outColor = vec4(pressure, 0.0, 0.0, 1.0);
}`;

const FRAG_GRADIENT = `#version 300 es
precision highp float;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
out vec4 outColor;
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
void main () {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  vec2 velocity = texture(uVelocity, vUv).xy;
  velocity.xy -= vec2(R - L, T - B);
  outColor = vec4(velocity, 0.0, 1.0);
}`;

interface Target {
  fbo: WebGLFramebuffer;
  texture: WebGLTexture;
  width: number;
  height: number;
}

interface DoubleTarget {
  readonly read: Target;
  readonly write: Target;
  swap: () => void;
}

interface Program {
  program: WebGLProgram;
  /** Uniform locations are looked up by name; missing ones bind as null. */
  u: (name: string) => WebGLUniformLocation | null;
}

export function createLiquid(
  elements: LiquidElements,
  options: LiquidOptions = {}
): LiquidInstance | null {
  const config: Required<LiquidOptions> = { ...DEFAULTS, ...options };
  const { output } = elements;

  const context = output.getContext("webgl2", {
    alpha: true,
    depth: false,
    stencil: false,
    antialias: false,
    premultipliedAlpha: true
  });
  if (!context || context.isContextLost()) return null;
  const gl = context;

  // Half-float render targets are what the solver writes to; without this the
  // framebuffers come back incomplete and every pass reads black.
  if (!gl.getExtension("EXT_color_buffer_float")) return null;
  const supportsLinear = Boolean(gl.getExtension("OES_texture_float_linear"));
  const filtering = supportsLinear ? gl.LINEAR : gl.NEAREST;

  const shaders: WebGLShader[] = [];
  const programs: WebGLProgram[] = [];

  function compile(type: number, source: string): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Liquid shader error:", gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    shaders.push(shader);
    return shader;
  }

  const vertexShader = compile(gl.VERTEX_SHADER, VERT);

  function createProgram(fragSource: string): Program | null {
    const fragment = compile(gl.FRAGMENT_SHADER, fragSource);
    const program = gl.createProgram();
    if (!vertexShader || !fragment || !program) return null;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return null;
    }
    programs.push(program);
    const locations = new Map<string, WebGLUniformLocation>();
    const count: number = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < count; i++) {
      const info = gl.getActiveUniform(program, i);
      if (!info) continue;
      const location = gl.getUniformLocation(program, info.name);
      if (location) locations.set(info.name, location);
    }
    return { program, u: (name) => locations.get(name) ?? null };
  }

  function abandon() {
    programs.forEach((program) => gl.deleteProgram(program));
    shaders.forEach((shader) => gl.deleteShader(shader));
    return null;
  }

  const maybeDisplay = createProgram(FRAG_DISPLAY);
  const maybeSplat = createProgram(FRAG_SPLAT);
  const maybeAdvect = createProgram(FRAG_ADVECT);
  const maybeClear = createProgram(FRAG_CLEAR);
  const maybeDivergence = createProgram(FRAG_DIVERGENCE);
  const maybeCurl = createProgram(FRAG_CURL);
  const maybeVorticity = createProgram(FRAG_VORTICITY);
  const maybePressure = createProgram(FRAG_PRESSURE);
  const maybeGradient = createProgram(FRAG_GRADIENT);

  if (
    !maybeDisplay ||
    !maybeSplat ||
    !maybeAdvect ||
    !maybeClear ||
    !maybeDivergence ||
    !maybeCurl ||
    !maybeVorticity ||
    !maybePressure ||
    !maybeGradient
  ) {
    return abandon();
  }

  // Re-bound after the guard: narrowing of a `const` does not reach into
  // hoisted function declarations, but the inferred type of a fresh `const`
  // does.
  const display = maybeDisplay;
  const splat = maybeSplat;
  const advect = maybeAdvect;
  const clear = maybeClear;
  const divergenceProgram = maybeDivergence;
  const curlProgram = maybeCurl;
  const vorticity = maybeVorticity;
  const pressureProgram = maybePressure;
  const gradient = maybeGradient;

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW
  );
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  function createTarget(
    size: number,
    internalFormat: number,
    format: number,
    filter: number
  ): Target | null {
    const texture = gl.createTexture();
    const fbo = gl.createFramebuffer();
    if (!texture || !fbo) return null;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      internalFormat,
      size,
      size,
      0,
      format,
      gl.HALF_FLOAT,
      null
    );
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture,
      0
    );
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      gl.deleteFramebuffer(fbo);
      gl.deleteTexture(texture);
      return null;
    }
    gl.viewport(0, 0, size, size);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return { fbo, texture, width: size, height: size };
  }

  function createDoubleTarget(
    size: number,
    internalFormat: number,
    format: number,
    filter: number
  ): DoubleTarget | null {
    let read = createTarget(size, internalFormat, format, filter);
    let write = createTarget(size, internalFormat, format, filter);
    if (!read || !write) return null;
    return {
      get read() {
        return read as Target;
      },
      get write() {
        return write as Target;
      },
      swap() {
        const held = read;
        read = write;
        write = held;
      }
    };
  }

  const maybeVelocity = createDoubleTarget(config.simResolution, gl.RG16F, gl.RG, filtering);
  const maybeDye = createDoubleTarget(config.dyeResolution, gl.RGBA16F, gl.RGBA, filtering);
  const maybeDivergenceTarget = createTarget(config.simResolution, gl.R16F, gl.RED, gl.NEAREST);
  const maybeCurlTarget = createTarget(config.simResolution, gl.R16F, gl.RED, gl.NEAREST);
  const maybePressureTarget = createDoubleTarget(
    config.simResolution,
    gl.R16F,
    gl.RED,
    gl.NEAREST
  );

  if (
    !maybeVelocity ||
    !maybeDye ||
    !maybeDivergenceTarget ||
    !maybeCurlTarget ||
    !maybePressureTarget
  ) {
    return abandon();
  }

  const velocity = maybeVelocity;
  const dye = maybeDye;
  const divergence = maybeDivergenceTarget;
  const curl = maybeCurlTarget;
  const pressure = maybePressureTarget;

  function releaseAll() {
    for (const target of [
      velocity.read,
      velocity.write,
      dye.read,
      dye.write,
      pressure.read,
      pressure.write,
      divergence,
      curl
    ]) {
      gl.deleteFramebuffer(target.fbo);
      gl.deleteTexture(target.texture);
    }
  }

  let texelX = 0;
  let texelY = 0;

  function updateTexelSize() {
    const width = Math.max(output.clientWidth, 1);
    const height = Math.max(output.clientHeight, 1);
    texelX = 1 / (config.simResolution * (width / (height + 400)));
    texelY = 1 / config.simResolution;
  }

  function syncCanvasSize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(output.clientWidth * dpr));
    const height = Math.max(1, Math.round(output.clientHeight * dpr));
    if (output.width !== width || output.height !== height) {
      output.width = width;
      output.height = height;
    }
    updateTexelSize();
  }

  syncCanvasSize();

  function blit(target: Target | null) {
    if (target) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      gl.viewport(0, 0, target.width, target.height);
    } else {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, output.width, output.height);
    }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  function bindTexture(texture: WebGLTexture, unit: number): number {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    return unit;
  }

  function applySplat(x: number, y: number, dx: number, dy: number) {
    const aspect = output.clientWidth / Math.max(output.clientHeight, 1);
    const radius = config.radius / 100;

    gl.useProgram(splat.program);
    gl.uniform1i(splat.u("uTarget"), bindTexture(velocity.read.texture, 0));
    gl.uniform1f(splat.u("uAspect"), aspect);
    gl.uniform2f(splat.u("uPoint"), x, y);
    gl.uniform3f(splat.u("uColor"), dx, dy, 10);
    gl.uniform1f(splat.u("uRadius"), radius);
    blit(velocity.write);
    velocity.swap();

    gl.uniform1i(splat.u("uTarget"), bindTexture(dye.read.texture, 0));
    blit(dye.write);
    dye.swap();
  }

  function step(delta: number) {
    gl.disable(gl.BLEND);

    gl.useProgram(curlProgram.program);
    gl.uniform2f(curlProgram.u("texelSize"), texelX, texelY);
    gl.uniform1i(curlProgram.u("uVelocity"), bindTexture(velocity.read.texture, 0));
    blit(curl);

    gl.useProgram(vorticity.program);
    gl.uniform2f(vorticity.u("texelSize"), texelX, texelY);
    gl.uniform1i(vorticity.u("uVelocity"), bindTexture(velocity.read.texture, 0));
    gl.uniform1i(vorticity.u("uCurl"), bindTexture(curl.texture, 1));
    gl.uniform1f(vorticity.u("uCurlStrength"), config.curl);
    gl.uniform1f(vorticity.u("uDt"), DT);
    blit(velocity.write);
    velocity.swap();

    gl.useProgram(divergenceProgram.program);
    gl.uniform2f(divergenceProgram.u("texelSize"), texelX, texelY);
    gl.uniform1i(divergenceProgram.u("uVelocity"), bindTexture(velocity.read.texture, 0));
    blit(divergence);

    gl.useProgram(clear.program);
    gl.uniform1i(clear.u("uTexture"), bindTexture(pressure.read.texture, 0));
    gl.uniform1f(clear.u("uValue"), Math.pow(config.pressure, delta * 60));
    blit(pressure.write);
    pressure.swap();

    gl.useProgram(pressureProgram.program);
    gl.uniform2f(pressureProgram.u("texelSize"), texelX, texelY);
    gl.uniform1i(pressureProgram.u("uDivergence"), bindTexture(divergence.texture, 0));
    for (let i = 0; i < config.pressureIterations; i++) {
      gl.uniform1i(pressureProgram.u("uPressure"), bindTexture(pressure.read.texture, 1));
      blit(pressure.write);
      pressure.swap();
    }

    gl.useProgram(gradient.program);
    gl.uniform2f(gradient.u("texelSize"), texelX, texelY);
    gl.uniform1i(gradient.u("uPressure"), bindTexture(pressure.read.texture, 0));
    gl.uniform1i(gradient.u("uVelocity"), bindTexture(velocity.read.texture, 1));
    blit(velocity.write);
    velocity.swap();

    gl.useProgram(advect.program);
    gl.uniform2f(advect.u("texelSize"), texelX, texelY);
    gl.uniform1i(advect.u("uVelocity"), bindTexture(velocity.read.texture, 0));
    gl.uniform1i(advect.u("uSource"), bindTexture(velocity.read.texture, 0));
    gl.uniform1f(advect.u("uDt"), DT);
    gl.uniform1f(
      advect.u("uDissipation"),
      Math.pow(config.velocityDissipation, delta * 60)
    );
    blit(velocity.write);
    velocity.swap();

    gl.uniform1i(advect.u("uVelocity"), bindTexture(velocity.read.texture, 0));
    gl.uniform1i(advect.u("uSource"), bindTexture(dye.read.texture, 1));
    gl.uniform1f(
      advect.u("uDissipation"),
      Math.pow(config.densityDissipation, delta * 60)
    );
    blit(dye.write);
    dye.swap();
  }

  function render() {
    gl.useProgram(display.program);
    gl.uniform1i(display.u("uFluid"), bindTexture(dye.read.texture, 1));
    gl.uniform3f(
      display.u("uColor"),
      srgbToLinear(config.color[0]),
      srgbToLinear(config.color[1]),
      srgbToLinear(config.color[2])
    );
    gl.uniform1f(display.u("uIntensity"), config.intensity);
    gl.uniform1f(display.u("uOpacity"), config.opacity);
    gl.uniform1f(display.u("uFadeEnd"), config.fadeEnd);
    gl.uniform1f(display.u("uRainbow"), config.rainbow ? 1 : 0);
    blit(null);
  }

  const queued: Array<[number, number, number, number]> = [];

  let raf = 0;
  let lastTime = performance.now();
  let destroyed = false;
  let running = false;
  let visible = true;
  let idleAt = 0;

  /** How long the trail needs to fade out, so the loop can stop once it has. */
  function idleDelayMs() {
    const dissipation = Math.min(config.densityDissipation, 0.999);
    const frames = Math.log(1e-7) / Math.log(dissipation);
    return (frames / 60) * 1000;
  }

  function frame(now: number) {
    if (destroyed) return;
    if (!visible) {
      running = false;
      return;
    }
    const delta = Math.min((now - lastTime) / 1000, 1 / 30);
    lastTime = now;
    if (queued.length > 0) {
      idleAt = now + idleDelayMs();
      for (const entry of queued.splice(0)) applySplat(...entry);
    }
    step(delta);
    render();
    if (now >= idleAt) {
      running = false;
      return;
    }
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (destroyed || running || !visible) return;
    running = true;
    lastTime = performance.now();
    raf = requestAnimationFrame(frame);
  }

  start();

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reducedMotion = motionQuery.matches;
  const onMotionChange = () => {
    reducedMotion = motionQuery.matches;
    if (!reducedMotion) start();
  };
  motionQuery.addEventListener("change", onMotionChange);

  const pointers = new Map<number, { x: number; y: number }>();

  function onPointerMove(event: PointerEvent) {
    if (reducedMotion) return;
    const rect = output.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;
    const previous = pointers.get(event.pointerId);
    pointers.set(event.pointerId, { x: px, y: py });
    if (!previous) return;
    const dx = (px - previous.x) * config.force;
    const dy = -(py - previous.y) * config.force;
    queued.push([px / rect.width, 1 - py / rect.height, dx, dy]);
    start();
  }

  function onPointerLeave(event: PointerEvent) {
    pointers.delete(event.pointerId);
  }

  const listenTarget = elements.pointerTarget ?? output.parentElement ?? output;
  listenTarget.addEventListener("pointermove", onPointerMove);
  listenTarget.addEventListener("pointerleave", onPointerLeave);
  listenTarget.addEventListener("pointercancel", onPointerLeave);

  const observer = new ResizeObserver(() => {
    syncCanvasSize();
    start();
  });
  observer.observe(output);

  const intersection = new IntersectionObserver((entries) => {
    visible = entries[entries.length - 1]?.isIntersecting ?? true;
    if (visible) start();
  });
  intersection.observe(output);

  return {
    splat(x, y, dx, dy) {
      if (reducedMotion) return;
      queued.push([x, y, dx, dy]);
      start();
    },
    setOptions(next) {
      const { simResolution, dyeResolution, ...rest } = next;
      void simResolution;
      void dyeResolution;
      Object.assign(config, rest);
      start();
    },
    resize() {
      syncCanvasSize();
      start();
    },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      intersection.disconnect();
      motionQuery.removeEventListener("change", onMotionChange);
      listenTarget.removeEventListener("pointermove", onPointerMove);
      listenTarget.removeEventListener("pointerleave", onPointerLeave);
      listenTarget.removeEventListener("pointercancel", onPointerLeave);
      releaseAll();
      programs.forEach((program) => gl.deleteProgram(program));
      shaders.forEach((shader) => gl.deleteShader(shader));
      gl.deleteBuffer(quad);
    }
  };
}
