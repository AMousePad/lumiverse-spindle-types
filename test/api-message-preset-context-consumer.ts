import type {
  DryRunResultDTO, MacroVariableSnapshotDTO, MessagePresetContextDTO,
  SpindleAPI, SpindleDisplayContext, SpindleMessageMetadataDTO,
} from "lumiverse-spindle-types";

const snapshot: MacroVariableSnapshotDTO = {
  local: { mode: "story" }, global: {}, chat: { turn: "2" },
  prompt_defaults: { style: "brief" }, prompt_selections: { style: ["brief"] },
};
const source: MessagePresetContextDTO = { preset_id: "source", variables: snapshot };
const partial: MessagePresetContextDTO = { preset_id: "source", variables: { chat: {} } };
const metadata: SpindleMessageMetadataDTO = { custom: "retained", preset_contexts: [source, null, partial] };
const request: Parameters<SpindleAPI["generate"]["dryRun"]>[0] = {
  chatId: "chat", presetId: "source", forcePresetId: true,
};
declare const result: Awaited<ReturnType<SpindleAPI["generate"]["dryRun"]>>;
const captured: MacroVariableSnapshotDTO | undefined = result.variable_state;
const resolver: SpindleDisplayContext = { isUser: false, depth: 0, presetContext: source, presetRegexIds: ["rule"] };
const ordinary: DryRunResultDTO = { messages: [], breakdown: [], parameters: {}, model: "model", provider: "provider" };
const legacyResolver: SpindleDisplayContext = { isUser: false, depth: 0 };

// @ts-expect-error Ordinary dry runs need not return captured variables.
const required: MacroVariableSnapshotDTO = result.variable_state;
// @ts-expect-error Captured macro values must be strings.
const invalidVariable: MessagePresetContextDTO = { preset_id: "source", variables: { chat: { turn: 2 } } };
// @ts-expect-error Prompt selections are arrays of strings.
const invalidSelection: MessagePresetContextDTO = { preset_id: "source", variables: { prompt_selections: { style: "brief" } } };
// @ts-expect-error Each non-null context identifies its source preset.
const invalidSlot: SpindleMessageMetadataDTO = { preset_contexts: [{ variables: {} }] };

void [metadata, request, captured, resolver, ordinary, legacyResolver, required, invalidVariable, invalidSelection, invalidSlot];
