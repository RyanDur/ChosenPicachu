import {expect, test} from '@playwright/test';
import names from '../src/pages/names.json' with {type: 'json'};

const headOf = (html: string) => ({
  title: html.match(/<title>([^<]*)<\/title>/)?.[1],
  description: html.match(/<meta\s+name="description"\s+content="([^"]*)"/)?.[1]
});

for (const {page, route, named} of [
  {page: 'the home page', route: '', named: names.home},
  {page: 'the demos, on their first tab', route: 'demos/', named: names.demos.accordions},
  {page: 'the users page', route: 'users/', named: names.users},
  {page: 'the gallery', route: 'gallery/', named: names.gallery},
  {page: 'the games page', route: 'games/', named: names.games}
]) {
  test(`a search engine that runs no script reads ${page}'s own title and description`, async ({request}) => {
    const served = await request.get(route);

    expect(headOf(await served.text())).toEqual({title: named.title, description: named.description});
  });
}
