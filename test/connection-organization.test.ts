import { expect, test } from 'bun:test';
import { SPINDLE_CONNECTION_ORGANIZATION_HOST_CAPABILITIES } from '../src/index';
test('exports the frozen additive connection organization capability', () => {
  expect(SPINDLE_CONNECTION_ORGANIZATION_HOST_CAPABILITIES).toEqual({ 'connection-organization-v1': 1 });
  expect(Object.isFrozen(SPINDLE_CONNECTION_ORGANIZATION_HOST_CAPABILITIES)).toBe(true);
});
