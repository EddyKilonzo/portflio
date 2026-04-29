import dynamic from "next/dynamic";
import { StateCard } from "@/components/ui/StateCard";

const PortfolioPage = dynamic(
  () =>
    import("@/components/PortfolioPage").then((mod) => mod.PortfolioPage),
  {
    ssr: false,
    loading: () => (
      <div className="section-bg flex min-h-screen items-center justify-center px-6 py-20">
        <div className="w-full max-w-2xl">
          <StateCard
            compact
            title="Loading portfolio"
            message="Warming up interactive modules and preparing project sections."
          />
        </div>
      </div>
    ),
  },
);

export default function Home() {
  return <PortfolioPage />;
}
