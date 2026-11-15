import type {Page} from '@playwright/test';

export const whichCardIsOnTop = (page: Page) => {
  const part = page.getByRole('region', {name: 'Which card is on top?'});
  const summary = 'show the answer';
  const reveal = part.getByRole('group', {name: summary});
  return {
    answer: reveal.getByRole('paragraph'),
    askFromTheKeyboard: async (): Promise<void> => {
      await reveal.getByText(summary).focus();
      await page.keyboard.press('Enter');
    },
    readInOrder: async (): Promise<string[]> => {
      const read = await part.ariaSnapshot();
      const opened = read.indexOf(`- group "${summary}"`);
      const marks = opened < 0 ? {} : {
        question: read.lastIndexOf('- paragraph', opened),
        answer: read.indexOf('- paragraph', opened),
        drawing: read.indexOf('- figure', opened)
      };
      return Object.entries(marks)
        .filter(([, at]) => at >= 0)
        .sort(([, one], [, other]) => one - other)
        .map(([mark]) => mark);
    }
  };
};
