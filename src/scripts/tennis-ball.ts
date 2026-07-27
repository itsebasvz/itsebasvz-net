import * as THREE from "three";

/**
 * A tennis ball: a matte sphere and the one closed seam that wraps it.
 *
 * A tennis ball is two identical dumbbell-shaped pieces joined along a single
 * closed curve — what looks like two arcs on the face of the ball is the near
 * and far halves of the same seam. That curve is the whole identity of the
 * object, so it is built as real geometry rather than painted into a vertex
 * colour: a ribbon following the curve stays smooth at any sphere resolution,
 * where a painted seam would come out as a staircase unless the mesh carried
 * an order of magnitude more triangles.
 *
 * The seam is drawn far wider than a real one. At 45 px through a 3 px dither
 * screen, 2% of the diameter is a third of a cell and simply does not exist.
 */

export interface TennisBallOptions {
  /** Radius of the built sphere. The renderer refits it, so this is arbitrary. */
  radius?: number;
  /** Icosphere subdivision. 3 gives 1280 triangles, round to 0.3% of a pixel. */
  detail?: number;
  /** Half-width of the seam, as an angle on the surface in radians. */
  seamWidth?: number;
  /** Samples along the closed curve. */
  seamSegments?: number;
  /** How far the ribbon floats over the sphere, as a fraction of the radius. */
  seamLift?: number;
  /** Albedo of the felt, in sRGB. */
  feltColor?: number;
  /** Albedo at the centre of the seam, in sRGB. */
  seamColor?: number;
  /** Albedo where the seam meets the felt, in sRGB. */
  seamEdgeColor?: number;
  /** Euler applied to the whole ball, to choose which face it rests on. */
  orientation?: readonly [number, number, number];
}

const DEFAULTS: Required<TennisBallOptions> = {
  radius: 1,
  detail: 3,
  // 11% of the diameter against a real ball's 3%. At 45 px that is 5 px, or a
  // shade under two dither cells — the narrowest a seam can be and still exist.
  seamWidth: 0.105,
  seamSegments: 192,
  seamLift: 0.004,
  feltColor: 0xf1f1f1,
  // Not black, for the same reason the football's pentagons were not: a value
  // that falls under the dither threshold is punched out to transparent, and a
  // transparent seam reaching the silhouette takes a bite out of the outline.
  seamColor: 0x383838,
  // Close to the felt, so the ribbon's outer edge blends instead of stepping.
  seamEdgeColor: 0xc4c4c4,
  orientation: [0, 0, 0]
};

/**
 * The seam curve. Writing it as
 *   x = a·cos t + b·cos 3t,  y = a·sin t − b·sin 3t,  z = c·sin 2t
 * lands on the unit sphere exactly when c² = 4ab and a + b = 1, because the
 * cos 4t terms then cancel. Picking the peak latitude fixes the rest: a peak of
 * 60° means c = sin 60° = √3/2, so ab = 3/16 and a, b are 3/4 and 1/4.
 */
const A = 0.75;
const B = 0.25;
const C = Math.sqrt(3) / 2;

function seamPoint(t: number, out: THREE.Vector3) {
  return out.set(
    A * Math.cos(t) + B * Math.cos(3 * t),
    A * Math.sin(t) - B * Math.sin(3 * t),
    C * Math.sin(2 * t)
  );
}

function seamTangent(t: number, out: THREE.Vector3) {
  return out
    .set(
      -A * Math.sin(t) - 3 * B * Math.sin(3 * t),
      A * Math.cos(t) - 3 * B * Math.cos(3 * t),
      2 * C * Math.cos(2 * t)
    )
    .normalize();
}

/** Cross-section of the ribbon, as fractions of the seam half-width. */
const RIBBON = [-1, -0.5, 0, 0.5, 1];

