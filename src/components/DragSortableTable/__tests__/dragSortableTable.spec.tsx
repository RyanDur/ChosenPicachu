import {fireEvent, render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Dealt} from '@test-support/deal';
import * as EagerHideStatic from '../EagerHideStaticTable';
import * as EagerKeepAnimated from '../EagerKeepAnimatedTable';
import * as EagerKeepStatic from '../EagerKeepStaticTable';
import * as LazyKeepStatic from '../LazyKeepStaticTable';

describe('drag sortable columns', () => {
  const sized = [
    {display: 'name', column: 'name'},
    {display: 'age', column: 'age'},
    {display: 'city', column: 'city'},
    {display: 'job', column: 'job'}
  ];
  const people = [{
    name: {display: 'Ada'}, age: {display: '36'}, city: {display: 'London'}, job: {display: 'Analyst'}
  }];

  const sourceTable = () => screen.getAllByRole('table')[0];
  const ghostTable = () => screen.getAllByRole('table', {hidden: true})[1];
  const surface = () => {
    const found = document.querySelector('.drag-surface');
    if (!found) throw new Error('nothing is aloft');
    return found;
  };
  const headerTexts = () => within(sourceTable()).getAllByRole('columnheader').map(header => header.textContent);
  const header = (name: string) => within(sourceTable()).getByRole('columnheader', {name: new RegExp(`^${name}`)});
  let widths: Record<string, number> = {name: 200, age: 120, city: 120, job: 160};

  beforeEach(() => {
    widths = {name: 200, age: 120, city: 120, job: 160};
  });
  const surveyed = () => {
    sourceTable().getBoundingClientRect = () => ({
      left: 0, right: 600, top: 0, bottom: 200, width: 600, height: 200, x: 0, y: 0, toJSON: () => ({})
    });
    within(sourceTable()).getAllByRole('columnheader').forEach(header => {
      const key = header.textContent ?? '';
      header.getBoundingClientRect = () => ({
        left: 0, right: 0, top: 0, bottom: 0, width: widths[key] ?? 0, height: 0, x: 0, y: 0, toJSON: () => ({})
      });
    });
  };
  let aloft = '';
  const lift = (name: string) => {
    aloft = name;
    surveyed();
    fireEvent.pointerDown(header(name), {clientX: 100, clientY: 50, pointerId: 1});
  };
  const carryOver = (target: string) => {
    const texts = headerTexts();
    let edge = 0;
    for (const key of texts) {
      if (key === target) break;
      edge += widths[key ?? ''];
    }
    const past = texts.indexOf(target) < texts.indexOf(aloft) ? 0.25 : 0.75;
    fireEvent.pointerMove(surface(), {buttons: 1, clientX: edge + widths[target] * past, clientY: 100, pointerId: 1});
  };
  const drop = () => fireEvent.pointerUp(surface(), {pointerId: 1});

  test('an eager column follows the pointer as it crosses its neighbors', () => {
    render(<Dealt kit={EagerKeepStatic} columns={sized} rows={people} kinds={{draggable: true}}/>);

    lift('age');
    carryOver('city');

    expect(headerTexts()).toEqual(['name', 'city', 'age', 'job']);
    const cells = within(within(sourceTable()).getAllByRole('rowgroup')[1]).getAllByRole('cell');
    expect(cells.map(cell => cell.textContent)).toEqual(['Ada', 'London', '36', 'Analyst']);
  });

  test('a lazy column waits for the drop', () => {
    render(<Dealt kit={LazyKeepStatic} columns={sized} rows={people} kinds={{draggable: true}}/>);

    lift('age');
    carryOver('city');
    expect(headerTexts()).toEqual(['name', 'age', 'city', 'job']);

    drop();
    expect(headerTexts()).toEqual(['name', 'city', 'age', 'job']);
  });

  test('a hiding column vanishes while it travels and returns on arrival', () => {
    render(<Dealt kit={EagerHideStatic} columns={sized} rows={people} kinds={{draggable: true}}/>);

    lift('city');
    expect(header('city').classList).toContain('hide');
    within(within(sourceTable()).getAllByRole('rowgroup')[1]).getAllByRole('cell')
      .filter(cell => cell.textContent === 'London')
      .forEach(cell => expect(cell.classList).toContain('hide'));

    carryOver('age');
    drop();
    expect(header('city').classList).not.toContain('hide');
    expect(headerTexts()).toEqual(['name', 'city', 'age', 'job']);
  });

  test('a column carried back without dropping comes home', () => {
    render(<Dealt kit={EagerKeepStatic} columns={sized} rows={people} kinds={{draggable: true}}/>);

    lift('age');
    carryOver('city');
    expect(headerTexts()).toEqual(['name', 'city', 'age', 'job']);

    carryOver('city');
    expect(headerTexts()).toEqual(['name', 'age', 'city', 'job']);
    drop();
    expect(headerTexts()).toEqual(['name', 'age', 'city', 'job']);
  });

  test('a lazy column carried home lands nowhere', () => {
    render(<Dealt kit={LazyKeepStatic} columns={sized} rows={people} kinds={{draggable: true}}/>);

    lift('age');
    carryOver('city');
    carryOver('age');
    drop();

    expect(headerTexts()).toEqual(['name', 'age', 'city', 'job']);
  });

  test('the switch waits for the inner half of the neighbor', () => {
    render(<Dealt kit={EagerKeepStatic} columns={sized} rows={people} kinds={{draggable: true}}/>);

    lift('age');
    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 332, clientY: 100, pointerId: 1});
    expect(headerTexts()).toEqual(['name', 'age', 'city', 'job']);

    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 356, clientY: 100, pointerId: 1});
    expect(headerTexts()).toEqual(['name', 'city', 'age', 'job']);
    drop();
  });

  test('a slim column reaches deeper into a wide neighbor before switching', () => {
    widths = {name: 100, slim: 40, wide: 360, job: 100};
    const stretched = [
      {display: 'name', column: 'name'},
      {display: 'slim', column: 'slim'},
      {display: 'wide', column: 'wide'},
      {display: 'job', column: 'job'}
    ];
    const person = [{
      name: {display: 'Ada'}, slim: {display: 'few'}, wide: {display: 'many'}, job: {display: 'Analyst'}
    }];
    render(<Dealt kit={EagerKeepStatic} columns={stretched} rows={person} kinds={{draggable: true}}/>);

    lift('slim');
    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 260, clientY: 100, pointerId: 1});
    expect(headerTexts()).toEqual(['name', 'slim', 'wide', 'job']);

    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 320, clientY: 100, pointerId: 1});
    expect(headerTexts()).toEqual(['name', 'wide', 'slim', 'job']);
    drop();
  });

  test('arrow keys on the resize handle trade shares, never seats', () => {
    render(<Dealt kit={EagerKeepStatic} columns={sized} rows={people} kinds={{draggable: true, resizable: true}}/>);

    const handle = screen.getByRole('button', {name: /resize age/});
    fireEvent.focus(handle);
    fireEvent.keyDown(handle, {key: 'ArrowRight'});

    expect(headerTexts()).toEqual(['name', 'age', 'city', 'job']);
  });

  test('the first and last columns hold their posts', () => {
    render(<Dealt kit={EagerKeepStatic} columns={sized} rows={people} kinds={{draggable: true}}/>);

    expect(header('name').classList).not.toContain('grabbable');
    expect(header('job').classList).not.toContain('grabbable');
    expect(header('age').classList).toContain('grabbable');

    lift('name');
    expect(document.querySelector('.drag-surface')).toBeNull();

    lift('city');
    carryOver('name');
    expect(headerTexts()).toEqual(['name', 'city', 'age', 'job']);
    drop();
  });

  test('the travelling ghost carries the whole column', () => {
    render(<Dealt kit={EagerKeepStatic} columns={sized} rows={people} kinds={{draggable: true}}/>);
    [...sourceTable().querySelectorAll('tr')].slice(1).forEach((lane, at) => {
      lane.getBoundingClientRect = () => ({
        left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 40 + at * 10, x: 0, y: 0, toJSON: () => ({})
      });
    });

    lift('age');

    const ghost = ghostTable();
    expect([...ghost.children].map(section => section.tagName)).toEqual(['THEAD', 'TBODY']);
    expect(ghost.querySelectorAll('thead tr')).toHaveLength(1);
    expect(ghost.querySelectorAll('tbody tr')).toHaveLength(1);
    expect(ghost.textContent).toContain('age');
    expect(ghost.textContent).toContain('36');
    const carriedRows = ghost.querySelector('tbody');
    if (!carriedRows) throw new Error('the ghost has no body');
    expect([...carriedRows.rows].map(lane => lane.style.getPropertyValue('--seat-height')))
      .toEqual(['40px']);

    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 300, clientY: 200, pointerId: 1});
    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 320, clientY: 215, pointerId: 1});
    expect(ghost.style.getPropertyValue('--drift-x')).toBe('20px');
    expect(ghost.style.getPropertyValue('--drift-y')).toBe('15px');

    drop();
    expect(screen.getAllByRole('table')).toHaveLength(1);
  });

  test('columns hold still without the opt-in', () => {
    render(<Dealt kit={EagerKeepStatic} columns={sized} rows={people}/>);

    fireEvent.pointerDown(header('age'), {clientX: 100, clientY: 50, pointerId: 1});
    expect(document.querySelector('.drag-surface')).toBeNull();
    expect(headerTexts()).toEqual(['name', 'age', 'city', 'job']);
  });

  test('a keyboard walk says the move', async () => {
    render(<Dealt kit={EagerKeepStatic} columns={sized} rows={people} kinds={{draggable: true}}/>);

    header('age').focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(headerTexts()).toEqual(['name', 'city', 'age', 'job']);
    expect(screen.getByRole('status')).toHaveTextContent('age moved to column 3 of 4');
  });

  test('a dropped column says where it landed', () => {
    render(<Dealt kit={EagerKeepStatic} columns={sized} rows={people} kinds={{draggable: true}}/>);

    lift('age');
    carryOver('city');
    drop();

    expect(screen.getByRole('status')).toHaveTextContent('age moved to column 3 of 4');
  });
});

