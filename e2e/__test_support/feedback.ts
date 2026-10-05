import type {Page, Route} from '@playwright/test';
import {maybe} from '@ryandur/sand';

type Thread = {url: string; title: string};
type GitHub = {thread?: Thread; refuse?: string};

export type Posted = {query: string; variables: Record<string, string>};

export const github = async (page: Page, {thread, refuse}: GitHub = {}): Promise<Posted[]> => {
  const posted: Posted[] = [];
  await page.route('https://api.github.com/graphql', async (route: Route) => {
    const asked: unknown = route.request().postDataJSON();
    const question: Posted = typeof asked === 'object' && asked !== null && 'query' in asked && 'variables' in asked
      ? {query: String(asked.query), variables: Object.fromEntries(Object.entries(Object(asked.variables)).map(([key, value]) => [key, String(value)]))}
      : {query: '', variables: {}};
    if (question.query.includes('search')) {
      await route.fulfill({json: {data: {search: {nodes: thread ? [{id: 'D_1', ...thread}] : []}}}});
      return;
    }
    posted.push(question);
    await route.fulfill(maybe(refuse)
      .map(message => ({status: 401, json: {message}}))
      .orElse({json: {data: {createDiscussion: {discussion: {id: 'D_9', url: 'https://github.com/RyanDur/ChosenPicachu/discussions/9'}}, addDiscussionComment: {comment: {url: 'x'}}}}}));
  });
  return posted;
};

export const feedbackOn = (page: Page) => {
  const dialog = page.getByRole('dialog', {name: 'Feedback'});
  const open = page.getByRole('button', {name: 'Feedback', exact: true});
  const pressed = async (): Promise<() => Promise<string[]>> => {
    const toggles = await page.getByRole('dialog', {name: 'Feedback', includeHidden: true}).evaluateHandle(shown => {
      const seen: string[] = [];
      shown.addEventListener('beforetoggle', event => {
        if (event instanceof ToggleEvent) seen.push(event.newState);
      });
      return seen;
    });
    await open.click();
    return () => toggles.evaluate(seen => [...seen]);
  };
  return {
    open,
    pressed,
    dialog,
    words: dialog.getByRole('textbox', {name: 'What did you find?'}),
    reach: dialog.getByRole('textbox', {name: 'A way to reach you, if you like'}),
    send: dialog.getByRole('button', {name: 'Send'}),
    cancel: dialog.getByRole('button', {name: 'Cancel'}),
    thread: dialog.getByRole('link', {name: 'this page’s thread on GitHub'}),
    sent: page.getByRole('paragraph').filter({has: open}).getByRole('status')
  };
};
