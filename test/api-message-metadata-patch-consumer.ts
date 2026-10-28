import type { SpindleAPI, WorkerToHost } from "lumiverse-spindle-types";

declare const spindle: SpindleAPI;
spindle.chat.updateMessage("chat", "message", { metadata_patch: { progress: 1, detail: null } });
const wire: Extract<WorkerToHost, { type: "chat_update_message" }> = {
  type: "chat_update_message", requestId: "request", chatId: "chat", messageId: "message",
  patch: { metadata_patch: { progress: 1 } },
};
// @ts-expect-error Metadata patches must be objects.
spindle.chat.updateMessage("chat", "message", { metadata_patch: "invalid" });
void wire;
