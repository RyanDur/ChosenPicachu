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

export const heldMarket = async (page: Page, prices: number[]): Promise<{arrive: () => void}> => {
  const {promise: arrived, resolve: arrive} = Promise.withResolvers<void>();
  await page.route(/\/products\/.*\/candles/, async route => {
    await arrived;
    await route.fulfill({json: [], headers: {'access-control-allow-origin': '*'}});
  });
  await page.routeWebSocket(/ws-feed/, socket => {
    socket.onMessage(async () => {
      await arrived;
      prices.forEach((price, id) => socket.send(tradeFrame(id, price)));
    });
  });
  return {arrive};
};

export const feedStillConnecting = async (page: Page, prices: number[]): Promise<{opens: () => void}> => {
  const {promise: opened, resolve: opens} = Promise.withResolvers<void>();
  await page.route(/\/products\/.*\/candles/, route =>
    route.fulfill({json: [], headers: {'access-control-allow-origin': '*'}}));
  await page.routeWebSocket(/ws-feed/, async socket => {
    await opened;
    socket.onMessage(() => prices.forEach((price, id) => socket.send(tradeFrame(id, price))));
  });
  return {opens};
};

export const chartsPage = (page: Page) => {
  const priceCard = page.getByRole('region', {name: 'live trades'});
  const periodMenu = page.getByLabel('price period by');
  return {
    explainer: page.getByRole('group').filter({has: page.getByText('what am I looking at?', {exact: true})}).first(),
    priceCard,
    priceCardScope: async (): Promise<string> => `section[aria-labelledby="${await priceCard.getAttribute('aria-labelledby')}"]`,
    priceDelta: priceCard.getByText(/^[+-]\$/),
    periodToggle: page.getByRole('button', {name: 'price period'}),
    whereTheFeedStatusSits: async (): Promise<'under the title' | 'beside the title'> => {
      const title = await page.getByRole('heading', {level: 3, name: /^Bitcoin, live/}).elementHandle();
      const under = await page.getByRole('status', {name: 'feed'}).evaluate((status, heading) => {
        if (heading === null) throw new Error('the charts tab has no title');
        return status.getBoundingClientRect().top >= heading.getBoundingClientRect().bottom;
      }, title);
      return under ? 'under the title' : 'beside the title';
    },
    period: (name: string): Locator => periodMenu.getByRole('button', {name})
  };
};

export const markets: readonly {trend: 'rising' | 'falling'; sign: RegExp; prices: number[]}[] = [
  {trend: 'rising', sign: /^\+/, prices: [50000, 50100]},
  {trend: 'falling', sign: /^-/, prices: [50100, 50000]}
];
