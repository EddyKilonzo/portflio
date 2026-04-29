import { StateCard } from "@/components/ui/StateCard";

export default function OfflinePage() {
  return (
    <main className="section-bg flex min-h-screen items-center justify-center px-6 py-20">
      <div className="w-full max-w-2xl">
        <StateCard
          title="Offline mode"
          message="You are offline. The shell is cached and interactive basics stay available. Full content automatically resumes once your connection returns."
          ctaLabel="Try reconnect"
          ctaHref="/"
        />
      </div>
    </main>
  );
}
