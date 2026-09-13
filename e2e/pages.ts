import type {Locator, Page} from '@playwright/test';
import {priceDelta, recipeStory} from './__test_support';

type Role = Parameters<Page['getByRole']>[0];

export type SitePage = {
  readonly name: string;
  readonly path: string;
  readonly ready: Role;
  readonly loaded?: (page: Page) => Locator;
  readonly budgeted?: true;
};


export const pages: readonly SitePage[] = [
  {name: 'home', path: '', ready: 'navigation', budgeted: true},
  {name: 'demos', path: 'demos/?tab=accordions', ready: 'navigation', budgeted: true},
  {name: 'charts', path: 'demos/?tab=charts', ready: 'navigation', loaded: priceDelta},
  {
    name: 'tables',
    path: 'demos/?tab=tables',
    ready: 'navigation',
    loaded: page => page.getByRole('columnheader', {name: 'trades'}),
    budgeted: true
  },
  {
    name: 'tables in vanilla',
    path: 'demos/?tab=tables&world=vanilla',
    ready: 'navigation',
    loaded: page => page.getByTitle('the living table, in vanilla'),
    budgeted: true
  },
  {name: 'price chart tutorial', path: 'demos/charts/price/', ready: 'navigation', loaded: recipeStory},
  {name: 'candles chart tutorial', path: 'demos/charts/candles/', ready: 'navigation', loaded: recipeStory},
  {name: 'pressure chart tutorial', path: 'demos/charts/pressure/', ready: 'navigation', loaded: recipeStory},
  {name: 'pie chart tutorial', path: 'demos/charts/pie/', ready: 'navigation', loaded: recipeStory},
  {name: 'menu tutorial', path: 'demos/?tab=tables&tut=menu', ready: 'navigation', loaded: recipeStory, budgeted: true},
  {name: 'resize tutorial', path: 'demos/?tab=tables&tut=resize', ready: 'navigation', loaded: recipeStory, budgeted: true},
  {
    name: 'drag sort',
    path: 'demos/?tab=dragAndDrop',
    ready: 'navigation',
    loaded: page => page.getByRole('list', {name: 'sortable list'}).getByRole('listitem').first(),
    budgeted: true
  },
  {name: 'users', path: 'users/', ready: 'table', budgeted: true},
  {
    name: 'gallery',
    path: 'gallery/?tab=vam',
    ready: 'navigation',
    loaded: page => page.getByRole('figure').first(),
    budgeted: true
  },
  {name: 'games', path: 'games/', ready: 'main', budgeted: true},
  {name: 'three-in-a-row', path: 'games/colorGame', ready: 'main'},
  {name: 'no room', path: 'nowhere/', ready: 'navigation'}
];

export const budgeted = (): readonly SitePage[] => pages.filter(page => page.budgeted === true);
