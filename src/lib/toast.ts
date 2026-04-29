export type ToastKind = "info" | "success" | "warning";

export function emitToast(message: string, kind: ToastKind = "info") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("portfolio:toast", {
      detail: { message, kind },
    }),
  );
}
