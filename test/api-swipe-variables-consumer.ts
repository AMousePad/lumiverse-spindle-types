import type { SpindleAPI, SetSwipeVariablesDTO, WorkerToHost } from "lumiverse-spindle-types";
declare const spindle: SpindleAPI;
const input: SetSwipeVariablesDTO = { expected_variables: { global: {}, chat: {} }, expected_revision: null,
  expected_swipes: ["A", "B"], variables: [{ global: {}, chat: { count: "1" } }, { global: {}, chat: { count: "10" } }] };
const installed: boolean = await spindle.chat.setSwipeVariables("chat", "message", input);
const request: WorkerToHost = { type: "chat_set_swipe_variables", requestId: "request", chatId: "chat", messageId: "message", input };
// @ts-expect-error Baseline revision is required, including null for an untracked chat.
spindle.chat.setSwipeVariables("chat", "message", { expected_variables: input.expected_variables, expected_swipes: ["A"], variables: [] });
// @ts-expect-error Variable values are strings.
spindle.chat.setSwipeVariables("chat", "message", { ...input, variables: [{ global: {}, chat: { count: 1 } }] });
void installed; void request;
