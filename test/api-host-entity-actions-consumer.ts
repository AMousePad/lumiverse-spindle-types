import type {
  SpindleFrontendContext,
  SpindleHostActionParamsSchema,
  SpindleHostEntityActionId,
  SpindleHostSurfaceInfo,
} from "lumiverse-spindle-types";

declare const ctx: SpindleFrontendContext;

const surfaces = ctx.host.surfaces;
if (!surfaces) throw new Error("host surfaces unavailable");
const actions: SpindleHostSurfaceInfo[] = surfaces.list(["entity_action"]);
const theme = actions.find((surface) => surface.id === "apply_theme");
const schema: SpindleHostActionParamsSchema | undefined = theme?.params;
const required: string[] = schema?.required ?? [];
const themeIds: string[] = schema?.properties.themeId.oneOf?.map((choice) => choice.const) ?? [];
const modes: string[] | undefined = actions.find((surface) => surface.id === "character_chat")?.params?.properties.mode.enum;
void [required, themeIds, modes];

const id: SpindleHostEntityActionId = "character_chat";
void surfaces.invoke({ kind: "entity_action", id }, { characterId: "char-1", mode: "new" });
void surfaces.invoke({ kind: "entity_action", id: "switch_persona" }, { personaId: "persona-1" });

const handWritten: SpindleHostActionParamsSchema = {
  type: "object",
  properties: { presetId: { type: "string", description: "Loom preset id" } },
  required: ["presetId"],
  // @ts-expect-error The host rejects params outside the schema.
  additionalProperties: true,
};
void handWritten;

// @ts-expect-error Unknown surface kinds are not accepted.
void surfaces.invoke({ kind: "entity", id: "switch_persona" });
