import dynamic from "next/dynamic";

const PortfolioPage = dynamic(
  () =>
    import("@/components/PortfolioPage").then((mod) => mod.PortfolioPage),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen items-center justify-center bg-bg font-mono text-sm text-highlight/60">
        Loading...
      </div>
    ),
  },
);

export default function Home() {
  return <PortfolioPage />;
}
