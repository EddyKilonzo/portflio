export type SectionLink = {
  id: string;
  label: string;
  shortLabel: string;
  showInTopNav?: boolean;
};

export const sectionLinks: SectionLink[] = [
  { id: "hero",       label: "Home",        shortLabel: "Home",    showInTopNav: true },
  { id: "about",      label: "About",       shortLabel: "About",   showInTopNav: true },
  { id: "education",  label: "Education",   shortLabel: "Edu",     showInTopNav: true },
  { id: "now",        label: "Now",         shortLabel: "Now",     showInTopNav: true },
  { id: "roles",      label: "Roles",       shortLabel: "Roles",   showInTopNav: true },
  { id: "skills",     label: "Skills",      shortLabel: "Skills",  showInTopNav: true },
  { id: "projects",   label: "Projects",    shortLabel: "Projects",showInTopNav: true },
  { id: "experience", label: "Experience",  shortLabel: "Exp",     showInTopNav: true },
  { id: "badges",     label: "Credentials", shortLabel: "Creds",   showInTopNav: true },
  { id: "blog",       label: "Blog",        shortLabel: "Blog",    showInTopNav: true },
  { id: "cv",         label: "CV",          shortLabel: "CV",      showInTopNav: true },
  { id: "booking",    label: "Booking",     shortLabel: "Book",    showInTopNav: true },
  { id: "faq",        label: "FAQ",         shortLabel: "FAQ",     showInTopNav: true },
  { id: "contact",    label: "Contact",     shortLabel: "Contact", showInTopNav: true },
];
