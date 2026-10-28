import type { SpindleAPI, ChatDTO, ConditionalChatMetadataDTO } from "lumiverse-spindle-types";
declare const spindle: SpindleAPI;
const input: ConditionalChatMetadataDTO = { expected_metadata: {}, metadata: { enabled: true },
  expected_last_message_id: "reply", expected_message: { id: "reply", swipe_id: 0, swipes: ["text"], metadata: {} } };
const updated: ChatDTO | null = await spindle.chats.compareAndSetMetadata("chat", input, "user");
// @ts-expect-error Expected metadata is required to prevent lost updates.
spindle.chats.compareAndSetMetadata("chat", { metadata: {} });
// @ts-expect-error A last-message guard is an ID or null.
spindle.chats.compareAndSetMetadata("chat", { ...input, expected_last_message_id: 1 });
void updated;
