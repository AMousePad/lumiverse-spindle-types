import { SPINDLE_CONNECTION_KINDS_HOST_CAPABILITIES } from "lumiverse-spindle-types";
import type {
  SpindleFrontendContextV2, SpindleConnectionProfileKind, SpindleConnectionProfileSummary,
  SpindleActiveConnectionState, ConnectionProfileDTO,
} from "lumiverse-spindle-types";

declare const ctx: SpindleFrontendContextV2;

const capability: 1 = SPINDLE_CONNECTION_KINDS_HOST_CAPABILITIES["connection-kinds-v1"];
async function pickers() {
  // The legacy call keeps returning full LLM profile rows.
  const llmRows: ConnectionProfileDTO[] = await ctx.connections.list();
  if ((ctx.host.capabilities["connection-kinds-v1"] ?? 0) < capability) return;
  const kinds: SpindleConnectionProfileKind[] = ["llm", "image", "tts", "stt", "embedding", "decision"];
  for (const kind of kinds) {
    const rows: SpindleConnectionProfileSummary[] = await ctx.connections.list({ kind });
    const active = rows.find((row) => row.active);
    const voice: string | undefined = active?.voice;
    // @ts-expect-error Summaries never carry credentials or endpoints.
    void active?.api_url;
    void voice;
  }
  const getActive = ctx.connections.getActive;
  if (getActive) {
    const llm: SpindleActiveConnectionState = getActive();
    const tts: SpindleActiveConnectionState = await getActive("tts");
    void [llm, tts];
  }
  // @ts-expect-error Only the listed kinds are valid.
  void ctx.connections.list({ kind: "music" });
  void llmRows;
}
void pickers;
