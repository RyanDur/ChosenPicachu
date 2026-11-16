import {render, screen} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {chartPageAt, demosAt} from '@pages/Demos/__test_support';
import {DemoTopics} from '@pages/Demos/demo-topics';
import {chartKinds} from '@pages/Demos/Charts/chart-kinds';
import {practiceAt} from '@pages/Practice/__test_support/practice';
import {concerns} from '@pages/Record/concerns';
import {highlight, Label} from '@pages/Demos/Recipe/highlight';

const pages = [
  ...Object.values(DemoTopics).map(topic => demosAt(topic)),
  ...chartKinds.all.map(kind => chartPageAt(kind)),
  ...concerns.inOrder.map(concern => practiceAt(concerns.idOf(concern)))
];

const settings = [
  '?pace=eager&world=react&type=inclusive&style=reveal',
  '?pace=eager&world=vanilla&type=inclusive&style=drawer',
  '?pace=lazy&world=react&type=inclusive&style=static',
  '?pace=lazy&world=vanilla&type=exclusive&style=reveal',
  '?pace=eager&world=react&type=exclusive&style=drawer',
  '?pace=lazy&world=vanilla&type=exclusive&style=static'
];

type Scanned = {address: string; label: Label; lines: readonly string[]};

const scannedOn = async (address: string): Promise<Scanned[]> => {
  const scans = vi.spyOn(highlight, 'tokensOf');
  const {unmount} = render(<TestApp at={address}/>);
  await screen.findAllByRole('heading', {level: 1});
  const scanned = scans.mock.calls.map(([label, lines]) => ({address, label, lines}));
  scans.mockRestore();
  unmount();
  return scanned;
};

const leavesOpen = ({label, lines}: Scanned): boolean => {
  const probed = highlight.tokensOf(label, [...lines, 'probe']);
  return probed[probed.length - 1].some(({kind}) => kind === 'string' || kind === 'comment');
};

const eachSampleOnce = (scanned: Scanned[]): Scanned[] =>
  [...new Map(scanned.map(sample => [`${sample.label}\n${sample.lines.join('\n')}`, sample])).values()];

describe('every sample the site shows', () => {
  it('ends each excerpt outside a string, a template literal and a block comment, though it may end inside an element a carve cut', async () => {
    const scanned: Scanned[] = [];
    for (const address of pages.flatMap(page => settings.map(setting => page + setting))) {
      scanned.push(...await scannedOn(address));
    }

    expect(eachSampleOnce(scanned).filter(leavesOpen).map(({address, label, lines}) => `${address} ${label}: ${lines[0]}`))
      .toEqual([]);
  }, 60_000);
});
