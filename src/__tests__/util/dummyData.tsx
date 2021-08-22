import {Column, Row} from '../../components/Table/types';
import React from 'react';
import faker from 'faker';
import {AddressInfo, User, UserInfo} from '../../components/UserInfo/types';
import {AvatarGenerator} from 'random-avatar-generator';
import {toISOWithoutTime} from '../../components/util';
import {
    AICArtResponse,
    AICPieceResponse,
    Art,
    HarvardArtResponse,
    InfoResponse, PeopleResponse, Piece,
    RecordResponse
} from '../../data/types';
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

export const aicArtResponse: AICArtResponse = {
    pagination,
    data: [...Array(pagination.limit)].map((a, index): AICPieceResponse => ({
        id: index,
        title: faker.lorem.sentence(),
        image_id: nanoid(),
        artist_display: faker.lorem.sentence(),
        term_titles: faker.lorem.words(randomNumberFromRange(1)).split(' ')
    })),
    info: {
        license_text: faker.lorem.sentence(),
        license_links: [faker.internet.url()],
        version: '1.1'
    },
    config: {
        iiif_url: faker.internet.url()
    }
};

const info: InfoResponse = {
    totalrecordsperquery: Math.floor(Math.random() * 10),
    totalrecords: Math.floor(Math.random() * 10000),
    pages: Math.floor(Math.random() * 1000),
    page: Math.floor(Math.random() * 10),
    next: faker.internet.url()
};

export const person = (): PeopleResponse => ({
    role: 'Artist',
    gender: faker.lorem.word(),
    displaydate: faker.lorem.word(),
    culture: faker.lorem.word(),
    displayname: faker.lorem.word(),
    alphasort: faker.lorem.word(),
    name: faker.lorem.word(),
    personid: Math.floor(Math.random() * 1000),
    displayorder: Math.floor(Math.random() * 1000),
});

const harvardToPieceResponse = (_: unknown, index: number): RecordResponse => ({
    id: index,
    title: faker.lorem.sentence(),
    people: [person()],
    primaryimageurl: faker.internet.url()
});

export const harvardPieceResponse = harvardToPieceResponse(undefined, Math.floor(Math.random() * 1000));

export const harvardPiece: Piece = {
    id: harvardPieceResponse.id,
    title: harvardPieceResponse.title,
    image: harvardPieceResponse.primaryimageurl,
    altText: harvardPieceResponse.title,
    artistInfo: harvardPieceResponse.people[0].displayname
};

export const harvardArtResponse: HarvardArtResponse = {
    info: info,
    records: [...Array(info.totalrecordsperquery)].map(harvardToPieceResponse),
};

export const fromAICArt: Art = {
    pagination: {
        total: aicArtResponse.pagination.total,
        limit: aicArtResponse.pagination.limit,
        offset: aicArtResponse.pagination.offset,
        totalPages: aicArtResponse.pagination.total_pages,
        currentPage: aicArtResponse.pagination.current_page,
        nextUrl: aicArtResponse.pagination.next_url
    },
    pieces: aicArtResponse.data.map(piece => ({
        id: piece.id,
        title: piece.title,
        image: `https://www.artic.edu/iiif/2/${piece.image_id}/full/2000,/0/default.jpg`,
        artistInfo: piece.artist_display,
        altText: piece.term_titles.join(' ')
    }))
};
export const fromHarvardArt: Art = {
    pagination: {
        total: harvardArtResponse.info.totalrecords,
        limit: harvardArtResponse.info.totalrecordsperquery,
        offset: harvardArtResponse.info.totalrecordsperquery * (harvardArtResponse.info.page - 1),
        totalPages: harvardArtResponse.info.pages,
        currentPage: harvardArtResponse.info.page,
        nextUrl: harvardArtResponse.info.next
    },
    pieces: harvardArtResponse.records.map(piece => ({
        id: piece.id,
        title: piece.title,
        image: piece.primaryimageurl,
        artistInfo: piece.people[0].displayname,
        altText: piece.title
    }))
};