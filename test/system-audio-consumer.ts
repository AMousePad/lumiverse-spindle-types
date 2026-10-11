import { SPINDLE_SYSTEM_AUDIO_HOST_CAPABILITIES } from "lumiverse-spindle-types";
import type {
  SpindleFrontendContext, SpindleSystemAudioAPI, SpindleSystemAudioAvailability, SpindleSystemAudioEndReason,
  SpindleSystemAudioFrame, SpindleSystemAudioSession,
} from "lumiverse-spindle-types";

declare const ctx: SpindleFrontendContext;
const capability: number = SPINDLE_SYSTEM_AUDIO_HOST_CAPABILITIES["system-audio-v1"];
if (ctx.systemAudio && ctx.host.capabilities["system-audio-v1"] >= capability) {
  const audio: SpindleSystemAudioAPI = ctx.systemAudio;
  const availability: SpindleSystemAudioAvailability = audio.isAvailable();
  if (availability.available) {
    const session: SpindleSystemAudioSession = audio.start({
      bands: 32,
      maxFps: 30,
      signal: new AbortController().signal,
      onFrame(frame: SpindleSystemAudioFrame) {
        const bars: number[] = frame.frequencies;
        const level: number = frame.amplitude + frame.peak;
        void [bars, level];
      },
      onEnd(reason: SpindleSystemAudioEndReason) {
        const why: "revoked" | "user-stopped" | "source-lost" | "host-disabled" = reason;
        void why;
      },
    });
    const ready: Promise<void> = session.ready;
    session.stop();
    void ready;
  }
  const reason: "unsupported" | "disabled" | undefined = availability.unavailableReason;
  void reason;
  // @ts-expect-error A frame callback is required: a session with nothing listening is meaningless.
  audio.start({});
  // @ts-expect-error Raw audio is never exposed, so there is no sample or stream option.
  audio.start({ onFrame() {}, includeSamples: true });
}
// Optional on legacy hosts and old mocks.
const legacy: Pick<SpindleFrontendContext, "systemAudio"> = {};
void legacy;
