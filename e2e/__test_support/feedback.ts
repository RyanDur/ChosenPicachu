import type {Page, Route} from '@playwright/test';
import {maybe} from '@ryandur/sand';
import * as schema from 'schemawax';

type GitHub = {refuse?: string};

export type Posted = {query: string; variables: Record<string, string>};

const postedShape = schema.object({required: {query: schema.unknown, variables: schema.record(schema.unknown)}});

export const github = async (page: Page, {refuse}: GitHub = {}): Promise<Posted[]> => {
  const posted: Posted[] = [];
  await page.route('**/feedback-graphql', async (route: Route) => {
    const question: Posted = maybe(postedShape.decode(route.request().postDataJSON()))
      .map(({query, variables}) => ({
        query: String(query),
        variables: Object.fromEntries(Object.entries(variables).map(([key, value]) => [key, String(value)]))
      }))
      .orElse({query: '', variables: {}});
    if (question.query.includes('search')) {
      await route.fallback();
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
