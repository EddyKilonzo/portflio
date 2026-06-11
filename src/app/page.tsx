import dynamic from "next/dynamic";

// ssr:false defers the entire PortfolioPage client tree (gsap, animejs, Three.js,
// all sections) from the server-side compile pass, so "Compiling /..." is instant.
// The BootSequence overlay covers the brief gap while the JS chunk loads.
const PortfolioPage = dynamic(
  () => import("@/components/PortfolioPage").then((m) => m.PortfolioPage),
  { ssr: false, loading: () => null },
);

export default function Home() {
  return <PortfolioPage />;
}
