/** Frontend-only: the chat composer bridge (`ctx.composer`). */
export declare const SPINDLE_COMPOSER_HOST_CAPABILITIES: Readonly<{
    readonly "composer-v1": 1;
}>;
/** A snapshot of the chat composer, the message input of the open chat. */
export interface SpindleComposerState {
    /** False when no chat composer is on screen (for example, outside a chat page). */
    readonly mounted: boolean;
    /** The chat the composer belongs to; null when not mounted. */
    readonly chatId: string | null;
    /** The current draft; "" when not mounted. */
    readonly text: string;
}
export type SpindleComposerInsertPosition = "caret" | "end";
/**
 * Reads and writes the draft in the chat composer and sends it through the
 * host's own send path. Available with composer-v1. Every method except
 * getState() and onChange() throws `COMPOSER_UNAVAILABLE` when no composer is mounted.
 */
export interface SpindleComposerAPI {
    /** Free. Never throws when no composer is mounted; returns `mounted: false`. */
    getState(): SpindleComposerState;
    /** Free. Fires after the draft, the chat or the mounted state changes. Returns an unsubscribe function. */
    onChange(handler: (state: SpindleComposerState) => void): () => void;
    /** Free. Replaces the draft. The user still decides whether to send it. */
    setText(text: string): void;
    /** Free. `at: "caret"` (default) replaces the current selection; `"end"` appends. Text is inserted as is. */
    insertText(text: string, options?: {
        at?: SpindleComposerInsertPosition;
    }): void;
    /** Free. Focuses the composer textarea. */
    focus(): void;
    /**
     * Requires `generation`. Same as pressing Send: uses the active persona, pending attachments,
     * group-chat targeting and multiplayer rules, then starts a generation. An empty draft asks for a
     * fresh reply, like the Send button. Rejects with `COMPOSER_BUSY` while a send or generation is running.
     * Host-side send failures are shown to the user as toasts and do not reject.
     */
    send(): Promise<void>;
}
