/** Maximum bytes in a worker read/write chunk; process one chunk at a time. */
export const SPINDLE_FILE_CHUNK_BYTES = 1024 * 1024;
/** Per-file and per-installation/user aggregate staged storage ceiling. */
export const SPINDLE_FILE_MAX_BYTES = 100 * 1024 ** 3;
/** Default disk reservation for downloads, generated files, and ZIP output. */
export const SPINDLE_FILE_DEFAULT_MAX_BYTES = 5 * 1024 ** 3;
/** Inactivity lifetime; active readers and archive inputs are pinned. */
export const SPINDLE_FILE_TTL_MS = 30 * 60 * 1000;
/** Maximum staged file count per installation/user and archive entry count. */
export const SPINDLE_FILE_MAX_COUNT = 10_000;