export function createTennisBall(options: TennisBallOptions = {}): THREE.Object3D {
  const config = { ...DEFAULTS, ...options };
  const { radius } = config;

  const felt = new THREE.Color().setHex(config.feltColor, THREE.SRGBColorSpace);
  const core = new THREE.Color().setHex(config.seamColor, THREE.SRGBColorSpace);
  const edge = new THREE.Color().setHex(config.seamEdgeColor, THREE.SRGBColorSpace);

  // IcosahedronGeometry ships flat per-face normals, which on a ball this size
  // reads as a cut gem. Every vertex is on the sphere, so the smooth normal is
  // just the normalised position.
  const sphere = new THREE.IcosahedronGeometry(radius, config.detail);
  const spherePositions = sphere.getAttribute("position");
  const sphereNormals = new Float32Array(spherePositions.count * 3);
  const unit = new THREE.Vector3();
  for (let i = 0; i < spherePositions.count; i++) {
    unit.fromBufferAttribute(spherePositions, i).normalize();
    sphereNormals[i * 3] = unit.x;
    sphereNormals[i * 3 + 1] = unit.y;
    sphereNormals[i * 3 + 2] = unit.z;
  }
  sphere.setAttribute("normal", new THREE.BufferAttribute(sphereNormals, 3));

  const feltMesh = new THREE.Mesh(
    sphere,
    new THREE.MeshStandardMaterial({
      color: felt,
      metalness: 0,
      // Felt, not plastic. High enough to kill the specular, low enough that the
      // diffuse gradient still carries the volume the dither needs.
      roughness: 0.62
    })
  );

  const positions: number[] = [];
  const normals: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];

  const point = new THREE.Vector3();
  const tangent = new THREE.Vector3();
  const across = new THREE.Vector3();
  const vertex = new THREE.Vector3();
  const tone = new THREE.Color();
  const spread = Math.tan(config.seamWidth);
  const lift = radius * (1 + config.seamLift);

  for (let i = 0; i <= config.seamSegments; i++) {
    const t = (i / config.seamSegments) * Math.PI * 2;
    seamPoint(t, point);
    seamTangent(t, tangent);
    // Perpendicular to the seam and tangent to the sphere, so the ribbon lies
    // along the surface instead of cutting through it.
    across.crossVectors(point, tangent).normalize();

    for (const offset of RIBBON) {
      vertex.copy(point).addScaledVector(across, offset * spread).normalize();
      normals.push(vertex.x, vertex.y, vertex.z);
      positions.push(vertex.x * lift, vertex.y * lift, vertex.z * lift);
      // Squared so the dark core holds its width and only the last sliver ramps
      // out to the felt.
      tone.copy(core).lerp(edge, Math.abs(offset) ** 2);
      colors.push(tone.r, tone.g, tone.b);
    }
  }

  const stride = RIBBON.length;
  for (let i = 0; i < config.seamSegments; i++) {
    for (let j = 0; j < stride - 1; j++) {
      const a = i * stride + j;
      const b = a + 1;
      const c = a + stride;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }

  const ribbon = new THREE.BufferGeometry();
  ribbon.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  ribbon.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  ribbon.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  ribbon.setIndex(indices);

  const seamMesh = new THREE.Mesh(
    ribbon,
    new THREE.MeshStandardMaterial({
      vertexColors: true,
      metalness: 0,
      roughness: 0.7,
      // The ribbon is a strip with no inside, and its far half is occluded by
      // the sphere anyway. Double-siding it costs nothing and removes the
      // question of which way each quad happens to be wound.
      side: THREE.DoubleSide
    })
  );

  const ball = new THREE.Group();
  ball.add(feltMesh, seamMesh);
  ball.rotation.set(...config.orientation);
  feltMesh.frustumCulled = false;
  seamMesh.frustumCulled = false;
  return ball;
}

export interface BallPose {
  /** Scene-space centre. */
  x: number;
  y: number;
  /** Roll angle in radians. */
  angle: number;
}

/**
 * Writes a pose onto the group the renderer hands back each frame.
 *
 * A ball rolling on the ground, seen from a camera that is very nearly side-on,
 * behaves like a wheel in profile: the axis is the camera's own view direction,
 * not a world axis. The vector below mirrors `CAMERA_DIR` in
 * `dithered-object.ts`, which is fixed and independent of camera distance.
 */
export function createBallPose() {
  const axis = new THREE.Vector3(0, -1, 4).normalize();
  return (root: THREE.Object3D, pose: BallPose) => {
    root.position.set(pose.x, pose.y, 0);
    root.quaternion.setFromAxisAngle(axis, pose.angle);
  };
}
