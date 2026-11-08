import {nanoid} from 'nanoid';
import {startOfDay} from 'date-fns';
import {AvatarGenerator} from 'random-avatar-generator';
import {Address, NewUser, User} from '@pages/Users/profile';

type Person = NewUser['person'];
import {
  rand,
  randBetweenDate,
  randCity,
  randEmail,
  randFirstName,
  randLastName,
  randNumber,
  randSentence,
  randStateAbbr,
  randStreetName,
  randZipCode
} from '@components/fibs';

export type Roster = readonly User[];

export const found = (roster: Roster, id: string): User | undefined => roster.find(user => user.id === id);

export const added = (roster: Roster, user: NewUser): Roster => [{...user, id: nanoid()}, ...roster];

export const befriended = (roster: Roster, user: User): Roster => {
  const friendIds = new Set(user.friends);
  return roster.map(known => {
    if (known.id === user.id) return {...user, friends: [...friendIds]};
    if (friendIds.has(known.id)) return {
      ...known,
      friends: known.friends.includes(user.id) ? known.friends : [...known.friends, user.id]
    };
    return {...known, friends: known.friends.filter(id => id !== user.id)};
  });
};

export const without = (roster: Roster, id: string): Roster =>
  roster
    .map(known => ({...known, friends: known.friends.filter(friend => friend !== id)}))
    .filter(known => known.id !== id);

const randomNumberFromRange = (min: number, max = 6) => randNumber({min, max: min + max - 1});
const generator = new AvatarGenerator();

const createDetails = (num = 10) =>
  Array.from({length: randomNumberFromRange(2, num)}, () => randSentence()).join(' ');

export const createPerson = (): Person => ({
  firstName: randFirstName(),
  lastName: randLastName(),
  email: randEmail(),
  dateOfBirth: startOfDay(randBetweenDate({
    from: new Date(1946, 0, 1),
    to: new Date(2006, 0, 1)
  }))
});

export const createAddress = (): Address => ({
  city: randCity(),
  state: randStateAbbr(),
  streetAddress: randStreetName(),
  streetAddressTwo: `Apt. ${randNumber({min: 1, max: 999})}`,
  zip: randZipCode()
});

export const createUser = (
  worksFromHome = false,
  address: () => Address = createAddress,
  person: () => Person = createPerson
): User => {
  const homeAddress = address();
  return ({
    id: nanoid(),
    person: person(),
    friends: [],
    homeAddress,
    work: worksFromHome ? 'home' : address(),
    details: createDetails(),
    avatar: generator.generateRandomAvatar()
  });
};

export const createRandomUsers = (num = randomNumberFromRange(3, 15)): User[] =>
  [...Array(num)].map(() => createUser(rand([true, false])));
