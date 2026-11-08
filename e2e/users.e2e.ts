import {expect, type Page} from '@playwright/test';
import {test} from './__test_support/journey';
import {dragSortTable, iPadSplitView, iPhone, Person, usersPage} from './__test_support';
import {usersServer} from '../src/pages/Users/usersServer';

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

test('a person in the roster drags to a new seat once the roster has arrived, and the move is said by name', async ({page}) => {
  const users = usersPage(page);
  await page.goto('users');
  await expect(users.names.first()).toBeVisible({timeout: 30_000});
  const roster = dragSortTable(page, page.getByRole('region', {name: 'User Candidates'}));
  const [first, second, third, ...rest] = await roster.rowOrder();
  await roster.listenToTheMoveReport();

  await roster.dragRowPast(1, new RegExp(RegExp.escape(third)));

  await expect.poll(() => roster.rowOrder()).toEqual([second, third, first, ...rest]);
  await expect.poll(() => roster.whatTheMoveReportSaid()).toEqual([`${first} moved to 3 of ${rest.length + 3}`]);
});

test('following View in a row\'s actions closes the actions and shows that person in the form', async ({page}) => {
  const users = usersPage(page);
  await page.goto('users');
  await expect(users.names.first()).toBeVisible({timeout: 30_000});
  const viewed = await users.names.first().textContent();

  await users.viewTheFirstRow();

  await expect(await users.actionsOf()).toBeHidden();
  await expect.poll(() => users.shownName()).toBe(viewed);
});

test('editing a person and going Back shows that person as stored', async ({page}) => {
  const users = usersPage(page);
  await page.goto('users');
  await expect(users.names.first()).toBeVisible({timeout: 30_000});
  const stored = await users.names.first().textContent();
  await users.viewTheFirstRow();
  await users.editTheShownPerson();
  await users.firstName.fill('Unsaved');

  await page.goBack();

  await expect.poll(() => users.shownName()).toBe(stored);
});

const aFingerLandsOnTheStateChoice = async (page: Page, end: 'start' | 'end'): Promise<void> => {
  const users = usersPage(page);
  await page.goto('users');
  await expect(users.homeState).toBeVisible();

  await users.tapTheHomeStateAt(end);

  await expect(users.homeState).toBeFocused();
};

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

    test('a finger at the start of the State choice\'s box lands on the State choice', ({page}) => aFingerLandsOnTheStateChoice(page, 'start'));

    test('a finger at the end of the State choice\'s box lands on the State choice', ({page}) => aFingerLandsOnTheStateChoice(page, 'end'));
  });
}

test.describe('when the browser allows no service workers', () => {
  test.use({serviceWorkers: 'block'});

  test('the users page still says the users server could not be reached', async ({page}) => {
    await page.goto('users');

    await expect(page.getByRole('alert')).toContainText('the users server could not be reached', {timeout: 30_000});
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

test('the users page gives up on a worker script that never answers and says the users server could not be reached', async ({page, browserName}) => {
  test.skip(browserName !== 'webkit', 'only WebKit lets a route hold a worker script unanswered, so Chromium and Firefox hold no pin for the deadline on registration');
  await page.route(`**/${usersServer.script}`, () => new Promise(() => undefined));

  await page.goto('users', {waitUntil: 'commit'});

  await expect(page.getByRole('alert')).toContainText('the users server could not be reached', {timeout: 30_000});
});
