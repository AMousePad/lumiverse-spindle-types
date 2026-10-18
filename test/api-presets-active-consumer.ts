import type { ActivePresetDTO, ActivePresetSourceDTO, SpindleAPI, UserPresetDTO, WorkerToHost } from "lumiverse-spindle-types";

declare const spindle: SpindleAPI;

async function effectiveBlocks(chatId: string) {
  const active: ActivePresetDTO = await spindle.presets.getActive(chatId);
  const source: ActivePresetSourceDTO = active.source;
  if (!active.preset_id) return [];
  const preset: UserPresetDTO | null = await spindle.presets.get(active.preset_id);
  void source;
  return (preset?.prompt_order ?? []).map((block) => ({
    ...block,
    enabled: active.block_states[block.id] ?? block.enabled,
  }));
}

// Without a chat: the selected preset and its defaults binding.
void spindle.presets.getActive();
// Operator-scoped extensions pass the user explicitly.
void spindle.presets.getActive("chat-id", "user-id");
void effectiveBlocks("chat-id");

const activePresetRequest: Extract<WorkerToHost, { type: "presets_get_active" }> = {
  type: "presets_get_active",
  requestId: "request-id",
};
const scopedActivePresetRequest: WorkerToHost = {
  type: "presets_get_active",
  requestId: "scoped-request-id",
  chatId: "chat-id",
  userId: "user-id",
};
void activePresetRequest;
void scopedActivePresetRequest;

// @ts-expect-error Unknown binding scope.
const invalidSource: ActivePresetSourceDTO = "group";
