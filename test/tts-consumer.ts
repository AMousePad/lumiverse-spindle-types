import { SPINDLE_TTS_HOST_CAPABILITIES } from "lumiverse-spindle-types";
import type { SpindleFrontendContext, SpindleTTSAPI, SpindleTTSSpeakInput } from "lumiverse-spindle-types";

declare const ctx: SpindleFrontendContext;

// Older hosts remain representable, and callers must feature-detect the API.
const legacy: Pick<SpindleFrontendContext, "tts"> = {};
const capability: 1 = SPINDLE_TTS_HOST_CAPABILITIES["text-to-speech-v1"];
async function voiceReply() {
  if (!ctx.tts || (ctx.host.capabilities["text-to-speech-v1"] ?? 0) < capability) return;
  const tts: SpindleTTSAPI = ctx.tts;
  const unsubscribe: () => void = tts.subscribe((speaking: boolean) => { void speaking; });
  const reply: SpindleTTSSpeakInput = { text: "Opening your world books." };
  await tts.speak(reply, { connectionId: "tts-connection-id" });
  await tts.speak({ messageId: "message-id" });
  const speaking: boolean = tts.isSpeaking();
  tts.stop();
  unsubscribe();
  // @ts-expect-error Input is text or a message id, not both shapes at once without either field.
  void tts.speak({});
  // @ts-expect-error Text and a message id are mutually exclusive.
  void tts.speak({ text: "Hello", messageId: "message-id" });
  // @ts-expect-error Connection overrides apply only to text input.
  void tts.speak({ messageId: "message-id" }, { connectionId: "tts-connection-id" });
  void speaking;
}
void [legacy, voiceReply];
