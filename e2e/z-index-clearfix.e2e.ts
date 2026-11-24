import {expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {clearfixTray, positionExhibit} from './__test_support';

const address = 'demos/z-index/how-position-places-a-box/';

test('with Second absolute, the foot of the exhibit asks whether a parent box has collapsed and offers the clearfix', async ({page}) => {
  const tray = clearfixTray(page);
  await page.goto(address);

  await positionExhibit(page).chooses('absolute');

  await expect(tray.opener).toBeVisible();
});

test('with Second at any other position, the exhibit offers no clearfix', async ({page}) => {
  const tray = clearfixTray(page);
  await page.goto(`${address}?second-position=absolute`);
  await expect(tray.opener).toBeVisible();

  await positionExhibit(page).chooses('sticky');

  await expect(tray.opener).toBeHidden();
});

test('stepping the open tray from in the flow to float collapses the parent to a line', async ({page}) => {
  const tray = clearfixTray(page);
  await page.goto(`${address}?second-position=absolute`);
  await tray.opens();
  await expect(tray.whatTheParentDid).toHaveText('The parent wraps First and Second.');

  await tray.stepsTo('2 · Float');

  await expect(tray.whatTheParentDid).toHaveText(
    'The parent collapses to a line. First and Second hang outside it, and the rest of the page slides up under them.');
});

test('stepping from float to the clearfix gives the parent its floats back', async ({page}) => {
  const tray = clearfixTray(page);
  await page.goto(`${address}?second-position=absolute&clearfix=float`);

  await tray.stepsTo('3 · The clearfix');

  await expect(tray.whatTheParentDid).toHaveText('The parent holds its floats again, with one more rule and an unseen box.');
});

test('stepping from the clearfix to what we have now leaves the parent holding its floats', async ({page}) => {
  const tray = clearfixTray(page);
  await page.goto(`${address}?second-position=absolute&clearfix=the-clearfix`);

  await tray.stepsTo('4 · What we have now');

  await expect(tray.whatTheParentDid).toHaveText('The parent holds its floats, with one declaration.');
});

test('pressing the same control, now reading Close, takes the tray away and leaves the focus on it', async ({page}) => {
  const tray = clearfixTray(page);
  await page.goto(`${address}?second-position=absolute`);
  await tray.opens();
  await expect(tray.steps).toBeVisible();

  await tray.closes();

  await expect(tray.steps).toBeHidden();
  await expect(tray.opener).toBeFocused();
});
