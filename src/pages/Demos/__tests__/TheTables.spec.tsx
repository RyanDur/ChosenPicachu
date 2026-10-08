import {TestApp} from '@__test_support/TestApp';
import {demosAt} from '@pages/Demos/__test_support';
import {fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {broadcast, listeningFeed, tradeFrame} from '@pages/Demos/__test_support/feed';
import {feedIsSubscribed} from '@pages/Demos/__test_support';
import {recipeFolds} from '@pages/Demos/Recipe/__test_support';
import {aggregations, tableControls, untilTheTablesTabRenders} from '@pages/Demos/Tables/__test_support';
import {sortableTable} from '@components/DragSortableTable/__test_support';

const now = 1700000000000;
const fourTrades = [
  tradeFrame(50001, now - 30 * 60000, '0.10', 'bought'),
  tradeFrame(50002, now - 10 * 60000, '0.25', 'sold'),
  tradeFrame(50003, now - 3 * 60000, '0.05', 'bought'),
  tradeFrame(50004, now, '0.01', 'bought')
];

describe('the tables demo', () => {
  test('the fixed windows hold their rows while the stream fills the cells', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);

    await feedIsSubscribed(feed);
    const card = aggregations.card();
    for (const measure of ['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']) {
      expect(within(card).getByRole('columnheader', {name: new RegExp(`^${measure}`)})).toBeVisible();
    }
    expect(within(card).getAllByRole('row')).toHaveLength(6);
    broadcast(feed, fourTrades);
    const rowFor = (label: string) => within(card).getByRole('row', {name: new RegExp(`^${label}`)});
    await waitFor(() => expect(sortableTable.texts(rowFor('this minute'))).toEqual(
      ['this minute', '1', '1', '0', '0.01', '$50,004.00', '+$0.00']));
    expect(sortableTable.texts(rowFor('last 5 minutes'))).toEqual(
      ['last 5 minutes', '2', '2', '0', '0.06', '$50,003.17', '+$1.00']);
    expect(sortableTable.texts(rowFor('last 15 minutes'))).toEqual(
      ['last 15 minutes', '3', '2', '1', '0.31', '$50,002.23', '+$2.00']);
    expect(sortableTable.texts(rowFor('this hour'))).toEqual(
      ['this hour', '4', '3', '1', '0.41', '$50,001.93', '+$3.00']);
    expect(sortableTable.texts(rowFor('session'))).toEqual(
      ['session', '4', '3', '1', '0.41', '$50,001.93', '+$3.00']);
  });

  test('the aggregations say plainly that the grid never grows, and that a sorted column reseats its rows', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);

    await feedIsSubscribed(feed);
    expect(screen.getByText(/trades land\. The grid never grows: no row or column is added or removed\. Only the numbers change, and while a column is sorted, the rows reseat as their numbers do\./)).toBeInTheDocument();
  });

  test('the glider offers a pace, an origin and a motion, eager by default', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);

    await feedIsSubscribed(feed);
    const controls = await tableControls.region();
    for (const axis of ['pace', 'origin', 'motion']) {
      expect(within(controls).getByRole('group', {name: axis})).toBeVisible();
    }
    for (const choice of ['Eager', 'Lazy', 'Keep', 'Hide']) {
      expect(within(controls).getByRole('radio', {name: choice})).toBeVisible();
    }
    expect(within(controls).getByRole('radio', {name: 'Eager'})).toBeChecked();
    expect(within(controls).getByRole('radio', {name: 'Hide'})).toBeChecked();
    expect(within(controls).getByRole('radio', {name: 'Animate'})).toBeChecked();
  });

  test('a dragged column crosses its neighbour under the pointer', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);

    await feedIsSubscribed(feed);
    const card = aggregations.card();
    const header = (name: string) =>
      within(card).getByRole('columnheader', {name: new RegExp(`^${name}`)});
    const table = within(card).getAllByRole('table')[0];
    table.getBoundingClientRect = () => ({
      left: 0, right: 860, top: 0, bottom: 240, width: 860, height: 240, x: 0, y: 0, toJSON: () => ({})
    });
    const spans = [150, 110, 100, 100, 120, 150, 130];
    within(table).getAllByRole('columnheader').forEach((head, at) => {
      head.getBoundingClientRect = () => ({
        left: 0, right: 0, top: 0, bottom: 0, width: spans[at], height: 0, x: 0, y: 0, toJSON: () => ({})
      });
    });
    fireEvent.pointerDown(header('vwap'), {clientX: 700, clientY: 20, pointerId: 1});
    fireEvent.pointerMove(header('vwap'), {buttons: 1, clientX: 40, clientY: 120, pointerId: 1});
    fireEvent.pointerUp(header('vwap'), {pointerId: 1});

    expect(aggregations.columns()).toEqual(['window', 'vwap', 'trades', 'buys', 'sells', 'volume', 'change']);
  });

  test('the windows can trade places by hand', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);

    await feedIsSubscribed(feed);
    const card = aggregations.card();
    const rowOf = (label: string) => within(card).getByRole('row', {name: new RegExp(`^${label}`)});
    const stage = within(card).getAllByRole('table')[0];
    stage.getBoundingClientRect = () => ({
      left: 0, right: 860, top: 0, bottom: 240, width: 860, height: 240, x: 0, y: 0, toJSON: () => ({})
    });
    within(card).getAllByRole('row').slice(1).forEach(row => {
      row.getBoundingClientRect = () => ({
        left: 0, right: 860, top: 0, bottom: 40, width: 860, height: 40, x: 0, y: 0, toJSON: () => ({})
      });
    });
    const grip = within(rowOf('session')).getByLabelText(/move row/);
    fireEvent.pointerDown(grip, {clientX: 100, clientY: 300, pointerId: 1});
    fireEvent.pointerMove(grip, {buttons: 1, clientX: 100, clientY: 50, pointerId: 1});
    fireEvent.pointerUp(grip, {pointerId: 1});

    expect(aggregations.windows()).toEqual(['session', 'this minute', 'last 5 minutes', 'last 15 minutes', 'this hour']);
  });

  test('a direction from a column menu sorts the windows', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);

    await feedIsSubscribed(feed);
    broadcast(feed, fourTrades);
    await aggregations.counted(fourTrades.length);

    await aggregations.sort('trades', 'descending');

    expect(aggregations.windows()).toEqual(['this hour', 'session', 'last 15 minutes', 'last 5 minutes', 'this minute']);
    expect(within(aggregations.card()).getByRole('columnheader', {name: /^trades/}))
      .toHaveAttribute('aria-sort', 'descending');
  });

  test('while a column is sorted, the windows reseat as trades change their numbers', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);

    await feedIsSubscribed(feed);
    broadcast(feed, fourTrades);
    await aggregations.counted(fourTrades.length);
    await aggregations.sort('vwap', 'descending');
    expect(aggregations.windows()).toEqual(['this minute', 'last 5 minutes', 'last 15 minutes', 'this hour', 'session']);

    broadcast(feed, [tradeFrame(40000, now, '10', 'sold')]);

    await waitFor(() => expect(aggregations.windows()).toEqual(['this hour', 'session', 'last 15 minutes', 'last 5 minutes', 'this minute']));
  });

  test('the controls fold behind their readout', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);

    await feedIsSubscribed(feed);
    expect(await screen.findByRole('group', {name: 'settings'}, untilTheTablesTabRenders)).toHaveAttribute('open');
    expect(screen.getByText('<EagerTable className="hide animated"/>')).toBeVisible();

    await tableControls.pressSettings();
    expect(screen.getByRole('region', {name: 'table controls'})).not.toBeVisible();
    expect(screen.getByText('<EagerTable className="hide animated"/>')).toBeVisible();
  });

  test("the controls' prompt reads settings apart from its readout", async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);

    await feedIsSubscribed(feed);
    expect(await screen.findByRole('group', {name: 'settings'})).toHaveTextContent(/^settings \S/);
  });

  test('the controls read out whatever is chosen', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);

    await feedIsSubscribed(feed);
    const controls = await tableControls.region();
    expect(controls).toHaveTextContent(/Neighbours swap the moment you drag past them/);
    expect(controls).toHaveTextContent(/rides the pointer, cells and all/);
    expect(controls).toHaveTextContent(/slide to their new seats/);
    expect(screen.getByText('<EagerTable className="hide animated"/>')).toBeVisible();

    await userEvent.click(within(controls).getByRole('radio', {name: 'Lazy'}));
    await userEvent.click(within(controls).getByRole('radio', {name: 'Keep'}));
    await userEvent.click(within(controls).getByRole('radio', {name: 'Static'}));

    expect(controls).toHaveTextContent(/dispatches the new order on drop/);
    expect(controls).toHaveTextContent(/stays where it was/);
    expect(controls).toHaveTextContent(/gives them no time/);
    expect(screen.getByText('<LazyTable className="keep static"/>')).toBeVisible();
    expect(controls).not.toHaveTextContent(/Neighbours swap/);
  });

  test('the arrangement survives a change of table: the order belongs to the page', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);

    await feedIsSubscribed(feed);
    const card = aggregations.card();
    expect(aggregations.windows().slice(0, 2)).toEqual(['this minute', 'last 5 minutes']);

    within(card).getByRole('button', {name: 'move row 1'}).focus();
    await userEvent.keyboard('{ArrowDown}');
    within(card).getByRole('columnheader', {name: /^trades/}).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(aggregations.windows().slice(0, 2)).toEqual(['last 5 minutes', 'this minute']);

    const controls = await tableControls.region();
    await userEvent.click(within(controls).getByRole('radio', {name: 'Lazy'}));
    await userEvent.click(within(controls).getByRole('radio', {name: 'Static'}));

    expect(screen.getByText('<LazyTable className="hide static"/>')).toBeVisible();
    expect(aggregations.windows().slice(0, 2)).toEqual(['last 5 minutes', 'this minute']);
    expect(aggregations.columns().slice(0, 3)).toEqual(['window', 'buys', 'trades']);
  });

  test('the recipe opens on the need with its stories closed', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the drag sort yourself'});

    expect(recipe).toBeVisible();
    expect(recipe).toHaveTextContent(/no drag-and-drop library/);
    expect(recipeFolds.story(recipe, 'The trader can sort by column')).not.toHaveAttribute('open');
    expect(recipeFolds.story(recipe, 'The trader can sort by row')).not.toHaveAttribute('open');
    expect(recipe).toHaveTextContent(/The sort happens while you drag/);
  });

  test('the recipe walks from need to design to interpretation', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await screen.findByRole('region', {name: 'build the drag sort yourself'});

    expect(screen.getByRole('heading', {name: 'let’s build this feature'})).toBeVisible();
    expect(screen.getByText(/I watch the market all day/)).toBeVisible();
    expect(screen.getByRole('heading', {name: 'Start with the need, and let it pick the element'})).toBeVisible();
    expect(screen.getByRole('heading', {name: 'The trader can watch the live market in windows they arrange'})).toBeVisible();
    expect(screen.getByText(/so that what they compare sits side by side/)).toBeVisible();
    expect(screen.getByRole('columnheader', {name: 'what it tells you'})).toBeVisible();
    expect(screen.getByRole('rowheader', {name: /keep themselves current/})).toBeVisible();
    expect(screen.getByRole('heading', {name: 'Sketch a design from the need'})).toBeVisible();
    expect(screen.getByRole('complementary', {name: 'what a design cannot tell you'})).toBeVisible();
    expect(screen.getByText(/keep building on your best interpretation/)).toBeVisible();
    expect(screen.getByText(/What you see above is our interpretation of that/)).toBeVisible();
  });

  test('the recipe’s tables name their rows and columns', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await screen.findByRole('region', {name: 'build the drag sort yourself'});

    const clues = within(screen.getByRole('region', {name: 'Start with the need, and let it pick the element'})).getByRole('table', {name: 'the clues'});
    expect(within(clues).getAllByRole('columnheader')).toHaveLength(2);
    expect(within(clues).getAllByRole('rowheader')).toHaveLength(5);
    const layers = screen.getByRole('table', {name: 'the layers'});
    expect(within(layers).getAllByRole('columnheader')).toHaveLength(4);
    expect(within(layers).getAllByRole('rowheader')).toHaveLength(4);
    const sketch = within(screen.getByRole('region', {name: 'Sketch a design from the need'}));
    for (const measure of ['trades', 'buys', 'sells', 'volume', 'vwap', 'change']) {
      expect(sketch.getByRole('columnheader', {name: measure})).toBeVisible();
    }
    expect(sketch.getAllByRole('columnheader')).toHaveLength(7);
    expect(sketch.getAllByRole('rowheader')).toHaveLength(5);
  });

  test('the slices point at their stations', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await screen.findByRole('region', {name: 'build the drag sort yourself'});

    expect(screen.getByRole('heading', {name: 'Slice the design into stories'})).toBeVisible();
    const sliced = within(screen.getByRole('list', {name: 'the slices'}));
    [['The trader can read the market in a table', 'station 4'],
      ['The trader can watch the market live, in windows', 'station 5'],
      ['The trader can sort by column, and by row', 'station 6'],
      ['The trader can sort the windows by any measure, or take the order back', 'station 6'],
      ['The trader can widen a column', 'station 6']
    ].forEach(([slice, station]) =>
      expect(sliced.getAllByRole('listitem').find(item => within(item).queryByText(slice) !== null)).toHaveTextContent(station));
    expect(sliced.getAllByRole('link').map(link => link.getAttribute('href')))
      .toEqual(['#station-4', '#station-5', '#station-6', '#station-6', '#station-6']);
    [['station-4', 'The trader can read the market in a table'],
      ['station-5', 'The trader can watch the market live, in windows'],
      ['station-6', 'Layer on functionality, in the order it was asked for']
    ].forEach(([id, holds]) =>
      expect(within(screen.getByRole('list', {name: 'the stations'})).getAllByRole('listitem')
        .filter(station => within(station).queryAllByText(holds).length > 0).map(station => station.id)).toContain(id));
  });

  test('the recipe links out to the user story', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await screen.findByRole('region', {name: 'build the drag sort yourself'});

    expect(screen.getByRole('link', {name: 'user story'}))
      .toHaveAttribute('href', expect.stringContaining('initialcapacity.io/insights/user-story'));
  });

  test('the still table and the living table each tell their part', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await screen.findByRole('region', {name: 'build the drag sort yourself'});

    const still = screen.getByRole('region', {name: 'the still table'});
    expect(still).toBeVisible();
    expect(recipeFolds.story(still, 'The trader can read the market in a table')).toBeInTheDocument();
    expect(still).toHaveTextContent(/Deal a real HTML table/);
    expect(still).toHaveTextContent(/scope="col"/);
    expect(still).toHaveTextContent(/that is what a table is for/);
    expect(still).not.toHaveTextContent(/The page is a store/);
    const living = screen.getByRole('region', {name: 'the living table'});
    expect(living).toBeVisible();
    expect(recipeFolds.story(living, 'The trader can watch the market live, in windows')).toBeInTheDocument();
    expect(recipeFolds.story(living, 'The page is a store, and so is the table')).toBeInTheDocument();
    expect(living).toHaveTextContent(/Actions are data, and one reducer reads them/);
    expect(living).toHaveTextContent(/The exchange is middleware/);
    expect(living).toHaveTextContent(/export const demosStore/);
    expect(living).toHaveTextContent(/a socket comes next/);
    expect(living).toHaveTextContent(/Start with the recent past, in one fetch/);
    expect(living).toHaveTextContent(/where a number comes from/);
    expect(living).toHaveTextContent(/Drawn, not recorded/);
  });

  test('layering keeps both axes', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await screen.findByRole('region', {name: 'build the drag sort yourself'});

    expect(screen.getByRole('heading', {name: 'Layer on functionality, in the order it was asked for'})).toBeVisible();
    expect(screen.getByText(/Both axes, every layer, or the layer is not done/)).toBeVisible();
    expect(screen.getByRole('columnheader', {name: 'by keyboard'})).toBeVisible();
    expect(screen.getByRole('rowheader', {name: 'Widen a column'})).toBeVisible();
  });

  test('each layer’s facts say their heading in their own words, so they pair without the table', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await screen.findByRole('region', {name: 'build the drag sort yourself'});

    expect(screen.getByRole('cell', {name: 'by mouse drag the edge'})).toBeInTheDocument();
    expect(screen.getByRole('cell', {name: 'by keyboard arrows on the handle'})).toBeInTheDocument();
    expect(screen.getByRole('cell', {name: 'asked for by precision they can actually read'})).toBeInTheDocument();
  });

  test('opening the sort by column story shows the drag build with its steps closed', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the drag sort yourself'});

    await userEvent.click(within(recipe).getByText(/The trader can sort by column/));

    expect(recipeFolds.story(recipe, 'The trader can sort by column')).toHaveAttribute('open');
    expect(recipeFolds.reveals(recipe).length).toBeGreaterThan(0);
    expect(recipeFolds.opened(recipeFolds.reveals(recipe))).toHaveLength(0);
  });

  test('the drag build shows the code and links out to it', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the drag sort yourself'});

    await userEvent.click(within(recipe).getByText(/The trader can sort by column/));

    expect(within(recipe).getByRole('link', {name: /Drag sort list demo/}))
      .toHaveAttribute('href', expect.stringContaining('tab=dragAndDrop'));
    expect(recipe).toHaveTextContent(/touch-action/);
    expect(recipe).toHaveTextContent(/Write each listener once, for both worlds/);
    const [definition] = within(recipe).getAllByLabelText('survey');
    expect(definition).toHaveTextContent(/the one measurement taken at the grab/);
    expect(recipe).toHaveTextContent(/export type Store<State, Action>/);
    expect(recipe).toHaveTextContent(/Commit inside the move/);
    expect(recipe).toHaveTextContent(/Carry the real thing/);
    expect(recipe).toHaveTextContent(/translate: calc\(var\(--seat-x\) \+ var\(--drift-x\)\)/);
    expect(within(recipe).getAllByRole('link', {name: 'the implementation'})[0])
      .toHaveAttribute('href', 'https://github.com/RyanDur/ChosenPicachu/tree/main/src/pages/Demos/Tables/Builds/EagerTable');
    expect(recipe).toHaveTextContent(/Let the column settle/);
    expect(recipe).toHaveTextContent(/the only motion code there is; the table wears the word animated/);
    expect(recipe).toHaveTextContent(/@keyframes settle \{/);
    expect(recipe).toHaveTextContent(/Turn the carry vertical/);
    expect(within(recipe).getByRole('link', {name: 'insertBefore'}))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore'));
  });

  test('the carry step declares the four numbers the carried cells read, and says what @property is', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the drag sort yourself'});

    await userEvent.click(within(recipe).getByText(/The trader can sort by column/));

    expect(recipe).toHaveTextContent(/Carry the real thing[^]*@property --seat-x \{[^]*@property --seat-y \{[^]*@property --drift-x \{[^]*@property --drift-y \{[^]*\.sortable\.hide \.carried \{/);
    expect(recipe).toHaveTextContent('two numbers every carried cell wears as custom properties, values set by name on the cell and read back in the stylesheet with var(): the seat,');
    expect(recipe).toHaveTextContent('The sheet declares the seat and the drift with @property, a rule that gives a custom property a type and a starting value: each is a length that starts at 0px, so a carried cell with no numbers on it yet stays in its seat.');
  });

  test('the keep step declares the same four numbers, and says what @property is, for a reader who keeps the origin', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the drag sort yourself'});

    await userEvent.click(within(recipe).getByText(/The trader can sort by column/));
    await userEvent.click(within(recipe).getByRole('radio', {name: 'Keep'}));

    expect(recipe).toHaveTextContent('the carried cells still wear their seat and their drift as custom properties, values set by name on the cell and read back in the stylesheet with var(), and the keep sheet simply never adds them up.');
    expect(recipe).toHaveTextContent(/Leave the origin in place[^]*@property --seat-x \{[^]*@property --seat-y \{[^]*@property --drift-x \{[^]*@property --drift-y \{[^]*\.sortable\.hide \.carried \{/);
    expect(recipe).toHaveTextContent('The sheet declares the seat and the drift with @property, a rule that gives a custom property a type and a starting value: each is a length that starts at 0px.');
    expect(recipe).not.toHaveTextContent(/stays in its seat/);
  });

  test('the recipe teaches whatever the dials are set to', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the drag sort yourself'});
    await userEvent.click(within(recipe).getByText(/The trader can sort by column/));
    await userEvent.click(within(recipe).getByText(/The trader can sort by row/));

    await userEvent.click(within(recipe).getByRole('radio', {name: 'Lazy'}));
    await userEvent.click(within(recipe).getByRole('radio', {name: 'Keep'}));
    await userEvent.click(within(recipe).getByRole('radio', {name: 'Static'}));

    expect(recipeFolds.story(recipe, 'The trader can sort by row')).toHaveAttribute('open');
    expect(recipe).toHaveTextContent(/Hold still, dispatch on release/);
    expect(recipe).toHaveTextContent(/the sort lands on the drop/);
    expect(recipe).toHaveTextContent(/stays where it stands while you drag/);
    expect(recipe).toHaveTextContent(/instantly, with no motion/);
    expect(recipe).toHaveTextContent(/Leave the origin in place/);
    expect(recipe).toHaveTextContent(/Leave the motion out/);
    expect(recipe).not.toHaveTextContent(/1cqi/);
    expect(recipe).not.toHaveTextContent(/Commit inside the move/);
    expect(await tableControls.chosenDials()).toEqual(['Lazy', 'Keep', 'Static']);
  });

  test('a hash arriving in the url is brought to its station', async () => {
    const brought: string[] = [];
    Element.prototype.scrollIntoView = function (this: Element) {
      brought.push(this.id);
    };
    const feed = await listeningFeed();
    try {
      render(<TestApp at={`${demosAt('?tab=tables')}#station-5`} feed={feed}/>);
      await feedIsSubscribed(feed);

      await screen.findByRole('heading', {name: 'Slice the design into stories'});
      expect(brought).toContain('station-5');
    } finally {
      Element.prototype.scrollIntoView = () => undefined;
    }
  });

  test('the keyboard track teaches the same sort by other hands', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);

    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the drag sort yourself'});
    await userEvent.click(within(recipe).getByRole('radio', {name: 'By keyboard'}));

    expect(recipe).toHaveTextContent(/Give focus a place to land/);
    expect(recipe).toHaveTextContent(/Arrows speak direction/);
    expect(recipe).toHaveTextContent(/Both parties slide/);
    expect(recipe).toHaveTextContent(/the stylesheet slides them/);
    await userEvent.click(within(recipe).getByText(/The trader can sort by column/));
    expect(recipe).toHaveTextContent(/measures the header row at the keypress/);
    expect(recipe).toHaveTextContent(/The trader can sort by row/);
    expect(recipe).toHaveTextContent(/Turn the arrows vertical/);
    expect(recipeFolds.story(recipe, 'The trader can sort by row')).toBeInTheDocument();
    expect(recipe).not.toHaveTextContent(/Hold the pointer from the lift/);
    expect(within(recipe).queryByRole('radio', {name: 'Lazy'})).not.toBeInTheDocument();
  });

  test('the keyboard track answers the motion dial', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=tables&track=keyboard')} feed={feed}/>);

    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the drag sort yourself'});
    expect(recipe).toHaveTextContent(/Both parties slide/);

    await userEvent.click(within(recipe).getByRole('radio', {name: 'Static'}));

    expect(recipe).toHaveTextContent(/Cut on the keypress/);
    expect(recipe).not.toHaveTextContent(/Both parties slide/);
  });

  test('switching back to the pointer track restores its road', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=tables&track=keyboard')} feed={feed}/>);

    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the drag sort yourself'});

    await userEvent.click(within(recipe).getByRole('radio', {name: 'By pointer'}));

    expect(recipe).toHaveTextContent(/Hold the pointer from the lift/);
  });

  test('the chosen track travels in the url', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=tables&track=keyboard')} feed={feed}/>);

    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the drag sort yourself'});
    expect(recipe).toHaveTextContent(/Arrows speak direction/);
    expect(recipe).not.toHaveTextContent(/Hold the pointer from the lift/);
  });

  test('choosing drag resize swaps in the resize tutorial', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);

    await feedIsSubscribed(feed);
    expect(await screen.findByRole('region', {name: 'build the drag sort yourself'})).toBeVisible();
    expect(screen.queryByRole('region', {name: 'build the drag resize yourself'})).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('radio', {name: 'Drag resize'}));

    const resize = await screen.findByRole('region', {name: 'build the drag resize yourself'});
    expect(resize).toBeVisible();
    expect(resize).toHaveTextContent(/zero-sum ledger/);
    expect(resize).toHaveTextContent(/Trade, never take/);
    expect(resize).toHaveTextContent(/A handle that is a button/);
    expect(recipeFolds.story(resize, 'The trader can widen a column')).toBeInTheDocument();
    expect(within(resize).getByRole('link', {name: 'captures its pointer'}))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org/en-US/docs/Web/API/Element/setPointerCapture'));
    expect(screen.queryByRole('region', {name: 'build the drag sort yourself'})).not.toBeInTheDocument();
    expect(screen.queryByRole('region', {name: 'table controls'})).not.toBeInTheDocument();
    expect(screen.getByRole('region', {name: 'the living table'})).toBeVisible();
  });

  test('the resize build shows a column’s floor beside the trade that clamps to it', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);
    await feedIsSubscribed(feed);

    await userEvent.click(await screen.findByRole('radio', {name: 'Drag resize'}));

    const resize = await screen.findByRole('region', {name: 'build the drag resize yourself'});
    expect(resize).toHaveTextContent(/neither side drops below its floor/);
    expect(resize).toHaveTextContent(/never less than the slimmest share, 5% of the table/);
    expect(resize).toHaveTextContent(/const SLIMMEST = 5;[^]*const floorOf = [^]*Math\.max\(SLIMMEST[^]*export const traded/);
  });

  test('the resize build says the handle stops both its press and its arrow keys from bubbling to the header', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);
    await feedIsSubscribed(feed);

    await userEvent.click(await screen.findByRole('radio', {name: 'Drag resize'}));

    const resize = await screen.findByRole('region', {name: 'build the drag resize yourself'});
    expect(resize).toHaveTextContent(/A press on the handle would bubble, which means the browser hands it on to the header around it/);
    expect(resize).toHaveTextContent(/Arrow keys on a focused handle make the same trade, one fixed step per arrow/);
    expect(resize).toHaveTextContent(/The handle stops those keys from bubbling too, so the header’s own arrow keys never move the column/);
    expect(resize).toHaveTextContent(/It should stop those keys there as well, because the header answers arrow keys by moving the column/);
  });

  test('the resize build no longer speaks of a descent or a road', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);
    await feedIsSubscribed(feed);

    await userEvent.click(await screen.findByRole('radio', {name: 'Drag resize'}));

    expect(await screen.findByRole('region', {name: 'build the drag resize yourself'})).not.toHaveTextContent(/\bdescent\b|\broad\b/);
  });

  test('choosing drag sort brings the sort tutorial back', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);

    await feedIsSubscribed(feed);
    await userEvent.click(await screen.findByRole('radio', {name: 'Drag resize'}));
    await screen.findByRole('region', {name: 'build the drag resize yourself'});

    await userEvent.click(screen.getByRole('radio', {name: 'Drag sort'}));

    expect(await screen.findByRole('region', {name: 'build the drag sort yourself'})).toBeVisible();
  });

  test('the open cards travel in the url', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=tables&sort=column')} feed={feed}/>);

    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the drag sort yourself'});
    expect(recipeFolds.story(recipe, 'The trader can sort by column')).toHaveAttribute('open');
    expect(recipeFolds.story(recipe, 'The trader can sort by row')).not.toHaveAttribute('open');
    const living = screen.getByRole('region', {name: 'the living table'});
    expect(recipeFolds.story(living, 'The trader can watch the market live, in windows')).not.toHaveAttribute('open');
    expect(recipeFolds.story(living, 'The page is a store, and so is the table')).not.toHaveAttribute('open');
  });

  test('a story folds shut without folding the story beside it', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables&sort=column,row')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the drag sort yourself'});
    expect(recipeFolds.story(recipe, 'The trader can sort by row')).toHaveAttribute('open');

    const column = await recipeFolds.press(recipe, 'The trader can sort by column');

    expect(column).not.toHaveAttribute('open');
    expect(recipeFolds.story(recipe, 'The trader can sort by row')).toHaveAttribute('open');
    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent('sort=row');
  });

  test('the address holds every story the trader opens', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the drag sort yourself'});

    const column = await recipeFolds.press(recipe, 'The trader can sort by column');
    const row = await recipeFolds.press(recipe, 'The trader can sort by row');

    expect(column).toHaveAttribute('open');
    expect(row).toHaveAttribute('open');
    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent('sort=column%2Crow');
  });

  test("a story card's tally matches the steps the recipe renders", async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the drag sort yourself'});

    const column = await recipeFolds.press(recipe, 'The trader can sort by column');

    expect(within(column).getByText(`${recipeFolds.steps(column).length} steps`)).toBeVisible();
  });

  test('a story card with one step says step, not steps', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the drag sort yourself'});

    expect(within(recipeFolds.story(recipe, 'The trader can sort by row')).getByText('1 step')).toBeVisible();
  });

  test('the dials travel in the url', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=tables&pace=lazy&origin=keep&motion=static')} feed={feed}/>);

    await feedIsSubscribed(feed);
    expect(await tableControls.chosenDials()).toEqual(['Lazy', 'Keep', 'Static']);
    expect(screen.getByText('<LazyTable className="keep static"/>')).toBeVisible();
  });

  test('the sort menu build says the toggle and the menu stop a press from bubbling to the header', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);

    await feedIsSubscribed(feed);
    await userEvent.click(screen.getByRole('radio', {name: 'Sort menu'}));

    const recipe = await screen.findByRole('region', {name: 'build the sort menu yourself'});
    expect(recipe).toHaveTextContent(/should stop a press from bubbling up to the header around them, so the header never hears it/);
  });

  test('the sort menu build no longer speaks of a descent', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);

    await feedIsSubscribed(feed);
    await userEvent.click(screen.getByRole('radio', {name: 'Sort menu'}));

    expect(await screen.findByRole('region', {name: 'build the sort menu yourself'})).not.toHaveTextContent(/\bdescent\b/);
  });

  test('choosing the sort menu swaps in the sort menu tutorial', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);

    await feedIsSubscribed(feed);
    await userEvent.click(screen.getByRole('radio', {name: 'Sort menu'}));

    const recipe = await screen.findByRole('region', {name: 'build the sort menu yourself'});
    expect(recipe).toBeVisible();
    expect(recipe).toHaveTextContent(/popover/);
    expect(recipe).toHaveTextContent(/position-area/);
    expect(recipe).toHaveTextContent(/The sort keeps sorting/);
    expect(recipe).toHaveTextContent(/A hand ends the sort/);
    expect(recipe).toHaveTextContent(/onSorted\?\.\(\{column, direction}\)/);
    expect(recipe).not.toHaveTextContent(/Dress the menu as a card/);
    expect(within(recipe).getByRole('link', {name: 'position-area'}))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org/en-US/docs/Web/CSS/position-area'));
    expect(recipeFolds.story(recipe, 'The trader can sort the windows by any measure, or take the order back')).toBeInTheDocument();
    expect(screen.queryByRole('region', {name: 'build the drag sort yourself'})).not.toBeInTheDocument();
    expect(screen.queryByRole('region', {name: 'table controls'})).not.toBeInTheDocument();
    expect(screen.getByRole('region', {name: 'the living table'})).toBeVisible();

    expect(recipe).toHaveTextContent(/Sort directly/);
    expect(recipe).toHaveTextContent(/a menu click has none/);
  });

  test('the chosen tutorial travels in the url', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=tables&tut=resize')} feed={feed}/>);

    await feedIsSubscribed(feed);
    expect(await screen.findByRole('region', {name: 'build the drag resize yourself'})).toBeVisible();
    expect(screen.queryByRole('region', {name: 'build the drag sort yourself'})).not.toBeInTheDocument();
  });

  test('every column is resizable', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);

    await feedIsSubscribed(feed);
    const card = aggregations.card();
    expect(within(card).getAllByRole('button', {name: /^resize/})).toHaveLength(7);
  });

  describe('the table worlds', () => {
    const standFrame = async (height = 487) => {
      const frame = await screen.findByTitle('the living table, in vanilla');
      Object.defineProperty(frame, 'contentDocument', {
        value: {body: {getBoundingClientRect: () => ({height})}}
      });
      fireEvent.load(frame);
      return frame;
    };

    test('react holds the stage by default, and no frame stands', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);
      await feedIsSubscribed(feed);

      expect(await screen.findByRole('region', {name: 'live aggregations'})).toBeInTheDocument();
      expect(screen.queryByTitle('the living table, in vanilla')).not.toBeInTheDocument();
    });

    test('the html world deals the table in its own document', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('?tab=tables&world=vanilla')} feed={feed}/>);
      await feedIsSubscribed(feed);

      const frame = await standFrame();
      expect(frame).toHaveAttribute('srcdoc', expect.stringContaining('<table'));
      const card = aggregations.card();
      expect(card).toContainElement(frame);
      await waitFor(() => expect(within(card).queryByRole('table')).not.toBeInTheDocument());
    });

    test('the fallback table leaves as soon as the frame loads, even before it reports a height', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('?tab=tables&world=vanilla')} feed={feed}/>);
      await feedIsSubscribed(feed);

      await standFrame(0);
      const card = aggregations.card();
      await waitFor(() => expect(within(card).queryByRole('table')).not.toBeInTheDocument());
    });

    test('the tutorial stands unchanged in the html world', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('?tab=tables&world=vanilla')} feed={feed}/>);
      await feedIsSubscribed(feed);

      expect(await screen.findByRole('heading', {name: 'The trader can watch the market live, in windows'})).toBeInTheDocument();
      expect(screen.getByText('Drag resize')).toBeInTheDocument();
    });

    test('only the build under the tutorial swaps', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('?tab=tables&world=vanilla')} feed={feed}/>);
      await feedIsSubscribed(feed);

      expect((await screen.findAllByRole('radio', {name: 'Eager', hidden: true})).length).toBeGreaterThan(0);
      expect(screen.queryByText('The trader can read the market in windows')).not.toBeInTheDocument();
    });

    test('the menu story stands in the html world', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('?tab=tables&world=vanilla&tut=menu')} feed={feed}/>);
      await feedIsSubscribed(feed);

      expect(await screen.findByRole('heading', {name: 'The trader can sort the windows by any measure, or take the order back'})).toBeInTheDocument();
    });

    test('the resize story stands in the html world', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('?tab=tables&world=vanilla&tut=resize')} feed={feed}/>);
      await feedIsSubscribed(feed);

      expect(await screen.findByRole('heading', {name: 'The trader can widen a column'})).toBeInTheDocument();
    });

    test.each(['react', 'vanilla'])('the sort tutorial stands on both tracks in the %s world', async world => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt(`?tab=tables&tut=sort&world=${world}`)} feed={feed}/>);

      expect(await screen.findByText('The trader can sort by column')).toBeInTheDocument();
      await userEvent.click(screen.getByRole('radio', {name: 'By keyboard'}));
      expect(await screen.findByText('Give focus a place to land')).toBeInTheDocument();
    });

    test('the explainer stands in the html world too', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('?tab=tables&world=vanilla')} feed={feed}/>);
      await feedIsSubscribed(feed);

      expect(await screen.findByText('what am I looking at?')).toBeInTheDocument();
      expect(screen.getByTitle('the living table, in vanilla')).toBeInTheDocument();
    });

    test('the frame wears its own document\u2019s height', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('?tab=tables&world=vanilla')} feed={feed}/>);
      await feedIsSubscribed(feed);

      const frame = await standFrame();

      expect(frame).toHaveStyle({'--stage-block-size': '487px'});
    });

    test('the world dial swaps the stage', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);
      await feedIsSubscribed(feed);

      await userEvent.click(await screen.findByRole('radio', {name: 'Vanilla'}));

      const frame = await standFrame();
      const card = aggregations.card();
      expect(card).toContainElement(frame);
      await waitFor(() => expect(within(card).queryByRole('table')).not.toBeInTheDocument());
    });
  });
});

