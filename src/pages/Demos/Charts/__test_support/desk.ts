import {createEvent, fireEvent, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const addMenu = (): HTMLElement | null => screen.queryByLabelText('charts to add');

const theAddMenu = (): HTMLElement => {
  const menu = addMenu();
  if (!menu) {
    throw new Error('no add-a-chart menu on the desk');
  }
  return menu;
};

const addChart = async (name: string): Promise<void> =>
  userEvent.click(within(theAddMenu()).getByRole('button', {name, hidden: true}));

const doorway = (chart: string): HTMLElement => screen.getByRole('link', {name: `${chart} tutorial`});

const walkThrough = async (chart: string, recipe: string): Promise<HTMLElement> => {
  await userEvent.click(doorway(chart));
  return screen.findByRole('region', {name: recipe});
};

const slot = (chart: string): HTMLElement => {
  const seat = screen.getAllByRole('listitem').find(item => within(item).queryByRole('link', {name: `${chart} tutorial`}) !== null);
  if (!seat) {
    throw new Error(`the ${chart} doorway sits in no seat`);
  }
  return seat;
};

const seat = (at: number): HTMLElement => within(screen.getByRole('list', {name: 'charts'})).getAllByRole('listitem')[at - 1];

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

const priceCard = (): HTMLElement => screen.getByRole('region', {name: 'live trades'});

const alert = (): HTMLElement => screen.getByRole('alert', {hidden: true});

const keys = async (chart: string, key: string): Promise<void> => {
  doorway(chart).focus();
  await userEvent.keyboard(`{${key}}`);
};

const dragChart = async (from: string, to: string, handAt: number): Promise<void> => {
  await userEvent.pointer({keys: '[TouchA>]', target: within(slot(from)).getByRole('button', {name: 'move chart', hidden: true})});
  const start = createEvent.dragStart(slot(from));
  Object.defineProperty(start, 'clientY', {value: 0});
  Object.defineProperty(start, 'dataTransfer', {value: {effectAllowed: '', dropEffect: ''}});
  fireEvent(slot(from), start);
  const over = createEvent.dragOver(slot(to));
  Object.defineProperty(over, 'clientY', {value: handAt});
  Object.defineProperty(over, 'dataTransfer', {value: {dropEffect: ''}});
  fireEvent(slot(to), over);
};

const releaseDrag = (at: string): void => {
  fireEvent.drop(slot(at));
  fireEvent.dragEnd(slot(at));
};

export const chartsDesk = {
  addMenu,
  addChart,
  offered: (name: string): HTMLElement | null => within(theAddMenu()).queryByRole('button', {name, hidden: true}),
  doorway,
  walkThrough,
  slot,
  seat,
  grip,
  fingerOn,
  keys,
  dragChart,
  releaseDrag,
  open: async (chart: string): Promise<void> => userEvent.click(doorway(chart)),
  removeFirst: async (): Promise<void> => userEvent.click(screen.getAllByRole('button', {name: 'remove chart'})[0]),
  removeOnOffer: (): HTMLElement | null => screen.queryByRole('button', {name: 'remove chart'}),
  gripOnOffer: (): HTMLElement | null => screen.queryByRole('button', {name: 'move chart', hidden: true}),
  choosePeriod: async (chart: string, period: string): Promise<void> =>
    userEvent.click(within(screen.getByLabelText(`${chart} period by`)).getByRole('button', {name: period, hidden: true})),
  findPeriodShown: (chart: string, period: string): Promise<HTMLElement> => screen.findByRole('button', {name: `${chart} period ${period}`}),
  chart: (name: string): HTMLElement => screen.getByRole('region', {name}),
  findChart: (name: string): Promise<HTMLElement> => screen.findByRole('region', {name}),
  missingChart: (name: string): HTMLElement | null => screen.queryByRole('region', {name}),
  chartsNamed: (name: string): HTMLElement[] => screen.getAllByRole('region', {name}),
  recipe: (subject: string): HTMLElement => screen.getByRole('region', {name: `build the ${subject} yourself`}),
  findRecipe: (subject: string): Promise<HTMLElement> => screen.findByRole('region', {name: `build the ${subject} yourself`}),
  findFeatureStories: (): Promise<HTMLElement> => screen.findByRole('region', {name: 'let’s build this feature'}),
  findChartsTab: (): Promise<HTMLElement> => screen.findByRole('region', {name: 'Charts'}),
  tutorial: (chart: string): HTMLElement => screen.getByRole('article', {name: `${chart} tutorial`}),
  anyTutorial: (): HTMLElement | null => screen.queryByRole('article', {name: /tutorial/}),
  findPieLegend: async (): Promise<HTMLElement> => within(await screen.findByRole('region', {name: 'pie'})).getByRole('list'),
  drawingIn: (holder: HTMLElement, name: RegExp): HTMLElement => within(holder).getByRole('figure', {name}),
  toldIn: (holder: HTMLElement): string => within(holder).getAllByRole('paragraph').map(paragraph => paragraph.textContent).join(' '),
  title: (name: string, level: number): HTMLElement => screen.getByRole('heading', {name, level}),
  findTitle: (name: string | RegExp, level?: number): Promise<HTMLElement> => screen.findByRole('heading', {name, level}),
  titleIn: (holder: HTMLElement, name: string | RegExp, level?: number): HTMLElement => within(holder).getByRole('heading', {name, level}),
  says: (told: string | RegExp): HTMLElement => screen.getByText(told),
  findSays: (told: RegExp): Promise<HTMLElement> => screen.findByText(told),
  saysIn: (holder: HTMLElement, told: string | RegExp): HTMLElement => within(holder).getByText(told),
  deskReport: (): HTMLElement => screen.getByRole('status', {name: 'desk report'}),
  urlSearch: (): HTMLElement => screen.getByRole('status', {name: 'url search'}),
  feedStatus: (): HTMLElement => screen.getByRole('status', {name: 'feed'}),
  trouble: (told: string): HTMLElement => within(alert()).getByText(told),
  findTrouble: (told: string): Promise<HTMLElement> => within(alert()).findByText(told),
  priceCard,
  onPriceCard: (told: string): HTMLElement => within(priceCard()).getByText(told),
  findOnPriceCard: (told: string): Promise<HTMLElement> => within(priceCard()).findByText(told),
  priceTicks: (): HTMLElement[] => within(priceCard()).getAllByRole('time'),
  drawnCandles: (): number => parseInt(captionOf('candles'), 10),
  drawnPoints: (): number => parseInt(captionOf('live trades'), 10),
  findExplainers: (): Promise<HTMLElement[]> => screen.findAllByText('what am I looking at?'),
  press: async (control: HTMLElement): Promise<void> => userEvent.click(control)
};
