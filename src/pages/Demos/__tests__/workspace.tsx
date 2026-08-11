import {createEvent, fireEvent, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithMemoryRouter} from '@test-support';
import {EnvProvider} from '@components/Env';
import {DemosPage} from '@pages/Demos/component';
import {ChartPage} from '@pages/Demos/Charts/ChartPage';
import {Paths} from '@pages/Paths';

const routes = (feedUrl: string) => ({children: [
  {path: Paths.demos,
    element: <EnvProvider env={{tradeFeed: feedUrl, tradeHistory: 'http://127.0.0.1:9'}}><DemosPage/></EnvProvider>},
  {path: `${Paths.demos}charts/:kind/`,
    element: <EnvProvider env={{tradeFeed: feedUrl, tradeHistory: 'http://127.0.0.1:9'}}><ChartPage/></EnvProvider>}
]});

export const renderDemos = (feedUrl: string, search = '?tab=charts') =>
  renderWithMemoryRouter(routes(feedUrl), {path: `${Paths.demos}${search}`});

export const renderChartPage = (feedUrl: string, kind: string) =>
  renderWithMemoryRouter(routes(feedUrl), {path: `${Paths.demos}charts/${kind}/`});

export const addMenu = (): HTMLElement | null => {
  const toggle = screen.queryByRole('button', {name: 'Add a chart'});
  if (toggle === null) {
    return null;
  }
  const menu = document.getElementById(toggle.getAttribute('popovertarget') ?? '');
  if (menu === null) {
    throw new Error('the add-chart toggle points at no menu');
  }
  return menu;
};

export const addChart = async (name: string): Promise<void> => {
  const menu = addMenu();
  if (menu === null) {
    throw new Error('no add-a-chart menu on the desk');
  }
  await userEvent.click(within(menu).getByRole('button', {name, hidden: true}));
};

export const doorway = (name: string): HTMLElement => screen.getByRole('link', {name});

export const slot = (name: string): HTMLElement => {
  const seat = doorway(name).closest('li');
  if (seat === null) {
    throw new Error(`the ${name} doorway sits in no seat`);
  }
  return seat;
};

export const keys = (slotName: string, key: string): void => {
  fireEvent.keyDown(doorway(slotName), {key});
};

export const dragChart = (from: string, to: string, handAt: number): void => {
  fireEvent.mouseDown(within(slot(from)).getByRole('button', {name: 'move chart', hidden: true}));
  const start = createEvent.dragStart(slot(from));
  Object.defineProperty(start, 'clientY', {value: 0});
  Object.defineProperty(start, 'dataTransfer', {value: {effectAllowed: '', dropEffect: ''}});
  fireEvent(slot(from), start);
  const over = createEvent.dragOver(slot(to));
  Object.defineProperty(over, 'clientY', {value: handAt});
  Object.defineProperty(over, 'dataTransfer', {value: {dropEffect: ''}});
  fireEvent(slot(to), over);
};

export const releaseDrag = (at: string): void => {
  fireEvent.drop(slot(at));
  fireEvent.dragEnd(slot(at));
};
