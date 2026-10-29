import type {
  HostToWorker,
  SpindleAPI,
  SpindleCommandContextDTO,
  SpindleCommandOriginDTO,
} from "lumiverse-spindle-types";
import { SPINDLE_HOST_CAPABILITIES } from "lumiverse-spindle-types";

type CommandMessage = Extract<HostToWorker, { type: "command_invoked" }>;

// Both legacy and document-scoped wire envelopes remain valid.
export const legacyCommandMessage: CommandMessage = {
  type: "command_invoked", commandId: "capture-screen", context: { route: "/" }, userId: "owner",
};
export const scopedCommandMessage: CommandMessage = {
  ...legacyCommandMessage, frontendSessionId: "desktop-document",
};
export const accountOnlyOrigin: SpindleCommandOriginDTO = { userId: "owner" };
export const documentOrigin: SpindleCommandOriginDTO = {
  userId: scopedCommandMessage.userId, frontendSessionId: scopedCommandMessage.frontendSessionId,
};
export const commandRoutingCapability: number = SPINDLE_HOST_CAPABILITIES["command-session-routing-v1"];

export function subscribeToCommands(spindle: SpindleAPI): () => void {
  // Existing handlers need no signature changes.
  const legacyHandler = (commandId: string, context: SpindleCommandContextDTO): void => {
    void commandId; void context.route;
  };
  const stopLegacy = spindle.commands.onInvoked(legacyHandler);
  const stopScoped = spindle.commands.onInvoked(async (commandId, context, origin) => {
    const checked: SpindleCommandOriginDTO | undefined = origin;
    if ((spindle.host.capabilities["command-session-routing-v1"] ?? 0) < 1 || !checked?.frontendSessionId) return;
    void context.trigger?.scope;
    spindle.sendToFrontend({ commandId }, checked.userId, { frontendSessionId: checked.frontendSessionId });
  });
  return () => { stopLegacy(); stopScoped(); };
}

export function requireOptionalOrigin(spindle: SpindleAPI): void {
  // @ts-expect-error Older hosts may omit origin; handlers must accept that case.
  spindle.commands.onInvoked((_id, _context, origin: SpindleCommandOriginDTO) => { void origin.userId; });
  spindle.commands.onInvoked((_id, _context, origin) => {
    // @ts-expect-error An inferred origin must be narrowed before use.
    const userId: string = origin.userId;
    if (origin) {
      // @ts-expect-error Older clients may omit document identity even on a new host.
      const frontendSessionId: string = origin.frontendSessionId;
      void frontendSessionId;
    }
    void userId;
  });
}
