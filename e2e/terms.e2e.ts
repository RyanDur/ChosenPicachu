import {Page, expect, test} from '@playwright/test';
import {definedTerm, definitionTapped, desktop, iPhone, pressTab, timesShut} from './__test_support';

const aReadableWidth = 300;

test.describe('a phone', () => {
  test.use(iPhone);

  for (const {tab, story, term} of [
    {tab: 'tables', story: 'The trader can read the market in a table', term: 'ledger'},
    {tab: 'tables', story: 'The page is a store, and so is the table', term: 'store'},
    {tab: 'tables', story: 'The page is a store, and so is the table', term: 'middleware'},
    {tab: 'tables', story: 'The trader can sort by column', term: 'survey'},
    {tab: 'tables', story: 'The page is a store, and so is the table', term: 'reducer'},
    {tab: 'dragAndDrop', story: 'The user can arrange the list by hand', term: 'crossing'}
  ]) {
    test(`a tap on ${term} opens its definition at a readable width, clear of both edges and of the word`, async ({page}) => {
      await page.goto(`demos/?tab=${tab}`);

      const {width, left, right, overTheWord} = await definitionTapped(page, story, term);

      expect(width, 'the definition’s width').toBeGreaterThanOrEqual(aReadableWidth);
      expect(left, 'room on the left').toBeGreaterThanOrEqual(8);
      expect(right, 'room on the right').toBeGreaterThanOrEqual(8);
      expect(overTheWord, 'over the word it defines').toBe(false);
    });
  }
});

test.describe('a phone, with a definition open', () => {
  test.use(iPhone);

  const opened = async (page: Page) => {
    await page.goto('demos/?tab=tables');
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
    const {definition} = await opened(page);

    await page.keyboard.press('Escape');

    await expect(definition).toBeHidden();
  });
});

test.describe('a desk', () => {
  test.use(desktop);

  test('a mouse resting on a term opens its definition, and leaving it closes it', async ({page}) => {
    await page.goto('demos/?tab=tables');
    const {word, definition} = await definedTerm(page, 'The page is a store, and so is the table', 'middleware');

    await word.hover();
    await expect(definition).toBeVisible();

    await page.mouse.move(0, 0);
    await expect(definition).toBeHidden();
  });

  test('the keyboard reaching a term opens its definition', async ({page}) => {
    await page.goto('demos/?tab=tables');
    const {word, definition} = await definedTerm(page, 'The page is a store, and so is the table', 'middleware');

    await word.focus();
    await pressTab(page, {backwards: true});
    await expect(definition).toBeHidden();

    await pressTab(page);

    await expect(word).toBeFocused();
    await expect(definition).toBeVisible();
  });

  test('Enter on a focused term leaves its definition open', async ({page}) => {
    await page.goto('demos/?tab=tables');
    const {word, definition} = await definedTerm(page, 'The page is a store, and so is the table', 'middleware');
    await word.focus();
    await expect(definition).toBeVisible();

    await page.keyboard.press('Enter');

    await expect(definition).toBeVisible();
  });

  test('Tab away from a term closes its definition', async ({page}) => {
    await page.goto('demos/?tab=tables');
    const {word, definition} = await definedTerm(page, 'The page is a store, and so is the table', 'middleware');
    await word.focus();
    await expect(definition).toBeVisible();

    await pressTab(page);

    await expect(definition).toBeHidden();
  });
});
