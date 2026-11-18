import type {Page} from '@playwright/test';

export const siteFrame = (page: Page) => {
  const nav = page.getByRole('navigation', {name: 'site'});
  return {
    nav,
    title: page.getByRole('heading', {level: 1}),
    home: nav.getByRole('link', {name: 'Home', exact: true}),
    menu: page.getByRole('button', {name: 'Menu', exact: true}),
    feedback: page.getByRole('button', {name: 'Feedback', exact: true, includeHidden: true}),
    hydrated: (): Promise<void> => page.getByRole('dialog', {name: 'Feedback', includeHidden: true}).waitFor({state: 'attached'})
  };
};

// goto waits for the load event, and every chunk is preloaded before it, so only a wait inside the entry script
// leaves the page drawn but not yet hydrated for long enough to act in
export const hydrationHeldBack = async (page: Page, address: string): Promise<void> => {
  const html = await (await page.request.get(address)).text();
  const entry = /<script type="module" src="([^"]+)"/.exec(html)?.[1] ?? 'no entry script';
  await page.route(url => url.pathname === entry, async route => {
    const response = await route.fetch();
    const body = `await new Promise(resolve => setTimeout(resolve, 1500));\n${await response.text()}`;
    await route.fulfill({response, body});
  });
};
