import type { SpindleAPI, WorkerToHost } from "lumiverse-spindle-types";

declare const spindle: SpindleAPI;
const owned: Promise<Uint8Array> = spindle.images.readBinary("image-id");
const scoped: Promise<Uint8Array> = spindle.images.readBinary("image-id", "user-id");
const wire: WorkerToHost = {
  type: "images_read_binary", requestId: "request-id", imageId: "image-id", userId: "user-id",
};

// @ts-expect-error The image ID is required.
spindle.images.readBinary();
// @ts-expect-error The second argument is a user ID, not metadata retrieval options.
spindle.images.readBinary("image-id", { specificity: "full" });
// @ts-expect-error Original bytes are returned as Uint8Array, not base64 text.
const text: Promise<string> = spindle.images.readBinary("image-id");

void [owned, scoped, wire, text];
