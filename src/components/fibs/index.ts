// A few kilobytes of made-up data where a hundred kilobytes of library used to be.
// Deterministic under seed(), like the library it replaces, so laws can pin structure.

let next = Math.floor(Math.random() * 0xffffffff);

export const seed = (phrase: string): void => {
  let hash = 0x811c9dc5;
  for (let at = 0; at < phrase.length; at += 1) {
    hash = Math.imul(hash ^ phrase.charCodeAt(at), 0x01000193);
  }
  next = hash >>> 0;
};

const roll = (): number => {
  next = (next + 0x6d2b79f5) >>> 0;
  let mixed = Math.imul(next ^ (next >>> 15), 1 | next);
  mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
  return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
};

export const rand = <T>(pool: readonly T[]): T => pool[Math.floor(roll() * pool.length)];

export const randNumber = ({min, max}: {min: number; max: number}): number =>
  min + Math.floor(roll() * (max - min + 1));

export const randBetweenDate = ({from, to}: {from: Date; to: Date}): Date =>
  new Date(from.getTime() + roll() * (to.getTime() - from.getTime()));

const firstNames = ['Ada', 'Alan', 'Basil', 'Clara', 'Dora', 'Edsger', 'Elena', 'Felix', 'Grace', 'Hedy',
  'Igor', 'Iris', 'Jun', 'Kai', 'Lena', 'Marco', 'Nadia', 'Otto', 'Priya', 'Quinn',
  'Rosa', 'Sami', 'Tessa', 'Umar', 'Vera', 'Wren', 'Yuki', 'Zane'];

const lastNames = ['Alder', 'Barnes', 'Castell', 'Duarte', 'Egret', 'Fontaine', 'Grover', 'Hale', 'Ibarra', 'Jensen',
  'Katz', 'Lindgren', 'Mori', 'Novak', 'Okafor', 'Petrov', 'Quill', 'Reyes', 'Sato', 'Thorne',
  'Ueda', 'Vance', 'Whitfield', 'Ximenes', 'Young', 'Zeller'];

const cities = ['Ashford', 'Brookmere', 'Caldwell', 'Dunmore', 'Eastvale', 'Fernley', 'Graniteville', 'Harborton',
  'Inverness', 'Junction City', 'Kingsford', 'Lakewood', 'Maplewood', 'Northfield', 'Oakhurst', 'Pinecrest',
  'Quarry Bay', 'Ridgeline', 'Silverton', 'Thornbury', 'Umberland', 'Vista Grande', 'Westbrook', 'Yardley'];

const streets = ['Alder Lane', 'Birch Street', 'Cedar Avenue', 'Dogwood Drive', 'Elm Court', 'Foxglove Way',
  'Garnet Road', 'Hawthorn Place', 'Ironwood Trail', 'Juniper Boulevard', 'Kestrel Row', 'Laurel Crescent',
  'Magnolia Terrace', 'Nettle Path', 'Orchard Grove', 'Poplar Walk', 'Quince Street', 'Rowan Ridge',
  'Sycamore Close', 'Tamarack Bend', 'Vine Hollow', 'Willow Reach'];

const states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS',
  'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY',
  'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

const words = ['amber', 'anchor', 'basalt', 'beacon', 'briar', 'cairn', 'cedar', 'cinder', 'cobble', 'crest',
  'dapple', 'delta', 'drift', 'ember', 'fathom', 'fern', 'flint', 'garnet', 'glade', 'grove',
  'harbor', 'heather', 'hollow', 'inlet', 'juniper', 'keel', 'lantern', 'ledge', 'lichen', 'marrow',
  'meadow', 'mica', 'moss', 'north', 'oakum', 'onyx', 'pebble', 'pine', 'quarry', 'quill',
  'ridge', 'river', 'saddle', 'shale', 'slate', 'spruce', 'summit', 'thicket', 'timber', 'tundra',
  'umber', 'vale', 'willow', 'wren'];

const phrases = ['The quarterly numbers land on Thursday.',
  'A new exhibit opens in the west wing.',
  'The harbor bridge closes for repairs tonight.',
  'Volunteers wanted for the river cleanup.',
  'The night market returns this weekend.',
  'Storm watch lifted along the coast.',
  'Library hours extend through the summer.',
  'The ferry schedule changes on Monday.',
  'City council approves the greenway plan.',
  'The orchard festival sells out again.',
  'Trail crews reopen the ridge path.',
  'The observatory hosts a public viewing.'];

const catchPhrases = ['Sorted where you stand.',
  'Numbers that keep themselves.',
  'The order you meant.',
  'Live by the window.',
  'Every seat accounted for.',
  'Drag it like you mean it.',
  'The table that never sleeps.',
  'Fresh rows, no refresh.'];

const quotes = ['Simplicity is the whole of the craft.',
  'A small thing, well kept, outlasts a great thing neglected.',
  'The best measurement is the one you only take once.',
  'What moves should say where it came from.',
  'Order is a promise you keep in public.',
  'The quiet feature is the finished one.'];

export const news: readonly string[] = [...phrases, ...catchPhrases, ...quotes];

export const decked = <T,>(pool: readonly T[]): () => T => {
  let standing: T[] = [];
  return () => {
    if (standing.length === 0) {
      standing = [...pool].sort(() => roll() - 0.5);
    }
    const [top, ...rest] = standing;
    standing = rest;
    return top;
  };
};

export const randFirstName = (): string => rand(firstNames);
export const randLastName = (): string => rand(lastNames);
export const randCity = (): string => rand(cities);
export const randStreetName = (): string => rand(streets);
export const randStateAbbr = (): string => rand(states);
export const randZipCode = (): string => String(randNumber({min: 10000, max: 99999}));
export const randEmail = (): string =>
  `${rand(firstNames).toLowerCase()}.${rand(lastNames).toLowerCase()}@example.com`;
export const randWord = (): string => rand(words);

export const randSentence = (): string => {
  const length = randNumber({min: 6, max: 12});
  const [head, ...rest] = Array.from({length}, randWord);
  return `${head[0].toUpperCase()}${head.slice(1)} ${rest.join(' ')}.`;
};

export const randParagraph = (): string =>
  Array.from({length: randNumber({min: 3, max: 6})}, randSentence).join(' ');

export const randPhrase = (): string => rand(phrases);
export const randCatchPhrase = (): string => rand(catchPhrases);
export const randQuote = (): string => rand(quotes);