describe('the living table’s terms', () => {
  test.each([
    ['store', 'one object that holds the state. You read the state from it, send it an action with dispatch to change it, and subscribe to be told when it has changed'],
    ['action', 'a plain record of something that happened: a type that names it, and the facts about it. dispatch hands it to the reducer'],
    ['reducer', 'the function that takes the state as it was and an action, and returns the state as it now is. It never changes the old state'],
    ['slice', 'a reducer together with the state it starts from. A store with more than one concern joins several slices, each under its own key and each seeing only its own part'],
    ['selector', 'a named function that takes the state and returns one answer from it. Its name says what is being asked'],
    ['middleware', 'code that sits between dispatch and the reducer. It sees every action first, passes it on or not, and can dispatch actions of its own'],
    ['provider', 'a React component that makes one value, here the store’s state and its dispatch, available to every component inside it'],
    ['hook', 'a function, named use and something, that a React component calls to get state or behaviour from React'],
    ['effect', 'code React runs after it has updated the page'],
    ['hydrate', 'fill the table with the recent past, fetched once, and join it to the live trades']
  ])('should define %s in plain words where the living table first uses it', async (term, definition) => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const livingTable = await screen.findByRole('region', {name: 'the living table'});
    const [defined] = within(livingTable).getAllByLabelText(term);

    expect(defined).toHaveTextContent(definition);
  });

  test('should define the ledger in plain words where the still table first uses it', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await screen.findByRole('region', {name: 'the living table'});
    const [defined] = within(screen.getByRole('region', {name: 'the still table'})).getAllByLabelText('ledger');

    expect(defined).toHaveTextContent('the table’s record of each column’s share of the width. It starts at the first touch of a resize handle, by focus or by press, and what one column gains its neighbour gives up');
  });

  test('should say what Redux is where the store story first names it', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const livingTable = await screen.findByRole('region', {name: 'the living table'});
    expect(livingTable).toHaveTextContent('Redux is a JavaScript library that keeps an application’s state in one store, and this page borrows that shape and none of its code.');
  });

  test('should open the store story with the terms its steps lean on', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const livingTable = await screen.findByRole('region', {name: 'the living table'});
    const story = recipeFolds.story(livingTable, 'The page is a store, and so is the table');
    const opening = within(story).getByText(/^One value holds the trades/);

    ['action', 'reducer', 'selector', 'middleware'].forEach(term => expect(within(opening).getByLabelText(term)).toBeInTheDocument());
  });

  test.each([
    ['the page’s store is three slices', 'The page’s store is three: the trades, the candles and the arrangement.'],
    ['the exchange answers three actions', 'The exchange is that layer, in both worlds, and it answers three actions.'],
    ['the exchange fetches candles', 'On candlesAsked it fetches the candles for one period, and dispatches candlesArrived or candlesRefused.'],
    ['the table’s reducer combines four', 'The table’s reducer is four small reducers combined, one per concern: motion, widths, dragging and sorting.']
  ])('should say %s, as the code does', async (_fact, sentence) => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const livingTable = await screen.findByRole('region', {name: 'the living table'});
    expect(livingTable).toHaveTextContent(sentence);
  });

  test('should say what useSyncExternalStore is where the React world subscribes through it', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const livingTable = await screen.findByRole('region', {name: 'the living table'});
    expect(livingTable).toHaveTextContent('useSyncExternalStore, React’s hook for reading a store kept outside React');
  });
});

