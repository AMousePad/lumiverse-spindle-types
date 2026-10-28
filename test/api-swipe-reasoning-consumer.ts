import type { SpindleAPI, SwipeReasoningDTO, WorkerToHost } from "lumiverse-spindle-types";

declare const spindle: SpindleAPI;
const reasoning: (SwipeReasoningDTO | null)[] = [{ text: "First thought", duration: 1200 }, null, { text: "Third thought" }];
spindle.chat.updateMessage("chat", "message", { swipes: ["First", "Second", "Third"], swipe_reasoning: reasoning });
const wire: Extract<WorkerToHost, { type: "chat_update_message" }> = {
  type: "chat_update_message", requestId: "request", chatId: "chat", messageId: "message", patch: { swipe_reasoning: reasoning },
};
spindle.chat.updateMessage("chat", "message", { reasoning: { text: null } });
// @ts-expect-error Each non-null entry needs its text, including null to clear it.
spindle.chat.updateMessage("chat", "message", { swipe_reasoning: [{ duration: 100 }] });
// @ts-expect-error Duration is numeric milliseconds.
spindle.chat.updateMessage("chat", "message", { swipe_reasoning: [{ text: "Thought", duration: "1s" }] });
void wire;
