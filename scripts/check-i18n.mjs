import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync('src/i18n.ts', 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022
  }
}).outputText;
const module = { exports: {} };
const execute = new Function('exports', 'module', 'require', compiled);
execute(module.exports, module, specifier => {
  throw new Error(`Unexpected runtime import in i18n.ts: ${specifier}`);
});

const { t } = module.exports;
const locales = ['zh', 'en', 'es'];
const failures = [];

function describe(value) {
  if (Array.isArray(value)) return { type: 'array', length: value.length };
  if (value && typeof value === 'object') return { type: 'object' };
  return { type: typeof value, empty: typeof value === 'string' && value.trim().length === 0 };
}

function flatten(value, prefix = '', output = new Map()) {
  if (Array.isArray(value)) {
    output.set(prefix, describe(value));
    value.forEach((item, index) => flatten(item, `${prefix}[${index}]`, output));
    return output;
  }

  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      flatten(child, prefix ? `${prefix}.${key}` : key, output);
    }
    return output;
  }

  output.set(prefix, describe(value));
  return output;
}

const reference = flatten(t.zh);

for (const locale of locales) {
  const entries = flatten(t[locale]);

  for (const [key, expected] of reference) {
    const actual = entries.get(key);
    if (!actual) {
      failures.push(`${locale}: missing ${key}`);
      continue;
    }
    if (actual.type !== expected.type) failures.push(`${locale}: ${key} must be ${expected.type}`);
    if (actual.type === 'array' && actual.length !== expected.length) {
      failures.push(`${locale}: ${key} has ${actual.length} items; expected ${expected.length}`);
    }
    if (actual.empty) failures.push(`${locale}: ${key} is empty`);
  }

  for (const key of entries.keys()) {
    if (!reference.has(key)) failures.push(`${locale}: unexpected ${key}`);
  }
}

if (failures.length) {
  console.error(`i18n check failed with ${failures.length} issue(s):`);
  failures.forEach(item => console.error(`  - ${item}`));
  process.exit(1);
}

console.log(`i18n complete: ${locales.length} locales, ${reference.size} leaf values and array entries per locale.`);
