import { StateCard } from "@/components/ui/StateCard";

export default function NotFound() {
  return (
    <main className="section-bg flex min-h-screen items-center justify-center px-6 py-20">
      <div className="w-full max-w-2xl">
        <StateCard
          title="404 — Signal lost"
          message="The page you requested does not exist, moved, or is no longer routed. Jump back to the main portfolio and continue exploring."
          ctaLabel="Back to home"
          ctaHref="/"
        />
      </div>
    </main>
  );
}
