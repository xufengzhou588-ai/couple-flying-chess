import { readFileSync } from 'node:fs';
import ts from 'typescript';

function loadSimpleModule(path) {
  const source = readFileSync(path, 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  new Function('exports', 'module', compiled)(module.exports, module);
  return module.exports;
}

const root = 'prototypes/date-night/';
const translations = loadSimpleModule(`${root}mini-translations.ts`).miniTranslations;
const content = loadSimpleModule(`${root}content.ts`);
const more = loadSimpleModule(`${root}more-content.ts`);
const keys = new Set();
const failures = [];

for (const mode of ['after-hours', 'heart-dice', 'sketch-date', 'date-mystery']) {
  Object.values(content.games[mode]).forEach(value => keys.add(value));
}
Object.values(content.stageLabels).forEach(value => keys.add(value));
Object.values(content.stageNotes).forEach(value => keys.add(value));
for (const puzzle of more.mysteries) {
  [puzzle.scene, puzzle.clueA, puzzle.clueB, puzzle.question, ...puzzle.options, puzzle.hint, puzzle.resolution].forEach(value => keys.add(value));
  for (const localeIndex of [0, 1]) {
    const translatedOptions = puzzle.options.map(option => translations[option]?.[localeIndex]);
    if (new Set(translatedOptions).size !== 3) failures.push(`${puzzle.id}: translated answer choices must be distinct`);
  }
}

const files = ['App.tsx', 'shared.tsx', 'after-hours.tsx', 'chemistry-dice.tsx', 'sketch-date.tsx', 'more-games.tsx'];
for (const file of files) {
  const source = ts.createSourceFile(file, readFileSync(`${root}${file}`, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  function visit(node) {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && ['tr', 'fmt'].includes(node.expression.text) && ts.isStringLiteral(node.arguments[0])) keys.add(node.arguments[0].text);
    ts.forEachChild(node, visit);
  }
  visit(source);
}

for (const [file, variable] of [['after-hours.tsx', 'moves'], ['after-hours.tsx', 'settings'], ['after-hours.tsx', 'invitations'], ['sketch-date.tsx', 'sketches']]) {
  const source = ts.createSourceFile(file, readFileSync(`${root}${file}`, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  function visit(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(source) === variable) {
      function collect(child) {
        if (ts.isPropertyAssignment(child) && ['id', 'stage', 'art'].includes(child.name.getText(source))) return;
        if (ts.isStringLiteral(child) && child.text.length > 2) keys.add(child.text);
        ts.forEachChild(child, collect);
      }
      collect(node.initializer);
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
}

for (const key of keys) {
  const pair = translations[key];
  if (!pair || pair.length !== 2 || pair.some(value => !value.trim())) failures.push(`Missing Chinese or Spanish: ${key}`);
}
if (failures.length) {
  console.error(`Mini-game translations failed (${failures.length}):\n${failures.join('\n')}`);
  process.exit(1);
}
console.log(`Mini-game translations complete: ${keys.size} player-facing source keys, 9 mysteries, 3 languages.`);
