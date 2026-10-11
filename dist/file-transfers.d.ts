/** Maximum bytes in a worker read/write chunk; process one chunk at a time. */
export declare const SPINDLE_FILE_CHUNK_BYTES: number;
/** Per-file and per-installation/user aggregate staged storage ceiling. */
export declare const SPINDLE_FILE_MAX_BYTES: number;
/** Default disk reservation for downloads, generated files, and ZIP output. */
export declare const SPINDLE_FILE_DEFAULT_MAX_BYTES: number;
/** Inactivity lifetime; active readers and archive inputs are pinned. */
export declare const SPINDLE_FILE_TTL_MS: number;
/** Maximum staged file count per installation/user and archive entry count. */
export declare const SPINDLE_FILE_MAX_COUNT = 10000;
/** Opaque host-owned file reference. Paths and complete archive bytes stay on the host. */
export interface SpindleFileRef {
    fileId: string;
    fileName: string;
    size: number;
    mimeType: string;
}
/** A completed staged file or tus upload owned by this extension and user. */
export type SpindleFileSource = {
    fileId: string;
} | {
    uploadId: string;
};
export interface FileOperationOptions {
    /** Required for operator-scoped extensions; inferred for user-scoped extensions. */
    userId?: string;
    /** Cancels the producer and cleans up partial output; rejects with AbortError. */
    signal?: AbortSignal;
}
export interface FileFetchOptions extends FileOperationOptions {
    headers?: Record<string, string>;
    /** Default: download.bin. */
    fileName?: string;
    /** Maximum actual response bytes and disk reservation. Default: 5 GiB; maximum: 100 GiB. */
    maxBytes?: number;
    /** Default: 30 minutes; maximum: 1 hour. Includes body consumption. */
    timeoutMs?: number;
}
export interface SpindleFileCreateInput {
    fileName: string;
    /** Exact final byte length. Specify size or maxBytes, never both. */
    size?: number;
    /** Output budget for unknown-length producers. Default: 5 GiB. */
    maxBytes?: number;
    mimeType?: string;
    userId?: string;
}
export interface SpindleFileChunk {
    data: Uint8Array;
    offset: number;
    /** Total file length, not the length of this chunk. */
    size: number;
    eof: boolean;
}
export interface SpindleArchiveEntry {
    /** Safe relative ZIP file name. Directory records and duplicate names reject. */
    name: string;
    source: SpindleFileSource;
    /** Skip compression for already compressed assets. */
    store?: boolean;
}
export interface ArchiveCreateOptions extends FileOperationOptions {
    /** Default: export.zip. */
    fileName?: string;
    /** Output budget. Default: 5 GiB; maximum: 100 GiB. */
    maxBytes?: number;
}
export interface ArchiveExtractOptions extends FileOperationOptions {
    /** Exact ZIP file names to extract. Omit for all files; an empty list extracts none. */
    entries?: string[];
    /** Total expansion limit and disk reservation. Default/maximum: 20 GiB. */
    maxDecompressedBytes?: number;
}
export interface SpindleArchiveExtractedEntry {
    /** Original relative entry name, including its archive directories. */
    name: string;
    file: SpindleFileRef;
}
/** Available with file-transfers-v1. All files are scoped to the installation, user, and worker lifetime. */
export interface SpindleFilesAPI {
    /** GET through the host to disk. Requires cors_proxy; rejects non-success HTTP statuses. */
    fetch(url: string, options?: FileFetchOptions): Promise<SpindleFileRef>;
    /** Reserve a byte budget and create an incomplete file for sequential writes. */
    create(input: SpindleFileCreateInput): Promise<SpindleFileRef>;
    /** Write 1–SPINDLE_FILE_CHUNK_BYTES bytes at the current offset. Returns the next offset. */
    writeChunk(fileId: string, offset: number, data: Uint8Array, userId?: string): Promise<number>;
    /** Verify the byte budget/exact size, release unused capacity, and make the file immutable. */
    finish(fileId: string, userId?: string): Promise<SpindleFileRef>;
    /** Read at most SPINDLE_FILE_CHUNK_BYTES from a completed file or upload. */
    readChunk(source: SpindleFileSource, offset: number, userId?: string): Promise<SpindleFileChunk>;
    /** Delete an idle file. Unknown/expired/foreign ids return false; active files reject. */
    delete(fileId: string, userId?: string): Promise<boolean>;
    /** Relative attachment URL requiring the owning user's session cookie. */
    getDownloadUrl(fileId: string, userId?: string): Promise<string>;
}
/** Host-side ZIP/ZIP64 processing with bounded memory and disk-backed output. */
export interface SpindleArchivesAPI {
    create(entries: SpindleArchiveEntry[], options?: ArchiveCreateOptions): Promise<SpindleFileRef>;
    /** Validate safe names, expansion, entry sizes, and CRC32; return staged file references. */
    extract(source: SpindleFileSource, options?: ArchiveExtractOptions): Promise<SpindleArchiveExtractedEntry[]>;
}
export interface SpindleFileDownloadAPI {
    /** Start a native browser/WebView attachment download without assembling a JavaScript Blob. */
    download(fileId: string): void;
}
/** Signals stay in the worker; cancellation crosses the wire by operation id. */
export type FileTransferWorkerMessage = {
    type: "files_fetch";
    requestId: string;
    url: string;
    options: Omit<FileFetchOptions, "signal">;
} | {
    type: "files_create";
    requestId: string;
    input: SpindleFileCreateInput;
} | {
    type: "files_write_chunk";
    requestId: string;
    fileId: string;
    offset: number;
    data: Uint8Array;
    userId?: string;
} | {
    type: "files_finish";
    requestId: string;
    fileId: string;
    userId?: string;
} | {
    type: "files_delete";
    requestId: string;
    fileId: string;
    userId?: string;
} | {
    type: "files_download_url";
    requestId: string;
    fileId: string;
    userId?: string;
} | {
    type: "files_read_chunk";
    requestId: string;
    source: SpindleFileSource;
    offset: number;
    userId?: string;
} | {
    type: "archives_create";
    requestId: string;
    entries: SpindleArchiveEntry[];
    options: Omit<ArchiveCreateOptions, "signal">;
} | {
    type: "archives_extract";
    requestId: string;
    source: SpindleFileSource;
    options: Omit<ArchiveExtractOptions, "signal">;
} | {
    type: "files_cancel";
    operationId: string;
};
