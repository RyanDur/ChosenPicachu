import type {Locator, Page} from '@playwright/test';

const tradeFrame = (id: number, price: number): string => JSON.stringify({
  type: 'match',
  trade_id: id,
  price: `${price}`,
  size: '0.01',
  side: 'buy',
  time: new Date().toISOString()
});

export const scriptedMarket = async (page: Page, prices: number[]): Promise<void> => {
  await page.route(/\/products\/.*\/candles/, route =>
    route.fulfill({json: [], headers: {'access-control-allow-origin': '*'}}));
  await page.routeWebSocket(/ws-feed/, socket => {
    socket.onMessage(() => prices.forEach((price, id) => socket.send(tradeFrame(id, price))));
  });
};

export const priceCard = (page: Page): Locator => page.getByRole('region', {name: 'live trades'});

export const priceCardScope = 'section[aria-label="live trades"]';

export const priceDelta = (page: Page): Locator => priceCard(page).getByText(/^[+-]\$/);

export const pricePeriodToggle = (page: Page): Locator => page.getByRole('button', {name: 'price period'});

export const pricePeriodMenu = (page: Page): Locator => page.getByLabel('price period by');

export const pricePeriod = (page: Page, period: string): Locator => pricePeriodMenu(page).getByRole('button', {name: period});

export const feedDot = (page: Page): Promise<string> =>
  page.getByRole('status', {name: 'feed'}).evaluate(feed => getComputedStyle(feed, '::before').backgroundColor);
