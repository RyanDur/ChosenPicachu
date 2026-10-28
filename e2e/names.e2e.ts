import {expect, test} from '@playwright/test';
import names from '../src/pages/names.json' with {type: 'json'};

const headOf = (html: string) => ({
  title: html.match(/<title>([^<]*)<\/title>/)?.[1],
  description: html.match(/<meta\s+name="description"\s+content="([^"]*)"/)?.[1]
});

const listed = {
  '': names.home,
  'users/': names.users,
  'gallery/': names.gallery,
  'games/': names.games,
  'record/': names.record,
  ...Object.fromEntries(Object.entries(names.demos).map(([tab, listing]) => [`demos/${tab}/`, listing])),
  ...Object.fromEntries(Object.entries(names.charts).map(([kind, listing]) => [`demos/charts/${kind}/`, listing])),
  ...Object.fromEntries(Object.entries(names.practice).map(([tab, listing]) => [`practice/${tab}/`, listing]))
};

test('a search engine that runs no script reads each page’s own title and description', async ({request}) => {
  const read = await Promise.all(Object.keys(listed).map(async route => [route, headOf(await (await request.get(route)).text())]));

  expect(Object.fromEntries(read)).toEqual(listed);
});
