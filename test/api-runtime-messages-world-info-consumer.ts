import type { ResolvedWorldInfoEntryDTO, RuntimeStateCommandDTO, SpindleAPI, WorkerToHost, WorldInfoInterceptorResultDTO } from "lumiverse-spindle-types";
import { SPINDLE_HOST_CAPABILITIES } from "lumiverse-spindle-types";

declare const spindle: SpindleAPI;
const edit: RuntimeStateCommandDTO = { kind: "message.edit", id: "message", role: "system", ownMetadata: { time: 1 } };
const insert: RuntimeStateCommandDTO = { kind: "message.create", id: "message", content: "", role: "user", beforeId: "later" };
const lore: ResolvedWorldInfoEntryDTO[] = await spindle.world_books.resolveForChat("chat", { reserveTokens: 100 });
const result: WorldInfoInterceptorResultDTO = { additionalEntries: [] };
const wire: WorkerToHost = { type: "world_books_resolve_for_chat", requestId: "request", chatId: "chat", reserveTokens: 100 };
const capability: number = SPINDLE_HOST_CAPABILITIES["world-info-resolve-for-chat-v1"];
// @ts-expect-error Roles are limited to the runtime message roles.
const badRole: RuntimeStateCommandDTO = { kind: "message.edit", id: "message", role: "tool" };
void edit; void insert; void lore; void result; void wire; void capability; void badRole;
