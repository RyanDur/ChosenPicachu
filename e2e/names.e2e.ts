import {expect, test} from '@playwright/test';
import names from '../src/pages/names.json' with {type: 'json'};

const headOf = (html: string) => ({
  title: html.match(/<title>([^<]*)<\/title>/)?.[1],
  description: html.match(/<meta\s+name="description"\s+content="([^"]*)"/)?.[1]
});

const listed = {
  '': names.home,
  'demos/': names.demos.accordions,
  'users/': names.users,
  'gallery/': names.gallery,
  'games/': names.games
};

test('a search engine that runs no script reads each page’s own title and description', async ({request}) => {
  const read = await Promise.all(Object.keys(listed).map(async route => [route, headOf(await (await request.get(route)).text())]));

  expect(Object.fromEntries(read)).toEqual(listed);
});
