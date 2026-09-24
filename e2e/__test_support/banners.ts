import type {Locator, Page} from '@playwright/test';

export const bannersPage = (page: Page) => {
  const stack = page.getByRole('group', {name: 'stack'});
  const news: Locator = page.getByRole('alert').getByRole('paragraph');
  return {
    news,
    leftOf: stack.getByRole('radio', {name: 'Left'}),
    stackedLeft: (): Promise<void> => stack.getByText('Left', {exact: true}).click(),
    raise: (): Promise<void> => page.getByRole('button', {name: 'raise a banner'}).click(),
    // a settled banner's box is its text plus its padding and borders, within a pixel
    settled: (): Promise<boolean> => news.evaluateAll(paragraphs => paragraphs.every(paragraph => {
      const contents = document.createRange();
      contents.selectNodeContents(paragraph);
      const style = getComputedStyle(paragraph);
      const chrome = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
      return Math.abs(paragraph.getBoundingClientRect().height - (contents.getBoundingClientRect().height + chrome)) <= 1;
    }))
  };
};
