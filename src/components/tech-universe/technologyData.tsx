import React from 'react';
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiRedux,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiPrisma,
  SiJsonwebtokens,
  SiFirebase,
  SiSupabase,
  SiDocker,
  SiKubernetes,
  SiLinux,
  SiGit,
  SiGithub,
  SiGithubactions,
  SiNginx,
  SiVercel,
  SiRailway,
  SiGrafana,
  SiPrometheus,
  SiApachekafka,
  SiRedis,
  SiPostman,
  SiK6,
} from 'react-icons/si';

export type TechIcon = React.ComponentType<{ size?: number; color?: string }>;

export type TechTier = 1 | 2 | 3;

export interface Technology {
  id: string;
  name: string;
  category: string;
  description: string;
  usedFor: string[];
  icon: TechIcon;
  /** Deterministic 3D position - never randomized per render. */
  position: { x: number; y: number; z: number };
  scale: number;
  tier: TechTier;
  animation: { speed: number; amplitude: number; phase: number };
  related: string[];
}

const TextLogo: React.FC<{ text: string; size?: number; color?: string }> = ({ text, size = 26, color = '#E8E6E0' }) => (
  <span
    style={{
      fontSize: Math.round(size * 0.42),
      fontWeight: 700,
      letterSpacing: '-0.03em',
      lineHeight: 1,
      color,
      fontFamily: "'JetBrains Mono', monospace",
      whiteSpace: 'nowrap',
    }}
  >
    {text}
  </span>
);

const AwsLogo: TechIcon = ({ size, color }) => <TextLogo text="AWS" size={size} color={color} />;
const RestApiLogo: TechIcon = ({ size, color }) => <TextLogo text="REST" size={size} color={color} />;
const MicroservicesLogo: TechIcon = ({ size, color }) => <TextLogo text={'\u00B5SVC'} size={size} color={color} />;
const WebSocketsLogo: TechIcon = ({ size, color }) => <TextLogo text="WS" size={size} color={color} />;

/**
 * Deterministic 3D layout. Positions are authored once and never randomized,
 * so React re-renders can never make the scene jump around.
 *
 * z range: ~+1.7 (foreground) ... ~-2.0 (background). Camera sits at [0,0,7].
 */
