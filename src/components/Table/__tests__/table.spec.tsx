import {fireEvent, render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Table} from '../index';
import {
    column1Display,
    column2Name,
    column3Display,
    columns,
    row0Col0Display,
    row0Col1Display,
    row0Col2Display,
    row1Col0Value,
    row1Col1Display,
    row1Col2Display,
    rows
} from './demoData';
import {faker} from '@faker-js/faker';

const cellAt = (column: number, row: number): HTMLElement => {
    const [, tbody] = screen.getAllByRole('rowgroup');
    return within(within(tbody).getAllByRole('row')[row]).getAllByRole('cell')[column];
};

describe('A Table', () => {
    const tableId = faker.lorem.word();
    const tableClassName = faker.lorem.word();
    const theadClassName = faker.lorem.word();
    const trClassName = faker.lorem.word();
    const thClassName = faker.lorem.word();
    const headerRowClassName = faker.lorem.word();
    const tbodyClassName = faker.lorem.word();
    const tdClassName = faker.lorem.word();
    const rowClassName = faker.lorem.word();
    const cellClassName = faker.lorem.word();

    beforeEach(() => {
        render(<Table
            columns={columns}
            rows={rows}
            id={tableId}
            tableClassName={tableClassName}
            theadClassName={theadClassName}
            trClassName={trClassName}
            thClassName={thClassName}
            tbodyClassName={tbodyClassName}
            tdClassName={tdClassName}
            headerRowClassName={headerRowClassName}
            rowClassName={rowClassName}
            cellClassName={cellClassName}
        />);
    });

    test('should have columns', () => {
        const columnNames = screen.getAllByRole('columnheader')
            .map(header => header.textContent);

        expect(columnNames.sort()).toEqual([column1Display, column2Name, column3Display].sort());
    });

    test.each`
    column | row  | expected
    ${0}   | ${0} | ${row0Col0Display}
    ${1}   | ${0} | ${row0Col1Display}
    ${2}   | ${0} | ${row0Col2Display}
    ${0}   | ${1} | ${row1Col0Value}
    ${1}   | ${1} | ${row1Col1Display}
    ${2}   | ${1} | ${row1Col2Display}
    `('should put the value "$expected" into cell ( column: $column,  row: $row )',
        ({column, row, expected}) => {
            expect(cellAt(column, row).textContent).toEqual(expected);
        });

    test('should be able to add more class names where needed', () => {
        const table = screen.getByRole('table');
        expect(table.classList).toContain(tableClassName);

        const [thead, tbody] = screen.getAllByRole('rowgroup');
        expect(thead.classList).toContain(theadClassName);
        expect(tbody.classList).toContain(tbodyClassName);

        const [header, ...body] = screen.getAllByRole('row');
        [header, ...body].forEach(tr => expect(tr.classList).toContain(trClassName));
        expect(header.classList).toContain(headerRowClassName);
        expect(header.classList).not.toContain(rowClassName);
        body.forEach(row => expect(row.classList).not.toContain(headerRowClassName));

        const columns = screen.getAllByRole('columnheader');
        columns.forEach(column => expect(column.classList).toContain(thClassName));

        const [firstColumn, ...otherColumns] = columns;
        expect(firstColumn.classList).toContain('aClassName');
        otherColumns.forEach(column => expect(column.classList).not.toContain('aClassName'));

        const cells = screen.getAllByRole('cell');
        cells.forEach(cell => expect(cell.classList).toContain(tdClassName));
        cells.forEach(cell => expect(cell.classList).toContain(cellClassName));

        const singled = cellAt(2, 0);
        expect(singled.classList).toContain('aSingleClassName');
        cells.filter(cell => cell !== singled)
            .forEach(cell => expect(cell.classList).not.toContain('aSingleClassName'));
    });

    test('should be able to add an id', () => {
        expect(screen.getByRole('table').id).toBe(tableId);
    });
});

