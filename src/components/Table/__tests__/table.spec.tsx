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
  const headerTexts = () => within(sourceTable()).getAllByRole('columnheader').map(header => header.textContent);
  const header = (name: string) => within(sourceTable()).getByRole('columnheader', {name: new RegExp(`^${name}`)});

  afterEach(() => document.body.querySelector(':scope > table')?.remove());
  const drag = (name: string) => {
    fireEvent.mouseDown(header(name));
    fireEvent.dragStart(header(name));
  };

  test('an eager column follows the pointer as it crosses its neighbors', () => {
    render(<Table columns={sized} rows={people} draggableColumns="eager-move"/>);

    drag('age');
    fireEvent.dragOver(header('city'));

    expect(headerTexts()).toEqual(['name', 'city', 'age', 'job']);
    const cells = within(screen.getAllByRole('rowgroup')[1]).getAllByRole('cell');
    expect(cells.map(cell => cell.textContent)).toEqual(['Ada', 'London', '36', 'Analyst']);
  });

  test('a lazy column waits for the drop', () => {
    render(<Table columns={sized} rows={people} draggableColumns="lazy-move"/>);

    drag('age');
    fireEvent.dragOver(header('city'));
    expect(headerTexts()).toEqual(['name', 'age', 'city', 'job']);

    fireEvent.dragEnd(header('age'));
    expect(headerTexts()).toEqual(['name', 'city', 'age', 'job']);
  });

  test('a hiding column vanishes while it travels and returns on arrival', () => {
    render(<Table columns={sized} rows={people} draggableColumns="hide-eager-move"/>);

    drag('city');
    expect(header('city').classList).toContain('hide');
    within(screen.getAllByRole('rowgroup')[1]).getAllByRole('cell')
      .filter(cell => cell.textContent === 'London')
      .forEach(cell => expect(cell.classList).toContain('hide'));

    fireEvent.dragOver(header('age'));
    fireEvent.dragEnd(header('city'));
    expect(header('city').classList).not.toContain('hide');
    expect(headerTexts()).toEqual(['name', 'city', 'age', 'job']);
  });

  test('the first and last columns hold their posts', () => {
    render(<Table columns={sized} rows={people} draggableColumns="eager-move"/>);

    expect(header('name').classList).not.toContain('grabbable');
    expect(header('job').classList).not.toContain('grabbable');
    expect(header('age').classList).toContain('grabbable');

    drag('name');
    fireEvent.dragOver(header('city'));
    expect(headerTexts()).toEqual(['name', 'age', 'city', 'job']);

    drag('city');
    fireEvent.dragOver(header('name'));
    expect(headerTexts()).toEqual(['name', 'city', 'age', 'job']);
  });

  test('the travelling ghost carries the whole column', () => {
    render(<Table columns={sized} rows={people} draggableColumns="eager-move"/>);

    fireEvent.mouseDown(header('age'));
    const dataTransfer = {effectAllowed: '', setDragImage: vi.fn()};
    fireEvent.dragStart(header('age'), {dataTransfer});

    const ghost = document.body.querySelector(':scope > table');
    expect(ghost).not.toBeNull();
    expect([...(ghost?.children ?? [])].map(section => section.tagName)).toEqual(['THEAD', 'TBODY']);
    expect(ghost?.querySelectorAll('thead tr')).toHaveLength(1);
    expect(ghost?.querySelectorAll('tbody tr')).toHaveLength(1);
    expect(ghost?.textContent).toContain('age');
    expect(ghost?.textContent).toContain('36');
    expect(dataTransfer.setDragImage).toHaveBeenCalledWith(ghost, expect.any(Number), 16);

    fireEvent.dragEnd(header('age'));
    expect(document.body.querySelector(':scope > table')).toBeNull();
  });

  test('columns hold still without the opt-in', () => {
    render(<Table columns={sized} rows={people}/>);

    fireEvent.mouseDown(header('age'));
    fireEvent.dragStart(header('age'));
    fireEvent.dragOver(header('city'));
    fireEvent.dragEnd(header('age'));

    expect(headerTexts()).toEqual(['name', 'age', 'city', 'job']);
  });
});
