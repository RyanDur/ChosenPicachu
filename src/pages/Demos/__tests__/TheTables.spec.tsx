import {outOfReadingOrder} from '@__test_support/reading-order';
import {TestApp} from '@__test_support/TestApp';
import {itemHeadedBy} from '@__test_support/headed-item';
import {demosAt} from '@pages/Demos/__test_support';
import {fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {broadcast, listeningFeed, tradeFrame} from '@pages/Demos/__test_support/feed';
import {feedIsSubscribed} from '@pages/Demos/__test_support';
import {explanation, recipeFolds} from '@pages/Demos/Recipe/__test_support';
import {aggregations, tableControls, untilTheTablesTabRenders} from '@pages/Demos/Tables/__test_support';
import {sortableTable} from '@components/DragSortableTable/__test_support';

const now = 1700000000000;
const fourTrades = [
  tradeFrame(50001, now - 30 * 60000, '0.10', 'bought'),
  tradeFrame(50002, now - 10 * 60000, '0.25', 'sold'),
  tradeFrame(50003, now - 3 * 60000, '0.05', 'bought'),
  tradeFrame(50004, now, '0.01', 'bought')
];

describe('the tables tab’s own words', () => {
  test.each([
    'Too big to build in one motion, so I slice it: the smallest table that honours the shape first, then the flow of data, then each arrangement the trader asked for.',
    'So I deal the opening widths from the page’s stylesheet. With table-layout: fixed the header widths govern their whole columns, so the table always fills its container and the columns hold still while the values change.',
    'No JavaScript knows these widths, because nothing needs the size until you touch something. The first press or focus of a resize handle measures the headers as they stand and creates the',
    'from them; the drag measures them at the lift. A value that changes at runtime is state, and until then nothing has changed.',
    'This is the first rule of ARIA: use the native element when one already has the behaviour you need.',
    'The handshake subscribes to the product. Every message decodes into a trade, appended under a cap so a long session never grows without bound. A close marks the feed failed.',
    'The fold runs over the same capped trades each time, so the windows always match the trades the page holds.',
    'I could let each chart and each table keep its own copy of the trades.',
    'My first draft dispatched functions from state to state and called them reducers. They were not reducers: a reducer interprets an action it did not write.',
    'I could reorder the data itself, but every trade that lands would fight every drag. So the columns and the seats are the state, in their order; a trade rewrites a row’s values under its key, and the markup renders through them.',
    'I could ask the DOM where everything is as the pointer moves, but layout queries during a drag cause the jank you are trying to avoid.',
    'Leaving the pixels to the code does not mean building in JavaScript. The markup stays a normal table. Every visible change (the cursors, the hiding, every slide) is a CSS rule a class switches on. JavaScript only decides what the state is, and React affords nothing the DOM does not give you: the node moves are insertBefore, the handlers are events, the state is a value.',
    'The markup stays plain HTML, a real table with real headers.',
    'Whatever the trader arrives with (mouse, touchscreen, keyboard), the platform’s own behaviour comes first, and most of it is a declaration in the stylesheet, not code.',
    'Writing back is the same shape in reverse. Every handler ends in a dispatch of an action (columnMovedBeside, lifted, dropped), a record of what happened that one reducer turns into the next state. Whatever changes the order goes up to the page as an event, onColumnMoved or onRowMoved, and comes back down as the next order. Ask, dispatch and subscribe together are the store, one plain object that both worlds mount unchanged.',
    'That is one dispatch, and after it the store holds the drag beside the columns and the seats: the one mark of what is',
    'a key a table with no carry never has.',
    'Treat a cancel or a move with no buttons pressed as the drop, because a pointerup does not always arrive. Losing the capture is not the drop. When a settle moves the header cell in the DOM, the browser drops the capture with it and fires lostpointercapture at the next move, with that move’s coordinates on the event. So the handler treats the loss as the move it is, and retakes the pointer in the same handler.',
    '// a cancel, or a move with no buttons down, is the drop itself',
    'I could build rows their own machinery, but the need is the same motion turned vertical, so rows reuse what the columns built. Three things differ: a grip button to grab, row heights in the survey, and a vertical hit test. The promises the dials set carry over unchanged.',
    'focusable by birth; the keyboard track builds on it'
  ])('should say, whatever the dials, words and links together: %s', async sentence => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(await screen.findByRole('region', {name: 'Tables'})).toHaveTextContent(sentence);
  });

  test.each([
    {choice: 'world=vanilla', sentence: 'So I deal the opening widths from the page’s stylesheet. With table-layout: fixed the header widths govern their whole columns, so the table always fills its container and the columns hold still while the values change.'},
    {choice: 'world=vanilla', sentence: 'JavaScript only decides what the state is, and there is no framework in the document: the node moves are insertBefore, the handlers are events, the state is a value.'},
    {choice: 'world=vanilla', sentence: 'so a reorder never touches the data: the same lane finds its new seat, and insertBefore moves the real node only when its seat changed.'},
    {choice: 'world=vanilla', sentence: 'When the reconcile moves the cell in the DOM, the browser drops the capture with it and fires lostpointercapture at the next move, with that move’s coordinates on the event. So the handler treats the loss as the move it is, and retakes the pointer in the same handler.'},
    {choice: 'track=keyboard', sentence: 'I could build the keyboard its own sorting system, but the state, the clamps and the slides already exist. So this track is about access: focus reaches every grip and every header, and two arrow keys do everything a drag does.'},
    {choice: 'track=keyboard', sentence: 'Two of the dials make no difference here: pace and origin describe a drag session, what happens while something is held aloft, and a keyboard nudge holds nothing aloft. Only motion still applies, and the motion step below follows that dial’s setting.'},
    {choice: 'track=keyboard', sentence: 'HTML already does most of this: a button is focusable by birth, and a header can ask with a tabindex. CSS draws the rest: a focus-visible ring for the keyboard that pointer users never see.'},
    {choice: 'track=keyboard', sentence: 'A keydown listener claims the verb. It takes the two arrows and nothing else: every other key falls through, and preventDefault fires only on what it claims, so the page does not scroll.'},
    {choice: 'track=keyboard', sentence: 'the anchors hold and the walk stops beside them; both worlds call the same walk'},
    {choice: 'tut=menu', sentence: 'I could build the popup from divs, but then I would have to build focus, dismissal and stacking myself. So the chooser uses the platform’s popover, and the first steps below collect what that decision gives. Sorting state has its own trap: the glyph, the attribute and the ranked rows each want their own copy of which column is chosen, and copies drift.'},
    {choice: 'tut=menu', sentence: 'A sort applied once is stale by the next trade.'},
    {choice: 'tut=menu', sentence: 'Picture your toggle as the middle cell of a three-by-three grid drawn over the page: position-area picks cells. block-end takes the row below the toggle; span-inline-start starts from the toggle’s own column and spreads toward the line’s start: under the toggle, hanging left, in this writing mode.'},
    {choice: 'tut=menu', sentence: 'position-try-fallbacks: flip-block is the escape hatch: when the row below has no room, the whole area flips above.'},
    {choice: 'tut=menu', sentence: 'your site reset already zeroes menu, and a page’s own styles, the author’s, beat the browser’s default styles, its user-agent stylesheet, however specific the browser’s selectors are, because the cascade ranks who wrote a rule before how specific it is. The list markers are the reset’s job too; this site’s reset drops them for menu alongside ol and ul. One line remains that no reset should write for you: inset: auto. The browser’s default stylesheet centres every popover with inset: 0,'},
    {choice: 'tut=resize', sentence: 'The col-resize cursor offers the gesture, and touch-action: none lets the pointer drag it on a touchscreen.'},
    {choice: 'tut=resize&world=vanilla', sentence: 'The col-resize cursor offers the gesture, and touch-action: none lets the pointer drag it on a touchscreen.'},
    {choice: 'tut=menu', sentence: 'So the sort is a question the page asks on every read, never a stored answer: each read re-ranks the rows by the sorting column, and as values change underneath, the rows move to stay sorted.'},
    {choice: 'tut=menu', sentence: 'Move a row and the sort ends. The table raises onRowMoved with the'},
    {choice: 'tut=menu', sentence: 'it showed; the page keeps the rows where the sort left them, moves the one you moved, and clears the sort, so your drag proceeds from what you saw.'},
    {choice: 'tut=menu', sentence: 'and a :has() rule on the cell, which matches an element by what it contains, pads for the toggle when one is there.'},
    {choice: 'tut=menu&world=vanilla', sentence: 'a :has() rule on the cell, which matches an element by what it contains, pads for the toggle when one is there, and the page itself declares the sortable set.'},
    {choice: 'tut=menu&world=vanilla', sentence: 'When it changes, the build walks the columns and announce, one function, sets each th from that value: the sorting th gains aria-sort, and every other th loses it. One value holds the sort, so the headers always agree with it.'},
    {choice: 'tut=resize', sentence: 'I could resize with absolute pixel widths, but one drag would break the table’s guarantee to fill its container. So widths are shares of a hundred, measured from the rendered headers at the first touch, and every resize is a trade between neighbours: whatever one column gains, the next gives, and the sum cannot change.'},
    {choice: 'tut=resize', sentence: 'The handle captures its pointer and measures the table once, pixels per share.'},
    {choice: 'tut=resize', sentence: 'The header’s share is written as a custom property, --share, one of the values set by name on the cell and read back in the stylesheet with var().'},
    {choice: 'tut=resize', sentence: 'In Aggregations.css, beside the opening widths, three rules size the table. width: 100% fills its container. min-width: 86rem keeps that width on a narrower page, so the container scrolls sideways. In a browser window 600px wide or less the minimum drops to 64rem, unless the pointer is coarse, the platform’s word for a finger on a touchscreen, which keeps the 86rem. Fixed table layout holds each column at its declared share of whatever width the table has.'},
    {choice: 'tut=resize', sentence: 'So the cell holds a title, a menu where the page writes one, a handle, and nothing else.'},
    {choice: 'tut=resize', sentence: 'It has a cost: the padding and the controls’ offsets are two numbers that must agree, so both live in the one header sheet and nowhere else.'},
    {choice: 'tut=resize', sentence: 'The handle must be reachable for everyone: a real control at the column’s edge, not a styled sliver that takes no focus and has no name.'},
    {choice: 'tut=resize', sentence: 'and a :has() rule on the cell pads for what it holds: more room when a menu is present, less when only the handle is.'},
    {choice: 'tut=resize', sentence: 'of a hundred, created by measuring the rendered headers when a handle is first pressed or focused; until then, the stylesheet owns the widths and no ledger exists.'},
    {choice: 'motion=static', sentence: 'Its value is that nothing competes with the pointer.'},
    {choice: 'motion=static&world=vanilla', sentence: 'Its value is that nothing competes with the pointer.'}
  ])('should say, with $choice, words and links together: $sentence', async ({choice, sentence}) => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt(`?tab=tables&${choice}`)} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(await screen.findByRole('region', {name: 'Tables'})).toHaveTextContent(sentence);
  });

  test('should not tell the reader to focus the handle and tap, which the gesture step’s want already says', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables&tut=resize')} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(await screen.findByRole('region', {name: 'Tables'})).not.toHaveTextContent('focus the handle and tap');
  });

  test.each([
    {name: 'announce', choice: 'tut=menu&world=vanilla', run: /the build walks the columns and/},
    {name: 'th', choice: 'tut=menu&world=vanilla', run: /the build walks the columns and/},
    {name: 'onRowMoved', choice: 'tut=menu', run: /^Move a row and the sort ends/},
    {name: 'columnMovedBeside', choice: 'track=pointer', run: /^Writing back is the same shape in reverse/},
    {name: 'lifted', choice: 'track=pointer', run: /^Writing back is the same shape in reverse/},
    {name: 'dropped', choice: 'track=pointer', run: /^Writing back is the same shape in reverse/},
    {name: 'onColumnMoved', choice: 'track=pointer', run: /^Writing back is the same shape in reverse/},
    {name: 'onRowMoved', choice: 'track=pointer', run: /^Writing back is the same shape in reverse/},
    {name: 'lostpointercapture', choice: 'world=react', run: /the browser drops the capture with it and fires/},
    {name: 'lostpointercapture', choice: 'world=vanilla', run: /the browser drops the capture with it and fires/},
    {name: 'apportioned', choice: 'tut=resize', run: /a class it has from the start/},
    {name: 'Aggregations.css', choice: 'tut=resize', run: /three rules size the table/},
    {name: ':has()', choice: 'tut=resize', run: /rule on the cell pads for what it/},
    {name: 'aria-sort', choice: 'tut=menu', run: /from what it was given and the toggle/},
    {name: 'aria-sort', choice: 'tut=menu', run: /be the single signal read from it/},
    {name: 'th', choice: 'tut=menu', run: /from what it was given and the toggle/},
    {name: ':has()', choice: 'tut=menu', run: /pads for the toggle when one is there\./},
    {name: ':has()', choice: 'tut=menu&world=vanilla', run: /pads for the toggle when one is there, and the page itself/},
    {name: 'borderless', choice: 'tut=menu', run: /^The toggle’s look is shared classes/},
    {name: 'unfilled', choice: 'tut=menu', run: /^The toggle’s look is shared classes/},
    {name: 'muted-ink', choice: 'tut=menu', run: /^The toggle’s look is shared classes/},
    {name: 'attentive', choice: 'tut=menu', run: /^The toggle’s look is shared classes/},
    {name: '--share', choice: 'tut=resize', run: /written as a custom property/},
    {name: 'width: 100%', choice: 'tut=resize', run: /three rules size the table/},
    {name: 'min-width: 86rem', choice: 'tut=resize', run: /three rules size the table/},
    {name: 'popoverTarget', choice: 'tut=menu', run: /accessibility relationship comes/},
    {name: 'popoverTarget', choice: 'tut=menu', run: /The platform provides the whole popup/},
    {name: 'popovertargetaction', choice: 'tut=menu', run: /accessibility relationship comes/},
    {name: '@supports', choice: 'tut=menu', run: /fallback: a centred popover/},
    {name: 'menu', choice: 'tut=menu', run: /^A popover also comes with auto margins/},
    {name: 'ol', choice: 'tut=menu', run: /^A popover also comes with auto margins/},
    {name: 'ul', choice: 'tut=menu', run: /^A popover also comes with auto margins/},
    {name: 'inset: auto', choice: 'tut=menu', run: /^A popover also comes with auto margins/},
    {name: 'z-index: 999', choice: 'tut=menu', run: /already beating/},
    {name: 'position-try-fallbacks', choice: 'tut=menu', run: /is the escape hatch/},
    {name: 'touch-action: none', choice: 'tut=resize', run: /lets the pointer drag it/},
    {name: 'touch-action: none', choice: 'tut=resize&world=vanilla', run: /lets the pointer drag it/},
    {name: 'popover="auto"', choice: 'tut=menu', run: /brings the top layer, light-dismiss/},
    {name: 'onClick', choice: 'tut=menu', run: /accessibility relationship comes/},
    {name: 'popover="auto"', choice: 'tut=menu', run: /accessibility relationship comes/},
    {name: 'anchor-name', choice: 'tut=menu', run: /no measurement, no/},
    {name: 'position-area', choice: 'tut=menu', run: /picks cells/},
    {name: 'block-end', choice: 'tut=menu', run: /takes the row below the toggle/},
    {name: 'span-inline-start', choice: 'tut=menu', run: /takes the row below the toggle/},
    {name: 'flip-block', choice: 'tut=menu', run: /is the escape hatch/},
    {name: 'inset: 0', choice: 'tut=menu', run: /centred versus anchored/},
    {name: '::after', choice: 'tut=resize', run: /only item is the 8px line its/},
    {name: 'col-resize', choice: 'tut=resize', run: /offers the gesture/},
    {name: 'dressColumn', choice: 'tut=resize&world=vanilla', run: /rewrites that label to state/},
    {name: 'aria-sort', choice: 'tut=menu&world=vanilla', run: /the build walks the columns and/}
  ])('should set $name as code where its run names it, with $choice', async ({name, choice, run}) => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt(`?tab=tables&${choice}`)} feed={feed}/>);
    await feedIsSubscribed(feed);
    const told = within(await screen.findByRole('region', {name: 'Tables'})).getAllByText(run)[0];

    expect(within(told).getAllByRole('code').map(code => code.textContent)).toContain(name);
  });

  test('should link the resize step’s :has() to MDN', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables&tut=resize')} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(within(await screen.findByRole('region', {name: 'build the drag resize yourself'}, untilTheTablesTabRenders)).getByRole('link', {name: ':has()', hidden: true}))
      .toHaveAttribute('href', 'https://developer.mozilla.org/en-US/docs/Web/CSS/:has');
  });

  test('should say in the menu’s code aside what the prose says: the browser’s default placement', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables&tut=menu')} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(await screen.findByRole('region', {name: 'Tables'})).toHaveTextContent('/* centred is the browser’s default placement; this menu chooses the anchor */');
  });

  test('should picture position-area once, as a grid, with no second figure before it', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables&tut=menu')} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(await screen.findByRole('region', {name: 'Tables'})).not.toHaveTextContent('Read the new syntax as a compass');
  });
});

