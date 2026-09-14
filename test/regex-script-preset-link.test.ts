import { describe, expect, test } from "bun:test";
import {
  buildsOwnerUpdatePayload,
  buildsPresetLinkedCreatePayload,
  keepsRegexScriptPresetLinkShape,
} from "./regex-script-preset-link";

describe("regex script preset link DTO", () => {
  test("create payloads carry the optional preset link", () => {
    expect(buildsPresetLinkedCreatePayload()).toEqual({
      name: "Bound rule",
      find_regex: "bound",
      preset_id: "preset-1",
    });
  });

  test("update payloads keep every field that is not create-only", () => {
    expect(buildsOwnerUpdatePayload()).toEqual({
      name: "Bound rule v2",
      disabled: true,
      folder_version: null,
      metadata: { note: "kept" },
    });
  });

  test("declares the create and read link shape", () => {
    expect(keepsRegexScriptPresetLinkShape()).toBe("regex script preset link shape");
  });
});
