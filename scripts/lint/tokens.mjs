import {readdirSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
import stylelint from 'stylelint';

const name = 'chosen/token-read';
const sources = /\.(css|ts|tsx)$/;
const freshFor = 2_000;

const messages = stylelint.utils.ruleMessages(name, {
  /** @param {string} token */
  unread: token => `"${token}" is defined, and nothing in src reads it, by var() or by name in a script; delete it`
});

/** @param {string} folder @returns {string[]} */
const filesIn = folder => readdirSync(folder, {withFileTypes: true}).flatMap(entry =>
  entry.isDirectory() ? filesIn(join(folder, entry.name)) : sources.test(entry.name) ? [join(folder, entry.name)] : []);

/** @type {{at: number, read: Set<string>}} */
let seen = {at: 0, read: new Set()};

/**
 * @param {string} file
 * @returns {string[]} what the file reads: a style sheet by var(), a script by var() or by any name it spells
 */
const readsIn = file => {
  const text = readFileSync(file, 'utf8');
  const byVar = [...text.matchAll(/var\(\s*--([\w-]+)/g)].map(([, token]) => token);
  return file.endsWith('.css') ? byVar : [...byVar, ...(text.match(/[\w-]+/g) ?? []).map(word => word.replace(/^-+/, ''))];
};

/** @returns {Set<string>} the names of every custom property src reads, without their dashes */
const readInSrc = () => {
  if (Date.now() - seen.at < freshFor) return seen.read;
  const read = new Set(filesIn('src').flatMap(readsIn));
  seen = {at: Date.now(), read};
  return read;
};

/** @type {import('stylelint').Rule} */
const rule = primary => (root, result) => {
  if (primary !== true) return;
  root.walkDecls(/^--/, declaration => {
    if (!readInSrc().has(declaration.prop.slice(2))) {
      stylelint.utils.report({ruleName: name, result, node: declaration, message: messages.unread(declaration.prop)});
    }
  });
};

rule.ruleName = name;
rule.messages = messages;

export const tokenRead = stylelint.createPlugin(name, rule);
