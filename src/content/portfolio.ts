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
  },
  rssFeedUrl: "https://example.com/blog/rss",
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
    id: "sentinel-siem",
    title: "Sentinel SIEM Playground",
    shortDescription:
      "Simulated SIEM dashboards, log pipelines, and detection engineering lab for training blue-team workflows.",
    roleMode: "cyber",
    tech: ["Elastic", "Python", "Docker", "Sigma"],
    category: "SIEM & Detection Engineering",
    difficulty: "advanced",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    liveUrl: "https://example.com",
    codeUrl: "https://github.com/EddyKilonzo",
    demoType: "cyber",
    skills: ["SIEM tools", "Incident Response", "Python"],
    screenshotFallback: "https://picsum.photos/seed/sentinel-siem/960/600",
    caseStudy: {
      problem:
        "Blue-team practice is often stuck in static labs without realistic detection-to-dashboard workflows.",
      approach: [
        "Build a repeatable log pipeline that feeds simulated events into an Elastic-style stack.",
        "Author detection rules (Sigma-style) and validate them against curated example traffic.",
        "Provide a dashboard walkthrough path so trainees can connect detections to operator actions.",
      ],
      outcome:
        "A training playground where detections, dashboards, and iterative improvements can be practiced safely.",
      metrics: ["Rule iterations: 10+", "Lab walkthroughs: repeatable flow", "Operator view coverage: high"],
      architectureNotes: [
        "Rule layer (Sigma-like definitions) separated from ingestion and visualization.",
        "Containerized services to keep lab setup consistent across devices.",
        "Detections are structured so trainees can compare changes between iterations.",
      ],
      screenshots: ["https://picsum.photos/seed/sentinel-siem/800/480"],
    },
  },
  {
    id: "phish-hunter",
    title: "PhishHunter OSINT Suite",
    shortDescription:
      "Automated phishing domain discovery using passive DNS, certificate transparency logs, and typosquat heuristics.",
    roleMode: "cyber",
    tech: ["Python", "Shodan", "OSINT", "PostgreSQL"],
    category: "OSINT & Threat Research",
    difficulty: "intermediate",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    codeUrl: "https://github.com/EddyKilonzo",
    demoType: "cyber",
    skills: ["OSINT", "Python", "Vulnerability Assessment"],
    screenshotFallback: "https://picsum.photos/seed/phish-hunter/960/600",
    caseStudy: {
      problem:
        "Threat intel teams need faster domain discovery workflows without manually correlating passive signals.",
      approach: [
        "Ingest and normalize passive DNS / CT-like sources into a common candidate model.",
        "Apply typosquat heuristics and reputation-style heuristics to rank candidates.",
        "Persist candidates in a lightweight database to support iterative investigations.",
      ],
      outcome:
        "A practical OSINT pipeline that turns passive signals into ranked phishing candidates for triage.",
      metrics: ["Candidate throughput: high", "Signal sources: 2+", "Triage ranking: deterministic"],
      architectureNotes: [
        "Separation between collection, enrichment, and ranking makes the workflow easy to extend.",
        "Database-backed candidates support re-runs without losing investigator context.",
        "Heuristics are transparent so outputs can be audited.",
      ],
      screenshots: ["https://picsum.photos/seed/phish-hunter/800/480"],
    },
  },
  {
    id: "redteam-c2",
    title: "RedTeam C2 Framework",
    shortDescription:
      "Lightweight command-and-control infrastructure for controlled red-team exercises with encrypted beacon channels.",
    roleMode: "cyber",
    tech: ["Go", "Kali Linux", "Metasploit", "Docker"],
    category: "Red Team Simulation",
    difficulty: "advanced",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    codeUrl: "https://github.com/EddyKilonzo",
    demoType: "cyber",
    skills: ["Metasploit", "Kali Linux", "Incident Response"],
    screenshotFallback: "https://picsum.photos/seed/redteam-c2/960/600",
    caseStudy: {
      problem:
        "Training exercises require realistic beacon behavior while keeping operators in full control of scope and safety.",
      approach: [
        "Implement a modular C2 core with encrypted beacon check-ins.",
        "Integrate with common red-team tooling workflows (e.g., chaining with Metasploit steps).",
        "Containerize components so labs can be spun up consistently for each exercise.",
      ],
      outcome:
        "A framework that supports realistic controlled exercises with operator-controlled behavior.",
      metrics: ["Beacon channel encryption: enabled", "Exercise setup time: minimized", "Toolchain integration: modular"],
      architectureNotes: [
        "Encrypted beacon channel isolates command delivery from transport noise.",
        "Separation between operator UI/config and agent check-in loop.",
        "Container orchestration reduces environment drift across runs.",
      ],
      screenshots: ["https://picsum.photos/seed/redteam-c2/800/480"],
    },
  },
  {
    id: "mesh-api",
    title: "Mesh API Gateway",
    shortDescription:
      "High-performance API edge with rate limiting, JWT rotation, and observability hooks.",
    roleMode: "engineering",
    tech: ["Go", "Redis", "gRPC", "Kubernetes"],
    category: "API Platform Engineering",
    difficulty: "advanced",
    videoUrl: "https://vimeo.com/148751763",
    codeUrl: "https://github.com/EddyKilonzo",
    demoType: "engineering",
    engineeringDemo: "api",
    skills: ["REST APIs", "Redis", "Kubernetes", "Docker"],
    screenshotFallback: "https://picsum.photos/seed/mesh-api/960/600",
    caseStudy: {
      problem:
        "Modern APIs need edge capabilities (rate limiting, token lifecycle, tracing) without sacrificing latency and maintainability.",
      approach: [
        "Route requests through an API gateway with pluggable policy modules.",
        "Implement JWT rotation logic that supports safe token lifecycle management.",
        "Add observability hooks so operators can debug and optimize hot paths.",
      ],
      outcome:
        "A production-minded gateway architecture with clear extension points and measurable performance goals.",
      metrics: ["P99 latency target: sub-10ms class", "Policy modules: extensible", "Observability: trace hooks"],
      architectureNotes: [
        "Policy checks run in a deterministic order to simplify reasoning and debugging.",
        "Redis used to coordinate rate limiting and token lifecycle state.",
        "gRPC between internal components keeps boundaries explicit.",
      ],
      screenshots: ["https://picsum.photos/seed/mesh-api/800/480"],
    },
  },
  {
    id: "event-stream",
    title: "Event Stream Processor",
    shortDescription:
      "Real-time Kafka-based pipeline that ingests, transforms, and routes millions of events per day with sub-10ms P99.",
    roleMode: "engineering",
    tech: ["Python", "Kafka", "PostgreSQL", "Docker"],
    category: "Streaming Data Engineering",
    difficulty: "advanced",
    videoUrl: "https://vimeo.com/148751763",
    codeUrl: "https://github.com/EddyKilonzo",
    demoType: "engineering",
    engineeringDemo: "schema",
    skills: ["Python", "PostgreSQL", "Docker", "CI/CD"],
    screenshotFallback: "https://picsum.photos/seed/event-stream/960/600",
    caseStudy: {
      problem:
        "High-volume event pipelines must remain correct under load while keeping operators able to introspect transformations.",
      approach: [
        "Ingest raw events from a Kafka-like stream and transform them into enriched records.",
        "Write outputs to downstream topics and persist key state to a relational store.",
        "Design the pipeline to support schema evolution without breaking consumer expectations.",
      ],
      outcome:
        "A scalable pipeline pattern for real-time ingestion, enrichment, and routing with operator-friendly observability.",
      metrics: ["Throughput: millions/day", "Routing: deterministic", "Schema evolution: safe"],
      architectureNotes: [
        "Transform stage is isolated so it can evolve independently of ingestion/output.",
        "Postgres persistence supports auditability and replay workflows.",
        "CI/CD keeps pipeline changes deployable with predictable rollouts.",
      ],
      screenshots: ["https://picsum.photos/seed/event-stream/800/480"],
    },
  },
  {
    id: "infra-scaffold",
    title: "IaC Scaffold CLI",
    shortDescription:
      "Opinionated Terraform + Helm scaffolding tool that bootstraps production-ready K8s clusters in under five minutes.",
    roleMode: "engineering",
    tech: ["Go", "Terraform", "Kubernetes", "Helm"],
    category: "Infrastructure Automation",
    difficulty: "advanced",
    videoUrl: "https://vimeo.com/148751763",
    codeUrl: "https://github.com/EddyKilonzo",
    demoType: "engineering",
    engineeringDemo: "algo",
    skills: ["Kubernetes", "CI/CD", "Linux", "Docker"],
    screenshotFallback: "https://picsum.photos/seed/infra-scaffold/960/600",
    caseStudy: {
      problem:
        "Spinning up production-like clusters should be fast, repeatable, and enforceable (security + defaults) without manual drift.",
      approach: [
        "Create an opinionated scaffold that generates Terraform and Helm templates from a constrained input model.",
        "Standardize defaults so clusters start secure and consistent across environments.",
        "Provide CLI workflows for init/destroy that wrap common IaC steps safely.",
      ],
      outcome:
        "A CLI that reduces cluster bootstrapping time and improves consistency through opinionated IaC templates.",
      metrics: ["Bootstrap time: <5 minutes", "Consistency: improved defaults", "Ops: predictable init/destroy"],
      architectureNotes: [
        "A constrained config model prevents accidental insecure template combinations.",
        "Templates separate platform primitives from app-level configuration.",
        "CLI wrappers help enforce ordering and reduce human error.",
      ],
      screenshots: ["https://picsum.photos/seed/infra-scaffold/800/480"],
    },
  },
  {
    id: "aurora-portfolio",
    title: "Aurora Portfolio Engine",
    shortDescription:
      "WebGL-forward portfolio shell with shader backgrounds and scroll-linked storytelling.",
    roleMode: "web",
    tech: ["Next.js", "Three.js", "GSAP", "Tailwind CSS"],
    category: "Interactive Web Experiences",
    difficulty: "intermediate",
    videoUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
    liveUrl: "https://nextjs.org",
    codeUrl: "https://github.com/EddyKilonzo",
    demoType: "web",
    skills: ["Next.js", "Three.js", "React", "TypeScript"],
    screenshotFallback: "https://picsum.photos/seed/aurora-portfolio/960/600",
    caseStudy: {
      problem:
        "Immersive WebGL effects need to remain performant and accessible while integrating with a maintainable UI architecture.",
      approach: [
        "Use scroll-linked storytelling to coordinate UI sections with visual shader states.",
        "Keep visual effects encapsulated so the UI remains easy to evolve.",
        "Apply motion controls that respect reduced-motion preferences.",
      ],
      outcome:
        "A responsive WebGL-first shell that supports immersive storytelling without compromising UX stability.",
      metrics: ["Performance: optimized render loop", "Accessibility: motion-aware", "Maintainability: encapsulated effects"],
      architectureNotes: [
        "Separate scene rendering from React UI state to reduce coupling.",
        "Motion is driven by scroll progress so interactions feel intentional.",
        "Reduced-motion gates prevent expensive effects on low-end devices.",
      ],
      screenshots: ["https://picsum.photos/seed/aurora-portfolio/800/480"],
    },
  },
  {
    id: "design-system",
    title: "Verdant Design System",
    shortDescription:
      "Component library and Figma token pipeline that syncs design decisions to code automatically via style-dictionary.",
    roleMode: "web",
    tech: ["React", "TypeScript", "Figma", "Storybook"],
    category: "Design Systems & UI Engineering",
    difficulty: "advanced",
    videoUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
    liveUrl: "https://nextjs.org",
    codeUrl: "https://github.com/EddyKilonzo",
    demoType: "web",
    skills: ["React", "TypeScript", "Figma", "Tailwind CSS"],
    screenshotFallback: "https://picsum.photos/seed/design-system/960/600",
    caseStudy: {
      problem:
        "Design tokens drift when teams manually translate Figma decisions into code, causing UI inconsistency and slower delivery.",
      approach: [
        "Automate token extraction and generation with a style-dictionary-based pipeline.",
        "Build components that consume tokens consistently and expose ergonomic APIs.",
        "Use Storybook to validate component states and reduce regression risk.",
      ],
      outcome:
        "A maintainable design system where visual decisions flow from Figma to code with minimal friction.",
      metrics: ["Token sync: automated", "Regression risk: reduced via Storybook", "Consistency: improved"],
      architectureNotes: [
        "Tokens are the single source of truth for theme values.",
        "Components are built to be themeable without rewriting internals.",
        "Storybook becomes the integration surface for designers and engineers.",
      ],
      screenshots: ["https://picsum.photos/seed/design-system/800/480"],
    },
  },
  {
    id: "realtime-collab",
    title: "Realtime Collab Editor",
    shortDescription:
      "Google Docs-style collaborative editor using CRDTs for conflict-free merging and WebSocket presence awareness.",
    roleMode: "web",
    tech: ["Next.js", "Node.js", "GraphQL", "Framer Motion"],
    category: "Realtime Collaboration Systems",
    difficulty: "advanced",
    videoUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
    liveUrl: "https://nextjs.org",
    codeUrl: "https://github.com/EddyKilonzo",
    demoType: "web",
    skills: ["Next.js", "Node.js", "GraphQL", "TypeScript"],
    screenshotFallback: "https://picsum.photos/seed/realtime-collab/960/600",
    caseStudy: {
      problem:
        "Collaborative editing must reconcile concurrent changes reliably without forcing users to resolve conflicts.",
      approach: [
        "Model editor operations with CRDT semantics so concurrent edits merge deterministically.",
        "Use WebSocket presence to show collaborative cursors and editing activity.",
        "Keep network sync logic separate from rendering so UI updates stay responsive.",
      ],
      outcome:
        "A collaboration editor with conflict-free merges and presence-aware UX suitable for real-time workflows.",
      metrics: ["Merge correctness: deterministic", "Presence: real-time", "UI responsiveness: maintained"],
      architectureNotes: [
        "CRDT operation log provides a stable merge mechanism for concurrent edits.",
        "Rendering updates derive from merged document state.",
        "Presence events are handled independently to avoid blocking text sync.",
      ],
      screenshots: ["https://picsum.photos/seed/realtime-collab/800/480"],
    },
  },
];

