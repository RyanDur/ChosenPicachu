import {fireEvent, render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  EagerHideStaticTable, EagerKeepAnimatedTable, EagerKeepStaticTable, LazyKeepStaticTable
} from '../index';

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
    if (found === null) throw new Error('nothing is aloft');
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
    render(<EagerKeepStaticTable columns={sized} rows={people} draggableColumns/>);

    lift('age');
    carryOver('city');

    expect(headerTexts()).toEqual(['name', 'city', 'age', 'job']);
    const cells = within(within(sourceTable()).getAllByRole('rowgroup')[1]).getAllByRole('cell');
    expect(cells.map(cell => cell.textContent)).toEqual(['Ada', 'London', '36', 'Analyst']);
  });

  test('a lazy column waits for the drop', () => {
    render(<LazyKeepStaticTable columns={sized} rows={people} draggableColumns/>);

    lift('age');
    carryOver('city');
    expect(headerTexts()).toEqual(['name', 'age', 'city', 'job']);

    drop();
    expect(headerTexts()).toEqual(['name', 'city', 'age', 'job']);
  });

  test('a hiding column vanishes while it travels and returns on arrival', () => {
    render(<EagerHideStaticTable columns={sized} rows={people} draggableColumns/>);

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
    render(<EagerKeepStaticTable columns={sized} rows={people} draggableColumns/>);

    lift('age');
    carryOver('city');
    expect(headerTexts()).toEqual(['name', 'city', 'age', 'job']);

    carryOver('city');
    expect(headerTexts()).toEqual(['name', 'age', 'city', 'job']);
    drop();
    expect(headerTexts()).toEqual(['name', 'age', 'city', 'job']);
  });

  test('a lazy column carried home lands nowhere', () => {
    render(<LazyKeepStaticTable columns={sized} rows={people} draggableColumns/>);

    lift('age');
    carryOver('city');
    carryOver('age');
    drop();

    expect(headerTexts()).toEqual(['name', 'age', 'city', 'job']);
  });

  test('the switch waits for the inner half of the neighbor', () => {
    render(<EagerKeepStaticTable columns={sized} rows={people} draggableColumns/>);

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
    render(<EagerKeepStaticTable columns={stretched} rows={person} draggableColumns/>);

    lift('slim');
    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 260, clientY: 100, pointerId: 1});
    expect(headerTexts()).toEqual(['name', 'slim', 'wide', 'job']);

    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 320, clientY: 100, pointerId: 1});
    expect(headerTexts()).toEqual(['name', 'wide', 'slim', 'job']);
    drop();
  });

  test('the first and last columns hold their posts', () => {
    render(<EagerKeepStaticTable columns={sized} rows={people} draggableColumns/>);

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
    render(<EagerKeepStaticTable columns={sized} rows={people} draggableColumns/>);

    lift('age');

    const ghost = ghostTable();
    expect([...ghost.children].map(section => section.tagName)).toEqual(['THEAD', 'TBODY']);
    expect(ghost.querySelectorAll('thead tr')).toHaveLength(1);
    expect(ghost.querySelectorAll('tbody tr')).toHaveLength(1);
    expect(ghost.textContent).toContain('age');
    expect(ghost.textContent).toContain('36');

    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 300, clientY: 200, pointerId: 1});
    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 320, clientY: 215, pointerId: 1});
    expect(ghost.style.getPropertyValue('--drift-x')).toBe('20px');
    expect(ghost.style.getPropertyValue('--drift-y')).toBe('15px');

    drop();
    expect(screen.getAllByRole('table')).toHaveLength(1);
  });

  test('columns hold still without the opt-in', () => {
    render(<EagerKeepStaticTable columns={sized} rows={people}/>);

    fireEvent.pointerDown(header('age'), {clientX: 100, clientY: 50, pointerId: 1});
    expect(document.querySelector('.drag-surface')).toBeNull();
    expect(headerTexts()).toEqual(['name', 'age', 'city', 'job']);
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
    render(<EagerKeepStaticTable columns={sized} rows={people} draggableRows/>);

    lift('Grace');

    const ghost = document.querySelector('.column-ghost');
    if (ghost === null) throw new Error('no ghost is aloft');
    expect(ghost).toHaveAttribute('aria-hidden', 'true');
    expect(ghost.querySelector('.grip')).not.toBeNull();
    const [name, age] = [...ghost.querySelectorAll('td')];
    expect(name.style.getPropertyValue('--share')).toBe('62.5%');
    expect(age.style.getPropertyValue('--share')).toBe('37.5%');
    drop();
  });

  test('an eager row follows the pointer as it crosses its neighbors', () => {
    render(<EagerKeepStaticTable columns={sized} rows={people} draggableRows/>);

    lift('Ada');
    carryOver('Alan');

    expect(firstCells()).toEqual(['Grace', 'Alan', 'Ada']);
  });

  test('a lazy row waits for the drop', () => {
    render(<LazyKeepStaticTable columns={sized} rows={people} draggableRows/>);

    lift('Ada');
    carryOver('Alan');
    expect(firstCells()).toEqual(['Ada', 'Grace', 'Alan']);

    drop();
    expect(firstCells()).toEqual(['Grace', 'Alan', 'Ada']);
  });

  test('a hiding row vanishes while it travels and returns on arrival', () => {
    render(<EagerHideStaticTable columns={sized} rows={people} draggableRows/>);

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
    render(<EagerKeepStaticTable columns={sized} rows={people} draggableRows/>);

    lift('Ada');
    carryOver('Grace');
    expect(firstCells()).toEqual(['Grace', 'Ada', 'Alan']);

    carryOver('Grace');
    drop();
    expect(firstCells()).toEqual(['Ada', 'Grace', 'Alan']);
  });

  test('the travelling ghost carries the whole row', () => {
    render(<EagerKeepStaticTable columns={sized} rows={people} draggableRows/>);

    lift('Grace');

    const ghost = screen.getAllByRole('table', {hidden: true})[1];
    expect(ghost.querySelectorAll('tr')).toHaveLength(1);
    expect(ghost.textContent).toContain('Grace');
    expect(ghost.textContent).toContain('45');

    drop();
    expect(screen.getAllByRole('table')).toHaveLength(1);
  });

  test('the keyboard walks a row up and down', async () => {
    render(<EagerKeepStaticTable columns={sized} rows={people} draggableRows/>);

    grip('Ada').focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(firstCells()).toEqual(['Grace', 'Ada', 'Alan']);
    await userEvent.keyboard('{ArrowDown}');
    expect(firstCells()).toEqual(['Grace', 'Alan', 'Ada']);
    await userEvent.keyboard('{ArrowDown}');
    expect(firstCells()).toEqual(['Grace', 'Alan', 'Ada']);
  });

  test('rows hold still without the opt-in', () => {
    render(<EagerKeepStaticTable columns={sized} rows={people}/>);

    expect(within(sourceTable()).queryByRole('button', {name: /move row/})).toBeNull();
  });
});

