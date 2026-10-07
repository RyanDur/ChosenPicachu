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
  const carryByTheGrip = async (region: string): Promise<{height: number; handWhenTheyTrade: (step: number) => Promise<number>}> => {
    const chart = page.getByRole('listitem').filter({has: page.getByRole('region', {name: region, exact: true})});
    await chart.hover();
    const [box, grip] = await Promise.all([chart.boundingBox(), chart.getByRole('button', {name: 'move chart', exact: true}).boundingBox()]);
    if (box === null || grip === null) throw new Error(`the ${region} chart has no grip`);
    const x = grip.x + grip.width / 2;
    let hand = grip.y + grip.height / 2;
    await page.mouse.move(x, hand);
    await page.mouse.down();
    hand += 10;
    await page.mouse.move(x, hand, {steps: 5});
    const handWhenTheyTrade = async (step: number): Promise<number> => {
      const order = page.url();
      for (const start = hand; Math.abs(hand - start) < box.height; hand += step) {
        await page.mouse.move(x, hand);
        if (page.url() !== order) return hand;
      }
      throw new Error(`the ${region} chart never traded places`);
    };
    return {height: box.height, handWhenTheyTrade};
  };
  return {
    carryByTheGrip,
    explainer: page.getByRole('group').filter({has: page.getByText('what am I looking at?', {exact: true})}).first(),
    priceCard,
    priceCardScope: async (): Promise<string> => `section[aria-labelledby="${await priceCard.getAttribute('aria-labelledby')}"]`,
    priceDelta: priceCard.getByText(/^[+-]\$/),
    periodToggle: page.getByRole('button', {name: 'price period'}),
    period: (name: string): Locator => periodMenu.getByRole('button', {name})
  };
};

export const markets: readonly {trend: 'rising' | 'falling'; sign: RegExp; prices: number[]}[] = [
  {trend: 'rising', sign: /^\+/, prices: [50000, 50100]},
  {trend: 'falling', sign: /^-/, prices: [50100, 50000]}
];
