import type { SpindleAPI, MessageGenerationInputDTO, MessageGenerationResultDTO, WorkerToHost } from "lumiverse-spindle-types";
declare const spindle: SpindleAPI;
const prepared = await spindle.generate.dryRun({ chatId: "chat", presetId: "preset", forcePresetId: true, retainResponseContext: true });
const input: MessageGenerationInputDTO = { chatId: "chat", messageId: "message", responseContextIds: [prepared.responseContextId!] };
const session = await spindle.generate.beginMessage(input);
spindle.generate.rawStream({ type: "raw", messages: [{ role: "user", content: "Hello" }], sessionId: session.id, swipeIndex: 0 });
const result: MessageGenerationResultDTO = await spindle.generate.finishMessage(session.id);
await spindle.generate.abortMessage(session.id);
const wire: WorkerToHost = { type: "message_generation_begin", requestId: "request", input };
// @ts-expect-error Retained contexts must be requested with a boolean.
spindle.generate.dryRun({ chatId: "chat", retainResponseContext: "yes" });
// @ts-expect-error The target message must be explicit.
spindle.generate.beginMessage({ chatId: "chat", responseContextIds: [] });
const prefill: string | undefined = prepared.assistantPrefill;
void result; void wire; void prefill;
