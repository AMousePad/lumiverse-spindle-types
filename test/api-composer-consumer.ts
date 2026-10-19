import { SPINDLE_COMPOSER_HOST_CAPABILITIES } from "lumiverse-spindle-types";
import type {
  SpindleFrontendContext, SpindleComposerAPI, SpindleComposerState, SpindleComposerInsertPosition,
} from "lumiverse-spindle-types";

declare const ctx: SpindleFrontendContext;

// Older hosts remain representable, and callers must feature-detect the API.
const legacy: Pick<SpindleFrontendContext, "composer"> = {};
const capability: 1 = SPINDLE_COMPOSER_HOST_CAPABILITIES["composer-v1"];
if (ctx.composer && ctx.host.capabilities["composer-v1"] >= capability) {
  const composer: SpindleComposerAPI = ctx.composer;
  const state: SpindleComposerState = composer.getState();
  const chatId: string | null = state.chatId;
  if (state.mounted) {
    composer.setText(state.text.trim());
    composer.insertText(" and then", { at: "end" });
    composer.insertText("hello");
    composer.focus();
    const sent: Promise<void> = composer.send();
    void sent;
  }
  const unsubscribe: () => void = composer.onChange((next) => {
    const draft: string = next.text;
    void draft;
  });
  unsubscribe();
  // @ts-expect-error Composer snapshots are read-only.
  state.text = "x";
  // @ts-expect-error Only the caret and the end are insert positions.
  composer.insertText("x", { at: "start" });
  void chatId;
}

const position: SpindleComposerInsertPosition = "caret";
// @ts-expect-error Drafts are plain strings.
ctx.composer?.setText(42);
void [legacy, position];