describe('the tables demo', () => {
  test('the fixed windows hold their rows while the stream fills the cells', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);

    await feedIsSubscribed(feed);
    const card = await screen.findByRole('region', {name: 'live aggregations'}, untilTheTablesTabRenders);
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
    await aggregations.arrived();

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
    const card = await aggregations.arrived();
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
    const card = await aggregations.arrived();
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
    expect(controls).toHaveTextContent(/moves with the pointer, cells and all/);
    expect(controls).toHaveTextContent(/slide to their new places/);
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
    const card = await aggregations.arrived();
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
    expect(screen.getByText(/What you see above is my interpretation of that/)).toBeVisible();
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

  test('should open the slices by saying the work splits into user stories from the trader’s side', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(await screen.findByRole('region', {name: 'Tables'})).toHaveTextContent('Once the need is heard and the design has answered shape, I split the work into stories. Each is a user story, a discrete piece of value from the trader’s side of the screen, and a promise of a conversation rather than a specification.');
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
    expect(still).toHaveTextContent('The shape comes from the design, in the element the clues pointed at: a few measures across a few time windows, numbers on two axes. That is what a table is for. I build it first as a still, from whatever trades the page holds: headers on both axes, and the reading order correct before a single interaction exists.');
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
    expect(living).toHaveTextContent('I drew this rather than recording it. The path a number takes has no timing to show, so a clip of ticking numbers would show less than the diagram does.');
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

    await recipeFolds.press(recipe, 'The trader can sort by column');

    expect(recipeFolds.story(recipe, 'The trader can sort by column')).toHaveAttribute('open');
    expect(recipeFolds.reveals(recipe).length).toBeGreaterThan(0);
    expect(recipeFolds.opened(recipeFolds.reveals(recipe))).toHaveLength(0);
  });

  test('the drag build shows the code and links out to it', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the drag sort yourself'});

    await recipeFolds.press(recipe, 'The trader can sort by column');

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

    await recipeFolds.press(recipe, 'The trader can sort by column');

    expect(recipe).toHaveTextContent(/Carry the real thing[^]*@property --seat-x \{[^]*@property --seat-y \{[^]*@property --drift-x \{[^]*@property --drift-y \{[^]*\.sortable\.hide \.carried \{/);
    expect(recipe).toHaveTextContent('Every move dispatches the pointer. Two selectors turn the drag into two numbers, and every carried cell wears them as custom properties: values set by name on the cell and read back in the stylesheet with var(). The first is the seat, where the grab box sits against where the column rests in the order as it stands now.');
    expect(recipe).toHaveTextContent('The sheet declares the seat and the drift with @property, a rule that gives a custom property a type and a starting value: each is a length that starts at 0px, so a carried cell with no numbers on it yet stays in its place.');
  });

  test('the keep step declares the same four numbers, and says what @property is, for a reader who keeps the origin', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the drag sort yourself'});

    await recipeFolds.press(recipe, 'The trader can sort by column');
    await userEvent.click(within(recipe).getByRole('radio', {name: 'Keep'}));

    expect(recipe).toHaveTextContent('the carried cells still wear their seat and their drift as custom properties, values set by name on the cell and read back in the stylesheet with var(), and the keep sheet simply never adds them up.');
    expect(recipe).toHaveTextContent(/Keep the origin in place and let only the order move[^]*@property --seat-x \{[^]*@property --seat-y \{[^]*@property --drift-x \{[^]*@property --drift-y \{[^]*\.sortable\.hide \.carried \{/);
    expect(recipe).toHaveTextContent('The sheet declares the seat and the drift with @property, a rule that gives a custom property a type and a starting value: each is a length that starts at 0px.');
    expect(recipe).not.toHaveTextContent(/stays in its seat/);
  });

  test('the recipe teaches whatever the dials are set to', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the drag sort yourself'});
    await recipeFolds.press(recipe, 'The trader can sort by column');
    await recipeFolds.press(recipe, 'The trader can sort by row');

    await userEvent.click(within(recipe).getByRole('radio', {name: 'Lazy'}));
    await userEvent.click(within(recipe).getByRole('radio', {name: 'Keep'}));
    await userEvent.click(within(recipe).getByRole('radio', {name: 'Static'}));

    expect(recipeFolds.story(recipe, 'The trader can sort by row')).toHaveAttribute('open');
    expect(recipe).toHaveTextContent(/Hold still, dispatch on release/);
    expect(recipe).toHaveTextContent(/the sort lands on the drop/);
    expect(recipe).toHaveTextContent(/stays where it stands while you drag/);
    expect(recipe).toHaveTextContent(/instantly, with no motion/);
    expect(recipe).toHaveTextContent(/Keep the origin in place and let only the order move/);
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
      await waitFor(() => expect(brought).toContain('station-5'));
    } finally {
      Element.prototype.scrollIntoView = () => undefined;
    }
  });

  test('should take the keyboard to the station the address names', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={`${demosAt('?tab=tables')}#station-5`} feed={feed}/>);
    await feedIsSubscribed(feed);

    await screen.findByRole('heading', {name: 'The trader can watch the market live, in windows'}, untilTheTablesTabRenders);

    await waitFor(() => expect(itemHeadedBy('the stations', 'The trader can watch the market live, in windows')).toHaveFocus());
  });

  test('the keyboard track teaches the same sort with the arrow keys', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);

    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the drag sort yourself'});
    await userEvent.click(within(recipe).getByRole('radio', {name: 'By keyboard'}));

    expect(recipe).toHaveTextContent(/Give focus a place to land/);
    expect(recipe).toHaveTextContent(/The arrows give the direction/);
    expect(recipe).toHaveTextContent(/Both parties slide/);
    expect(recipe).toHaveTextContent(/the stylesheet slides them/);
    await recipeFolds.press(recipe, 'The trader can sort by column');
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
    expect(recipe).toHaveTextContent(/The arrows give the direction/);
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
    expect(resize).toHaveTextContent(/A press on the handle would bubble, which means the browser passes it on to the header around it/);
    expect(resize).toHaveTextContent(/Arrow keys on a focused handle make the same trade, one fixed step per arrow/);
    expect(resize).toHaveTextContent(/The handle stops those keys from bubbling too, so the header’s own arrow keys never move the column/);
    expect(resize).toHaveTextContent(/It should stop those keys there as well, because the header handles arrow keys by moving the column/);
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
    await aggregations.arrived();
    await userEvent.click(screen.getByRole('radio', {name: 'Sort menu'}));

    const recipe = await screen.findByRole('region', {name: 'build the sort menu yourself'});
    expect(recipe).toHaveTextContent(/should stop a press from bubbling up to the header around them, so the header never gets it/);
  });

  test('the sort menu build no longer speaks of a descent', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);

    await feedIsSubscribed(feed);
    await aggregations.arrived();
    await userEvent.click(screen.getByRole('radio', {name: 'Sort menu'}));

    expect(await screen.findByRole('region', {name: 'build the sort menu yourself'})).not.toHaveTextContent(/\bdescent\b/);
  });

  test('choosing the sort menu swaps in the sort menu tutorial', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=tables')} feed={feed}/>);

    await feedIsSubscribed(feed);
    await aggregations.arrived();
    await userEvent.click(screen.getByRole('radio', {name: 'Sort menu'}));

    const recipe = await screen.findByRole('region', {name: 'build the sort menu yourself'});
    expect(recipe).toBeVisible();
    expect(recipe).toHaveTextContent(/popover/);
    expect(recipe).toHaveTextContent(/position-area/);
    expect(recipe).toHaveTextContent(/The sort keeps sorting/);
    expect(recipe).toHaveTextContent(/A move ends the sort/);
    expect(recipe).toHaveTextContent(/onSorted\?\.\(\{column, direction}\)/);
    expect(recipe).not.toHaveTextContent(/Dress the menu as a card/);
    expect(within(recipe).getByRole('link', {name: 'position-area'}))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org/en-US/docs/Web/CSS/position-area'));
    expect(recipeFolds.story(recipe, 'The trader can sort the windows by any measure, or take the order back')).toBeInTheDocument();
    expect(screen.queryByRole('region', {name: 'build the drag sort yourself'})).not.toBeInTheDocument();
    expect(screen.queryByRole('region', {name: 'table controls'})).not.toBeInTheDocument();
    expect(screen.getByRole('region', {name: 'the living table'})).toBeVisible();

    expect(recipe).toHaveTextContent(/Sort directly/);
    expect(recipe).toHaveTextContent(/Motion in these tables explains one move: a column or a row, and what it shoved aside\./);
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
    const card = await aggregations.arrived();
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
    ['action', 'a plain record of something that happened: a type that names it, and the facts about it. dispatch passes it to the reducer'],
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

  test.each([
    ['react', 'A class is a name written on an element that a stylesheet’s rules pick out. The columns are declared once, each with a name and a class; how wide they open is CSS.'],
    ['vanilla', 'A class is a name written on an element that a stylesheet’s rules pick out. The columns are declared once, each a header cell with a name and a class; how wide they open is CSS.']
  ])('should define class in plain words where the still table first uses it, in the %s world', async (world, sentence) => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt(`?tab=tables&world=${world}`)} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(await screen.findByRole('region', {name: 'the still table'}, untilTheTablesTabRenders)).toHaveTextContent(sentence);
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
    ['the exchange handles three actions', 'The exchange is that layer, in both worlds, and it handles three actions.'],
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
  test.each(['react', 'vanilla'])('should say the react menu is built from the site’s menu components, in the %s world', async world => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt(`?tab=tables&tut=menu&world=${world}`)} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the sort menu yourself'}, untilTheTablesTabRenders);

    expect(recipe).toHaveTextContent('In the React world the sample is built from the site’s Menu, Entry and Item components. A component is a function that writes a piece of the page from what it is given; here a menu, an li, one item of a list, and a button.');
  });

  test.each([
    ['react', /^Item gives its button/, 'Item gives its button the site’s shared classes, looks that live in the site’s shared sheet and that an element wears by name, and the page passes Menu the menu’s own, as the sample shows.', /<Menu [^>]*className="/],
    ['vanilla', /^In the vanilla world the buttons/, 'In the vanilla world the buttons carry the same shared classes Item gives them in React, looks that live in the site’s shared sheet and that an element wears by name, and the menu’s own classes are written on it by hand, as the sample shows.', /<menu [^>]*class="/]
  ])('should say who gives the menu its classes, beside a sample that shows them, in the %s world', async (world, opening, sentence, classedMenu) => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt(`?tab=tables&tut=menu&world=${world}`)} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the sort menu yourself'}, untilTheTablesTabRenders);

    expect(within(recipe).getByText(opening)).toHaveTextContent(sentence);
    expect(explanation.everyCodeBeside(recipe, opening).join()).toMatch(classedMenu);
  });

  test.each(['react', 'vanilla'])('should name the menu toggle’s classes in the %s world, with their blocks after its rule', async world => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt(`?tab=tables&tut=menu&world=${world}`)} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the sort menu yourself'}, untilTheTablesTabRenders);

    expect(recipe).toHaveTextContent('The toggle’s look is shared classes. borderless and unfilled take off the browser’s button chrome, muted-ink greys its glyph, and attentive fills it with the approach colour, the pale green, under a hovering pointer and draws the site’s ring when the keyboard reaches it.');
    expect(recipe).toHaveTextContent(/\.sortable \.header-cell > \.menu-toggle \{[^]*\.borderless \{[^]*\.unfilled \{[^]*\.muted-ink \{[^]*\.attentive:where\(/);
  });

  test.each(['react', 'vanilla'])('should name the resize handle’s classes in the %s world, with their blocks after its rule', async world => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt(`?tab=tables&tut=resize&world=${world}`)} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the drag resize yourself'}, untilTheTablesTabRenders);

    expect(recipe).toHaveTextContent('The handle’s look is shared classes. borderless and unfilled take off the browser’s button chrome. held-bar-after paints the line: faded leather, a tan, while a pointer hovers it, and faded mint, a pale green, while it holds focus. focus-ringed draws the site’s ring when the keyboard reaches it.');
    expect(recipe).toHaveTextContent(/\.resize-handle \{[^]*\.borderless \{[^]*\.unfilled \{[^]*\.held-bar-after \{[^]*\.focus-ringed \{/);
  });

  test.each(['react', 'vanilla'])('should name the ledger’s class as the table’s own, not a shared class, in the %s world', async world => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt(`?tab=tables&tut=resize&world=${world}`)} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the drag resize yourself'}, untilTheTablesTabRenders);

    expect(recipe).toHaveTextContent('After a trade the header wears shared. A shared class, on this site, is a look that lives in the site’s shared sheet and that an element wears by name; shared is not one of those. It is a class of the table’s own sheet.');
    expect(recipe).toHaveTextContent('It makes the rule that reads the header’s share match that header. The table itself wears apportioned, a class it has from the start; under it a cell clips its text to its column, and a header that wears shared takes its width from its share.');
  });

  test('should label the ledger’s headerStates TS, in the react world', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables&tut=resize&world=react')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the drag resize yourself'}, untilTheTablesTabRenders);
    const states = within(recipe).getByRole('figure', {name: /DragSortableTable\/looks\.ts on GitHub/});

    expect(within(states).getByText('TS')).toBeInTheDocument();
    expect(states).toHaveTextContent('export const headerStates');
  });

  test('should carve the rule that papers a moving cell, in the react world', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables&world=react')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the drag sort yourself'}, untilTheTablesTabRenders);

    expect(recipe).toHaveTextContent(/export const motionLooks[^]*\(carried \|\| has\(settlingFrom\) \|\| has\(shove\)\) && 'paper-in-motion'/);
  });

  test('should carve the line that gives a traded header shared, in the react world', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables&tut=resize&world=react')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the drag resize yourself'}, untilTheTablesTabRenders);

    expect(recipe).toHaveTextContent(/export const headerStates[^]*has\(width\) && 'shared'/);
  });

  test('should say every motion class changes through changeMotion in the vanilla world, with it carved after the reconcile', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=tables&world=vanilla')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the drag sort yourself'}, untilTheTablesTabRenders);

    expect(recipe).toHaveTextContent('Every motion class changes through changeMotion, which adds or removes the class and keeps paper-in-motion on while any motion class is present.');
    expect(recipe).toHaveTextContent(/export const dressCarried[^]*export const changeMotion/);
  });

  test.each(['react', 'vanilla'])('should say a moving cell wears paper-in-motion in the %s world, with its block after the carried cells’ rules', async world => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt(`?tab=tables&world=${world}`)} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the drag sort yourself'}, untilTheTablesTabRenders);

    expect(recipe).toHaveTextContent('A cell wears paper-in-motion, a shared class, a look from the site’s shared sheet that an element wears by name, while it is carried, settling or shoved: it grounds the cell in the page’s paper, so a cell in motion is opaque.');
    expect(recipe).toHaveTextContent(/\.sortable\.hide \.carried \{[^]*\.paper-in-motion \{/);
  });

  test.each(['react', 'vanilla'])('should say what z-index decides and why the carried cell is positioned, in the %s world', async world => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt(`?tab=tables&world=${world}`)} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the drag sort yourself'}, untilTheTablesTabRenders);

    expect(recipe).toHaveTextContent('The sheet also raises the carried cells with a z-index of 1. z-index orders boxes that overlap, the higher on top. A table cell takes one only once it is positioned, given a position other than static, so the sheet gives the carried cell position: relative as well. Raised, the carried cells pass over whatever they cross, and the paper keeps what is beneath from showing through.');
    expect(recipe).toHaveTextContent(/\.sortable \.carried \{\s*position: relative;\s*z-index: 1;\s*\}/);

    await recipeFolds.press(recipe, 'The trader can sort by column');
    await userEvent.click(within(recipe).getByRole('radio', {name: 'Keep'}));

    expect(recipe).toHaveTextContent('Under keep the carried cells stay put, and the sheet raises them with a z-index of 1: z-index orders boxes that overlap, the higher on top, and a table cell takes one only once it is positioned, given a position other than static, which is why the carried cell is also position: relative. So the neighbours slide beneath the carried cells, and the paper keeps either from showing through the other.');
    expect(recipe).toHaveTextContent(/Keep the origin in place and let only the order move[^]*\.sortable \.carried \{\s*position: relative;\s*z-index: 1;\s*\}/);
  });

  test.each(['react', 'vanilla'])('should say which cells paper-in-motion covers in the keep step, in the %s world', async world => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt(`?tab=tables&world=${world}`)} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the drag sort yourself'}, untilTheTablesTabRenders);

    await recipeFolds.press(recipe, 'The trader can sort by column');
    await userEvent.click(within(recipe).getByRole('radio', {name: 'Keep'}));

    expect(recipe).toHaveTextContent('A cell wears paper-in-motion, a shared class, a look from the site’s shared sheet that an element wears by name, while it is carried, settling or shoved: it grounds the cell in the page’s paper, so a cell in motion is opaque and shows nothing through it.');
    expect(recipe).toHaveTextContent(/Keep the origin in place and let only the order move[^]*\.sortable\.hide \.carried \{[^]*\.paper-in-motion \{/);
  });

  test.each(['react', 'vanilla'])('should say the keyboard ring is focus-ringed in the %s world, with its block after the header’s rule', async world => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt(`?tab=tables&world=${world}&track=keyboard`)} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the drag sort yourself'}, untilTheTablesTabRenders);

    expect(recipe).toHaveTextContent('The focus-visible ring draws for the keyboard only. A shared class is a look that lives in the site’s shared sheet and that an element wears by name. focus-ringed is one: the site’s ring, which every movable column header and every grip wears.');
    expect(recipe).toHaveTextContent(/\.sortable \.header-cell \{[^]*\.focus-ringed \{/);
  });
});

