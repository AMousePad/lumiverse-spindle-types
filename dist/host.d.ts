export declare const SPINDLE_HOST_CAPABILITIES: Readonly<Record<string, number>>;
/** Structured error code returned when host compatibility validation fails. */
export declare const SPINDLE_COMPATIBILITY_ERROR_CODE: "SPINDLE_COMPATIBILITY_ERROR";
/**
 * Immutable host/runtime compatibility information exposed to extensions.
 *
 * Hosts may add capability keys over time. Extensions should only depend on
 * the capability names they understand and the descriptor version they support.
 */
export interface SpindleHostDescriptorV1 {
    readonly descriptorVersion: 1;
    readonly lumiverseVersion: string;
    readonly capabilities: Readonly<Record<string, number>>;
    readonly extensionInstallationId: string;
}
/**
 * Version report for the running Lumiverse install, returned by
 * `spindle.version.getInfo()` (free tier — no permission needed).
 */
export interface LumiverseVersionInfo {
    /** Backend server semantic version (e.g. `"1.2.5"`). */
    readonly backend: string;
    /** Frontend bundle semantic version (e.g. `"1.2.5"`). */
    readonly frontend: string;
    /**
     * Commit the running build was made from (e.g. `"26939aa5"`), or `null`
     * when unavailable — Docker images, detached/non-git installs, and other
     * builds without git metadata report `null` rather than guessing.
     */
    readonly commit: string | null;
    /** Branch the running build was made from, or `null` when unavailable or HEAD is detached. */
    readonly branch: string | null;
}
/** Locale identifiers supplied by the host's active UI locale. */
export type SpindleHostLocale = "en" | "zh" | "zh-TW" | "ja" | "fr" | "it";
/** Synchronous host locale lookup with a removable live-change subscription. */
export interface SpindleHostLocaleAPI {
    get(): SpindleHostLocale;
    subscribe(listener: (locale: SpindleHostLocale) => void): () => void;
}
