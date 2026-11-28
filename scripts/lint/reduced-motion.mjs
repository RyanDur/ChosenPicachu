import {is, maybe, not} from '@ryandur/sand';
import stylelint from 'stylelint';

const name = 'chosen/reduced-motion-once';
const theResetsOwn = (/** @type {string} */ property) =>
  /^(transition|animation)(-|$)/.test(property) && not(property.endsWith('-delay')) || property === 'scroll-behavior';

const messages = stylelint.utils.ruleMessages(name, {
  /** @param {string} property */
  repeats: property => `"${property}" under reduced motion is the reset's to set, once for every element; a component zeroes only a delay that times its own slide`
});

/**
 * Reduce is the query's value, or its boolean form; a query that starts with not,
 * or negates the feature, asks for motion.
 * @param {string} query
 */
const asksForLessMotion = query => /\(\s*prefers-reduced-motion\s*(:\s*reduce\s*)?\)/.test(query)
  && not(/^\s*not\b/.test(query)) && not(/\bnot\s*\(\s*prefers-reduced-motion/.test(query));

/** @param {import('postcss').Container | import('postcss').Document | undefined} node */
const underReducedMotion = node => {
  if (not(is(node))) return false;
  if (node.type === 'atrule' && 'name' in node && node.name === 'media' && asksForLessMotion(String(node.params))) return true;
  return underReducedMotion(node.parent);
};

/** @param {import('postcss').Root} root */
const isTheReset = root => maybe(root.source).mBind(({input}) => maybe(input.file)).orElse('').endsWith('src/styles/reset.css');

/** @type {import('stylelint').Rule} */
const rule = primary => (root, result) => {
  if (primary !== true || isTheReset(root)) return;
  root.walkDecls(declaration => {
    if (theResetsOwn(declaration.prop) && underReducedMotion(declaration.parent)) {
      stylelint.utils.report({ruleName: name, result, node: declaration, message: messages.repeats(declaration.prop)});
    }
  });
};

rule.ruleName = name;
rule.messages = messages;

export const reducedMotionOnce = stylelint.createPlugin(name, rule);
