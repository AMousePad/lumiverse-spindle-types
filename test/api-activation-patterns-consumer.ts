import type { ActivationPatternsOptions, ActivationPatternsResult, SpindleAPI, WorkerToHost } from "lumiverse-spindle-types";

declare const spindle: SpindleAPI;
const options: ActivationPatternsOptions = {
  presetId: "preset-id", patterns: ["^{{char}}:{{getchatvar::mode}}$"],
  chatId: "chat-id", characterId: "character-id", personaId: "persona-id",
  connectionId: "connection-id", userId: "user-id",
};
const result: Promise<ActivationPatternsResult> = spindle.regex_scripts.prepareActivationPatterns(options);
spindle.regex_scripts.prepareActivationPatterns({ presetId: "preset-id", patterns: ["{{user}}"] });
const wire: WorkerToHost = {
  type: "regex_scripts_prepare_activation_patterns", requestId: "request-id", options,
};
const mixed: ActivationPatternsResult = {
  patterns: [{ source: "{{char}}", resolved: "Name" }, { source: "{{unsupported}}", error: "Unsupported input" }],
};

// @ts-expect-error A preset is required to select persisted context.
spindle.regex_scripts.prepareActivationPatterns({ patterns: ["{{char}}"] });
// @ts-expect-error Patterns must be an array.
spindle.regex_scripts.prepareActivationPatterns({ presetId: "preset-id", patterns: "{{char}}" });
// @ts-expect-error Failed rows have no resolved pattern.
const requiredPattern: string = mixed.patterns[1].resolved;

void [result, wire, requiredPattern];