describe('sort criteria menus', () => {
  const sized = [
    {display: 'name', column: 'name'},
    {display: 'age', column: 'age'},
    {display: 'city', column: 'city'}
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
    render(<EagerKeepStaticTable columns={sized} rows={people} sortable/>);

    await userEvent.click(within(menuFor('sort age')).getByText('descending'));

    expect(firstCells()).toEqual(['Grace', 'Alan', 'Ada']);
    expect(ageHeader()).toHaveAttribute('aria-sort', 'descending');
  });

  test('the rule keeps sorting as the values change', async () => {
    const {rerender} = render(<EagerKeepStaticTable columns={sized} rows={people} sortable/>);

    await userEvent.click(within(menuFor('sort age')).getByText('ascending'));
    expect(firstCells()).toEqual(['Ada', 'Alan', 'Grace']);

    rerender(<EagerKeepStaticTable columns={sized} rows={aged(50)} sortable/>);
    expect(firstCells()).toEqual(['Alan', 'Grace', 'Ada']);
  });

  test('as dealt restores the deal', async () => {
    render(<EagerKeepStaticTable columns={sized} rows={people} sortable/>);

    await userEvent.click(within(menuFor('sort age')).getByText('descending'));
    await userEvent.click(within(menuFor('sort age')).getByText('as dealt'));

    expect(firstCells()).toEqual(['Ada', 'Grace', 'Alan']);
    expect(ageHeader()).not.toHaveAttribute('aria-sort');
  });

  test('a hand on a row ends the rule and keeps the standing order', async () => {
    const {rerender} = render(
      <EagerKeepStaticTable columns={sized} rows={people} sortable draggableRows/>);

    await userEvent.click(within(menuFor('sort age')).getByText('descending'));
    expect(firstCells()).toEqual(['Grace', 'Alan', 'Ada']);

    const grip = within(within(sourceTable()).getByText('Ada').closest('tr') as HTMLElement)
      .getByRole('button', {name: /move row/});
    grip.focus();
    await userEvent.keyboard('{ArrowUp}');

    expect(firstCells()).toEqual(['Grace', 'Ada', 'Alan']);
    expect(ageHeader()).not.toHaveAttribute('aria-sort');

    rerender(<EagerKeepStaticTable columns={sized} rows={aged(50)} sortable draggableRows/>);
    expect(firstCells()).toEqual(['Grace', 'Ada', 'Alan']);
  });

  test('the menu toggle never lifts the column', () => {
    render(<EagerKeepStaticTable columns={sized} rows={people} sortable draggableColumns/>);

    fireEvent.pointerDown(screen.getByRole('button', {name: 'sort age'}), {clientX: 100, clientY: 50, pointerId: 1});

    expect(document.querySelector('.drag-surface')).toBeNull();
  });

  test('choosing a direction never lifts the column', async () => {
    render(<EagerKeepStaticTable columns={sized} rows={people} sortable draggableColumns/>);

    await userEvent.click(within(menuFor('sort age')).getByText('descending'));

    expect(document.querySelector('.drag-surface')).toBeNull();
    expect(screen.getAllByRole('table')).toHaveLength(1);
  });

  test('the first column keeps its own counsel', () => {
    render(<EagerKeepStaticTable columns={sized} rows={people} sortable/>);

    expect(screen.queryByRole('button', {name: 'sort name'})).toBeNull();
    expect(screen.getByRole('button', {name: 'sort age'})).toBeVisible();
  });

  test('no menus without the opt-in', () => {
    render(<EagerKeepStaticTable columns={sized} rows={people}/>);

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
    .getAllByRole('row').map(row => within(row).getAllByRole('cell')[0].textContent);

  afterEach(() => {
    delete (document as {startViewTransition?: unknown}).startViewTransition;
  });

  test('arrow keys walk a column, and both parties slide', async () => {
    const four = [
      {display: 'name', column: 'name'},
      {display: 'age', column: 'age'},
      {display: 'city', column: 'city'},
      {display: 'job', column: 'job'}
    ];
    const crew = [{
      name: {display: 'Ada'}, age: {display: '36'}, city: {display: 'London'}, job: {display: 'Analyst'}
    }];
    render(<EagerKeepAnimatedTable columns={four} rows={crew} draggableColumns/>);
    const table = screen.getAllByRole('table')[0];
    table.getBoundingClientRect = () => ({
      left: 0, right: 600, top: 0, bottom: 100, width: 600, height: 100, x: 0, y: 0, toJSON: () => ({})
    });
    spanned(table, {name: 200, age: 120, city: 120, job: 160});
    const headerTexts = () => within(table).getAllByRole('columnheader')
      .map(head => head.textContent?.trim().split('⇅')[0].trim());

    const age = within(table).getByRole('columnheader', {name: /^age/});
    age.focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(headerTexts()).toEqual(['name', 'city', 'age', 'job']);
    expect(within(table).getByRole('columnheader', {name: /^age/}).classList).toContain('displaced');
    expect(within(table).getByRole('columnheader', {name: /^age/})).toHaveStyle({'--toward': '-1'});
    expect(within(table).getByRole('columnheader', {name: /^age/})).toHaveStyle({'--carried': '120px'});
    expect(within(table).getByRole('columnheader', {name: /^city/}).classList).toContain('displaced');
    expect(within(table).getByRole('columnheader', {name: /^city/})).toHaveStyle({'--toward': '1'});
    expect(within(table).getByRole('columnheader', {name: /^city/})).toHaveStyle({'--carried': '120px'});

    await userEvent.keyboard('{ArrowLeft}');
    expect(headerTexts()).toEqual(['name', 'age', 'city', 'job']);
  });

  test('an animated nudge slides the displaced row, not a transition', async () => {
    const transition = vi.fn((update: () => void) => update());
    (document as {startViewTransition?: unknown}).startViewTransition = transition;
    render(<EagerKeepAnimatedTable columns={sized} rows={people} draggableRows/>);
    const table = screen.getAllByRole('table')[0];
    table.getBoundingClientRect = () => ({
      left: 0, right: 320, top: 0, bottom: 80, width: 320, height: 80, x: 0, y: 0, toJSON: () => ({})
    });
    within(within(table).getAllByRole('rowgroup')[1]).getAllByRole('row').forEach(row => {
      row.getBoundingClientRect = () => ({
        left: 0, right: 320, top: 0, bottom: 40, width: 320, height: 40, x: 0, y: 0, toJSON: () => ({})
      });
    });

    within(screen.getByText('Ada').closest('tr') as HTMLElement)
      .getByRole('button', {name: /move row/}).focus();
    await userEvent.keyboard('{ArrowDown}');

    expect(firstCells()).toEqual(['Grace', 'Ada']);
    const displaced = screen.getByText('Grace').closest('tr') as HTMLElement;
    expect(displaced.classList).toContain('shifted');
    expect(displaced).toHaveStyle({'--drop': '40px'});
    expect(transition).not.toHaveBeenCalled();

    for (const name of ['animationend', 'webkitAnimationEnd']) {
      fireEvent(displaced, Object.assign(new Event(name, {bubbles: true}), {animationName: 'shifted'}));
    }
    expect((screen.getByText('Grace').closest('tr') as HTMLElement).classList)
      .not.toContain('shifted');
  });

  test('a static move never asks for a transition', async () => {
    const transition = vi.fn((update: () => void) => update());
    (document as {startViewTransition?: unknown}).startViewTransition = transition;
    render(<EagerKeepStaticTable columns={sized} rows={people} draggableRows/>);

    within(screen.getByText('Ada').closest('tr') as HTMLElement)
      .getByRole('button', {name: /move row/}).focus();
    await userEvent.keyboard('{ArrowDown}');

    expect(transition).not.toHaveBeenCalled();
    expect(firstCells()).toEqual(['Grace', 'Ada']);
  });

  test('an animated swap slides the displaced column — theater, not layout', () => {
    const transition = vi.fn((update: () => void) => update());
    (document as {startViewTransition?: unknown}).startViewTransition = transition;
    const four = [
      {display: 'name', column: 'name'},
      {display: 'age', column: 'age'},
      {display: 'city', column: 'city'},
      {display: 'job', column: 'job'}
    ];
    const crew = [{
      name: {display: 'Ada'}, age: {display: '36'}, city: {display: 'London'}, job: {display: 'Analyst'}
    }];
    render(<EagerKeepAnimatedTable columns={four} rows={crew} draggableColumns/>);
    const table = screen.getAllByRole('table')[0];
    table.getBoundingClientRect = () => ({
      left: 0, right: 600, top: 0, bottom: 100, width: 600, height: 100, x: 0, y: 0, toJSON: () => ({})
    });
    spanned(table, {name: 200, age: 120, city: 120, job: 160});

    fireEvent.pointerDown(within(table).getByRole('columnheader', {name: /^age/}), {clientX: 260, clientY: 20, pointerId: 1});
    const surface = document.querySelector('.drag-surface');
    if (surface === null) throw new Error('nothing is aloft');
    fireEvent.pointerMove(surface, {buttons: 1, clientX: 410, clientY: 50, pointerId: 1});

    const displaced = within(table).getByRole('columnheader', {name: /^city/});
    expect(displaced.classList).toContain('displaced');
    expect(displaced).toHaveStyle({'--carried': '120px'});
    expect(transition).not.toHaveBeenCalled();

    for (const name of ['animationend', 'webkitAnimationEnd']) {
      fireEvent(displaced, Object.assign(new Event(name, {bubbles: true}), {animationName: 'displaced'}));
    }
    expect(within(table).getByRole('columnheader', {name: /^city/}).classList)
      .not.toContain('displaced');
  });

});
