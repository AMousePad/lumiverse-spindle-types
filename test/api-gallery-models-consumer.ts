import type { CharacterGalleryItemDTO, ConnectionModelDTO, SpindleAPI, WorkerToHost } from "lumiverse-spindle-types";

declare const spindle: SpindleAPI;

const gallery: Promise<CharacterGalleryItemDTO[]> | undefined = spindle.characters.getGallery?.("character-id");
const scopedGallery = spindle.characters.getGallery?.("character-id", "user-id");
const models: Promise<ConnectionModelDTO[]> | undefined = spindle.connections.getModels?.("connection-id");
const scopedModels = spindle.connections.getModels?.("connection-id", "user-id");

const item: CharacterGalleryItemDTO = {
  id: "item-id", image_id: "image-id", reference: "gallery://1", caption: "", sort_order: 0,
  created_at: 0, width: null, height: null, mime_type: "image/png",
};
const model: ConnectionModelDTO = { id: "model-id", label: "Model" };
const wire: WorkerToHost[] = [
  { type: "characters_get_gallery", requestId: "request-id", characterId: "character-id", userId: "user-id" },
  { type: "connections_models", requestId: "request-id", connectionId: "connection-id", userId: "user-id" },
];

// @ts-expect-error Older hosts may not implement getGallery; feature-detect first.
spindle.characters.getGallery("character-id");
// @ts-expect-error Older hosts may not implement getModels; feature-detect first.
spindle.connections.getModels("connection-id");
// @ts-expect-error The character ID is required.
spindle.characters.getGallery?.();
// @ts-expect-error Models are id/label pairs, not bare strings.
const names: Promise<string[]> | undefined = spindle.connections.getModels?.("connection-id");

void [gallery, scopedGallery, models, scopedModels, item, model, wire, names];
