declare module "canvas-confetti" {
  type Options = {
    particleCount?: number;
    spread?: number;
    origin?: { x?: number; y?: number };
  };
  function confetti(options?: Options): Promise<null> | null;
  export default confetti;
}