export const technologies: Technology[] = [
  // ── FRONTEND ────────────────────────────────────────────────────────────────
  {
    id: 'react', name: 'React', category: 'Frontend', tier: 1, scale: 1.3,
    description: 'Component-driven UI library for interactive interfaces.',
    usedFor: ['SPAs', 'Reusable components', 'Motion UI'],
    position: { x: -2.3, y: 0.35, z: 1.7 },
    animation: { speed: 0.38, amplitude: 0.09, phase: 0.4 },
    related: ['next', 'typescript', 'javascript', 'tailwind', 'restapi'],
    icon: SiReact,
  },
  {
    id: 'typescript', name: 'TypeScript', category: 'Frontend', tier: 1, scale: 1.15,
    description: 'Typed superset of JavaScript for scalable codebases.',
    usedFor: ['Type safety', 'Tooling', 'Large codebases'],
    position: { x: -1.2, y: -0.3, z: 1.4 },
    animation: { speed: 0.45, amplitude: 0.07, phase: 1.1 },
    related: ['react', 'next', 'node', 'javascript'],
    icon: SiTypescript,
  },
  {
    id: 'next', name: 'Next.js', category: 'Frontend', tier: 1, scale: 1.15,
    description: 'React framework with SSR, routing and edge rendering.',
    usedFor: ['SSR / SSG', 'Routing', 'Edge rendering'],
    position: { x: -0.3, y: 0.95, z: 1.55 },
    animation: { speed: 0.34, amplitude: 0.1, phase: 0.9 },
    related: ['react', 'typescript', 'tailwind', 'vercel'],
    icon: SiNextdotjs,
  },
  {
    id: 'javascript', name: 'JavaScript', category: 'Frontend', tier: 2, scale: 0.95,
    description: 'Core language powering the modern web platform.',
    usedFor: ['Scripting', 'Interactivity', 'Runtime'],
    position: { x: -1.55, y: 1.25, z: 0.9 },
    animation: { speed: 0.5, amplitude: 0.08, phase: 2.2 },
    related: ['typescript', 'react', 'node'],
    icon: SiJavascript,
  },
  {
    id: 'tailwind', name: 'Tailwind CSS', category: 'Frontend', tier: 2, scale: 1.0,
    description: 'Utility-first CSS framework for rapid, consistent styling.',
    usedFor: ['Styling', 'Design systems', 'Responsive UI'],
    position: { x: -0.45, y: -1.3, z: 1.1 },
    animation: { speed: 0.42, amplitude: 0.06, phase: 3.0 },
    related: ['react', 'next', 'css'],
    icon: SiTailwindcss,
  },
  {
    id: 'html', name: 'HTML5', category: 'Frontend', tier: 3, scale: 0.85,
    description: 'Semantic markup for structured web content.',
    usedFor: ['Markup', 'Semantic structure', 'SEO'],
    position: { x: -2.85, y: -1.05, z: 0.55 },
    animation: { speed: 0.52, amplitude: 0.05, phase: 1.7 },
    related: ['css', 'javascript'],
    icon: SiHtml5,
  },
  {
    id: 'css', name: 'CSS3', category: 'Frontend', tier: 3, scale: 0.85,
    description: 'Style sheet language for presentation and layout.',
    usedFor: ['Layout', 'Animation', 'Responsive design'],
    position: { x: -3.15, y: 1.45, z: 0.35 },
    animation: { speed: 0.48, amplitude: 0.05, phase: 2.6 },
    related: ['html', 'tailwind'],
    icon: SiCss,
  },
  {
    id: 'redux', name: 'Redux', category: 'Frontend', tier: 3, scale: 0.75,
    description: 'Predictable state container for complex client state.',
    usedFor: ['State management', 'Middleware', 'Devtools'],
    position: { x: -0.85, y: -0.1, z: 0.45 },
    animation: { speed: 0.55, amplitude: 0.05, phase: 0.1 },
    related: ['react', 'typescript'],
    icon: SiRedux,
  },

  // ── BACKEND / DATA ─────────────────────────────────────────────────────────
  {
    id: 'node', name: 'Node.js', category: 'Backend', tier: 1, scale: 1.22,
    description: 'JavaScript runtime for building scalable network apps.',
    usedFor: ['APIs', 'Microservices', 'CLI tools'],
    position: { x: 2.0, y: 0.55, z: 1.3 },
    animation: { speed: 0.36, amplitude: 0.08, phase: 0.6 },
    related: ['express', 'mongodb', 'redis', 'kafka', 'restapi', 'websockets'],
    icon: SiNodedotjs,
  },
  {
    id: 'express', name: 'Express.js', category: 'Backend', tier: 2, scale: 1.0,
    description: 'Minimal web framework for building Node.js servers.',
    usedFor: ['REST APIs', 'Server routing', 'Middleware'],
    position: { x: 1.15, y: -0.15, z: 0.65 },
    animation: { speed: 0.44, amplitude: 0.07, phase: 1.4 },
    related: ['node', 'restapi', 'mongodb', 'postgres'],
    icon: SiExpress,
  },
  {
    id: 'mongodb', name: 'MongoDB', category: 'Database', tier: 1, scale: 1.15,
    description: 'Document database for flexible, high-volume data.',
    usedFor: ['Document storage', 'Real-time data', 'Scaling'],
    position: { x: 2.7, y: -0.75, z: 0.3 },
    animation: { speed: 0.4, amplitude: 0.06, phase: 2.0 },
    related: ['node', 'express', 'redis'],
    icon: SiMongodb,
  },
  {
    id: 'postgres', name: 'PostgreSQL', category: 'Database', tier: 2, scale: 1.0,
    description: 'Relational database with strong consistency guarantees.',
    usedFor: ['SQL', 'Transactions', 'Analytics'],
    position: { x: 1.7, y: -1.55, z: -0.05 },
    animation: { speed: 0.46, amplitude: 0.06, phase: 3.4 },
    related: ['prisma', 'node', 'redis'],
    icon: SiPostgresql,
  },
  {
    id: 'prisma', name: 'Prisma', category: 'Database', tier: 3, scale: 0.8,
    description: 'Type-safe ORM for streamlined database access.',
    usedFor: ['ORM', 'Migrations', 'Type-safe queries'],
    position: { x: 0.6, y: -0.85, z: -0.35 },
    animation: { speed: 0.5, amplitude: 0.05, phase: 0.8 },
    related: ['postgres', 'typescript', 'mongodb'],
    icon: SiPrisma,
  },
  {
    id: 'restapi', name: 'REST API', category: 'Backend', tier: 3, scale: 0.75,
    description: 'Client-server architecture communicating over HTTP.',
    usedFor: ['Endpoints', 'Integration', 'Stateless APIs'],
    position: { x: 2.15, y: 1.45, z: 0.4 },
    animation: { speed: 0.54, amplitude: 0.04, phase: 1.9 },
    related: ['node', 'express', 'react', 'next'],
    icon: RestApiLogo,
  },
  {
    id: 'websockets', name: 'WebSockets', category: 'Backend', tier: 3, scale: 0.65,
    description: 'Full-duplex, real-time communication protocol.',
    usedFor: ['Real-time apps', 'Live updates', 'Streaming'],
    position: { x: 1.2, y: 1.85, z: -0.15 },
    animation: { speed: 0.5, amplitude: 0.04, phase: 2.8 },
    related: ['node', 'react', 'kafka'],
    icon: WebSocketsLogo,
  },

  // ── AUTH / SERVICES ────────────────────────────────────────────────────────
  {
    id: 'jwt', name: 'JWT', category: 'Auth', tier: 3, scale: 0.8,
    description: 'Compact token format for secure auth & stateless sessions.',
    usedFor: ['Authentication', 'Sessions', 'Authorization'],
    position: { x: -1.85, y: 1.7, z: 0.2 },
    animation: { speed: 0.48, amplitude: 0.05, phase: 1.2 },
    related: ['firebase', 'supabase', 'node'],
    icon: SiJsonwebtokens,
  },
  {
    id: 'firebase', name: 'Firebase', category: 'Services', tier: 3, scale: 0.85,
    description: 'Backend platform with auth, DB and hosting services.',
    usedFor: ['Auth', 'Realtime DB', 'Hosting'],
    position: { x: -2.45, y: 0.15, z: -0.75 },
    animation: { speed: 0.5, amplitude: 0.06, phase: 3.6 },
    related: ['jwt', 'react', 'vercel'],
    icon: SiFirebase,
  },
  {
    id: 'supabase', name: 'Supabase', category: 'Services', tier: 3, scale: 0.8,
    description: 'Open-source backend with Postgres, auth and storage.',
    usedFor: ['Postgres backend', 'Auth', 'Storage'],
    position: { x: -1.85, y: 2.25, z: -0.9 },
    animation: { speed: 0.44, amplitude: 0.05, phase: 2.4 },
    related: ['postgres', 'jwt', 'react'],
    icon: SiSupabase,
  },

  // ── DEVOPS ─────────────────────────────────────────────────────────────────
  {
    id: 'docker', name: 'Docker', category: 'DevOps', tier: 1, scale: 1.18,
    description: 'Containerization platform for shipping consistent environments.',
    usedFor: ['Containers', 'Microservices', 'Deployment'],
    position: { x: 0.55, y: 1.45, z: 1.05 },
    animation: { speed: 0.34, amplitude: 0.09, phase: 1.6 },
    related: ['kubernetes', 'kafka', 'redis', 'microservices', 'nginx'],
    icon: SiDocker,
  },
  {
    id: 'kubernetes', name: 'Kubernetes', category: 'DevOps', tier: 2, scale: 1.0,
    description: 'Container orchestration for resilient, self-healing apps.',
    usedFor: ['Orchestration', 'Scaling', 'Self-healing'],
    position: { x: 2.6, y: 1.55, z: -0.85 },
    animation: { speed: 0.42, amplitude: 0.07, phase: 2.0 },
    related: ['docker', 'grafana', 'prometheus', 'microservices'],
    icon: SiKubernetes,
  },
  {
    id: 'git', name: 'Git', category: 'DevOps', tier: 2, scale: 0.9,
    description: 'Distributed version control for tracking changes.',
    usedFor: ['Version control', 'Branching', 'Collaboration'],
    position: { x: 3.2, y: -0.05, z: -0.75 },
    animation: { speed: 0.5, amplitude: 0.06, phase: 0.3 },
    related: ['github', 'github-actions'],
    icon: SiGit,
  },
  {
    id: 'github', name: 'GitHub', category: 'DevOps', tier: 2, scale: 1.0,
    description: 'Platform for hosting, reviewing and collaborating on code.',
    usedFor: ['Repositories', 'Collaboration', 'CI/CD'],
    position: { x: 1.8, y: 0.3, z: -1.0 },
    animation: { speed: 0.44, amplitude: 0.06, phase: 2.9 },
    related: ['git', 'github-actions'],
    icon: SiGithub,
  },
  {
    id: 'github-actions', name: 'GitHub Actions', category: 'DevOps', tier: 3, scale: 0.7,
    description: 'Automated CI/CD pipelines directly in GitHub.',
    usedFor: ['CI/CD', 'Automation', 'Deployment'],
    position: { x: 3.0, y: 2.05, z: -1.3 },
    animation: { speed: 0.5, amplitude: 0.05, phase: 1.0 },
    related: ['github', 'docker', 'aws'],
    icon: SiGithubactions,
  },
  {
    id: 'nginx', name: 'Nginx', category: 'DevOps', tier: 3, scale: 0.7,
    description: 'High-performance web server and reverse proxy.',
    usedFor: ['Reverse proxy', 'Load balancing', 'Static serving'],
    position: { x: 3.4, y: 0.9, z: -1.55 },
    animation: { speed: 0.5, amplitude: 0.05, phase: 3.8 },
    related: ['docker', 'node', 'aws'],
    icon: SiNginx,
  },
  {
    id: 'linux', name: 'Linux', category: 'DevOps', tier: 3, scale: 0.85,
    description: 'Open-source operating system at the core of modern infra.',
    usedFor: ['Servers', 'Containers', 'Scripting'],
    position: { x: 2.85, y: -1.15, z: -1.65 },
    animation: { speed: 0.48, amplitude: 0.06, phase: 0.6 },
    related: ['docker', 'kubernetes', 'nginx'],
    icon: SiLinux,
  },

  // ── MESSAGING / CACHE ──────────────────────────────────────────────────────
  {
    id: 'kafka', name: 'Apache Kafka', category: 'Messaging', tier: 1, scale: 1.06,
    description: 'Distributed event streaming platform for high-throughput pipelines.',
    usedFor: ['Event streaming', 'Messaging', 'Microservices'],
    position: { x: 0.0, y: 0.05, z: 0.3 },
    animation: { speed: 0.34, amplitude: 0.08, phase: 0.5 },
    related: ['node', 'docker', 'microservices', 'prometheus'],
    icon: SiApachekafka,
  },
  {
    id: 'redis', name: 'Redis', category: 'Cache', tier: 2, scale: 1.0,
    description: 'In-memory data store for caching and fast lookups.',
    usedFor: ['Caching', 'Queues', 'Sessions'],
    position: { x: 0.45, y: -1.6, z: -0.3 },
    animation: { speed: 0.46, amplitude: 0.07, phase: 2.2 },
    related: ['node', 'docker', 'mongodb', 'postgres'],
    icon: SiRedis,
  },
  {
    id: 'microservices', name: 'Microservices', category: 'Architecture', tier: 3, scale: 0.7,
    description: 'Architecture decomposing systems into independent services.',
    usedFor: ['Modularity', 'Independent scaling', 'Resilience'],
    position: { x: -0.55, y: 0.35, z: -0.55 },
    animation: { speed: 0.5, amplitude: 0.04, phase: 1.5 },
    related: ['node', 'docker', 'kafka', 'kubernetes'],
    icon: MicroservicesLogo,
  },

  // ── OBSERVABILITY ──────────────────────────────────────────────────────────
  {
    id: 'grafana', name: 'Grafana', category: 'Observability', tier: 1, scale: 1.08,
    description: 'Observability & visualization platform for metrics and logs.',
    usedFor: ['Dashboards', 'Monitoring', 'Visualization'],
    position: { x: -1.4, y: -1.7, z: 0.15 },
    animation: { speed: 0.36, amplitude: 0.07, phase: 1.3 },
    related: ['prometheus', 'docker', 'kubernetes'],
    icon: SiGrafana,
  },
  {
    id: 'prometheus', name: 'Prometheus', category: 'Observability', tier: 2, scale: 1.0,
    description: 'Open-source monitoring system with a powerful query language.',
    usedFor: ['Metrics', 'Alerting', 'Scraping'],
    position: { x: -2.4, y: -2.05, z: -0.6 },
    animation: { speed: 0.44, amplitude: 0.06, phase: 3.2 },
    related: ['grafana', 'docker', 'kubernetes'],
    icon: SiPrometheus,
  },

  // ── CLOUD ──────────────────────────────────────────────────────────────────
  {
    id: 'aws', name: 'AWS', category: 'Cloud', tier: 2, scale: 0.95,
    description: 'Comprehensive cloud platform for compute, storage and services.',
    usedFor: ['Cloud infra', 'Scaling', 'Managed services'],
    position: { x: 0.85, y: 2.2, z: -1.4 },
    animation: { speed: 0.4, amplitude: 0.06, phase: 2.7 },
    related: ['docker', 'kubernetes', 'vercel', 'github-actions'],
    icon: AwsLogo,
  },
  {
    id: 'vercel', name: 'Vercel', category: 'Cloud', tier: 3, scale: 0.7,
    description: 'Edge platform for deploying frontend applications.',
    usedFor: ['Deployment', 'Edge functions', 'Preview'],
    position: { x: -0.3, y: 2.05, z: -1.85 },
    animation: { speed: 0.5, amplitude: 0.05, phase: 1.8 },
    related: ['next', 'react', 'aws'],
    icon: SiVercel,
  },
  {
    id: 'railway', name: 'Railway', category: 'Cloud', tier: 3, scale: 0.65,
    description: 'Simple cloud platform for deploying backend services.',
    usedFor: ['Deployment', 'Backends', 'Databases'],
    position: { x: 1.8, y: 2.45, z: -2.0 },
    animation: { speed: 0.52, amplitude: 0.05, phase: 0.9 },
    related: ['node', 'postgres', 'docker'],
    icon: SiRailway,
  },

  // ── TESTING ────────────────────────────────────────────────────────────────
  {
    id: 'postman', name: 'Postman', category: 'Testing', tier: 3, scale: 0.8,
    description: 'API platform for designing, testing and documenting APIs.',
    usedFor: ['API testing', 'Collections', 'Docs'],
    position: { x: 2.15, y: -2.0, z: -0.9 },
    animation: { speed: 0.48, amplitude: 0.05, phase: 2.1 },
    related: ['restapi', 'express', 'graphql'],
    icon: SiPostman,
  },
  {
    id: 'k6', name: 'k6', category: 'Testing', tier: 3, scale: 0.7,
    description: 'Developer-centric load testing for performance validation.',
    usedFor: ['Load testing', 'Performance', 'Scenarios'],
    position: { x: 1.05, y: -2.1, z: -1.25 },
    animation: { speed: 0.54, amplitude: 0.05, phase: 3.5 },
    related: ['restapi', 'prometheus', 'grafana'],
    icon: SiK6,
  },
];

