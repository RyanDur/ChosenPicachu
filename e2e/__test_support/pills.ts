import type {Locator, Page} from '@playwright/test';
import {assertionPatience} from './patience';
import {demoSettings} from './demo-settings';
import {fingerTap} from './finger';
import {siteFrame} from './site';

export const pillSwitch = (page: Page, name: string) => {
  const group = page.getByRole('group', {name, exact: true}).first();
  return {
    choose: async (pill: string): Promise<void> => {
      await siteFrame(page).hydrated();
      await group.getByText(pill, {exact: true}).click();
    },
    pill: (name: string): Locator => group.getByRole('radio', {name, exact: true, includeHidden: true}),
    wordsOf: (pill: string): Locator => group.getByText(pill, {exact: true}).first(),
    names: async (): Promise<string[]> => [...(await group.ariaSnapshot()).matchAll(/radio "([^"]+)"/g)].map(([, name]) => name),
    chosen: async (): Promise<string> => /radio "([^"]+)" \[checked\]/.exec(await group.ariaSnapshot())?.[1] ?? ''
  };
};

export const dialRow = (page: Page, name: string) => {
  const pills = page.getByRole('group', {name, exact: true}).last();
  const row = page.getByRole('listitem').filter({has: pills}).last();
  return {row, reading: row.getByRole('status'), shownNames: row.getByText(name, {exact: true})};
};

const shownGroup = async (page: Page, group: string): Promise<void> => {
  const hidden = page.getByRole('group', {name: group, exact: true, includeHidden: true}).first();
  await hidden.getByRole('radio', {includeHidden: true}).first().waitFor({state: 'attached'});
  if (await hidden.isHidden()) await demoSettings(page).press();
};

const chosenWithinAMoment = (page: Page, group: string, name: string): Promise<boolean> => page.getByRole('group', {name: group, exact: true}).first()
  .getByRole('radio', {name, exact: true, checked: true, includeHidden: true})
  .waitFor({state: 'attached', timeout: assertionPatience})
  .then(() => true, () => false);

export const pillsAFingerCannotChoose = async (page: Page, group: string): Promise<string[]> => {
  await shownGroup(page, group);
  const pills = pillSwitch(page, group);
  const [names, startedOn] = [await pills.names(), await pills.chosen()];
  const unchosen: string[] = names.length < 2 ? ['fewer than two pills'] : [];
  const eachTapMovesTheChoice = [...names.filter(name => name !== startedOn), startedOn];

  for (const name of eachTapMovesTheChoice) {
    await fingerTap(page, pills.wordsOf(name));
    if (!await chosenWithinAMoment(page, group, name)) unchosen.push(name);
  }
  return unchosen;
};
