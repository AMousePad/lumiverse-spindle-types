import type { LumiverseVersionInfo, SpindleAPI, WorkerToHost } from "lumiverse-spindle-types";

declare const spindle: SpindleAPI;

const info: Promise<LumiverseVersionInfo> = spindle.version.getInfo();
const commit: Promise<string | null> = spindle.version.getCommit();
const branch: Promise<string | null> = spindle.version.getBranch();
const backend: Promise<string> = spindle.version.getBackend();
const frontend: Promise<string> = spindle.version.getFrontend();

void info.then((report) => {
  const backendVersion: string = report.backend;
  const frontendVersion: string = report.frontend;
  const commitId: string | null = report.commit;
  const branchName: string | null = report.branch;
  void backendVersion;
  void frontendVersion;
  void commitId;
  void branchName;
});
void commit;
void branch;
void backend;
void frontend;

const infoMessage: WorkerToHost = { type: "version_get_info", requestId: "request-id" };
const commitMessage: WorkerToHost = { type: "version_get_commit", requestId: "request-id" };
const branchMessage: WorkerToHost = { type: "version_get_branch", requestId: "request-id" };
void infoMessage;
void commitMessage;
void branchMessage;
