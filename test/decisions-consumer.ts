import type { SpindleAPI, SpindlePermission, DecisionWorkerMessage, WorkerToHost } from "lumiverse-spindle-types";
declare const api: SpindleAPI;
const permission: SpindlePermission = "decisions";
const result = await api.decisions.evaluate({ state: "A new scene", questions: {
  route: { type: "choice", instructions: "Path?", criteria: { continue: null, transition: "New scene" } },
  score: { type: "score", instructions: "Intensity?", criteria: ["Low", "High"] },
  change: { type: "noul", instructions: "Scene change?" },
} });
const route: "continue" | "transition" = result.answers.route.choice;
const score: number = result.answers.score.score;
const chance: number = result.answers.change.noul;
// @ts-expect-error Noul answers do not have Choice confidence.
result.answers.change.confidence;
// @ts-expect-error Choice answers cannot contain invented options.
const invented: "invented" = result.answers.route.choice;
const message: DecisionWorkerMessage = { type: "decisions_cancel", requestId: "id" };
const wire: WorkerToHost = message;
void [permission, route, score, chance, message, wire];