describe('the tables tutorials’ vocabulary', () => {
  const builds = [
    {at: 'tut=sort&track=pointer&world=react', region: 'build the drag sort yourself'},
    {at: 'tut=sort&track=pointer&world=vanilla', region: 'build the drag sort yourself'},
    {at: 'tut=sort&track=keyboard&world=react', region: 'build the drag sort yourself'},
    {at: 'tut=sort&track=keyboard&world=vanilla', region: 'build the drag sort yourself'},
    {at: 'tut=sort&track=pointer&world=react&pace=lazy&origin=keep&motion=static', region: 'build the drag sort yourself'},
    {at: 'tut=sort&track=pointer&world=vanilla&pace=lazy&origin=keep&motion=static', region: 'build the drag sort yourself'},
    {at: 'tut=sort&track=keyboard&world=react&pace=lazy&origin=keep&motion=static', region: 'build the drag sort yourself'},
    {at: 'tut=sort&track=keyboard&world=vanilla&pace=lazy&origin=keep&motion=static', region: 'build the drag sort yourself'},
    {at: 'tut=menu&world=react', region: 'build the sort menu yourself'},
    {at: 'tut=menu&world=vanilla', region: 'build the sort menu yourself'},
    {at: 'tut=resize&world=react', region: 'build the drag resize yourself'},
    {at: 'tut=resize&world=vanilla', region: 'build the drag resize yourself'},
    {at: 'world=react', region: 'the living table'},
    {at: 'world=vanilla', region: 'the living table'}
  ];

  const prose = async (at: string, region: string): Promise<HTMLElement[]> => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt(`?tab=tables&${at}`)} feed={feed}/>);
    await feedIsSubscribed(feed);
    const build = await screen.findByRole('region', {name: region}, untilTheTablesTabRenders);
    return [...within(build).getAllByRole('paragraph'), ...within(build).getAllByRole('heading')]
      .sort((one, other) => one.compareDocumentPosition(other) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
  };

  const firstSaying = (blocks: HTMLElement[], word: RegExp): HTMLElement | undefined =>
    blocks.find(block => word.test(block.textContent));

  test.each(builds)('should keep the figures the plain verbs replaced out of $region, with $at', async ({at, region}) => {
    const words = (await prose(at, region)).map(block => block.textContent).join(' ');

    expect(words).not.toMatch(/\b(hears?|speaks?|rides?|dress(es|ed)|undress\w*|buys|owes?|sells|born|hands|handed)\b/i);
  });

  test.each(['pointer', 'keyboard'])('should name walk, strike, drift and survey before the %s track uses them', async track => {
    const blocks = await prose(`tut=sort&track=${track}`, 'build the drag sort yourself');

    expect(firstSaying(blocks, /\b(walk|strike|drift|survey)\b/)).toHaveTextContent('A walk is the code’s name for a move made with the arrow keys. A strike is the moment the pointer crosses far enough into a neighbour to count. The drift is how far the pointer has moved since the grab. The survey is the one measurement taken at the grab: the table’s box, every column’s width, and later the row heights.');
  });

  test('should say what a dial’s promise is where the drag sort first names the promises', async () => {
    const blocks = await prose('tut=sort', 'build the drag sort yourself');

    expect(firstSaying(blocks, /\bpromises?\b/)).toHaveTextContent('This particular table keeps three more promises. A dial’s promise is what the table guarantees under that setting.');
  });

  test('should name the ledger before the resize build uses it', async () => {
    const blocks = await prose('tut=resize', 'build the drag resize yourself');

    expect(firstSaying(blocks, /\bledger\b/)).toHaveTextContent('The ledger is the table’s record of each column’s share of the width.');
  });

  test.each(['react', 'vanilla'])('should name the hand and the reconcile where the living table first uses them, in the %s world', async world => {
    const blocks = await prose(`world=${world}`, 'the living table');

    expect(firstSaying(blocks, /\bthe hand\b/)).toHaveTextContent('In the vanilla build the code calls the table’s store the hand. It holds the drag and the widths once measured. The React build calls it store and keeps the marks a move leaves in it too; the vanilla build writes those marks onto the cells as classes.');
    expect(firstSaying(blocks, /\breconcile\b/)).toHaveTextContent('A reconcile is the function that moves the page’s cells from the old order to the new one.');
  });

  test('should name dress where the vanilla living table first uses it', async () => {
    const blocks = await prose('world=vanilla', 'the living table');

    expect(firstSaying(blocks, /\bdress\b/)).toHaveTextContent('A listener on the hand, which the code names dress, adds and removes the carried cells’ classes and custom properties and sets the widths.');
  });
});

