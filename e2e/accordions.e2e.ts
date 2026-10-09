import {expect} from '@playwright/test';
import {
  accordionsTab,
  builds,
  controlWord,
  desktop,
  dialRow,
  heightOnceSettled,
  iPhone,
  pressTab,
  nameOn,
  showing,
  tabsTo,
  textOf
} from './__test_support';
import {everyBuildJourneys, test} from './__test_support/fold-journeys';

test('opening a second details fold closes the first, from the keyboard too', async ({page}) => {
  await page.goto(showing('the details build'));
  const [first, second] = [accordionsTab(page).partOf('the details build', 0), accordionsTab(page).partOf('the details build', 1)];
  await first.open();
  await expect.poll(first.showsText).toBe(true);

  await second.openByKeyboard();

  await expect.poll(second.showsText).toBe(true);
  await expect.poll(first.showsText).toBe(false);
});

for (const build of ['the grid checkbox build', 'the grid radio build'] as const) {
  test(`a closed fold in ${build} shows only its bar`, async ({page}) => {
    await page.goto(showing(build));
    await expect(accordionsTab(page).firstPartOf(build).fold).toBeVisible();
    const parts = await accordionsTab(page).partsOf(build);

    for (const part of parts) {
      await expect(textOf(part)).toBeAttached();
      await expect.poll(part.showsText).toBe(false);
    }
  });
  test(`an open fold in ${build} shows its text`, async ({page}) => {
    await page.goto(showing(build));
    const part = accordionsTab(page).firstPartOf(build);

    await part.open();

    await expect.poll(part.isOpen).toBe(true);
    await expect.poll(part.showsText).toBe(true);
  });
}

for (const build of ['the checkbox build', 'the inclusive details build', 'the grid checkbox build'] as const) {
  test(`a reader opens two parts of ${build} and both stay open`, async ({page}) => {
    await page.goto(showing(build));
    const [first, second] = [accordionsTab(page).partOf(build, 0), accordionsTab(page).partOf(build, 1)];
    await first.open();
    await expect.poll(first.showsText).toBe(true);

    await second.open();

    await expect.poll(second.showsText).toBe(true);
    await expect.poll(first.showsText).toBe(true);
  });
}

for (const build of ['the radio build', 'the grid radio build'] as const) {
  test(`a keyboard reader moves through ${build} from its first fold to its second`, async ({page}) => {
    await page.goto(showing(build));
    const [first, second] = [accordionsTab(page).partOf(build, 0), accordionsTab(page).partOf(build, 1)];
    await expect(second.fold).toBeVisible();
    await first.openByKeyboard();
    await expect.poll(first.showsText).toBe(true);

    await second.openByKeyboard();

    await expect.poll(second.showsText).toBe(true);
    await expect.poll(first.showsText).toBe(false);
  });
}

test('the space bar closes the open part of the grid radio build', async ({page}) => {
  await page.goto(showing('the grid radio build'));
  const part = accordionsTab(page).firstPartOf('the grid radio build');
  await part.openByKeyboard();
  await expect.poll(part.isOpen).toBe(true);

  await page.keyboard.press('Space');

  await expect.poll(part.isOpen).toBe(false);
});

for (const {build, control} of [
  {build: 'the grid checkbox build', control: 'checkbox'},
  {build: 'the grid radio build', control: 'radio'}
] as const) {
  test(`the control of ${build} is named by the word it shows and its part, and checked while the part is open`, async ({page}) => {
    await page.goto(showing(build));
    const part = accordionsTab(page).firstPartOf(build);
    const name = await nameOn(part.fold).textContent() ?? '';
    await expect(part.fold.getByRole(control, {name: `Open ${name}`, exact: true})).not.toBeChecked();

    await part.open();

    await expect(part.fold.getByRole(control, {name: `Close ${name}`, exact: true})).toBeChecked();
  });

  test(`a keyboard reader reaches the first control of ${build} by Tab, named by its word and its part, and Space works it`, async ({page}) => {
    await page.goto(showing(build));
    const part = accordionsTab(page).firstPartOf(build);
    const name = await nameOn(part.fold).textContent() ?? '';
    await tabsTo(page, part.fold.getByRole(control));
    await expect(part.fold.getByRole(control, {name: `Open ${name}`, exact: true})).toBeFocused();

    await page.keyboard.press('Space');

    await expect(part.fold.getByRole(control, {name: `Close ${name}`, exact: true})).toBeChecked();
    await expect.poll(part.showsText).toBe(true);
  });
}

test('a link to the exclusive type opens the tab on it, and it stays after a reload', async ({page}) => {
  await page.goto('demos/?tab=accordions&type=exclusive');
  const exclusive = page.getByRole('group', {name: 'fold type'}).getByRole('radio', {name: 'Exclusive'});
  await expect(exclusive).toBeChecked();

  await page.reload();

  await expect(exclusive).toBeChecked();
  await expect(page.getByRole('heading', {name: 'Accordion using a radio group and a known height'})).toBeVisible();
});

test('the space bar closes a part of the grid radio build the arrow keys opened', async ({page}) => {
  await page.goto(showing('the grid radio build'));
  const [first, second] = [accordionsTab(page).partOf('the grid radio build', 0), accordionsTab(page).partOf('the grid radio build', 1)];
  await first.openByKeyboard();
  await page.keyboard.press('ArrowDown');
  await expect.poll(second.isOpen).toBe(true);

  await page.keyboard.press('Space');

  await expect.poll(second.isOpen).toBe(false);
  await expect.poll(first.isOpen).toBe(false);
});

