import type { SpindleAPI, LlmMessageDTO } from "lumiverse-spindle-types";
declare const spindle: SpindleAPI;
const preview = await spindle.generate.dryRun({ chatId: "chat", includeRequestMessages: true });
const messages: LlmMessageDTO[] | undefined = preview.request_messages;
const prefill: string | undefined = preview.assistantPrefill;
// @ts-expect-error The opt-in must be boolean.
spindle.generate.dryRun({ chatId: "chat", includeRequestMessages: "raw" });
void messages; void prefill;
