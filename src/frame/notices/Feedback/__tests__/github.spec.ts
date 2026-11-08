import {http, HttpResponse, JsonBodyType} from 'msw';
import {failure, maybe} from '@ryandur/sand';
import * as schema from 'schemawax';
import {server} from '@__test_support/server';
import {HTTPError} from '@transport';
import {github} from '../github';

type Asked = {query: string; variables: Record<string, string>};

const askedShape = schema.object({required: {query: schema.unknown, variables: schema.record(schema.unknown)}});

const asking = {endpoint: 'https://api.github.com/graphql', token: 'token'};

const githubAnswering = (answer: (asked: Asked) => JsonBodyType, status = 200) => {
  const asked: Asked[] = [];
  server.use(http.post(asking.endpoint, async ({request}) => {
    const question: Asked = maybe(askedShape.decode(await request.json()))
      .map(({query, variables}) => ({
        query: String(query),
        variables: Object.fromEntries(Object.entries(variables).map(([key, value]) => [key, String(value)]))
      }))
      .orElse({query: '', variables: {}});
    asked.push(question);
    return HttpResponse.json(answer(question), {status});
  }));
  return asked;
};

const note = {
  page: {key: '/demos/tables/', name: 'Demos Tables'},
  words: 'The sort menu hides behind the header.',
  reach: 'reader@example.test',
  from: 'https://ryandur.github.io/ChosenPicachu/demos/tables/'
};

describe('sending a note to GitHub', () => {
  test('should open the page’s thread in the Feedback category with the first note, titled by the page’s name and key', async () => {
    const asked = githubAnswering(({query}) => query.includes('search')
      ? {data: {search: {nodes: []}}}
      : {data: {createDiscussion: {discussion: {id: 'D_1', url: 'https://github.test/discussions/1'}}}});

    const where = await github.sent(asking, note).orNull();

    expect(where).toBe('https://github.test/discussions/1');
    expect(asked[1].variables.categoryId).toBe('DIC_kwDOFnONa84DGhfO');
    expect(asked[1].variables.title).toBe('Feedback: Demos Tables (/demos/tables/)');
    expect(asked[1].variables.body).toContain('The sort menu hides behind the header.');
    expect(asked[1].variables.body).toContain('reader@example.test');
  });

  test('should add a later note to the thread the page already has', async () => {
    const asked = githubAnswering(({query}) => query.includes('search')
      ? {data: {search: {nodes: [{id: 'D_7', url: 'https://github.test/discussions/7', title: 'Feedback: Demos Tables (/demos/tables/)'}]}}}
      : {data: {addDiscussionComment: {comment: {url: 'https://github.test/discussions/7#c'}}}});

    const where = await github.sent(asking, {page: note.page, words: note.words, from: note.from}).orNull();

    expect(where).toBe('https://github.test/discussions/7');
    expect(asked[1].variables.discussionId).toBe('D_7');
    expect(asked[1].variables.body).not.toContain('reach');
  });

  test('should not mistake another page’s thread for this one', async () => {
    const asked = githubAnswering(({query}) => query.includes('search')
      ? {data: {search: {nodes: [{id: 'D_2', url: 'https://github.test/discussions/2', title: 'Feedback: Demos (/demos/tables-old/)'}]}}}
      : {data: {createDiscussion: {discussion: {id: 'D_3', url: 'https://github.test/discussions/3'}}}});

    await github.sent(asking, note).value;

    expect(asked[1].query).toContain('createDiscussion');
  });

  test('should fail as forbidden when GitHub answers with errors', async () => {
    githubAnswering(() => ({data: null, errors: [{type: 'FORBIDDEN', message: 'Resource not accessible by integration'}]}));

    const refused = (await github.sent(asking, note).value).inspect();

    expect(refused).toEqual(failure(HTTPError.FORBIDDEN).inspect());
  });

  test('should fail as not found when GitHub answers NOT_FOUND', async () => {
    githubAnswering(({query}) => query.includes('search')
      ? {data: {search: {nodes: [{id: 'D_7', url: 'https://github.test/discussions/7', title: 'Feedback: Demos Tables (/demos/tables/)'}]}}}
      : {data: null, errors: [{type: 'NOT_FOUND', message: 'Could not resolve to a node with the global id of \'D_7\''}]});

    const refused = (await github.sent(asking, note).value).inspect();

    expect(refused).toEqual(failure(HTTPError.NOT_FOUND).inspect());
  });

  test('should fail as unreadable when GitHub opens a thread without saying where', async () => {
    githubAnswering(({query}) => query.includes('search')
      ? {data: {search: {nodes: []}}}
      : {data: {createDiscussion: {discussion: {id: 'D_1'}}}});

    const refused = (await github.sent(asking, note).value).inspect();

    expect(refused).toEqual(failure(HTTPError.CANNOT_DECODE).inspect());
  });
});
