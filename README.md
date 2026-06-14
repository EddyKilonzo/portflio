# Eddy Max Kilonzo — Portfolio

Personal portfolio for Eddy Max Kilonzo, Built with Next.js 14, Tailwind CSS, and Sanity CMS.

Live: [eddy-max.vercel.app](https://eddy-max.vercel.app)


---

## Tech stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Animations | GSAP, Anime.js, Framer Motion, AOS, Lenis |
| 3D | Three.js |
| CMS | Sanity (project `i8fwa4mk`, dataset `production`) |
| Booking | Cal.com embed (`@calcom/embed-react`) |
| Deployment | Vercel |

---

## Project structure

```
portfolio/                  Next.js app
├── src/
│   ├── app/                Routes and layout
│   ├── components/
│   │   ├── sections/       One component per portfolio section
│   │   ├── layout/         Nav, footer, scroll rail, etc.
│   │   ├── motion/         Animation wrappers
│   │   └── ui/             Shared UI primitives
│   ├── content/
│   │   ├── portfolio.ts    Static content (base data, types)
│   │   └── sections.ts     Nav and section config
│   ├── context/            Theme and role context
│   ├── hooks/              Custom hooks
│   └── lib/
│       ├── sanity.ts       Sanity client
│       └── sanityQueries.ts  GROQ queries with static fallback merge

studio-portfolio/           Sanity Studio (sibling folder)
```

---



### What you can manage in Sanity

| Studio section | Portfolio section |
|---|---|
| Projects | Projects grid |
| Skills | Skills graph (by role) |
| Certifications | Credentials / badges |
| Experience | Experience timeline |
| Education | Education section |
| Blog Posts | Blog |
| Testimonials | Testimonials carousel |
| FAQ | FAQ accordion |
| Now / Changelog | Now page |

---

## Deployment

Pushes to `main` deploy automatically via Vercel. No manual steps needed.

---

## Contact

Eddy Max Kilonzo — [eddymax3715@gmail.com](mailto:eddymax3715@gmail.com)
