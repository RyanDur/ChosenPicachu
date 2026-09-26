import type {Page} from '@playwright/test';
import {fingertipMiss} from './finger';

export const sortableList = (page: Page) => {
  const items = page.getByRole('list', {name: 'sortable list'}).first().getByRole('listitem');
  return {
    items,
    pressBesideAGripAndDropOnItsNeighbour: async (): Promise<void> => {
      const grip = items.first().getByRole('button', {name: /^grip for/});
      const box = await grip.boundingBox();
      if (box === null) throw new Error('the grip never stood');
      await grip.dragTo(items.nth(1), {force: true, sourcePosition: {x: box.width / 2 + fingertipMiss, y: box.height / 2}});
    }
  };
};
