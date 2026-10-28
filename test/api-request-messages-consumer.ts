import type { SpindleAPI, LlmMessageDTO } from "lumiverse-spindle-types";
declare const spindle: SpindleAPI;
const preview = await spindle.generate.dryRun({ chatId: "chat", includeRequestMessages: true });
const messages: LlmMessageDTO[] | undefined = preview.request_messages;
const prefill: string | undefined = preview.assistantPrefill;
for (const message of messages ?? []) {
  const partial: boolean | undefined = message.partial;
  const signature: string | undefined = message.thought_signature;
  if (Array.isArray(message.content)) {
    for (const part of message.content) {
      if (part.type === "text") {
        const textSignature: string | undefined = part.thought_signature;
        void textSignature;
      }
    }
  }
  void partial;
  void signature;
}
// @ts-expect-error The opt-in must be boolean.
spindle.generate.dryRun({ chatId: "chat", includeRequestMessages: "raw" });
void messages;
void prefill;
