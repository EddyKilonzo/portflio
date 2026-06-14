export type SectionLink = {
  id: string;
  label: string;
  shortLabel: string;
  showInTopNav?: boolean;
};

export const sectionLinks: SectionLink[] = [
  { id: "hero",       label: "Home",        shortLabel: "Home",     showInTopNav: false },
  { id: "about",      label: "About",       shortLabel: "About",    showInTopNav: true  },
  { id: "education",  label: "Education",   shortLabel: "Education",showInTopNav: false },
  { id: "now",        label: "Now",         shortLabel: "Now",      showInTopNav: false },
  { id: "roles",      label: "Roles",       shortLabel: "Roles",    showInTopNav: false },
  { id: "skills",     label: "Skills",      shortLabel: "Skills",   showInTopNav: false },
  { id: "projects",   label: "Projects",    shortLabel: "Projects", showInTopNav: true  },
  { id: "experience", label: "Experience",  shortLabel: "Experience",showInTopNav: true },
  { id: "badges",     label: "Credentials", shortLabel: "Credentials",showInTopNav: false },
  { id: "blog",       label: "Blog",        shortLabel: "Blog",     showInTopNav: false },
  { id: "cv",         label: "CV",          shortLabel: "CV",       showInTopNav: true  },
  { id: "booking",    label: "Booking",     shortLabel: "Booking",  showInTopNav: false },
  { id: "faq",        label: "FAQ",         shortLabel: "FAQ",      showInTopNav: false },
  { id: "contact",    label: "Contact",     shortLabel: "Contact",  showInTopNav: true  },
];