export const projectCredibility: Record<string, ProjectCredibility> = {
  "sentinel-siem": { performanceScore: 94, accessibilityScore: 96, lighthouseScore: 95, loadTime: "1.2s" },
  "phish-hunter": { performanceScore: 92, accessibilityScore: 95, lighthouseScore: 94, loadTime: "1.3s" },
  "redteam-c2": { performanceScore: 90, accessibilityScore: 93, lighthouseScore: 92, loadTime: "1.4s" },
  "mesh-api": { performanceScore: 97, accessibilityScore: 94, lighthouseScore: 96, loadTime: "0.9s" },
  "event-stream": { performanceScore: 93, accessibilityScore: 92, lighthouseScore: 93, loadTime: "1.2s" },
  "infra-scaffold": { performanceScore: 95, accessibilityScore: 93, lighthouseScore: 94, loadTime: "1.1s" },
  "aurora-portfolio": { performanceScore: 89, accessibilityScore: 95, lighthouseScore: 92, loadTime: "1.6s" },
  "design-system": { performanceScore: 96, accessibilityScore: 98, lighthouseScore: 97, loadTime: "1.0s" },
  "realtime-collab": { performanceScore: 91, accessibilityScore: 94, lighthouseScore: 93, loadTime: "1.4s" },
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
