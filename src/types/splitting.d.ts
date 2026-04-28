declare module "splitting" {
  type SplittingOptions = {
    target?: HTMLElement | string;
    by?: "chars" | "words" | "lines" | "items" | "grid";
    [key: string]: unknown;
  };

  function Splitting(opts?: SplittingOptions): unknown[];

  export default Splitting;
}