export const techById: Record<string, Technology> = Object.fromEntries(
  technologies.map((t) => [t.id, t]),
);

/** Mobile keeps a curated subset so the scene stays readable & fast. */
export const mobileSubset: string[] = [
  'react', 'next', 'typescript', 'node', 'docker',
  'mongodb', 'kafka', 'grafana', 'postgres', 'redis', 'kubernetes', 'aws',
];

export function isRelated(selectedId: string | null, otherId: string): boolean {
  if (!selectedId) return true;
  if (selectedId === otherId) return true;
  const tech = techById[selectedId];
  return !!tech && tech.related.includes(otherId);
}

/* -------------------------------------------------------------------------- */
/*  Constellation config - clusters, derived edges, stagger ordering.         */
/* -------------------------------------------------------------------------- */

export type ClusterId =
  | 'frontend'
  | 'backend'
  | 'data'
  | 'services'
  | 'infra'
  | 'ops';

export interface ClusterDef {
  id: ClusterId;
  label: string;
  hint: string;
}

/** Every tech declares a `category`; this maps categories onto the visible
 *  constellation clusters so adding/removing a tech is a one-line change. */
export const categoryToCluster: Record<string, ClusterId> = {
  Frontend: 'frontend',
  Backend: 'backend',
  Architecture: 'backend',
  Database: 'data',
  Cache: 'data',
  Auth: 'services',
  Services: 'services',
  DevOps: 'infra',
  Cloud: 'infra',
  Observability: 'ops',
  Testing: 'ops',
};

