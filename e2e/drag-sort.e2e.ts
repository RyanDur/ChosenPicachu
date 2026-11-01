import {expect, test} from '@playwright/test';
import {iPhone, sortableList} from './__test_support';

test('an eager list takes the new order the moment the carried item crosses a neighbour', async ({page}) => {
  await page.goto('demos/drag-and-drop/');
  const list = sortableList(page);

  const carried = await list.carry('A', 'C');

  await expect.poll(list.seats).toEqual(['B', 'C', 'A']);
  await carried.drop();
});

test('a lazy list holds its order while an item is carried, and takes the new order when it is dropped', async ({page}) => {
  await page.goto('demos/drag-and-drop/?pace=lazy');
  const list = sortableList(page);

  const carried = await list.carry('A', 'C');
  await expect.poll(list.seats).toEqual(['A', 'B', 'C']);
  await carried.drop();

  await expect.poll(list.seats).toEqual(['B', 'C', 'A']);
});

test('a dragged item in an eager list says where it landed', async ({page}) => {
  await page.goto('demos/drag-and-drop/?pace=eager');
  const list = sortableList(page);

  await (await list.carry('A', 'C')).drop();

  await expect.poll(list.seats).toEqual(['B', 'C', 'A']);
  await expect(list.moveReport).toHaveText('A moved to 3 of 3');
});

test('a dragged item in a lazy list says where it landed', async ({page}) => {
  await page.goto('demos/drag-and-drop/?pace=lazy');
  const list = sortableList(page);

  await (await list.carry('A', 'C')).drop();

  await expect.poll(list.seats).toEqual(['B', 'C', 'A']);
  await expect(list.moveReport).toHaveText('A moved to 3 of 3');
});

test.describe('a finger on a phone', () => {
  test.use(iPhone);

  test('a finger pressed on a grip and taken over by the browser leaves its item at rest', async ({page, browserName}) => {
    test.skip(browserName !== 'chromium', 'only Chromium\'s DevTools protocol cancels a finger');
    await page.goto('demos/drag-and-drop/');
    const list = sortableList(page);
    const finger = await list.fingerOnTheGrip('A');
    await expect(list.item('A')).toHaveAttribute('draggable', 'true');

    await finger.takenOverByTheBrowser();

    await expect(list.item('A')).toHaveAttribute('draggable', 'false');
  });
});
