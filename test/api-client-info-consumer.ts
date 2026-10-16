import { SPINDLE_CLIENT_HOST_CAPABILITIES } from "lumiverse-spindle-types";
import type {
  SpindleFrontendContext, SpindleClientAPI, SpindleClientInfo,
  SpindleClientKind, SpindleClientPlatform,
} from "lumiverse-spindle-types";

declare const ctx: SpindleFrontendContext;

// Older hosts remain representable, and callers must feature-detect the API.
const legacy: Pick<SpindleFrontendContext, "client"> = {};
const capability: 1 = SPINDLE_CLIENT_HOST_CAPABILITIES["client-info-v1"];
if (ctx.client && ctx.host.capabilities["client-info-v1"] >= capability) {
  const client: SpindleClientAPI = ctx.client;
  const info: SpindleClientInfo = client.getInfo();
  const kind: SpindleClientKind = info.kind;
  const platform: SpindleClientPlatform = info.platform;
  const mobilePwa: boolean = kind === "pwa" && info.isMobile;
  const desktopBridge: boolean = kind === "desktop" && info.bridges.desktop;
  const mobileApp: boolean = kind === "mobile" && (platform === "ios" || platform === "android");
  const iosBridge: boolean = info.bridges.ios;
  const androidBridge: boolean = info.bridges.android;
  // @ts-expect-error Client snapshots are read-only.
  info.kind = "browser";
  // @ts-expect-error Nested native bridge flags are read-only too.
  info.bridges.desktop = true;
  void [mobilePwa, desktopBridge, mobileApp, iosBridge, androidBridge];
}

// @ts-expect-error Client kind and OS are different dimensions.
const invalidKind: SpindleClientKind = "ios";
// @ts-expect-error Browser OS detection can be unknown, never a made-up platform.
const invalidPlatform: SpindleClientPlatform = "web";
void [legacy, invalidKind, invalidPlatform];
