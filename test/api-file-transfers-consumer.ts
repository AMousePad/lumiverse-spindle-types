import type {
  SpindleAPI, SpindleFrontendContext, SpindleFrontendContextV2, WorkerToHost,
  SpindleFilesAPI, SpindleArchivesAPI, SpindleFileDownloadAPI, SpindleFileRef,
  SpindleFileSource, FileOperationOptions, FileFetchOptions, SpindleFileCreateInput,
  SpindleFileChunk, SpindleArchiveEntry, ArchiveCreateOptions, ArchiveExtractOptions,
  SpindleArchiveExtractedEntry, FileTransferWorkerMessage,
} from "lumiverse-spindle-types";
import {
  SPINDLE_FILE_CHUNK_BYTES, SPINDLE_FILE_MAX_BYTES, SPINDLE_FILE_DEFAULT_MAX_BYTES,
  SPINDLE_FILE_TTL_MS, SPINDLE_FILE_MAX_COUNT, SPINDLE_HOST_CAPABILITIES,
} from "lumiverse-spindle-types";

declare const spindle: SpindleAPI;
declare const ctx: SpindleFrontendContext;
declare const ctxV2: SpindleFrontendContextV2;
const files: SpindleFilesAPI = spindle.files;
const archives: SpindleArchivesAPI = spindle.archives;
const downloads: SpindleFileDownloadAPI = ctx.files;
const operation: FileOperationOptions = { userId: "alice", signal: new AbortController().signal };
const fetchOptions: FileFetchOptions = { ...operation, headers: { "x-risu-api-version": "4" }, maxBytes: SPINDLE_FILE_MAX_BYTES, timeoutMs: 3600000 };
const exactInput: SpindleFileCreateInput = { userId: "alice", fileName: "exact.bin", size: 3 };
const generatedInput: SpindleFileCreateInput = { userId: "alice", fileName: "generated.bin", maxBytes: SPINDLE_FILE_DEFAULT_MAX_BYTES };
const fileSource: SpindleFileSource = { fileId: "file" };
const uploadSource: SpindleFileSource = { uploadId: "upload" };
const entry: SpindleArchiveEntry = { name: "assets/data.bin", source: fileSource, store: true };
const createOptions: ArchiveCreateOptions = { ...operation, fileName: "export.zip", maxBytes: 1024 };
const extractOptions: ArchiveExtractOptions = { ...operation, entries: [entry.name], maxDecompressedBytes: 1024 };
const results: Array<Promise<SpindleFileRef>> = [
  files.fetch("https://example.com/archive", fetchOptions),
  files.create(exactInput), files.create(generatedInput), files.create({ fileName: "defaults.bin" }),
  files.finish("file", "alice"), archives.create([entry], createOptions),
];
const nextOffset: Promise<number> = files.writeChunk("file", 0, new Uint8Array([0, 128, 255]), "alice");
const chunk: Promise<SpindleFileChunk> = files.readChunk(fileSource, 0, "alice");
const uploadChunk: Promise<SpindleFileChunk> = files.readChunk(uploadSource, 0);
const extracted: Promise<SpindleArchiveExtractedEntry[]> = archives.extract(fileSource, extractOptions);
const deleted: Promise<boolean> = files.delete("file", "alice");
const url: Promise<string> = files.getDownloadUrl("file", "alice");
const started: void = downloads.download("file");
ctxV2.files.download("file");

const wire: FileTransferWorkerMessage[] = [
  { type: "files_fetch", requestId: "1", url: "https://example.com/archive", options: { userId: "alice", maxBytes: 1024 } },
  { type: "files_create", requestId: "2", input: generatedInput },
  { type: "files_write_chunk", requestId: "3", fileId: "file", offset: 0, data: new Uint8Array([0, 128, 255]), userId: "alice" },
  { type: "files_finish", requestId: "4", fileId: "file", userId: "alice" },
  { type: "files_read_chunk", requestId: "5", source: uploadSource, offset: 0, userId: "alice" },
  { type: "files_delete", requestId: "6", fileId: "file", userId: "alice" },
  { type: "files_download_url", requestId: "7", fileId: "file", userId: "alice" },
  { type: "archives_create", requestId: "8", entries: [entry], options: { userId: "alice" } },
  { type: "archives_extract", requestId: "9", source: fileSource, options: { userId: "alice", entries: [] } },
  { type: "files_cancel", operationId: "1" },
];
const hostMessages: WorkerToHost[] = wire;
const finishMessage: Extract<WorkerToHost, { type: "files_finish" }> = { type: "files_finish", requestId: "finish", fileId: "file" };

// @ts-expect-error Host files have no caller-supplied filesystem path.
files.readChunk({ path: "/tmp/archive.zip" }, 0);
// @ts-expect-error Byte chunks must be typed arrays, not base64 text.
files.writeChunk("file", 0, "AA==");
// @ts-expect-error Generated files require a filename.
files.create({ maxBytes: 1024 });
// @ts-expect-error Extraction returns references, not full file bytes.
const buffered: Promise<Uint8Array> = archives.extract(fileSource);
// @ts-expect-error AbortSignal cannot cross the worker protocol.
const signalOnWire: Extract<FileTransferWorkerMessage, { type: "files_fetch" }> = { type: "files_fetch", requestId: "bad", url: "https://example.com", options: { signal: operation.signal } };
// @ts-expect-error Browser downloads accept a file id, not byte payloads.
downloads.download(new Uint8Array([1]));

void [results, nextOffset, chunk, uploadChunk, extracted, deleted, url, started, hostMessages, finishMessage, buffered, signalOnWire];
void [SPINDLE_FILE_CHUNK_BYTES, SPINDLE_FILE_MAX_BYTES, SPINDLE_FILE_DEFAULT_MAX_BYTES, SPINDLE_FILE_TTL_MS, SPINDLE_FILE_MAX_COUNT, SPINDLE_HOST_CAPABILITIES["file-transfers-v1"]];
