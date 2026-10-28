import type { SpindleAPI, ChatDTO, ConditionalChatMetadataDTO, WorkerToHost } from "lumiverse-spindle-types";
declare const spindle: SpindleAPI;
declare const message: Awaited<ReturnType<SpindleAPI["chat"]["getMessages"]>>[number];
const input: ConditionalChatMetadataDTO = { expected_metadata: {}, metadata: { enabled: true },
  expected_last_message_id: "reply", expected_message: { id: "reply", swipe_id: 0, swipes: ["text"], metadata: {} } };
const updated: ChatDTO | null = await spindle.chats.compareAndSetMetadata("chat", input, "user");
const messageGuard: ConditionalChatMetadataDTO["expected_message"] = {
  id: message.id, swipe_id: message.swipe_id, swipes: message.swipes, metadata: message.metadata ?? {},
};
const request = {
  type: "chats_compare_metadata", requestId: "request", chatId: "chat", input, userId: "user",
} satisfies Extract<WorkerToHost, { type: "chats_compare_metadata" }>;
// @ts-expect-error Expected metadata is required to prevent lost updates.
spindle.chats.compareAndSetMetadata("chat", { metadata: {} });
// @ts-expect-error A last-message guard is an ID or null.
spindle.chats.compareAndSetMetadata("chat", { ...input, expected_last_message_id: 1 });
void updated;
void messageGuard;
void request;
