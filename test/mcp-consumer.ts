import type {
  McpServerCreateDTO,
  McpServerDTO,
  McpServerStatusDTO,
  McpToolDTO,
  SpindleAPI,
  SpindlePermission,
  WorkerToHost,
} from "lumiverse-spindle-types";

declare const spindle: SpindleAPI;

const permissions: SpindlePermission[] = ["mcp_servers", "mcp_servers.create"];
const input: McpServerCreateDTO = {
  name: "Remote MCP",
  transport_type: "streamable_http",
  url: "https://mcp.example.test",
};
const message: WorkerToHost = { type: "mcp_servers_create", requestId: "1", input };

async function useMcp(): Promise<[McpServerDTO, McpServerStatusDTO, McpToolDTO[]]> {
  const server = await spindle.mcp.servers.create(input);
  const status = await spindle.mcp.servers.connect(server.id);
  const tools = await spindle.mcp.tools.list(server.id);
  await spindle.mcp.tools.call(server.id, tools[0]!.name, {}, { timeoutMs: 5_000 });
  return [server, status, tools];
}

void permissions;
void message;
void useMcp;
