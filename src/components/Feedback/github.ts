import {Maybe, maybe} from '@ryandur/sand';

const endpoint = 'https://api.github.com/graphql';
const repositoryId = 'MDEwOlJlcG9zaXRvcnkzNzY2NzE1OTU=';
const generalCategoryId = 'DIC_kwDOFnONa84DGeGj';

export const discussions = 'https://github.com/RyanDur/ChosenPicachu/discussions';

export type Page = {key: string; name: string};
export type Note = {page: Page; words: string; reach: string; from: string};

type Thread = {id: string; url: string};

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const field = (value: unknown, ...path: string[]): unknown =>
  path.reduce<unknown>((at, key) => isRecord(at) ? at[key] : undefined, value);

const text = (value: unknown): string => typeof value === 'string' ? value : '';

const threadIn = (node: unknown): Thread => ({id: text(field(node, 'id')), url: text(field(node, 'url'))});

export const titleOf = ({key, name}: Page): string => `Feedback: ${name} (${key})`;

const asked = async (token: string, query: string, variables: Record<string, string>): Promise<unknown> => {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {authorization: `bearer ${token}`, 'content-type': 'application/json'},
    body: JSON.stringify({query, variables})
  });
  const reply: unknown = await response.json().catch(() => ({}));
  const refusal = text(field(field(reply, 'errors'), '0', 'message')) || text(field(reply, 'message'));
  if (!response.ok || refusal !== '') {
    throw new Error(refusal || `GitHub answered ${response.status}`);
  }
  return field(reply, 'data');
};

const searching = `query($search: String!) {
  search(query: $search, type: DISCUSSION, first: 5) { nodes { ... on Discussion { id url title } } }
}`;

export const threadFor = async (token: string, page: Page): Promise<Maybe<Thread>> => {
  const found = await asked(token, searching, {search: `repo:RyanDur/ChosenPicachu in:title "(${page.key})"`});
  const nodes = field(found, 'search', 'nodes');
  return maybe(Array.isArray(nodes) ? nodes.find(node => text(field(node, 'title')).endsWith(`(${page.key})`)) : undefined).map(threadIn);
};

const opening = `mutation($repositoryId: ID!, $categoryId: ID!, $title: String!, $body: String!) {
  createDiscussion(input: {repositoryId: $repositoryId, categoryId: $categoryId, title: $title, body: $body}) { discussion { id url } }
}`;

const replying = `mutation($discussionId: ID!, $body: String!) {
  addDiscussionComment(input: {discussionId: $discussionId, body: $body}) { comment { url } }
}`;

const bodyOf = ({words, reach, from}: Note): string =>
  [words, reach === '' ? '' : `A way to reach them: ${reach}`, `Sent from ${from}`].filter(line => line !== '').join('\n\n');

export const sent = async (token: string, note: Note): Promise<string> =>
  (await threadFor(token, note.page)).either(
    async thread => {
      await asked(token, replying, {discussionId: thread.id, body: bodyOf(note)});
      return thread.url;
    },
    async () => {
      const opened = await asked(token, opening, {repositoryId, categoryId: generalCategoryId, title: titleOf(note.page), body: bodyOf(note)});
      return text(field(opened, 'createDiscussion', 'discussion', 'url'));
    });
