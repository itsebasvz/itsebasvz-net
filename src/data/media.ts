import cdmxBlueHour16 from "../assets/photography/cdmx-blue-hour-16.jpg";
import roadSignal20 from "../assets/photography/road-signal-20.jpg";
import sebastianForest19 from "../assets/photography/sebastian-forest-19.jpg";
import signalTexture14Crop from "../assets/photography/signal-texture-14-crop.jpg";
import signalWall05 from "../assets/photography/signal-wall-05.jpg";
import signalWall08Crop from "../assets/photography/signal-wall-08-crop.jpg";
import signalWall09 from "../assets/photography/signal-wall-09.jpg";
import hackodsEvidence from "../assets/evidence/hackods-01.jpg";
import hbsEvidence from "../assets/evidence/hbs-02.jpg";
import helloWorldEvidence from "../assets/evidence/hello-world-04.jpg";
import obbEvidence from "../assets/evidence/obb-13.jpg";
import duetWorkerDone from "../assets/projects/duet/worker-done.png";
import duetWorkerRunning from "../assets/projects/duet/worker-running.png";
import hackodsIndicators from "../assets/projects/hackods/indicators.png";
import hackodsMapRanking from "../assets/projects/hackods/map-ranking.png";
import hackodsScatter from "../assets/projects/hackods/scatter.png";
import helloWorldAdmin from "../assets/projects/hello-world/admin-sanitized.png";
import helloWorldMember from "../assets/projects/hello-world/member-sanitized.png";
import helloWorldPublic from "../assets/projects/hello-world/public-surface.png";
import worldCupDesktop from "../assets/projects/world-cup-cdmx-guide/desktop.png";
import worldCupMobile from "../assets/projects/world-cup-cdmx-guide/mobile.png";
import type { MediaAssetId } from "./media-ids";

export const media = {
  "signal-wall-05": signalWall05,
  "signal-texture-14-crop": signalTexture14Crop,
  "signal-wall-08-crop": signalWall08Crop,
  "signal-wall-09": signalWall09,
  "cdmx-blue-hour-16": cdmxBlueHour16,
  "road-signal-20": roadSignal20,
  "sebastian-forest-19": sebastianForest19,
  "hackods-evidence": hackodsEvidence,
  "obb-evidence": obbEvidence,
  "hbs-evidence": hbsEvidence,
  "hello-world-evidence": helloWorldEvidence,
  "duet-worker-running": duetWorkerRunning,
  "duet-worker-done": duetWorkerDone,
  "world-cup-desktop": worldCupDesktop,
  "world-cup-mobile": worldCupMobile,
  "hello-world-public": helloWorldPublic,
  "hello-world-member": helloWorldMember,
  "hello-world-admin": helloWorldAdmin,
  "hackods-indicators": hackodsIndicators,
  "hackods-scatter": hackodsScatter,
  "hackods-map-ranking": hackodsMapRanking
} satisfies Record<MediaAssetId, { src: string; width: number; height: number; format: string }>;

export type MediaAsset = (typeof media)[MediaAssetId];
