import type { ContextClipStatsDTO, DryRunResultDTO, SpindleAPI } from "lumiverse-spindle-types";

declare const spindle: SpindleAPI;
declare const result: Awaited<ReturnType<typeof spindle.generate.dryRun>>;

const historyTokens: number | undefined = result.chatHistoryTokens;
const clipping: ContextClipStatsDTO | undefined = result.contextClipStats;
const empty: DryRunResultDTO = {
  messages: [], breakdown: [], parameters: {}, model: "model", provider: "provider",
};
const populated: DryRunResultDTO = {
  ...empty,
  chatHistoryTokens: 0,
  contextClipStats: {
    enabled: true, maxContext: 8192, maxResponseTokens: 1024, safetyMargin: 128,
    inputBudget: 7040, fixedTokens: 1000, remainingHistoryBudget: 6040,
    chatHistoryTokensBefore: 7000, chatHistoryTokensAfter: 6000,
    messagesDropped: 1, tokensDropped: 1000, tokenizerUsed: "approximate",
    budgetInvalid: false, fixedOverBudget: false, anchorActive: true,
    protectedHistoryTokens: 2000, remainingBeforeAnchor: 4040, anchorOverflow: false,
  },
};

// @ts-expect-error Missing statistics must be handled by consumers.
const requiredClipping: ContextClipStatsDTO = result.contextClipStats;
// @ts-expect-error Token totals are numeric.
const invalid: DryRunResultDTO = { ...empty, chatHistoryTokens: "0" };

void [historyTokens, clipping, populated, requiredClipping, invalid];
