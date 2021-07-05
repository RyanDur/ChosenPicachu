import {Columns, Row} from '../../components/Table/types';
import React from 'react';
import faker from 'faker';
import {AddressInfo, User, UserInfo} from '../../components/UserInfo/types';
import {AvatarGenerator} from 'random-avatar-generator';

export const randomNumberFrom1 = (num = 6) => Math.floor(Math.random() * num) + 1;

export const words = (num = 6) => faker.lorem.words(randomNumberFrom1(num));

export const column1Name = words();
export const column2Name = words();
export const column3Name = words();

export const column1Display = words();
export const column3Display = words();

export const row0Col0Value = words();

export const row1Col0Value = words();

export const row0Col0Display = words();
export const row0Col1Display = words();

export const row0Col2Display = words();

export const row1Col1Display = words();
export const row1Col2Display = words();

export const row2Col0Display = words();
export const row2Col1Display = words();
export const row2Col2Display = words();

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

const createUser = (): User => ({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email()
});
const createAddress = (): AddressInfo => ({
    city: faker.address.city(),
    state: faker.address.stateAbbr(),
    streetAddress: faker.address.streetName(),
    streetAddressTwo: faker.address.secondaryAddress(),
    zip: faker.address.zipCode()
});
const createDetails = (num = 10) => faker.lorem.sentences(randomNumberFrom1(num));
const generator = new AvatarGenerator();

const userInfo = (worksFromHome = false): UserInfo => {
    const homeAddress = createAddress();
    return ({
        user: createUser(),
        homeAddress,
        workAddress: worksFromHome ? homeAddress : createAddress(),
        details: createDetails(),
        avatar: generator.generateRandomAvatar()
    });
};

export const users = [
    userInfo(),
    userInfo(true),
    userInfo()
];

export const createRandomUsers = (num = 3): UserInfo[] =>
    [...Array(num)].map(() => userInfo(Math.random() > 0.5));
