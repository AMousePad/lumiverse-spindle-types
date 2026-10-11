import type { SavedBreakdownDTO, SpindleAPI, WorkerToHost } from "lumiverse-spindle-types";

declare const spindle: SpindleAPI;
const owned: Promise<SavedBreakdownDTO | null> = spindle.generate.getBreakdown("message-id");
const scoped: Promise<SavedBreakdownDTO | null> = spindle.generate.getBreakdown("message-id", "user-id");
const wire: WorkerToHost = {
  type: "generate_get_breakdown", requestId: "request-id", messageId: "message-id", userId: "user-id",
};
const minimal: SavedBreakdownDTO = {
  entries: [{ name: "History", type: "chat_history", tokens: 0 }],
  totalTokens: 0, maxContext: 8192, model: "model", provider: "provider",
};
const populated: SavedBreakdownDTO = {
  ...minimal,
  entries: [{ name: "Extension", type: "extension", tokens: 10, role: "system", content: "Text",
    blockId: "block-id", extensionId: "extension-id", extensionName: "Extension",
    messageCount: 1, firstMessageIndex: 0 }],
  messages: [{ role: "system", content: "Text" }], parameters: { temperature: 0.7 },
  chatHistoryTokens: 0, presetName: "Preset", presetId: "preset-id", tokenizer_name: null,
  usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15, provider_raw: {} },
};

async function read(): Promise<number | null> {
  const result = await owned;
  // @ts-expect-error A missing or inaccessible breakdown returns null.
  const required: SavedBreakdownDTO = result;
  void required;
  return result?.totalTokens ?? null;
}

// @ts-expect-error The message ID is required.
spindle.generate.getBreakdown();
void [scoped, wire, populated, read];
