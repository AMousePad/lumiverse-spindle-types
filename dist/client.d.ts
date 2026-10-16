/** Frontend-only metadata; does not describe the backend server's platform. */
export declare const SPINDLE_CLIENT_HOST_CAPABILITIES: Readonly<{
    readonly "client-info-v1": 1;
}>;
export type SpindleClientKind = "browser" | "pwa" | "desktop" | "mobile";
export type SpindleClientPlatform = "ios" | "android" | "macos" | "windows" | "linux" | "unknown";
/** A frozen snapshot of the document running this extension. */
export interface SpindleClientInfo {
    /** Native shells take precedence over PWA display modes. */
    readonly kind: SpindleClientKind;
    /** Native identity when available, otherwise best-effort browser OS detection. */
    readonly platform: SpindleClientPlatform;
    /** Mobile OS/device identity, independent of viewport width; true for mobile apps too. */
    readonly isMobile: boolean;
    /**
     * Callable native transports present in this document. These flags do not grant
     * permissions or guarantee any particular command; also check the feature's
     * host capability and availability API (for example, systemAudio.isAvailable()).
     * Browser tabs and PWAs report false for every bridge.
     */
    readonly bridges: {
        readonly desktop: boolean;
        readonly ios: boolean;
        readonly android: boolean;
    };
}
/** Permission-free client detection, available with client-info-v1. */
export interface SpindleClientAPI {
    /** Read current signals on each call without prompting or invoking native commands. */
    getInfo(): SpindleClientInfo;
}