describe('drag sortable rows', () => {
  const sized = [
    {display: 'name', column: 'name'},
    {display: 'age', column: 'age'}
  ];
  const people = [
    {name: {display: 'Ada'}, age: {display: '36'}},
    {name: {display: 'Grace'}, age: {display: '45'}},
    {name: {display: 'Alan'}, age: {display: '41'}}
  ];

  const sourceTable = () => screen.getAllByRole('table')[0];
  const surface = () => {
    const found = document.querySelector('.drag-surface');
    if (!found) throw new Error('nothing is aloft');
    return found;
  };
  const firstCells = () => within(within(sourceTable()).getAllByRole('rowgroup')[1])
    .getAllByRole('row').map(row => row.querySelector('th, td')?.textContent);
  const rowOf = (person: string) => {
    const row = within(sourceTable()).getByText(person).closest('tr');
    if (!row) throw new Error(`no row for ${person}`);
    return row;
  };
  const grip = (person: string) => within(rowOf(person)).getByRole('button', {name: /move row/});
  const surveyed = () => {
    sourceTable().getBoundingClientRect = () => ({
      left: 0, right: 400, top: 0, bottom: 160, width: 400, height: 160, x: 0, y: 0, toJSON: () => ({})
    });
    const spans: Record<string, number> = {name: 250, age: 150};
    within(sourceTable()).getAllByRole('columnheader').forEach(header => {
      const key = header.textContent ?? '';
      header.getBoundingClientRect = () => ({
        left: 0, right: 0, top: 0, bottom: 0, width: spans[key] ?? 0, height: 0, x: 0, y: 0, toJSON: () => ({})
      });
    });
    within(within(sourceTable()).getAllByRole('rowgroup')[1]).getAllByRole('row')
      .forEach(row => {
        row.getBoundingClientRect = () => ({
          left: 0, right: 400, top: 0, bottom: 40, width: 400, height: 40, x: 0, y: 0, toJSON: () => ({})
        });
      });
  };
  let aloft = '';
  const lift = (person: string) => {
    aloft = person;
    surveyed();
    fireEvent.pointerDown(grip(person), {clientX: 100, clientY: 50, pointerId: 1});
  };
  const carryOver = (target: string) => {
    const cells = firstCells();
    const at = cells.indexOf(target);
    const past = at < cells.indexOf(aloft) ? 10 : 30;
    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 100, clientY: 40 + at * 40 + past, pointerId: 1});
  };
  const drop = () => fireEvent.pointerUp(surface(), {pointerId: 1});

  test('the row in hand keeps its grip and the table’s proportions', () => {
    render(<Dealt kit={EagerKeepStatic} columns={sized} rows={people} kinds={{gripped: true}}/>);

    lift('Grace');

    const ghost = document.querySelector('.column-ghost');
    if (!ghost) throw new Error('no ghost is aloft');
    expect(ghost).toHaveAttribute('aria-hidden', 'true');
    expect(ghost.querySelector('.grip')).not.toBeNull();
    const name = ghost.querySelector('th');
    const age = ghost.querySelector('td');
    if (name === null || age === null) throw new Error('the ghost row lost a seat');
    expect(name.classList).toContain('row-header');
    expect(name.querySelector('.grip')).not.toBeNull();
    expect(age.querySelector('.grip')).toBeNull();
    expect(name.style.getPropertyValue('--share')).toBe('62.5%');
    expect(age.style.getPropertyValue('--share')).toBe('37.5%');
    drop();
  });

  test('an eager row follows the pointer as it crosses its neighbors', () => {
    render(<Dealt kit={EagerKeepStatic} columns={sized} rows={people} kinds={{gripped: true}}/>);

    lift('Ada');
    carryOver('Alan');

    expect(firstCells()).toEqual(['Grace', 'Alan', 'Ada']);
  });

  test('a lazy row waits for the drop', () => {
    render(<Dealt kit={LazyKeepStatic} columns={sized} rows={people} kinds={{gripped: true}}/>);

    lift('Ada');
    carryOver('Alan');
    expect(firstCells()).toEqual(['Ada', 'Grace', 'Alan']);

    drop();
    expect(firstCells()).toEqual(['Grace', 'Alan', 'Ada']);
  });

  test('a hiding row vanishes while it travels and returns on arrival', () => {
    render(<Dealt kit={EagerHideStatic} columns={sized} rows={people} kinds={{gripped: true}}/>);

    lift('Grace');
    [...rowOf('Grace').querySelectorAll('th, td')]
      .forEach(cell => expect(cell.classList).toContain('hide-across'));

    carryOver('Ada');
    drop();
    [...rowOf('Grace').querySelectorAll('th, td')]
      .forEach(cell => expect(cell.classList).not.toContain('hide-across'));
    expect(firstCells()).toEqual(['Grace', 'Ada', 'Alan']);
  });

  test('a row carried back without dropping comes home', () => {
    render(<Dealt kit={EagerKeepStatic} columns={sized} rows={people} kinds={{gripped: true}}/>);

    lift('Ada');
    carryOver('Grace');
    expect(firstCells()).toEqual(['Grace', 'Ada', 'Alan']);

    carryOver('Grace');
    drop();
    expect(firstCells()).toEqual(['Ada', 'Grace', 'Alan']);
  });

  test('the travelling ghost carries the whole row', () => {
    render(<Dealt kit={EagerKeepStatic} columns={sized} rows={people} kinds={{gripped: true}}/>);

    lift('Grace');

    const ghost = screen.getAllByRole('table', {hidden: true})[1];
    expect(ghost.querySelectorAll('tr')).toHaveLength(1);
    expect(ghost.textContent).toContain('Grace');
    expect(ghost.textContent).toContain('45');

    drop();
    expect(screen.getAllByRole('table')).toHaveLength(1);
  });

  test('the keyboard walks a row up and down', async () => {
    render(<Dealt kit={EagerKeepStatic} columns={sized} rows={people} kinds={{gripped: true}}/>);

    grip('Ada').focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(firstCells()).toEqual(['Grace', 'Ada', 'Alan']);
    await userEvent.keyboard('{ArrowDown}');
    expect(firstCells()).toEqual(['Grace', 'Alan', 'Ada']);
    await userEvent.keyboard('{ArrowDown}');
    expect(firstCells()).toEqual(['Grace', 'Alan', 'Ada']);
  });

  test('rows that arrive after the deal still walk and speak', async () => {
    const {rerender} = render(<Dealt kit={EagerKeepStatic} columns={sized} rows={[]} kinds={{gripped: true}}/>);
    rerender(<Dealt kit={EagerKeepStatic} columns={sized} rows={people} kinds={{gripped: true}}/>);

    grip('Ada').focus();
    await userEvent.keyboard('{ArrowDown}');

    expect(firstCells()).toEqual(['Grace', 'Ada', 'Alan']);
    expect(screen.getByRole('status')).toHaveTextContent('row moved to 2 of 3');
  });

  test('rows that arrive after the deal still walk on the animated table', async () => {
    const transition = vi.fn((update: () => void) => update());
    (document as {startViewTransition?: unknown}).startViewTransition = transition;
    try {
      const {rerender} = render(<Dealt kit={EagerKeepAnimated} columns={sized} rows={[]} kinds={{gripped: true}}/>);
      rerender(<Dealt kit={EagerKeepAnimated} columns={sized} rows={people} kinds={{gripped: true}}/>);

      grip('Ada').focus();
      await userEvent.keyboard('{ArrowDown}');

      expect(firstCells()).toEqual(['Grace', 'Ada', 'Alan']);
      expect(screen.getByRole('status')).toHaveTextContent('row moved to 2 of 3');
      expect(transition).toHaveBeenCalledTimes(1);
    } finally {
      delete (document as Partial<Document>).startViewTransition;
    }
  });

  test('rows that arrive after the deal still drag', () => {
    const {rerender} = render(<Dealt kit={EagerKeepStatic} columns={sized} rows={[]} kinds={{gripped: true}}/>);
    rerender(<Dealt kit={EagerKeepStatic} columns={sized} rows={people} kinds={{gripped: true}}/>);

    lift('Ada');
    carryOver('Alan');
    drop();

    expect(firstCells()).toEqual(['Grace', 'Alan', 'Ada']);
  });

  test('rows hold still without the opt-in', () => {
    render(<Dealt kit={EagerKeepStatic} columns={sized} rows={people}/>);

    expect(within(sourceTable()).queryByRole('button', {name: /move row/})).toBeNull();
  });

  test('a keyboard nudge says the move', async () => {
    render(<Dealt kit={EagerKeepStatic} columns={sized} rows={people} kinds={{gripped: true}}/>);

    grip('Ada').focus();
    await userEvent.keyboard('{ArrowDown}');

    expect(firstCells()).toEqual(['Grace', 'Ada', 'Alan']);
    expect(screen.getByRole('status')).toHaveTextContent('row moved to 2 of 3');
  });

  test('a dropped row says where it landed', () => {
    render(<Dealt kit={EagerKeepStatic} columns={sized} rows={people} kinds={{gripped: true}}/>);

    lift('Ada');
    carryOver('Alan');
    drop();

    expect(screen.getByRole('status')).toHaveTextContent('row moved to 3 of 3');
  });
});

