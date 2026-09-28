import {http, HttpResponse} from 'msw';
import {server} from '@__test_support/server';

export const githubFindingNoThread = () =>
  server.use(http.post('https://api.github.com/graphql', () => HttpResponse.json({data: {search: {nodes: []}}})));

export const githubHoldingItsAnswer = () => {
  let answer: () => void = () => undefined;
  const held = new Promise<void>(resolve => {
    answer = () => resolve();
  });
  const notes: string[] = [];
  server.use(http.post('https://api.github.com/graphql', async ({request}) => {
    const asked = await request.text();
    if (asked.includes('search')) {
      return HttpResponse.json({data: {search: {nodes: []}}});
    }
    notes.push(asked);
    await held;
    return HttpResponse.json({data: {createDiscussion: {discussion: {id: 'D_9', url: 'https://github.test/discussions/9'}}}});
  }));
  return {notes, answers: () => answer()};
};

export const githubLosingThePageThread = () =>
  server.use(http.post('https://api.github.com/graphql', async ({request}) => {
    const asked = await request.text();
    if (asked.includes('search')) {
      return HttpResponse.json({data: {search: {nodes: [{id: 'D_7', url: 'https://github.test/discussions/7', title: 'Feedback: Home (/)'}]}}});
    }
    if (asked.includes('addDiscussionComment')) {
      return HttpResponse.json({data: null, errors: [{type: 'NOT_FOUND', message: 'Could not resolve to a node with the global id of \'D_7\''}]});
    }
    return HttpResponse.json({data: {createDiscussion: {discussion: {id: 'D_8', url: 'https://github.test/discussions/8'}}}});
  }));
