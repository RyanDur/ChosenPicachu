import {fireEvent, render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {DragSortableTable} from '../index';

describe('drag sortable columns', () => {
  const sized = [
    {display: 'name', column: 'name', width: 200},
    {display: 'age', column: 'age', width: 120},
    {display: 'city', column: 'city', width: 120},
    {display: 'job', column: 'job', width: 160}
  ];
  const people = [{
    name: {display: 'Ada'}, age: {display: '36'}, city: {display: 'London'}, job: {display: 'Analyst'}
  }];

  const sourceTable = () => screen.getAllByRole('table')[0];
  const ghostTable = () => screen.getAllByRole('table')[1];
  const surface = () => {
    const found = document.querySelector('.drag-surface');
    if (found === null) throw new Error('nothing is aloft');
    return found;
  };
  const headerTexts = () => within(sourceTable()).getAllByRole('columnheader').map(header => header.textContent);
  const header = (name: string) => within(sourceTable()).getByRole('columnheader', {name: new RegExp(`^${name}`)});
  const widths: Record<string, number> = {name: 200, age: 120, city: 120, job: 160};
  const charted = () => {
    sourceTable().getBoundingClientRect = () => ({
      left: 0, right: 600, top: 0, bottom: 200, width: 600, height: 200, x: 0, y: 0, toJSON: () => ({})
    });
  };
  let aloft = '';
  const lift = (name: string) => {
    aloft = name;
    charted();
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
    render(<DragSortableTable columns={sized} rows={people} draggableColumns="eager-move"/>);

    lift('age');
    carryOver('city');

    expect(headerTexts()).toEqual(['name', 'city', 'age', 'job']);
    const cells = within(within(sourceTable()).getAllByRole('rowgroup')[1]).getAllByRole('cell');
    expect(cells.map(cell => cell.textContent)).toEqual(['Ada', 'London', '36', 'Analyst']);
  });

  test('a lazy column waits for the drop', () => {
    render(<DragSortableTable columns={sized} rows={people} draggableColumns="lazy-move"/>);

    lift('age');
    carryOver('city');
    expect(headerTexts()).toEqual(['name', 'age', 'city', 'job']);

    drop();
    expect(headerTexts()).toEqual(['name', 'city', 'age', 'job']);
  });

  test('a hiding column vanishes while it travels and returns on arrival', () => {
    render(<DragSortableTable columns={sized} rows={people} draggableColumns="hide-eager-move"/>);

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
    render(<DragSortableTable columns={sized} rows={people} draggableColumns="eager-move"/>);

    lift('age');
    carryOver('city');
    expect(headerTexts()).toEqual(['name', 'city', 'age', 'job']);

    carryOver('city');
    expect(headerTexts()).toEqual(['name', 'age', 'city', 'job']);
    drop();
    expect(headerTexts()).toEqual(['name', 'age', 'city', 'job']);
  });

  test('a lazy column carried home lands nowhere', () => {
    render(<DragSortableTable columns={sized} rows={people} draggableColumns="lazy-move"/>);

    lift('age');
    carryOver('city');
    carryOver('age');
    drop();

    expect(headerTexts()).toEqual(['name', 'age', 'city', 'job']);
  });

  test('the switch waits for the inner half of the neighbor', () => {
    render(<DragSortableTable columns={sized} rows={people} draggableColumns="eager-move"/>);

    lift('age');
    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 332, clientY: 100, pointerId: 1});
    expect(headerTexts()).toEqual(['name', 'age', 'city', 'job']);

    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 356, clientY: 100, pointerId: 1});
    expect(headerTexts()).toEqual(['name', 'city', 'age', 'job']);
    drop();
  });

  test('a slim column reaches deeper into a wide neighbor before switching', () => {
    const stretched = [
      {display: 'name', column: 'name', width: 100},
      {display: 'slim', column: 'slim', width: 40},
      {display: 'wide', column: 'wide', width: 360},
      {display: 'job', column: 'job', width: 100}
    ];
    const person = [{
      name: {display: 'Ada'}, slim: {display: 'few'}, wide: {display: 'many'}, job: {display: 'Analyst'}
    }];
    render(<DragSortableTable columns={stretched} rows={person} draggableColumns="eager-move"/>);

    lift('slim');
    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 260, clientY: 100, pointerId: 1});
    expect(headerTexts()).toEqual(['name', 'slim', 'wide', 'job']);

    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 320, clientY: 100, pointerId: 1});
    expect(headerTexts()).toEqual(['name', 'wide', 'slim', 'job']);
    drop();
  });

  test('the first and last columns hold their posts', () => {
    render(<DragSortableTable columns={sized} rows={people} draggableColumns="eager-move"/>);

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
    render(<DragSortableTable columns={sized} rows={people} draggableColumns="eager-move"/>);

    lift('age');

    const ghost = ghostTable();
    expect([...ghost.children].map(section => section.tagName)).toEqual(['THEAD', 'TBODY']);
    expect(ghost.querySelectorAll('thead tr')).toHaveLength(1);
    expect(ghost.querySelectorAll('tbody tr')).toHaveLength(1);
    expect(ghost.textContent).toContain('age');
    expect(ghost.textContent).toContain('36');

    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 300, clientY: 200, pointerId: 1});
    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 320, clientY: 215, pointerId: 1});
    expect(ghost).toHaveStyle({transform: 'translate(20px, 15px)'});

    drop();
    expect(screen.getAllByRole('table')).toHaveLength(1);
  });

  test('columns hold still without the opt-in', () => {
    render(<DragSortableTable columns={sized} rows={people}/>);

    fireEvent.pointerDown(header('age'), {clientX: 100, clientY: 50, pointerId: 1});
    expect(document.querySelector('.drag-surface')).toBeNull();
    expect(headerTexts()).toEqual(['name', 'age', 'city', 'job']);
  });
});

