import type { CapturedMediaRef, DesktopCaptureDisplay, DesktopCaptureApprovalStatus, DesktopCaptureReply, GenerationParametersDTO, LlmMessagePartDTO, SpindleAPI, SpindleCommandContextDTO, SpindleFrontendContext, WorkerToHost } from "lumiverse-spindle-types";

export async function captureDisplay(spindle: SpindleAPI, connectionId: string): Promise<CapturedMediaRef | undefined> {
  const device = (await spindle.desktop.capture.listDevices()).find(device => device.displays?.length);
  const display: DesktopCaptureDisplay | undefined = device?.displays?.[0];
  if (!device || !display) return;
  await spindle.desktop.capture.getApprovalStatus({ deviceId: device.id, displayId: display.id, connectionId, kind: "image" });
  return spindle.desktop.capture.request({ deviceId: device.id, displayId: display.id, connectionId, kind: "image", purpose: "Describe the selected display" });
}

export function embedCommandBinding(ctx: SpindleFrontendContext, target: HTMLElement) {
  if (!ctx.client?.getInfo().bridges.desktop || !ctx.components.mountKeybindingEditor) return;
  const editor = ctx.components.mountKeybindingEditor(target, { commandId: "capture-screen" });
  return () => editor.destroy();
}

export async function captureApprovalFromWorker(spindle: SpindleAPI, connectionId: string): Promise<DesktopCaptureApprovalStatus | undefined> {
  const device = (await spindle.desktop.capture.listDevices()).find(device => device.stableIdentity && device.approvalStatusSupported);
  if (!device) return;
  return spindle.desktop.capture.getApprovalStatus({ deviceId: device.id, connectionId, kind: "image" });
}

export function keybindingScope(context: SpindleCommandContextDTO): "focused" | "global" | undefined {
  return context.trigger?.type === "keybind" ? context.trigger.scope : undefined;
}

export async function captureFromWorker(spindle: SpindleAPI, connectionId: string): Promise<CapturedMediaRef | undefined> {
  const devices = await spindle.desktop.capture.listDevices();
  if (!devices.length) return;
  return spindle.desktop.capture.request({
    deviceId: devices[0].id, connectionId, purpose: "Describe the selected window", kind: "image",
  });
}

export function captureWireContract(): WorkerToHost {
  return { type: "desktop_capture_request", requestId: "request", input: {
    deviceId: "device", connectionId: "connection", purpose: "Review an approved replay",
    kind: "video", mode: "replay", durationSeconds: 15,
  } };
}

export async function finishFromSameShareAction(spindle: SpindleAPI, requestKey: string, userId: string): Promise<boolean> {
  return spindle.desktop.capture.finish(requestKey, { userId });
}

export function captureFinishWireContract(): WorkerToHost {
  return { type: "desktop_capture_finish", requestId: "finish-rpc", requestKey: "share-a", userId: "alice" };
}

export async function startBoundedRecording(spindle: SpindleAPI, requestKey: string, connectionId: string, userId: string) {
  const device = (await spindle.desktop.capture.listDevices({ userId })).find(device => device.recordingControlSupported);
  if (!device) return;
  return spindle.desktop.capture.request({ deviceId: device.id, connectionId, requestKey, kind: "video", mode: "record", durationSeconds: 120, purpose: "React to this clip", userId });
}

export const geminiMediaParameters = { media_resolution: "high", max_tokens: 4000 } satisfies GenerationParametersDTO;
// @ts-expect-error Ultra-high is per-part only; request-wide GenerateContent does not accept it.
export const invalidGeminiMediaParameters = { media_resolution: "ultra_high" } satisfies GenerationParametersDTO;

export function capturedContent(asset: CapturedMediaRef): LlmMessagePartDTO {
  return { type: "desktop_capture", asset_id: asset.assetId };
}

export function videoContent(): LlmMessagePartDTO {
  return { type: "video", mime_type: "video/mp4", data: "AAAA" };
}

export function deniedCapture(): DesktopCaptureReply {
  return { requestId: "request", outcome: "denied" };
}
