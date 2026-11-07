import {Page, expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {definedTerm, desktop, iPhone, pressTab, timesShut, whatHappened} from './__test_support';

const aTapShowsTheDefinition = async (page: Page, tab: string, story: string, term: string): Promise<void> => {
  await page.goto(`demos/${tab}/`);
  const {word, definition} = await definedTerm(page, story, term);

  await word.tap();

  await expect(definition).toBeVisible();
};

test.describe('a phone', () => {
  test.use(iPhone);

  test('a tap on ledger shows its definition', ({page}) => aTapShowsTheDefinition(page, 'tables', 'The trader can read the market in a table', 'ledger'));

  test('a tap on store shows its definition', ({page}) => aTapShowsTheDefinition(page, 'tables', 'The page is a store, and so is the table', 'store'));

  test('a tap on middleware shows its definition', ({page}) => aTapShowsTheDefinition(page, 'tables', 'The page is a store, and so is the table', 'middleware'));

  test('a tap on survey shows its definition', ({page}) => aTapShowsTheDefinition(page, 'tables/sort', 'The trader can sort by column', 'survey'));

  test('a tap on reducer shows its definition', ({page}) => aTapShowsTheDefinition(page, 'tables', 'The page is a store, and so is the table', 'reducer'));

  test('a tap on crossing shows its definition', ({page}) => aTapShowsTheDefinition(page, 'drag-and-drop', 'The user can arrange the list by hand', 'crossing'));
});

test.describe('a phone, with a definition open', () => {
  test.use(iPhone);

  const opened = async (page: Page) => {
    await page.goto('demos/tables/');
    const term = await definedTerm(page, 'The page is a store, and so is the table', 'middleware');
    await term.word.tap();
    await expect(term.definition).toBeVisible();
    return term;
  };

  test('a second tap on the term leaves its definition open', async ({page}) => {
    const {word, definition} = await opened(page);
    const shut = await timesShut(definition);

    await word.tap();

    await expect(definition).toBeVisible();
    expect(await shut(), 'times the definition shut on the second tap').toBe(0);
  });

  test('a tap on the page closes it', async ({page}) => {
    const {definition} = await opened(page);
    const shut = await timesShut(definition);

    await page.getByRole('heading', {level: 1}).tap();

    await expect(definition).toBeHidden();
    expect(await shut(), 'times the definition shut on the tap').toBe(1);
  });

  test('Escape closes it', async ({page}) => {
    await page.clock.install();
    await page.goto('demos/tables/');
    const {word, definition} = await definedTerm(page, 'The page is a store, and so is the table', 'middleware');
    const happened = await whatHappened(word, definition);
    await word.tap();
    await expect(definition).toBeVisible();

    await page.keyboard.press('Escape');
    await page.clock.runFor(1000);

    await expect(definition, await happened()).toBeHidden();
  });
});

test.describe('a desk', () => {
  test.use(desktop);

  test('a mouse resting on a term opens its definition, and leaving it closes it', async ({page}) => {
    await page.goto('demos/tables/');
    const {word, definition} = await definedTerm(page, 'The page is a store, and so is the table', 'middleware');

    await word.hover();
    await expect(definition).toBeVisible();

    await page.mouse.move(0, 0);
    await expect(definition).toBeHidden();
  });

  test('a click on a term the mouse has just reached, then Escape, leaves its definition closed', async ({page}) => {
    await page.clock.install();
    await page.goto('demos/tables/');
    const {word, definition} = await definedTerm(page, 'The page is a store, and so is the table', 'middleware');
    await word.hover();
    await word.click();
    await expect(definition).toBeVisible();

    await page.keyboard.press('Escape');
    await page.clock.runFor(1000);

    await expect(definition).toBeHidden();
  });

  test('the keyboard reaching a term opens its definition', async ({page}) => {
    await page.goto('demos/tables/');
    const {word, definition} = await definedTerm(page, 'The page is a store, and so is the table', 'middleware');

    await word.focus();
    await pressTab(page, {backwards: true});
    await expect(definition).toBeHidden();

    await pressTab(page);

    await expect(word).toBeFocused();
    await expect(definition).toBeVisible();
  });

  test('Enter on a focused term leaves its definition open', async ({page}) => {
    await page.goto('demos/tables/');
    const {word, definition} = await definedTerm(page, 'The page is a store, and so is the table', 'middleware');
    await word.focus();
    await expect(definition).toBeVisible();

    await page.keyboard.press('Enter');

    await expect(definition).toBeVisible();
  });

  test('Tab away from a term closes its definition', async ({page}) => {
    await page.goto('demos/tables/');
    const {word, definition} = await definedTerm(page, 'The page is a store, and so is the table', 'middleware');
    await word.focus();
    await expect(definition).toBeVisible();

    await pressTab(page);

    await expect(definition).toBeHidden();
  });
});
