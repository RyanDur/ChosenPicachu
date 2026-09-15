import {faker} from '@faker-js/faker';
import {startOfDay} from 'date-fns';
import {AddressInfo, User} from '@components/Users/UserInfo/user';

type Traits = {
  readonly id?: string;
  readonly firstName?: string;
  readonly dob?: Date;
  readonly work?: 'home' | AddressInfo;
  readonly friends?: readonly string[];
};

export const anAddress = (): AddressInfo => ({
  streetAddress: faker.location.streetAddress(),
  streetAddressTwo: faker.location.secondaryAddress(),
  city: faker.location.city(),
  state: faker.location.state({abbreviated: true}),
  zip: faker.location.zipCode('#####')
});

export const aUser = ({
  id = faker.string.nanoid(),
  firstName = faker.person.firstName(),
  dob = startOfDay(faker.date.birthdate()),
  work = anAddress(),
  friends = []
}: Traits = {}): User => ({
  id,
  info: {firstName, lastName: faker.person.lastName(), email: faker.internet.email({firstName}), dob},
  friends: [...friends],
  homeAddress: anAddress(),
  work,
  details: faker.lorem.words(3),
  avatar: faker.image.avatar()
});

export const someUsers = [aUser(), aUser({work: 'home'}), aUser()];
