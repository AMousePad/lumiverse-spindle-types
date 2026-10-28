import type { SpindleConnectionProfileKind, SpindleConnectionProfileSummary } from './dom.js';
export declare const SPINDLE_CONNECTION_ORGANIZATION_HOST_CAPABILITIES: Readonly<{
    'connection-organization-v1': 1;
}>;
export type SpindleConnectionOrganizationErrorCode = 'CONNECTION_KIND_INVALID' | 'USER_CONTEXT_REQUIRED' | 'CONNECTION_WATCH_LIMIT' | 'CONNECTION_ORGANIZATION_READ_FAILED';
export interface SpindleConnectionOrganizationError extends Error {
    code: SpindleConnectionOrganizationErrorCode;
}
export interface SpindleConnectionOrganizationSnapshot {
    kind: SpindleConnectionProfileKind;
    /** Opaque equality token. Do not parse or sort revisions. */
    revision: string;
    /** Ordered, credential-free profiles, including profiles in Recently Used. */
    connections: SpindleConnectionProfileSummary[];
    /** Ordered groups. Uncategorized has null id and name; localize its label in your UI. */
    folders: Array<{
        id: string | null;
        name: string | null;
        connectionIds: string[];
    }>;
    /** Stored recent history, newest first; not limited to the native UI's four visible rows. */
    recentConnectionIds: string[];
}
export interface SpindleConnectionOrganizationOptions {
    kind: SpindleConnectionProfileKind;
}
export interface SpindleBackendConnectionOrganizationOptions extends SpindleConnectionOrganizationOptions {
    /** Required for operator-scoped extensions. User-scoped extensions always use their owner. */
    userId?: string;
}
/** Free, read-only API. Requires connection-organization-v1; feature-detect on older hosts. */
export interface SpindleConnectionOrganizationAPI<Options = SpindleConnectionOrganizationOptions> {
    get(options: Options): Promise<SpindleConnectionOrganizationSnapshot>;
    /**
     * Delivers an initial snapshot, then distinct snapshots until unsubscribed or unloaded.
     * Intermediate rapid edits may be coalesced. Frontend reconnects refresh the snapshot.
     * onError receives read failures; later changes/reconnects retry. Backend subscription
     * setup failures end that watch. If omitted, errors are logged by the host.
     */
    watch(options: Options, handler: (snapshot: SpindleConnectionOrganizationSnapshot) => void, onError?: (error: SpindleConnectionOrganizationError) => void): () => void;
}