test('a keyboard reader tabs from an open part\'s bar into its text and past a closed part', async ({page}) => {
  await page.goto(showing('the checkbox build'));
  const tab = accordionsTab(page);
  const [open, closed, next] = [tab.partOf('the checkbox build', 0), tab.partOf('the checkbox build', 1), tab.partOf('the checkbox build', 2)];
  const openName = await nameOn(open.fold).textContent() ?? '';
  await open.openByKeyboard();
  await heightOnceSettled(open.fold);

  await pressTab(page);
  await expect(open.fold.getByRole('region', {name: openName, exact: true})).toBeFocused();
  await pressTab(page);
  await expect(closed.fold.getByRole('checkbox')).toBeFocused();
  await pressTab(page);
  await expect(next.fold.getByRole('checkbox')).toBeFocused();
});

test('a keyboard reader tabs from an open radio part into its text and past the closed parts\' text', async ({page}) => {
  await page.goto(showing('the radio build'));
  const open = accordionsTab(page).partOf('the radio build', 0);
  const openName = await nameOn(open.fold).textContent() ?? '';
  await open.openByKeyboard();
  await heightOnceSettled(open.fold);

  await pressTab(page);
  await expect(open.fold.getByRole('region', {name: openName, exact: true})).toBeFocused();
  await pressTab(page);

  await expect.poll(() => accordionsTab(page).holdsFocus('the radio build')).toBe(false);
});

everyBuildJourneys(builds);

test('the accordion in HTML alone keeps two folds open with exclusive and static chosen', async ({page}) => {
  await page.goto('demos/?tab=accordions&type=exclusive&style=static');
  const [basalt, cinder] = [accordionsTab(page).htmlAloneFold('basalt'), accordionsTab(page).htmlAloneFold('cinder')];

  await basalt.open();
  await cinder.open();

  await expect.poll(basalt.isOpen).toBe(true);
  await expect.poll(cinder.isOpen).toBe(true);
});

test('a fold of the accordion in HTML alone opens by pointer and closes by keyboard', async ({page}) => {
  await page.goto('demos/?tab=accordions');
  const fold = accordionsTab(page).htmlAloneFold('basalt');
  await expect.poll(fold.showsText).toBe(false);

  await fold.open();
  await expect.poll(fold.showsText).toBe(true);
  await fold.closeByKeyboard();

  await expect.poll(fold.showsText).toBe(false);
});

for (const {reader, device} of [{reader: 'a desktop', device: desktop}, {reader: 'a phone', device: iPhone}]) {
  test.describe(reader, () => {
    test.use(device);

    for (const build of ['the grid checkbox build', 'the grid radio build'] as const) {
      test(`a press on a part's name in ${build} leaves its fold shut`, async ({page}) => {
        await page.goto(showing(build));
        const part = accordionsTab(page).firstPartOf(build);

        await nameOn(part.fold).click();

        await expect.poll(part.isOpen).toBe(false);
        await expect.poll(part.showsText).toBe(false);
      });

      test(`a press on Open in ${build} opens the fold and shows Close, and Close shuts it again`, async ({page}) => {
        await page.goto(showing(build));
        const part = accordionsTab(page).firstPartOf(build);
        await controlWord(part.fold, 'Open').click();
        await expect.poll(part.showsText).toBe(true);
        await expect(controlWord(part.fold, 'Open')).toBeHidden();

        await controlWord(part.fold, 'Close').click();

        await expect.poll(part.showsText).toBe(false);
        await expect(controlWord(part.fold, 'Open')).toBeVisible();
      });
    }
  });
}

for (const {reader, device} of [{reader: 'a desktop', device: desktop}, {reader: 'a phone', device: iPhone}]) {
  test.describe(reader, () => {
    test.use(device);

    test('each fold choice shows its name, and a screen reader meets the named pills first, then the reading', async ({page}) => {
      await page.goto('demos/?tab=accordions');

      for (const name of ['fold type', 'fold motion']) {
        const {row, shownNames} = dialRow(page, name);
        await row.scrollIntoViewIfNeeded();
        await expect(shownNames.filter({visible: true}).first(), name).toHaveText(name);
      }
      for (const name of ['fold type', 'fold motion']) {
        await expect(dialRow(page, name).row).toMatchAriaSnapshot(`
          - listitem:
            - /children: equal
            - group "${name}"
            - status
        `);
      }
    });
  });
}

const lessMotion = 'If your system asks for less motion, every fold here opens at once, whichever you choose.';

for (const {reader, device} of [{reader: 'a desktop', device: desktop}, {reader: 'a phone', device: iPhone}]) {
  test.describe(reader, () => {
    test.use(device);

    test('the fold motion reads the chosen pill, and reads that no fold moves once the reader asks for less motion', async ({page}) => {
      await page.emulateMedia({reducedMotion: 'no-preference'});
      await page.goto('demos/?tab=accordions&style=drawer');
      const {reading} = dialRow(page, 'fold motion');
      await reading.scrollIntoViewIfNeeded();

      await expect(reading).toHaveText('The text slides down from under its bar.', {useInnerText: true});
      await expect(reading).toMatchAriaSnapshot('- status: The text slides down from under its bar.');

      await page.emulateMedia({reducedMotion: 'reduce'});

      await expect(reading).toHaveText(lessMotion, {useInnerText: true});
      await expect(reading).toMatchAriaSnapshot(`- status: ${lessMotion}`);
    });
  });
}
