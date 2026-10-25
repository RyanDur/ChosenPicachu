import {createEvent, fireEvent, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const addMenu = (): HTMLElement | null => screen.queryByLabelText('charts to add');

const openAddMenu = (): HTMLElement => {
  const menu = addMenu();
  if (!menu) {
    throw new Error('no add-a-chart menu on the desk');
  }
  return menu;
};

const addChart = async (name: string): Promise<void> =>
  userEvent.click(within(openAddMenu()).getByRole('button', {name, hidden: true}));

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
  offered: (name: string): HTMLElement | null => within(openAddMenu()).queryByRole('button', {name, hidden: true}),
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
  removeButton: (): HTMLElement | null => screen.queryByRole('button', {name: 'remove chart'}),
  anyGrip: (): HTMLElement | null => screen.queryByRole('button', {name: 'move chart', hidden: true}),
  choosePeriod: async (chart: string, period: string): Promise<void> =>
    userEvent.click(within(screen.getByLabelText(`${chart} period by`)).getByRole('button', {name: period, hidden: true})),
  findButton: (name: string): Promise<HTMLElement> => screen.findByRole('button', {name}),
  region: (name: string): HTMLElement => screen.getByRole('region', {name}),
  findRegion: (name: string): Promise<HTMLElement> => screen.findByRole('region', {name}),
  missingRegion: (name: string): HTMLElement | null => screen.queryByRole('region', {name}),
  regionIn: (holder: HTMLElement, name: string): HTMLElement => within(holder).getByRole('region', {name}),
  regions: (name: string): HTMLElement[] => screen.getAllByRole('region', {name}),
  article: (name: string): HTMLElement => screen.getByRole('article', {name}),
  missingArticle: (name: RegExp): HTMLElement | null => screen.queryByRole('article', {name}),
  listIn: (holder: HTMLElement): HTMLElement => within(holder).getByRole('list'),
  heading: (name: string, level: number): HTMLElement => screen.getByRole('heading', {name, level}),
  findHeading: (name: string | RegExp, level?: number): Promise<HTMLElement> => screen.findByRole('heading', {name, level}),
  headingIn: (holder: HTMLElement, name: string, level?: number): HTMLElement => within(holder).getByRole('heading', {name, level}),
  words: (told: string | RegExp): HTMLElement => screen.getByText(told),
  findWords: (told: RegExp): Promise<HTMLElement> => screen.findByText(told),
  wordsIn: (holder: HTMLElement, told: string | RegExp): HTMLElement => within(holder).getByText(told),
  findWordsIn: (holder: HTMLElement, told: string | RegExp): Promise<HTMLElement> => within(holder).findByText(told),
  deskReport: (): HTMLElement => screen.getByRole('status', {name: 'desk report'}),
  urlSearch: (): HTMLElement => screen.getByRole('status', {name: 'url search'}),
  feedStatus: (): HTMLElement => screen.getByRole('status', {name: 'feed'}),
  trouble: (told: string): HTMLElement => within(alert()).getByText(told),
  findTrouble: (told: string): Promise<HTMLElement> => within(alert()).findByText(told),
  priceCard,
  onPriceCard: (told: string): HTMLElement => within(priceCard()).getByText(told),
  findOnPriceCard: (told: string): Promise<HTMLElement> => within(priceCard()).findByText(told),
  drawnCandles: (): number => parseInt(captionOf('candles'), 10),
  drawnPoints: (): number => parseInt(captionOf('live trades'), 10),
  timesIn: (holder: HTMLElement): HTMLElement[] => within(holder).getAllByRole('time'),
  findExplainers: (): Promise<HTMLElement[]> => screen.findAllByText('what am I looking at?'),
  press: async (control: HTMLElement): Promise<void> => userEvent.click(control)
};
