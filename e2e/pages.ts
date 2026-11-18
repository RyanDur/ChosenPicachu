import type {Locator, Page} from '@playwright/test';
import {chartsPage, demosPage} from './__test_support';

type Role = Parameters<Page['getByRole']>[0];

export type SitePage = {
  readonly name: string;
  readonly path: string;
  readonly ready: Role;
  readonly loaded?: (page: Page) => Locator;
  readonly budgeted?: true;
};

export const pages: readonly SitePage[] = [
  {name: 'home', path: '', ready: 'main', budgeted: true},
  {name: 'record', path: 'record/', ready: 'main', budgeted: true},
  {name: 'practice structure', path: 'practice/structure/', ready: 'main', budgeted: true},
  {name: 'practice presentation', path: 'practice/presentation/', ready: 'main', budgeted: true},
  {name: 'practice behavior', path: 'practice/behavior/', ready: 'main', budgeted: true},
  {name: 'demos', path: 'demos/accordions/', ready: 'main', budgeted: true},
  {name: 'demos, inclusive folds', path: 'demos/accordions/?type=inclusive', ready: 'main'},
  {name: 'a box remembers the fold', path: 'demos/accordions/a-box-remembers-the-fold/', ready: 'main', budgeted: true},
  {name: 'the max-height guess', path: 'demos/accordions/the-max-height-guess/', ready: 'main', budgeted: true},
  {name: 'the measured height', path: 'demos/accordions/the-measured-height/', ready: 'main', budgeted: true},
  {name: 'what the platform gives now', path: 'demos/accordions/what-the-platform-gives-now/', ready: 'main', budgeted: true},
  {name: 'how a sliding fold moves', path: 'demos/accordions/how-a-sliding-fold-moves/', ready: 'main', budgeted: true},
  {name: 'z-index', path: 'demos/z-index/', ready: 'main', budgeted: true},
  {name: 'why Third is on top', path: 'demos/z-index/why-third-is-on-top/', ready: 'main', budgeted: true},
  {name: 'why 9999 still loses', path: 'demos/z-index/why-9999-still-loses/', ready: 'main', budgeted: true},
  {name: 'what else forms a stacking context', path: 'demos/z-index/what-else-forms-a-stacking-context/', ready: 'main', budgeted: true},
  {name: 'why the popover wins', path: 'demos/z-index/why-the-popover-wins/', ready: 'main', budgeted: true},
  {name: 'why a fixed banner still loses', path: 'demos/z-index/why-a-fixed-banner-still-loses/', ready: 'main', budgeted: true},
  {name: 'let’s build this feature', path: 'demos/z-index/lets-build-this-feature/', ready: 'main', budgeted: true},
  {name: 'charts', path: 'demos/charts/', ready: 'main', loaded: page => chartsPage(page).priceDelta},
  {
    name: 'tables',
    path: 'demos/tables/',
    ready: 'main',
    loaded: page => page.getByRole('region', {name: 'live aggregations'}).getByRole('columnheader', {name: 'trades'}),
    budgeted: true
  },
  {
    name: 'the need and its clues',
    path: 'demos/tables/the-need-and-its-clues/',
    ready: 'main',
    loaded: page => page.getByRole('region', {name: 'live aggregations'}).getByRole('columnheader', {name: 'trades'}),
    budgeted: true
  },
  {
    name: 'the sketch',
    path: 'demos/tables/the-sketch/',
    ready: 'main',
    loaded: page => page.getByRole('region', {name: 'live aggregations'}).getByRole('columnheader', {name: 'trades'}),
    budgeted: true
  },
  {
    name: 'the slices',
    path: 'demos/tables/the-slices/',
    ready: 'main',
    loaded: page => page.getByRole('region', {name: 'live aggregations'}).getByRole('columnheader', {name: 'trades'}),
    budgeted: true
  },
  {
    name: 'the still table',
    path: 'demos/tables/the-still-table/',
    ready: 'main',
    loaded: page => page.getByRole('region', {name: 'live aggregations'}).getByRole('columnheader', {name: 'trades'}),
    budgeted: true
  },
  {
    name: 'the live table and the store',
    path: 'demos/tables/the-live-table-and-the-store/',
    ready: 'main',
    loaded: page => page.getByRole('region', {name: 'live aggregations'}).getByRole('columnheader', {name: 'trades'}),
    budgeted: true
  },
  {
    name: 'tables in vanilla',
    path: 'demos/tables/?world=vanilla',
    ready: 'main',
    loaded: page => page.getByTitle('the living table, in vanilla'),
    budgeted: true
  },
  {name: 'price chart tutorial', path: 'demos/charts/price/', ready: 'main', loaded: page => demosPage(page).recipeStory},
  {name: 'candles chart tutorial', path: 'demos/charts/candles/', ready: 'main', loaded: page => demosPage(page).recipeStory},
  {name: 'pressure chart tutorial', path: 'demos/charts/pressure/', ready: 'main', loaded: page => demosPage(page).recipeStory},
  {name: 'pie chart tutorial', path: 'demos/charts/pie/', ready: 'main', loaded: page => demosPage(page).recipeStory},
  {name: 'sort tutorial', path: 'demos/tables/sort/', ready: 'main', loaded: page => demosPage(page).recipeStory, budgeted: true},
  {name: 'menu tutorial', path: 'demos/tables/menu/', ready: 'main', loaded: page => demosPage(page).recipeStory, budgeted: true},
  {name: 'resize tutorial', path: 'demos/tables/resize/', ready: 'main', loaded: page => demosPage(page).recipeStory, budgeted: true},
  {
    name: 'drag sort',
    path: 'demos/drag-and-drop/',
    ready: 'main',
    loaded: page => page.getByRole('list', {name: 'sortable list'}).getByRole('listitem').first(),
    budgeted: true
  },
  {name: 'users', path: 'users/', ready: 'table', budgeted: true},
  {
    name: 'gallery',
    path: 'gallery/?tab=vam',
    ready: 'main',
    loaded: page => page.getByRole('figure').first(),
    budgeted: true
  },
  {name: 'games', path: 'games/', ready: 'main', budgeted: true},
  {name: 'no room', path: 'nowhere/', ready: 'main'}
];

export const budgeted = (): readonly SitePage[] => pages.filter(page => page.budgeted === true);
