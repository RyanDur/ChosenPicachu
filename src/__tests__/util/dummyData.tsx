import {Column, Row} from '../../components/Table/types';
import React from 'react';
import faker from 'faker';

export const column1Name = faker.lorem.words(Math.floor(Math.random() * 6) + 1);
export const column2Name = faker.lorem.words(Math.floor(Math.random() * 6) + 1);
export const column3Name = faker.lorem.words(Math.floor(Math.random() * 6) + 1);

export const column1Display = faker.lorem.words(Math.floor(Math.random() * 6) + 1);
export const column3Display = faker.lorem.words(Math.floor(Math.random() * 6) + 1);

export const row0Col0Value = faker.lorem.words(Math.floor(Math.random() * 6) + 1);
export const row0Col1Value = faker.lorem.words(Math.floor(Math.random() * 6) + 1);
export const row0Col2Value = faker.lorem.words(Math.floor(Math.random() * 6) + 1);

export const row1Col0Value = faker.lorem.words(Math.floor(Math.random() * 6) + 1);
export const row1Col1Value = faker.lorem.words(Math.floor(Math.random() * 6) + 1);
export const row1Col2Value = faker.lorem.words(Math.floor(Math.random() * 6) + 1);

export const row2Col0Value = faker.lorem.words(Math.floor(Math.random() * 6) + 1);
export const row2Col1Value = faker.lorem.words(Math.floor(Math.random() * 6) + 1);
export const row2Col2Value = faker.lorem.words(Math.floor(Math.random() * 6) + 1);

export const row0Col0Display = faker.lorem.words(Math.floor(Math.random() * 6) + 1);
export const row0Col1Display = faker.lorem.words(Math.floor(Math.random() * 6) + 1);

export const row0Col2Display = faker.lorem.words(Math.floor(Math.random() * 6) + 1);

export const row1Col1Display = faker.lorem.words(Math.floor(Math.random() * 6) + 1);
export const row1Col2Display = faker.lorem.words(Math.floor(Math.random() * 6) + 1);

export const row2Col0Display = faker.lorem.words(Math.floor(Math.random() * 6) + 1);
export const row2Col1Display = faker.lorem.words(Math.floor(Math.random() * 6) + 1);
export const row2Col2Display = faker.lorem.words(Math.floor(Math.random() * 6) + 1);

export const columns: Column[] = [
    {name: column1Name, display: <h2 data-testid="column1">{column1Display}</h2>},
    {name: column2Name},
    {name: column3Name, display: column3Display},
];

export const rows: Row<string>[] = [{
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
}, {
    [column1Name]: {
        value: faker.lorem.word(),
        display: faker.lorem.word()
    },
    [column2Name]: {
        value: faker.lorem.word(),
        display: <h3>{faker.lorem.word()}</h3>
    },
    [column3Name]: {
        value: faker.lorem.word(),
        display: <h3>{faker.lorem.word()}</h3>
    }
}, {
    [column1Name]: {
        value: faker.lorem.word(),
        display: faker.lorem.word()
    },
    [column2Name]: {
        value: faker.lorem.word(),
        display: <h3>{faker.lorem.word()}</h3>
    },
    [column3Name]: {
        value: row2Col2Value,
        display: <h3>{faker.lorem.word()}</h3>
    }
}, {
    [column1Name]: {
        value: faker.lorem.word(),
        display: faker.lorem.word()
    },
    [column2Name]: {
        value: faker.lorem.word(),
        display: <h3>{faker.lorem.word()}</h3>
    },
    [column3Name]: {
        value: faker.lorem.word(),
        display: <h3>{faker.lorem.word()}</h3>
    }
}, {
    [column1Name]: {
        value: faker.lorem.word(),
        display: faker.lorem.word()
    },
    [column2Name]: {
        value: faker.lorem.word(),
        display: <h3>{faker.lorem.word()}</h3>
    },
    [column3Name]: {
        value: faker.lorem.word(),
        display: <h3>{faker.lorem.word()}</h3>
    }
}];