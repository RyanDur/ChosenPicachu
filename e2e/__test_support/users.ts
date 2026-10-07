import type {Page} from '@playwright/test';

export type Person = {
  readonly firstName: string;
  readonly lastName: string;
  readonly born: string;
  readonly street: string;
  readonly city: string;
  readonly state: string;
  readonly zip: string;
};

export const usersPage = (page: Page) => {
  const form = page.getByRole('form', {name: 'User Information'});
  const home = form.getByRole('group', {name: /^home address$/i});
  const site = page.getByRole('navigation', {name: 'site'});
  const names = page.getByRole('table').getByRole('rowheader');
  const roster = page.getByRole('region', {name: 'User Candidates'});
  const columns = roster.getByRole('columnheader');
  const firstRowActions = page.getByRole('button', {name: /^Actions for /}).first();
  const homeState = home.getByLabel(/^State/);
  return {
    sameAsHome: form.getByRole('checkbox', {name: 'Same as Home'}),
    names,
    firstRowActions,
    actionsOf: async (toggle = firstRowActions) => page.getByLabel(`${await toggle.getAttribute('aria-label')}, chosen`),
    homeState,
    tapTheHomeStateAt: async (end: 'start' | 'end'): Promise<void> => {
      const box = await homeState.boundingBox();
      if (box === null) throw new Error('the home address has no State choice');
      await page.touchscreen.tap(end === 'start' ? box.x + 4 : box.x + box.width - 4, box.y + box.height / 2);
    },
    columns,
    scrollRosterSideways: async (): Promise<void> => {
      await columns.first().hover();
      await page.mouse.wheel(3000, 0);
    },
    rowOf: ({firstName, lastName}: Person) => page.getByRole('rowheader', {name: `${firstName} ${lastName}`}),
    firstName: form.getByLabel('First Name'),
    add: async ({firstName, lastName, born, street, city, state, zip}: Person): Promise<void> => {
      await form.getByLabel('First Name').fill(firstName);
      await form.getByLabel('Last Name').fill(lastName);
      await form.getByLabel('Date Of Birth').fill(born);
      await home.getByLabel('Street', {exact: true}).fill(street);
      await home.getByLabel('City').fill(city);
      await home.getByLabel('State').selectOption(state);
      await home.getByLabel('Postal / Zip code').fill(zip);
      await form.getByRole('checkbox', {name: 'Same as Home'}).check();
      await form.getByRole('button', {name: 'Add'}).click();
    },
    leaveAndComeBack: async (): Promise<void> => {
      await site.getByRole('link', {name: 'Home'}).click();
      await site.getByRole('link', {name: 'Users'}).click();
    },
    reloadPastItsWorker: async (): Promise<void> => {
      const devtools = await page.context().newCDPSession(page);
      await Promise.all([page.waitForEvent('load'), devtools.send('Page.reload', {ignoreCache: true})]);
    }
  };
};
