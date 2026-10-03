import {expect} from '@playwright/test';
import {
  accordionsTab,
  builds,
  codedStepLayouts,
  desktop,
  firstHeightAfter,
  framesWhileMoving,
  heightByTheNextFrame,
  heightOnceSettled,
  iPhone,
  misplacedPictures,
  nameOn,
  showing,
  textOf,
  type Frame,
  type Part
} from './__test_support';
import {evenMotionJourneys, everyBuildJourneys, heightMoved, layoutRounding, test} from './__test_support/fold-journeys';

const framesOpening = async (part: Part): Promise<Frame[]> => {
  await expect(part.fold).toBeVisible();
  const moving = framesWhileMoving(part.fold);
  await part.open();
  return moving;
};

const framesClosing = async (part: Part): Promise<Frame[]> => {
  await part.open();
  await heightOnceSettled(part.fold);
  const moving = framesWhileMoving(part.fold);
  await part.close();
  return moving;
};

const framesSliding = {open: framesOpening, closed: framesClosing};

for (const build of ['the inclusive details build', 'the details build'] as const) {
  for (const style of ['reveal', 'drawer'] as const) {
    test(`a fold in ${build} slides open by the ${style} where the browser can animate it`, async ({page, browserName}) => {
      test.skip(browserName !== 'chromium', 'only chromium animates a details element to its natural height');
      await page.goto(showing(build, style));
      const part = accordionsTab(page).firstPartOf(build);

      await part.open();
      const midway = await heightByTheNextFrame(part.fold);

      expect(midway).toBeLessThan(await heightOnceSettled(part.fold));
    });
  }

  test(`a fold in ${build} slides open and closed by the drawer with its text down to the fold’s edge`, async ({page, browserName}) => {
    test.skip(browserName !== 'chromium', 'only chromium animates a details element to its natural height');
    await page.goto(showing(build, 'drawer'));
    const part = accordionsTab(page).firstPartOf(build);
    const opening = framesWhileMoving(part.fold);
    await part.open();
    const opened = await opening;
    await heightOnceSettled(part.fold);
    const closing = framesWhileMoving(part.fold);

    await part.close();
    const closed = await closing;

    expect([...opened, ...closed].map(frame => frame.textBottomGap).filter(gap => gap > layoutRounding)).toEqual([]);
  });

}

const slidDown = (frames: Frame[]): number[] => frames.map(frame => frame.textAboveTheClip).filter(above => above > layoutRounding);

for (const build of ['the checkbox build', 'the radio build', 'the grid checkbox build', 'the grid radio build'] as const) {
  for (const direction of ['open', 'closed'] as const) {
    test(`a fold in ${build} slides ${direction} by the reveal, its text's top on the bar and its bottom on the fold's edge`, async ({page}) => {
      await page.goto(showing(build, 'reveal'));
      const frames = await framesSliding[direction](accordionsTab(page).firstPartOf(build));

      heightMoved[direction](frames);
      expect(frames.map(frame => frame.textBottomGap).filter(gap => gap > layoutRounding)).toEqual([]);
      expect(slidDown(frames)).toEqual([]);
    });

    test(`a fold in ${build} slides ${direction} by the drawer, its text coming from under the bar with its bottom on the fold's edge`, async ({page}) => {
      await page.goto(showing(build, 'drawer'));
      const frames = await framesSliding[direction](accordionsTab(page).firstPartOf(build));

      heightMoved[direction](frames);
      expect(frames.map(frame => frame.textBottomGap).filter(gap => gap > layoutRounding)).toEqual([]);
      expect(slidDown(frames)).not.toEqual([]);
    });
  }
}

test('a details fold opens at once, fully, where the browser cannot animate it', async ({page, browserName}) => {
  test.skip(browserName === 'chromium', 'chromium animates it');
  await page.goto(showing('the details build'));
  const part = accordionsTab(page).firstPartOf('the details build');
  await expect(part.fold).toBeVisible();
  const closed = await heightByTheNextFrame(part.fold);
  const firstMoved = firstHeightAfter(part.fold, closed);

  await part.open();

  expect(await firstMoved).toBeGreaterThan(closed);
  expect(await firstMoved).toBe(await heightOnceSettled(part.fold));
  await expect.poll(part.showsText).toBe(true);
});

