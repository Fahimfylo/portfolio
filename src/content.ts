export interface ServiceSubGroup {
  num: string;
  label: string;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  subGroups: ServiceSubGroup[];
  outcome: string;
}

export interface ProjectItem {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  previewImage: string;
  deviceMockupImage: string;
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
  showOnHome: boolean;
  technicalNarrative: {
    problem: string;
    tradeoff: string;
    outcome: string;
  };
  metrics: string[];
}

export interface PortfolioContent {
  personal: {
    name: string;
    role: string;
    heroSubtext: string;
    availabilityStatus: string;
    dateReadout: string;
    portraitImage: string;
    email: string;
    cvUrl: string;
    aboutHeadline: string;
    aboutBio: string[];
  };
  services: ServiceItem[];
  projects: ProjectItem[];
  skills: {
    languagesAndTools: string[];
    frameworksAndLibraries: string[];
    coreCS: string[];
  };
  navLinks: { label: string; href: string }[];
  socials: { label: string; href: string; icon: string }[];
}

export function getContent(): PortfolioContent {
  try {
    const stored = localStorage.getItem('portfolio_data_cache');
    if (stored) return JSON.parse(stored);
  } catch {
    // fall through
  }
  return portfolioData;
}

export async function loadContent(): Promise<PortfolioContent> {
  try {
    const env = (import.meta as any).env;
    const base = (env && env.VITE_API_URL) || '';
    const res = await fetch(`${base}/api/content-public`);
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === 'object') {
        localStorage.setItem('portfolio_data_cache', JSON.stringify(data));
        return data;
      }
    }
  } catch {
    // API not reachable - fall back to cache or defaults
  }
  return getContent();
}

