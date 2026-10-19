import { expect, test } from "bun:test";
import { ALL_PERMISSIONS, isValidPermission, SPINDLE_HOST_CAPABILITIES } from "../src/index";
test("exports the embeddings permission and host capability", () => {
  expect(ALL_PERMISSIONS.filter((permission) => permission === "embeddings")).toHaveLength(1);
  expect(isValidPermission("embeddings")).toBe(true);
  expect(SPINDLE_HOST_CAPABILITIES["embeddings-v1"]).toBe(1);
});