export const clusterOrder: ClusterId[] = [
  'frontend',
  'backend',
  'data',
  'services',
  'infra',
  'ops',
];

export const clusters: ClusterDef[] = [
  { id: 'frontend', label: 'FRONTEND', hint: 'UI layer' },
  { id: 'backend', label: 'BACKEND / APIS', hint: 'Servers & interfaces' },
  { id: 'data', label: 'DATA / CACHE', hint: 'Storage & fast lookup' },
  { id: 'services', label: 'AUTH / SERVICES', hint: 'Identity & platforms' },
  { id: 'infra', label: 'INFRA / CLOUD', hint: 'Deployment & orchestration' },
  { id: 'ops', label: 'OBSERVABILITY / TESTING', hint: 'Metrics & quality' },
];

export const clusterOf = (t: Technology): ClusterId =>
  categoryToCluster[t.category] ?? 'backend';

/** Global stagger index (ms) used for the entrance animation (cluster-major
 *  with an intra-cluster offset, both derived from the static data order). */
export const staggerIndexOf = (t: Technology): number => {
  const ci = clusterOrder.indexOf(clusterOf(t));
  const intra = Math.max(0, technologies.indexOf(t));
  return ci * 180 + intra * 16;
};

/** Entrance animation delay (s) for a tech chip. */
export const introDelayOf = (t: Technology): number => 0.15 + staggerIndexOf(t) / 1000;

