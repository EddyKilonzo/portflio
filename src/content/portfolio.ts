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
  body: string;
};

export type SecurityReport = {
  id: string;
  title: string;
  type: "pentest" | "ir" | "vuln";
  findings: ReportFinding[];
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
    "Full-stack developer and creative technologist crafting elegant web experiences with a security-first mindset.",
  headlineScramble:
    "Full-Stack Developer · Creative Technologist · Cybersecurity Explorer",
  availability: "open" as Availability,
  email: "hello@eddymax.dev",
  social: {
    github: "https://github.com/EddyKilonzo",
    linkedin: "https://www.linkedin.com/in/eddy-kilonzo-",
    twitter: "https://x.com/3ddy_max",
    htb: "https://app.hackthebox.com/",
    thm: "https://tryhackme.com/p/eddy.kilonzo",
    // WhatsApp: international format without + or spaces, e.g. "254712345678"
    whatsapp: "254712345678",
  },
  rssFeedUrl: "",
  learningTicker: [
    "Next-gen Angular + TypeScript apps",
    "Scalable backend architecture with NestJS",
    "Interactive frontend experiences",
    "WordPress and WooCommerce delivery workflows",
    "Cybersecurity fundamentals and secure coding",
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
    "Building the future one commit at a time: clean-code workflows, creative UI/UX prototyping, and practical secure development labs.",
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
      "Portfolio UX v2: compare mode, tray navigation, and case-study carousel.",
      "Production-ready content architecture for faster updates.",
    ],
  },
  {
    title: "Learning",
    lines: [
      "PWA optimization workflows and offline-first shell patterns.",
      "Advanced accessibility audit practices for dynamic interfaces.",
    ],
  },
  {
    title: "Improving",
    lines: [
      "Reducing first-load JS for smoother mobile startup.",
      "Tighter analytics signals for user journey decisions.",
    ],
  },
];

