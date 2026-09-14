import type {
  RegexScriptCreateDTO,
  RegexScriptDTO,
  RegexScriptUpdateDTO,
} from "lumiverse-spindle-types";

/**
 * Create payload that carries the preset link, typed through the public DTO so a
 * consumer never has to cast when it binds a script to a preset.
 */
export function buildsPresetLinkedCreatePayload(): RegexScriptCreateDTO {
  return { name: "Bound rule", find_regex: "bound", preset_id: "preset-1" };
}

/** Update payload using every field the host still accepts from the owner. */
export function buildsOwnerUpdatePayload(): RegexScriptUpdateDTO {
  return { name: "Bound rule v2", disabled: true, folder_version: null, metadata: { note: "kept" } };
}

/** Marker kept in step with test/regex-script-preset-link.test.ts. */
export function keepsRegexScriptPresetLinkShape(): string {
  return "regex script preset link shape";
}

// ─── Type-level contract (checked by `bun run build:consumer`) ────────────────

declare const response: RegexScriptDTO;

/** Reading the projected link must not need a cast. */
export function readsProjectedPresetLink(): string | null | undefined {
  return response.preset_id;
}

/** Negative cases: the link is creatable, read-only, and never re-pointed. */
export function assertsCreateOnlyPresetLink(): void {
  const linked: RegexScriptCreateDTO = { name: "Rule", find_regex: "x", preset_id: "preset-1" };
  const unlinked: RegexScriptCreateDTO = { name: "Rule", find_regex: "x", preset_id: null };
  void linked;
  void unlinked;

  // @ts-expect-error a preset link is a string or null, never a number
  const malformed: RegexScriptCreateDTO = { name: "Rule", find_regex: "x", preset_id: 42 };
  void malformed;

  // @ts-expect-error the preset link is create-only; an update cannot re-point it
  const rePointed: RegexScriptUpdateDTO = { preset_id: "preset-2" };
  void rePointed;

  // @ts-expect-error the projected link is host-authored and read-only
  response.preset_id = "preset-2";
}
