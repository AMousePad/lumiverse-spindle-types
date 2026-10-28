import type { SpindleAPI, SpindleFrontendConnectionsAPI, SpindleConnectionOrganizationSnapshot } from 'lumiverse-spindle-types';
declare const spindle: SpindleAPI;
declare const connections: SpindleFrontendConnectionsAPI;
const receive = (value: SpindleConnectionOrganizationSnapshot) => {
  const id: string | null = value.folders[0]?.id ?? null;
  const recent: string[] = value.recentConnectionIds;
  void [id, recent];
  // @ts-expect-error Profiles are credential-free.
  value.connections[0].api_key;
};
if (connections.organization) {
  const stop: () => void = connections.organization.watch({ kind: 'image' }, receive, console.error);
  stop();
  void connections.organization.get({ kind: 'embedding' }).then(receive);
  // @ts-expect-error Use the public image kind, not an internal settings key.
  connections.organization.get({ kind: 'imageGen' });
}
if (spindle.connections.organization) {
  spindle.connections.organization.watch({ kind: 'tts', userId: 'user' }, receive)();
}
// Existing methods retain their original signatures.
void spindle.connections.list();
void connections.list();
void connections.list({ kind: 'llm' });
