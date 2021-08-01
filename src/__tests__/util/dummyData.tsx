import {Column, Row} from '../../components/Table/types';
import React from 'react';
import faker from 'faker';
import {AddressInfo, User, UserInfo} from '../../components/UserInfo/types';
import {AvatarGenerator} from 'random-avatar-generator';
import {toISOWithoutTime} from '../../components/util';
import {Art} from '../../data/types';
import {nanoid} from 'nanoid';

export const randomNumberFromRange = (min: number, max = 6) => Math.floor(Math.random() * max) + min;

export const words = (num = 6) => faker.lorem.words(randomNumberFromRange(1, num));

export const column1Name = words();
export const column2Name = words();
export const column3Name = words();

export const column1Display = words();
export const column3Display = words();

export const row1Col0Value = words();

export const row0Col0Display = words();
export const row0Col1Display = words();

export const row0Col2Display = words();

export const row1Col1Display = words();
export const row1Col2Display = words();

export const row2Col0Display = words();
export const row2Col1Display = words();
export const row2Col2Display = words();

export const columns: Column[] = [
    {
        column: column1Name,
        display: <h2 data-testid="column1">{column1Display}</h2>,
        className: 'aClassName'
    },
    {display: column2Name, column: column2Name},
    {column: column3Name, display: column3Display},
];

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
    email: faker.internet.email(),
    dob: new Date(toISOWithoutTime(faker.date.past(Math.random() * 80)))
});
const createAddress = (): AddressInfo => ({
    city: faker.address.city(),
    state: faker.address.stateAbbr(),
    streetAddress: faker.address.streetName(),
    streetAddressTwo: faker.address.secondaryAddress(),
    zip: faker.address.zipCode()
});

const maybeCreateAddress = (): AddressInfo | undefined =>
    Math.random() < 0.5 ? undefined : createAddress();

const createDetails = (num = 10) => faker.lorem.sentences(randomNumberFromRange(2, num));
const generator = new AvatarGenerator();

const userInfo = (address?: AddressInfo, worksFromHome = false): UserInfo => {
    const homeAddress = createAddress();
    return ({
        user: createUser(),
        homeAddress,
        workAddress: worksFromHome ? homeAddress : address,
        details: createDetails(),
        avatar: generator.generateRandomAvatar()
    });
};

export const users = [
    userInfo(createAddress()),
    userInfo(createAddress(), true),
    userInfo(createAddress())
];

export const createRandomUsers = (num = randomNumberFromRange(3, 15)): UserInfo[] =>
    [...Array(num)].map(() => userInfo(maybeCreateAddress(), Math.random() > 0.5));

export const pagination = {
    total: 100,
    limit: randomNumberFromRange(10, 100),
    offset: 0,
    total_pages: 10,
    current_page: 1,
    next_url: faker.internet.url()
};
export const art: Art = {
    pagination: {
        total: pagination.total,
        limit: pagination.limit,
        offset: pagination.offset,
        totalPages: pagination.total_pages,
        currentPage: pagination.current_page,
        nextUrl: pagination.next_url
    },
    pieces: [...Array(pagination.limit)].map((a, index) => ({
        id: index,
        title: faker.lorem.sentence(),
        imageId: nanoid(),
        artistInfo: faker.lorem.sentence(),
        altText: faker.lorem.words(randomNumberFromRange(1))
    })),
    baseUrl: faker.internet.url()
};