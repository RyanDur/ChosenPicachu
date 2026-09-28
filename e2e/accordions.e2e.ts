import {expect, test} from '@playwright/test';
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
  showing,
  textOf
} from './__test_support';

test('a details fold slides open where the browser can animate it', async ({page, browserName}) => {
  test.skip(browserName !== 'chromium', 'only chromium animates a details element to its natural height');
  await page.goto(showing('the details build'));
  const part = accordionsTab(page).firstPartOf('the details build');

  await part.open();
  const midway = await heightByTheNextFrame(part.fold);

  expect(midway).toBeLessThan(await heightOnceSettled(part.fold));
});

test('a fold in the grid checkbox build slides open', async ({page}) => {
  await page.goto(showing('the grid checkbox build'));
  const part = accordionsTab(page).firstPartOf('the grid checkbox build');
  await expect(part.fold).toBeVisible();
  const closed = await heightByTheNextFrame(part.fold);
  const firstMoved = firstHeightAfter(part.fold, closed);

  await part.open();

  expect(await firstMoved).toBeGreaterThan(closed);
  expect(await firstMoved).toBeLessThan(await heightOnceSettled(part.fold));
});

const layoutRounding = 1;

for (const build of ['the grid checkbox build', 'the grid radio build'] as const) {
  for (const style of ['reveal', 'drawer'] as const) {
    test(`a fold in ${build} slides open by the ${style} with its text shown down to the fold’s edge`, async ({page}) => {
      await page.goto(showing(build, style));
      const part = accordionsTab(page).firstPartOf(build);
      await expect(part.fold).toBeVisible();
      const moving = framesWhileMoving(part.fold);

      await part.open();
      const frames = await moving;

      expect(frames[0].height).toBeLessThan(frames.at(-1)?.height ?? 0);
      expect(frames.map(frame => frame.textBottomGap).filter(gap => gap > layoutRounding)).toEqual([]);
    });

    test(`a fold in ${build} slides closed by the ${style} with its text shown down to the fold’s edge`, async ({page}) => {
      await page.goto(showing(build, style));
      const part = accordionsTab(page).firstPartOf(build);
      await part.open();
      await heightOnceSettled(part.fold);
      const moving = framesWhileMoving(part.fold);

      await part.close();
      const frames = await moving;

      expect(frames[0].height).toBeGreaterThan(frames.at(-1)?.height ?? 0);
      expect(frames.map(frame => frame.textBottomGap).filter(gap => gap > layoutRounding)).toEqual([]);
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

for (const build of builds) {
  test(`a reader who asks for less motion gets ${build} open at once`, async ({page, browserName}) => {
    test.skip(build.includes('details') && browserName !== 'chromium', 'only chromium animates a details element to its natural height');
    await page.emulateMedia({reducedMotion: 'reduce'});
    await page.goto(showing(build));
    const part = accordionsTab(page).firstPartOf(build);
    await expect(part.fold).toBeVisible();
    const closed = await heightByTheNextFrame(part.fold);

    const firstMoved = firstHeightAfter(part.fold, closed);
    await part.open();
    await expect.poll(part.isOpen).toBe(true);

    expect(await firstMoved).toBeGreaterThan(closed);
    expect(await firstMoved).toBe(await heightOnceSettled(part.fold));
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

for (const build of builds.filter(build => build !== 'the details build')) {
  test(`a keyboard reader opens the first fold of ${build} and reads its text`, async ({page}) => {
    await page.goto(showing(build));
    const part = accordionsTab(page).firstPartOf(build);
    await expect(part.fold).toBeVisible();

    await part.openByKeyboard();

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
  test(`the bar of ${build} says what a press will do, and its control is named the same`, async ({page}) => {
    await page.goto(showing(build));
    const part = accordionsTab(page).firstPartOf(build);
    const name = await part.fold.getByRole('heading').textContent() ?? '';
    await expect(part.fold.getByRole(control, {name: `Open ${name}`})).not.toBeChecked();

    await part.open();

    await expect(part.fold.getByRole(control, {name: `Close ${name}`})).toBeChecked();
  });
}

test('a link to the exclusive type opens the tab on it, and it stays after a reload', async ({page}) => {
  await page.goto('demos/?tab=accordions&type=exclusive');
  const exclusive = page.getByRole('group', {name: 'fold type'}).getByRole('radio', {name: 'Exclusive'});
  await expect(exclusive).toBeChecked();

  await page.reload();

  await expect(exclusive).toBeChecked();
  await expect(page.getByRole('heading', {name: 'Accordion using a radio group'})).toBeVisible();
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

for (const build of ['the grid checkbox build', 'the grid radio build'] as const) {
  test(`with Static chosen, a fold in ${build} opens fully in one frame`, async ({page}) => {
    await page.goto(showing(build, 'static'));
    const part = accordionsTab(page).firstPartOf(build);
    const closed = await heightByTheNextFrame(part.fold);
    const firstMoved = firstHeightAfter(part.fold, closed);

    await part.open();

    expect(await firstMoved).toBe(await heightOnceSettled(part.fold));
  });
}

for (const build of ['the grid checkbox build', 'the grid radio build'] as const) {
  test(`a reader who asks for less motion gets ${build} open at once under the drawer`, async ({page}) => {
    await page.emulateMedia({reducedMotion: 'reduce'});
    await page.goto(showing(build, 'drawer'));
    const part = accordionsTab(page).firstPartOf(build);
    const closed = await heightByTheNextFrame(part.fold);
    const firstMoved = firstHeightAfter(part.fold, closed);

    await part.open();

    expect(await firstMoved).toBe(await heightOnceSettled(part.fold));
  });
}
