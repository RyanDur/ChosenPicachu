import {nanoid} from 'nanoid';
import {faker} from '@faker-js/faker';
import {Column, Row} from '../../components/Table/types';
import {AddressInfo, User, UserInfo} from '../../components/UserInfo/types';
import {AICAllArt, AICArt} from '../../data/artGallery/aic/types';
import {
  HarvardAllArt,
  HarvardArt,
  HarvardInfo,
  HarvardPeople,
  HarvardSearch
} from '../../data/artGallery/harvard/types.js';
import {AllArt, Art} from '../../data/artGallery/types/response';
import {RIJKArtObject, RIJKSAllArt, RIJKSArt} from '../../data/artGallery/rijks/types';
import {AvatarGenerator} from 'random-avatar-generator';
import {toDate} from 'date-fns';

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

export const createUserInfo = (): UserInfo => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  dob: toDate(faker.date.birthdate().toISOString().split('T')[0])
});
export const createAddress = (): AddressInfo => ({
  city: faker.location.city(),
  state: faker.location.state({ abbreviated: true }),
  streetAddress: faker.location.street(),
  streetAddressTwo: faker.location.secondaryAddress(),
  zip: faker.location.zipCode()
});

const createDetails = (num = 10) => faker.lorem.sentences(randomNumberFromRange(2, num));
const generator = new AvatarGenerator();

export const createUser = (
  worksFromHome = false,
  address: () => AddressInfo = createAddress,
  info: () => UserInfo = createUserInfo
): User => {
  const homeAddress = address();
  return ({
    id: nanoid(),
    info: info(),
    friends: [],
    homeAddress,
    workAddress: worksFromHome ? homeAddress : address(),
    details: createDetails(),
    avatar: generator.generateRandomAvatar()
  });
};

export const users = [
  createUser(),
  createUser(true),
  createUser()
];

export const createRandomUsers = (num = randomNumberFromRange(3, 15)): User[] =>
  [...Array(num)].map(() => createUser(Math.random() > 0.5)
  );

export const pagination = {
  total: 1000,
  limit: 12,
  offset: 0,
  total_pages: 84,
  current_page: 1,
  next_url: faker.internet.url()
};

export const aicArtResponse: AICAllArt = {
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
  totalrecordsperquery: Math.floor(Math.random() * 10),
  totalrecords: Math.floor(Math.random() * 10000),
  pages: Math.floor(Math.random() * 1000),
  page: Math.floor(Math.random() * 10)
};

export const person = (): HarvardPeople => ({
  role: 'Artist',
  displayname: faker.lorem.word()
});

const harvardToPieceResponse = (_: unknown, index: number): HarvardArt => ({
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

export const harvardArtResponse: HarvardAllArt = {
  info,
  records: [...Array(info.totalrecordsperquery)].map(harvardToPieceResponse)
};
export const options: string[] = [faker.lorem.words(), faker.lorem.words(), faker.lorem.words()];
export const harvardArtOptions: HarvardSearch = {
  info,
  records: options.map(option => ({title: option}))
};
export const fromRIJKArtOptionsResponse: RIJKSAllArt = {
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

const rijkPieceResponse = (): RIJKArtObject => ({
  id: faker.lorem.words(),
  objectNumber: faker.lorem.word(),
  title: faker.lorem.words(),
  principalOrFirstMaker: faker.lorem.words(),
  longTitle: faker.lorem.words(),
  webImage: {
    url: faker.lorem.words()
  }
});
export const fromRIJKArtResponse: RIJKSAllArt = {
  count: Math.floor(Math.random() * 100) + 1,
  artObjects: [...Array(pagination.limit)].map(rijkPieceResponse)
};

export const fromRIJKToPiece = (piece: RIJKArtObject): Art => ({
  id: piece.objectNumber,
  title: piece.title,
  artistInfo: piece.longTitle,
  image: piece.webImage.url,
  altText: piece.longTitle
});

export const rijkArtObjectResponse: RIJKSArt = {
  artObject: rijkPieceResponse()
};

export const fromRIJKArt = (currentPage: number, limit: number): AllArt => ({
  pagination: {
    total: fromRIJKArtResponse.count,
    limit,
    totalPages: fromRIJKArtResponse.count / fromRIJKArtResponse.artObjects.length,
    currentPage
  },
  pieces: fromRIJKArtResponse.artObjects.map(fromRIJKToPiece)
});