export const changelog: ChangelogEntry[] = [
  { date: "2026-04-29", item: "Added theme mode system + improved startup hydration." },
  { date: "2026-04-29", item: "Introduced command palette, subtle ambient controls, cursor toggle." },
  { date: "2026-04-29", item: "Shipped branded not-found/offline states and stronger metadata." },
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
  {
    id: "sentinel-siem",
    title: "SentinelSIEM",
    shortDescription:
      "Home lab SIEM environment with log ingestion, Sigma-style detection rules, and alerting pipelines for hands-on blue team practice.",
    roleMode: "cyber",
    tech: ["Elastic Stack", "Python", "Docker", "Sigma"],
    category: "Detection Engineering Lab",
    difficulty: "advanced",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    codeUrl: "https://github.com/EddyKilonzo/sentinel-siem",
    demoType: "cyber",
    skills: ["SIEM tools", "Incident Response", "Python", "Docker"],
    screenshotFallback: "https://picsum.photos/seed/sentinel-siem/960/600",
    caseStudy: {
      problem:
        "Blue team practitioners need realistic log environments and detection playgrounds that mirror production threat signals.",
      approach: [
        "Deployed Elastic Stack locally with Docker Compose for log ingestion and dashboards.",
        "Authored Sigma-style detection rules for brute force, lateral movement, and privilege escalation patterns.",
        "Built Python scripts to generate synthetic log traffic and validate alert thresholds under load.",
      ],
      outcome:
        "Produced a repeatable lab environment for detection tuning and incident response drills.",
      metrics: [
        "Detection rules: 12+ covering common MITRE ATT&CK techniques",
        "Log sources: nginx, sshd, auth, DNS",
        "False positive rate: tuned to <5% on test datasets",
      ],
      architectureNotes: [
        "Docker Compose stack keeps the lab portable and reproducible across machines.",
        "Sigma rules are version-controlled for auditability and incremental improvement.",
        "Python log generators simulate attack scenarios without live infrastructure risk.",
      ],
    },
  },
  {
    id: "phish-hunter",
    title: "PhishHunter",
    shortDescription:
      "Certificate transparency log monitor that flags newly registered lookalike and typosquat domains in real time for early phishing detection.",
    roleMode: "cyber",
    tech: ["Python", "certstream", "Docker"],
    category: "Threat Intelligence Tool",
    difficulty: "intermediate",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    codeUrl: "https://github.com/EddyKilonzo/phish-hunter",
    demoType: "cyber",
    skills: ["Python", "OSINT", "Incident Response"],
    screenshotFallback: "https://picsum.photos/seed/phish-hunter/960/600",
    caseStudy: {
      problem:
        "Phishing campaigns often register lookalike domains days before attacks — monitoring CT logs enables early-warning detection.",
      approach: [
        "Subscribed to the certstream WebSocket feed for real-time certificate issuance events.",
        "Implemented typosquatting and substring-match detection against a config-driven domain watchlist.",
        "Added extensible alert hooks so suspicious domains surface immediately for analyst triage.",
      ],
      outcome:
        "Built an early-warning tool that identifies suspicious domain registrations before phishing campaigns launch.",
      metrics: [
        "Detection latency: near real-time via WebSocket stream",
        "Typosquat variants: full alphabet substitution and deletion coverage",
        "Alert outputs: pluggable (Slack, email, SIEM ingest)",
      ],
      architectureNotes: [
        "certstream feed handles thousands of certificate events per minute without queuing lag.",
        "Watchlist is config-driven so analysts add protected domains without code changes.",
        "Modular pipeline allows swapping detection strategies independently of alerting logic.",
      ],
    },
  },
  {
    id: "redteam-c2",
    title: "RedTeam Lab",
    shortDescription:
      "Authorized red team C2 simulation lab for generating realistic adversary beacon traffic used to validate blue team detection rules.",
    roleMode: "cyber",
    tech: ["Go", "Python", "Docker", "Kali Linux"],
    category: "Adversary Simulation Lab",
    difficulty: "advanced",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    codeUrl: "https://github.com/EddyKilonzo/redteam-lab",
    demoType: "cyber",
    skills: ["Kali Linux", "Metasploit", "Python", "Docker"],
    screenshotFallback: "https://picsum.photos/seed/redteam-c2/960/600",
    caseStudy: {
      problem:
        "Detection teams need realistic adversary simulation to validate their rules against actual C2 beacon and callback patterns in a safe environment.",
      approach: [
        "Built a lightweight Go beacon with jittered callback intervals and TLS verification for realistic traffic simulation.",
        "Containerized server and agent in isolated Docker bridge networks to prevent any external exposure.",
        "Documented companion detection signatures that each simulated technique should trigger in a paired SIEM.",
      ],
      outcome:
        "Created a controlled adversary simulation environment that feeds detection rule validation with realistic payloads.",
      metrics: [
        "Lab isolation: Docker bridge network only — no external reachability",
        "Beacon jitter: configurable 15–45s intervals",
        "Technique coverage: mapped to MITRE ATT&CK",
      ],
      architectureNotes: [
        "All traffic stays within Docker bridge networks — no external exposure by design.",
        "Lab pairs with SentinelSIEM for end-to-end red vs blue detection testing.",
        "Each technique is documented so blue team operators understand what signals to expect.",
      ],
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
  "sentinel-siem": [
    {
      path: "detections/auth_bruteforce.yml",
      language: "yaml",
      content: `title: Auth brute force spike
logsource:
  product: nginx
detection:
  selection:
    status: 401
  condition: selection | count() by src_ip > 40
`,
    },
  ],
  "phish-hunter": [
    {
      path: "hunter/ct_monitor.py",
      language: "python",
      content: `import certstream

def on_cert(msg, context):
    if msg["message_type"] != "certificate_update":
        return
    domains = msg["data"]["leaf_cert"]["all_domains"]
    for d in domains:
        if is_suspicious(d):
            print(f"[ALERT] {d}")

certstream.listen_for_events(on_cert, url="wss://certstream.calidog.io/")`,
    },
    {
      path: "hunter/typosquat.py",
      language: "python",
      content: `import itertools

def typosquats(domain: str) -> list[str]:
    name, tld = domain.rsplit(".", 1)
    variants = set()
    for i, _ in enumerate(name):
        variants.add(name[:i] + name[i+1:] + "." + tld)  # deletion
        for c in "abcdefghijklmnopqrstuvwxyz":
            variants.add(name[:i] + c + name[i+1:] + "." + tld)  # substitution
    return sorted(variants)`,
    },
  ],
  "redteam-c2": [
    {
      path: "beacon/main.go",
      language: "go",
      content: `package main

import (
  "crypto/tls"
  "time"
)

func main() {
  cfg := &tls.Config{InsecureSkipVerify: false}
  for {
    if err := checkin(cfg); err != nil {
      time.Sleep(jitter(30 * time.Second))
    }
  }
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
    id: "mscs",
    degree: "M.S. Cybersecurity",
    institution: "Institute of Technology",
    year: "2024",
    gpa: "3.85",
    honors: "Dean's List",
    coursework: [
      "Digital Forensics",
      "Network Security",
      "Secure Software Engineering",
    ],
    thesis: "Adaptive detection of lateral movement in hybrid clouds.",
    technologies: ["Python", "Zeek", "Elastic"],
  },
  {
    id: "bscs",
    degree: "B.S. Computer Science",
    institution: "State University",
    year: "2020",
    coursework: ["Algorithms", "OS", "Databases", "Web Systems"],
    technologies: ["C++", "JavaScript", "PostgreSQL"],
  },
  {
    id: "bootcamp",
    degree: "Full-Stack Web Development Bootcamp",
    institution: "Code Academy — Remote",
    year: "2018",
    coursework: ["React", "Node.js", "SQL", "REST API Design"],
    technologies: ["React", "Node.js", "MySQL", "Express"],
  },
  {
    id: "seccert",
    degree: "Diploma in Network & Security Administration",
    institution: "Tech College Nairobi",
    year: "2016",
    coursework: ["TCP/IP Fundamentals", "Linux Admin", "Firewall Config", "VPN Setup"],
    technologies: ["Linux", "pfSense", "Cisco IOS", "Wireshark"],
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
    title: "External Penetration Test — Acme SaaS",
    type: "pentest",
    findings: [
      {
        id: "f1",
        title: "IDOR on document export",
        severity: "high",
        body: "Sequential IDs allowed cross-tenant export without authorization checks on /api/v2/docs/:id/export.",
      },
      {
        id: "f2",
        title: "Weak MFA recovery flow",
        severity: "medium",
        body: "Recovery codes were reusable and not invalidated after use.",
      },
      {
        id: "f2b",
        title: "Reflected XSS in search parameter",
        severity: "medium",
        body: "The ?q= parameter in the global search was echoed unsanitised into the DOM, enabling script injection via crafted links.",
      },
    ],
  },
  {
    id: "r2",
    title: "Incident Response — Ransomware Drill",
    type: "ir",
    findings: [
      {
        id: "f3",
        title: "Backup immutability gap",
        severity: "critical",
        body: "Snapshot retention policy allowed privileged deletion within 24h window.",
      },
      {
        id: "f4",
        title: "Lateral movement via service account over-privilege",
        severity: "high",
        body: "Service account had org-wide read on Cloud Storage, enabling exfil pivot after initial compromise.",
      },
    ],
  },
  {
    id: "r3",
    title: "Vulnerability Assessment — Internal Network Q4",
    type: "vuln",
    findings: [
      {
        id: "f5",
        title: "Unpatched EternalBlue exposure on legacy host",
        severity: "critical",
        body: "One Windows Server 2012 R2 host remained unpatched for MS17-010 on an internal segment accessible from the DMZ.",
      },
      {
        id: "f6",
        title: "Default SNMP community strings",
        severity: "medium",
        body: "Twelve network devices used the default 'public' SNMP v2 community string, leaking topology information.",
      },
      {
        id: "f7",
        title: "Cleartext FTP on file-transfer server",
        severity: "low",
        body: "An internal FTP server was still active for legacy integrations, transmitting credentials in plaintext.",
      },
    ],
  },
  {
    id: "r4",
    title: "Web App Pentest — FinTech Client Portal",
    type: "pentest",
    findings: [
      {
        id: "f8",
        title: "SQL injection in transaction filter",
        severity: "critical",
        body: "The date-range filter on /api/transactions passed user input directly to a raw SQL query, allowing full database extraction.",
      },
      {
        id: "f9",
        title: "Broken object-level authorisation on statements",
        severity: "high",
        body: "Authenticated users could enumerate other customers' monthly statements by iterating the statement_id path parameter.",
      },
      {
        id: "f10",
        title: "Missing HSTS on login subdomain",
        severity: "low",
        body: "The login.client.example.com subdomain lacked Strict-Transport-Security, exposing sessions to downgrade attacks on hostile networks.",
      },
    ],
  },
];

export const cvVariants = {
  developer: `Eddy Max Kilonzo — Software / Web
Stack: React, Next.js, Node, TypeScript, PostgreSQL
Focus: product engineering, design systems, WebGL experiences.`,
  cyber: `Eddy Max Kilonzo — Cybersecurity
Stack: SIEM, detection engineering, Python, cloud hardening
Focus: blue team, IR, vuln research.`,
  design: `Eddy Max Kilonzo — Creative technologist
Stack: Figma, motion, Three.js, prototyping
Focus: interactive narratives and immersive UI.`,
};
