import {act, render, screen} from '@testing-library/react';
import {Table} from '../index';
import {Column, Row} from '../types';
import faker from 'faker';

describe('A Table', () => {
    const tableId = faker.lorem.word();
    const column1Name = faker.lorem.word();
    const column2Name = faker.lorem.word();
    const column3Name = faker.lorem.word();

    const column1Display = faker.lorem.word();
    const column3Display = faker.lorem.word();

    const row0Col0Value = faker.lorem.word();
    const row0Col1Value = faker.lorem.word();
    const row0Col2Value = faker.lorem.word();

    const row1Col0Value = faker.lorem.word();
    const row1Col1Value = faker.lorem.word();
    const row1Col2Value = faker.lorem.word();

    const row2Col0Value = faker.lorem.word();
    const row2Col1Value = faker.lorem.word();
    const row2Col2Value = faker.lorem.word();

    const row0Col0Display = faker.lorem.word();
    const row0Col1Display = faker.lorem.word();

    const row0Col2Display = faker.lorem.word();

    const row1Col1Display = faker.lorem.word();
    const row1Col2Display = faker.lorem.word();

    const row2Col0Display = faker.lorem.word();
    const row2Col1Display = faker.lorem.word();
    const row2Col2Display = faker.lorem.word();

    const columns: Column[] = [
        {name: column1Name, display: <h2 data-testid="column1">{column1Display}</h2>},
        {name: column2Name},
        {name: column3Name, display: column3Display},
    ];

    const rows: Row<string>[] = [{
        [column1Name]: {
            value: row0Col0Value,
            display: <h3>{row0Col0Display}</h3>
        },
        [column2Name]: {
            value: row0Col1Value,
            display: <h3>{row0Col1Display}</h3>
        },
        [column3Name]: {
            value: row0Col2Value,
            display: row0Col2Display
        }
    }, {
        [column1Name]: {
            value: row1Col0Value,
        },
        [column2Name]: {
            value: row1Col1Value,
            display: <h3>{row1Col1Display}</h3>
        },
        [column3Name]: {
            value: row1Col2Value,
            display: <h3>{row1Col2Display}</h3>
        }
    }, {
        [column1Name]: {
            value: row2Col0Value,
            display: row2Col0Display
        },
        [column2Name]: {
            value: row2Col1Value,
            display: <h3>{row2Col1Display}</h3>
        },
        [column3Name]: {
            value: row2Col2Value,
            display: <h3>{row2Col2Display}</h3>
        }
    }];

    const htmlTag = /<.*?>/g;

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