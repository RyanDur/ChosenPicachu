import {expect} from '@playwright/test';
import {not} from '@ryandur/sand';
import {
  accordionsTab,
  builds,
  codedStepLayouts,
  demoSettings,
  desktop,
  firstHeightAfter,
  framesWhileMoving,
  heightByTheNextFrame,
  heightOnceSettled,
  iPhone,
  misplacedPictures,
  nameOn,
  shortOfAFinger,
  showing,
  textOf,
  type Build,
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

test('a fold of the accordion in HTML alone opens by pointer and closes by keyboard', async ({page}) => {
  await page.goto('demos/?tab=accordions');
  const fold = accordionsTab(page).htmlAloneFold('basalt');
  await expect.poll(fold.showsText).toBe(false);

  await fold.open();
  await expect.poll(fold.showsText).toBe(true);
  await fold.closeByKeyboard();

  await expect.poll(fold.showsText).toBe(false);
});

for (const {type, arrowed} of [
  {type: 'inclusive', arrowed: ['the checkbox build', 'the measured checkbox build', 'the inclusive details build'] as Build[]},
  {type: 'exclusive', arrowed: ['the radio build', 'the measured radio build', 'the details build'] as Build[]}
]) {
  test(`every bar of the ${type} builds that turn an arrow draws one pointing right`, async ({page}) => {
    await page.goto(`demos/?tab=accordions&type=${type}`);
    const tab = accordionsTab(page);

    for (const build of arrowed) {
      expect(await tab.arrowsOf(build), build).toEqual(['right', 'right', 'right', 'right', 'right']);
    }
  });
}

for (const build of ['the inclusive details build', 'the details build'] as const) {
  test(`an open part of ${build} turns its arrow down`, async ({page}) => {
    await page.goto(showing(build));
    const tab = accordionsTab(page);

    await tab.firstPartOf(build).open();

    expect(await tab.arrowOnTheFirstPartOf(build)).toBe('down');
  });
}

// a thin stroke on Linux may never cover a whole pixel, so its darkest pixel sits a little above the ink
const antialiasing = 40;

test.describe('a desktop', () => {
  test.use(desktop);

  for (const build of ['the grid checkbox build', 'the grid radio build'] as const) {
    test(`a pointer anywhere on a bar of ${build} lights the whole bar, as a hovered bar of the checkbox build`, async ({page}) => {
      const tab = accordionsTab(page);
      await page.goto(showing('the checkbox build'));
      const lit = await tab.hoveredAt('the checkbox build', 'middle');
      await page.goto(showing(build));
      const resting = await tab.restingAt(build);
      expect(resting.ground, 'the bar at rest').not.toBe(lit.ground);

      for (const spot of ['start', 'middle', 'end'] as const) {
        const {ground, words} = await tab.hoveredAt(build, spot);
        expect(ground, `${spot}: the bar's ground`).toBe(lit.ground);
        expect(Math.max(...words.map((channel, at) => Math.abs(channel - lit.words[at]))), `${spot}: the words' colour, off by`).toBeLessThanOrEqual(antialiasing);
      }
      await page.mouse.down();
      await page.mouse.up();
      await expect.poll(tab.firstPartOf(build).isOpen).toBe(true);
    });

    test(`a keyboard's focus on a bar of ${build} fills and rings the bar, as on a focused bar of the checkbox build`, async ({page}) => {
      const tab = accordionsTab(page);
      await page.goto(showing('the checkbox build'));
      const focused = await tab.focusedByKeyboard('the checkbox build');
      await page.goto(showing(build));
      expect(focused.ground, 'a focused bar of the checkbox build').not.toBe((await tab.restingAt(build)).ground);

      const {ground, edge} = await tab.focusedByKeyboard(build);

      expect(ground, 'the bar\'s ground').toBe(focused.ground);
      expect(Math.max(...edge.map((channel, at) => Math.abs(channel - focused.edge[at]))), 'the ring inside the bar\'s edge, off by').toBeLessThanOrEqual(antialiasing);
    });
  }
});

test.describe('a phone', () => {
  test.use(iPhone);

  for (const build of ['the grid checkbox build', 'the grid radio build'] as const) {
    test(`a tap leaves no bar of ${build} lit`, async ({page}) => {
      await page.goto(showing(build));

      expect(await accordionsTab(page).endOfTheFirstBarLitAfterATap(build)).toBe(false);
    });
  }
});

for (const {reader, device} of [{reader: 'a desktop', device: desktop}, {reader: 'a phone', device: iPhone}]) {
  test.describe(reader, () => {
    test.use(device);

    for (const {tab, name} of [
      {tab: 'accordions', name: 'fold type'},
      {tab: 'accordions', name: 'fold motion'},
      {tab: 'z-index', name: 'side'},
      {tab: 'dragAndDrop', name: 'pace'}
    ]) {
      test(`the ${name} dial on the ${tab} tab shows its name, and a screen reader hears it once`, async ({page}) => {
        await page.goto(`demos/?tab=${tab}`);
        const pills = page.getByRole('group', {name, exact: true}).last();
        await pills.or(demoSettings(page).fold).first().waitFor();
        if (not(await pills.isVisible())) {
          await demoSettings(page).press();
        }
        await pills.scrollIntoViewIfNeeded();
        const row = page.getByRole('listitem').filter({has: pills}).last();

        const widths = await Promise.all((await row.getByText(name, {exact: true}).all()).map(async shown => (await shown.boundingBox())?.width ?? 0));
        expect(Math.max(...widths), 'the widest copy of the name').toBeGreaterThan(name.length * 4);
        expect((await row.ariaSnapshot()).split('\n').slice(0, 2), 'the row, then the first thing in it').toEqual(['- listitem:', `  - group "${name}":`]);
      });
    }

    test('the fold choices keep their pills in the row, each a finger tall, beside the reading of the chosen one', async ({page}) => {
      await page.goto('demos/?tab=accordions');

      for (const name of ['fold type', 'fold motion']) {
        const pills = page.getByRole('group', {name, exact: true});
        const row = page.getByRole('listitem').filter({has: pills}).last();
        const [rowBox, pillsBox] = await Promise.all([row.boundingBox(), pills.boundingBox()]);
        if (rowBox === null || pillsBox === null) throw new Error(`the ${name} row is not shown`);

        expect(pillsBox.x + pillsBox.width, name).toBeLessThanOrEqual(rowBox.x + rowBox.width);
        await expect(row.getByRole('status')).toBeVisible();
        if (device === iPhone) {
          expect(await shortOfAFinger(await pills.getByText(/^\w+$/).all()), name).toEqual([]);
        }
      }
    });
  });
}
