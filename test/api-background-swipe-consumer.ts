import type { GenerationStartedPayloadDTO, SpindleAPI } from "lumiverse-spindle-types";
declare const spindle: SpindleAPI;
const normal: GenerationStartedPayloadDTO = { generationId: "g", chatId: "c", model: "mock" };
const background: GenerationStartedPayloadDTO = { ...normal, targetSwipeId: 2, backgroundSwipe: true };
spindle.on("GENERATION_STARTED", payload => {
  const target: number | undefined = payload.targetSwipeId;
  const preserving: boolean | undefined = payload.backgroundSwipe;
  void target; void preserving;
});
void background;
