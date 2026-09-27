import {http, HttpResponse, JsonBodyType} from 'msw';
import {failure} from '@ryandur/sand';
import {server} from '@__test_support/server';
import {HTTPError} from '@transport/types';
import {sent} from '../github';

type Asked = {query: string; variables: Record<string, string>};

const github = (answer: (asked: Asked) => JsonBodyType, status = 200) => {
  const asked: Asked[] = [];
  server.use(http.post('https://api.github.com/graphql', async ({request}) => {
    const body: unknown = await request.json();
    const question = typeof body === 'object' && body !== null && 'query' in body && 'variables' in body
      ? {query: String(body.query), variables: Object.fromEntries(Object.entries(Object(body.variables)).map(([key, value]) => [key, String(value)]))}
      : {query: '', variables: {}};
    asked.push(question);
    return HttpResponse.json(answer(question), {status});
  }));
  return asked;
};

const note = {
  page: {key: '/demos/?tab=tables', name: 'Demos Tables'},
  words: 'The sort menu hides behind the header.',
  reach: 'reader@example.test',
  from: 'https://ryandur.github.io/ChosenPicachu/demos/?tab=tables'
};

describe('sending a note to GitHub', () => {
  test('should open the page’s thread in the Feedback category with the first note, titled by the page’s name and key', async () => {
    const asked = github(({query}) => query.includes('search')
      ? {data: {search: {nodes: []}}}
      : {data: {createDiscussion: {discussion: {id: 'D_1', url: 'https://github.test/discussions/1'}}}});

    const where = await sent('token', note).orNull();

    expect(where).toBe('https://github.test/discussions/1');
    expect(asked[1].variables.categoryId).toBe('DIC_kwDOFnONa84DGhfO');
    expect(asked[1].variables.title).toBe('Feedback: Demos Tables (/demos/?tab=tables)');
    expect(asked[1].variables.body).toContain('The sort menu hides behind the header.');
    expect(asked[1].variables.body).toContain('reader@example.test');
  });

  test('should add a later note to the thread the page already has', async () => {
    const asked = github(({query}) => query.includes('search')
      ? {data: {search: {nodes: [{id: 'D_7', url: 'https://github.test/discussions/7', title: 'Feedback: Demos Tables (/demos/?tab=tables)'}]}}}
      : {data: {addDiscussionComment: {comment: {url: 'https://github.test/discussions/7#c'}}}});

    const where = await sent('token', {page: note.page, words: note.words, from: note.from}).orNull();

    expect(where).toBe('https://github.test/discussions/7');
    expect(asked[1].variables.discussionId).toBe('D_7');
    expect(asked[1].variables.body).not.toContain('reach');
  });

  test('should not mistake another page’s thread for this one', async () => {
    const asked = github(({query}) => query.includes('search')
      ? {data: {search: {nodes: [{id: 'D_2', url: 'https://github.test/discussions/2', title: 'Feedback: Demos (/demos/?tab=tables-old)'}]}}}
      : {data: {createDiscussion: {discussion: {id: 'D_3', url: 'https://github.test/discussions/3'}}}});

    await sent('token', note).value;

    expect(asked[1].query).toContain('createDiscussion');
  });

  test('should fail as forbidden when GitHub does not know the token', async () => {
    github(() => ({message: 'Bad credentials'}), 401);

    const refused = (await sent('token', note).value).inspect();

    expect(refused).toEqual(failure(HTTPError.FORBIDDEN).inspect());
  });

  test('should fail as forbidden when GitHub answers with errors', async () => {
    github(() => ({data: null, errors: [{message: 'Could not resolve to a node'}]}));

    const refused = (await sent('token', note).value).inspect();

    expect(refused).toEqual(failure(HTTPError.FORBIDDEN).inspect());
  });

  test('should fail as unreadable when GitHub opens a thread without saying where', async () => {
    github(({query}) => query.includes('search')
      ? {data: {search: {nodes: []}}}
      : {data: {createDiscussion: {discussion: {id: 'D_1'}}}});

    const refused = (await sent('token', note).value).inspect();

    expect(refused).toEqual(failure(HTTPError.CANNOT_DECODE).inspect());
  });
});