/** Deterministic cluster centroid derived from member positions - static. */
export function clusterCentroid(clusterId: ClusterId): { x: number; y: number; z: number } {
  const members = technologies.filter((t) => clusterOf(t) === clusterId);
  if (members.length === 0) return { x: 0, y: 0, z: 0 };
  const sum = members.reduce(
    (acc, t) => {
      acc.x += t.position.x;
      acc.y += t.position.y;
      acc.z += t.position.z;
      return acc;
    },
    { x: 0, y: 0, z: 0 },
  );
  return {
    x: sum.x / members.length,
    y: sum.y / members.length,
    z: sum.z / members.length,
  };
}

export interface Edge {
  from: string;
  to: string;
}

/** Edge list derived from each tech's `related[]` (deduped, undirected).
 *  To hand-wire the constellation instead, fill `customEdges` below - the
 *  derived list is skipped entirely when it's non-null. */
export const customEdges: Edge[] | null = null;

export const edges: Edge[] =
  customEdges ??
  (() => {
    const seen = new Set<string>();
    const out: Edge[] = [];
    for (const t of technologies) {
      for (const r of t.related) {
        if (!techById[r]) continue;
        const key = [t.id, r].sort().join('|');
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ from: t.id, to: r });
      }
    }
    return out;
  })();