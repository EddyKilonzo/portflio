export type SectionLink = {
  id: string;
  label: string;
  shortLabel: string;
  showInTopNav?: boolean;
};

export const sectionLinks: SectionLink[] = [
  { id: "hero", label: "Home", shortLabel: "HOM", showInTopNav: true },
  { id: "now", label: "Now", shortLabel: "NOW", showInTopNav: true },
  { id: "story", label: "Story", shortLabel: "STY", showInTopNav: true },
  { id: "about", label: "About", shortLabel: "ABT", showInTopNav: true },
  { id: "roles", label: "Roles", shortLabel: "ROL", showInTopNav: true },
  { id: "skills", label: "Skills", shortLabel: "SKL", showInTopNav: true },
  { id: "projects", label: "Projects", shortLabel: "PRJ", showInTopNav: true },
  { id: "cyber", label: "Cyber", shortLabel: "CYB", showInTopNav: true },
  { id: "reports", label: "Reports", shortLabel: "RPT", showInTopNav: true },
  { id: "badges", label: "Badges", shortLabel: "BDG", showInTopNav: true },
  {
    id: "publications",
    label: "Publications",
    shortLabel: "PUB",
    showInTopNav: true,
  },
  {
    id: "testimonials",
    label: "Testimonials",
    shortLabel: "TES",
    showInTopNav: true,
  },
  { id: "faq", label: "FAQ", shortLabel: "FAQ", showInTopNav: true },
  { id: "education", label: "Education", shortLabel: "EDU" },
  { id: "certs", label: "Certs", shortLabel: "CER" },
  { id: "experience", label: "Experience", shortLabel: "EXP" },
  { id: "integrations", label: "Integrations", shortLabel: "INT" },
  { id: "cv", label: "CV", shortLabel: "CV" },
  { id: "downloads", label: "Downloads", shortLabel: "DLS" },
  { id: "booking", label: "Booking", shortLabel: "BKG" },
  { id: "trust", label: "Trust", shortLabel: "TRS" },
  { id: "contact", label: "Contact", shortLabel: "CNT" },
];