describe('the tables tab’s introduction', () => {
  const paragraphs = [
    'A table of live trades is the hardest thing on this site: its rows change while you read them, and this one also lets you drag a column or a row to a new place, resize a column, and sort by one.',
    'The bug most of us have met is the fight between the drag and the data: a column that jumps back when a row updates, a drag that stutters because the page is measured on every move, a sort that undoes a move or a move that undoes a sort.',
    'This page’s view is that the columns and the rows’ order are the state and the data never moves: a trade rewrites a row’s values under the id the row keeps, the arrangement is a separate thing the reader owns, and everything a drag needs is measured once, at the grab.',
    'Every pixel of the drag is drawn from pointer events, the browser’s events for a mouse, a finger and a pen alike, with no drag-and-drop library. The table is built twice, once with HTML, CSS and JavaScript raw and once in React, the JavaScript library this site is built with, and the same state sits under both.',
    'By the end you can drag a column or a row with the pointer or the arrow keys while trades keep landing, resize a column by drag or by keyboard, sort and end a sort by moving a row, and say why the table never fights the data. The exhibit below is live; grab a header between the first and the last, or any row’s grip, and move it.'
  ];

  test('should tell what the table is, the bug, the page’s view and what a reader can do after, before the exhibit', async () => {
    render(<TestApp at={demosAt('?tab=tables')}/>);

    const tab = await screen.findByRole('region', {name: 'Tables'});

    expect(outOfReadingOrder([...paragraphs.map(paragraph => within(tab).getByText(paragraph)), (await within(tab).findAllByRole('table'))[0]])).toEqual([]);
  });
});

