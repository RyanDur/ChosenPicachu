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

export const chartsPage = (page: Page) => {
  const priceCard = page.getByRole('region', {name: 'live trades'});
  const periodMenu = page.getByLabel('price period by');
  return {
    priceCard,
    priceCardScope: async (): Promise<string> => `section[aria-labelledby="${await priceCard.getAttribute('aria-labelledby')}"]`,
    priceDelta: priceCard.getByText(/^[+-]\$/),
    periodToggle: page.getByRole('button', {name: 'price period'}),
    period: (name: string): Locator => periodMenu.getByRole('button', {name}),
    feedDot: (): Promise<string> =>
      page.getByRole('status', {name: 'feed'}).evaluate(feed => getComputedStyle(feed, '::before').backgroundColor)
  };
};