describe('the drag sort recipe’s words', () => {
  test('should title the slots drawing where a switch counts', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the drag sort yourself'});
    expect(within(recipe).getByRole('figure', {name: /^Where a switch counts\. /})).toBeInTheDocument();
  });

  test.each([
    ['the drawing', 'A dead zone at the near edge of its neighbour holds still: a quarter of the neighbour’s width, or more when the neighbour is much the wider. Past it, the two switch.'],
    ['the walk', 'To find the column under the pointer, the code adds the columns’ widths from the left until the total passes the pointer’s x.'],
    ['the dead zone', 'The dead zone is a quarter of that column’s width, or half the difference between it and the carried column when that is more,'],
    ['the plain boundary', 'switch a narrow column past a wide one at first touch, and the wide one lands back under the resting pointer, ready to switch straight back.']
  ])('should say where a switch counts as the code decides it, in %s', async (_where, sentence) => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the drag sort yourself'});
    expect(recipe).toHaveTextContent(sentence);
  });

  test('should not say only the inner half switches', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the drag sort yourself'});
    expect(recipe).not.toHaveTextContent(/inner half/);
  });

  test('should define reconcile in plain words where the drag sort recipe first uses it', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the drag sort yourself'});
    const [defined] = within(recipe).getAllByLabelText('reconcile');

    expect(defined).toHaveTextContent('changing the page’s elements to match the state, touching only the ones that differ');
  });
});