describe('drag sortable rows', () => {
  const sized = [
    {display: 'name', column: 'name', width: 200},
    {display: 'age', column: 'age', width: 120}
  ];
  const people = [
    {name: {display: 'Ada'}, age: {display: '36'}},
    {name: {display: 'Grace'}, age: {display: '45'}},
    {name: {display: 'Alan'}, age: {display: '41'}}
  ];

  const sourceTable = () => screen.getAllByRole('table')[0];
  const surface = () => {
    const found = document.querySelector('.drag-surface');
    if (found === null) throw new Error('nothing is aloft');
    return found;
  };
  const firstCells = () => within(within(sourceTable()).getAllByRole('rowgroup')[1])
    .getAllByRole('row').map(row => within(row).getAllByRole('cell')[0].textContent);
  const rowOf = (person: string) => {
    const row = within(sourceTable()).getByText(person).closest('tr');
    if (row === null) throw new Error(`no row for ${person}`);
    return row;
  };
  const grip = (person: string) => within(rowOf(person)).getByRole('button', {name: /move row/});
  const charted = () => {
    sourceTable().getBoundingClientRect = () => ({
      left: 0, right: 400, top: 0, bottom: 160, width: 400, height: 160, x: 0, y: 0, toJSON: () => ({})
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
    charted();
    fireEvent.pointerDown(grip(person), {clientX: 100, clientY: 50, pointerId: 1});
  };
  const carryOver = (target: string) => {
    const cells = firstCells();
    const at = cells.indexOf(target);
    const past = at < cells.indexOf(aloft) ? 10 : 30;
    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 100, clientY: 40 + at * 40 + past, pointerId: 1});
  };
  const drop = () => fireEvent.pointerUp(surface(), {pointerId: 1});

  test('an eager row follows the pointer as it crosses its neighbors', () => {
    render(<DragSortableTable columns={sized} rows={people} draggableRows="eager-move"/>);

    lift('Ada');
    carryOver('Alan');

    expect(firstCells()).toEqual(['Grace', 'Alan', 'Ada']);
  });

  test('a lazy row waits for the drop', () => {
    render(<DragSortableTable columns={sized} rows={people} draggableRows="lazy-move"/>);

    lift('Ada');
    carryOver('Alan');
    expect(firstCells()).toEqual(['Ada', 'Grace', 'Alan']);

    drop();
    expect(firstCells()).toEqual(['Grace', 'Alan', 'Ada']);
  });

  test('a hiding row vanishes while it travels and returns on arrival', () => {
    render(<DragSortableTable columns={sized} rows={people} draggableRows="hide-eager-move"/>);

    lift('Grace');
    within(rowOf('Grace')).getAllByRole('cell')
      .forEach(cell => expect(cell.classList).toContain('hide-across'));

    carryOver('Ada');
    drop();
    within(rowOf('Grace')).getAllByRole('cell')
      .forEach(cell => expect(cell.classList).not.toContain('hide-across'));
    expect(firstCells()).toEqual(['Grace', 'Ada', 'Alan']);
  });

  test('a row carried back without dropping comes home', () => {
    render(<DragSortableTable columns={sized} rows={people} draggableRows="eager-move"/>);

    lift('Ada');
    carryOver('Grace');
    expect(firstCells()).toEqual(['Grace', 'Ada', 'Alan']);

    carryOver('Grace');
    drop();
    expect(firstCells()).toEqual(['Ada', 'Grace', 'Alan']);
  });

  test('the travelling ghost carries the whole row', () => {
    render(<DragSortableTable columns={sized} rows={people} draggableRows="eager-move"/>);

    lift('Grace');

    const ghost = screen.getAllByRole('table')[1];
    expect(ghost.querySelectorAll('tr')).toHaveLength(1);
    expect(ghost.textContent).toContain('Grace');
    expect(ghost.textContent).toContain('45');

    drop();
    expect(screen.getAllByRole('table')).toHaveLength(1);
  });

  test('the keyboard walks a row up and down', async () => {
    render(<DragSortableTable columns={sized} rows={people} draggableRows="eager-move"/>);

    grip('Ada').focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(firstCells()).toEqual(['Grace', 'Ada', 'Alan']);
    await userEvent.keyboard('{ArrowDown}');
    expect(firstCells()).toEqual(['Grace', 'Alan', 'Ada']);
    await userEvent.keyboard('{ArrowDown}');
    expect(firstCells()).toEqual(['Grace', 'Alan', 'Ada']);
  });

  test('rows hold still without the opt-in', () => {
    render(<DragSortableTable columns={sized} rows={people}/>);

    expect(within(sourceTable()).queryByRole('button', {name: /move row/})).toBeNull();
  });
});

