import {expect, type Page} from '@playwright/test';
import {accordions, dialRow, pillSwitch, pressTab, type Part, siteFrame} from './__test_support';
import {everyBuildJourneys, openAndCloseJourneys, test} from './__test_support/fold-journeys';

test('opening a second details fold closes the first, from the keyboard too', async ({page}) => {
  await page.goto(accordions.showing('the details build'));
  const [first, second] = [accordions.tab(page).partOf('the details build', 0), accordions.tab(page).partOf('the details build', 1)];
  await first.open();
  await expect.poll(first.showsText).toBe(true);

  await second.openByKeyboard();

  await expect.poll(second.showsText).toBe(true);
  await expect.poll(first.showsText).toBe(false);
});

test('a second press on the open fold of the details build closes it', async ({page}) => {
  await page.goto(accordions.showing('the details build'));
  const fold = accordions.tab(page).partOf('the details build', 1);
  await fold.open();
  await expect.poll(fold.showsText).toBe(true);

  await fold.close();

  await expect.poll(fold.showsText).toBe(false);
});

for (const build of ['the checkbox build', 'the inclusive details build'] as const) {
  test(`a reader opens two parts of ${build} and both stay open`, async ({page}) => {
    await page.goto(accordions.showing(build));
    const [first, second] = [accordions.tab(page).partOf(build, 0), accordions.tab(page).partOf(build, 1)];
    await first.open();
    await expect.poll(first.showsText).toBe(true);

    await second.open();

    await expect.poll(second.showsText).toBe(true);
    await expect.poll(first.showsText).toBe(true);
  });
}

test('a keyboard reader moves through the radio build from its first fold to its second', async ({page}) => {
  await page.goto(accordions.showing('the radio build'));
  const [first, second] = [accordions.tab(page).partOf('the radio build', 0), accordions.tab(page).partOf('the radio build', 1)];
  await expect(second.fold).toBeVisible();
  await first.openByKeyboard();
  await expect.poll(first.showsText).toBe(true);

  await second.openByKeyboard();

  await expect.poll(second.showsText).toBe(true);
  await expect.poll(first.showsText).toBe(false);
});

test('a link to the inclusive type opens the tab on it, and it stays after a reload', async ({page}) => {
  await page.goto('demos/accordions/?type=inclusive');
  const inclusive = page.getByRole('group', {name: 'fold type'}).getByRole('radio', {name: 'Inclusive'});
  await expect(inclusive).toBeChecked();

  await page.reload();

  await expect(inclusive).toBeChecked();
});

const tabsIntoItsText = async (page: Page, open: Part): Promise<void> => {
  const openName = await accordions.nameOn(open.fold).textContent() ?? '';
  await open.openByKeyboard();
  await expect.poll(open.showsText).toBe(true);

  await pressTab(page);
  await expect(open.fold.getByRole('region', {name: openName, exact: true})).toBeFocused();
};

test('a keyboard reader tabs from an open part\'s bar into its text and past a closed part', async ({page}) => {
  await page.goto(accordions.showing('the checkbox build'));
  const tab = accordions.tab(page);
  const [open, closed, next] = [tab.partOf('the checkbox build', 0), tab.partOf('the checkbox build', 1), tab.partOf('the checkbox build', 2)];
  await tabsIntoItsText(page, open);

  await pressTab(page);
  await expect(closed.fold.getByRole('checkbox')).toBeFocused();
  await pressTab(page);
  await expect(next.fold.getByRole('checkbox')).toBeFocused();
});

test('a keyboard reader tabs from an open radio part into its text and past the closed parts\' text', async ({page}) => {
  await page.goto(accordions.showing('the radio build'));
  const open = accordions.tab(page).partOf('the radio build', 0);
  await tabsIntoItsText(page, open);

  await pressTab(page);

  await expect.poll(() => accordions.tab(page).holdsFocus('the radio build')).toBe(false);
});

everyBuildJourneys(accordions.builds);
openAndCloseJourneys(['the checkbox build', 'the radio build']);

test('with exclusive chosen, opening a second fold of the accordion in HTML alone closes the first', async ({page}) => {
  await page.goto('demos/accordions/?type=exclusive');
  await siteFrame(page).hydrated();
  const [cinder, meadow] = [accordions.tab(page).htmlAloneFold('cinder'), accordions.tab(page).htmlAloneFold('meadow')];

  await cinder.open();
  await meadow.open();

  await expect.poll(meadow.isOpen).toBe(true);
  await expect.poll(cinder.isOpen).toBe(false);
});

test('with inclusive chosen, the accordion in HTML alone keeps two folds open', async ({page}) => {
  await page.goto('demos/accordions/?type=inclusive');
  await siteFrame(page).hydrated();
  const [cinder, meadow] = [accordions.tab(page).htmlAloneFold('cinder'), accordions.tab(page).htmlAloneFold('meadow')];

  await cinder.open();
  await meadow.open();

  await expect.poll(cinder.isOpen).toBe(true);
  await expect.poll(meadow.isOpen).toBe(true);
});

