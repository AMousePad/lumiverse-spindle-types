/** Embeddings with the user's embedding connections. Requires the embeddings permission and the embeddings-v1 host capability. */
/** A saved embedding connection (Settings > Embeddings). The API key never leaves the host. */
export interface EmbeddingConnectionDTO {
  id: string;
  name: string;
  provider: string;
  model: string;
  /** Configured output size, or `null` when the provider's native size is used. */
  dimensions: number | null;
  enabled: boolean;
  /** The user's main embedding connection; used when `connection_id` is omitted. */
  is_primary: boolean;
  has_api_key: boolean;
}
export interface EmbeddingsEmbedInput {
  /** 1-256 non-empty texts, each at most 8192 characters. */
  texts: string[];
  /** A connection from `listConnections()`. Default: the user's primary embedding connection. Fallback connections are never used. */
  connection_id?: string;
  /** Asymmetric models (Cohere, NVIDIA NIM) embed search queries and stored passages differently. Default: `"passage"`. */
  input_type?: "query" | "passage";
  userId?: string;
}
export interface EmbeddingsEmbedResult {
  /** One vector per input text, in input order. */
  embeddings: number[][];
  /** The connection that produced every vector in this result. */
  connection_id: string;
  model: string;
  dimensions: number;
}
export interface SpindleEmbeddingsAPI {
  listConnections(options?: { userId?: string }): Promise<EmbeddingConnectionDTO[]>;
  embed(input: EmbeddingsEmbedInput, options?: { signal?: AbortSignal }): Promise<EmbeddingsEmbedResult>;
}
export type EmbeddingsWorkerMessage =
  | { type: "embeddings_connections_list"; requestId: string; userId?: string }
  | { type: "embeddings_embed"; requestId: string; input: EmbeddingsEmbedInput }
  | { type: "embeddings_cancel"; requestId: string };