describe('sort criteria menus', () => {
  const sized = [
    {display: 'name', column: 'name', width: 200},
    {display: 'age', column: 'age', width: 120},
    {display: 'city', column: 'city', width: 120}
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
    .getAllByRole('row').map(row => within(row).getAllByRole('cell')[0].textContent);
  const ageHeader = () => screen.getByRole('columnheader', {name: /^age/});
  const menuFor = (label: string) => {
    const toggle = screen.getByRole('button', {name: label});
    const target = toggle.getAttribute('popovertarget') ?? '';
    const menu = document.getElementById(target);
    if (menu === null) throw new Error(`no menu for ${label}`);
    return menu;
  };

  test('a criterion chosen from the column menu rules the rows', async () => {
    render(<DragSortableTable columns={sized} rows={people} sortable/>);

    await userEvent.click(within(menuFor('sort age')).getByText('descending'));

    expect(firstCells()).toEqual(['Grace', 'Alan', 'Ada']);
    expect(ageHeader()).toHaveAttribute('aria-sort', 'descending');
  });

  test('the rule keeps sorting as the values change', async () => {
    const {rerender} = render(<DragSortableTable columns={sized} rows={people} sortable/>);

    await userEvent.click(within(menuFor('sort age')).getByText('ascending'));
    expect(firstCells()).toEqual(['Ada', 'Alan', 'Grace']);

    rerender(<DragSortableTable columns={sized} rows={aged(50)} sortable/>);
    expect(firstCells()).toEqual(['Alan', 'Grace', 'Ada']);
  });

  test('as dealt restores the deal', async () => {
    render(<DragSortableTable columns={sized} rows={people} sortable/>);

    await userEvent.click(within(menuFor('sort age')).getByText('descending'));
    await userEvent.click(within(menuFor('sort age')).getByText('as dealt'));

    expect(firstCells()).toEqual(['Ada', 'Grace', 'Alan']);
    expect(ageHeader()).not.toHaveAttribute('aria-sort');
  });

  test('a hand on a row ends the rule and keeps the standing order', async () => {
    const {rerender} = render(
      <DragSortableTable columns={sized} rows={people} sortable draggableRows="eager-move"/>);

    await userEvent.click(within(menuFor('sort age')).getByText('descending'));
    expect(firstCells()).toEqual(['Grace', 'Alan', 'Ada']);

    const grip = within(within(sourceTable()).getByText('Ada').closest('tr') as HTMLElement)
      .getByRole('button', {name: /move row/});
    grip.focus();
    await userEvent.keyboard('{ArrowUp}');

    expect(firstCells()).toEqual(['Grace', 'Ada', 'Alan']);
    expect(ageHeader()).not.toHaveAttribute('aria-sort');

    rerender(<DragSortableTable columns={sized} rows={aged(50)} sortable draggableRows="eager-move"/>);
    expect(firstCells()).toEqual(['Grace', 'Ada', 'Alan']);
  });

  test('the menu toggle never lifts the column', () => {
    render(<DragSortableTable columns={sized} rows={people} sortable draggableColumns="eager-move"/>);

    fireEvent.pointerDown(screen.getByRole('button', {name: 'sort age'}), {clientX: 100, clientY: 50, pointerId: 1});

    expect(document.querySelector('.drag-surface')).toBeNull();
  });

  test('choosing a direction never lifts the column', async () => {
    render(<DragSortableTable columns={sized} rows={people} sortable draggableColumns="eager-move"/>);

    await userEvent.click(within(menuFor('sort age')).getByText('descending'));

    expect(document.querySelector('.drag-surface')).toBeNull();
    expect(screen.getAllByRole('table')).toHaveLength(1);
  });

  test('the first column keeps its own counsel', () => {
    render(<DragSortableTable columns={sized} rows={people} sortable/>);

    expect(screen.queryByRole('button', {name: 'sort name'})).toBeNull();
    expect(screen.getByRole('button', {name: 'sort age'})).toBeVisible();
  });

  test('no menus without the opt-in', () => {
    render(<DragSortableTable columns={sized} rows={people}/>);

    expect(screen.queryByRole('button', {name: /^sort/})).toBeNull();
  });
});

describe('animated moves', () => {
  const sized = [
    {display: 'name', column: 'name', width: 200},
    {display: 'age', column: 'age', width: 120}
  ];
  const people = [
    {name: {display: 'Ada'}, age: {display: '36'}},
    {name: {display: 'Grace'}, age: {display: '45'}}
  ];
  const firstCells = () => within(screen.getAllByRole('rowgroup')[1])
    .getAllByRole('row').map(row => within(row).getAllByRole('cell')[0].textContent);

  afterEach(() => {
    delete (document as {startViewTransition?: unknown}).startViewTransition;
  });

  test('an animated move travels through a view transition', async () => {
    const transition = vi.fn((update: () => void) => update());
    (document as {startViewTransition?: unknown}).startViewTransition = transition;
    render(<DragSortableTable columns={sized} rows={people} animated draggableRows="eager-move"/>);

    within(screen.getByText('Ada').closest('tr') as HTMLElement)
      .getByRole('button', {name: /move row/}).focus();
    await userEvent.keyboard('{ArrowDown}');

    expect(transition).toHaveBeenCalledTimes(1);
    expect(firstCells()).toEqual(['Grace', 'Ada']);
  });

  test('a static move never asks for a transition', async () => {
    const transition = vi.fn((update: () => void) => update());
    (document as {startViewTransition?: unknown}).startViewTransition = transition;
    render(<DragSortableTable columns={sized} rows={people} draggableRows="eager-move"/>);

    within(screen.getByText('Ada').closest('tr') as HTMLElement)
      .getByRole('button', {name: /move row/}).focus();
    await userEvent.keyboard('{ArrowDown}');

    expect(transition).not.toHaveBeenCalled();
    expect(firstCells()).toEqual(['Grace', 'Ada']);
  });

  test('an animated column swap opens a landing lane, not a transition', () => {
    const transition = vi.fn((update: () => void) => update());
    (document as {startViewTransition?: unknown}).startViewTransition = transition;
    const three = [
      {display: 'name', column: 'name', width: 200},
      {display: 'age', column: 'age', width: 120},
      {display: 'city', column: 'city', width: 120}
    ];
    const crew = [{name: {display: 'Ada'}, age: {display: '36'}, city: {display: 'London'}}];
    render(<DragSortableTable columns={three} rows={crew} animated draggableColumns="eager-move"/>);
    const table = screen.getAllByRole('table')[0];
    table.getBoundingClientRect = () => ({
      left: 0, right: 440, top: 0, bottom: 100, width: 440, height: 100, x: 0, y: 0, toJSON: () => ({})
    });

    fireEvent.pointerDown(within(table).getByRole('columnheader', {name: /^age/}), {clientX: 260, clientY: 20, pointerId: 1});
    const surface = document.querySelector('.drag-surface');
    if (surface === null) throw new Error('nothing is aloft');
    fireEvent.pointerMove(surface, {buttons: 1, clientX: 410, clientY: 50, pointerId: 1});

    const lane = document.querySelector('th.vacating');
    expect(lane).not.toBeNull();
    expect(within(table).getByRole('columnheader', {name: /^age/}).classList).toContain('landing');
    expect(transition).not.toHaveBeenCalled();

    fireEvent(lane as Element, new Event('transitionend', {bubbles: true}));
    expect(document.querySelector('th.vacating')).toBeNull();
  });

  test('an animated move still lands where the platform cannot glide', async () => {
    render(<DragSortableTable columns={sized} rows={people} animated draggableRows="eager-move"/>);

    within(screen.getByText('Ada').closest('tr') as HTMLElement)
      .getByRole('button', {name: /move row/}).focus();
    await userEvent.keyboard('{ArrowDown}');

    expect(firstCells()).toEqual(['Grace', 'Ada']);
  });
});
