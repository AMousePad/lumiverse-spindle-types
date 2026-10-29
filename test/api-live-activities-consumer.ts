import type { SpindleAPI, LiveActivityPresentation, WorkerToHost } from "lumiverse-spindle-types";
declare const spindle: SpindleAPI;
const status = await spindle.liveActivities.getStatus();
const layout: "status" | "progress" | "image" = status.layouts[0];
const task = await spindle.liveActivities.start({ key: "job", layout: "progress", title: "Working", progress: 0.4 });
await spindle.liveActivities.update(task.id, { layout: "image", title: "Preview", imageId: "owned-id" });
await spindle.liveActivities.end(task.id);
const message: WorkerToHost = { type: "live_activity", requestId: "id", operation: "status" };
// @ts-expect-error progress layout requires a fraction
const invalidProgress: LiveActivityPresentation = { layout: "progress", title: "Working" };
// @ts-expect-error image layout requires an owned image ID
const invalidImage: LiveActivityPresentation = { layout: "image", title: "Preview" };
void [layout, message, invalidProgress, invalidImage];
