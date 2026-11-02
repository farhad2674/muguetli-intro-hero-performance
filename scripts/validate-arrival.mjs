import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const source = await readFile(new URL('../lib/arrival-policy.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { canEnterArrival, ARRIVAL_HOLD_MS } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const ready = { returning: false, skipRequested: false, criticalReady: true, assetsReady: true, filmEndedAt: 10000, now: 11200 };
const cases = [
  ['first visit waits for full film', { ...ready, filmEndedAt: null }, false],
  ['first visit cannot skip', { ...ready, skipRequested: true, filmEndedAt: null }, false],
  ['first visit holds for all 1200 milliseconds', { ...ready, now: 11199 }, false],
  ['first visit enters after the hold', ready, true],
  ['slow assets keep the preloader visible', { ...ready, assetsReady: false }, false],
  ['hero and bootstrap must be ready', { ...ready, criticalReady: false }, false],
  ['returning visitor can skip film and background downloads', { ...ready, returning: true, skipRequested: true, assetsReady: false, filmEndedAt: null, now: 100 }, true],
  ['returning skip still waits for opening hero', { ...ready, returning: true, skipRequested: true, criticalReady: false }, false],
  ['returning visitor can watch full presentation', { ...ready, returning: true, now: 11199 }, false],
  ['late assets finish immediately once hold is satisfied', { ...ready, now: 20000 }, true],
];
assert.equal(ARRIVAL_HOLD_MS, 1200);
for (const [name, state, expected] of cases) {
  assert.equal(canEnterArrival(state), expected, name);
  console.log(`PASS ${name}`);
}
