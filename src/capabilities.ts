/**
 * Declared backend capabilities that opt an extension out of specific
 * Spindle heuristic-scanner blocks. Unlike permissions (runtime gates),
 * capabilities are install-time declarations that survive scanner checks.
 *
 * Only patterns with a meaningful false-positive rate get a capability —
 * truly dangerous modules (fs, child_process, raw sockets, sqlite, workers)
 * remain hard-blocked with no opt-in.
 */
export type SpindleCapability =
  /**
   * Bypass the `dynamic code execution` heuristic: `eval(...)`,
   * `Function(...)` / `new Function(...)`. Required for extensions that:
   *   - embed Zod / Handlebars / similar libs that probe `new Function("")`
   *     to feature-detect Cloudflare-Workers-style environments;
   *   - ship a regex literal whose source contains `Function\s*\(` (e.g.
   *     a security check that itself bans the Function constructor);
   *   - intentionally execute user-supplied code in a sandboxed runtime
   *     (lumiscript's AsyncFunction sandbox is the canonical example).
   *
   * Extensions declaring this still cannot reach fs / child_process / net /
   * etc. — those remain blocked by independent heuristics.
   */
  | "dynamic_code_execution"
  /**
   * Bypass the `base64 decoding` heuristic: `Buffer.from(s, "base64")`.
   * The pattern is commonly used to smuggle code past static scanners
   * (decode + eval the payload), but it has plenty of legitimate uses
   * (image bytes, binary asset I/O). Pair with `dynamic_code_execution`
   * only when the extension actually needs both.
   */
  | "base64_decode"
  /**
   * Opt in to the in-host runtime. An extension declaring this — together
   * with the `macro_interceptor` permission and a passing strict scan — may
   * have its `host_module` backend bundle loaded in-process by the host
   * instead of in an isolated worker, so its eval surface runs without the
   * worker IPC boundary.
   *
   * Install-time, non-revocable consent: in-host code runs with no sandbox,
   * so the strict static scan is the only remaining guard. Intended for
   * first-party / trusted bundles.
   */
  | "dynamic_module";

export const ALL_CAPABILITIES: readonly SpindleCapability[] = [
  "dynamic_code_execution",
  "base64_decode",
  "dynamic_module",
] as const;

export function isValidCapability(c: string): c is SpindleCapability {
  return (ALL_CAPABILITIES as readonly string[]).includes(c);
}
