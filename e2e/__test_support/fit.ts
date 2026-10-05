import type {Page} from '@playwright/test';

export const piecesPastTheirParts = (page: Page): Promise<string[]> => page.getByRole('main').evaluate(main => {
  const framed = (element: Element): boolean => {
    for (let around: Element | null = element; around !== null && around !== main; around = around.parentElement) {
      if (getComputedStyle(around).overflowX !== 'visible') return true;
    }
    return false;
  };
  return [...main.querySelectorAll('*')].flatMap(piece => {
    const part = piece.parentElement;
    const {position, display} = getComputedStyle(piece);
    if (part === null || framed(part) || ['absolute', 'fixed'].includes(position) || ['contents', 'none', 'inline'].includes(display)) return [];
    const [edge, partEdge] = [piece.getBoundingClientRect(), part.getBoundingClientRect()];
    return edge.width > 0 && edge.right > partEdge.right + 1
      ? [`${piece.textContent.trim().slice(0, 30) || piece.tagName.toLowerCase()} runs ${Math.round(edge.right - partEdge.right)}px past its part`]
      : [];
  });
});

export const pageScrollsSideways = (page: Page): Promise<boolean> =>
  page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
