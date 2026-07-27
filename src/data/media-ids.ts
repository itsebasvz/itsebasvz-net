export const mediaAssetIds = [
  "signal-wall-05",
  "signal-texture-14-crop",
  "signal-wall-08-crop",
  "signal-wall-09",
  "cdmx-blue-hour-16",
  "road-signal-20",
  "sebastian-forest-19",
  "hackods-evidence",
  "obb-evidence",
  "hbs-evidence",
  "hello-world-evidence",
  "duet-worker-running",
  "duet-worker-done",
  "world-cup-desktop",
  "world-cup-mobile",
  "hello-world-public",
  "hello-world-member",
  "hello-world-admin",
  "hackods-indicators",
  "hackods-scatter",
  "hackods-map-ranking"
] as const;

export type MediaAssetId = (typeof mediaAssetIds)[number];
