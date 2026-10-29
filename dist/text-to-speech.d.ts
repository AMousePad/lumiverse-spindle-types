/** Host-managed text-to-speech playback for frontend Spindle extensions. */
/** Speak caller text, or a chat message of the active chat with the host's per-character voices. */
export type SpindleTTSSpeakInput = {
    text: string;
    messageId?: never;
} | {
    messageId: string;
    text?: never;
};
export interface SpindleTTSSpeakOptions {
    /** TTS connection for text input. Defaults to the user's TTS connection. Not used with messageId. */
    connectionId?: string;
}
/** Host-managed TTS playback, available with text-to-speech-v1. */
export interface SpindleTTSAPI {
    /**
     * Requires media. Stops current host TTS playback, then speaks. Text is spoken as given
     * with the connection's default voice. A message plays like its Play button: saved audio
     * when the message has it, otherwise the host's voice pipeline (which may save the audio
     * to the message). Extensions control their own opt-in; the general chat TTS enable/auto-play
     * settings do not gate these calls. Shared volume, speed and voice settings still apply.
     * Resolves when this playback ends or is stopped; rejects when it cannot start
     * or synthesis fails.
     */
    speak(input: SpindleTTSSpeakInput): Promise<void>;
    speak(input: Extract<SpindleTTSSpeakInput, {
        text: string;
    }>, options?: SpindleTTSSpeakOptions): Promise<void>;
    /** Requires media. Stops all host TTS playback, including chat auto-play and saved message audio. */
    stop(): void;
    /** Free. True while any host TTS audio plays or is being prepared for playback. */
    isSpeaking(): boolean;
    /** Free. Called with the new state whenever host TTS playback starts or stops. Returns an unsubscribe function. */
    subscribe(listener: (speaking: boolean) => void): () => void;
}
export declare const SPINDLE_TTS_HOST_CAPABILITIES: Readonly<{
    'text-to-speech-v1': 1;
}>;
