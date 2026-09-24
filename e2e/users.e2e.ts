import {expect, test} from '@playwright/test';
import {looks, Person, usersPage} from './__test_support';
import {usersServerScript} from '../src/components/Users/resource/usersServer';

const ada: Person = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  born: '1815-12-10',
  street: '12 St James Square',
  city: 'London',
  state: 'NY',
  zip: '10001'
};

test("a new person's required fields carry a mark, and a viewed person's carry none", async ({page}) => {
  const users = usersPage(page);
  await page.goto('users');
  await expect(users.names.first()).toBeVisible({timeout: 30_000});

  await expect.poll(() => users.requiredMarkOn('First Name')).toBe('*');
  await users.viewFirst();

  await expect.poll(() => users.requiredMarkOn('First Name')).toBe('');
});

test("a new person's fields are lifted, and a viewed person's lie flat", async ({page}) => {
  const users = usersPage(page);
  await page.goto('users');
  await expect(users.names.first()).toBeVisible({timeout: 30_000});

  await expect.poll(() => users.liftOf('First Name')).toBe(await looks(page).resolved('box-shadow', '--light-box-shadow'));
  await users.viewFirst();

  await expect.poll(() => users.liftOf('First Name')).toBe('none');
});

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
  await expect(users.names).not.toHaveText(before);
});

test.describe('when the browser allows no service workers', () => {
  test.use({serviceWorkers: 'block'});

  test('the users page still says the users could not be reached', async ({page}) => {
    await page.goto('users');

    await expect(page.getByRole('alert')).toContainText('the users could not be reached', {timeout: 30_000});
  });
});

test('a users page reloaded past its worker is taken back by it', async ({page, browserName}) => {
  test.skip(browserName !== 'chromium', 'only Chromium offers a reload that leaves the page uncontrolled while its worker stays active, so Firefox and WebKit hold no pin for the reclaim');
  const users = usersPage(page);
  await page.goto('users');
  await expect(users.names.first()).toBeVisible({timeout: 30_000});

  await users.reloadPastItsWorker();

  await expect(users.names.first()).toBeVisible({timeout: 30_000});
});

test('the users page gives up on a worker script that never answers and says the users could not be reached', async ({page, browserName}) => {
  test.skip(browserName !== 'webkit', 'only WebKit lets a route hold a worker script unanswered, so Chromium and Firefox hold no pin for the deadline on registration');
  await page.route(`**/${usersServerScript}`, () => new Promise(() => undefined));

  await page.goto('users', {waitUntil: 'commit'});

  await expect(page.getByRole('alert')).toContainText('the users could not be reached', {timeout: 30_000});
});
