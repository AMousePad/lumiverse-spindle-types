import type { ChatGetMessagesOptionsDTO, ChatMessageDTO, SpindleAPI, WorkerToHost } from "lumiverse-spindle-types";

declare const spindle: SpindleAPI;
declare const dynamic: ChatGetMessagesOptionsDTO;
declare const flag: boolean;
declare const optional: ChatGetMessagesOptionsDTO | undefined;
declare const union: { light: true; includeExtra: false } | {};

async function consume() {
  const [full] = await spindle.chat.getMessages("chat");
  const legacy: ChatMessageDTO = full;
  const hidden: boolean = full.hidden;
  const [explicitDefault] = await spindle.chat.getMessages("chat", undefined);
  const defaultSwipe: string = explicitDefault.swipes[0];
  const [optionalResult] = await spindle.chat.getMessages("chat", optional);
  const optionalExtra: Record<string, unknown> | undefined = optionalResult.extra;
  // @ts-expect-error Optional options can enable light reads.
  const optionalSwipe: string = optionalResult.swipes[0];
  const [page] = await spindle.chat.getMessages("chat", { limit: 10 });
  const pageSwipe: string = page.swipes[0];
  const [lean] = await spindle.chat.getMessages("chat", { tail: 20, light: true, includeExtra: false, ownMetadataOnly: true });
  const text: string | null = lean.swipes[0];
  // @ts-expect-error Lean reads omit extra.
  lean.extra;
  // @ts-expect-error Non-active swipe slots can be null.
  const requiredText: string = lean.swipes[0];
  const [varying] = await spindle.chat.getMessages("chat", dynamic);
  const extra: Record<string, unknown> | undefined = varying.extra;
  // @ts-expect-error Widened flags may omit extra.
  const requiredExtra: Record<string, unknown> = varying.extra;
  // @ts-expect-error Widened flags may null inactive swipes.
  const requiredSwipe: string = varying.swipes[0];
  const [booleanFlags] = await spindle.chat.getMessages("chat", { light: flag, includeExtra: flag });
  // @ts-expect-error Runtime booleans can enable light reads.
  const booleanSwipe: string = booleanFlags.swipes[0];
  // @ts-expect-error Runtime booleans can omit extra.
  const booleanExtra: Record<string, unknown> = booleanFlags.extra;
  const [unionResult] = await spindle.chat.getMessages("chat", union);
  // @ts-expect-error Either union member may be returned.
  const unionSwipe: string = unionResult.swipes[0];
  // @ts-expect-error The lean union member has no extra.
  unionResult.extra;
  const [explicitFull] = await spindle.chat.getMessages("chat", { light: false, includeExtra: true });
  const explicitSwipe: string = explicitFull.swipes[0];
  const explicitExtra: Record<string, unknown> = explicitFull.extra;
  await spindle.chat.updateMessage("chat", "message", { ownMetadata: { saved: true } });
  await spindle.chat.updateMessage("chat", "message", { ownMetadata: null });
  // @ts-expect-error Boolean options cannot be strings.
  await spindle.chat.getMessages("chat", { light: "yes" });
  void [legacy, hidden, defaultSwipe, optionalExtra, optionalSwipe, pageSwipe, text, requiredText, extra, requiredExtra, requiredSwipe, booleanSwipe, booleanExtra, unionSwipe, explicitSwipe, explicitExtra];
}

const read: Extract<WorkerToHost, { type: "chat_get_messages" }> = {
  type: "chat_get_messages", requestId: "r", chatId: "chat", options: { tail: 2, light: true },
};
const write: Extract<WorkerToHost, { type: "chat_update_message" }> = {
  type: "chat_update_message", requestId: "w", chatId: "chat", messageId: "message", patch: { ownMetadata: null },
};
void [consume, read, write];