test('a fold of the accordion in HTML alone opens by pointer and closes by keyboard', async ({page}) => {
  await page.goto('demos/accordions/');
  const fold = accordions.tab(page).htmlAloneFold('cinder');
  await expect.poll(fold.showsText).toBe(false);

  await fold.open();
  await expect.poll(fold.showsText).toBe(true);
  await fold.closeByKeyboard();

  await expect.poll(fold.showsText).toBe(false);
});

test('the accordion in HTML alone opens on its first fold', async ({page}) => {
  await page.goto('demos/accordions/');
  const [basalt, cinder] = [accordions.tab(page).htmlAloneFold('basalt'), accordions.tab(page).htmlAloneFold('cinder')];

  await expect.poll(basalt.showsText).toBe(true);
  await expect.poll(cinder.showsText).toBe(false);
});

test('a reader picks Inclusive in the exhibit’s foot, and two folds of the accordion in HTML alone stay open', async ({page}) => {
  await page.goto('demos/accordions/');
  const tab = accordions.tab(page);
  const [cinder, meadow] = [tab.htmlAloneFold('cinder'), tab.htmlAloneFold('meadow')];

  await tab.choosesTheFoldTypeInTheExhibit('Inclusive');
  await cinder.open();
  await meadow.open();

  await expect.poll(cinder.isOpen).toBe(true);
  await expect.poll(meadow.isOpen).toBe(true);
});

test('the Accordions tab’s own page offers no fold motion, which its accordion would not follow', async ({page}) => {
  await page.goto('demos/accordions/');
  await siteFrame(page).hydrated();

  await expect(page.getByRole('group', {name: 'fold motion', exact: true, includeHidden: true})).toHaveCount(0);
});

const lessMotion = 'If your system asks for less motion, every fold here opens at once, whichever you choose.';

const theFoldChoiceShowsItsName = async (page: Page, name: string, address: string): Promise<void> => {
  await page.goto(address);
  const {row, shownNames} = dialRow(page, name);

  await row.scrollIntoViewIfNeeded();

  await expect(shownNames.filter({visible: true}).first(), name).toHaveText(name);
  await expect(row).toMatchAriaSnapshot(`
    - listitem:
      - /children: equal
      - group "${name}"
      - status
  `);
};

test.describe('the fold choices', {tag: ['@iPhone', '@desktop']}, () => {
  test('the fold type choice shows its name, and a screen reader meets its named pills first, then the reading', ({page}) =>
    theFoldChoiceShowsItsName(page, 'fold type', 'demos/accordions/'));

  test('the fold motion choice shows its name, and a screen reader meets its named pills first, then the reading', ({page}) =>
    theFoldChoiceShowsItsName(page, 'fold motion', 'demos/accordions/the-measured-height/'));

  test('the fold motion on a part’s page reads the chosen pill, and reads that no fold moves once the reader asks for less motion', async ({page}) => {
    await page.emulateMedia({reducedMotion: 'no-preference'});
    await page.goto('demos/accordions/the-measured-height/?style=drawer');
    const {reading} = dialRow(page, 'fold motion');
    await reading.scrollIntoViewIfNeeded();

    await expect(reading).toHaveText('The text slides down from under its bar.', {useInnerText: true});
    await expect(reading).toMatchAriaSnapshot('- status: The text slides down from under its bar.');

    await page.emulateMedia({reducedMotion: 'reduce'});

    await expect(reading).toHaveText(lessMotion, {useInnerText: true});
    await expect(reading).toMatchAriaSnapshot(`- status: ${lessMotion}`);
  });
});

test.describe('a reader with script turned off', () => {
  test.use({javaScriptEnabled: false});

  test('opens a fold of the details build on what the platform gives now and reads its words', async ({page}) => {
    await page.goto('demos/accordions/what-the-platform-gives-now/');
    const fold = accordions.tab(page).partOf('the details build', 0);

    await expect(fold.words).toBeHidden();

    await fold.open();

    await expect(fold.words).toBeVisible();
  });
});

test('a reader follows part one from the tab\'s list of parts to its exhibit on the tab', async ({page}) => {
  await page.goto('demos/accordions/');

  await page.getByRole('navigation', {name: 'Parts', exact: true}).getByRole('link', {name: 'An accordion in HTML alone'}).click();

  await expect(page).toHaveURL(/#html-alone-heading$/);
});

test('a reader sets the fold type in the exhibit’s foot to inclusive, follows part four, and its page shows inclusive', async ({page}) => {
  await page.goto('demos/accordions/');

  await pillSwitch(page, 'fold type').choose('Inclusive');
  await page.getByRole('navigation', {name: 'Parts', exact: true}).getByRole('link', {name: 'The measured height'}).click();

  await expect(accordions.tab(page).partTitle('The measured height')).toBeVisible();
  await expect.poll(pillSwitch(page, 'fold type').chosen).toBe('Inclusive');
});
