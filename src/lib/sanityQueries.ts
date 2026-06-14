import {sanityClient} from './sanity'
import {
  nowItems as staticNowItems,
  changelog as staticChangelog,
  projects as staticProjects,
  skillsByRole as staticSkillsByRole,
  certs as staticCerts,
  education as staticEducation,
  testimonials as staticTestimonials,
  faqs as staticFaqs,
  publications as staticPublications,
  type NowItem,
  type ChangelogEntry,
  type Project,
  type Cert,
  type EducationItem,
  type Testimonial,
  type FaqItem,
  type Publication,
} from '@/content/portfolio'

// Merge helper: static array + Sanity array, deduplicated by key
function merge<T>(staticArr: T[], sanityArr: T[], key: keyof T): T[] {
  const staticKeys = new Set(staticArr.map((i) => i[key]))
  const newItems = sanityArr.filter((i) => !staticKeys.has(i[key]))
  return [...staticArr, ...newItems]
}

// ── Now items ─────────────────────────────────────────────────────────────────
export async function getNowItems(): Promise<NowItem[]> {
  const sanityItems: NowItem[] = await sanityClient
    .fetch(`*[_type == "nowItem"] | order(order asc) { title, lines }`)
    .catch(() => [])
  return merge(staticNowItems, sanityItems, 'title')
}

export async function getChangelog(): Promise<ChangelogEntry[]> {
  const sanityEntries: ChangelogEntry[] = await sanityClient
    .fetch(`*[_type == "changelogEntry"] | order(date desc) { date, item }`)
    .catch((err) => { console.error('[Sanity] changelog fetch failed:', err); return [] })
  console.log('[Sanity] changelog entries:', sanityEntries)
  const merged = merge(staticChangelog, sanityEntries, 'item')
  return merged.sort((a, b) => b.date.localeCompare(a.date))
}

// ── Projects ──────────────────────────────────────────────────────────────────
export async function getProjects(): Promise<Project[]> {
  const sanityProjects: Project[] = await sanityClient
    .fetch(
      `*[_type == "project"] | order(order asc) {
        "id": id.current,
        title, shortDescription, roleMode, tech, skills, category, difficulty,
        demoType, videoUrl, liveUrl, codeUrl,
        "screenshotFallback": coalesce(screenshot.asset->url, screenshotFallback),
        caseStudy
      }`,
    )
    .catch(() => [])
  return merge(staticProjects, sanityProjects, 'id')
}

// ── Skills ────────────────────────────────────────────────────────────────────
type SkillEntry = { name: string; level: number; related: string[] }

export async function getSkillsByRole(): Promise<typeof staticSkillsByRole> {
  const sanitySkills: (SkillEntry & { roleMode: string })[] = await sanityClient
    .fetch(
      `*[_type == "skill"] | order(order asc) { name, roleMode, level, related }`,
    )
    .catch(() => [])

  const result = {...staticSkillsByRole}
  for (const s of sanitySkills) {
    const role = s.roleMode as keyof typeof staticSkillsByRole
    if (!result[role]) continue
    const exists = result[role].some((e) => e.name === s.name)
    if (!exists) result[role] = [...result[role], {name: s.name, level: s.level, related: s.related ?? []}]
  }
  return result
}

// ── Certifications ────────────────────────────────────────────────────────────
export async function getCerts(): Promise<Cert[]> {
  const sanityCerts: Cert[] = await sanityClient
    .fetch(
      `*[_type == "certification"] | order(order asc) {
        "id": id.current,
        title, issuer, description, why, category,
        date, pdfUrl, inProgress, progressPct, verifyUrl, credentialId
      }`,
    )
    .catch(() => [])
  return merge(staticCerts, sanityCerts, 'id')
}

// ── Education ─────────────────────────────────────────────────────────────────
export async function getEducation(): Promise<EducationItem[]> {
  const sanityEd: EducationItem[] = await sanityClient
    .fetch(
      `*[_type == "education"] | order(order asc) {
        "id": id.current,
        degree, institution, year, gpa, honors, thesis,
        coursework, technologies,
        "logoUrl": coalesce(logo.asset->url, logoUrl),
        badgeUrl, credentialUrl
      }`,
    )
    .catch(() => [])
  return merge(staticEducation, sanityEd, 'id')
}

// ── Testimonials ──────────────────────────────────────────────────────────────
export async function getTestimonials(): Promise<Testimonial[]> {
  const sanityT: Testimonial[] = await sanityClient
    .fetch(
      `*[_type == "testimonial"] | order(order asc) {
        "id": id.current,
        quote, name, role, company
      }`,
    )
    .catch(() => [])
  return merge(staticTestimonials, sanityT, 'id')
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
export async function getFaqs(): Promise<FaqItem[]> {
  const sanityFaqs: FaqItem[] = await sanityClient
    .fetch(
      `*[_type == "faq"] | order(order asc) {
        "id": id.current,
        "q": question,
        "a": answer
      }`,
    )
    .catch(() => [])
  return merge(staticFaqs, sanityFaqs, 'id')
}

// ── Blog posts ────────────────────────────────────────────────────────────────
export async function getBlogPosts(): Promise<Publication[]> {
  const sanityPosts: Publication[] = await sanityClient
    .fetch(
      `*[_type == "blogPost" && published == true] | order(date desc) {
        "id": slug.current,
        title,
        "kind": coalesce(kind, "blog"),
        date,
        "summary": coalesce(summary, ""),
        url
      }`,
    )
    .catch(() => [])
  return merge(staticPublications, sanityPosts, 'id')
}
