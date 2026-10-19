import type { SpindleFrontendContext, SpindleSTTTranscribeOptions, SpindleSTTWord } from "lumiverse-spindle-types";
declare const ctx: SpindleFrontendContext;
if (ctx.stt && (ctx.host.capabilities["speech-to-text-options-v1"] ?? 0) >= 1) {
  const options = { provider: "whistle", keywords: ["Lumi", "Seo-yeon"], words: true } satisfies SpindleSTTTranscribeOptions;
  const result = await ctx.stt.transcribe(new Blob(), options);
  const words: SpindleSTTWord[] = result.words ?? [];
  const timing: number = words[0].end - words[0].start;
  const probability: number = words[0].probability;
  const unsubscribe: () => void = ctx.stt.onHostActivity?.((active: boolean) => { void active; }) ?? (() => {});
  const capturing: boolean | undefined = ctx.stt.isHostCapturing?.();
  // @ts-expect-error Keywords are a list, not one separated string.
  void ctx.stt.transcribe(new Blob(), { keywords: "Lumi" });
  unsubscribe();
  void [timing, probability, capturing];
}
