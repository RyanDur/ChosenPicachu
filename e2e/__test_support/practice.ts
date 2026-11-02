import type {Locator, Page} from '@playwright/test';

export const practicePage = (page: Page) => {
  const practice = page.getByRole('region', {name: 'how I organize it'});
  return {
    practice,
    title: (concern: string): Locator => page.getByRole('heading', {name: `Practice ${concern}`, level: 1}),
    link: (name: string): Locator => practice.getByRole('link', {name}).first(),
    part: (name: string): Locator => practice.getByRole('heading', {name, level: 3}),
    figure: (caption: RegExp): Locator => practice.getByRole('figure', {name: caption}),
    // a drawing is an image the caption speaks for, hidden from a reader's tools, so the count is of what shows
    drawingsShownIn: (figure: Locator): Locator => figure.getByRole('img', {includeHidden: true})
      .or(figure.getByRole('presentation', {includeHidden: true}))
      .filter({visible: true}),
    readWithTheStylesOff: (): Promise<void> => page.evaluate(() => {
      [...document.styleSheets].forEach(sheet => {
        sheet.disabled = true;
      });
    })
  };
};