export const portfolioData: PortfolioContent = {
  personal: {
    name: "FAHIM RAHMAN",
    role: "Web Developer & Designer",
    heroSubtext: "I build high-throughput distributed applications, edge-rendered user interfaces, and resilient cloud backend architectures for high-growth tech enterprises.",
    availabilityStatus: "AVAILABLE FOR WORK",
    dateReadout: "AUG'26",
    portraitImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1200",
    email: "ghostpy91@gmail.com",
    cvUrl: "",
    aboutHeadline: "DEVELOPER / DESIGNER / CREATOR /",
    aboutBio: [
      "Senior Full-Stack Engineer with 8+ years of experience leading core platform engineering teams, scaling React micro-frontends, and architecting event-driven Node.js APIs.",
      "Specialized in bridging deep computer science fundamentals with pixel-perfect visual craftsmanship. Passionate about Web Vitals, zero-runtime CSS abstractions, and high-concurrency data systems.",
      "Currently consulting for series-B to enterprise engineering groups on frontend architecture modernization, state synchronization, and low-latency API integration."
    ]
  },

  navLinks: [
    { label: "Home", href: "#top" },
    { label: "Services", href: "#services" },
    { label: "Works", href: "#works" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" }
  ],

  socials: [
    { label: "LinkedIn", href: "https://linkedin.com", icon: "Linkedin" },
    { label: "Github", href: "https://github.com", icon: "Github" },
    { label: "Leetcode", href: "https://leetcode.com", icon: "Code" }
  ],

  services: [
    {
      id: "full-stack",
      number: "(01)",
      title: "Full-Stack Development",
      description: "From frontend interactions to backend APIs, I build complete web solutions. I work with modern stacks to deliver apps that are scalable, maintainable, and ready for real-world users.",
      subGroups: [
        { num: "01", label: "React, Node.js, Express.js" },
        { num: "02", label: "REST APIs, Firebase, Docker" },
        { num: "03", label: "Git, GitHub, Postman" }
      ],
      outcome: "Delivers resilient, scalable application foundations that maintain sub-100ms API response times at high concurrency."
    },
    {
      id: "ui-ux",
      number: "(02)",
      title: "UI/UX & Frontend",
      description: "Good design feels effortless. I design and develop responsive, intuitive interfaces that work smoothly across devices, with a strong focus on clarity, accessibility, and performance.",
      subGroups: [
        { num: "01", label: "NextJs, TailwindCSS, GSAP" },
        { num: "02", label: "Figma → Pixel-perfect code" },
        { num: "03", label: "HTML, CSS, JavaScript" }
      ],
      outcome: "Ensures 98+ Lighthouse performance scores with zero layout shifts and buttery-smooth 60fps animations across all viewports."
    },
    {
      id: "optimization",
      number: "(03)",
      title: "Systems & Optimization",
      description: "Deep technical refactoring and performance optimization leveraging core CS principles, custom indexing, caching layers, and optimized database query execution.",
      subGroups: [
        { num: "01", label: "Data Structures & Algorithms" },
        { num: "02", label: "DBMS, Query Optimization & OOP" },
        { num: "03", label: "Scalable Systems & Data Pipelines" }
      ],
      outcome: "Engineered a custom memory-cached indexing strategy that reduced P99 query latency by [METRIC: 42%] under heavy parallel loads."
    }
  ],

  projects: [
    {
      id: "nexus-cloud",
      number: "01",
      title: "Nexus Cloud Engine",
      tagline: "Real-Time Distributed Edge Gateway & Analytics Pipeline",
      description: "A high-performance cloud management interface processing real-time telemetry from over 100k edge nodes with dynamic routing and live visualization.",
      category: "Full-Stack System",
      previewImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1400",
      deviceMockupImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
      techStack: ["React 19", "Node.js", "Express", "Firebase", "TailwindCSS", "Recharts", "Framer Motion"],
      liveUrl: "https://nexus-cloud-demo.example.com",
      githubUrl: "https://github.com/example/nexus-cloud",
      showOnHome: true,
      technicalNarrative: {
        problem: "Handling bursty WebSocket telemetry streams without triggering excessive client-side re-renders or spiking server memory allocation.",
        tradeoff: "Selected a ring-buffer state synchronization strategy in Web Workers instead of naive React state setters, sacrificing instant DOM updates for guaranteed 60fps frame rates.",
        outcome: "Maintained sustained [METRIC: 50,000 QPS] throughput with 0 dropped frames and [METRIC: 42% lower CPU utilization] on client machines."
      },
      metrics: ["[METRIC: 50k QPS]", "[METRIC: 99.99% Uptime]", "[METRIC: -42% Client CPU]"]
    },
    {
      id: "pulse-flow",
      number: "02",
      title: "Pulse Flow Canvas",
      tagline: "Ultra-Low Latency Collaborative Workspace & Infinite Canvas",
      description: "Multi-user vector diagramming tool with real-time multiplayer cursor tracking, offline CRDT conflict resolution, and custom WebGL renderer.",
      category: "Frontend Architecture",
      previewImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1400",
      deviceMockupImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=600",
      techStack: ["TypeScript", "React", "Canvas API", "WebSockets", "CRDTs", "TailwindCSS"],
      liveUrl: "https://pulse-flow-demo.example.com",
      githubUrl: "https://github.com/example/pulse-flow",
      showOnHome: true,
      technicalNarrative: {
        problem: "Resolving simultaneous state edits across 50+ concurrent users on a shared canvas while maintaining seamless offline capabilities.",
        tradeoff: "Implemented Yjs state delta vectors over raw JSON payloads, increasing initial handshake complexity in exchange for bandwidth efficiency.",
        outcome: "Cut network bandwidth overhead by [METRIC: 64%] and achieved deterministic conflict resolution with [METRIC: <15ms peer propagation]."
      },
      metrics: ["[METRIC: <15ms Sync]", "[METRIC: 64% Bandwidth Savings]", "[METRIC: 50+ Multi-User]"]
    },
    {
      id: "aether-audio",
      number: "03",
      title: "Aether Sound Workstation",
      tagline: "Browser-Native Web Audio Modular Synthesizer & Spatial Engine",
      description: "An interactive browser DAW featuring custom Web Audio API DSP nodes, polyphonic wave synthesis, and 3D spatial positioning controls.",
      category: "Audio / Creative Tech",
      previewImage: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1400",
      deviceMockupImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=600",
      techStack: ["Web Audio API", "React", "AudioWorklet", "TailwindCSS", "Framer Motion"],
      liveUrl: "https://aether-audio-demo.example.com",
      githubUrl: "https://github.com/example/aether-audio",
      showOnHome: true,
      technicalNarrative: {
        problem: "Audio glitches and buffer underruns caused by garbage collection pauses on the main browser UI thread.",
        tradeoff: "Offloaded DSP synthesis loops to custom C++ compiled WebAssembly AudioWorklet processors running in a dedicated audio context thread.",
        outcome: "Achieved zero-latency audio buffering with [METRIC: 0.8ms audio callback times] and zero buffer dropouts during complex UI interactions."
      },
      metrics: ["[METRIC: 0.8ms Callback]", "[METRIC: Zero Audio Glitches]", "[METRIC: 3D Spatial Audio]"]
    },
    {
      id: "horizon-ai",
      number: "04",
      title: "Horizon Knowledge Engine",
      tagline: "Enterprise AI Search & Multi-Model Knowledge Graph Integrator",
      description: "Enterprise semantic discovery engine with automated vector indexing, RAG synthesis pipelines, and interactive graph exploration controls.",
      category: "AI & Data Systems",
      previewImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1400",
      deviceMockupImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600",
      techStack: ["Node.js", "Express", "Gemini API", "Vector DB", "React", "TailwindCSS"],
      liveUrl: "https://horizon-ai-demo.example.com",
      githubUrl: "https://github.com/example/horizon-ai",
      showOnHome: true,
      technicalNarrative: {
        problem: "Synthesizing answers from massive multi-gigabyte enterprise document repositories without hitting API context window limits.",
        tradeoff: "Designed a hybrid dense-sparse vector ranking algorithm that selects targeted chunk context before invoking synthesis model endpoints.",
        outcome: "Improved answer relevance accuracy by [METRIC: 38%] while reducing token query costs by [METRIC: 54% per request]."
      },
      metrics: ["[METRIC: +38% Accuracy]", "[METRIC: -54% Token Cost]", "[METRIC: Sub-second Search]"]
    }
  ],

  skills: {
    languagesAndTools: [
      "Python",
      "SQL",
      "C++",
      "Java",
      "TypeScript",
      "JavaScript",
      "Git",
      "Postman",
      "Docker",
      "Firebase"
    ],
    frameworksAndLibraries: [
      "React",
      "Node.js",
      "Express.js",
      "Flask",
      "Bootstrap",
      "jQuery",
      "TailwindCSS",
      "Framer Motion",
      "GSAP"
    ],
    coreCS: [
      "Data Structures & Algorithms",
      "DBMS & Relational Algebra",
      "OOP & Modular Architecture",
      "Operating System Fundamentals",
      "System Design & Scalability"
    ]
  }
};
