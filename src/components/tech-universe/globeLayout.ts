import { technologies, clusterOf, ClusterId, clusterOrder } from './technologyData';

export interface Vec3 { x: number; y: number; z: number }

/**
 * Globe radius per device class. Desktop is a big showcase globe; mobile
 * shrinks so a portrait screen can still frame the whole body without the
 * camera flying inside it.
 */
export const globeRadiusFor = (isMobile: boolean): number => (isMobile ? 2.5 : 3.2);

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

/** Cluster "continents": a unit direction on the globe per cluster. */
const CLUSTER_DIR: Record<ClusterId, Vec3> = {
  frontend: { x: -0.72, y: 0.42, z: 0.55 },
  backend: { x: 0.74, y: 0.34, z: 0.56 },
  data: { x: 0.52, y: -0.5, z: -0.62 },
  services: { x: -0.5, y: 0.68, z: -0.55 },
  infra: { x: 0.55, y: 0.78, z: -0.35 },
  ops: { x: -0.45, y: -0.62, z: -0.62 },
};

const cross = (a: Vec3, b: Vec3): Vec3 => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x,
});

const UP: Vec3 = { x: 0, y: 1, z: 0 };
const AXIS: Vec3 = { x: 1, y: 0, z: 0 };

const norm = (v: Vec3): Vec3 => {
  const l = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / l, y: v.y / l, z: v.z / l };
};

/** Scatter a cluster's members over a small spherical cap around its center
 *  direction. Deterministic from the (stable) data order - no per-render jitter. */
function placeCluster(clusterId: ClusterId, radius: number): Record<string, Vec3> {
  const members = technologies.filter((t) => clusterOf(t) === clusterId);
  const n = members.length;
  if (n === 0) return {};
  const dir = norm(CLUSTER_DIR[clusterId]);
  let u = cross(dir, UP);
  if (Math.hypot(u.x, u.y, u.z) < 1e-4) u = cross(dir, AXIS);
  u = norm(u);
  const v = norm(cross(dir, u));
  const cap = 0.34 * Math.min(1.3, 0.55 + n * 0.06);

  const out: Record<string, Vec3> = {};
  members.forEach((t, k) => {
    const r = cap * Math.sqrt((k + 0.5) / n);
    const a = GOLDEN_ANGLE * k;
    const cu = Math.cos(a) * r;
    const cv = Math.sin(a) * r;
    const cx = dir.x + u.x * cu + v.x * cv;
    const cy = dir.y + u.y * cu + v.y * cv;
    const cz = dir.z + u.z * cu + v.z * cv;
    const d = norm({ x: cx, y: cy, z: cz });
    out[t.id] = { x: d.x * radius, y: d.y * radius, z: d.z * radius };
  });
  return out;
}

/** Deterministic globe layout for a given radius, keyed by tech id. */
export function buildGlobePositions(radius: number): Record<string, Vec3> {
  const out: Record<string, Vec3> = {};
  for (const cid of clusterOrder) Object.assign(out, placeCluster(cid, radius));
  return out;
}