import {nanoid} from 'nanoid';
import {faker} from '@faker-js/faker';
import {AICAllArtResponse, AICArt} from '@components/art-gallery/museums/aic/types';
import {
  HarvardAllArtResponse,
  HarvardArtResponse,
  HarvardInfo,
  HarvardPeople,
  HarvardSearchResponse
} from '@components/art-gallery/museums/harvard/types';
import {AllArt, Art} from '@components/art-gallery/museums/art';
import {VAMAllArtResponse, VAMArtResponse} from '@components/art-gallery/museums/vam/types';
import {
  ClevelandAllArtResponse,
  ClevelandArtResponse,
  ClevelandSearchResponse
} from '@components/art-gallery/museums/cleveland/types';
import {createUser} from '@components/Users/resource/usersApi';
import {defaultRecordLimit} from '@components/art-gallery/limits';
import {env} from '@env';

const randomNumberFromRange = (min: number, max = 6) => faker.number.int({min, max: min + max - 1});
export const words = (num = 6) => faker.lorem.words(randomNumberFromRange(1, num));

export const users = [
  createUser(),
  createUser(true),
  createUser()
];

export const pagination = {
  total: 997,
  limit: defaultRecordLimit,
  offset: 0,
  total_pages: 125,
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
  totalrecords: faker.number.int({max: 9999}),
  pages: faker.number.int({max: 999})
};

export const person = (): HarvardPeople => ({
  role: 'Artist',
  displayname: faker.lorem.word()
});

const harvardToPieceResponse = (_: unknown, index: number): HarvardArtResponse & { primaryimageurl: string } => ({
  id: index,
  title: index === 0 ? null : faker.lorem.sentence(),
  people: [person()],
  primaryimageurl: faker.internet.url()
});

export const harvardPieceResponse = harvardToPieceResponse(undefined, faker.number.int({max: 999}));

export const harvardPiece: Art = {
  id: String(harvardPieceResponse.id),
  title: harvardPieceResponse.title || 'Untitled',
  image: harvardPieceResponse.primaryimageurl,
  altText: harvardPieceResponse.title || 'Untitled',
  artistInfo: harvardPieceResponse.people?.[0].displayname || ''
};

const harvardRecords = [...Array(info.totalrecordsperquery)].map(harvardToPieceResponse);

export const harvardArtResponse: HarvardAllArtResponse = {
  info,
  records: harvardRecords
};
export const options: string[] = faker.helpers.uniqueArray(() => faker.lorem.words(), 3);
export const harvardArtOptions: HarvardSearchResponse = {
  info,
  records: options.map(option => ({title: option}))
};
const vamInfo = {record_count: 500, pages: 42, page: 1, page_size: defaultRecordLimit};
const vamSearchRecords = [...Array(vamInfo.page_size)].map((_, index) => ({
  systemNumber: `O${index}`,
  _primaryTitle: index === 0 ? '' : faker.lorem.words(),
  _primaryMaker: {name: faker.person.fullName()},
  _images: {_iiif_image_base_url: `https://framemark.vam.ac.uk/collections/${faker.lorem.word()}${index}/`}
}));
export const vamArtResponse: VAMAllArtResponse = {info: vamInfo, records: vamSearchRecords};
export const fromVAMArt: AllArt = {
  pagination: {
    total: vamInfo.record_count,
    limit: vamInfo.page_size,
    totalPages: vamInfo.pages,
  },
  pieces: vamSearchRecords.map(record => ({
    id: record.systemNumber,
    title: record._primaryTitle || 'Untitled',
    image: `${record._images._iiif_image_base_url}full/!800,800/0/default.jpg`,
    srcSet: [400, 800, 1200].map(size => `${record._images._iiif_image_base_url}full/!${size},${size}/0/default.jpg ${size}w`).join(', '),
    artistInfo: record._primaryMaker.name,
    altText: record._primaryTitle || 'Untitled'
  }))
};
const vamPieceRecord = {
  systemNumber: `O${randomNumberFromRange(1, 1000)}`,
  objectType: faker.lorem.word(),
  titles: [{title: faker.lorem.words()}],
  artistMakerPerson: [{name: {text: faker.person.fullName()}}],
  images: [faker.lorem.word()]
};
export const vamPieceResponse: VAMArtResponse = {record: vamPieceRecord};
export const fromVAMToPiece: Art = {
  id: vamPieceRecord.systemNumber,
  title: vamPieceRecord.titles[0].title,
  image: `https://framemark.vam.ac.uk/collections/${vamPieceRecord.images[0]}/full/!2000,2000/0/default.jpg`,
  artistInfo: vamPieceRecord.artistMakerPerson[0].name.text,
  altText: vamPieceRecord.titles[0].title
};
const vamOptionNumbers = faker.helpers.uniqueArray(() => faker.lorem.word(), options.length);
export const vamArtOptions: VAMAllArtResponse = {
  info: vamInfo,
  records: options.map((title, at) => ({systemNumber: vamOptionNumbers[at], _primaryTitle: title}))
};

