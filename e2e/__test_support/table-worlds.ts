import type {FrameLocator, Locator, Page} from '@playwright/test';
import {dragSortTable} from './drag-sort';
import {assertionPatience} from './patience';

export type Stage = {name: string; at: string; holder: (page: Page) => Locator | FrameLocator};

const tablesCard = (page: Page) => {
  const card = page.getByRole('region', {name: 'live aggregations'});
  const vanillaFrame = card.getByTitle('the living table, in vanilla').contentFrame();
  return {
    card,
    vanillaFrame,
    ownTables: card.getByRole('table'),
    vanillaTable: vanillaFrame.getByRole('table')
  };
};

const stages: readonly Stage[] = [
  {name: 'react', at: '/ChosenPicachu/demos/tables/?world=react', holder: page => tablesCard(page).card},
  {name: 'vanilla', at: '/ChosenPicachu/demos/tables/?world=vanilla', holder: page => tablesCard(page).vanillaFrame}
];

const stagesWith = (dials: string): readonly Stage[] =>
  stages.map(stage => ({...stage, name: `${stage.name}, ${dials}`, at: `${stage.at}&${dials}`}));

const opened = async (page: Page, {at, holder}: Pick<Stage, 'at' | 'holder'>) => {
  await page.goto(at);
  const table = dragSortTable(page, holder(page));
  await table.columnHeader('trades').waitFor({timeout: assertionPatience});
  return table;
};

export const tableWorlds = {
  stages,
  stagesWith,
  card: tablesCard,
  opened
};