describe('sort criteria menus', () => {
  const sized = [
    {display: 'name', column: 'name'},
    {display: 'age', column: 'age', sortable: true},
    {display: 'city', column: 'city', sortable: true}
  ];
  const people = [
    {name: {display: 'Ada'}, age: {display: '36', value: 36}, city: {display: 'London'}},
    {name: {display: 'Grace'}, age: {display: '45', value: 45}, city: {display: 'New York'}},
    {name: {display: 'Alan'}, age: {display: '41', value: 41}, city: {display: 'Manchester'}}
  ];
  const aged = (ada: number) => [
    {...people[0], age: {display: String(ada), value: ada}},
    people[1],
    people[2]
  ];

  const sourceTable = () => screen.getAllByRole('table')[0];
  const firstCells = () => within(within(sourceTable()).getAllByRole('rowgroup')[1])
    .getAllByRole('row').map(row => row.querySelector('th, td')?.textContent);
  const ageHeader = () => screen.getByRole('columnheader', {name: /^age/});
  const menuFor = (label: string) => {
    const toggle = screen.getByRole('button', {name: label});
    const target = toggle.getAttribute('popovertarget') ?? '';
    const menu = document.getElementById(target);
    if (!menu) throw new Error(`no menu for ${label}`);
    return menu;
  };

  test('a criterion chosen from the column menu rules the rows', async () => {
    render(<Dealt kit={EagerKeepStatic} columns={sized} rows={people} kinds={{sortable: true}}/>);

    await userEvent.click(within(menuFor('sort age')).getByText('descending'));

    expect(firstCells()).toEqual(['Grace', 'Alan', 'Ada']);
    expect(ageHeader()).toHaveAttribute('aria-sort', 'descending');
  });

  test('the rule keeps sorting as the values change', async () => {
    const {rerender} = render(<Dealt kit={EagerKeepStatic} columns={sized} rows={people} kinds={{sortable: true}}/>);

    await userEvent.click(within(menuFor('sort age')).getByText('ascending'));
    expect(firstCells()).toEqual(['Ada', 'Alan', 'Grace']);

    rerender(<Dealt kit={EagerKeepStatic} columns={sized} rows={aged(50)} kinds={{sortable: true}}/>);
    expect(firstCells()).toEqual(['Alan', 'Grace', 'Ada']);
  });

  test('as dealt restores the deal', async () => {
    render(<Dealt kit={EagerKeepStatic} columns={sized} rows={people} kinds={{sortable: true}}/>);

    await userEvent.click(within(menuFor('sort age')).getByText('descending'));
    await userEvent.click(within(menuFor('sort age')).getByText('as dealt'));

    expect(firstCells()).toEqual(['Ada', 'Grace', 'Alan']);
    expect(ageHeader()).not.toHaveAttribute('aria-sort');
  });

  test('a hand on a row ends the rule and keeps the standing order', async () => {
    const {rerender} = render(
      <Dealt kit={EagerKeepStatic} columns={sized} rows={people} kinds={{sortable: true, gripped: true}}/>);

    await userEvent.click(within(menuFor('sort age')).getByText('descending'));
    expect(firstCells()).toEqual(['Grace', 'Alan', 'Ada']);

    const grip = within(within(sourceTable()).getByText('Ada').closest('tr') as HTMLElement)
      .getByRole('button', {name: /move row/});
    grip.focus();
    await userEvent.keyboard('{ArrowUp}');

    expect(firstCells()).toEqual(['Grace', 'Ada', 'Alan']);
    expect(ageHeader()).not.toHaveAttribute('aria-sort');

    rerender(<Dealt kit={EagerKeepStatic} columns={sized} rows={aged(50)} kinds={{sortable: true, gripped: true}}/>);
    expect(firstCells()).toEqual(['Grace', 'Ada', 'Alan']);
  });

  test('the menu toggle never lifts the column', () => {
    render(<Dealt kit={EagerKeepStatic} columns={sized} rows={people} kinds={{sortable: true, draggable: true}}/>);

    fireEvent.pointerDown(screen.getByRole('button', {name: 'sort age'}), {clientX: 100, clientY: 50, pointerId: 1});

    expect(document.querySelector('.drag-surface')).toBeNull();
  });

  test('choosing a direction never lifts the column', async () => {
    render(<Dealt kit={EagerKeepStatic} columns={sized} rows={people} kinds={{sortable: true, draggable: true}}/>);

    await userEvent.click(within(menuFor('sort age')).getByText('descending'));

    expect(document.querySelector('.drag-surface')).toBeNull();
    expect(screen.getAllByRole('table')).toHaveLength(1);
  });

  test('a menu appears only where the column asks for one', () => {
    render(<Dealt kit={EagerKeepStatic} columns={sized} rows={people} kinds={{sortable: true, resizable: true}}/>);

    expect(screen.queryByRole('button', {name: 'sort name'})).toBeNull();
    expect(screen.getByRole('button', {name: 'sort age'})).toBeVisible();
    const contentOf = (name: string) => screen.getByRole('columnheader', {name: new RegExp(`^${name}`)})
      .querySelector('.header-cell-content');
    expect(contentOf('age')?.querySelector(':scope > .menu-toggle')).not.toBeNull();
    expect(contentOf('age')?.querySelector(':scope > .resize-handle')).not.toBeNull();
    expect(contentOf('name')?.querySelector(':scope > .menu-toggle')).toBeNull();
    expect(contentOf('name')?.querySelector(':scope > .resize-handle')).not.toBeNull();
  });

  test('no menus without the opt-in', () => {
    render(<Dealt kit={EagerKeepStatic} columns={sized} rows={people}/>);

    expect(screen.queryByRole('button', {name: /^sort/})).toBeNull();
  });
});