describe('the classes the table wears, as its recipes tell them', () => {
  test.each(['react', 'vanilla'])('should name the menu toggle’s classes in the %s world, with their blocks after its rule', async world => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt(`?tab=tables&tut=menu&world=${world}`)} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the sort menu yourself'}, untilTheTablesTabRenders);

    expect(recipe).toHaveTextContent('The toggle’s look is shared classes, looks that live in the site’s shared sheet and that an element wears by name. borderless and unfilled take off the browser’s button chrome, muted-ink greys its glyph, and attentive fills it with the approach colour, the pale green, under a hovering pointer and draws the site’s ring when the keyboard reaches it.');
    expect(recipe).toHaveTextContent(/\.sortable \.header-cell > \.menu-toggle \{[^]*\.borderless \{[^]*\.unfilled \{[^]*\.muted-ink \{[^]*\.attentive:where\(/);
  });

  test.each(['react', 'vanilla'])('should name the resize handle’s classes in the %s world, with their blocks after its rule', async world => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt(`?tab=tables&tut=resize&world=${world}`)} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the drag resize yourself'}, untilTheTablesTabRenders);

    expect(recipe).toHaveTextContent('The handle’s look is shared classes, looks that live in the site’s shared sheet and that an element wears by name. borderless and unfilled take off the browser’s button chrome. held-bar-after paints the line: faded leather, a tan, while a pointer hovers it, and faded mint, a pale green, while it holds focus. focus-ringed draws the site’s ring when the keyboard reaches it.');
    expect(recipe).toHaveTextContent(/\.resize-handle \{[^]*\.borderless \{[^]*\.unfilled \{[^]*\.held-bar-after \{[^]*\.focus-ringed \{/);
  });

  test.each(['react', 'vanilla'])('should name the ledger’s class as the table’s own, not a shared class, in the %s world', async world => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt(`?tab=tables&tut=resize&world=${world}`)} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the drag resize yourself'}, untilTheTablesTabRenders);

    expect(recipe).toHaveTextContent('After a trade the header wears shared, a class of the table’s own sheet, not one of the site’s shared classes, and its share rides a custom property');
  });

  test.each(['react', 'vanilla'])('should say a moving cell wears paper-in-motion in the %s world, with its block after the carried cells’ rules', async world => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt(`?tab=tables&world=${world}`)} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the drag sort yourself'}, untilTheTablesTabRenders);

    expect(recipe).toHaveTextContent('A cell wears paper-in-motion, a shared class, a look that lives in the site’s shared sheet and that an element wears by name, while it is carried, settling or shoved, so a moving cell covers whatever it passes.');
    expect(recipe).toHaveTextContent(/\.sortable\.hide \.carried \{[^]*\.paper-in-motion \{/);
  });

  test.each(['react', 'vanilla'])('should say which cells paper-in-motion covers in the keep step, in the %s world', async world => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt(`?tab=tables&world=${world}`)} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the drag sort yourself'}, untilTheTablesTabRenders);

    await userEvent.click(within(recipe).getByText(/The trader can sort by column/));
    await userEvent.click(within(recipe).getByRole('radio', {name: 'Keep'}));

    expect(recipe).toHaveTextContent('A cell wears paper-in-motion while it is carried, settling or shoved: a shared class, a look that lives in the site’s shared sheet and that an element wears by name, which grounds the cell in the page’s paper, so a cell that slides past another covers it instead of showing through. Under keep the carried cells stay put, so the paper shows on the neighbours that slide past them, and on the carried cells as they settle.');
    expect(recipe).toHaveTextContent(/Leave the origin in place[^]*\.sortable\.hide \.carried \{[^]*\.paper-in-motion \{/);
  });

  test.each(['react', 'vanilla'])('should say the keyboard ring is focus-ringed in the %s world, with its block after the header’s rule', async world => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt(`?tab=tables&world=${world}&track=keyboard`)} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the drag sort yourself'}, untilTheTablesTabRenders);

    expect(recipe).toHaveTextContent('The focus-visible ring draws for the keyboard only: it is focus-ringed, a shared class, a look that lives in the site’s shared sheet and that an element wears by name, the site’s ring, which every movable column header and every grip wears.');
    expect(recipe).toHaveTextContent(/\.sortable \.header-cell \{[^]*\.focus-ringed \{/);
  });
});
