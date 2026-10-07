import {expect, test} from '@playwright/test';
import {iPadSplitView, iPhone, Person, usersPage} from './__test_support';
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

test('a new person cannot be added without a first name', async ({page}) => {
  const users = usersPage(page);
  await page.goto('users');
  await expect(users.names.first()).toBeVisible({timeout: 30_000});

  await users.add({...ada, firstName: ''});

  await expect.poll(() => users.firstName.evaluate(field => field.matches(':invalid'))).toBe(true);
  await expect(users.names.filter({hasText: ada.lastName})).toHaveCount(0);
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

const handhelds = [
  {reader: 'an iPhone', device: iPhone},
  {reader: 'an iPad in split view', device: iPadSplitView}
];

for (const {reader, device} of handhelds) {
  test.describe(reader, () => {
    test.use(device);

    test('scrolling the roster sideways reaches its last column', async ({page}) => {
      const users = usersPage(page);
      await page.goto('users');
      await expect(users.names.first()).toBeVisible({timeout: 30_000});

      await users.scrollRosterSideways();

      await expect(users.columns.last()).toBeInViewport({ratio: 0.5});
    });

    for (const end of ['start', 'end'] as const) {
      test(`a finger at the ${end} of the State choice's box lands on the State choice`, async ({page}) => {
        const users = usersPage(page);
        await page.goto('users');
        await expect(users.homeState).toBeVisible();

        await users.tapTheHomeStateAt(end);

        await expect(users.homeState).toBeFocused();
      });
    }
  });
}

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
