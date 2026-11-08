import {is} from '@ryandur/sand';
import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {feedStatus} from '@pages/Demos/__test_support';

const addMenu = (): HTMLElement | null => screen.queryByLabelText('charts to add');

const theAddMenu = (): HTMLElement => {
  const menu = addMenu();
  if (menu) {
    return menu;
  }
  throw new Error('no add-a-chart menu on the desk');
};

const addChart = async (name: string): Promise<void> =>
  userEvent.click(within(theAddMenu()).getByRole('button', {name, hidden: true}));

const doorway = (chart: string): HTMLElement => screen.getByRole('link', {name: `${chart} tutorial`});

const walkThrough = async (chart: string, recipe: string): Promise<HTMLElement> => {
  await userEvent.click(doorway(chart));
  return screen.findByRole('region', {name: recipe});
};

const slot = (chart: string): HTMLElement => {
  const seat = screen.getAllByRole('listitem').find(item => is(within(item).queryByRole('link', {name: `${chart} tutorial`})));
  if (seat) {
    return seat;
  }
  throw new Error(`the ${chart} doorway sits in no seat`);
};

const grip = (chart: string): HTMLElement => within(slot(chart)).getByRole('button', {name: 'move chart', hidden: true});

type Finger = {
  readonly press: () => Promise<void>;
  readonly lift: () => Promise<void>;
};

const fingerOn = (chart: string): Finger => {
  const finger = userEvent.setup();
  const held = grip(chart);
  return {
    press: async (): Promise<void> => finger.pointer({keys: '[TouchA>]', target: held}),
    lift: async (): Promise<void> => finger.pointer({keys: '[/TouchA]', target: held})
  };
};

const captionOf = (chart: string): string =>
  within(screen.getByRole('region', {name: chart})).getByText(/candles ·/).textContent ?? '';

const chart = (name: string): HTMLElement => screen.getByRole('region', {name});

const findChart = (name: string): Promise<HTMLElement> => screen.findByRole('region', {name});

const onChart = (name: string, told: string): HTMLElement => within(chart(name)).getByText(told);

const findOnChart = async (name: string, told: string): Promise<HTMLElement> =>
  within(await findChart(name)).findByText(told);

const priceCard = (): HTMLElement => chart('live trades');

const alert = (): HTMLElement => screen.getByRole('alert');

const explainer = (name: string): HTMLElement => {
  const [fold] = within(chart(name)).getAllByRole('group').filter(group => is(within(group).queryByText('what am I looking at?')));
  return fold;
};

const keys = async (chart: string, key: string): Promise<void> => {
  doorway(chart).focus();
  await userEvent.keyboard(`{${key}}`);
};

export const chartsDesk = {
  addMenu,
  addChart,
  offered: (name: string): HTMLElement | null => within(theAddMenu()).queryByRole('button', {name, hidden: true}),
  doorway,
  walkThrough,
  slot,
  fingerOn,
  keys,
  open: async (chart: string): Promise<void> => userEvent.click(doorway(chart)),
  removeFirst: async (): Promise<void> => userEvent.click(screen.getAllByRole('button', {name: 'remove chart'})[0]),
  removeOnOffer: (): HTMLElement | null => screen.queryByRole('button', {name: 'remove chart'}),
  gripOnOffer: (): HTMLElement | null => screen.queryByRole('button', {name: 'move chart', hidden: true}),
  choosePeriod: async (chart: string, period: string): Promise<void> =>
    userEvent.click(within(screen.getByLabelText(`${chart} period by`)).getByRole('button', {name: period, hidden: true})),
  findPeriodShown: (chart: string, period: string): Promise<HTMLElement> => screen.findByRole('button', {name: `${chart} period ${period}`}),
  currentPeriod: (chart: string): string =>
    within(screen.getByLabelText(`${chart} period by`)).getByRole('button', {current: true, hidden: true}).textContent ?? '',
  chart,
  findChart,
  onChart,
  findOnChart,
  foundOnChart: (name: string, told: string | RegExp): HTMLElement | null => within(chart(name)).queryByText(told),
  findLoadingOn: async (name: string): Promise<HTMLElement> => within(chart(name)).findByRole('progressbar'),
  loadingOn: (name: string): HTMLElement | null => within(chart(name)).queryByRole('progressbar'),
  ticksOn: (name: string): string[] => within(chart(name)).getAllByRole('time').map(tick => tick.textContent ?? ''),
  missingChart: (name: string): HTMLElement | null => screen.queryByRole('region', {name}),
  chartsNamed: (name: string): HTMLElement[] => screen.getAllByRole('region', {name}),
  recipe: (subject: string): HTMLElement => screen.getByRole('region', {name: `build the ${subject} yourself`}),
  findRecipe: (subject: string): Promise<HTMLElement> => screen.findByRole('region', {name: `build the ${subject} yourself`}),
  findFeatureStories: (): Promise<HTMLElement> => screen.findByRole('region', {name: 'let’s build this feature'}),
  findChartsTab: (): Promise<HTMLElement> => screen.findByRole('region', {name: 'Charts'}),
  tutorial: (chart: string): HTMLElement => screen.getByRole('article', {name: `${chart} tutorial`}),
  anyTutorial: (): HTMLElement | null => screen.queryByRole('article', {name: /tutorial/}),
  findPieLegend: async (): Promise<HTMLElement> => within(await screen.findByRole('region', {name: 'pie'})).getByRole('list'),
  title: (name: string, level: number): HTMLElement => screen.getByRole('heading', {name, level}),
  findTitle: (name: string | RegExp, level?: number): Promise<HTMLElement> => screen.findByRole('heading', {name, level}),
  titleIn: (holder: HTMLElement, name: string | RegExp, level?: number): HTMLElement => within(holder).getByRole('heading', {name, level}),
  deskReport: (): HTMLElement => screen.getByRole('status', {name: 'desk report'}),
  feedStatus,
  trouble: (told: string): HTMLElement => within(alert()).getByText(told),
  findTrouble: async (told: string): Promise<HTMLElement> => within(await screen.findByRole('alert')).findByText(told),
  priceCard,
  onPriceCard: (told: string): HTMLElement => onChart('live trades', told),
  findOnPriceCard: (told: string): Promise<HTMLElement> => findOnChart('live trades', told),
  priceTicks: (): HTMLElement[] => within(priceCard()).getAllByRole('time'),
  drawnCandles: (): number => parseInt(captionOf('candles'), 10),
  drawnPoints: (): number => parseInt(captionOf('live trades'), 10),
  explain: async (chart: string): Promise<void> =>
    userEvent.click(within(await screen.findByRole('region', {name: chart})).getByText('what am I looking at?')),
  explanationOf: (chart: string): HTMLElement => within(explainer(chart)).getByRole('paragraph')
};
