import {nanoid} from 'nanoid';
import {faker} from '@faker-js/faker';
import {Column, Row} from './components/Table/types';
import {AICAllArtResponse, AICArt} from './components/Gallery/resource/aic/types';
import {
  HarvardAllArtResponse,
  HarvardArtResponse,
  HarvardInfo,
  HarvardPeople,
  HarvardSearchResponse
} from './components/Gallery/resource/harvard/types';
import {AllArt, Art} from './components/Gallery/resource/types/response';
import {RIJKArtObjectResponse, RIJKSAllArtResponse, RIJKSArtResponse} from './components/Gallery/resource/rijks/types';
import {createUser} from './components/Users/resource/usersApi';
import {defaultRecordLimit} from './config';

const randomNumberFromRange = (min: number, max = 6) => Math.floor(Math.random() * max) + min;
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
  {column: column3Name, display: column3Display}
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
  }
}, {
  [column1Name]: {
    display: row1Col0Value
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

export const users = [
  createUser(),
  createUser(true),
  createUser()
];

export const pagination = {
  total: 1000,
  limit: defaultRecordLimit,
  offset: 0,
  total_pages: 84,
  current_page: 1,
  next_url: faker.internet.url()
};

export const aicArtResponse: AICAllArtResponse = {
  pagination,
  data: [...Array(pagination.limit)].map((_, index): AICArt => ({
    id: index,
    title: faker.lorem.sentence(),
    image_id: nanoid(),
    artist_display: faker.lorem.sentence(),
    term_titles: faker.lorem.words(randomNumberFromRange(1)).split(' ')
  }))
};

export const info: HarvardInfo = {
  totalrecordsperquery: defaultRecordLimit,
  totalrecords: Math.floor(Math.random() * 10000),
  pages: Math.floor(Math.random() * 1000),
  page: Math.floor(Math.random() * 10)
};

export const person = (): HarvardPeople => ({
  role: 'Artist',
  displayname: faker.lorem.word()
});

const harvardToPieceResponse = (_: unknown, index: number): HarvardArtResponse => ({
  id: index,
  title: faker.lorem.sentence(),
  people: [person()],
  primaryimageurl: faker.internet.url()
});

export const harvardPieceResponse = harvardToPieceResponse(undefined, Math.floor(Math.random() * 1000));

export const harvardPiece: Art = {
  id: String(harvardPieceResponse.id),
  title: harvardPieceResponse.title,
  image: harvardPieceResponse.primaryimageurl,
  altText: harvardPieceResponse.title,
  artistInfo: harvardPieceResponse.people?.[0].displayname || ''
};

export const harvardArtResponse: HarvardAllArtResponse = {
  info,
  records: [...Array(info.totalrecordsperquery)].map(harvardToPieceResponse)
};
export const options: string[] = [faker.lorem.words(), faker.lorem.words(), faker.lorem.words()];
export const harvardArtOptions: HarvardSearchResponse = {
  info,
  records: options.map(option => ({title: option}))
};
export const fromRIJKArtOptionsResponse: RIJKSAllArtResponse = {
  count: options.length,
  artObjects: options.map(title => ({
    id: faker.lorem.word(),
    objectNumber: faker.lorem.word(),
    title,
    longTitle: title,
    webImage: {url: faker.lorem.word()}
  }))
};

export const fromAICArt: AllArt = {
  pagination: {
    total: aicArtResponse.pagination.total,
    limit: aicArtResponse.pagination.limit,
    totalPages: aicArtResponse.pagination.total_pages,
    currentPage: aicArtResponse.pagination.current_page
  },
  pieces: aicArtResponse.data.map(piece => ({
    id: String(piece.id),
    title: piece.title,
    image: `https://www.artic.edu/iiif/2/${piece.image_id}/full/2000,/0/default.jpg`,
    artistInfo: piece.artist_display,
    altText: piece.term_titles.join(' ')
  }))
};
export const fromHarvardArt: AllArt = {
  pagination: {
    total: harvardArtResponse.info.totalrecords,
    limit: harvardArtResponse.info.totalrecordsperquery,
    totalPages: harvardArtResponse.info.pages,
    currentPage: harvardArtResponse.info.page
  },
  pieces: harvardArtResponse.records.map(piece => ({
    id: String(piece.id),
    title: piece.title,
    image: piece.primaryimageurl,
    artistInfo: piece.people?.[0].displayname || '',
    altText: piece.title
  }))
};

const rijkPieceResponse = (): RIJKArtObjectResponse => ({
  id: faker.lorem.words(),
  objectNumber: faker.lorem.word(),
  title: faker.lorem.words(),
  principalOrFirstMaker: faker.lorem.words(),
  longTitle: faker.lorem.words(),
  webImage: {
    url: faker.lorem.words()
  }
});
export const rIJKArtResponse: RIJKSAllArtResponse = {
  count: Math.floor(Math.random() * 100) + 1,
  artObjects: [...Array(pagination.limit)].map(rijkPieceResponse)
};

export const fromRIJKToPiece = (piece: RIJKArtObjectResponse): Art => ({
  id: piece.objectNumber,
  title: piece.title,
  artistInfo: piece.longTitle,
  image: piece.webImage.url,
  altText: piece.longTitle
});

export const rijkArtObjectResponse: RIJKSArtResponse = {
  artObject: rijkPieceResponse()
};

export const fromRIJKArt = (currentPage: number, limit: number): AllArt => ({
  pagination: {
    total: rIJKArtResponse.count,
    limit,
    totalPages: rIJKArtResponse.count / rIJKArtResponse.artObjects.length,
    currentPage
  },
  pieces: rIJKArtResponse.artObjects.map(fromRIJKToPiece)
});
