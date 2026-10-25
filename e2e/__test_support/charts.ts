import type {Locator, Page} from '@playwright/test';

const tradeFrame = (id: number, price: number, at: number): string => JSON.stringify({
  type: 'match',
  trade_id: id,
  price: `${price}`,
  size: '0.01',
  side: 'buy',
  time: new Date(at).toISOString()
});

const aMinuteApartEndingNow = (prices: number[]): string[] =>
  prices.map((price, id) => tradeFrame(id, price, Date.now() - (prices.length - 1 - id) * 60_000));

export const scriptedMarket = async (page: Page, prices: number[]): Promise<void> => {
  await page.route(/\/products\/.*\/candles/, route =>
    route.fulfill({json: [], headers: {'access-control-allow-origin': '*'}}));
  await page.routeWebSocket(/ws-feed/, socket => {
    socket.onMessage(() => aMinuteApartEndingNow(prices).forEach(frame => socket.send(frame)));
  });
};

export const feedStillConnecting = async (page: Page, prices: number[]): Promise<{opens: () => void}> => {
  const {promise: opened, resolve: opens} = Promise.withResolvers<void>();
  await page.route(/\/products\/.*\/candles/, route =>
    route.fulfill({json: [], headers: {'access-control-allow-origin': '*'}}));
  await page.routeWebSocket(/ws-feed/, async socket => {
    await opened;
    socket.onMessage(() => aMinuteApartEndingNow(prices).forEach(frame => socket.send(frame)));
  });
  return {opens};
};

export const chartsPage = (page: Page) => {
  const priceCard = page.getByRole('region', {name: 'live trades'});
  const periodMenu = page.getByLabel('price period by');
  const seat = (region: string): Locator => page.getByRole('listitem').filter({has: page.getByRole('region', {name: region, exact: true})});
  const carryByTheGrip = async (region: string): Promise<{height: number; pointerWhenTheyTrade: (step: number) => Promise<number>}> => {
    const chart = seat(region);
    await chart.hover();
    const [box, grip] = await Promise.all([chart.boundingBox(), chart.getByRole('button', {name: 'move chart', exact: true}).boundingBox()]);
    if (box === null || grip === null) throw new Error(`the ${region} chart has no grip`);
    const x = grip.x + grip.width / 2;
    let pointer = grip.y + grip.height / 2;
    await page.mouse.move(x, pointer);
    await page.mouse.down();
    pointer += 10;
    await page.mouse.move(x, pointer, {steps: 5});
    const pointerWhenTheyTrade = async (step: number): Promise<number> => {
      const order = page.url();
      for (const start = pointer; Math.abs(pointer - start) < box.height; pointer += step) {
        await page.mouse.move(x, pointer);
        if (page.url() !== order) return pointer;
      }
      throw new Error(`the ${region} chart never traded places`);
    };
    return {height: box.height, pointerWhenTheyTrade};
  };
  const fingerOnTheGrip = async (region: string): Promise<{cancelled: () => Promise<void>}> => {
    const devtools = await page.context().newCDPSession(page);
    const grip = seat(region).getByRole('button', {name: 'move chart', exact: true});
    await grip.scrollIntoViewIfNeeded();
    const box = await grip.boundingBox();
    if (box === null) throw new Error(`the ${region} chart has no grip`);
    await devtools.send('Input.dispatchTouchEvent', {type: 'touchStart', touchPoints: [{x: box.x + box.width / 2, y: box.y + box.height / 2}]});
    return {cancelled: async (): Promise<void> => {
      await devtools.send('Input.dispatchTouchEvent', {type: 'touchCancel', touchPoints: []});
    }};
  };
  return {
    seat,
    carryByTheGrip,
    fingerOnTheGrip,
    stillSliding: (): Promise<number> => page.getByRole('listitem').evaluateAll(charts => charts.flatMap(chart => chart.getAnimations()).length),
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