describe('the tables tab’s audited words', () => {
  const tabWithEveryStoryOpen = async (world: 'react' | 'vanilla', also = ''): Promise<HTMLElement> => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt(`?tab=tables&world=${world}&sort=column,row&living=still,flow,store&menu=rank&resize=widen${also}`)} feed={feed}/>);
    await feedIsSubscribed(feed);
    await screen.findByRole('region', {name: also.includes('tut=menu') ? 'build the sort menu yourself' : 'build the drag sort yourself'});
    return screen.getByRole('region', {name: 'Tables'});
  };

  test.each([
    ['react', 'The static table wears the same marks and classes; the stylesheet gives them an animation of zero length, so the marks clear on the same animationend and nothing visibly moves.'],
    ['vanilla', 'The static build sets the same classes; the stylesheet gives them an animation of zero length, so they clear on the same animationend and nothing visibly moves.']
  ] as const)('should say, in the %s world, the static table keeps its marks and the stylesheet gives them no time', async (world, sentence) => {
    const tab = await tabWithEveryStoryOpen(world);

    expect(tab).toHaveTextContent(sentence);
    expect(tab).toHaveTextContent(/@keyframes shoved-start[^]*\.sortable\.static :is\(\.settling[^]*the only motion code there is/);
  });

  test.each([
    ['react', 'tut=sort'], ['vanilla', 'tut=sort'],
    ['react', 'tut=sort&track=keyboard&pace=lazy&origin=keep&motion=static'], ['vanilla', 'tut=sort&track=keyboard&pace=lazy&origin=keep&motion=static'],
    ['react', 'tut=menu'], ['vanilla', 'tut=menu'], ['react', 'tut=resize'], ['vanilla', 'tut=resize']
  ] as const)('should spell the whole tab’s prose the British way, in the %s world with %s', async (world, choices) => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt(`?tab=tables&world=${world}&${choices}&sort=column,row&living=still,flow,store&menu=rank&resize=widen`)} feed={feed}/>);
    await feedIsSubscribed(feed);
    const tab = await screen.findByRole('region', {name: 'Tables'}, untilTheTablesTabRenders);
    await within(tab).findAllByRole('heading', {name: /^The trader can/});

    const words = [...within(tab).getAllByRole('paragraph'), ...within(tab).getAllByRole('heading')].map(block => block.textContent).join(' ');

    expect(words).not.toMatch(/\b(behaviors?|centered|centers|honors|labeled|colors?)\b/i);
  });

  test.each([
    ['react', 'a keyframe puts the cell where it came from on the first frame and lets it slide into its slot.', 'when the keyframe ends, the element gets its own animationend and dispatches that it has settled'],
    ['vanilla', 'The strike, the walk and the drop set the cells’ classes, and the slides are keyframes in the stylesheet. The static build', 'when the keyframe ends, the first cell’s animationend removes the class from every cell in the column']
  ] as const)('should tell the settle the way the %s build does it', async (world, mark, clear) => {
    const tab = await tabWithEveryStoryOpen(world);

    expect(tab).toHaveTextContent(mark);
    expect(tab).toHaveTextContent(clear);
  });

  test('should say, beside the vanilla settle code, that the first cell’s animationend clears the column', async () => {
    const tab = await tabWithEveryStoryOpen('vanilla');
    const settle = recipeFolds.stepHeaded(tab, 'Let the column settle');

    expect(settle).toHaveTextContent(/const untilSettled = [^]*\/\/ the marks set the cells’ classes; the stylesheet moves them; the first cell’s animationend clears the column/);
  });

  test.each([
    ['react', 'one dispatch runs on pointer up. With no landing left to dispatch, a drop where it started changes nothing.'],
    ['vanilla', 'one dispatch runs at the landing. With no landing left to dispatch, a drop where it started changes nothing.']
  ] as const)('should say, in the %s world, a column snaps back to where it started, is carried back over it, and a drop there changes nothing', async (world, drop) => {
    const tab = await tabWithEveryStoryOpen(world, '&pace=lazy');

    expect(tab).toHaveTextContent('carrying the column back over where it started must clear it');
    expect(tab).toHaveTextContent(drop);
    expect(tab).toHaveTextContent('A column that snaps back to where it started on release');
  });

  test.each(['react', 'vanilla'] as const)('should say, in the %s world, the static keyboard walk still lands its marks, cleared at once by the zero-length animation', async world => {
    const tab = await tabWithEveryStoryOpen(world, '&track=keyboard&motion=static');

    expect(tab).toHaveTextContent('Motion off should cost nothing extra: no waiting. The static walk should be the arrow handler with the slides simply absent.');
    expect(tab).toHaveTextContent('Apply the order; the marks still land, and the zero-length animation clears them at once, so the swap paints on the next frame.');
    expect(tab).toHaveTextContent('// the whole walk; the marks land and clear at once, nothing to wait for');
    expect(tab).not.toHaveTextContent('nothing marked, nothing to wait for');
  });

  test('should say rows have no anchors, and the first and last columns hold the table in place', async () => {
    const tab = await tabWithEveryStoryOpen('react', '&track=keyboard');

    expect(tab).toHaveTextContent('except that rows have no anchors: any row may move, and a walk stops at the table’s ends.');
    expect(tab).toHaveTextContent('the seats shuffle instead of the order, and a walk stops at the first and last seat.');
    expect(tab).toHaveTextContent('Rows stop at the table’s ends, but any row may move; only columns have anchors. The grip’s keys are up and down.');
    expect(tab).toHaveTextContent('grab a header between the first and the last, or any row’s grip, and move it');
  });

  test('should say, at the lift, that the first and last columns cannot be lifted', async () => {
    expect(await tabWithEveryStoryOpen('react')).toHaveTextContent('The first and last columns hold the table in place and cannot be lifted.');
  });

  test('should say a reset returns the seats as they stood before the sort, and the fallback is a centred popover', async () => {
    const tab = await tabWithEveryStoryOpen('react', '&tut=menu');

    expect(tab).toHaveTextContent('as they stood before the sort.');
    expect(tab).toHaveTextContent('fallback: a centred popover.');
  });

  test('should say a table’s state, and where each build keeps the marks a move leaves', async () => {
    const tab = await tabWithEveryStoryOpen('vanilla');

    expect(tab).toHaveTextContent('A table’s state is only what the trader does to it: what the pointer is carrying, the widths once measured, and in React the marks a move leaves.');
    expect(tab).toHaveTextContent('The mount, the one function that wires the document, creates the same stores');
    expect(tab).toHaveTextContent('Rows and columns arrive in the markup’s order, and the structure comes from the markup: JavaScript reads the columns off the header classes, and names every row element (a lane, in the code) after its row header. Both seed the arrangement. Every dispatch');
    expect(tab).toHaveTextContent('the arrangement, taken from the markup it was given');
  });

  test('should name the drift as the drag’s drifted case, and say the seat number changes by the crossed neighbour’s width the other way', async () => {
    const tab = await tabWithEveryStoryOpen('react');

    expect(tab).toHaveTextContent('is a field of the drag, written by the dragging reducer’s drifted case. The drag holds the survey from the lift, the box the thing was grabbed in, and how far the pointer has moved since.');
    expect(tab).toHaveTextContent('the gap moves by the crossed neighbour’s width, and the seat number changes by that width the other way, so the carried cells stay under the pointer.');
    expect(tab).toHaveTextContent('under keep and never leave their place.');
    expect(tab).toHaveTextContent('the same offset the drag already holds');
    expect(tab).toHaveTextContent('a column moved to a position,');
    expect(tab).toHaveTextContent('the standing it left, the rows’ order as shown, ranked while a sort holds.');
  });

  test('should say the two ways to drag, where the drag is measured, and what the store story tells', async () => {
    const tab = await tabWithEveryStoryOpen('react');

    expect(tab).toHaveTextContent('There are two ways to drag something across a page, and I built both. The Drag sort list demo uses the native API, where the platform brings most of the behaviour for very little code; its edges (the snapshot that cannot be animated, the cursor that belongs to the platform, the macOS cancel) are that demo’s own story. This table uses pointer events, which leave every pixel of the drag to the code, and no drag-and-drop library is anywhere in the build.');
    expect(tab).toHaveTextContent('the rest are cards in the last station, and each opens into its build. Station 5 ends with a story told from the code’s side, the store the two worlds share.');
    expect(tab).toHaveTextContent('So the lift measures everything the drag needs at the grab, as the lift step shows');
  });
});
