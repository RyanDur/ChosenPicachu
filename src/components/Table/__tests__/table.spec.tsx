import {act, fireEvent, render, screen} from '@testing-library/react';
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

describe('A Table', () => {
    const htmlTag = /<.*?>/g;
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
        act(() => {
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
    });

    test('should have columns', () => {
        const columnNames = screen.getAllByTestId('th')
            .map(header => header.innerHTML.replace(htmlTag, ''));

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
            const element = screen.getByTestId(`cell-${column}-${row}`);
            expect(element.innerHTML.replace(htmlTag, '')).toEqual(expected);
        });

    test('should be able to add more class names where needed', () => {
        const table = screen.getByTestId('table');
        expect(table.classList).toContain(tableClassName);

        expect(screen.getByTestId('thead').classList).toContain(theadClassName);

        const tbody = screen.getByTestId('tbody');
        expect(tbody.classList).toContain(tbodyClassName);
        expect(tbody.classList).toContain(tbodyClassName);

        const [header, ...body] = screen.getAllByTestId('tr');
        [header, ...body].forEach(tr => expect(tr.classList).toContain(trClassName));
        expect(header.classList).toContain(headerRowClassName);
        expect(header.classList).not.toContain(rowClassName);
        body.forEach(row => expect(row.classList).toContain(trClassName));
        body.forEach(row => expect(row.classList).not.toContain(headerRowClassName));

        const columns = screen.getAllByTestId('th');
        columns.forEach(column => expect(column.classList).toContain(thClassName));
        columns.forEach(column => expect(column.classList).toContain(thClassName));

        const [firstColumn, ...otherColumns] = columns;
        expect(firstColumn.classList).toContain('aClassName');
        otherColumns.forEach(column => expect(column.classList).not.toContain('aClassName'));

        const cells = screen.getAllByTestId(/cell/i);
        cells.forEach(cell => expect(cell.classList).toContain(tdClassName));
        cells.forEach(cell => expect(cell.classList).toContain(cellClassName));

        const cell = screen.getByTestId('cell-2-0');
        expect(cell.classList).toContain('aSingleClassName');
        const otherCells = screen.getAllByTestId(/cell/i).filter(cell => cell.dataset.testid !== 'cell-2-0');
        otherCells.forEach(cell => expect(cell.classList).not.toContain('aSingleClassName'));
    });

    test('should be able to add an id', () => {
        const table = screen.getByTestId('table');
        expect(table.id).toBe(tableId);
    });
});

describe('resizable columns', () => {
  const sized = [
    {display: 'name', column: 'name', width: 200},
    {display: 'age', column: 'age', width: 120}
  ];
  const people = [{name: {display: 'Ada'}, age: {display: '36'}}];

  test('a sized column renders at its width', () => {
    render(<Table columns={sized} rows={people}/>);

    expect(screen.getAllByTestId('th')[0]).toHaveStyle({width: '200px'});
    expect(screen.getAllByTestId('th')[1]).toHaveStyle({width: '120px'});
  });

  test('the keyboard widens and narrows a column', async () => {
    render(<Table columns={sized} rows={people}/>);

    const handle = screen.getByRole('separator', {name: 'resize name'});
    handle.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getAllByTestId('th')[0]).toHaveStyle({width: '216px'});
    expect(screen.getByRole('separator', {name: 'resize name'})).toHaveAttribute('aria-valuenow', '216');
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(screen.getAllByTestId('th')[0]).toHaveStyle({width: '184px'});
  });

  test('dragging the handle resizes the column', () => {
    render(<Table columns={sized} rows={people}/>);

    const handle = screen.getByRole('separator', {name: 'resize name'});
    fireEvent.pointerDown(handle, {clientX: 300, pointerId: 1});
    fireEvent.pointerMove(handle, {clientX: 340, pointerId: 1});
    fireEvent.pointerUp(handle, {pointerId: 1});

    expect(screen.getAllByTestId('th')[0]).toHaveStyle({width: '240px'});
  });

  test('columns without widths stay plain', () => {
    render(<Table columns={columns} rows={rows}/>);

    expect(screen.queryAllByRole('separator')).toHaveLength(0);
  });
});
