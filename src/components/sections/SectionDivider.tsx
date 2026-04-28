type Props = { variant?: "diagonal" | "wave" };

export function SectionDivider({ variant = "diagonal" }: Props) {
  if (variant === "wave") {
    return (
      <div className="relative h-16 w-full overflow-hidden text-surfaceMid/25">
        <svg
          className="absolute bottom-0 w-full"
          viewBox="0 0 1440 48"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            fill="currentColor"
            d="M0,32 C360,0 720,64 1080,32 C1260,16 1380,8 1440,12 L1440,48 L0,48 Z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative h-12 w-full overflow-hidden bg-transparent">
      <svg
        className="absolute -bottom-px w-full text-surfaceMid/20"
        viewBox="0 0 100 12"
        preserveAspectRatio="none"
        aria-hidden
      >
        <polygon fill="currentColor" points="0,12 100,0 100,12" />
      </svg>
    </div>
  );
}
