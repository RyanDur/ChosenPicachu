import {Columns, Row} from '../../components/Table/types';
import React from 'react';
import faker from 'faker';
import {UserInfo} from '../../components/UserInfo/types';

export const column1Name = faker.lorem.words(Math.floor(Math.random() * 6) + 1);
export const column2Name = faker.lorem.words(Math.floor(Math.random() * 6) + 1);
export const column3Name = faker.lorem.words(Math.floor(Math.random() * 6) + 1);

export const column1Display = faker.lorem.words(Math.floor(Math.random() * 6) + 1);
export const column3Display = faker.lorem.words(Math.floor(Math.random() * 6) + 1);

export const row0Col0Value = faker.lorem.words(Math.floor(Math.random() * 6) + 1);

export const row1Col0Value = faker.lorem.words(Math.floor(Math.random() * 6) + 1);

export const row0Col0Display = faker.lorem.words(Math.floor(Math.random() * 6) + 1);
export const row0Col1Display = faker.lorem.words(Math.floor(Math.random() * 6) + 1);

export const row0Col2Display = faker.lorem.words(Math.floor(Math.random() * 6) + 1);

export const row1Col1Display = faker.lorem.words(Math.floor(Math.random() * 6) + 1);
export const row1Col2Display = faker.lorem.words(Math.floor(Math.random() * 6) + 1);

export const row2Col0Display = faker.lorem.words(Math.floor(Math.random() * 6) + 1);
export const row2Col1Display = faker.lorem.words(Math.floor(Math.random() * 6) + 1);
export const row2Col2Display = faker.lorem.words(Math.floor(Math.random() * 6) + 1);

export const columns: Columns = {
    [column1Name]: {
        key: column1Name,
        display: <h2 data-testid="column1">{column1Display}</h2>,
        className: 'aClassName'
    },
    [column2Name]: {display: column2Name, key: column2Name},
    [column3Name]: {key: column3Name, display: column3Display},
};

export const rows: Row[] = [{
    [column1Name]: {
        display: <h3>{row0Col0Display}</h3>
    },
    [column2Name]: {
        display: <h3>{row0Col1Display}</h3>
    },
    [column3Name]: {
        display: row0Col2Display,
        className: 'aSingleClassName'
    },
}, {
    [column1Name]: {
        display: row1Col0Value,
    },
    [column2Name]: {
        display: <h3>{row1Col1Display}</h3>
    },
    [column3Name]: {
        display: <h3>{row1Col2Display}</h3>
    }
}, {
    [column1Name]: {
        display: row2Col0Display
    },
    [column2Name]: {
        display: <h3>{row2Col1Display}</h3>
    },
    [column3Name]: {
        display: <h3>{row2Col2Display}</h3>
    }
}, {
    [column1Name]: {
        display: faker.lorem.word()
    },
    [column2Name]: {
        display: <h3>{faker.lorem.word()}</h3>
    },
    [column3Name]: {
        display: <h3>{faker.lorem.word()}</h3>
    }
}, {
    [column1Name]: {
        display: faker.lorem.word()
    },
    [column2Name]: {
        display: <h3>{faker.lorem.word()}</h3>
    },
    [column3Name]: {
        display: <h3>{faker.lorem.word()}</h3>
    }
}, {
    [column1Name]: {
        display: faker.lorem.word()
    },
    [column2Name]: {
        display: <h3>{faker.lorem.word()}</h3>
    },
    [column3Name]: {
        display: <h3>{faker.lorem.word()}</h3>
    }
}, {
    [column1Name]: {
        display: faker.lorem.word()
    },
    [column2Name]: {
        display: <h3>{faker.lorem.word()}</h3>
    },
    [column3Name]: {
        display: <h3>{faker.lorem.word()}</h3>
    }
}];

export const user = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email()
};

export const homeAddress = {
    city: faker.address.city(),
    state: faker.address.stateAbbr(),
    streetAddress: faker.address.streetName(),
    streetAddressTwo: faker.address.secondaryAddress(),
    zip: faker.address.zipCode()
};

export const workAddress = {
    city: faker.address.city(),
    state: faker.address.stateAbbr(),
    streetAddress: faker.address.streetName(),
    streetAddressTwo: faker.address.secondaryAddress(),
    zip: faker.address.zipCode()
};

export const details = faker.lorem.sentences(Math.floor(Math.random() * 10) + 1);

export const anotherUser = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email()
};

export const anotherHomeAddress = {
    city: faker.address.city(),
    state: faker.address.stateAbbr(),
    streetAddress: faker.address.streetName(),
    streetAddressTwo: faker.address.secondaryAddress(),
    zip: faker.address.zipCode()
};

export const anotherWorkAddress = anotherHomeAddress;

export const moreDetails = faker.lorem.sentences(Math.floor(Math.random() * 10) + 1);

export const yetAnotherUser = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email()
};

export const yetAnotherHomeAddress = {
    city: faker.address.city(),
    state: faker.address.stateAbbr(),
    streetAddress: faker.address.streetName(),
    streetAddressTwo: faker.address.secondaryAddress(),
    zip: faker.address.zipCode()
};

export const yetAnotherWorkAddress = anotherHomeAddress;

export const yetMoreDetails = faker.lorem.sentences(Math.floor(Math.random() * 10) + 1);

export const users: UserInfo[] = [{
    user,
    homeAddress,
    workAddress,
    details
}, {
    user: anotherUser,
    homeAddress: anotherHomeAddress,
    workAddress: anotherWorkAddress,
    details: moreDetails
}, {
    user: yetAnotherUser,
    homeAddress: yetAnotherHomeAddress,
    workAddress: yetAnotherWorkAddress,
    details: yetMoreDetails
}];
