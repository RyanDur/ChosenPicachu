import {not} from '@ryandur/sand';
import {readdirSync, readFileSync} from 'node:fs';
import {join} from 'node:path';

import stylelint from 'stylelint';

const name = 'chosen/token-read';
const sources = /\.(css|ts|tsx|html|svg)$/;
const theSite = join(import.meta.dirname, '..', '..', 'src');

const messages = stylelint.utils.ruleMessages(name, {
  /** @param {string} token */
  unread: token => `"${token}" is defined, and nothing in src reads it, by var(), or spelled with its dashes in a script; delete it`
});

/**
 * @param {string} folder
 * @returns {string[]}
 */
const filesIn = folder => readdirSync(folder, {withFileTypes: true}).flatMap(entry =>
  entry.isDirectory() ? filesIn(join(folder, entry.name)) : sources.test(entry.name) ? [join(folder, entry.name)] : []);

/**
 * @param {string} file
 * @returns {string[]}
 */
const readsIn = file => {
  const text = readFileSync(file, 'utf8');
  const byVar = [...text.matchAll(/var\(\s*(--[\w-]+)/g)].map(([, token]) => token);
  return /\.(css|html|svg)$/.test(file) ? byVar : [...byVar, ...text.match(/--[\w-]+/g) ?? []];
};

/** @type {import('stylelint').Rule} */
const rule = (primary, {readIn = theSite} = {}) => (root, result) => {
  if (primary !== true) return;
  const read = new Set(filesIn(readIn).flatMap(readsIn));
  root.walkDecls(/^--/, declaration => {
    if (not(read.has(declaration.prop))) {
      stylelint.utils.report({ruleName: name, result, node: declaration, message: messages.unread(declaration.prop)});
    }
  });
};

rule.ruleName = name;
rule.messages = messages;

export const tokenRead = stylelint.createPlugin(name, rule);