export const fromAICArt: AllArt = {
  pagination: {
    total: aicArtResponse.pagination.total,
    limit: aicArtResponse.pagination.limit,
    totalPages: aicArtResponse.pagination.total_pages,
  },
  pieces: aicArtResponse.data.map(piece => ({
    id: String(piece.id),
    title: piece.title,
    image: `${env.aicPictures}/${piece.image_id}/full/800,/0/default.jpg`,
    srcSet: [400, 800, 1200].map(width => `${env.aicPictures}/${piece.image_id}/full/${width},/0/default.jpg ${width}w`).join(', '),
    artistInfo: piece.artist_display,
    altText: piece.term_titles.join(' ')
  }))
};
export const fromHarvardArt: AllArt = {
  pagination: {
    total: harvardArtResponse.info.totalrecords,
    limit: harvardArtResponse.info.totalrecordsperquery,
    totalPages: harvardArtResponse.info.pages,
  },
  pieces: harvardRecords.map(piece => ({
    id: String(piece.id),
    title: piece.title || 'Untitled',
    image: piece.primaryimageurl,
    artistInfo: piece.people?.[0].displayname || '',
    altText: piece.title || 'Untitled'
  }))
};


const clevelandRecords = [...Array(defaultRecordLimit)].map((_, index) => ({
  id: 1000 + index,
  title: faker.lorem.words(),
  creators: [{description: faker.person.fullName()}],
  tombstone: faker.lorem.sentence(),
  images: {
    web: {url: faker.internet.url(), width: '630', height: '893'},
    print: {url: faker.internet.url(), width: '2398', height: '3400'}
  }
}));
export const clevelandArtResponse: ClevelandAllArtResponse = {info: {total: 82}, data: clevelandRecords};
export const fromClevelandArt: AllArt = {
  pagination: {total: 82, limit: defaultRecordLimit, totalPages: Math.ceil(82 / defaultRecordLimit)},
  pieces: clevelandRecords.map(record => ({
    id: String(record.id),
    title: record.title,
    image: record.images.web.url,
    srcSet: `${record.images.web.url} 630w, ${record.images.print.url} 2398w`,
    artistInfo: record.creators[0].description,
    altText: record.title
  }))
};
const clevelandPieceRecord = {
  id: 94979,
  title: faker.lorem.words(),
  creators: [],
  tombstone: faker.lorem.sentence(),
  images: {web: {url: faker.internet.url(), width: '600', height: '400'}}
};
export const clevelandPieceResponse: ClevelandArtResponse = {data: clevelandPieceRecord};
export const fromClevelandToPiece: Art = {
  id: '94979',
  title: clevelandPieceRecord.title,
  image: clevelandPieceRecord.images.web.url,
  srcSet: `${clevelandPieceRecord.images.web.url} 600w`,
  artistInfo: clevelandPieceRecord.tombstone,
  altText: clevelandPieceRecord.title
};
export const clevelandArtOptions: ClevelandSearchResponse = {data: options.map(title => ({title}))};
