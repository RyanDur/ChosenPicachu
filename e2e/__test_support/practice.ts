import type {Locator, Page} from '@playwright/test';

export const practicePage = (page: Page) => {
  const practice = page.getByRole('region', {name: 'how I organize it'});
  return {
    practice,
    title: (concern: string): Locator => page.getByRole('heading', {name: `Practice ${concern}`, level: 1}),
    momentLink: (name: string): Locator => practice.getByRole('link', {name}).first(),
    drawing: (caption: RegExp): Locator => practice.getByRole('figure', {name: caption}),
    carve: (file: RegExp): Locator => practice.getByRole('figure', {name: file}),
    drawingsHeardIn: (figure: Locator): Locator => figure.getByRole('img'),
    comesAfter: async (later: Locator, earlier: Locator): Promise<boolean> =>
      later.evaluate((element, before) => (before.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0,
        await earlier.elementHandle()),
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
