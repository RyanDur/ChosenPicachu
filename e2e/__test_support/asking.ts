import type {Page} from '@playwright/test';

export const whichCardIsOnTop = (page: Page) => {
  const part = page.getByRole('region', {name: 'Which card is on top?'});
  const reveal = part.getByRole('group', {name: 'show the answer'});
  const marks = {
    question: 'Which one paints on top, and why?',
    answer: 'Card two. Card one forms a stacking context',
    drawing: 'figure "Which card is on top'
  };
  return {
    answer: reveal.getByText(marks.answer),
    askFromTheKeyboard: async (): Promise<void> => {
      await reveal.getByText('show the answer').focus();
      await page.keyboard.press('Enter');
    },
    readInOrder: async (): Promise<string[]> => {
      const read = await part.ariaSnapshot();
      return Object.entries(marks)
        .map(([mark, words]) => ({mark, at: read.indexOf(words)}))
        .filter(({at}) => at >= 0)
        .sort((one, other) => one.at - other.at)
        .map(({mark}) => mark);
    }
  };
};
