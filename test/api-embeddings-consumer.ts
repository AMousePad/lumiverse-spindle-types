import type { SpindleAPI, EmbeddingConnectionDTO, EmbeddingsEmbedInput, WorkerToHost } from "lumiverse-spindle-types";
declare const api: SpindleAPI;
const connections: EmbeddingConnectionDTO[] = await api.embeddings.listConnections({ userId: "user" });
const primary = connections.find((connection) => connection.is_primary);
const input = { texts: ["Open the world book drawer", "Switch persona"], connection_id: primary?.id } satisfies EmbeddingsEmbedInput;
const controller = new AbortController();
const result = await api.embeddings.embed(input, { signal: controller.signal });
const vectors: number[][] = result.embeddings;
const size: number = result.dimensions;
const used: string = `${result.connection_id}:${result.model}`;
const query = await api.embeddings.embed({ texts: ["the red haired one"], input_type: "query" });
const message: WorkerToHost = { type: "embeddings_embed", requestId: "r1", input };
// @ts-expect-error input_type is "query" or "passage".
const wrong: EmbeddingsEmbedInput = { texts: ["x"], input_type: "document" };
// @ts-expect-error texts is required.
const missing: EmbeddingsEmbedInput = { connection_id: "c" };
void [vectors, size, used, query, message, wrong, missing];
