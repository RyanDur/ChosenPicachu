import {expect, test} from '@playwright/test';
import {Person, usersPage} from './__test_support';

const ada: Person = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  born: '1815-12-10',
  street: '12 St James Square',
  city: 'London',
  state: 'NY',
  zip: '10001'
};

test('a person added on the users page still stands in the roster after leaving and coming back', async ({page}) => {
  const users = usersPage(page);
  await page.goto('users');
  await expect(users.names.first()).toBeVisible({timeout: 30_000});

  await users.add(ada);
  await expect(users.rowOf(ada)).toBeVisible();
  await users.leaveAndComeBack();

  await expect(users.rowOf(ada)).toBeVisible({timeout: 30_000});
});

test('a refresh brings new people to the users page', async ({page}) => {
  const users = usersPage(page);
  await page.goto('users');
  await expect(users.names.first()).toBeVisible({timeout: 30_000});
  const before = await users.names.allTextContents();

  await page.reload();

  await expect(users.names.first()).toBeVisible({timeout: 30_000});
  expect(await users.names.allTextContents()).not.toEqual(before);
});
