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
  return {
    names,
    rowOf: ({firstName, lastName}: Person) => page.getByRole('rowheader', {name: `${firstName} ${lastName}`}),
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
    }
  };
};
