import {act, render, screen} from '@testing-library/react';
import {Table} from '../index';
import faker from 'faker';
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
} from '../../../__tests__/util/dummyData';

describe('A Table', () => {
    const htmlTag = /<.*?>/g;
    const tableId = faker.lorem.word();
    const tableClassName = faker.lorem.word();
    const theadClassName = faker.lorem.word();
    const trClassName = faker.lorem.word();
    const thClassName = faker.lorem.word();
    const headerClassName = faker.lorem.word();
    const rowClassName = faker.lorem.word();
    const tdClassName = faker.lorem.word();

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
                headerClassName={headerClassName}
                rowClassName={rowClassName}
                tdClassName={tdClassName}
            />);
        });
    });

    test('should have columns', () => {
        const columnNames = screen.getAllByTestId('th')
            .map(header => header.innerHTML.replaceAll(htmlTag, ''));

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
            const element = screen.getByTestId(`column-${column}-row-${row}`);
            expect(element.innerHTML.replaceAll(htmlTag, '')).toEqual(expected);
        });

    test('should be able to add more class names where needed', () => {
        const table = screen.getByTestId('table');
        expect(table.classList.contains(tableClassName)).toBe(true);

        const thead = screen.getByTestId('thead');
        expect(thead.classList.contains(theadClassName)).toBe(true);
        expect(thead.classList.contains(headerClassName)).toBe(true);

        const trs = screen.getAllByTestId('tr');
        trs.forEach(tr => expect(tr.classList.contains(trClassName)).toBe(true));

        const IAmARow = trs;
        expect(IAmARow[0].classList.contains(rowClassName)).toBe(false);
        expect(IAmARow[1].classList.contains(rowClassName)).toBe(true);
        expect(IAmARow[2].classList.contains(rowClassName)).toBe(true);

        const columns = screen.getAllByTestId('th');
        columns.forEach(column => expect(column.classList.contains(thClassName)).toBe(true));

        const cells = screen.getAllByTestId(/column-\d-row-\d/);
        cells.forEach(cell => expect(cell.classList.contains(tdClassName)).toBe(true));
    });

    test('should be able to add an id', () => {
        const table = screen.getByTestId('table');
        expect(table.id).toBe(tableId);
    });
});