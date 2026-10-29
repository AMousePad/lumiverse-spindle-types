import type { CapturedMediaRef, DesktopCaptureApprovalStatus, DesktopCaptureReply, LlmMessagePartDTO, SpindleAPI, SpindleCommandContextDTO, SpindleFrontendContext, WorkerToHost } from "lumiverse-spindle-types";

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

export function capturedContent(asset: CapturedMediaRef): LlmMessagePartDTO {
  return { type: "desktop_capture", asset_id: asset.assetId };
}

export function videoContent(): LlmMessagePartDTO {
  return { type: "video", mime_type: "video/mp4", data: "AAAA" };
}

export function deniedCapture(): DesktopCaptureReply {
  return { requestId: "request", outcome: "denied" };
}
