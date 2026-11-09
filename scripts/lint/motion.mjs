import {maybe, not} from '@ryandur/sand';
import stylelint from 'stylelint';

const name = 'chosen/compositor-motion';
const composited = new Set(['transform', 'translate', 'rotate', 'scale', 'opacity', 'filter']);
const discrete = new Set(['visibility', 'content-visibility', 'display', 'overlay']);
const tracks = new Set(['grid-template-rows', 'grid-template-columns']);
const notAProperty = /^(\d|\.|-?\d|cubic-bezier|steps|linear|ease|step-|allow-discrete|normal|none|initial|inherit|unset)/;

const messages = stylelint.utils.ruleMessages(name, {
  /** @param {string} property */
  moves: property => `"${property}" moves on the main thread; motion is transform, translate, rotate, scale, opacity or filter, which the GPU composites, or a grid track opening from 0fr to 1fr`
});

/**
 * @param {{text: string, depth: number}} flat the outermost text so far, and how deep the next character sits
 * @param {string} char
 */
const keepOutermost = ({text, depth}, char) => {
  if (char === '(') return {text: depth === 0 ? `${text}()` : text, depth: depth + 1};
  if (char === ')') return {text, depth: depth - 1};
  return {text: depth === 0 ? text + char : text, depth};
};

/** @param {string} value a value whose every function, nested or not, becomes name() */
const flattened = value => value.split('').reduce(keepOutermost, {text: '', depth: 0}).text;

/** @param {string} value a transition's value */
const items = value => flattened(value).split(',').map(item => item.trim()).filter(item => item !== '');

/** @param {string} item */
const propertyIn = item => item.split(/\s+/).find(word => not(notAProperty.test(word))) ?? 'all';

const time = /^[\d.]+m?s$/i;
const easing = /^(cubic-bezier|steps|linear)\(\)$/;
/** @param {string} word */
const measures = word => time.test(word) || (/^[a-z-]+\(\)$/.test(word) && not(easing.test(word)));

/** @param {string} item a transition's item, whose first time or non-easing function is its duration */
const flips = item => maybe(item.split(/\s+/).find(measures))
  .map(duration => time.test(duration) && Number.parseFloat(duration) === 0)
  .orElse(false);

/** @param {string} property */
const allowed = property => property === 'none' || composited.has(property) || discrete.has(property) || tracks.has(property);

/** @type {import('stylelint').Rule} */
const rule = primary => (root, result) => {
  if (primary !== true) return;
  /**
   * @param {import('postcss').Declaration} node
   * @param {string} property
   */
  const report = (node, property) =>
    stylelint.utils.report({ruleName: name, result, node, message: messages.moves(property)});
  root.walkDecls(/^transition(-property)?$/, declaration => items(declaration.value)
    .filter(item => declaration.prop === 'transition-property' || not(flips(item)))
    .map(item => declaration.prop === 'transition' && item !== 'none' ? propertyIn(item) : item)
    .filter(property => not(allowed(property)))
    .forEach(property => report(declaration, property)));
  root.walkAtRules('keyframes', keyframes => keyframes.walkDecls(declaration => {
    if (not(allowed(declaration.prop)) && declaration.prop !== 'animation-timing-function') report(declaration, declaration.prop);
  }));
};

rule.ruleName = name;
rule.messages = messages;

export const motion = stylelint.createPlugin(name, rule);
