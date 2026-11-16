import {readFileSync} from 'node:fs';
import {parse} from 'yaml';

/** @typedef {Record<string, string>} Settings */
/** @typedef {{jobs: Record<string, {env: Settings, steps: {name?: string, env?: Settings}[]}>}} Workflow */

/**
 * @param {string} name
 * @return {Workflow}
 */
const workflow = name => parse(readFileSync(`.github/workflows/${name}`, 'utf8'));
const siteSettings = env => Object.fromEntries(Object.entries(env).filter(([name]) => name.startsWith('VITE_')));

test('the Pages report builds the site with the settings build_test builds it with', () => {
  const buildTest = workflow('checks.yml').jobs.build_test;
  const built = {...buildTest.env, ...buildTest.steps.find(({name}) => name === 'Build').env};

  expect(siteSettings(workflow('pages.yml').jobs.pages.env)).toEqual(siteSettings(built));
});