test('opening a second details fold closes the first, from the keyboard too', async ({page}) => {
  await page.goto(showing('the details build'));
  const [first, second] = [accordionsTab(page).partOf('the details build', 0), accordionsTab(page).partOf('the details build', 1)];
  await first.open();
  await expect.poll(first.showsText).toBe(true);

  await second.openByKeyboard();

  await expect.poll(second.showsText).toBe(true);
  await expect.poll(first.showsText).toBe(false);
});

for (const {reader, device, layout} of [
  {reader: 'a phone held upright', device: iPhone, layout: 'code below prose'},
  {reader: 'a desktop', device: desktop, layout: 'code beside prose'}
] as const) {
  test.describe(reader, () => {
    test.use(device);

    for (const type of ['inclusive', 'exclusive']) {
      test(`reads the ${type} accordions explanation with the ${layout} on every step`, async ({page}) => {
        await page.goto(`demos/?tab=accordions&type=${type}`);
        await expect(page.getByRole('code').first()).toBeVisible();

        await expect.poll(async () => [...new Set(await codedStepLayouts(page))]).toEqual([layout]);
      });
    }
  });
}

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

test.describe('a desktop', () => {
  test.use(desktop);

  for (const type of ['inclusive', 'exclusive']) {
    test(`sees each diagram of the ${type} explanation under its prose and beside its code`, async ({page}) => {
      await page.goto(`demos/?tab=accordions&type=${type}`);
      await expect(page.getByRole('figure').first()).toBeVisible();

      await expect.poll(() => misplacedPictures(page)).toEqual([]);
    });
  }
});

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
  test(`the control of ${build} is named by its part, and checked while the part is open`, async ({page}) => {
    await page.goto(showing(build));
    const part = accordionsTab(page).firstPartOf(build);
    const name = await nameOn(part.fold).textContent() ?? '';
    await expect(part.fold.getByRole(control, {name, exact: true})).not.toBeChecked();

    await part.open();

    await expect(part.fold.getByRole(control, {name, exact: true})).toBeChecked();
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

test('a keyboard reader tabs from an open part\'s bar into its text and past a closed part', async ({page, browserName}) => {
  const tabKey = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
  await page.goto(showing('the checkbox build'));
  const tab = accordionsTab(page);
  const [open, closed, next] = [tab.partOf('the checkbox build', 0), tab.partOf('the checkbox build', 1), tab.partOf('the checkbox build', 2)];
  const openName = await nameOn(open.fold).textContent() ?? '';
  await open.openByKeyboard();
  await heightOnceSettled(open.fold);

  await page.keyboard.press(tabKey);
  await expect(open.fold.getByRole('region', {name: openName, exact: true})).toBeFocused();
  await page.keyboard.press(tabKey);
  await expect(closed.fold.getByRole('checkbox')).toBeFocused();
  await page.keyboard.press(tabKey);
  await expect(next.fold.getByRole('checkbox')).toBeFocused();
});

test('a keyboard reader tabs from an open radio part into its text and past the closed parts\' text', async ({page, browserName}) => {
  const tabKey = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
  await page.goto(showing('the radio build'));
  const open = accordionsTab(page).partOf('the radio build', 0);
  const openName = await nameOn(open.fold).textContent() ?? '';
  await open.openByKeyboard();
  await heightOnceSettled(open.fold);

  await page.keyboard.press(tabKey);
  await expect(open.fold.getByRole('region', {name: openName, exact: true})).toBeFocused();
  await page.keyboard.press(tabKey);

  await expect.poll(() => accordionsTab(page).holdsFocus('the radio build')).toBe(false);
});

everyBuildJourneys(builds);
evenMotionJourneys(['the checkbox build', 'the radio build']);
