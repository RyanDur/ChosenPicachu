import type {FrameLocator, Locator, Page} from '@playwright/test';

export const headingsTakingMoreLinesThanWords = (scope: Page | Locator | FrameLocator): Promise<string[]> =>
  scope.getByRole('columnheader').evaluateAll(headers => headers.flatMap(header => {
    const walker = document.createTreeWalker(header, NodeFilter.SHOW_TEXT);
    const lineTops = new Set<number>();
    for (let text = walker.nextNode(); text !== null; text = walker.nextNode()) {
      const range = document.createRange();
      range.selectNodeContents(text);
      [...range.getClientRects()].filter(line => line.width > 0).forEach(line => lineTops.add(Math.round(line.top)));
    }
    const words = (header.getAttribute('aria-label') ?? header.textContent ?? '').trim().split(/\s+/).filter(word => word !== '');
    return lineTops.size > words.length ? [`${words.join(' ')} takes ${lineTops.size} lines`] : [];
  }));