describe('animated moves', () => {
  const sized = [
    {display: 'name', column: 'name'},
    {display: 'age', column: 'age'}
  ];
  const people = [
    {name: {display: 'Ada'}, age: {display: '36'}},
    {name: {display: 'Grace'}, age: {display: '45'}}
  ];
  const spanned = (table: HTMLElement, spans: Record<string, number>) => {
    within(table).getAllByRole('columnheader').forEach(header => {
      const key = header.textContent?.trim().split('⇅')[0].trim() ?? '';
      header.getBoundingClientRect = () => ({
        left: 0, right: 0, top: 0, bottom: 0, width: spans[key] ?? 0, height: 0, x: 0, y: 0, toJSON: () => ({})
      });
    });
  };
  const firstCells = () => within(screen.getAllByRole('rowgroup')[1])
    .getAllByRole('row').map(row => row.querySelector('th, td')?.textContent);

  afterEach(() => {
    delete (document as {startViewTransition?: unknown}).startViewTransition;
  });

  test('arrow keys walk a column, and the platform draws the move', async () => {
    const four = [
      {display: 'name', column: 'name'},
      {display: 'age', column: 'age'},
      {display: 'city', column: 'city'},
      {display: 'job', column: 'job'}
    ];
    const crew = [{
      name: {display: 'Ada'}, age: {display: '36'}, city: {display: 'London'}, job: {display: 'Analyst'}
    }];
    const transitions: Array<() => void> = [];
    document.startViewTransition = (update: () => void) => {
      transitions.push(update);
      update();
      return {} as ViewTransition;
    };
    try {
      render(<Dealt kit={EagerKeepAnimated} columns={four} rows={crew} kinds={{draggable: true}}/>);
      const table = screen.getAllByRole('table')[0];
      const headerTexts = () => within(table).getAllByRole('columnheader')
        .map(head => head.textContent?.trim().split('\u21c5')[0].trim());

      const age = within(table).getByRole('columnheader', {name: /^age/});
      age.focus();
      await userEvent.keyboard('{ArrowRight}');

      expect(headerTexts()).toEqual(['name', 'city', 'age', 'job']);
      expect(transitions).toHaveLength(1);
      expect(age.style.viewTransitionName).toBe('header-age');
    } finally {
      delete (document as Partial<Document>).startViewTransition;
    }
  });

  test('an animated nudge settles through a view transition', async () => {
    const transition = vi.fn((update: () => void) => update());
    (document as {startViewTransition?: unknown}).startViewTransition = transition;
    render(<Dealt kit={EagerKeepAnimated} columns={sized} rows={people} kinds={{gripped: true}}/>);

    within(screen.getByText('Ada').closest('tr') as HTMLElement)
      .getByRole('button', {name: /move row/}).focus();
    await userEvent.keyboard('{ArrowDown}');

    expect(firstCells()).toEqual(['Grace', 'Ada']);
    expect(transition).toHaveBeenCalledTimes(1);
    expect((screen.getByText('Grace').closest('td, th') as HTMLElement).style.viewTransitionName).toBe('cell-1-name');
  });

  test('a static move never asks for a transition', async () => {
    const transition = vi.fn((update: () => void) => update());
    (document as {startViewTransition?: unknown}).startViewTransition = transition;
    render(<Dealt kit={EagerKeepStatic} columns={sized} rows={people} kinds={{gripped: true}}/>);

    within(screen.getByText('Ada').closest('tr') as HTMLElement)
      .getByRole('button', {name: /move row/}).focus();
    await userEvent.keyboard('{ArrowDown}');

    expect(transition).not.toHaveBeenCalled();
    expect(firstCells()).toEqual(['Grace', 'Ada']);
  });

  test('only a reseat glides: the lift, the drift and the drop write plainly', () => {
    const transition = vi.fn((update: () => void) => update());
    (document as {startViewTransition?: unknown}).startViewTransition = transition;
    const four = [...sized, {display: 'city', column: 'city'}, {display: 'job', column: 'job'}];
    const crew = people.map(person => ({...person, city: {display: 'London'}, job: {display: 'Analyst'}}));
    render(<Dealt kit={EagerKeepAnimated} columns={four} rows={crew} kinds={{draggable: true}}/>);
    const table = screen.getAllByRole('table')[0];
    table.getBoundingClientRect = () => ({
      left: 0, right: 640, top: 0, bottom: 80, width: 640, height: 80, x: 0, y: 0, toJSON: () => ({})
    });
    spanned(table, {name: 160, age: 160, city: 160, job: 160});
    const headerTexts = () => within(table).getAllByRole('columnheader')
      .map(head => head.textContent?.trim().split('\u21c5')[0].trim());
    const surface = () => document.querySelector('.drag-surface') as HTMLElement;

    fireEvent.pointerDown(within(table).getByRole('columnheader', {name: /^age/}), {clientX: 240, clientY: 40, pointerId: 1});
    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 250, clientY: 40, pointerId: 1});
    expect(transition).not.toHaveBeenCalled();

    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 440, clientY: 40, pointerId: 1});
    expect(headerTexts()).toEqual(['name', 'city', 'age', 'job']);
    expect(transition).toHaveBeenCalledTimes(1);

    fireEvent.pointerUp(surface(), {pointerId: 1});
    expect(document.querySelector('.drag-surface')).toBeNull();
    expect(transition).toHaveBeenCalledTimes(1);
  });

});
