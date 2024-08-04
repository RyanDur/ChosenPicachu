import {artGallery} from './artGallery';
import {AddressInfo, User, UserInfo} from '../components/UserInfo/types';
import {nanoid} from 'nanoid';
import {faker} from '@faker-js/faker';
import {AvatarGenerator} from 'random-avatar-generator';
import {users} from './users';
import {startOfDay} from 'date-fns';

const generator = new AvatarGenerator();

export const createUserInfo = (): UserInfo => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  dob: startOfDay(faker.date.birthdate())
});

export const createAddress = (): AddressInfo => ({
  city: faker.location.city(),
  state: faker.location.state({ abbreviated: true }),
  streetAddress: faker.location.street(),
  streetAddressTwo: faker.location.secondaryAddress(),
  zip: faker.location.zipCode()
});

const createDetails = (num = 10) => faker.lorem.sentences(randomNumberFromRange(2, num));

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

export const randomNumberFromRange = (min: number, max = 6) => Math.floor(Math.random() * max) + min;
const usersApi = users([
  ...Array(randomNumberFromRange(3, 15))].map(() => createUser(Math.random() > 0.5)
));

export const data = {
  artGallery,
  usersApi
};