describe('resizable columns', () => {
  const sized = [
    {display: 'name', column: 'name', width: 200},
    {display: 'age', column: 'age', width: 120}
  ];
  const people = [{name: {display: 'Ada'}, age: {display: '36'}}];

  const nameHeader = () => screen.getByRole('columnheader', {name: /^name/});
  const ageHeader = () => screen.getByRole('columnheader', {name: /^age/});

  test('sized columns share the container by their weights', () => {
    render(<Table columns={sized} rows={people}/>);

    expect(screen.getByRole('table').classList).toContain('apportioned');
    expect(nameHeader()).toHaveStyle({width: '62.5%'});
    expect(ageHeader()).toHaveStyle({width: '37.5%'});
  });

  test('the keyboard moves the boundary and the total holds', async () => {
    render(<Table columns={sized} rows={people}/>);

    const handle = screen.getByRole('separator', {name: 'resize name'});
    handle.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(nameHeader()).toHaveStyle({width: '64.5%'});
    expect(ageHeader()).toHaveStyle({width: '35.5%'});
    expect(screen.getByRole('separator', {name: 'resize name'})).toHaveAttribute('aria-valuenow', '65');
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(nameHeader()).toHaveStyle({width: '60.5%'});
    expect(ageHeader()).toHaveStyle({width: '39.5%'});
  });

  test('dragging the handle trades share between neighbors', () => {
    render(<Table columns={sized} rows={people}/>);
    const table = screen.getByRole('table');
    table.getBoundingClientRect = () => ({
      width: 1000, height: 0, x: 0, y: 0, top: 0, left: 0, right: 1000, bottom: 0, toJSON: () => ({})
    });

    const handle = screen.getByRole('separator', {name: 'resize name'});
    fireEvent.pointerDown(handle, {clientX: 300, pointerId: 1});
    fireEvent.pointerMove(handle, {clientX: 340, pointerId: 1});
    fireEvent.pointerUp(handle, {pointerId: 1});

    expect(nameHeader()).toHaveStyle({width: '66.5%'});
    expect(ageHeader()).toHaveStyle({width: '33.5%'});
  });

  test('a boundary can never starve a column', async () => {
    render(<Table columns={sized} rows={people}/>);

    const handle = screen.getByRole('separator', {name: 'resize age'});
    handle.focus();
    await userEvent.keyboard('{ArrowRight}'.repeat(30));
    expect(ageHeader()).toHaveStyle({width: '95%'});
    expect(nameHeader()).toHaveStyle({width: '5%'});
  });

  test('narrow columns truncate their values and clip their titles', () => {
    render(<Table columns={sized} rows={people}/>);

    expect(nameHeader().classList).toContain('clipped');
    within(screen.getAllByRole('rowgroup')[1]).getAllByRole('cell')
      .forEach(cell => expect(cell.classList).toContain('ellipsis'));
  });

  test('columns without widths stay plain', () => {
    render(<Table columns={columns} rows={rows}/>);

    expect(screen.queryAllByRole('separator')).toHaveLength(0);
    screen.getAllByRole('cell').forEach(cell => expect(cell.classList).not.toContain('ellipsis'));
  });
});

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
  const landable = (element: HTMLElement) => {
    element.getBoundingClientRect = () => ({
      left: 290, right: 310, top: 190, bottom: 210, width: 20, height: 20, x: 290, y: 190, toJSON: () => ({})
    });
  };
  const lift = (name: string) => fireEvent.pointerDown(header(name), {clientX: 100, clientY: 50, pointerId: 1});
  const carryOver = (target: string) => {
    landable(header(target));
    fireEvent.pointerMove(surface(), {clientX: 300, clientY: 200, pointerId: 1});
  };
  const drop = () => fireEvent.pointerUp(surface(), {pointerId: 1});

  test('an eager column follows the pointer as it crosses its neighbors', () => {
    render(<Table columns={sized} rows={people} draggableColumns="eager-move"/>);

    lift('age');
    carryOver('city');

    expect(headerTexts()).toEqual(['name', 'city', 'age', 'job']);
    const cells = within(within(sourceTable()).getAllByRole('rowgroup')[1]).getAllByRole('cell');
    expect(cells.map(cell => cell.textContent)).toEqual(['Ada', 'London', '36', 'Analyst']);
  });

  test('a lazy column waits for the drop', () => {
    render(<Table columns={sized} rows={people} draggableColumns="lazy-move"/>);

    lift('age');
    carryOver('city');
    expect(headerTexts()).toEqual(['name', 'age', 'city', 'job']);

    drop();
    expect(headerTexts()).toEqual(['name', 'city', 'age', 'job']);
  });

  test('a hiding column vanishes while it travels and returns on arrival', () => {
    render(<Table columns={sized} rows={people} draggableColumns="hide-eager-move"/>);

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

  test('the first and last columns hold their posts', () => {
    render(<Table columns={sized} rows={people} draggableColumns="eager-move"/>);

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
    render(<Table columns={sized} rows={people} draggableColumns="eager-move"/>);

    lift('age');

    const ghost = ghostTable();
    expect([...ghost.children].map(section => section.tagName)).toEqual(['THEAD', 'TBODY']);
    expect(ghost.querySelectorAll('thead tr')).toHaveLength(1);
    expect(ghost.querySelectorAll('tbody tr')).toHaveLength(1);
    expect(ghost.textContent).toContain('age');
    expect(ghost.textContent).toContain('36');

    fireEvent.pointerMove(surface(), {clientX: 300, clientY: 200, pointerId: 1});
    fireEvent.pointerMove(surface(), {clientX: 320, clientY: 215, pointerId: 1});
    expect(ghost).toHaveStyle({transform: 'translate(20px, 15px)'});

    drop();
    expect(screen.getAllByRole('table')).toHaveLength(1);
  });

  test('columns hold still without the opt-in', () => {
    render(<Table columns={sized} rows={people}/>);

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
  const landable = (element: HTMLElement) => {
    element.getBoundingClientRect = () => ({
      left: 90, right: 110, top: 190, bottom: 210, width: 20, height: 20, x: 90, y: 190, toJSON: () => ({})
    });
  };
  const lift = (person: string) =>
    fireEvent.pointerDown(grip(person), {clientX: 100, clientY: 50, pointerId: 1});
  const carryOver = (target: string) => {
    landable(rowOf(target));
    fireEvent.pointerMove(surface(), {clientX: 100, clientY: 200, pointerId: 1});
  };
  const drop = () => fireEvent.pointerUp(surface(), {pointerId: 1});

  test('an eager row follows the pointer as it crosses its neighbors', () => {
    render(<Table columns={sized} rows={people} draggableRows="eager-move"/>);

    lift('Ada');
    carryOver('Alan');

    expect(firstCells()).toEqual(['Grace', 'Alan', 'Ada']);
  });

  test('a lazy row waits for the drop', () => {
    render(<Table columns={sized} rows={people} draggableRows="lazy-move"/>);

    lift('Ada');
    carryOver('Alan');
    expect(firstCells()).toEqual(['Ada', 'Grace', 'Alan']);

    drop();
    expect(firstCells()).toEqual(['Grace', 'Alan', 'Ada']);
  });

  test('a hiding row vanishes while it travels and returns on arrival', () => {
    render(<Table columns={sized} rows={people} draggableRows="hide-eager-move"/>);

    lift('Grace');
    within(rowOf('Grace')).getAllByRole('cell')
      .forEach(cell => expect(cell.classList).toContain('hide-across'));

    carryOver('Ada');
    drop();
    within(rowOf('Grace')).getAllByRole('cell')
      .forEach(cell => expect(cell.classList).not.toContain('hide-across'));
    expect(firstCells()).toEqual(['Grace', 'Ada', 'Alan']);
  });

  test('the travelling ghost carries the whole row', () => {
    render(<Table columns={sized} rows={people} draggableRows="eager-move"/>);

    lift('Grace');

    const ghost = screen.getAllByRole('table')[1];
    expect(ghost.querySelectorAll('tr')).toHaveLength(1);
    expect(ghost.textContent).toContain('Grace');
    expect(ghost.textContent).toContain('45');

    drop();
    expect(screen.getAllByRole('table')).toHaveLength(1);
  });

  test('the keyboard walks a row up and down', async () => {
    render(<Table columns={sized} rows={people} draggableRows="eager-move"/>);

    grip('Ada').focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(firstCells()).toEqual(['Grace', 'Ada', 'Alan']);
    await userEvent.keyboard('{ArrowDown}');
    expect(firstCells()).toEqual(['Grace', 'Alan', 'Ada']);
    await userEvent.keyboard('{ArrowDown}');
    expect(firstCells()).toEqual(['Grace', 'Alan', 'Ada']);
  });

  test('rows hold still without the opt-in', () => {
    render(<Table columns={sized} rows={people}/>);

    expect(within(sourceTable()).queryByRole('button', {name: /move row/})).toBeNull();
  });
});
