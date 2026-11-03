import type { ChatAppendMessageDTO, SpindleAPI, WorkerToHost } from "lumiverse-spindle-types";
import { SPINDLE_HOST_CAPABILITIES } from "lumiverse-spindle-types";

declare const spindle: SpindleAPI;
const message: ChatAppendMessageDTO = {
  role: "assistant", content: "", name: "Character", characterId: "character", metadata: { run: "run" },
};
await spindle.chat.appendMessage("chat", message);
await spindle.chat.appendMessage("chat", { role: "assistant", content: "", name: "Character", characterId: "character" });
await spindle.chat.appendMessage("chat", { role: "user", content: "Hello" }, true);
const wire: WorkerToHost = { type: "chat_append_message", requestId: "request", chatId: "chat", message };
const capability: number = SPINDLE_HOST_CAPABILITIES["chat-append-identity-v1"];
// @ts-expect-error Character identifiers must be strings.
spindle.chat.appendMessage("chat", { role: "assistant", content: "", characterId: 42 });
// @ts-expect-error Display names must be strings.
spindle.chat.appendMessage("chat", { role: "assistant", content: "", name: false });
void wire; void capability;
